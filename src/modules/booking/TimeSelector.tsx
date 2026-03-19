import { Clock, Loader2 } from 'lucide-react'
import type { TimeSlot } from '@/lib/availability'

interface TimeSelectorProps {
  slots: TimeSlot[]
  selectedTime: string | null
  loading: boolean
  isDayClosed: boolean
  onSelect: (time: string) => void
}

export function TimeSelector({ slots, selectedTime, loading, isDayClosed, onSelect }: TimeSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-3">
          <Clock className="w-6 h-6 text-amber-400" />
        </div>
        <h2 className="text-xl font-bold text-white">Escolha o horário</h2>
        <p className="text-sm text-gray-400 mt-1">Selecione um horário disponível</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center gap-3 py-8">
          <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
          <p className="text-sm text-gray-400">Carregando horários...</p>
        </div>
      ) : isDayClosed ? (
        <div className="text-center py-8 bg-gray-800/50 border border-gray-700/50 rounded-2xl">
          <p className="text-gray-400 mb-1">Estabelecimento fechado neste dia.</p>
          <p className="text-xs text-gray-500">Selecione outra data para continuar.</p>
        </div>
      ) : slots.length === 0 ? (
        <div className="text-center py-8 bg-gray-800/50 border border-gray-700/50 rounded-2xl">
          <p className="text-gray-400 mb-1">Nenhum horário disponível.</p>
          <p className="text-xs text-gray-500">Todos os horários já estão ocupados nesta data.</p>
        </div>
      ) : (
        <>
          <p className="text-xs text-gray-500 text-center">{slots.length} horário{slots.length !== 1 ? 's' : ''} disponíve{slots.length !== 1 ? 'is' : 'l'}</p>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {slots.map((slot) => (
              <button
                key={slot.start_time}
                onClick={() => onSelect(slot.start_time)}
                className={`py-3 px-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  selectedTime === slot.start_time
                    ? 'bg-amber-500 text-gray-900 shadow-lg shadow-amber-500/30 scale-105'
                    : 'bg-gray-800/50 border border-gray-700/50 text-gray-300 hover:border-amber-500/30 hover:text-white hover:bg-gray-800'
                }`}
              >
                {slot.start_time}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
