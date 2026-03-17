/**
 * Formats a date to locale string
 */
export function formatDate(date: Date | string, locale = 'pt-BR'): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString(locale)
}

/**
 * Formats a date to display time
 */
export function formatTime(date: Date | string, locale = 'pt-BR'): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })
}

/**
 * Formats currency in BRL
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

/**
 * Truncates a string to a specified length
 */
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

/**
 * Generates initials from a full name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

/**
 * Simple classnames utility
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}
