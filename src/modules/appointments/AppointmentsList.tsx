import type { Appointment } from '@/types'
import { formatTime } from '@/utils/helpers'
import { Clock, User, Scissors, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { cn } from '@/utils/helpers'

interface AppointmentsListProps {
  appointments: Appointment[]
  onStatusChange: (id: string, status: string) => void
}

const statusConfig = {
  scheduled: { label: 'Agendado', color: 'bg-info-500/10 text-info-500', icon: Clock },
  confirmed: { label: 'Confirmado', color: 'bg-primary-500/10 text-primary-400', icon: CheckCircle },
  completed: { label: 'Concluído', color: 'bg-success-500/10 text-success-500', icon: CheckCircle },
  cancelled: { label: 'Cancelado', color: 'bg-danger-500/10 text-danger-500', icon: XCircle },
  no_show: { label: 'Não compareceu', color: 'bg-dark-500/10 text-dark-400', icon: AlertCircle },
}

export function AppointmentsList({ appointments, onStatusChange }: AppointmentsListProps) {
  if (appointments.length === 0) {
    return (
      <div className="glass-card p-12 text-center">
        <p className="text-dark-400 text-lg mb-2">Nenhum agendamento</p>
        <p className="text-dark-500 text-sm">Não há agendamentos para a data selecionada.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {appointments.map((appointment) => {
        const status = statusConfig[appointment.status] || statusConfig.scheduled
        const StatusIcon = status.icon

        return (
          <div key={appointment.id} className="glass-card p-5 flex items-center gap-4">
            {/* Time */}
            <div className="flex-shrink-0 text-center min-w-[60px]">
              <p className="text-lg font-bold text-white">{formatTime(appointment.start_time)}</p>
              <p className="text-xs text-dark-400">{formatTime(appointment.end_time)}</p>
            </div>

            {/* Divider */}
            <div className="w-px h-12 bg-dark-700" />

            {/* Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <User className="w-4 h-4 text-dark-400" />
                <span className="font-medium text-white truncate">
                  {appointment.client?.name || 'Cliente'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Scissors className="w-4 h-4 text-dark-400" />
                <span className="text-sm text-dark-300 truncate">
                  {appointment.service?.name || 'Serviço'}
                </span>
              </div>
            </div>

            {/* Status */}
            <div className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium', status.color)}>
              <StatusIcon className="w-3.5 h-3.5" />
              {status.label}
            </div>

            {/* Quick actions */}
            {appointment.status === 'scheduled' && (
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => onStatusChange(appointment.id, 'confirmed')}
                  className="p-2 rounded-lg bg-success-500/10 text-success-500 hover:bg-success-500/20 transition-all text-xs"
                  title="Confirmar"
                >
                  <CheckCircle className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onStatusChange(appointment.id, 'cancelled')}
                  className="p-2 rounded-lg bg-danger-500/10 text-danger-500 hover:bg-danger-500/20 transition-all text-xs"
                  title="Cancelar"
                >
                  <XCircle className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
