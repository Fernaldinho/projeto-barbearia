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
    <header style={{ backgroundColor: '#121212', borderBottom: '1px solid #262626' }} className="fixed top-0 right-0 z-30 h-[64px] backdrop-blur-lg left-0 md:left-[240px] transition-all">
      <div className="flex items-center justify-between h-full px-[24px]">
        
        {/* Left side: Mobile Hamburger + Title */}
        <div className="flex items-center gap-4 flex-1">
          <button 
            onClick={onMenuClick}
            className="md:hidden p-2 -ml-2 text-dark-400 hover:text-white rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <h2 className="!mb-0 whitespace-nowrap" style={{ fontFamily: "'Bebas Neue', 'Inter', sans-serif", textTransform: 'uppercase', letterSpacing: '0.04em', fontSize: '22px', fontWeight: 400, color: '#f2f2f2' }}>{pageTitle}</h2>
        </div>

        {/* Right side: Actions & User Info */}
        <div className="flex items-center gap-[16px] shrink-0">
          <button className="relative p-2 rounded-lg text-dark-400 hover:bg-dark-800 hover:text-white transition-all">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#e7b008' }} />
          </button>

          <div className="flex items-center gap-[8px] pl-[16px] border-l border-dark-800">
            <div className="hidden sm:block text-right mr-2">
              <p className="text-small font-medium text-white mb-0.5">{userName}</p>
              <p className="text-[10px] text-dark-400 leading-none">Admin</p>
            </div>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#1a1a1a', border: '1px solid #333333' }}>
              <span className="text-xs font-semibold" style={{ color: '#e7b008' }}>{getInitials(userName)}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
