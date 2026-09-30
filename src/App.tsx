import { useState } from 'react'
import { MAX_BILL, MAX_TIP, buildShareText, calculate, formatAmount } from './calc'
import { DEFAULTS } from './constants'
import { Actions } from './components/Actions'
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

  const result = calculate(bill, tip, people)

  const reset = () => {
    setBill(DEFAULTS.bill)
    setTip(DEFAULTS.tip)
    setCurrency(DEFAULTS.currency)
    setPeople(DEFAULTS.people)
    setSplitOpen(false)
  }

  const shareText = buildShareText(bill, tip, currency, result, splitOpen ? people : null)

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

        <ResultField id="tip-amount" label="Tip amount" value={formatAmount(result.tipAmount)} unit={currency} />
        <ResultField id="total" label="Total" value={formatAmount(result.total)} unit={currency} total />

        <SplitSection
          open={splitOpen}
          onToggle={() => setSplitOpen((o) => !o)}
          people={people}
          onPeopleChange={setPeople}
          tipPerPerson={formatAmount(result.tipPerPerson)}
          totalPerPerson={formatAmount(result.totalPerPerson)}
          currency={currency}
        />

        <Actions shareText={shareText} onClear={reset} />
      </section>
    </main>
  )
}

export default App
