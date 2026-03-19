import type { Staff } from '@/types'
import { Users2 } from 'lucide-react'

interface StaffSelectorProps {
  staff: Staff[]
  selectedId: string | null
  onSelect: (staff: Staff | null) => void
}

export function StaffSelector({ staff, selectedId, onSelect }: StaffSelectorProps) {
  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-3">
          <Users2 className="w-6 h-6 text-amber-400" />
        </div>
        <h2 className="text-xl font-bold text-white">Escolha o profissional</h2>
        <p className="text-sm text-gray-400 mt-1">Selecione quem irá atendê-lo</p>
      </div>

      <div className="space-y-3">
        {/* "Any" option */}
        <button
          onClick={() => onSelect(null)}
          className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 ${
            selectedId === null
              ? 'border-amber-500/40 bg-amber-500/10 shadow-lg shadow-amber-500/5 scale-[1.01]'
              : 'border-gray-700/50 bg-gray-800/50 hover:border-gray-600 hover:bg-gray-800'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center flex-shrink-0">
              <Users2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className={`font-semibold ${selectedId === null ? 'text-amber-400' : 'text-white'}`}>
                Sem preferência
              </p>
              <p className="text-xs text-gray-400 mt-0.5">Qualquer profissional disponível</p>
            </div>
          </div>
          {selectedId === null && (
            <div className="mt-3 pt-3 border-t border-amber-500/20">
              <p className="text-xs text-amber-400/70 font-medium">✓ Selecionado</p>
            </div>
          )}
        </button>

        {staff.map((s) => (
          <button
            key={s.id}
            onClick={() => onSelect(s)}
            className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 ${
              selectedId === s.id
                ? 'border-amber-500/40 bg-amber-500/10 shadow-lg shadow-amber-500/5 scale-[1.01]'
                : 'border-gray-700/50 bg-gray-800/50 hover:border-gray-600 hover:bg-gray-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-700/20 border border-amber-500/10 flex items-center justify-center flex-shrink-0">
                <span className="text-base font-bold text-amber-400">{s.name.charAt(0).toUpperCase()}</span>
              </div>
              <div>
                <p className={`font-semibold ${selectedId === s.id ? 'text-amber-400' : 'text-white'}`}>{s.name}</p>
                {s.role && <p className="text-xs text-gray-400 mt-0.5">{s.role}</p>}
              </div>
            </div>
            {selectedId === s.id && (
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
