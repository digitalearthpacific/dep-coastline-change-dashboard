// Normalize function: lowercases, strips punctuation, collapses spaces
export function normalize(str: string) {
  return str
    .toLowerCase()
    .replace(/[\s,]+/g, ' ') // spaces + commas -> single space
    .trim()
}
