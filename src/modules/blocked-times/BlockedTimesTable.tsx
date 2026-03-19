import type { BlockedTime } from '@/types'
import { Edit, Trash2, Calendar, Clock, MessageSquare } from 'lucide-react'

interface BlockedTimesTableProps {
  blockedTimes: BlockedTime[]
  onEdit: (item: BlockedTime) => void
  onDelete: (id: string) => void
}

function formatDateBR(dateStr: string): string {
  const [year, month, day] = dateStr.split('-')
  return `${day}/${month}/${year}`
}

function formatWeekday(dateStr: string): string {
  const date = new Date(dateStr + 'T12:00:00')
  return date.toLocaleDateString('pt-BR', { weekday: 'long' })
}

function isPast(dateStr: string): boolean {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const date = new Date(dateStr + 'T12:00:00')
  return date < today
}

export function BlockedTimesTable({ blockedTimes, onEdit, onDelete }: BlockedTimesTableProps) {
  if (blockedTimes.length === 0) {
    return (
      <div className="card p-12 text-center">
        <div className="w-16 h-16 rounded-2xl bg-dark-800 border border-dark-700 flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-8 h-8 text-dark-500" />
        </div>
        <p className="text-dark-400 text-lg mb-2">Nenhum bloqueio cadastrado</p>
        <p className="text-dark-500 text-sm">Adicione bloqueios para impedir agendamentos em horários específicos.</p>
      </div>
    )
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-dark-700/50">
              <th className="text-left text-xs font-semibold text-dark-400 uppercase tracking-wider px-6 py-4">
                Data
              </th>
              <th className="text-left text-xs font-semibold text-dark-400 uppercase tracking-wider px-6 py-4">
                Horário
              </th>
              <th className="text-left text-xs font-semibold text-dark-400 uppercase tracking-wider px-6 py-4">
                Motivo
              </th>
              <th className="text-right text-xs font-semibold text-dark-400 uppercase tracking-wider px-6 py-4">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {blockedTimes.map((item) => {
              const past = isPast(item.date)
              return (
                <tr
                  key={item.id}
                  className={`border-b border-dark-700/30 hover:bg-dark-800/50 transition-colors ${
                    past ? 'opacity-50' : ''
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          past
                            ? 'bg-dark-800 border border-dark-700'
                            : 'bg-gradient-to-br from-danger-500/20 to-danger-700/20 border border-danger-500/10'
                        }`}
                      >
                        <Calendar
                          className={`w-4 h-4 ${past ? 'text-dark-500' : 'text-danger-400'}`}
                        />
                      </div>
                      <div>
                        <p className="font-medium text-white text-sm">{formatDateBR(item.date)}</p>
                        <p className="text-xs text-dark-400 capitalize">{formatWeekday(item.date)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-dark-200">
                      <Clock className="w-3.5 h-3.5 text-dark-400" />
                      {item.start_time.slice(0, 5)} - {item.end_time.slice(0, 5)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {item.reason ? (
                      <div className="flex items-center gap-2 text-sm text-dark-300">
                        <MessageSquare className="w-3.5 h-3.5 text-dark-400 flex-shrink-0" />
                        <span className="truncate max-w-[200px]">{item.reason}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-dark-500">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onEdit(item)}
                        className="p-2 rounded-lg text-dark-400 hover:bg-dark-700 hover:text-white transition-all"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(item.id)}
                        className="p-2 rounded-lg text-dark-400 hover:bg-danger-600/10 hover:text-danger-500 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
