import { useEffect, useRef, useState } from 'react'
import './Actions.css'

interface ActionsProps {
  /** The text to share or copy. */
  shareText: string
  onClear: () => void
}

/** Footer buttons: share the result, reload the page, clear all inputs. */
export function Actions({ shareText, onClear }: ActionsProps) {
  const [note, setNote] = useState('')
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  // Stop a pending "clear the note" timer when the component goes away.
  useEffect(() => () => clearTimeout(timer.current), [])

  const share = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Tip calculator', text: shareText })
        return
      }
      await navigator.clipboard.writeText(shareText)
      setNote('Copied to clipboard')
    } catch (e) {
      // Closing the share sheet rejects with AbortError; that is not a failure.
      if (e instanceof DOMException && e.name === 'AbortError') return
      setNote('Could not share')
    }
    // Restart the timer so a second press does not get its note cleared by the first timer.
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setNote(''), 2500)
  }

  return (
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
        <button type="button" className="action" onClick={onClear}>
          Clear all changes
        </button>
      </div>
      <p className="note" role="status">
        {note}
      </p>
    </footer>
  )
}
