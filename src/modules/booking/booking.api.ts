import { supabase } from '@/lib/supabase'
import { isSlotAvailable, minutesToTime, timeToMinutes } from '@/lib/availability'
import type { Company, Service } from '@/types'

export async function getCompanyBySlug(slug: string): Promise<Company | null> {
  const { data, error } = await supabase
    .from('companies')
    .select('*')
    .eq('slug', slug)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function getActiveServices(companyId: string): Promise<Service[]> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('company_id', companyId)
    .eq('is_active', true)
    .order('name')

  if (error) throw error
  return data || []
}

export async function findOrCreateClient(
  companyId: string,
  name: string,
  phone: string,
  email?: string
): Promise<string> {
  // Try to find existing client by phone within the same company
  const { data: existing } = await supabase
    .from('clients')
    .select('id')
    .eq('company_id', companyId)
    .eq('phone', phone)
    .maybeSingle()

  if (existing) return existing.id

  // Create new client
  const { data: newClient, error } = await supabase
    .from('clients')
    .insert({
      company_id: companyId,
      name,
      phone,
      email: email || null,
    })
    .select('id')
    .single()

  if (error) throw error
  return newClient.id
}

export async function createPublicBooking(
  companyId: string,
  clientId: string,
  serviceId: string,
  date: string,
  startTime: string,
  serviceDuration: number,
  staffId?: string
): Promise<{ id: string }> {
  const endTime = minutesToTime(timeToMinutes(startTime) + serviceDuration)

  // Final availability check right before booking
  const available = await isSlotAvailable(companyId, date, startTime, endTime, staffId)
  if (!available) {
    throw new Error('Este horário não está mais disponível. Por favor, selecione outro horário.')
  }

  const { data, error } = await supabase
    .from('appointments')
    .insert({
      company_id: companyId,
      client_id: clientId,
      service_id: serviceId,
      staff_id: staffId || null,
      date,
      start_time: startTime,
      end_time: endTime,
      status: 'scheduled',
    })
    .select('id')
    .single()

  if (error) throw error
  return data
}
