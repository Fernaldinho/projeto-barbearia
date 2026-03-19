import { useState, useCallback } from 'react'
import {
  getAvailableSlots,
  type AvailabilityResult,
  type TimeSlot,
} from '@/lib/availability'

interface UseAvailabilityOptions {
  companyId: string | undefined
  serviceId: string
  date: string
}

interface UseAvailabilityReturn {
  result: AvailabilityResult | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

/**
 * React hook for fetching available time slots.
 *
 * Usage:
 * ```tsx
 * const { result, loading, error, refetch } = useAvailability({
 *   companyId: company?.id,
 *   serviceId: selectedServiceId,
 *   date: selectedDate,
 * })
 * ```
 */
export function useAvailability({
  companyId,
  serviceId,
  date,
}: UseAvailabilityOptions): UseAvailabilityReturn {
  const [result, setResult] = useState<AvailabilityResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    if (!companyId || !serviceId || !date) {
      setResult(null)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const data = await getAvailableSlots(companyId, date, serviceId)
      setResult(data)
    } catch (err: any) {
      console.error('Error fetching availability:', err)
      setError(err.message || 'Erro ao buscar horários disponíveis.')
      setResult(null)
    } finally {
      setLoading(false)
    }
  }, [companyId, serviceId, date])

  return { result, loading, error, refetch }
}

export type { AvailabilityResult, TimeSlot }
