import { CURRENCIES } from '../../constants'

interface CurrencySelectProps {
  value: string
  onChange: (currency: string) => void
}

export function CurrencySelect({ value, onChange }: CurrencySelectProps) {
  return (
    <select
      aria-label="Currency"
      className="unit-select"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {CURRENCIES.map((c) => (
        <option key={c}>{c}</option>
      ))}
    </select>
  )
}
