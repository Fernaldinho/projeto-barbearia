import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Navbar } from './Navbar'

export function DashboardLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-dark-950 flex flex-col md:flex-row">
      <Sidebar 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
      
      {/* Mobile Sidebar overlay backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-30 md:hidden" 
          onClick={() => setIsMobileMenuOpen(false)} 
        />
      )}

      <div className="flex-1 flex flex-col min-w-0 md:pl-[240px]">
        <Navbar onMenuClick={() => setIsMobileMenuOpen(true)} />
        
        <main className="flex-1 overflow-x-hidden pt-[64px] min-h-screen">
          <div className="p-[16px] sm:p-[20px] lg:p-[24px] max-w-[1280px] mx-auto w-full page-container">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
