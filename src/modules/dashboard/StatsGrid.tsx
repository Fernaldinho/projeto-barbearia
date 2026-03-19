import { Users, Scissors, CalendarCheck, DollarSign, type LucideIcon } from 'lucide-react'
import { cn } from '@/utils/helpers'

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  trend?: string
  color: 'yellow' | 'blue' | 'green' | 'purple'
}

const colorMap = {
  yellow: {
    bg: 'bg-primary-500/10',
    text: 'text-primary-400',
    glow: 'shadow-primary-500/5',
  },
  blue: {
    bg: 'bg-info-500/10',
    text: 'text-info-500',
    glow: 'shadow-info-500/5',
  },
  green: {
    bg: 'bg-success-500/10',
    text: 'text-success-500',
    glow: 'shadow-success-500/5',
  },
  purple: {
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
    glow: 'shadow-purple-500/5',
  },
}

function StatsCard({ title, value, icon: Icon, trend, color }: StatsCardProps) {
  const colors = colorMap[color]

  return (
    <div className={cn('card p-6 shadow-lg', colors.glow)}>
      <div className="flex items-start justify-between mb-4">
        <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center', colors.bg)}>
          <Icon className={cn('w-5 h-5', colors.text)} />
        </div>
        {trend && (
          <span className="text-xs font-medium text-success-500 bg-success-500/10 px-2 py-1 rounded-lg">
            {trend}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-white mb-1">{value}</p>
      <p className="text-sm text-dark-400">{title}</p>
    </div>
  )
}

interface StatsGridProps {
  totalClients: number
  totalServices: number
  appointmentsToday: number
  monthlyRevenue: number
}

export function StatsGrid({ totalClients, totalServices, appointmentsToday, monthlyRevenue }: StatsGridProps) {
  const formatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard title="Total de Clientes" value={totalClients} icon={Users} color="blue" />
      <StatsCard title="Serviços Ativos" value={totalServices} icon={Scissors} color="yellow" />
      <StatsCard title="Agendamentos Hoje" value={appointmentsToday} icon={CalendarCheck} color="green" />
      <StatsCard title="Faturamento do Mês" value={formatter.format(monthlyRevenue)} icon={DollarSign} color="purple" />
    </div>
  )
}
