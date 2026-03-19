import { useState } from 'react'
import type { ClientFormData, Client } from '@/types'
import { X, AlertCircle } from 'lucide-react'
import { formatPhone } from '@/utils/helpers'

interface ClientsFormProps {
  initialData?: Client | null
  onSubmit: (data: ClientFormData) => Promise<void>
  onClose: () => void
}

export function ClientsForm({ initialData, onSubmit, onClose }: ClientsFormProps) {
  const [formData, setFormData] = useState<ClientFormData>({
    name: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone ? formatPhone(initialData.phone) : '',
    notes: initialData?.notes || '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    if (formData.phone) {
      const digits = formData.phone.replace(/\D/g, '')
      if (digits.length < 10) {
        setError('Telefone inválido. Informe um número válido.')
        return
      }
    }

    setLoading(true)
    try {
      await onSubmit(formData)
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'Ocorreu um erro ao salvar o cliente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="glass-card w-full max-w-lg p-6 mx-4 animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">
            {initialData ? 'Editar Cliente' : 'Novo Cliente'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg text-dark-400 hover:bg-dark-700 hover:text-white transition-all">
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
            <label htmlFor="client-name" className="block text-sm font-medium text-dark-200 mb-2">Nome</label>
            <input id="client-name" type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Nome completo" className="input-field" required />
          </div>

          <div>
            <label htmlFor="client-phone" className="block text-sm font-medium text-dark-200 mb-2">Telefone</label>
            <input id="client-phone" type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: formatPhone(e.target.value) })} placeholder="(00) 00000-0000" className="input-field" required />
          </div>

          <div>
            <label htmlFor="client-email" className="block text-sm font-medium text-dark-200 mb-2">Email (opcional)</label>
            <input id="client-email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="email@exemplo.com" className="input-field" />
          </div>

          <div>
            <label htmlFor="client-notes" className="block text-sm font-medium text-dark-200 mb-2">Observações</label>
            <textarea id="client-notes" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} placeholder="Observações sobre o cliente..." className="input-field resize-none h-20" />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 justify-center">Cancelar</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 justify-center disabled:opacity-50">
              {loading ? 'Salvando...' : initialData ? 'Salvar alterações' : 'Criar cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
