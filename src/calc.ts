// Pure calculation helpers, kept separate from the UI so they can be unit-tested.

/** Accepts "321,00" or "321.00"; returns 0 for empty/invalid/negative input. */
export function parseNumber(value: string): number {
  const n = parseFloat(value.replace(',', '.'))
  return Number.isFinite(n) && n > 0 ? n : 0
}

/** Keeps only digits and one decimal separator (comma or dot). */
export function sanitizeDecimal(value: string): string {
  const cleaned = value.replace(/[^\d.,]/g, '')
  const i = cleaned.search(/[.,]/)
  if (i === -1) return cleaned
  return cleaned.slice(0, i + 1) + cleaned.slice(i + 1).replace(/[.,]/g, '')
}

/** Two decimals with a comma, e.g. 32.1 -> "32,10". */
export function formatAmount(value: number): string {
  return value.toFixed(2).replace('.', ',')
}

export const MAX_PEOPLE = 99

/** Whole number of people, clamped to 1..MAX_PEOPLE; empty/invalid counts as 1. */
export function parsePeople(value: string): number {
  const n = parseInt(value, 10)
  return Number.isFinite(n) ? Math.min(MAX_PEOPLE, Math.max(1, n)) : 1
}

export interface TipResult {
  tipAmount: number
  total: number
  tipPerPerson: number
  totalPerPerson: number
}

export function calculate(bill: string, tipPercent: string, people: string): TipResult {
  const billValue = parseNumber(bill)
  const tipAmount = (billValue * parseNumber(tipPercent)) / 100
  const total = billValue + tipAmount
  const n = parsePeople(people)
  return { tipAmount, total, tipPerPerson: tipAmount / n, totalPerPerson: total / n }
}
