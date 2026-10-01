// Pure calculation and input-rule helpers, kept separate from the UI so they can be unit-tested.

export const MAX_BILL = 100000
export const MAX_TIP = 100
export const MIN_PEOPLE = 2
export const MAX_PEOPLE = 50

/** Returns 0 for empty/invalid/negative input. Accepts "." (and "," if pasted). */
export function parseNumber(value: string): number {
  const n = parseFloat(value.replace(',', '.'))
  return Number.isFinite(n) && n > 0 ? n : 0
}

/**
 * Decides whether a typed value is allowed: digits with at most `decimals`
 * decimal places and no more than `max`. Returns the new value, or the
 * previous one when the change must be rejected (so the field just ignores it).
 */
export function limitInput(prev: string, next: string, max: number, decimals: number): string {
  if (next === '') return ''
  const pattern = decimals > 0 ? new RegExp(`^\\d*(\\.\\d{0,${decimals}})?$`) : /^\d*$/
  if (!pattern.test(next)) return prev
  if (parseFloat(next) > max) return prev
  // "007" -> "7", "0100" -> "100"; keep a lone "0" and "0." / "0.5".
  return next.replace(/^0+(?=\d)/, '')
}

/** Two decimals with a dot, e.g. 32.1 -> "32.10". */
export function formatAmount(value: number): string {
  // toFixed alone misrounds binary floats (1.005 -> "1.00"); toPrecision(12)
  // strips the error in the last digits so half a cent rounds up.
  const cents = Math.round(Number((value * 100).toPrecision(12)))
  return (cents / 100).toFixed(2)
}

/** Whole number of people, clamped to MIN_PEOPLE..MAX_PEOPLE; empty/invalid counts as MIN_PEOPLE. */
export function parsePeople(value: string): number {
  const n = parseInt(value, 10)
  return Number.isFinite(n) ? Math.min(MAX_PEOPLE, Math.max(MIN_PEOPLE, n)) : MIN_PEOPLE
}

export interface TipResult {
  tipAmount: number
  total: number
  tipPerPerson: number
  totalPerPerson: number
}

/** One-line summary for the Share button. Pass `people` only when the user is splitting. */
export function buildShareText(
  bill: string,
  tipPercent: string,
  currency: string,
  result: TipResult,
  people: string | null,
): string {
  // Show the bill with two decimals, like every other amount ("12." would otherwise print as typed).
  const text =
    `Bill ${formatAmount(parseNumber(bill))} ${currency}, tip ${parseNumber(tipPercent)}%: ` +
    `tip ${formatAmount(result.tipAmount)}, total ${formatAmount(result.total)} ${currency}.`
  if (people === null) return text
  return `${text} Split between ${parsePeople(people)}: ${formatAmount(result.totalPerPerson)} ${currency} each.`
}

export function calculate(bill: string, tipPercent: string, people: string): TipResult {
  const billValue = parseNumber(bill)
  const tipAmount = (billValue * parseNumber(tipPercent)) / 100
  const total = billValue + tipAmount
  const n = parsePeople(people)
  return { tipAmount, total, tipPerPerson: tipAmount / n, totalPerPerson: total / n }
}
