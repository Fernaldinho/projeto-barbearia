import { createBrowserRouter } from 'react-router-dom'

// Layouts
import { DashboardLayout } from '@/components/DashboardLayout'
import { ProtectedRoute } from '@/components/ProtectedRoute'

// Public Pages
import { LandingPage } from '@/pages/LandingPage'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { ForgotPasswordPage } from '@/pages/ForgotPasswordPage'
import { BookingPage } from '@/modules/booking/BookingPage'

// Private Module Pages
import { DashboardPage } from '@/modules/dashboard/DashboardPage'
import OnboardingPage from '@/pages/OnboardingPage'
import { ServicesPage } from '@/modules/services/ServicesPage'
import { ClientsPage } from '@/modules/clients/ClientsPage'
import { AppointmentsPage } from '@/modules/appointments/AppointmentsPage'
import { StaffPage } from '@/modules/staff/StaffPage'
import { BusinessHoursPage } from '@/modules/business-hours/BusinessHoursPage'
import { BlockedTimesPage } from '@/modules/blocked-times/BlockedTimesPage'
import { BillingPage } from '@/modules/billing/BillingPage'
import { SettingsPage } from '@/modules/settings/SettingsPage'

export const router = createBrowserRouter([
  // Public routes
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
  },
  {
    path: '/book/:slug',
    element: <BookingPage />,
  },

  // Onboarding (standalone, no sidebar)
  {
    path: '/onboarding',
    element: (
      <ProtectedRoute>
        <OnboardingPage />
      </ProtectedRoute>
    ),
  },

  // Private routes (wrapped in ProtectedRoute + DashboardLayout)
  {
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '/dashboard',
        element: <DashboardPage />,
      },
      {
        path: '/services',
        element: <ServicesPage />,
      },
      {
        path: '/clients',
        element: <ClientsPage />,
      },
      {
        path: '/appointments',
        element: <AppointmentsPage />,
      },
      {
        path: '/staff',
        element: <StaffPage />,
      },
      {
        path: '/business-hours',
        element: <BusinessHoursPage />,
      },
      {
        path: '/blocked-times',
        element: <BlockedTimesPage />,
      },
      {
        path: '/billing',
        element: <BillingPage />,
      },
      {
        path: '/settings',
        element: <SettingsPage />,
      },
    ],
  },
])
