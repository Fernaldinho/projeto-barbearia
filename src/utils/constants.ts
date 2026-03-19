export const APP_NAME = 'BarberPro'
export const APP_VERSION = '1.0.0'

export const ROUTES = {
  // Public
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',

  // Private
  DASHBOARD: '/dashboard',
  SERVICES: '/services',
  CLIENTS: '/clients',
  APPOINTMENTS: '/appointments',
  STAFF: '/staff',
  BUSINESS_HOURS: '/business-hours',
  BLOCKED_TIMES: '/blocked-times',
  SETTINGS: '/settings',
  BILLING: '/billing',
  ONBOARDING: '/onboarding',
} as const

export const PLANS = {
  FREE: 'free',
  STARTER: 'starter',
  PRO: 'pro',
  ENTERPRISE: 'enterprise',
} as const

export const PLAN_FEATURES = {
  [PLANS.FREE]: {
    name: 'Gratuito',
    maxClients: 50,
    maxServices: 10,
    maxAppointmentsPerMonth: 100,
    hasReports: false,
    hasBilling: false,
  },
  [PLANS.STARTER]: {
    name: 'Starter',
    maxClients: 200,
    maxServices: 50,
    maxAppointmentsPerMonth: 500,
    hasReports: true,
    hasBilling: false,
  },
  [PLANS.PRO]: {
    name: 'Profissional',
    maxClients: -1, // unlimited
    maxServices: -1,
    maxAppointmentsPerMonth: -1,
    hasReports: true,
    hasBilling: true,
  },
  [PLANS.ENTERPRISE]: {
    name: 'Enterprise',
    maxClients: -1,
    maxServices: -1,
    maxAppointmentsPerMonth: -1,
    hasReports: true,
    hasBilling: true,
  },
} as const
