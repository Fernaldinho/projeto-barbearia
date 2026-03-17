/**
 * API service base configuration
 * This file can be extended with interceptors, error handling, etc.
 */

export { supabase } from '@/lib/supabase'

/**
 * Generic API error handler
 */
export function handleApiError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  return 'An unexpected error occurred'
}
