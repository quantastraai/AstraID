import { useEffect, useState } from 'react'
import { TypewriterText } from './TypewriterText'
import './IdentityCreationProgress.css'

const PROGRESS_LABEL_TEXT = 'Identity Creation Progress'

export function IdentityCreationProgress({ targetPercent = 0, visible = true }) {
  const [displayPercent, setDisplayPercent] = useState(0)
  const [showMeter, setShowMeter] = useState(false)

  useEffect(() => {
    if (!visible) {
      setDisplayPercent(0)
      setShowMeter(false)
      return undefined
    }

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      setDisplayPercent(targetPercent)
      return undefined
    }

    const intervalId = window.setInterval(() => {
      setDisplayPercent((prev) => {
        if (prev === targetPercent) return prev
        if (prev < targetPercent) return prev + 1
        return prev - 1
      })
    }, 32)

    return () => window.clearInterval(intervalId)
  }, [targetPercent, visible])

  return (
    <div
      className={`identity-progress${visible ? ' identity-progress--visible' : ' identity-progress--hidden'}`}
      role="status"
      aria-live="polite"
      aria-label={`${PROGRESS_LABEL_TEXT} ${displayPercent} percent`}
      aria-hidden={!visible}
    >
      <p className="identity-progress__label">
        {visible ? (
          <TypewriterText
            text={PROGRESS_LABEL_TEXT}
            speed={28}
            startDelay={120}
            className="identity-progress__label-type"
            onComplete={() => setShowMeter(true)}
          />
        ) : (
          <span className="identity-progress__label-placeholder" aria-hidden="true">
            {PROGRESS_LABEL_TEXT}
          </span>
        )}
      </p>
      <div
        className={`identity-progress__meter${showMeter ? ' identity-progress__meter--visible' : ''}`}
        aria-hidden={!showMeter}
      >
        <div className="identity-progress__track">
          <div
            className="identity-progress__fill"
            style={{ width: `${displayPercent}%` }}
          />
          <div className="identity-progress__shine" style={{ width: `${displayPercent}%` }} />
        </div>
        <span className="identity-progress__percent">{displayPercent}%</span>
      </div>
    </div>
  )
}
