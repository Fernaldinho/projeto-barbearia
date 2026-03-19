import { supabase } from '@/lib/supabase'

// ============================================
// Types
// ============================================

export interface TimeSlot {
  start_time: string // "HH:mm"
  end_time: string   // "HH:mm"
}

export interface AvailabilityResult {
  date: string
  weekday: number
  is_open: boolean
  slots: TimeSlot[]
  service_name: string
  service_duration: number
}

interface BusinessHoursRow {
  weekday: number
  start_time: string
  end_time: string
}

interface AppointmentRow {
  start_time: string
  end_time: string
  status: string
}

interface BlockedTimeRow {
  start_time: string
  end_time: string
}

// ============================================
// Time helpers (pure functions, no side effects)
// ============================================

function timeToMinutes(time: string): number {
  const parts = time.split(':')
  return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10)
}

function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
}

function rangesOverlap(
  start1: string, end1: string,
  start2: string, end2: string
): boolean {
  const s1 = timeToMinutes(start1)
  const e1 = timeToMinutes(end1)
  const s2 = timeToMinutes(start2)
  const e2 = timeToMinutes(end2)
  return s1 < e2 && s2 < e1
}

// ============================================
// Slot generation
// ============================================

function generateRawSlots(
  openTime: string, closeTime: string, durationMinutes: number
): TimeSlot[] {
  const slots: TimeSlot[] = []
  const openMin = timeToMinutes(openTime)
  const closeMin = timeToMinutes(closeTime)
  let cursor = openMin
  while (cursor + durationMinutes <= closeMin) {
    slots.push({
      start_time: minutesToTime(cursor),
      end_time: minutesToTime(cursor + durationMinutes),
    })
    cursor += durationMinutes
  }
  return slots
}

// ============================================
// Data fetching (staff-aware)
// ============================================

/**
 * Fetches business hours for a given weekday.
 * If staffId is provided, looks for staff-specific hours first,
 * then falls back to company defaults (staff_id IS NULL).
 */
async function fetchBusinessHoursForDay(
  companyId: string,
  weekday: number,
  staffId?: string
): Promise<BusinessHoursRow | null> {
  if (staffId) {
    // Try staff-specific hours first
    const { data: staffHours } = await supabase
      .from('business_hours')
      .select('weekday, start_time, end_time')
      .eq('company_id', companyId)
      .eq('weekday', weekday)
      .eq('staff_id', staffId)
      .maybeSingle()
    if (staffHours) return staffHours
  }

  // Fall back to company defaults (staff_id IS NULL)
  const { data, error } = await supabase
    .from('business_hours')
    .select('weekday, start_time, end_time')
    .eq('company_id', companyId)
    .eq('weekday', weekday)
    .is('staff_id', null)
    .maybeSingle()

  if (error) throw error
  return data
}

/**
 * Fetches appointments for a date, optionally filtered by staff.
 */
async function fetchAppointmentsForDate(
  companyId: string,
  date: string,
  staffId?: string
): Promise<AppointmentRow[]> {
  let query = supabase
    .from('appointments')
    .select('start_time, end_time, status')
    .eq('company_id', companyId)
    .eq('date', date)
    .in('status', ['scheduled', 'confirmed'])

  if (staffId) {
    query = query.eq('staff_id', staffId)
  }

  const { data, error } = await query
  if (error) throw error
  return data || []
}

async function fetchBlockedTimesForDate(
  companyId: string,
  date: string
): Promise<BlockedTimeRow[]> {
  const { data, error } = await supabase
    .from('blocked_times')
    .select('start_time, end_time')
    .eq('company_id', companyId)
    .eq('date', date)

  if (error) throw error
  return data || []
}

async function fetchServiceDuration(
  serviceId: string
): Promise<{ duration: number; name: string }> {
  const { data, error } = await supabase
    .from('services')
    .select('duration, name')
    .eq('id', serviceId)
    .single()

  if (error) throw error
  return { duration: data.duration, name: data.name }
}

// ============================================
// Main availability function (staff-aware)
// ============================================

/**
 * Calculates available time slots for a given date, service, and optionally a staff member.
 *
 * @param companyId  The company UUID
 * @param date       ISO date string "YYYY-MM-DD"
 * @param serviceId  The service UUID
 * @param staffId    Optional staff UUID — filters business hours and appointments
 */
export async function getAvailableSlots(
  companyId: string,
  date: string,
  serviceId: string,
  staffId?: string
): Promise<AvailabilityResult> {
  const { duration, name: serviceName } = await fetchServiceDuration(serviceId)
  const dateObj = new Date(date + 'T12:00:00')
  const weekday = dateObj.getDay()

  // Business hours: staff-specific → company fallback
  const businessHours = await fetchBusinessHoursForDay(companyId, weekday, staffId)

  if (!businessHours) {
    return {
      date, weekday, is_open: false, slots: [],
      service_name: serviceName, service_duration: duration,
    }
  }

  const openTime = businessHours.start_time.slice(0, 5)
  const closeTime = businessHours.end_time.slice(0, 5)
  const allSlots = generateRawSlots(openTime, closeTime, duration)

  // Fetch appointments (scoped to staff if given) + blocked times in parallel
  const [appointments, blockedTimes] = await Promise.all([
    fetchAppointmentsForDate(companyId, date, staffId),
    fetchBlockedTimesForDate(companyId, date),
  ])

  const occupiedRanges: { start: string; end: string }[] = []
  for (const appt of appointments) {
    occupiedRanges.push({ start: appt.start_time.slice(0, 5), end: appt.end_time.slice(0, 5) })
  }
  for (const blocked of blockedTimes) {
    occupiedRanges.push({ start: blocked.start_time.slice(0, 5), end: blocked.end_time.slice(0, 5) })
  }

  const availableSlots = allSlots.filter((slot) =>
    !occupiedRanges.some((o) => rangesOverlap(slot.start_time, slot.end_time, o.start, o.end))
  )

  return {
    date, weekday, is_open: true, slots: availableSlots,
    service_name: serviceName, service_duration: duration,
  }
}

// ============================================
// Slot validation (staff-aware)
// ============================================

export async function isSlotAvailable(
  companyId: string,
  date: string,
  startTime: string,
  endTime: string,
  staffId?: string
): Promise<boolean> {
  const dateObj = new Date(date + 'T12:00:00')
  const weekday = dateObj.getDay()
  const businessHours = await fetchBusinessHoursForDay(companyId, weekday, staffId)

  if (!businessHours) return false

  const bhStart = businessHours.start_time.slice(0, 5)
  const bhEnd = businessHours.end_time.slice(0, 5)

  if (timeToMinutes(startTime) < timeToMinutes(bhStart)) return false
  if (timeToMinutes(endTime) > timeToMinutes(bhEnd)) return false

  const [appointments, blockedTimes] = await Promise.all([
    fetchAppointmentsForDate(companyId, date, staffId),
    fetchBlockedTimesForDate(companyId, date),
  ])

  for (const appt of appointments) {
    if (rangesOverlap(startTime, endTime, appt.start_time.slice(0, 5), appt.end_time.slice(0, 5))) return false
  }
  for (const blocked of blockedTimes) {
    if (rangesOverlap(startTime, endTime, blocked.start_time.slice(0, 5), blocked.end_time.slice(0, 5))) return false
  }

  return true
}

// ============================================
// Exports
// ============================================

export { timeToMinutes, minutesToTime, rangesOverlap, generateRawSlots }
