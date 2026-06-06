import { useCallback, useEffect, useRef, useState } from 'react'
import { BlinkingDots } from './BlinkingDots'
import { TypewriterText } from './TypewriterText'
import './LogoutSessionTerminal.css'

const LOGOUT_LINES = [
  'terminating secure session',
  'clearing encrypted tokens',
  'disconnecting identity vault',
  'Astra ID session closed',
]

const DOTS_CYCLE_MS = 1200
const DOTS_CYCLES_PER_LINE = 3

export function LogoutSessionTerminal({ onComplete }) {
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  const [lineIndex, setLineIndex] = useState(0)
  const [phase, setPhase] = useState('typing')
  const [dotCycle, setDotCycle] = useState(0)

  const advanceLine = useCallback(() => {
    if (lineIndex >= LOGOUT_LINES.length - 1) {
      onCompleteRef.current?.()
      return
    }
    setLineIndex((index) => index + 1)
    setPhase('typing')
    setDotCycle(0)
  }, [lineIndex])

  const handleTypeComplete = useCallback(() => {
    setPhase('dots')
    setDotCycle(0)
  }, [])

  useEffect(() => {
    if (phase !== 'dots') return undefined

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const cycles = prefersReduced ? 1 : DOTS_CYCLES_PER_LINE
    const cycleMs = prefersReduced ? 400 : DOTS_CYCLE_MS

    if (dotCycle >= cycles) {
      advanceLine()
      return undefined
    }

    const timerId = window.setTimeout(() => {
      setDotCycle((count) => count + 1)
    }, cycleMs)

    return () => window.clearTimeout(timerId)
  }, [phase, dotCycle, advanceLine])

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!prefersReduced) return undefined

    const timerId = window.setTimeout(() => {
      onCompleteRef.current?.()
    }, 900)
    return () => window.clearTimeout(timerId)
  }, [])

  return (
    <div className="logout-terminal" role="status" aria-live="polite" aria-label="Signing out">
      <div className="logout-terminal__window">
        <div className="logout-terminal__head" aria-hidden>
          <span className="logout-terminal__dot" />
          <span className="logout-terminal__dot" />
          <span className="logout-terminal__dot" />
          <span className="logout-terminal__label">astra-session.sh</span>
        </div>
        <ul className="logout-terminal__lines">
          {LOGOUT_LINES.map((text, index) => {
            if (index > lineIndex) return null
            const isPast = index < lineIndex
            const isCurrent = index === lineIndex

            return (
              <li
                key={text}
                className={[
                  'logout-terminal__line',
                  isCurrent ? 'logout-terminal__line--active' : '',
                  isCurrent && phase === 'dots' ? 'logout-terminal__line--loading' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <span className="logout-terminal__prompt" aria-hidden>
                  &gt;
                </span>
                {isPast ? (
                  <span className="logout-terminal__text">{text}</span>
                ) : null}
                {isCurrent && phase === 'typing' ? (
                  <TypewriterText
                    key={`logout-line-${index}`}
                    text={text}
                    speed={28}
                    startDelay={index === 0 ? 180 : 80}
                    className="logout-terminal__type"
                    showCursor
                    onComplete={handleTypeComplete}
                  />
                ) : null}
                {isCurrent && phase === 'dots' ? (
                  <>
                    <span className="logout-terminal__text">{text}</span>
                    <BlinkingDots />
                  </>
                ) : null}
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
