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

/**
 * Converts "HH:mm" or "HH:mm:ss" to total minutes from midnight.
 */
function timeToMinutes(time: string): number {
  const parts = time.split(':')
  return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10)
}

/**
 * Converts total minutes from midnight to "HH:mm".
 */
function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`
}

/**
 * Checks if two time ranges overlap.
 * Uses the canonical overlap rule: (start1 < end2) AND (start2 < end1)
 */
function rangesOverlap(
  start1: string,
  end1: string,
  start2: string,
  end2: string
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

/**
 * Generates all possible time slots between the given business hours
 * start and end, stepped by durationMinutes.
 *
 * Example: generateRawSlots("09:00", "12:00", 30)
 *  => [{ start: "09:00", end: "09:30" }, { start: "09:30", end: "10:00" }, ...]
 */
function generateRawSlots(
  openTime: string,
  closeTime: string,
  durationMinutes: number
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
// Data fetching (single batch per call)
// ============================================

async function fetchBusinessHoursForDay(
  companyId: string,
  weekday: number
): Promise<BusinessHoursRow | null> {
  const { data, error } = await supabase
    .from('business_hours')
    .select('weekday, start_time, end_time')
    .eq('company_id', companyId)
    .eq('weekday', weekday)
    .maybeSingle()

  if (error) throw error
  return data
}

async function fetchAppointmentsForDate(
  companyId: string,
  date: string
): Promise<AppointmentRow[]> {
  const { data, error } = await supabase
    .from('appointments')
    .select('start_time, end_time, status')
    .eq('company_id', companyId)
    .eq('date', date)
    .in('status', ['scheduled', 'confirmed'])

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
// Main availability function
// ============================================

/**
 * Calculates available time slots for a given date and service.
 *
 * Steps:
 * 1. Fetch the service duration
 * 2. Determine the weekday from the date
 * 3. Fetch business hours for that weekday — if none, the day is closed
 * 4. Generate all possible time slots
 * 5. Fetch existing appointments and blocked times (in parallel)
 * 6. Filter out slots that overlap with any appointment or blocked time
 * 7. Return the list of available slots
 *
 * @param companyId  The company UUID
 * @param date       ISO date string "YYYY-MM-DD"
 * @param serviceId  The service UUID
 */
export async function getAvailableSlots(
  companyId: string,
  date: string,
  serviceId: string
): Promise<AvailabilityResult> {
  // 1. Get service duration
  const { duration, name: serviceName } = await fetchServiceDuration(serviceId)

  // 2. Get weekday (0 = Sunday, 6 = Saturday)
  const dateObj = new Date(date + 'T12:00:00') // Use noon to avoid timezone edge cases
  const weekday = dateObj.getDay()

  // 3. Get business hours for this weekday
  const businessHours = await fetchBusinessHoursForDay(companyId, weekday)

  if (!businessHours) {
    // Day is closed — no slots available
    return {
      date,
      weekday,
      is_open: false,
      slots: [],
      service_name: serviceName,
      service_duration: duration,
    }
  }

  // 4. Generate all possible time slots
  const openTime = businessHours.start_time.slice(0, 5)
  const closeTime = businessHours.end_time.slice(0, 5)
  const allSlots = generateRawSlots(openTime, closeTime, duration)

  // 5. Fetch appointments + blocked times in parallel
  const [appointments, blockedTimes] = await Promise.all([
    fetchAppointmentsForDate(companyId, date),
    fetchBlockedTimesForDate(companyId, date),
  ])

  // 6. Build a unified list of "occupied" time ranges
  const occupiedRanges: { start: string; end: string }[] = []

  for (const appt of appointments) {
    occupiedRanges.push({
      start: appt.start_time.slice(0, 5),
      end: appt.end_time.slice(0, 5),
    })
  }

  for (const blocked of blockedTimes) {
    occupiedRanges.push({
      start: blocked.start_time.slice(0, 5),
      end: blocked.end_time.slice(0, 5),
    })
  }

  // 7. Filter: keep only slots that do NOT overlap with any occupied range
  const availableSlots = allSlots.filter((slot) => {
    return !occupiedRanges.some((occupied) =>
      rangesOverlap(slot.start_time, slot.end_time, occupied.start, occupied.end)
    )
  })

  return {
    date,
    weekday,
    is_open: true,
    slots: availableSlots,
    service_name: serviceName,
    service_duration: duration,
  }
}

// ============================================
// Utility: check a single slot against all constraints
// ============================================

/**
 * Checks whether a specific time slot is available.
 * Useful for validating a booking before confirming it.
 */
export async function isSlotAvailable(
  companyId: string,
  date: string,
  startTime: string,
  endTime: string
): Promise<boolean> {
  // Check business hours
  const dateObj = new Date(date + 'T12:00:00')
  const weekday = dateObj.getDay()
  const businessHours = await fetchBusinessHoursForDay(companyId, weekday)

  if (!businessHours) return false

  const bhStart = businessHours.start_time.slice(0, 5)
  const bhEnd = businessHours.end_time.slice(0, 5)

  // Slot must be entirely within business hours
  if (timeToMinutes(startTime) < timeToMinutes(bhStart)) return false
  if (timeToMinutes(endTime) > timeToMinutes(bhEnd)) return false

  // Check conflicts in parallel
  const [appointments, blockedTimes] = await Promise.all([
    fetchAppointmentsForDate(companyId, date),
    fetchBlockedTimesForDate(companyId, date),
  ])

  // Check appointment overlaps
  for (const appt of appointments) {
    if (rangesOverlap(startTime, endTime, appt.start_time.slice(0, 5), appt.end_time.slice(0, 5))) {
      return false
    }
  }

  // Check blocked time overlaps
  for (const blocked of blockedTimes) {
    if (rangesOverlap(startTime, endTime, blocked.start_time.slice(0, 5), blocked.end_time.slice(0, 5))) {
      return false
    }
  }

  return true
}

// ============================================
// Exports for reuse
// ============================================

export { timeToMinutes, minutesToTime, rangesOverlap, generateRawSlots }
