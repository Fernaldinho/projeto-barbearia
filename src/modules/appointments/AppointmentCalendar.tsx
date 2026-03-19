import type { Appointment } from '@/types'
import { timeToMinutes } from '@/lib/availability'
import { User, Scissors } from 'lucide-react'

interface AppointmentCalendarProps {
  appointments: Appointment[]
  businessStart?: string // "HH:mm"
  businessEnd?: string   // "HH:mm"
  onSlotClick: (time: string) => void
  onAppointmentClick: (appointment: Appointment) => void
}

const statusColors: Record<string, string> = {
  scheduled: 'border-l-blue-400 bg-blue-500/10',
  confirmed: 'border-l-primary-400 bg-primary-500/10',
  completed: 'border-l-emerald-400 bg-emerald-500/10',
  cancelled: 'border-l-red-400 bg-red-500/10 opacity-50',
  no_show: 'border-l-gray-400 bg-gray-500/10 opacity-50',
}

const HOUR_HEIGHT = 64 // pixels per hour
const SLOT_MIN_HEIGHT = 32

export function AppointmentCalendar({
  appointments,
  businessStart = '08:00',
  businessEnd = '20:00',
  onSlotClick,
  onAppointmentClick,
}: AppointmentCalendarProps) {
  const startHour = Math.floor(timeToMinutes(businessStart) / 60)
  const endHour = Math.ceil(timeToMinutes(businessEnd) / 60)
  const totalHours = endHour - startHour

  const hours = Array.from({ length: totalHours }, (_, i) => startHour + i)

  // Calculate appointment position and height
  const getAppointmentStyle = (appt: Appointment) => {
    const apptStart = timeToMinutes(appt.start_time.slice(0, 5))
    const apptEnd = timeToMinutes(appt.end_time.slice(0, 5))
    const dayStart = startHour * 60

    const top = ((apptStart - dayStart) / 60) * HOUR_HEIGHT
    const height = Math.max(((apptEnd - apptStart) / 60) * HOUR_HEIGHT, SLOT_MIN_HEIGHT)

    return { top: `${top}px`, height: `${height}px` }
  }

  // Filter active appointments (exclude cancelled/no_show from visual)
  const activeAppointments = appointments.filter(
    (a) => a.status !== 'cancelled' && a.status !== 'no_show'
  )
  const inactiveAppointments = appointments.filter(
    (a) => a.status === 'cancelled' || a.status === 'no_show'
  )

  return (
    <div className="card overflow-hidden">
      <div className="flex">
        {/* Time labels column */}
        <div className="flex-shrink-0 w-16 border-r border-dark-700/30">
          {hours.map((hour) => (
            <div
              key={hour}
              className="flex items-start justify-end pr-3 text-xs text-dark-500 font-medium"
              style={{ height: `${HOUR_HEIGHT}px` }}
            >
              <span className="-mt-2">
                {hour.toString().padStart(2, '0')}:00
              </span>
            </div>
          ))}
        </div>

        {/* Calendar body */}
        <div className="flex-1 relative">
          {/* Hour grid lines */}
          {hours.map((hour) => (
            <div
              key={hour}
              className="border-b border-dark-700/20 cursor-pointer hover:bg-dark-800/30 transition-colors"
              style={{ height: `${HOUR_HEIGHT}px` }}
              onClick={() => onSlotClick(`${hour.toString().padStart(2, '0')}:00`)}
            >
              {/* Half-hour line */}
              <div
                className="border-b border-dark-700/10 cursor-pointer hover:bg-dark-800/20 transition-colors"
                style={{ height: `${HOUR_HEIGHT / 2}px` }}
                onClick={(e) => {
                  e.stopPropagation()
                  onSlotClick(`${hour.toString().padStart(2, '0')}:00`)
                }}
              />
              <div
                className="cursor-pointer hover:bg-dark-800/20 transition-colors"
                style={{ height: `${HOUR_HEIGHT / 2}px` }}
                onClick={(e) => {
                  e.stopPropagation()
                  onSlotClick(`${hour.toString().padStart(2, '0')}:30`)
                }}
              />
            </div>
          ))}

          {/* Appointment blocks */}
          {activeAppointments.map((appt) => {
            const style = getAppointmentStyle(appt)
            const colorClass = statusColors[appt.status] || statusColors.scheduled

            return (
              <div
                key={appt.id}
                className={`absolute left-1 right-1 rounded-lg border-l-4 px-3 py-1.5 cursor-pointer hover:brightness-125 transition-all overflow-hidden ${colorClass}`}
                style={style}
                onClick={(e) => {
                  e.stopPropagation()
                  onAppointmentClick(appt)
                }}
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-xs font-bold text-white truncate">
                    {appt.start_time.slice(0, 5)} - {appt.end_time.slice(0, 5)}
                  </span>
                </div>
                <div className="flex items-center gap-1 min-w-0 mt-0.5">
                  <User className="w-3 h-3 text-dark-300 flex-shrink-0" />
                  <span className="text-xs text-dark-200 truncate">
                    {appt.client?.name || 'Cliente'}
                  </span>
                </div>
                <div className="flex items-center gap-1 min-w-0">
                  <Scissors className="w-3 h-3 text-dark-300 flex-shrink-0" />
                  <span className="text-xs text-dark-300 truncate">
                    {appt.service?.name || 'Serviço'}
                  </span>
                </div>
              </div>
            )
          })}

          {/* Current time indicator */}
          <CurrentTimeIndicator startHour={startHour} endHour={endHour} />
        </div>
      </div>

      {/* Cancelled/No-show appointments below */}
      {inactiveAppointments.length > 0 && (
        <div className="border-t border-dark-700/30 p-4">
          <p className="text-xs font-semibold text-dark-500 uppercase tracking-wider mb-2">
            Cancelados / Não compareceram ({inactiveAppointments.length})
          </p>
          <div className="space-y-1">
            {inactiveAppointments.map((appt) => (
              <div
                key={appt.id}
                className="flex items-center gap-3 p-2 rounded-lg bg-dark-800/50 text-xs text-dark-400 cursor-pointer hover:bg-dark-800 transition-colors"
                onClick={() => onAppointmentClick(appt)}
              >
                <span>{appt.start_time.slice(0, 5)}</span>
                <span className="text-dark-500">|</span>
                <span>{appt.client?.name}</span>
                <span className="text-dark-500">·</span>
                <span>{appt.service?.name}</span>
                <span className={`ml-auto px-2 py-0.5 rounded text-xs ${
                  appt.status === 'cancelled' ? 'bg-red-500/10 text-red-400' : 'bg-dark-700 text-dark-400'
                }`}>
                  {appt.status === 'cancelled' ? 'Cancelado' : 'Não compareceu'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function CurrentTimeIndicator({ startHour, endHour }: { startHour: number; endHour: number }) {
  const now = new Date()
  const currentMinutes = now.getHours() * 60 + now.getMinutes()
  const dayStart = startHour * 60
  const dayEnd = endHour * 60

  if (currentMinutes < dayStart || currentMinutes > dayEnd) return null

  const top = ((currentMinutes - dayStart) / 60) * HOUR_HEIGHT

  return (
    <div
      className="absolute left-0 right-0 z-10 pointer-events-none"
      style={{ top: `${top}px` }}
    >
      <div className="flex items-center">
        <div className="w-2.5 h-2.5 rounded-full bg-danger-500 -ml-1 shadow-lg shadow-danger-500/50" />
        <div className="flex-1 h-px bg-danger-500/60" />
      </div>
    </div>
  )
}
