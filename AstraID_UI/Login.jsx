import { useCallback, useEffect, useRef, useState } from 'react'
import { IdentityAuthPanel } from './IdentityAuthPanel'
import { LoginIntroSequence } from './LoginIntroSequence'
import { LoginScanPanel } from './LoginScanPanel'
import { LoginTrust } from './LoginTrust'
import './Login.css'

const EXIT_MS = 520
const PANEL_SLIDE_MS = 1050
const PANEL_HOLD_MS = 3000
const HANDOFF_MS = 400

export function Login({ onSecureAccess, onSecureBlurChange }) {
  const [heroReady, setHeroReady] = useState(false)
  const [accessPhase, setAccessPhase] = useState('idle')
  const timersRef = useRef([])

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((id) => window.clearTimeout(id))
    timersRef.current = []
  }, [])

  useEffect(() => () => clearTimers(), [clearTimers])

  const handleSecureAccess = useCallback(() => {
    if (accessPhase !== 'idle') return

    setAccessPhase('exiting')
    clearTimers()

    timersRef.current.push(
      window.setTimeout(() => {
        setAccessPhase('auth')
      }, EXIT_MS),
    )

    timersRef.current.push(
      window.setTimeout(() => {
        onSecureAccess?.()
      }, EXIT_MS + PANEL_SLIDE_MS + PANEL_HOLD_MS + HANDOFF_MS),
    )
  }, [accessPhase, clearTimers, onSecureAccess])

  const isTransitioning = accessPhase === 'exiting' || accessPhase === 'auth'
  const showAuthPanel = accessPhase === 'auth'

  useEffect(() => {
    onSecureBlurChange?.(isTransitioning)
  }, [isTransitioning, onSecureBlurChange])

  useEffect(
    () => () => {
      onSecureBlurChange?.(false)
    },
    [onSecureBlurChange],
  )

  return (
    <section
      className={`login${isTransitioning ? ' login--phase-exiting' : ''}${showAuthPanel ? ' login--phase-auth' : ''}`}
      aria-label="Security"
      data-access-phase={accessPhase}
    >
      <div className="login__layout">
        <div className="login__center">
          <div className="login__center-glow" aria-hidden>
            <div className="login__center-glow-rings">
              <span className="login__center-glow-ring" />
              <span className="login__center-glow-ring" />
              <span className="login__center-glow-ring" />
              <span className="login__center-glow-ring" />
            </div>
          </div>
          <LoginIntroSequence
            onSecureAccess={handleSecureAccess}
            onHeroReady={() => setHeroReady(true)}
            accessPhase={accessPhase}
          />
        </div>
        <LoginScanPanel active={heroReady} expanding={isTransitioning} />
      </div>

      <div className={`login__content${isTransitioning ? ' login__content--hidden' : ''}`}>
        <LoginTrust />
      </div>

      <IdentityAuthPanel visible={showAuthPanel} />
    </section>
  )
}
