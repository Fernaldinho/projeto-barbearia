import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { CompanyProvider } from '@/contexts/CompanyContext'
import { router } from '@/routes'

export default function App() {
  return (
    <AuthProvider>
      <CompanyProvider>
        <RouterProvider router={router} />
      </CompanyProvider>
    </AuthProvider>
  )
}
