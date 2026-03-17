import { Bell, Search } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { getInitials } from '@/utils/helpers'

export function Navbar() {
  const { user } = useAuth()
  const userName = user?.user_metadata?.full_name || user?.email || 'Usuário'

  return (
    <header className="fixed top-0 right-0 z-30 h-[64px] bg-dark-900/80 backdrop-blur-xl border-b border-dark-700/50" style={{ left: '260px' }}>
      <div className="flex items-center justify-between h-full px-6">
        {/* Search */}
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
          <input
            type="text"
            placeholder="Pesquisar..."
            className="w-full pl-10 pr-4 py-2 bg-dark-800 border border-dark-700 rounded-xl text-sm text-dark-100 placeholder-dark-400 outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/20 transition-all"
          />
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative p-2 rounded-xl text-dark-400 hover:bg-dark-800 hover:text-white transition-all">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary-400 rounded-full" />
          </button>

          {/* User */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500/20 to-primary-700/20 border border-primary-500/20 flex items-center justify-center">
              <span className="text-xs font-bold text-primary-400">{getInitials(userName)}</span>
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-white leading-tight">{userName}</p>
              <p className="text-xs text-dark-400">Admin</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
