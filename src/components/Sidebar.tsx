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
        "fixed left-0 top-0 z-40 h-screen w-[260px] flex flex-col bg-dark-900 border-r border-dark-800 transition-transform duration-300 md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      {/* Logo & Close Button (Mobile) */}
      <div className="flex items-center justify-between px-6 h-[64px] border-b border-dark-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
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
      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
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
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-dark-800 text-white'
                  : 'text-dark-400 hover:bg-dark-800/50 hover:text-dark-200'
              )}
            >
              <item.icon
                className={cn(
                  'w-4 h-4 transition-colors',
                  isActive ? 'text-primary-400' : 'text-dark-500 group-hover:text-dark-400'
                )}
              />
              {item.label}
            </NavLink>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-dark-800">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-dark-400 hover:bg-dark-800 hover:text-dark-200 transition-all duration-200"
        >
          <LogOut className="w-4 h-4 text-dark-500" />
          Sair
        </button>
      </div>
    </aside>
  )
}
