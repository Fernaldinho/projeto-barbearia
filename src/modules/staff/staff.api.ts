import { supabase } from '@/lib/supabase'
import type { Staff, StaffFormData } from '@/types'

export async function getStaff(companyId: string): Promise<Staff[]> {
  const { data, error } = await supabase
    .from('staff')
    .select('*')
    .eq('company_id', companyId)
    .order('name')

  if (error) throw error
  return data || []
}

export async function getActiveStaff(companyId: string): Promise<Staff[]> {
  const { data, error } = await supabase
    .from('staff')
    .select('*')
    .eq('company_id', companyId)
    .eq('active', true)
    .order('name')

  if (error) throw error
  return data || []
}

export async function createStaff(companyId: string, formData: StaffFormData): Promise<Staff> {
  const { data, error } = await supabase
    .from('staff')
    .insert({
      company_id: companyId,
      name: formData.name,
      role: formData.role || null,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateStaff(id: string, formData: StaffFormData): Promise<Staff> {
  const { data, error } = await supabase
    .from('staff')
    .update({
      name: formData.name,
      role: formData.role || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function toggleStaffActive(id: string, active: boolean): Promise<void> {
  const { error } = await supabase
    .from('staff')
    .update({ active, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) throw error
}

export async function deleteStaff(id: string): Promise<void> {
  const { error } = await supabase.from('staff').delete().eq('id', id)
  if (error) throw error
}
