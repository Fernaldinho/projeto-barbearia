import { CalendarCheck, UserPlus, DollarSign, TrendingUp, type LucideIcon } from 'lucide-react'
import { cn } from '@/utils/helpers'
import type { DashboardMetrics } from './dashboard.api'

const formatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

interface CardConfig {
  key: keyof DashboardMetrics
  title: string
  icon: LucideIcon
  color: 'yellow' | 'blue' | 'green' | 'purple'
  format: (v: number) => string
}

const colorMap = {
  yellow: { bg: 'bg-primary-500/10', text: 'text-primary-400', glow: 'shadow-primary-500/5' },
  blue: { bg: 'bg-info-500/10', text: 'text-info-500', glow: 'shadow-info-500/5' },
  green: { bg: 'bg-success-500/10', text: 'text-success-500', glow: 'shadow-success-500/5' },
  purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', glow: 'shadow-purple-500/5' },
}

const cards: CardConfig[] = [
  {
    key: 'appointmentsToday',
    title: 'Agendamentos hoje',
    icon: CalendarCheck,
    color: 'yellow',
    format: (v) => v.toString(),
  },
  {
    key: 'newClientsThisMonth',
    title: 'Novos clientes (mês)',
    icon: UserPlus,
    color: 'blue',
    format: (v) => v.toString(),
  },
  {
    key: 'monthlyRevenue',
    title: 'Faturamento do mês',
    icon: DollarSign,
    color: 'green',
    format: (v) => formatter.format(v),
  },
  {
    key: 'attendanceRate',
    title: 'Taxa de comparecimento',
    icon: TrendingUp,
    color: 'purple',
    format: (v) => `${v}%`,
  },
]

interface StatsCardsProps {
  metrics: DashboardMetrics
}

export function StatsCards({ metrics }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px]">
      {cards.map((card) => {
        const colors = colorMap[card.color]
        const Icon = card.icon
        const value = metrics[card.key] as number

        return (
          <div key={card.key} className={cn('card p-[24px]', colors.glow)}>
            <div className="flex items-center justify-between mb-3 shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', colors.bg)}>
                <Icon className={cn('w-5 h-5 shrink-0', colors.text)} />
              </div>
            </div>
            <p className="text-2xl font-bold text-white mb-1 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">{card.format(value)}</p>
            <p className="text-small text-dark-400">{card.title}</p>
          </div>
        )
      })}
    </div>
  )
}
