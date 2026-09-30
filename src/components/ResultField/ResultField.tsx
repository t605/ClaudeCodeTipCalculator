import { Field } from '../Field'

interface ResultFieldProps {
  id: string
  label: string
  /** Already formatted, e.g. "32.10". */
  value: string
  unit: string
  /** Highlighted style used for the two "total" results. */
  total?: boolean
}

/** A read-only calculated value with its currency. */
export function ResultField({ id, label, value, unit, total }: ResultFieldProps) {
  return (
    <Field id={id} label={label} boxClassName={total ? 'readonly total' : 'readonly'}>
      <output id={id}>{value}</output>
      <span className="unit">{unit}</span>
    </Field>
  )
}
