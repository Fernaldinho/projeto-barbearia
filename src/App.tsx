import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { CompanyProvider } from '@/contexts/CompanyContext'
import { router } from '@/routes'

export default function App() {
  return (
    <AuthProvider>
      <CompanyProvider>
        {/* TEST INDICATOR FOR THE USER */}
        <div style={{ position: 'fixed', top: 0, left: '50%', transform: 'translateX(-50%)', backgroundColor: 'red', color: 'white', padding: '10px 20px', zIndex: 9999, fontSize: '24px', fontWeight: 'bold', borderRadius: '0 0 10px 10px' }}>
          UI UPDATED: APP ROOT RE-RENDERED
        </div>
        <RouterProvider router={router} />
      </CompanyProvider>
    </AuthProvider>
  )
}
