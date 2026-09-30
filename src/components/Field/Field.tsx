import type { ReactNode } from 'react'
import './Field.css'

interface FieldProps {
  /** id of the control inside, so the label is linked to it. */
  id?: string
  label: string
  /** Extra classes for the input box, e.g. "readonly total". */
  boxClassName?: string
  children: ReactNode
  /** Rendered under the box, e.g. the tip presets. */
  below?: ReactNode
}

/** A label above a rounded box; the shared shape of every field in the card. */
export function Field({ id, label, boxClassName, children, below }: FieldProps) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className={boxClassName ? `input ${boxClassName}` : 'input'}>{children}</div>
      {below}
    </div>
  )
}
