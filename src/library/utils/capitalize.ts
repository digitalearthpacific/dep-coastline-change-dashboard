export function capitalize(str: string): string {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function capitalizeWords(str: string): string {
  return str.replace(/\b\w/g, (char) => char.toUpperCase())
}
