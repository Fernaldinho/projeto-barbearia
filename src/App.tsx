import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { CompanyProvider } from '@/contexts/CompanyContext'
import { router } from '@/routes'

export default function App() {
  return (
    <AuthProvider>
      <CompanyProvider>
        <style>{`
          /* =============================================
             DESIGN COPIADO DA REFERÊNCIA agend-aii.lovable.app
             ============================================= */
          :root {
            --color-primary-400: #f59e0b !important;
            --color-primary-500: #e7b008 !important;
            --color-dark-950: #121212 !important;
            --color-dark-900: #141414 !important;
            --color-dark-800: #1a1a1a !important;
            --color-dark-700: #333333 !important;
            --color-dark-600: #444444 !important;
            --color-dark-500: #666666 !important;
            --color-dark-400: #999999 !important;
            --color-dark-300: #b3b3b3 !important;
            --color-dark-200: #cccccc !important;
            --color-dark-100: #f2f2f2 !important;
          }
          body {
            background-color: #121212 !important;
            color: #999999 !important;
          }
          /* Headings - Bebas Neue UPPERCASE como na referência */
          h1, h2 {
            font-family: 'Bebas Neue', 'Inter', sans-serif !important;
            text-transform: uppercase !important;
            letter-spacing: 0.04em !important;
            color: #f2f2f2 !important;
          }
          h1 {
            font-size: 30px !important;
            font-weight: 400 !important;
          }
          h2 {
            font-size: 22px !important;
            font-weight: 400 !important;
          }
          /* Cards */
          .card {
            background-color: #1a1a1a !important;
            border: 1px solid #333333 !important;
            border-radius: 12px !important;
            box-shadow: none !important;
          }
          /* Primary button - Dourado como na referência */
          .btn-primary {
            background: #e7b008 !important;
            color: #000000 !important;
            font-weight: 600 !important;
            border: none !important;
            box-shadow: none !important;
          }
          .btn-primary:hover {
            background: #f59e0b !important;
          }
          /* Secondary button */
          .btn-secondary {
            background: #1a1a1a !important;
            color: #cccccc !important;
            border: 1px solid #333333 !important;
            box-shadow: none !important;
          }
          /* Table header */
          th {
            background: transparent !important;
            border-bottom: 1px solid #333333 !important;
            color: #999999 !important;
          }
          td {
            border-bottom: 1px solid #262626 !important;
          }
          /* Inputs */
          .input-field, input[type="text"], input[type="email"], input[type="password"], input[type="tel"], input[type="number"], select, textarea {
            background: #141414 !important;
            border: 1px solid #333333 !important;
            color: #f2f2f2 !important;
            box-shadow: none !important;
          }
          .input-field:focus, input:focus, select:focus, textarea:focus {
            border-color: #e7b008 !important;
            box-shadow: 0 0 0 1px #e7b008 !important;
          }
          /* Nav items - Sidebar */
          .nav-item {
            color: #999999 !important;
          }
          .nav-item:hover {
            background: #1f1f1f !important;
            color: #f2f2f2 !important;
          }
          .nav-item.active {
            background: #1f1f1f !important;
            color: #e7b008 !important;
            border-left: none !important;
            border-radius: 8px !important;
          }
          .nav-item.active svg {
            color: #e7b008 !important;
          }
          /* Navbar */
          header {
            background-color: #121212 !important;
            border-bottom-color: #262626 !important;
          }
          /* Sidebar */
          aside {
            background-color: #141414 !important;
            border-right-color: #262626 !important;
          }
          /* Scrollbar custom */
          ::-webkit-scrollbar {
            width: 6px;
          }
          ::-webkit-scrollbar-track {
            background: #121212;
          }
          ::-webkit-scrollbar-thumb {
            background: #333333;
            border-radius: 3px;
          }
        `}</style>
        <RouterProvider router={router} />
      </CompanyProvider>
    </AuthProvider>
  )
}
