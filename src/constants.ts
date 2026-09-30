import { MIN_PEOPLE } from './calc'

export const CURRENCIES = ['PLN', 'EUR', 'USD', 'GBP', 'HUF', 'ILS', 'CZK', 'CHF']
export const TIP_PRESETS = ['5', '10', '15', '20']

/** The reset state: empty bill and tip (shown as 0), PLN, minimum people. */
export const DEFAULTS = { bill: '', tip: '', currency: 'PLN', people: String(MIN_PEOPLE) }
