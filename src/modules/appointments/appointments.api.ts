import { supabase } from '@/lib/supabase'
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

export async function createAppointment(companyId: string, formData: AppointmentFormData, serviceEndTime: string): Promise<Appointment> {
  const { data, error } = await supabase
    .from('appointments')
    .insert({
      ...formData,
      company_id: companyId,
      end_time: serviceEndTime,
      status: 'scheduled',
    })
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
