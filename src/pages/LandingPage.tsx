import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CalendarCheck,
  Users,
  Scissors,
  TrendingUp,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Play,
  Loader2
} from 'lucide-react'
import { ROUTES, APP_NAME } from '@/utils/constants'
import { useAuth } from '@/contexts/AuthContext'

const features = [
  {
    icon: CalendarCheck,
    title: 'Agendamento Online',
    description: 'Seus clientes agendam horários 24h pelo celular. Sem ligações, sem confusão.',
  },
  {
    icon: Users,
    title: 'Gestão de Clientes',
    description: 'Cadastro completo com histórico de atendimentos e preferências.',
  },
  {
    icon: Scissors,
    title: 'Catálogo de Serviços',
    description: 'Organize seus serviços com preços, duração e disponibilidade.',
  },
  {
    icon: TrendingUp,
    title: 'Relatórios Financeiros',
    description: 'Acompanhe seu faturamento, comissões e métricas importantes.',
  },
]

const plans = [
  {
    name: 'Gratuito',
    price: 'R$ 0',
    period: '/mês',
    features: ['50 clientes', '10 serviços', '100 agendamentos/mês', 'Suporte por email'],
    highlight: false,
  },
  {
    name: 'Profissional',
    price: 'R$ 79',
    period: '/mês',
    features: ['Clientes ilimitados', 'Serviços ilimitados', 'Agendamentos ilimitados', 'Relatórios avançados', 'Suporte prioritário'],
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: 'R$ 149',
    period: '/mês',
    features: ['Tudo do Profissional', 'Múltiplas unidades', 'API personalizada', 'Gerente de conta dedicado'],
    highlight: false,
  },
]

export function LandingPage() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const [demoLoading, setDemoLoading] = useState(false)

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleDemoAccess = async () => {
    setDemoLoading(true)
    try {
      // Tenta login com conta demo (precisa ser criada manualmente ou tratar o erro)
      const { error } = await login('demo@barberpro.com', '123456')
      if (!error) {
        navigate(ROUTES.DASHBOARD)
      } else {
        navigate(ROUTES.REGISTER) // Fallback se não existir demo
      }
    } catch (err) {
      navigate(ROUTES.REGISTER)
    } finally {
      setDemoLoading(false)
    }
  }

  const PrimaryCallToAction = ({ className = '' }: { className?: string }) => {
    if (user) {
      return (
        <Link to={ROUTES.DASHBOARD} className={`btn-primary ${className}`}>
          Acessar Dashboard
          <ArrowRight className="w-4 h-4" />
        </Link>
      )
    }
    return (
      <Link to={ROUTES.REGISTER} className={`btn-primary ${className}`}>
        Começar grátis
        <ArrowRight className="w-4 h-4" />
      </Link>
    )
  }

  return (
    <div className="min-h-screen bg-dark-950 text-white overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-950/80 backdrop-blur-xl border-b border-dark-700/30">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-dark-950" />
            </div>
            <span className="text-lg font-bold tracking-tight">{APP_NAME}</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollToSection('features')} className="text-sm font-medium text-dark-300 hover:text-white transition-colors">Recursos</button>
            <button onClick={() => scrollToSection('pricing')} className="text-sm font-medium text-dark-300 hover:text-white transition-colors">Preços</button>
          </div>

          <div className="flex items-center gap-4">
            {!user && (
              <Link to={ROUTES.LOGIN} className="text-sm text-dark-300 hover:text-white transition-colors">
                Entrar
              </Link>
            )}
            <PrimaryCallToAction className="text-sm" />
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6">
        {/* Background glows */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-primary-400/5 rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4" />
            Sistema #1 para barbearias e salões
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            Sua barbearia no{' '}
            <span className="bg-gradient-to-r from-primary-400 to-primary-200 bg-clip-text text-transparent">
              próximo nível
            </span>
          </h1>

          <p className="text-lg md:text-xl text-dark-300 max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Transforme visitantes em clientes fiéis. Automatize agendamentos, gerencie sua equipe e acompanhe seu faturamento. Tudo em um só lugar.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <PrimaryCallToAction className="text-base px-8 py-3.5" />
            
            <button
              onClick={() => scrollToSection('features')}
              className="btn-secondary text-base px-8 py-3.5"
            >
              Ver como funciona
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Tudo que você precisa</h2>
            <p className="text-dark-300 text-lg">Ferramentas profissionais projetadas para otimizar seu tempo</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="card p-8 hover:border-primary-500/30 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary-500/10 flex items-center justify-center mb-5">
                  <feature.icon className="w-6 h-6 text-primary-400" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                <p className="text-dark-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Demo / CTA Section */}
      <section className="py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary-500/5" />
        <div className="max-w-4xl mx-auto text-center relative z-10 card p-12 border-primary-500/20">
          <h2 className="text-3xl font-bold mb-4">Quer ver na prática?</h2>
          <p className="text-dark-300 mb-8 max-w-2xl mx-auto">
            Acesse nosso ambiente de demonstração e explore todas as funcionalidades do sistema como se fosse seu.
          </p>
          <button 
            onClick={handleDemoAccess} 
            disabled={demoLoading}
            className="btn-primary text-base px-8 py-3.5 mx-auto"
          >
            {demoLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
            <>
              <Play className="w-5 h-5 fill-current" />
              Testar Demonstração
            </>
            )}
          </button>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Planos simples e transparentes</h2>
            <p className="text-dark-300 text-lg">Comece de graça e cresça junto com o seu negócio</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`card p-8 flex flex-col transition-transform hover:-translate-y-1 ${
                  plan.highlight
                    ? 'border-primary-500/40 shadow-2xl shadow-primary-500/10 relative transform md:-translate-y-4 md:hover:-translate-y-6'
                    : 'border-dark-700/50 hover:border-dark-600'
                }`}
              >
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-primary-500 text-dark-950 text-xs font-bold uppercase tracking-wider shadow-lg">
                    Mais popular
                  </div>
                )}
                <h3 className="text-xl font-bold mb-2 text-white">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                  <span className="text-dark-400 font-medium">{plan.period}</span>
                </div>
                <ul className="space-y-4 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm text-dark-200">
                      <CheckCircle2 className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                      <span className="leading-snug">{feature}</span>
                    </li>
                  ))}
                </ul>
                <PrimaryCallToAction className={plan.highlight ? 'w-full justify-center py-3' : 'w-full justify-center py-3 bg-dark-800 text-white hover:bg-dark-700 hover:border-dark-600 border-dark-700'} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-dark-800 bg-dark-950">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-dark-950" />
            </div>
            <span className="font-bold text-white tracking-tight">{APP_NAME}</span>
          </div>
          
          <div className="flex items-center gap-6">
            <button onClick={() => scrollToSection('features')} className="text-sm text-dark-400 hover:text-white transition-colors">Recursos</button>
            <button onClick={() => scrollToSection('pricing')} className="text-sm text-dark-400 hover:text-white transition-colors">Preços</button>
            <Link to={ROUTES.LOGIN} className="text-sm text-dark-400 hover:text-white transition-colors">Login</Link>
          </div>
          
          <p className="text-sm text-dark-500">
            © {new Date().getFullYear()} {APP_NAME}. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
