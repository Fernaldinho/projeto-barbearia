import { supabase } from '@/lib/supabase'
import type { Invoice } from '@/types'

export async function getInvoices(companyId: string): Promise<Invoice[]> {
  const { data, error } = await supabase
    .from('invoices')
    .select('*')
    .eq('company_id', companyId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function getRevenueSummary(companyId: string) {
  const now = new Date()
  const firstDayOfMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`

  const { data, error } = await supabase
    .from('invoices')
    .select('amount, status')
    .eq('company_id', companyId)
    .gte('created_at', firstDayOfMonth)

  if (error) throw error

  const total = (data || []).reduce((sum, inv) => sum + inv.amount, 0)
  const paid = (data || []).filter((inv) => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0)
  const pending = (data || []).filter((inv) => inv.status === 'pending').reduce((sum, inv) => sum + inv.amount, 0)

  return { total, paid, pending }
}
