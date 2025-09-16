export function formatCount(count: number | null, unit?: string): string {
  if (count === null) return '—'
  if (count === 0) return 'n/a'

  return unit
    ? `${Math.round(Number(count)).toLocaleString()} ${unit}`
    : Math.round(Number(count)).toLocaleString()
}
