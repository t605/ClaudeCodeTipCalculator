import type { KeyboardEvent, ReactNode } from 'react'
import { limitInput } from '../../calc'
import { Field } from '../Field'

// Keys a number input would accept but this calculator must not:
// sign and exponent (and the decimal point for whole-number fields).
const blockKeys = (keys: string) => (e: KeyboardEvent<HTMLInputElement>) => {
  if (keys.includes(e.key)) e.preventDefault()
}
const blockDecimal = blockKeys('-+eE')
const blockNonInteger = blockKeys('-+eE.,')

interface NumberFieldProps {
  id: string
  label: string
  /** The value is kept as a string so typing "12." works. */
  value: string
  onValueChange: (value: string) => void
  onBlur?: () => void
  min?: number
  max: number
  /** Decimal places allowed; 0 means whole numbers only. */
  decimals?: number
  placeholder?: string
  /** Shown at the right of the box: a unit label or a currency select. */
  unit?: ReactNode
  /** Rendered under the box, e.g. the tip presets. */
  below?: ReactNode
}

/** A native number input that ignores keystrokes and values outside its rules. */
export function NumberField({
  id,
  label,
  value,
  onValueChange,
  onBlur,
  min = 0,
  max,
  decimals = 0,
  placeholder = '0',
  unit,
  below,
}: NumberFieldProps) {
  return (
    <Field id={id} label={label} below={below}>
      <input
        id={id}
        type="number"
        inputMode={decimals > 0 ? 'decimal' : 'numeric'}
        min={min}
        max={max}
        step={decimals > 0 ? 10 ** -decimals : 1}
        placeholder={placeholder}
        value={value}
        onKeyDown={decimals > 0 ? blockDecimal : blockNonInteger}
        onChange={(e) => onValueChange(limitInput(value, e.target.value, max, decimals))}
        onBlur={onBlur}
      />
      {unit}
    </Field>
  )
}
