import { useEffect, useState } from 'react'
import './LastSecureAccess.css'

const CYCLE_MS = 5000

const ACCESS_LOCATION = 'Ahmedabad, India'
const ACCESS_BROWSER = 'Chrome'
const ACCESS_TIME = '2 mins ago'

function LocationIcon() {
  return (
    <svg className="last-access__icon-svg" viewBox="0 0 24 24" width="16" height="16" aria-hidden>
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11Z"
      />
      <circle cx="12" cy="10" r="2" fill="currentColor" />
    </svg>
  )
}

export function LastSecureAccess() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setVisible((prev) => !prev)
    }, CYCLE_MS)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <div
      className={`last-access${visible ? ' last-access--visible' : ' last-access--hidden'}`}
      role="status"
      aria-live="polite"
      aria-hidden={!visible}
    >
      <span className="last-access__icon">
        <LocationIcon />
      </span>
      <p className="last-access__text">
        <span className="last-access__label">Last secure access:</span>
        <span className="last-access__meta">
          {ACCESS_LOCATION}
          <span className="last-access__sep" aria-hidden>
            •
          </span>
          {ACCESS_BROWSER}
          <span className="last-access__sep" aria-hidden>
            •
          </span>
          {ACCESS_TIME}
        </span>
      </p>
    </div>
  )
}
