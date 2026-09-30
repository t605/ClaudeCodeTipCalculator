import { useState } from 'react'
import {
  MAX_BILL,
  MAX_TIP,
  calculate,
  formatAmount,
  parsePeople,
} from './calc'
import { DEFAULTS } from './constants'
import { CurrencySelect } from './components/CurrencySelect'
import { NumberField } from './components/NumberField'
import { ResultField } from './components/ResultField'
import { SplitSection } from './components/SplitSection'
import { TipPresets } from './components/TipPresets'
import './App.css'

function App() {
  const [bill, setBill] = useState(DEFAULTS.bill)
  const [tip, setTip] = useState(DEFAULTS.tip)
  const [currency, setCurrency] = useState(DEFAULTS.currency)
  const [people, setPeople] = useState(DEFAULTS.people)
  const [splitOpen, setSplitOpen] = useState(false)
  const [shareNote, setShareNote] = useState('')

  const { tipAmount, total, tipPerPerson, totalPerPerson } = calculate(bill, tip, people)

  const reset = () => {
    setBill(DEFAULTS.bill)
    setTip(DEFAULTS.tip)
    setCurrency(DEFAULTS.currency)
    setPeople(DEFAULTS.people)
    setSplitOpen(false)
  }

  const share = async () => {
    const text =
      `Bill ${bill || '0'} ${currency}, tip ${tip || '0'}%: tip ${formatAmount(tipAmount)}, ` +
      `total ${formatAmount(total)} ${currency}. ` +
      `Split between ${parsePeople(people)}: ${formatAmount(totalPerPerson)} ${currency} each.`
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Tip calculator', text })
        return
      }
      await navigator.clipboard.writeText(text)
      setShareNote('Copied to clipboard')
    } catch (e) {
      // Closing the share sheet rejects with AbortError; that is not a failure.
      if (e instanceof DOMException && e.name === 'AbortError') return
      setShareNote('Could not share')
    }
    setTimeout(() => setShareNote(''), 2500)
  }

  return (
    <main className="page">
      <h1 className="title">Tip Calculator</h1>
      <section className="card" aria-label="Tip calculator">
        <NumberField
          id="bill"
          label="Bill"
          value={bill}
          onValueChange={setBill}
          max={MAX_BILL}
          decimals={2}
          unit={<CurrencySelect value={currency} onChange={setCurrency} />}
        />

        <NumberField
          id="tip"
          label="Tip"
          value={tip}
          onValueChange={setTip}
          max={MAX_TIP}
          unit={<span className="unit">%</span>}
          below={<TipPresets value={tip} onSelect={setTip} />}
        />

        <ResultField id="tip-amount" label="Tip amount" value={formatAmount(tipAmount)} unit={currency} />
        <ResultField id="total" label="Total" value={formatAmount(total)} unit={currency} total />

        <SplitSection
          open={splitOpen}
          onToggle={() => setSplitOpen((o) => !o)}
          people={people}
          onPeopleChange={setPeople}
          tipPerPerson={formatAmount(tipPerPerson)}
          totalPerPerson={formatAmount(totalPerPerson)}
          currency={currency}
        />

        <footer className="actions">
          <button type="button" className="action share" onClick={share}>
            <span className="share-icon" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <path d="M8.6 10.5l7-4M8.6 13.5l7 4" stroke="currentColor" strokeWidth="2" />
              </svg>
            </span>
            Share result
          </button>
          <div className="actions-col">
            <button type="button" className="action" onClick={() => window.location.reload()}>
              Reload calculator
            </button>
            <button type="button" className="action" onClick={reset}>
              Clear all changes
            </button>
          </div>
          <p className="note" role="status">
            {shareNote}
          </p>
        </footer>
      </section>
    </main>
  )
}

export default App
