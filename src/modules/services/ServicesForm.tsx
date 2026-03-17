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
      <div className="glass-card w-full max-w-lg p-6 mx-4 animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">
            {initialData ? 'Editar Serviço' : 'Novo Serviço'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg text-dark-400 hover:bg-dark-700 hover:text-white transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="service-name" className="block text-sm font-medium text-dark-200 mb-2">Nome</label>
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
            <label htmlFor="service-description" className="block text-sm font-medium text-dark-200 mb-2">Descrição</label>
            <textarea
              id="service-description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descrição do serviço..."
              className="input-field resize-none h-20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="service-duration" className="block text-sm font-medium text-dark-200 mb-2">Duração (min)</label>
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
              <label htmlFor="service-price" className="block text-sm font-medium text-dark-200 mb-2">Preço (R$)</label>
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
              className="w-4 h-4 rounded accent-primary-500"
            />
            <label htmlFor="service-active" className="text-sm text-dark-200">Serviço ativo</label>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center disabled:opacity-50">
              {loading ? 'Salvando...' : initialData ? 'Salvar alterações' : 'Criar serviço'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
