import type { Appointment } from '@/types'
import { Clock, User, Scissors, CheckCircle, XCircle, AlertCircle, Edit, Ban } from 'lucide-react'
import { cn } from '@/utils/helpers'

interface AppointmentsListProps {
  appointments: Appointment[]
  onStatusChange: (id: string, status: string) => void
  onEdit: (appointment: Appointment) => void
}

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  scheduled: { label: 'Agendado', color: 'bg-blue-500/10 text-blue-400', icon: Clock },
  confirmed: { label: 'Confirmado', color: 'bg-primary-500/10 text-primary-400', icon: CheckCircle },
  completed: { label: 'Concluído', color: 'bg-emerald-500/10 text-emerald-400', icon: CheckCircle },
  cancelled: { label: 'Cancelado', color: 'bg-danger-500/10 text-danger-500', icon: XCircle },
  no_show: { label: 'Não compareceu', color: 'bg-dark-500/10 text-dark-400', icon: AlertCircle },
}

export function AppointmentsList({ appointments, onStatusChange, onEdit }: AppointmentsListProps) {
  if (appointments.length === 0) {
    return (
      <div className="card p-12 text-center">
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
        const isActive = appointment.status === 'scheduled' || appointment.status === 'confirmed'

        return (
          <div
            key={appointment.id}
            className={cn(
              'card p-4 sm:p-5 flex flex-wrap sm:flex-nowrap items-center gap-4 transition-all',
              !isActive && 'opacity-60'
            )}
          >
            {/* Time */}
            <div className="flex-shrink-0 text-center min-w-[60px]">
              <p className="text-lg font-bold text-white">{appointment.start_time.slice(0, 5)}</p>
              <p className="text-xs text-dark-400">{appointment.end_time.slice(0, 5)}</p>
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

            {/* Status badge */}
            <div className={cn('flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap', status.color)}>
              <StatusIcon className="w-3.5 h-3.5" />
              {status.label}
            </div>

            {/* Actions */}
            <div className="flex gap-1.5 flex-wrap sm:flex-nowrap flex-shrink-0 mt-2 sm:mt-0 ml-auto sm:ml-0 w-full sm:w-auto justify-end sm:justify-start">
              {isActive && (
                <button
                  onClick={() => onEdit(appointment)}
                  className="p-2 rounded-lg text-dark-400 hover:bg-dark-700 hover:text-white transition-all"
                  title="Editar"
                >
                  <Edit className="w-4 h-4" />
                </button>
              )}

              {appointment.status === 'scheduled' && (
                <button
                  onClick={() => onStatusChange(appointment.id, 'confirmed')}
                  className="p-2 rounded-lg bg-primary-500/10 text-primary-400 hover:bg-primary-500/20 transition-all"
                  title="Confirmar"
                >
                  <CheckCircle className="w-4 h-4" />
                </button>
              )}

              {appointment.status === 'confirmed' && (
                <button
                  onClick={() => onStatusChange(appointment.id, 'completed')}
                  className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-all"
                  title="Concluir"
                >
                  <CheckCircle className="w-4 h-4" />
                </button>
              )}

              {isActive && (
                <>
                  <button
                    onClick={() => onStatusChange(appointment.id, 'cancelled')}
                    className="p-2 rounded-lg bg-danger-500/10 text-danger-500 hover:bg-danger-500/20 transition-all"
                    title="Cancelar"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onStatusChange(appointment.id, 'no_show')}
                    className="p-2 rounded-lg bg-dark-700/50 text-dark-400 hover:bg-dark-700 transition-all"
                    title="Não compareceu"
                  >
                    <Ban className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
