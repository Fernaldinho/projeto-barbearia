import { useEffect, useState, useCallback } from 'react'
import { useCompany } from '@/contexts/CompanyContext'
import { useAuth } from '@/contexts/AuthContext'

import { StatsCards } from './StatsCards'
import { RevenueChart } from './RevenueChart'
import { AppointmentsChart } from './AppointmentsChart'
import { TopServices } from './TopServices'
import { TodaySchedule } from './TodaySchedule'

import {
  getDashboardMetrics,
  getDailyRevenue,
  getDailyAppointments,
  getTopServices,
  getTodaySchedule,
  type DashboardMetrics,
  type DailyRevenuePoint,
  type DailyAppointmentsPoint,
  type TopServiceItem,
  type TodayAppointment,
} from './dashboard.api'

type Period = '7d' | '30d' | 'month'

const periodLabels: Record<Period, string> = {
  '7d': '7 dias',
  '30d': '30 dias',
  'month': 'Mês atual',
}

export function DashboardPage() {
  const { user } = useAuth()
  const { company } = useCompany()

  const [period, setPeriod] = useState<Period>('30d')
  const [loading, setLoading] = useState(true)
  const [chartsLoading, setChartsLoading] = useState(false)

  // Data
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    appointmentsToday: 0,
    newClientsThisMonth: 0,
    monthlyRevenue: 0,
    attendanceRate: 0,
    totalAppointmentsMonth: 0,
    completedAppointmentsMonth: 0,
  })
  const [revenueData, setRevenueData] = useState<DailyRevenuePoint[]>([])
  const [appointmentsData, setAppointmentsData] = useState<DailyAppointmentsPoint[]>([])
  const [topServicesData, setTopServicesData] = useState<TopServiceItem[]>([])
  const [todayScheduleData, setTodayScheduleData] = useState<TodayAppointment[]>([])

  // Initial load (metrics + today)
  const loadInitial = useCallback(async () => {
    if (!company?.id) return
    setLoading(true)
    try {
      const [m, schedule] = await Promise.all([
        getDashboardMetrics(company.id),
        getTodaySchedule(company.id),
      ])
      setMetrics(m)
      setTodayScheduleData(schedule)
    } catch (err) {
      console.error('Dashboard load error:', err)
    } finally {
      setLoading(false)
    }
  }, [company?.id])

  // Charts (period-dependent)
  const loadCharts = useCallback(async () => {
    if (!company?.id) return
    setChartsLoading(true)
    try {
      const [revenue, appointments, topSvcs] = await Promise.all([
        getDailyRevenue(company.id, period),
        getDailyAppointments(company.id, period),
        getTopServices(company.id, period),
      ])
      setRevenueData(revenue)
      setAppointmentsData(appointments)
      setTopServicesData(topSvcs)
    } catch (err) {
      console.error('Charts load error:', err)
    } finally {
      setChartsLoading(false)
    }
  }, [company?.id, period])

  useEffect(() => {
    loadInitial()
  }, [loadInitial])

  useEffect(() => {
    loadCharts()
  }, [loadCharts])

  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Bom dia'
    if (hour < 18) return 'Boa tarde'
    return 'Boa noite'
  }

  const userName = user?.user_metadata?.full_name || 'Usuário'

  return (
    <div className="space-y-[24px] animate-fade-in">
      {/* Header + Period Filter */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-[16px] mb-[24px]">
        <div>
          <h1 className="!mb-1">
            {greeting()}, {userName.split(' ')[0]}! 👋
          </h1>
          <p>
            Aqui está o resumo do seu negócio.
          </p>
        </div>

        {/* Period selector */}
        <div className="flex items-center bg-dark-800 rounded-xl p-[4px] border border-dark-700 h-[40px]">
          {(Object.keys(periodLabels) as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-[16px] h-[32px] rounded-lg text-small font-medium transition-all ${
                period === p
                  ? 'bg-primary-500/10 text-primary-500'
                  : 'text-dark-400 hover:text-white'
              }`}
            >
              {periodLabels[p]}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px]">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card p-[24px] h-[120px] animate-pulse">
              <div className="w-10 h-10 rounded-xl bg-dark-700 mb-3" />
              <div className="w-20 h-6 rounded bg-dark-700 mb-1" />
              <div className="w-28 h-3 rounded bg-dark-700" />
            </div>
          ))}
        </div>
      ) : (
        <StatsCards metrics={metrics} />
      )}

      {/* Charts Row */}
      {chartsLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[16px]">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="card p-[24px] h-[300px] animate-pulse">
              <div className="w-32 h-5 rounded bg-dark-700 mb-4" />
              <div className="w-full h-[220px] rounded bg-dark-800" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[16px]">
          <RevenueChart data={revenueData} />
          <AppointmentsChart data={appointmentsData} />
        </div>
      )}

      {/* Bottom Row: Top Services + Today Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[16px]">
        {chartsLoading ? (
          <div className="card p-[24px] h-[260px] animate-pulse">
            <div className="w-32 h-5 rounded bg-dark-700 mb-4" />
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-8 rounded bg-dark-800" />
              ))}
            </div>
          </div>
        ) : (
          <TopServices data={topServicesData} />
        )}

        {loading ? (
          <div className="card p-[24px] h-[260px] animate-pulse">
            <div className="w-32 h-5 rounded bg-dark-700 mb-4" />
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-14 rounded bg-dark-800" />
              ))}
            </div>
          </div>
        ) : (
          <TodaySchedule appointments={todayScheduleData} />
        )}
      </div>
    </div>
  )
}
