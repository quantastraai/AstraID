import { useEffect, useState } from 'react'
import { BlinkingDots } from './BlinkingDots'
import { LoginHero } from './LoginHero'
import { TypewriterText } from './TypewriterText'
import './LoginIntroSequence.css'

const INIT_LAYER_TEXT = 'Initializing Secure Identity Layer'
const TRUSTED_TEXT = 'Trusted Encryption Infrastructure'
const DOTS_PHASE_MS = 3000
const TRUSTED_FLASH_MS = 3000
const FADE_MS = 500

function GoldenShieldIcon() {
  return (
    <svg
      className="login-intro__shield-icon"
      viewBox="0 0 24 24"
      width="20"
      height="20"
      aria-hidden
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3 4 6v6c0 5 3.5 8.5 8 9 4.5-.5 8-4 8-9V6l-8-3Z"
      />
    </svg>
  )
}

export function LoginIntroSequence({ onSecureAccess, onHeroReady }) {
  const [loopKey, setLoopKey] = useState(0)
  const [phase, setPhase] = useState('init')
  const [showInitDots, setShowInitDots] = useState(false)
  const [showTrusted, setShowTrusted] = useState(false)
  const [showHero, setShowHero] = useState(false)

  function handleInitTypeComplete() {
    setShowInitDots(true)
  }

  function handleTrustedTypeComplete() {
    setPhase('trusted-flash')
  }

  useEffect(() => {
    if (phase !== 'trusted-flash') return undefined

    const timerId = window.setTimeout(() => {
      setPhase('fade-trusted')
    }, TRUSTED_FLASH_MS)

    return () => window.clearTimeout(timerId)
  }, [phase])

  useEffect(() => {
    if (phase !== 'init' || !showInitDots) return undefined

    const timerId = window.setTimeout(() => {
      setPhase('fade-init')
    }, DOTS_PHASE_MS)

    return () => window.clearTimeout(timerId)
  }, [phase, showInitDots])

  useEffect(() => {
    if (phase !== 'fade-init') return undefined

    const timerId = window.setTimeout(() => {
      setShowTrusted(true)
      setPhase('trusted')
    }, FADE_MS)

    return () => window.clearTimeout(timerId)
  }, [phase])

  useEffect(() => {
    if (phase !== 'fade-trusted') return undefined

    const timerId = window.setTimeout(() => {
      setShowTrusted(false)
      setShowHero(true)
      onHeroReady?.()
    }, FADE_MS)

    return () => window.clearTimeout(timerId)
  }, [phase])

  const initPanelHidden =
    phase === 'fade-init' ||
    phase === 'trusted' ||
    phase === 'trusted-flash' ||
    phase === 'fade-trusted'

  const trustedPanelVisible =
    phase === 'trusted' ||
    phase === 'trusted-flash' ||
    phase === 'fade-trusted'

  const trustedFlashing = phase === 'trusted-flash'

  if (showHero) {
    return (
      <div className="login-intro login-intro--hero-mode" aria-live="polite">
        <LoginHero visible onSecureAccess={onSecureAccess} />
      </div>
    )
  }

  return (
    <div className="login-intro" aria-live="polite">
      <div
        className={`login-intro__panel login-intro__panel--init${initPanelHidden ? ' login-intro__panel--out' : ''}`}
        aria-hidden={initPanelHidden}
      >
        <p className="login-intro__line">
          <TypewriterText
            key={`init-${loopKey}`}
            text={INIT_LAYER_TEXT}
            speed={28}
            startDelay={200}
            className="login-intro__type login-intro__type--init"
            onComplete={handleInitTypeComplete}
          />
          {showInitDots ? <BlinkingDots /> : null}
        </p>
      </div>

      <div
        className={`login-intro__panel login-intro__panel--trusted${trustedPanelVisible ? ' login-intro__panel--in' : ''}${phase === 'fade-trusted' ? ' login-intro__panel--out' : ''}`}
        aria-hidden={!trustedPanelVisible}
      >
        {showTrusted ? (
          <p
            className={`login-intro__line login-intro__line--trusted${trustedFlashing ? ' login-intro__line--flash' : ''}`}
          >
            <span className="login-intro__shield-wrap">
              <GoldenShieldIcon />
            </span>
            <TypewriterText
              key={`trusted-${loopKey}`}
              text={TRUSTED_TEXT}
              speed={26}
              startDelay={120}
              className="login-intro__type login-intro__type--trusted"
              onComplete={handleTrustedTypeComplete}
            />
          </p>
        ) : null}
      </div>
    </div>
  )
}
