export function formatCount(count: number | null, unit?: string): string {
  if (count === null) return '—'

  return unit
    ? `${Math.round(Number(count)).toLocaleString()} ${unit}`
    : Math.round(Number(count)).toLocaleString()
}
