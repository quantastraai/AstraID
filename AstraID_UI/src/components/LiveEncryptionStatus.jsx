import { useEffect, useState } from 'react'
import './LiveEncryptionStatus.css'

const METRICS = [
  { label: 'AES-256 vault', state: 'active', value: 'enabled' },
  { label: 'TLS tunnel', state: 'active', value: 'established' },
  { label: 'Zero-trust handshake', state: 'active', value: 'verified' },
  { label: 'Biometric channel', state: 'pending', value: 'listening' },
  { label: 'Session cipher', state: 'active', value: 'rotating' },
]

const ROTATE_MS = 2400
const ROW_HEIGHT_REM = 2.125

export function LiveEncryptionStatus() {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % METRICS.length)
    }, ROTATE_MS)
    return () => window.clearInterval(intervalId)
  }, [])

  return (
    <aside className="live-encryption" aria-label="Live encryption status">
      <header className="live-encryption__head">
        <span className="live-encryption__live-dot" aria-hidden />
        <h3 className="live-encryption__title">Live Encryption Status</h3>
      </header>

      <div
        className="live-encryption__viewport"
        style={{ '--live-enc-row': `${ROW_HEIGHT_REM}rem` }}
        aria-live="polite"
        aria-atomic="true"
      >
        <ul
          className="live-encryption__track"
          style={{ '--live-enc-index': activeIndex }}
        >
          {METRICS.map((item, index) => {
            const isActive = index === activeIndex
            return (
              <li
                key={item.label}
                className={`live-encryption__row${isActive ? ' live-encryption__row--focus' : ''}${item.state === 'active' ? ' live-encryption__row--ok' : ''}`}
                aria-hidden={!isActive}
              >
                <span className="live-encryption__row-label">{item.label}</span>
                <span className="live-encryption__row-value">{item.value}</span>
              </li>
            )
          })}
        </ul>
        <div className="live-encryption__viewport-fade live-encryption__viewport-fade--top" aria-hidden />
        <div className="live-encryption__viewport-fade live-encryption__viewport-fade--bottom" aria-hidden />
      </div>
    </aside>
  )
}
