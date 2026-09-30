import { TIP_PRESETS } from '../../constants'
import './TipPresets.css'

interface TipPresetsProps {
  /** The current tip percent, so the matching preset is highlighted. */
  value: string
  onSelect: (percent: string) => void
}

export function TipPresets({ value, onSelect }: TipPresetsProps) {
  return (
    <div className="chips" role="group" aria-label="Tip presets">
      {TIP_PRESETS.map((p) => (
        <button
          key={p}
          type="button"
          className={'chip' + (value === p ? ' active' : '')}
          aria-pressed={value === p}
          onClick={() => onSelect(p)}
        >
          {p}%
        </button>
      ))}
    </div>
  )
}
