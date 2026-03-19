import type { TopServiceItem } from './dashboard.api'
import { Scissors, Trophy } from 'lucide-react'

const formatter = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

const rankColors = [
  'from-primary-400 to-primary-600',
  'from-blue-400 to-blue-600',
  'from-purple-400 to-purple-600',
  'from-pink-400 to-pink-600',
  'from-teal-400 to-teal-600',
]

interface TopServicesProps {
  data: TopServiceItem[]
}

export function TopServices({ data }: TopServicesProps) {
  const maxCount = data.length > 0 ? data[0].count : 1

  return (
    <div className="card p-[24px]">
      <h3 className="!mb-[16px]">Serviços mais populares</h3>
      {data.length === 0 ? (
        <div className="text-center py-6 text-dark-500 text-sm">
          Nenhum serviço concluído no período
        </div>
      ) : (
        <div className="space-y-[16px]">
          {data.map((item, i) => {
            const barWidth = Math.max((item.count / maxCount) * 100, 8)

            return (
              <div key={item.name} className="group">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xs font-bold text-dark-500 w-5 flex-shrink-0">#{i + 1}</span>
                    <Scissors className="w-3.5 h-3.5 text-dark-400 flex-shrink-0" />
                    <span className="text-sm font-medium text-white truncate">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs flex-shrink-0">
                    <span className="text-dark-400">{item.count}x</span>
                    <span className="text-primary-400 font-medium">{formatter.format(item.revenue)}</span>
                  </div>
                </div>
                <div className="h-1.5 bg-dark-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${rankColors[i] || rankColors[0]} transition-all duration-700`}
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
