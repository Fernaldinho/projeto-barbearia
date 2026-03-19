import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Scissors,
  Users,
  CalendarCheck,
  Clock,
  Settings,
  CreditCard,
  LogOut,
  Sparkles,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { ROUTES, APP_NAME } from '@/utils/constants'
import { cn } from '@/utils/helpers'

const navItems = [
  { path: ROUTES.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
  { path: ROUTES.SERVICES, label: 'Serviços', icon: Scissors },
  { path: ROUTES.CLIENTS, label: 'Clientes', icon: Users },
  { path: ROUTES.APPOINTMENTS, label: 'Agendamentos', icon: CalendarCheck },
  { path: ROUTES.BUSINESS_HOURS, label: 'Horários', icon: Clock },
  { path: ROUTES.BILLING, label: 'Faturamento', icon: CreditCard },
  { path: ROUTES.SETTINGS, label: 'Configurações', icon: Settings },
]

export function Sidebar() {
  const { logout } = useAuth()
  const location = useLocation()

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-[260px] flex flex-col bg-dark-900 border-r border-dark-700/50">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 h-[64px] border-b border-dark-700/50">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-dark-950" />
        </div>
        <span className="text-lg font-bold text-white tracking-tight">{APP_NAME}</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-primary-500/10 text-primary-400 shadow-sm'
                  : 'text-dark-300 hover:bg-dark-800 hover:text-white'
              )}
            >
              <item.icon
                className={cn(
                  'w-5 h-5 transition-colors',
                  isActive ? 'text-primary-400' : 'text-dark-400'
                )}
              />
              {item.label}
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-400" />
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-dark-700/50">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-dark-400 hover:bg-danger-600/10 hover:text-danger-500 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          Sair
        </button>
      </div>
    </aside>
  )
}
