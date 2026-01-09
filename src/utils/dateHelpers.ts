import { format, parseISO, startOfDay } from 'date-fns'

export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, 'MMM d, yyyy')
}

export function formatDateTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, 'MMM d, yyyy HH:mm')
}

export function getDaysBetween(start: Date, end: Date): number {
  const startDay = startOfDay(start)
  const endDay = startOfDay(end)
  const diffTime = Math.abs(endDay.getTime() - startDay.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}
