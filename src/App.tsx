import { useState } from 'react'
import { calculate, formatAmount, MAX_PEOPLE, parsePeople, sanitizeDecimal } from './calc'
import './App.css'

const CURRENCIES = ['PLN', 'EUR', 'USD', 'GBP', 'HUF', 'ILS', 'CZK', 'CHF']
const TIP_PRESETS = ['5', '10', '15', '20']

const DEFAULTS = { bill: '321,00', tip: '10', currency: 'PLN', people: '2' }

function App() {
  const [bill, setBill] = useState(DEFAULTS.bill)
  const [tip, setTip] = useState(DEFAULTS.tip)
  const [currency, setCurrency] = useState(DEFAULTS.currency)
  const [people, setPeople] = useState(DEFAULTS.people)
  const [splitOpen, setSplitOpen] = useState(true)
  const [shareNote, setShareNote] = useState('')

  const { tipAmount, total, tipPerPerson, totalPerPerson } = calculate(bill, tip, people)

  const reset = () => {
    setBill(DEFAULTS.bill)
    setTip(DEFAULTS.tip)
    setCurrency(DEFAULTS.currency)
    setPeople(DEFAULTS.people)
    setSplitOpen(true)
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
    } catch {
      setShareNote('Could not share')
    }
    setTimeout(() => setShareNote(''), 2500)
  }

  return (
    <main className="page">
      <section className="card" aria-label="Tip calculator">
        <header className="header">
          <h1 className="title">Tip Calculator</h1>
        </header>

        <div className="field">
          <label htmlFor="bill">Bill</label>
          <div className="input">
            <input
              id="bill"
              inputMode="decimal"
              placeholder="0,00"
              value={bill}
              onChange={(e) => setBill(sanitizeDecimal(e.target.value))}
            />
            <select
              aria-label="Currency"
              className="unit-select"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              {CURRENCIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="field">
          <label htmlFor="tip">Tip</label>
          <div className="input">
            <input
              id="tip"
              inputMode="decimal"
              placeholder="0"
              value={tip}
              onChange={(e) => setTip(sanitizeDecimal(e.target.value))}
            />
            <span className="unit">%</span>
          </div>
          <div className="chips" role="group" aria-label="Tip presets">
            {TIP_PRESETS.map((p) => (
              <button
                key={p}
                type="button"
                className={'chip' + (tip === p ? ' active' : '')}
                aria-pressed={tip === p}
                onClick={() => setTip(p)}
              >
                {p}%
              </button>
            ))}
          </div>
        </div>

        <div className="field">
          <label>Tip amount</label>
          <div className="input readonly" aria-live="polite">
            <output>{formatAmount(tipAmount)}</output>
            <span className="unit">{currency}</span>
          </div>
        </div>

        <div className="field">
          <label>Total</label>
          <div className="input readonly total" aria-live="polite">
            <output>{formatAmount(total)}</output>
            <span className="unit">{currency}</span>
          </div>
        </div>

        <div className="split">
          <button
            type="button"
            className="split-toggle"
            aria-expanded={splitOpen}
            aria-controls="split-body"
            onClick={() => setSplitOpen((o) => !o)}
          >
            <svg
              className={'chevron' + (splitOpen ? '' : ' closed')}
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

          {splitOpen && (
            <div id="split-body" className="split-body">
              <div className="field">
                <label htmlFor="people">Number of people</label>
                <div className="input">
                  <input
                    id="people"
                    inputMode="numeric"
                    maxLength={String(MAX_PEOPLE).length}
                    placeholder="1"
                    value={people}
                    onChange={(e) => setPeople(e.target.value.replace(/\D/g, ''))}
                  />
                </div>
              </div>

              <div className="field">
                <label>Tip per person</label>
                <div className="input readonly" aria-live="polite">
                  <output>{formatAmount(tipPerPerson)}</output>
                  <span className="unit">{currency}</span>
                </div>
              </div>

              <div className="field">
                <label>Total per person</label>
                <div className="input readonly total" aria-live="polite">
                  <output>{formatAmount(totalPerPerson)}</output>
                  <span className="unit">{currency}</span>
                </div>
              </div>
            </div>
          )}
        </div>

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
