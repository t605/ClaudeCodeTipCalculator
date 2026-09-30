import { describe, expect, it } from 'vitest'
import {
  MAX_BILL,
  MAX_PEOPLE,
  MAX_TIP,
  calculate,
  formatAmount,
  limitInput,
  parseNumber,
  parsePeople,
} from './calc'

describe('parseNumber', () => {
  it('accepts dot decimals (and a pasted comma)', () => {
    expect(parseNumber('321.50')).toBe(321.5)
    expect(parseNumber('321,50')).toBe(321.5)
  })
  it('returns 0 for empty, invalid or negative input', () => {
    expect(parseNumber('')).toBe(0)
    expect(parseNumber('abc')).toBe(0)
    expect(parseNumber('-5')).toBe(0)
  })
})

describe('limitInput (bill: max 100000, 2 decimals)', () => {
  const bill = (prev: string, next: string) => limitInput(prev, next, MAX_BILL, 2)
  it('allows up to two decimals', () => {
    expect(bill('12.3', '12.34')).toBe('12.34')
    expect(bill('12', '12.')).toBe('12.')
  })
  it('rejects a third decimal', () => {
    expect(bill('12.34', '12.345')).toBe('12.34')
  })
  it('rejects negatives, letters and values above the maximum', () => {
    expect(bill('5', '-5')).toBe('5')
    expect(bill('5', '5e')).toBe('5')
    expect(bill('10000', '100001')).toBe('10000')
    expect(bill('99999', '100000')).toBe('100000')
  })
  it('allows clearing the field', () => {
    expect(bill('5', '')).toBe('')
  })
  it('drops leading zeros but keeps "0." and a lone zero', () => {
    expect(bill('0', '07')).toBe('7')
    expect(bill('0', '0000')).toBe('0')
    expect(bill('0', '0.')).toBe('0.')
    expect(bill('0', '00.5')).toBe('0.5')
    expect(bill('', '0')).toBe('0')
  })
})

describe('limitInput (whole numbers)', () => {
  it('tip: integers 0..100 only', () => {
    expect(limitInput('1', '10', MAX_TIP, 0)).toBe('10')
    expect(limitInput('10', '10.5', MAX_TIP, 0)).toBe('10')
    expect(limitInput('10', '101', MAX_TIP, 0)).toBe('10')
    expect(limitInput('10', '100', MAX_TIP, 0)).toBe('100')
  })
  it('tip: no leading zeros (0 then 100 gives 100, not 0100)', () => {
    expect(limitInput('0', '0100', MAX_TIP, 0)).toBe('100')
  })
  it('people: integers up to 50 only', () => {
    expect(limitInput('5', '50', MAX_PEOPLE, 0)).toBe('50')
    expect(limitInput('5', '51', MAX_PEOPLE, 0)).toBe('5')
    expect(limitInput('5', '5.5', MAX_PEOPLE, 0)).toBe('5')
  })
})

describe('parsePeople', () => {
  it('clamps to 2..50; empty or invalid counts as 2', () => {
    expect(parsePeople('4')).toBe(4)
    expect(parsePeople('500')).toBe(50)
    expect(parsePeople('1')).toBe(2)
    expect(parsePeople('')).toBe(2)
    expect(parsePeople('abc')).toBe(2)
  })
})

describe('calculate', () => {
  it('matches the screenshot example', () => {
    const r = calculate('321.00', '10', '2')
    expect(formatAmount(r.tipAmount)).toBe('32.10')
    expect(formatAmount(r.total)).toBe('353.10')
  })
  it('matches the split screenshot example (2 people)', () => {
    const r = calculate('321.00', '10', '2')
    expect(formatAmount(r.tipPerPerson)).toBe('16.05')
    expect(formatAmount(r.totalPerPerson)).toBe('176.55')
  })
  it('gives all zeros for the reset state', () => {
    const r = calculate('', '', '2')
    expect(formatAmount(r.total)).toBe('0.00')
    expect(formatAmount(r.totalPerPerson)).toBe('0.00')
  })
})

describe('formatAmount rounding', () => {
  it('rounds half a cent up despite floating-point error', () => {
    expect(formatAmount(1.005)).toBe('1.01')
    expect(formatAmount(2.675)).toBe('2.68')
    expect(formatAmount(0.145)).toBe('0.15')
    expect(formatAmount(8.325)).toBe('8.33')
  })
  it('keeps ordinary values unchanged', () => {
    expect(formatAmount(32.1)).toBe('32.10')
    expect(formatAmount(0)).toBe('0.00')
    expect(formatAmount(353.1)).toBe('353.10')
  })
})
