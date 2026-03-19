import { supabase } from '@/lib/supabase'
import type { BusinessHours } from '@/types'

export async function getBusinessHours(companyId: string): Promise<BusinessHours[]> {
  const { data, error } = await supabase
    .from('business_hours')
    .select('*')
    .eq('company_id', companyId)
    .order('weekday')

  if (error) throw error
  return data || []
}

export async function upsertBusinessHours(
  companyId: string,
  weekday: number,
  startTime: string,
  endTime: string
): Promise<BusinessHours> {
  // Check if a record already exists for this company + weekday
  const { data: existing } = await supabase
    .from('business_hours')
    .select('id')
    .eq('company_id', companyId)
    .eq('weekday', weekday)
    .maybeSingle()

  if (existing) {
    // Update existing record
    const { data, error } = await supabase
      .from('business_hours')
      .update({ start_time: startTime, end_time: endTime })
      .eq('id', existing.id)
      .select()
      .single()

    if (error) throw error
    return data
  } else {
    // Insert new record
    const { data, error } = await supabase
      .from('business_hours')
      .insert({
        company_id: companyId,
        weekday,
        start_time: startTime,
        end_time: endTime,
      })
      .select()
      .single()

    if (error) throw error
    return data
  }
}

export async function deleteBusinessHoursByWeekday(
  companyId: string,
  weekday: number
): Promise<void> {
  const { error } = await supabase
    .from('business_hours')
    .delete()
    .eq('company_id', companyId)
    .eq('weekday', weekday)

  if (error) throw error
}

export async function saveAllBusinessHours(
  companyId: string,
  days: { weekday: number; enabled: boolean; start_time: string; end_time: string }[]
): Promise<void> {
  for (const day of days) {
    if (day.enabled) {
      await upsertBusinessHours(companyId, day.weekday, day.start_time, day.end_time)
    } else {
      await deleteBusinessHoursByWeekday(companyId, day.weekday)
    }
  }
}
