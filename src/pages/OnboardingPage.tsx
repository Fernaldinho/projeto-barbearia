import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, Phone, Mail, ArrowRight, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks'
import { generateSlug } from '@/utils/helpers'

export default function OnboardingPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    companyName: '',
    phone: '',
    email: user?.email || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      // 1. Generate unique slug
      const slug = generateSlug(formData.companyName)
      
      // 2. Create the company
      const { data: company, error: companyError } = await supabase
        .from('companies')
        .insert([
          {
            name: formData.companyName,
            slug,
            phone: formData.phone,
            email: formData.email,
          }
        ])
        .select()
        .single()

      if (companyError) throw companyError

      // 3. Create the user profile (linked as owner)
      const { error: profileError } = await supabase
        .from('users')
        .insert([
          {
            id: user.id,
            company_id: company.id,
            name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuário',
            email: user.email!,
            role: 'owner',
          }
        ])

      if (profileError) throw profileError

      // 4. Success! Redirect to dashboard
      // We force a refresh of the page or just navigate to dashboard
      // In a real app, you might want to update the CompanyContext state here
      window.location.href = '/dashboard'
    } catch (err: any) {
      console.error('Onboarding error:', err)
      setError(err.message || 'Erro ao configurar sua empresa. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#121212' }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] left-[10%] w-[400px] h-[400px] rounded-full blur-[120px]" style={{ backgroundColor: 'rgba(231, 176, 8, 0.05)' }} />
        <div className="absolute bottom-[10%] right-[10%] w-[300px] h-[300px] rounded-full blur-[100px]" style={{ backgroundColor: 'rgba(231, 176, 8, 0.03)' }} />
      </div>

      <div className="w-full max-w-md card p-8 relative z-10 slideInLeft">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/30">
            <Building2 className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Configure sua Barbearia</h1>
          <p className="text-gray-400">Precisamos de algumas informações para começar.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="companyName" className="text-sm font-medium text-gray-300 ml-1">
              Nome da Empresa
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Building2 className="w-5 h-5 text-gray-500 group-focus-within:text-primary transition-colors" />
              </div>
              <input
                id="companyName"
                type="text"
                required
                className="input-field pl-11"
                placeholder="Ex: Barber Shop Premium"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium text-gray-300 ml-1">
              Telefone Comercial
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Phone className="w-5 h-5 text-gray-500 group-focus-within:text-primary transition-colors" />
              </div>
              <input
                id="phone"
                type="tel"
                required
                className="input-field pl-11"
                placeholder="(00) 00000-0000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-300 ml-1">
              E-mail Comercial
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="w-5 h-5 text-gray-500 group-focus-within:text-primary transition-colors" />
              </div>
              <input
                id="email"
                type="email"
                required
                className="input-field pl-11"
                placeholder="contato@empresa.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 group transition-all"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Finalizar Configuração
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
