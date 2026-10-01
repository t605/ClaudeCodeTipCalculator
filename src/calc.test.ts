import { describe, expect, it } from 'vitest'
import {
  MAX_BILL,
  MAX_PEOPLE,
  MAX_TIP,
  buildShareText,
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

describe('buildShareText', () => {
  const result = calculate('321', '10', '2')
  it('leaves out the split when the user is not splitting', () => {
    expect(buildShareText('321', '10', 'PLN', result, null)).toBe(
      'Bill 321.00 PLN, tip 10%: tip 32.10, total 353.10 PLN.',
    )
  })
  it('adds the per-person amount when splitting', () => {
    expect(buildShareText('321', '10', 'PLN', result, '2')).toBe(
      'Bill 321.00 PLN, tip 10%: tip 32.10, total 353.10 PLN. Split between 2: 176.55 PLN each.',
    )
  })
  it('shows 0.00 for an empty bill and 0% for an empty tip', () => {
    const empty = calculate('', '', '2')
    expect(buildShareText('', '', 'EUR', empty, null)).toBe(
      'Bill 0.00 EUR, tip 0%: tip 0.00, total 0.00 EUR.',
    )
  })
  it('prints a half-typed bill with two decimals, not as typed', () => {
    const half = calculate('12.', '10', '2')
    expect(buildShareText('12.', '10', 'PLN', half, null)).toContain('Bill 12.00 PLN')
    const one = calculate('100.5', '10', '2')
    expect(buildShareText('100.5', '10', 'PLN', one, null)).toContain('Bill 100.50 PLN')
  })
})

describe('people minimum (typing vs calculating)', () => {
  it('limitInput lets 0 and 1 through while typing, so the field can be cleared and retyped', () => {
    expect(limitInput('', '1', MAX_PEOPLE, 0)).toBe('1')
    expect(limitInput('1', '0', MAX_PEOPLE, 0)).toBe('0')
  })
  it('calculate and the share text still treat 0, 1 and empty as 2 people', () => {
    for (const typed of ['0', '1', '']) {
      const r = calculate('100', '0', typed)
      expect(r.totalPerPerson).toBe(50)
      expect(buildShareText('100', '0', 'PLN', r, typed)).toContain('Split between 2:')
    }
  })
})

describe('half-typed numbers', () => {
  it('parseNumber reads "12." as 12 and ".5" as 0.5', () => {
    expect(parseNumber('12.')).toBe(12)
    expect(parseNumber('.5')).toBe(0.5)
  })
  it('limitInput accepts "12." and ".5" so they can be typed', () => {
    expect(limitInput('12', '12.', MAX_BILL, 2)).toBe('12.')
    expect(limitInput('', '.5', MAX_BILL, 2)).toBe('.5')
  })
})
