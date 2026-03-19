import type { Service } from '@/types'
import { Clock, Scissors } from 'lucide-react'

interface ServiceSelectorProps {
  services: Service[]
  selectedId: string | null
  onSelect: (service: Service) => void
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

export function ServiceSelector({ services, selectedId, onSelect }: ServiceSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-3">
          <Scissors className="w-6 h-6 text-amber-400" />
        </div>
        <h2 className="text-xl font-bold text-white">Escolha o serviço</h2>
        <p className="text-sm text-gray-400 mt-1">Selecione o serviço que deseja agendar</p>
      </div>

      <div className="space-y-3">
        {services.map((service) => (
          <button
            key={service.id}
            onClick={() => onSelect(service)}
            className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 ${
              selectedId === service.id
                ? 'border-amber-500/40 bg-amber-500/10 shadow-lg shadow-amber-500/5 scale-[1.01]'
                : 'border-gray-700/50 bg-gray-800/50 hover:border-gray-600 hover:bg-gray-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className={`font-semibold ${selectedId === service.id ? 'text-amber-400' : 'text-white'}`}>
                  {service.name}
                </p>
                {service.description && (
                  <p className="text-xs text-gray-400 mt-1 line-clamp-1">{service.description}</p>
                )}
              </div>
              <div className="text-right flex-shrink-0 ml-4">
                <p className="text-amber-400 font-bold">{formatCurrency(service.price)}</p>
                <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5 justify-end">
                  <Clock className="w-3 h-3" />
                  {service.duration}min
                </div>
              </div>
            </div>

            {/* Selection indicator */}
            {selectedId === service.id && (
              <div className="mt-3 pt-3 border-t border-amber-500/20">
                <p className="text-xs text-amber-400/70 font-medium">✓ Selecionado</p>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
