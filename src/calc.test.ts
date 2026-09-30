import { describe, expect, it } from 'vitest'
import { calculate, formatAmount, parseNumber, parsePeople, sanitizeDecimal } from './calc'

describe('parseNumber', () => {
  it('accepts comma and dot decimals', () => {
    expect(parseNumber('321,50')).toBe(321.5)
    expect(parseNumber('321.50')).toBe(321.5)
  })
  it('returns 0 for empty, invalid or negative input', () => {
    expect(parseNumber('')).toBe(0)
    expect(parseNumber('abc')).toBe(0)
    expect(parseNumber('-5')).toBe(0)
  })
})

describe('sanitizeDecimal', () => {
  it('drops invalid characters and extra separators', () => {
    expect(sanitizeDecimal('1a2,3.4')).toBe('12,34')
    expect(sanitizeDecimal('-7')).toBe('7')
  })
})

describe('calculate', () => {
  it('matches the screenshot example', () => {
    const r = calculate('321,00', '10', '1')
    expect(formatAmount(r.tipAmount)).toBe('32,10')
    expect(formatAmount(r.total)).toBe('353,10')
  })
  it('matches the split screenshot example (2 people)', () => {
    const r = calculate('321,00', '10', '2')
    expect(formatAmount(r.tipPerPerson)).toBe('16,05')
    expect(formatAmount(r.totalPerPerson)).toBe('176,55')
  })
  it('treats empty or zero people as one', () => {
    expect(calculate('100', '0', '').totalPerPerson).toBe(100)
    expect(calculate('100', '0', '0').totalPerPerson).toBe(100)
  })
})

describe('parsePeople', () => {
  it('clamps to 1..99', () => {
    expect(parsePeople('4')).toBe(4)
    expect(parsePeople('500')).toBe(99)
    expect(parsePeople('abc')).toBe(1)
  })
})
