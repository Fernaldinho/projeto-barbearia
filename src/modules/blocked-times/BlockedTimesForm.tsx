import { useState } from 'react'
import { X, AlertCircle } from 'lucide-react'
import type { BlockedTime } from '@/types'
import type { BlockedTimeFormData } from './blocked-times.api'

interface BlockedTimesFormProps {
  initialData?: BlockedTime | null
  onSubmit: (data: BlockedTimeFormData) => Promise<void>
  onClose: () => void
}

export function BlockedTimesForm({ initialData, onSubmit, onClose }: BlockedTimesFormProps) {
  const [formData, setFormData] = useState<BlockedTimeFormData>({
    date: initialData?.date || '',
    start_time: initialData?.start_time?.slice(0, 5) || '',
    end_time: initialData?.end_time?.slice(0, 5) || '',
    reason: initialData?.reason || '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.date) {
      setError('Selecione uma data.')
      return
    }

    if (!formData.start_time || !formData.end_time) {
      setError('Informe o horário de início e fim.')
      return
    }

    if (formData.start_time >= formData.end_time) {
      setError('O horário de início deve ser antes do horário de fim.')
      return
    }

    setLoading(true)
    try {
      await onSubmit(formData)
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Ocorreu um erro ao salvar o bloqueio.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="card w-full max-w-[500px] p-6 mx-4 animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">
            {initialData ? 'Editar bloqueio' : 'Novo bloqueio'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-dark-400 hover:bg-dark-700 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-danger-500/10 border border-danger-500/20 rounded-lg flex items-center gap-2 text-danger-500 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="blocked-date" className="block text-sm font-medium text-dark-200 mb-2">
              Data
            </label>
            <input
              id="blocked-date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="input-field [color-scheme:dark]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="blocked-start" className="block text-sm font-medium text-dark-200 mb-2">
                Hora de início
              </label>
              <input
                id="blocked-start"
                type="time"
                value={formData.start_time}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                className="input-field [color-scheme:dark]"
                required
              />
            </div>
            <div>
              <label htmlFor="blocked-end" className="block text-sm font-medium text-dark-200 mb-2">
                Hora de fim
              </label>
              <input
                id="blocked-end"
                type="time"
                value={formData.end_time}
                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                className="input-field [color-scheme:dark]"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="blocked-reason" className="block text-sm font-medium text-dark-200 mb-2">
              Motivo (opcional)
            </label>
            <textarea
              id="blocked-reason"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              placeholder="Ex: Almoço, feriado, compromisso pessoal..."
              className="input-field resize-none h-20"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 justify-center disabled:opacity-50"
            >
              {loading ? 'Salvando...' : initialData ? 'Salvar alterações' : 'Criar bloqueio'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
