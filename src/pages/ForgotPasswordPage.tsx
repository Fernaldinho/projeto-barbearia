import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, ArrowLeft, Mail } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { ROUTES, APP_NAME } from '@/utils/constants'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { resetPassword } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { error } = await resetPassword(email)
      if (error) {
        setError('Erro ao enviar email. Verifique o endereço informado.')
      } else {
        setSent(true)
      }
    } catch {
      setError('Erro ao enviar email. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center px-6">
      {/* Background glows */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md animate-scale-in">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-dark-950" />
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">{APP_NAME}</span>
        </div>

        {/* Card */}
        <div className="card p-8">
          {sent ? (
            <div className="text-center animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-primary-500/10 flex items-center justify-center mx-auto mb-6">
                <Mail className="w-8 h-8 text-primary-400" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Email enviado!</h1>
              <p className="text-dark-300 text-sm mb-8">
                Verifique sua caixa de entrada em <strong className="text-white">{email}</strong> para redefinir sua senha.
              </p>
              <Link to={ROUTES.LOGIN} className="btn-primary justify-center w-full py-3">
                <ArrowLeft className="w-5 h-5" />
                Voltar para o login
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-white mb-2">Esqueceu a senha?</h1>
                <p className="text-dark-300 text-sm">
                  Informe seu email e enviaremos um link para redefinir sua senha.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="p-3 rounded-xl bg-danger-600/10 border border-danger-600/20 text-danger-500 text-sm text-center animate-fade-in">
                    {error}
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-dark-200 mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    className="input-field"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full justify-center py-3 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-dark-950 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    'Enviar link de recuperação'
                  )}
                </button>
              </form>

              <p className="text-center text-sm text-dark-400 mt-6">
                <Link to={ROUTES.LOGIN} className="text-primary-400 hover:text-primary-300 font-medium transition-colors inline-flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Voltar para o login
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
