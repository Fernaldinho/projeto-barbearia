import type { TodayAppointment } from './dashboard.api'
import { Clock, User, Scissors, CheckCircle, XCircle, AlertCircle, CalendarCheck } from 'lucide-react'
import { cn } from '@/utils/helpers'

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  scheduled: { label: 'Agendado', color: 'bg-blue-500/10 text-blue-400', icon: Clock },
  confirmed: { label: 'Confirmado', color: 'bg-primary-500/10 text-primary-400', icon: CheckCircle },
  completed: { label: 'Concluído', color: 'bg-emerald-500/10 text-emerald-400', icon: CheckCircle },
  cancelled: { label: 'Cancelado', color: 'bg-danger-500/10 text-danger-500', icon: XCircle },
  no_show: { label: 'Falta', color: 'bg-dark-500/10 text-dark-400', icon: AlertCircle },
}

interface TodayScheduleProps {
  appointments: TodayAppointment[]
}

export function TodaySchedule({ appointments }: TodayScheduleProps) {
  return (
    <div className="card p-[24px]">
      <h3 className="!mb-[16px]">Agenda de hoje</h3>

      {appointments.length === 0 ? (
        <div className="text-center py-6 text-dark-500 text-sm">
          Nenhum agendamento hoje
        </div>
      ) : (
        <div className="space-y-[8px]">
          {appointments.map((appt) => {
            const status = statusConfig[appt.status] || statusConfig.scheduled
            const StatusIcon = status.icon
            const isInactive = appt.status === 'cancelled' || appt.status === 'no_show'

            return (
              <div
                key={appt.id}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-xl bg-dark-800/50 border border-dark-700/30 transition-all',
                  isInactive && 'opacity-50'
                )}
              >
                {/* Time */}
                <div className="flex-shrink-0 text-center min-w-[50px]">
                  <p className="text-sm font-bold text-white">{appt.start_time.slice(0, 5)}</p>
                  <p className="text-[10px] text-dark-500">{appt.end_time.slice(0, 5)}</p>
                </div>

                <div className="w-px h-8 bg-dark-700 flex-shrink-0" />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3 h-3 text-dark-400 flex-shrink-0" />
                    <span className="text-sm font-medium text-white truncate">{appt.client_name}</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Scissors className="w-3 h-3 text-dark-400 flex-shrink-0" />
                    <span className="text-xs text-dark-300 truncate">{appt.service_name}</span>
                  </div>
                </div>

                {/* Status */}
                <div className={cn('flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium flex-shrink-0', status.color)}>
                  <StatusIcon className="w-3 h-3" />
                  {status.label}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
