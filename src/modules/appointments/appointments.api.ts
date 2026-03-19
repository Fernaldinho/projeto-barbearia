import { supabase } from '@/lib/supabase'
import { isSlotAvailable, minutesToTime, timeToMinutes } from '@/lib/availability'
import type { Appointment, AppointmentFormData } from '@/types'

export async function getAppointments(companyId: string, date?: string): Promise<Appointment[]> {
  let query = supabase
    .from('appointments')
    .select('*, client:clients(*), service:services(*)')
    .eq('company_id', companyId)
    .order('date', { ascending: true })
    .order('start_time', { ascending: true })

  if (date) {
    query = query.eq('date', date)
  }

  const { data, error } = await query
  if (error) throw error
  return data || []
}

export async function createAppointment(
  companyId: string,
  formData: AppointmentFormData,
  serviceDuration: number
): Promise<Appointment> {
  // Calculate end_time from start_time + duration
  const startMin = timeToMinutes(formData.start_time)
  const endTime = minutesToTime(startMin + serviceDuration)

  // Validate availability before inserting
  const available = await isSlotAvailable(companyId, formData.date, formData.start_time, endTime)
  if (!available) {
    throw new Error('Este horário não está disponível. Pode haver conflito com outro agendamento, bloqueio ou horário fora do expediente.')
  }

  const { data, error } = await supabase
    .from('appointments')
    .insert({
      company_id: companyId,
      client_id: formData.client_id,
      service_id: formData.service_id,
      date: formData.date,
      start_time: formData.start_time,
      end_time: endTime,
      notes: formData.notes || null,
      status: 'scheduled',
    })
    .select('*, client:clients(*), service:services(*)')
    .single()

  if (error) throw error
  return data
}

export async function updateAppointment(
  companyId: string,
  id: string,
  formData: AppointmentFormData,
  serviceDuration: number
): Promise<Appointment> {
  const startMin = timeToMinutes(formData.start_time)
  const endTime = minutesToTime(startMin + serviceDuration)

  // For availability check, we need to exclude the current appointment
  // We'll check manually since isSlotAvailable doesn't support excludeId
  const { data: conflicts, error: conflictErr } = await supabase
    .from('appointments')
    .select('id')
    .eq('company_id', companyId)
    .eq('date', formData.date)
    .in('status', ['scheduled', 'confirmed'])
    .neq('id', id)
    .lt('start_time', endTime)
    .gt('end_time', formData.start_time)

  if (conflictErr) throw conflictErr
  if (conflicts && conflicts.length > 0) {
    throw new Error('Este horário conflita com outro agendamento existente.')
  }

  const { data, error } = await supabase
    .from('appointments')
    .update({
      client_id: formData.client_id,
      service_id: formData.service_id,
      date: formData.date,
      start_time: formData.start_time,
      end_time: endTime,
      notes: formData.notes || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select('*, client:clients(*), service:services(*)')
    .single()

  if (error) throw error
  return data
}

export async function updateAppointmentStatus(id: string, status: string): Promise<void> {
  const { error } = await supabase
    .from('appointments')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) throw error
}

export async function deleteAppointment(id: string): Promise<void> {
  const { error } = await supabase.from('appointments').delete().eq('id', id)
  if (error) throw error
}
