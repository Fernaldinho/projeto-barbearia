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

export async function checkDuplicatePhone(companyId: string, phone: string, excludeId?: string): Promise<boolean> {
  if (!phone) return false;
  
  let query = supabase
    .from('clients')
    .select('id')
    .eq('company_id', companyId)
    .eq('phone', phone)
    
  if (excludeId) {
    query = query.neq('id', excludeId)
  }

  const { data, error } = await query
  if (error) throw error
  return data && data.length > 0
}

export async function createClient(companyId: string, formData: ClientFormData): Promise<Client> {
  const isDuplicate = await checkDuplicatePhone(companyId, formData.phone)
  if (isDuplicate) throw new Error('Já existe um cliente com este telefone nesta empresa.')

  const { data, error } = await supabase
    .from('clients')
    .insert({ ...formData, company_id: companyId })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateClient(companyId: string, id: string, formData: Partial<ClientFormData>): Promise<Client> {
  if (formData.phone) {
    const isDuplicate = await checkDuplicatePhone(companyId, formData.phone, id)
    if (isDuplicate) throw new Error('Já existe um cliente com este telefone nesta empresa.')
  }

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
