import { MAX_PEOPLE, MIN_PEOPLE, parsePeople } from '../../calc'
import { NumberField } from '../NumberField'
import { ResultField } from '../ResultField'
import './SplitSection.css'

interface SplitSectionProps {
  open: boolean
  onToggle: () => void
  people: string
  onPeopleChange: (people: string) => void
  /** Already formatted amounts, e.g. "16.05". */
  tipPerPerson: string
  totalPerPerson: string
  currency: string
}

/** The collapsible "Are you splitting the bill?" part of the card. */
export function SplitSection({
  open,
  onToggle,
  people,
  onPeopleChange,
  tipPerPerson,
  totalPerPerson,
  currency,
}: SplitSectionProps) {
  return (
    <div className="split">
      <button
        type="button"
        className="split-toggle"
        aria-expanded={open}
        aria-controls="split-body"
        onClick={onToggle}
      >
        <svg
          className={'chevron' + (open ? '' : ' closed')}
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M6 15l6-6 6 6" />
        </svg>
        Are you splitting the bill?
      </button>

      {open && (
        <div id="split-body" className="split-body">
          <NumberField
            id="people"
            label="Number of people"
            value={people}
            onValueChange={onPeopleChange}
            onBlur={() => onPeopleChange(String(parsePeople(people)))}
            min={MIN_PEOPLE}
            max={MAX_PEOPLE}
            placeholder={String(MIN_PEOPLE)}
          />
          <ResultField
            id="tip-per-person"
            label="Tip per person"
            value={tipPerPerson}
            unit={currency}
          />
          <ResultField
            id="total-per-person"
            label="Total per person"
            value={totalPerPerson}
            unit={currency}
            total
          />
        </div>
      )}
    </div>
  )
}
