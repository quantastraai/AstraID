import { useEffect, useState } from 'react'
import { BlinkingDots } from './BlinkingDots'
import { TypewriterText } from './TypewriterText'
import './IdentityDetectedStatus.css'

const DETECTING_TEXT = 'identity detecting'
const DETECTED_TEXT = 'identity detected'
const DOTS_ANIMATION_MS = 3000

function DetectedCheckIcon() {
  return (
    <svg
      className="identity-detected__check"
      viewBox="0 0 24 24"
      width="14"
      height="14"
      aria-hidden
    >
      <path
        d="M5 12l4 4L19 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function IdentityDetectedStatus({ visible = false, onAnimationComplete }) {
  const [step, setStep] = useState('idle')
  const [dotsFrozen, setDotsFrozen] = useState(false)
  const [showCheck, setShowCheck] = useState(false)

  useEffect(() => {
    if (!visible) {
      setStep('idle')
      setDotsFrozen(false)
      setShowCheck(false)
      return undefined
    }

    setStep('write')
    setDotsFrozen(false)
    setShowCheck(false)
    return undefined
  }, [visible])

  useEffect(() => {
    if (step !== 'dots') return undefined

    const dotsTimerId = window.setTimeout(() => {
      setDotsFrozen(true)
      setShowCheck(true)
      setStep('detected')
    }, DOTS_ANIMATION_MS)

    return () => window.clearTimeout(dotsTimerId)
  }, [step])

  useEffect(() => {
    if (step !== 'detected') return undefined
    onAnimationComplete?.()
    return undefined
  }, [step, onAnimationComplete])

  if (!visible || step === 'idle') return null

  const isDetected = step === 'detected'
  const showDots = step === 'dots'
  const labelText = isDetected ? DETECTED_TEXT : DETECTING_TEXT

  const rootClass = [
    'identity-detected',
    isDetected ? ' identity-detected--detected' : ' identity-detected--detecting',
  ].join('')

  return (
    <p className={rootClass} role="status" aria-live="polite">
      {step === 'write' ? (
        <TypewriterText
          key="identity-detecting-write"
          text={DETECTING_TEXT}
          speed={28}
          startDelay={120}
          className="identity-detected__label identity-detected__label--type"
          showCursor={false}
          onComplete={() => setStep('dots')}
        />
      ) : (
        <span className="identity-detected__label">{labelText}</span>
      )}
      {showDots ? (
        <BlinkingDots className={dotsFrozen ? 'blinking-dots--static' : ''} />
      ) : null}
      {showCheck ? (
        <span className="identity-detected__check-wrap">
          <DetectedCheckIcon />
        </span>
      ) : null}
    </p>
  )
}
