import { useState } from 'react'
import type { ServiceFormData, Service } from '@/types'
import { X } from 'lucide-react'

interface ServicesFormProps {
  initialData?: Service | null
  onSubmit: (data: ServiceFormData) => Promise<void>
  onClose: () => void
}

export function ServicesForm({ initialData, onSubmit, onClose }: ServicesFormProps) {
  const [formData, setFormData] = useState<ServiceFormData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    duration: initialData?.duration || 30,
    price: initialData?.price || 0,
    is_active: initialData?.is_active ?? true,
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSubmit(formData)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="card w-full max-w-[500px] p-0 mx-4 animate-scale-in flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-dark-800">
          <h2 className="!mb-0">
            {initialData ? 'Editar Serviço' : 'Novo Serviço'}
          </h2>
          <button onClick={onClose} className="p-2 -mr-2 rounded-lg text-dark-400 hover:bg-dark-800 hover:text-white transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label htmlFor="service-name">Nome do Serviço</label>
            <input
              id="service-name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Corte masculino"
              className="input-field"
              required
            />
          </div>

          <div>
            <label htmlFor="service-description">Descrição</label>
            <textarea
              id="service-description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detalhes opcionais do serviço..."
              className="input-field"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="service-duration">Duração (minutos)</label>
              <input
                id="service-duration"
                type="number"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                min="5"
                step="5"
                className="input-field"
                required
              />
            </div>
            <div>
              <label htmlFor="service-price">Preço (R$)</label>
              <input
                id="service-price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                min="0"
                step="0.01"
                className="input-field"
                required
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              id="service-active"
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-4 h-4 rounded appearance-none border border-dark-600 checked:bg-primary-500 checked:border-primary-500 bg-dark-950 transition-colors cursor-pointer"
            />
            <label htmlFor="service-active" className="!mb-0 cursor-pointer text-white font-normal capitalize tracking-normal">
              Serviço ativo e visível na agenda
            </label>
          </div>

          {/* Actions group right aligned */}
          <div className="flex justify-end gap-3 pt-6 mt-2 border-t border-dark-800">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Salvando...' : initialData ? 'Salvar alterações' : 'Criar serviço'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
