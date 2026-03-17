import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from './AuthContext'
import type { Company, PlanFeatures } from '@/types'
import { PLAN_FEATURES, PLANS } from '@/utils/constants'

interface CompanyContextType {
  company: Company | null
  plan: PlanFeatures
  loading: boolean
  features: {
    hasReports: boolean
    hasBilling: boolean
    maxClients: number
    maxServices: number
    maxAppointmentsPerMonth: number
  }
  refreshCompany: () => Promise<void>
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined)

export function CompanyProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [company, setCompany] = useState<Company | null>(null)
  const [loading, setLoading] = useState(true)

  const plan = company
    ? PLAN_FEATURES[company.plan as keyof typeof PLAN_FEATURES]
    : PLAN_FEATURES[PLANS.FREE]

  const features = {
    hasReports: plan.hasReports,
    hasBilling: plan.hasBilling,
    maxClients: plan.maxClients,
    maxServices: plan.maxServices,
    maxAppointmentsPerMonth: plan.maxAppointmentsPerMonth,
  }

  const fetchCompany = async () => {
    if (!user) {
      setCompany(null)
      setLoading(false)
      return
    }

    try {
      // First get the user profile to find the company_id
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('company_id')
        .eq('id', user.id)
        .single()

      if (profileError || !profile?.company_id) {
        setCompany(null)
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', profile.company_id)
        .single()

      if (error) {
        console.error('Error fetching company:', error)
        setCompany(null)
      } else {
        setCompany(data)
      }
    } catch (err) {
      console.error('Error fetching company:', err)
      setCompany(null)
    } finally {
      setLoading(false)
    }
  }

  const refreshCompany = async () => {
    setLoading(true)
    await fetchCompany()
  }

  useEffect(() => {
    fetchCompany()
  }, [user])

  return (
    <CompanyContext.Provider
      value={{
        company,
        plan,
        loading,
        features,
        refreshCompany,
      }}
    >
      {children}
    </CompanyContext.Provider>
  )
}

export function useCompany() {
  const context = useContext(CompanyContext)
  if (context === undefined) {
    throw new Error('useCompany must be used within a CompanyProvider')
  }
  return context
}
