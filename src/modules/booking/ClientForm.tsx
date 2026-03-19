import { useState } from 'react'
import { User, AlertCircle } from 'lucide-react'

interface ClientFormProps {
  onSubmit: (data: { name: string; phone: string; email: string }) => void
  loading: boolean
  error: string | null
}

function formatPhone(value: string): string {
  if (!value) return ''
  const phone = value.replace(/\D/g, '')
  if (phone.length <= 10) {
    return phone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
  }
  return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
}

export function ClientForm({ onSubmit, loading, error }: ClientFormProps) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)

    if (!name.trim()) {
      setLocalError('Informe seu nome.')
      return
    }
    if (!phone || phone.replace(/\D/g, '').length < 10) {
      setLocalError('Informe um telefone válido.')
      return
    }

    onSubmit({ name: name.trim(), phone, email: email.trim() })
  }

  const displayError = error || localError

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-3">
          <User className="w-6 h-6 text-amber-400" />
        </div>
        <h2 className="text-xl font-bold text-white">Seus dados</h2>
        <p className="text-sm text-gray-400 mt-1">Informe seus dados para confirmar o agendamento</p>
      </div>

      {displayError && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <p>{displayError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="booking-name" className="block text-sm font-medium text-gray-300 mb-2">
            Nome completo *
          </label>
          <input
            id="booking-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome completo"
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 transition-colors"
            required
          />
        </div>

        <div>
          <label htmlFor="booking-phone" className="block text-sm font-medium text-gray-300 mb-2">
            Telefone *
          </label>
          <input
            id="booking-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(formatPhone(e.target.value))}
            placeholder="(00) 00000-0000"
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 transition-colors"
            required
          />
        </div>

        <div>
          <label htmlFor="booking-email" className="block text-sm font-medium text-gray-300 mb-2">
            Email <span className="text-gray-500">(opcional)</span>
          </label>
          <input
            id="booking-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@exemplo.com"
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/50 transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-xl bg-amber-500 text-gray-900 font-bold text-sm hover:bg-amber-400 disabled:opacity-50 transition-all duration-200 shadow-lg shadow-amber-500/20"
        >
          {loading ? 'Confirmando...' : 'Confirmar agendamento'}
        </button>
      </form>
    </div>
  )
}
