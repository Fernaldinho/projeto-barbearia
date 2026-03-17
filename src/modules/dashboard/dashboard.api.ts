import { supabase } from '@/lib/supabase'
import type { DashboardStats } from '@/types'

export async function getDashboardStats(companyId: string): Promise<DashboardStats> {
  const today = new Date().toISOString().split('T')[0]

  const [clientsRes, servicesRes, appointmentsRes, revenueRes] = await Promise.all([
    supabase.from('clients').select('id', { count: 'exact', head: true }).eq('company_id', companyId),
    supabase.from('services').select('id', { count: 'exact', head: true }).eq('company_id', companyId),
    supabase.from('appointments').select('id', { count: 'exact', head: true }).eq('company_id', companyId).eq('date', today),
    supabase.from('appointments').select('service:services(price)').eq('company_id', companyId).eq('status', 'completed').gte('date', `${today.slice(0, 7)}-01`),
  ])

  const monthlyRevenue = (revenueRes.data || []).reduce((sum: number, a: Record<string, unknown>) => {
    const service = a.service as { price: number } | null
    return sum + (service?.price || 0)
  }, 0)

  return {
    totalClients: clientsRes.count || 0,
    totalServices: servicesRes.count || 0,
    appointmentsToday: appointmentsRes.count || 0,
    monthlyRevenue,
  }
}
