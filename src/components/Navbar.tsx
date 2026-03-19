import { Bell, Menu } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { getInitials } from '@/utils/helpers'
import { useLocation } from 'react-router-dom'

const routeTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/services': 'Serviços',
  '/clients': 'Clientes',
  '/appointments': 'Agendamentos',
  '/staff': 'Equipe',
  '/business-hours': 'Horários de Funcionamento',
  '/blocked-times': 'Bloqueios de Agenda',
  '/billing': 'Faturamento',
  '/settings': 'Configurações',
}

interface NavbarProps {
  onMenuClick: () => void
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const { user } = useAuth()
  const location = useLocation()
  const userName = user?.user_metadata?.full_name || user?.email || 'Usuário'
  
  const pageTitle = routeTitles[location.pathname] || 'Dashboard'

  return (
    <header className="fixed top-0 right-0 z-30 h-[64px] bg-dark-950/80 backdrop-blur-lg border-b border-dark-800 left-0 md:left-[260px] transition-all">
      <div className="flex items-center justify-between h-full px-4 sm:px-6">
        
        {/* Left side: Mobile Hamburger + Title */}
        <div className="flex items-center gap-4 flex-1">
          <button 
            onClick={onMenuClick}
            className="md:hidden p-2 -ml-2 text-dark-400 hover:text-white rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <h1 className="text-lg font-semibold text-white hidden sm:block !mb-0">{pageTitle}</h1>
          <h1 className="text-base font-semibold text-white sm:hidden !mb-0">{pageTitle}</h1>
        </div>

        {/* Right side: Actions & User Info */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <button className="relative p-2 rounded-lg text-dark-400 hover:bg-dark-800 hover:text-white transition-all">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-primary-500 rounded-full" />
          </button>

          <div className="flex items-center gap-3 pl-3 sm:pl-4 border-l border-dark-800">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium text-white leading-none mb-1">{userName}</p>
              <p className="text-xs text-dark-400 leading-none">Admin</p>
            </div>
            <div className="w-8 h-8 rounded-lg bg-dark-800 border border-dark-700 flex items-center justify-center">
              <span className="text-xs font-semibold text-primary-400">{getInitials(userName)}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
