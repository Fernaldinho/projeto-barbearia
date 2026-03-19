import { supabase } from '@/lib/supabase'
import type { BlockedTime } from '@/types'

export interface BlockedTimeFormData {
  date: string
  start_time: string
  end_time: string
  reason: string
}

export async function getBlockedTimes(companyId: string): Promise<BlockedTime[]> {
  const { data, error } = await supabase
    .from('blocked_times')
    .select('*')
    .eq('company_id', companyId)
    .order('date', { ascending: true })
    .order('start_time', { ascending: true })

  if (error) throw error
  return data || []
}

export async function checkOverlap(
  companyId: string,
  date: string,
  startTime: string,
  endTime: string,
  excludeId?: string
): Promise<boolean> {
  let query = supabase
    .from('blocked_times')
    .select('id')
    .eq('company_id', companyId)
    .eq('date', date)
    .lt('start_time', endTime)
    .gt('end_time', startTime)

  if (excludeId) {
    query = query.neq('id', excludeId)
  }

  const { data, error } = await query
  if (error) throw error
  return data !== null && data.length > 0
}

export async function createBlockedTime(
  companyId: string,
  formData: BlockedTimeFormData
): Promise<BlockedTime> {
  const overlaps = await checkOverlap(companyId, formData.date, formData.start_time, formData.end_time)
  if (overlaps) {
    throw new Error('Já existe um bloqueio que se sobrepõe a este horário nesta data.')
  }

  const { data, error } = await supabase
    .from('blocked_times')
    .insert({
      company_id: companyId,
      date: formData.date,
      start_time: formData.start_time,
      end_time: formData.end_time,
      reason: formData.reason || null,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateBlockedTime(
  companyId: string,
  id: string,
  formData: BlockedTimeFormData
): Promise<BlockedTime> {
  const overlaps = await checkOverlap(companyId, formData.date, formData.start_time, formData.end_time, id)
  if (overlaps) {
    throw new Error('Já existe um bloqueio que se sobrepõe a este horário nesta data.')
  }

  const { data, error } = await supabase
    .from('blocked_times')
    .update({
      date: formData.date,
      start_time: formData.start_time,
      end_time: formData.end_time,
      reason: formData.reason || null,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteBlockedTime(id: string): Promise<void> {
  const { error } = await supabase.from('blocked_times').delete().eq('id', id)
  if (error) throw error
}
