import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Scissors,
  Users,
  CalendarCheck,
  Users2,
  Clock,
  CalendarOff,
  Settings,
  CreditCard,
  LogOut,
  Sparkles,
  X
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { ROUTES, APP_NAME } from '@/utils/constants'
import { cn } from '@/utils/helpers'

const navItems = [
  { path: ROUTES.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
  { path: ROUTES.SERVICES, label: 'Serviços', icon: Scissors },
  { path: ROUTES.CLIENTS, label: 'Clientes', icon: Users },
  { path: ROUTES.APPOINTMENTS, label: 'Agendamentos', icon: CalendarCheck },
  { path: ROUTES.STAFF, label: 'Equipe', icon: Users2 },
  { path: ROUTES.BUSINESS_HOURS, label: 'Horários', icon: Clock },
  { path: ROUTES.BLOCKED_TIMES, label: 'Bloqueios', icon: CalendarOff },
  { path: ROUTES.BILLING, label: 'Faturamento', icon: CreditCard },
  { path: ROUTES.SETTINGS, label: 'Configurações', icon: Settings },
]

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { logout } = useAuth()
  const location = useLocation()

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 z-40 h-screen w-[240px] flex flex-col transition-transform duration-300 md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
      style={{ backgroundColor: '#141414', borderRight: '1px solid #262626' }}
    >
      {/* Logo & Close Button (Mobile) */}
      <div className="flex items-center justify-between px-[16px] h-[64px] shrink-0" style={{ borderBottom: '1px solid #262626' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
            <Sparkles className="w-4 h-4 text-dark-950" />
          </div>
          <span className="text-base font-semibold text-white tracking-tight">{APP_NAME}</span>
        </div>
        
        <button 
          onClick={onClose}
          className="md:hidden p-2 -mr-2 text-dark-400 hover:text-white rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-[16px] py-[24px] overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => {
                if (window.innerWidth < 768) onClose()
              }}
              className={cn(
                'nav-item',
                isActive && 'active'
              )}
              style={isActive ? { background: '#1f1f1f', color: '#e7b008', borderRadius: '8px', borderLeft: 'none' } : {}}
            >
              <item.icon
                className={cn(
                  'w-4 h-4 transition-colors shrink-0'
                )}
                style={{ color: isActive ? '#e7b008' : '#666666' }}
              />
              {item.label}
            </NavLink>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-[16px] shrink-0" style={{ borderTop: '1px solid #262626' }}>
        <button
          onClick={logout}
          className="nav-item w-full"
        >
          <LogOut className="w-4 h-4 text-dark-500 shrink-0" />
          Sair
        </button>
      </div>
    </aside>
  )
}
