import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { CompanyProvider } from '@/contexts/CompanyContext'
import { router } from '@/routes'

export default function App() {
  return (
    <AuthProvider>
      <CompanyProvider>
        <style>{`
          /* FORCED ULTRA-SLEEK LINEAR AESTHETIC */
          :root {
            --color-dark-950: #000000 !important;
            --color-dark-900: #050505 !important;
            --color-dark-800: #0a0a0a !important;
            --color-dark-700: #1a1a1a !important;
            --color-dark-100: #ffffff !important;
          }
          body {
            background-color: #000000 !important;
            color: #a3a3a3 !important;
          }
          .card {
            background-color: #0a0a0a !important;
            border: 1px solid #1a1a1a !important;
            box-shadow: 0 4px 24px -4px rgba(0, 0, 0, 0.5) !important;
            border-radius: 12px;
          }
          .btn-primary {
            background: #ffffff !important;
            color: #000000 !important;
            font-weight: 600 !important;
            border: none !important;
          }
          .btn-secondary {
            background: #0a0a0a !important;
            color: #d4d4d8 !important;
            border: 1px solid #1a1a1a !important;
          }
          th {
            background: transparent !important;
            border-bottom: 1px solid #1a1a1a !important;
          }
          .input-field {
            background: #050505 !important;
            border: 1px solid #1a1a1a !important;
            box-shadow: 0 1px 2px rgba(0,0,0,0.2) inset !important;
          }
        `}</style>
        <div style={{ position: 'fixed', top: 0, right: 0, backgroundColor: '#10b981', color: 'white', padding: '4px 12px', zIndex: 9999, fontSize: '12px', fontWeight: 'bold', borderBottomLeftRadius: '8px' }}>
          UI UPDATED: SUCCESS (LINEAR THEME)
        </div>
        <RouterProvider router={router} />
      </CompanyProvider>
    </AuthProvider>
  )
}
