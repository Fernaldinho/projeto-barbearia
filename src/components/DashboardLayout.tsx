import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Navbar } from './Navbar'

export function DashboardLayout() {
  return (
    <div className="min-h-screen bg-dark-950">
      <Sidebar />
      <Navbar />
      <main
        className="pt-[64px] min-h-screen transition-all duration-300"
        style={{ marginLeft: '260px' }}
      >
        <div className="p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
