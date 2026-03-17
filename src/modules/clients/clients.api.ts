import { supabase } from '@/lib/supabase'
import type { Client, ClientFormData } from '@/types'

export async function getClients(companyId: string): Promise<Client[]> {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('company_id', companyId)
    .order('name')

  if (error) throw error
  return data || []
}

export async function getClientById(id: string): Promise<Client | null> {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function createClient(companyId: string, formData: ClientFormData): Promise<Client> {
  const { data, error } = await supabase
    .from('clients')
    .insert({ ...formData, company_id: companyId })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateClient(id: string, formData: Partial<ClientFormData>): Promise<Client> {
  const { data, error } = await supabase
    .from('clients')
    .update({ ...formData, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteClient(id: string): Promise<void> {
  const { error } = await supabase.from('clients').delete().eq('id', id)
  if (error) throw error
}
