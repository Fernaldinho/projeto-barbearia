import { supabase } from '@/lib/supabase'
import type { Service, ServiceFormData } from '@/types'

export async function getServices(companyId: string): Promise<Service[]> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('company_id', companyId)
    .order('name')

  if (error) throw error
  return data || []
}

export async function getServiceById(id: string): Promise<Service | null> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function createService(companyId: string, formData: ServiceFormData): Promise<Service> {
  const { data, error } = await supabase
    .from('services')
    .insert({ ...formData, company_id: companyId })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateService(id: string, formData: Partial<ServiceFormData>): Promise<Service> {
  const { data, error } = await supabase
    .from('services')
    .update({ ...formData, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteService(id: string): Promise<void> {
  const { error } = await supabase.from('services').delete().eq('id', id)
  if (error) throw error
}
