import { useState } from 'react'
import { X, AlertCircle } from 'lucide-react'
import type { Staff, StaffFormData } from '@/types'

interface StaffFormProps {
  initialData?: Staff | null
  onSubmit: (data: StaffFormData) => Promise<void>
  onClose: () => void
}

export function StaffForm({ initialData, onSubmit, onClose }: StaffFormProps) {
  const [name, setName] = useState(initialData?.name || '')
  const [role, setRole] = useState(initialData?.role || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!name.trim()) { setError('Informe o nome do profissional.'); return }
    setLoading(true)
    try {
      await onSubmit({ name: name.trim(), role: role.trim() })
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="card w-full max-w-[500px] p-0 flex flex-col overflow-hidden mx-4 animate-scale-in">
        <div className="flex items-center justify-between p-6 border-b border-dark-800">
          <h2 className="!mb-0">
            {initialData ? 'Editar Profissional' : 'Novo Profissional'}
          </h2>
          <button onClick={onClose} className="p-2 -mr-2 rounded-lg text-dark-400 hover:bg-dark-800 hover:text-white transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-danger-500/10 border border-danger-500/20 rounded-lg flex items-center gap-2 text-danger-500 text-sm">
            <AlertCircle className="w-4 h-4" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label htmlFor="staff-name">Nome *</label>
            <input id="staff-name" type="text" value={name} onChange={(e) => setName(e.target.value)}
              placeholder="Nome do profissional" className="input-field" required />
          </div>
          <div>
            <label htmlFor="staff-role">Cargo / Função</label>
            <input id="staff-role" type="text" value={role} onChange={(e) => setRole(e.target.value)}
              placeholder="Ex: Barbeiro, Cabeleireiro..." className="input-field" />
          </div>
          <div className="flex justify-end gap-3 pt-6 mt-2 border-t border-dark-800">
            <button type="button" onClick={onClose} className="btn-secondary">Cancelar</button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Salvando...' : initialData ? 'Salvar' : 'Adicionar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
