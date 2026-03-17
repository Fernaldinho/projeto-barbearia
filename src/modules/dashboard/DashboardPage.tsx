import { useEffect, useState } from 'react'
import { StatsGrid } from './StatsGrid'
import { getDashboardStats } from './dashboard.api'
import { useCompany } from '@/contexts/CompanyContext'
import { useAuth } from '@/contexts/AuthContext'
import type { DashboardStats } from '@/types'
import { CalendarCheck, TrendingUp } from 'lucide-react'

export function DashboardPage() {
  const { user } = useAuth()
  const { company } = useCompany()
  const [stats, setStats] = useState<DashboardStats>({
    totalClients: 0,
    totalServices: 0,
    appointmentsToday: 0,
    monthlyRevenue: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      if (company?.id) {
        try {
          const data = await getDashboardStats(company.id)
          setStats(data)
        } catch (err) {
          console.error('Error loading dashboard stats:', err)
        }
      }
      setLoading(false)
    }
    load()
  }, [company?.id])

  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Bom dia'
    if (hour < 18) return 'Boa tarde'
    return 'Boa noite'
  }

  const userName = user?.user_metadata?.full_name || 'Usuário'

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          {greeting()}, {userName.split(' ')[0]}! 👋
        </h1>
        <p className="text-dark-300">
          Aqui está o resumo da sua barbearia hoje.
        </p>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass-card p-6 h-[140px] animate-pulse">
              <div className="w-11 h-11 rounded-xl bg-dark-700 mb-4" />
              <div className="w-20 h-6 rounded bg-dark-700 mb-2" />
              <div className="w-28 h-4 rounded bg-dark-700" />
            </div>
          ))}
        </div>
      ) : (
        <StatsGrid {...stats} />
      )}

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center">
              <CalendarCheck className="w-5 h-5 text-primary-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Próximos Agendamentos</h3>
          </div>
          <p className="text-dark-400 text-sm">
            Nenhum agendamento próximo. Configure seus serviços para começar a receber agendamentos.
          </p>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-success-500/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-success-500" />
            </div>
            <h3 className="text-lg font-semibold text-white">Desempenho</h3>
          </div>
          <p className="text-dark-400 text-sm">
            Complete seu perfil e adicione serviços para ver estatísticas detalhadas do seu negócio.
          </p>
        </div>
      </div>
    </div>
  )
}
