import { useState, useCallback } from 'react'

interface UseLoadingReturn<T> {
  data: T | null
  loading: boolean
  error: string | null
  execute: (...args: unknown[]) => Promise<T | null>
  setData: (data: T | null) => void
  reset: () => void
}

/**
 * Generic hook for handling async operations with loading and error states.
 */
export function useLoading<T>(asyncFn: (...args: unknown[]) => Promise<T>): UseLoadingReturn<T> {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const execute = useCallback(
    async (...args: unknown[]) => {
      setLoading(true)
      setError(null)
      try {
        const result = await asyncFn(...args)
        setData(result)
        return result
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro desconhecido'
        setError(message)
        return null
      } finally {
        setLoading(false)
      }
    },
    [asyncFn]
  )

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setLoading(false)
  }, [])

  return { data, loading, error, execute, setData, reset }
}
