import type { Session, User } from '@supabase/supabase-js'

// ============================================
// Auth Types
// ============================================
export interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
}

// ============================================
// Company Types
// ============================================
export interface Company {
  id: string
  name: string
  slug: string
  logo_url: string | null
  phone: string | null
  email: string | null
  address: string | null
  plan: PlanType
  owner_id: string
  created_at: string
  updated_at: string
}

export type PlanType = 'free' | 'starter' | 'pro' | 'enterprise'

export interface PlanFeatures {
  name: string
  maxClients: number
  maxServices: number
  maxAppointmentsPerMonth: number
  hasReports: boolean
  hasBilling: boolean
}

// ============================================
// Service Types
// ============================================
export interface Service {
  id: string
  company_id: string
  name: string
  description: string | null
  duration: number // minutes
  price: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ServiceFormData {
  name: string
  description: string
  duration: number
  price: number
  is_active: boolean
}

// ============================================
// Client Types
// ============================================
export interface Client {
  id: string
  company_id: string
  name: string
  email: string | null
  phone: string
  notes: string | null
  created_at: string
  updated_at: string
}

export interface ClientFormData {
  name: string
  email: string
  phone: string
  notes: string
}

// ============================================
// Staff Types
// ============================================
export interface Staff {
  id: string
  company_id: string
  name: string
  role: string | null
  avatar_url: string | null
  active: boolean
  created_at: string
  updated_at: string
}

export interface StaffFormData {
  name: string
  role: string
}

// ============================================
// Appointment Types
// ============================================
export interface Appointment {
  id: string
  company_id: string
  client_id: string
  service_id: string
  staff_id: string | null
  date: string
  start_time: string
  end_time: string
  status: AppointmentStatus
  notes: string | null
  created_at: string
  updated_at: string
  // Relations
  client?: Client
  service?: Service
  staff?: Staff
}

export type AppointmentStatus = 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'

export interface AppointmentFormData {
  client_id: string
  service_id: string
  staff_id: string
  date: string
  start_time: string
  notes: string
}

// ============================================
// Billing Types
// ============================================
export interface Invoice {
  id: string
  company_id: string
  amount: number
  status: InvoiceStatus
  due_date: string
  paid_at: string | null
  description: string | null
  created_at: string
}

export type InvoiceStatus = 'pending' | 'paid' | 'overdue' | 'cancelled'

// ============================================
// Business Hours & Availability
// ============================================
export interface BusinessHours {
  id: string
  company_id: string
  staff_id: string | null
  weekday: number // 0-6
  start_time: string
  end_time: string
}

export interface BlockedTime {
  id: string
  company_id: string
  date: string
  start_time: string
  end_time: string
  reason: string | null
  created_at: string
}

// ============================================
// Dashboard Types
// ============================================
export interface DashboardStats {
  totalClients: number
  totalServices: number
  appointmentsToday: number
  monthlyRevenue: number
}

