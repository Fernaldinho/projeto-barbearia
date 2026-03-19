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
          .nav-item:hover {
            background: #0a0a0a !important;
            color: #ffffff !important;
          }
          .nav-item.active {
            background: #1a1a1a !important;
            color: #ffffff !important;
            border-left: 2px solid #ffffff !important;
          }
        `}</style>
        <RouterProvider router={router} />
      </CompanyProvider>
    </AuthProvider>
  )
}
