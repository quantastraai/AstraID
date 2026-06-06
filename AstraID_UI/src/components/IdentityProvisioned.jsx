import { useCallback, useEffect, useState } from 'react'
import { AstraIdentityCard } from './AstraIdentityCard'
import { TypewriterText } from './TypewriterText'
import './IdentityProvisioned.css'

const SUCCESS_TEXT = 'Identity Successfully Provisioned'

export function IdentityProvisioned({ theme = 'dark', name, email, onAccessWorkspace }) {
  const [flashActive, setFlashActive] = useState(false)
  const [showCard, setShowCard] = useState(false)
  const [showButton, setShowButton] = useState(false)

  const displayName = name.trim() || 'Identity Holder'
  const displayEmail = email.trim() || '—'

  const handleSuccessComplete = useCallback(() => {
    setFlashActive(true)
    window.setTimeout(() => setShowCard(true), 500)
  }, [])

  useEffect(() => {
    if (!showCard) return undefined
    const timerId = window.setTimeout(() => setShowButton(true), 700)
    return () => window.clearTimeout(timerId)
  }, [showCard])

  return (
    <div className="identity-provisioned">
      <p
        className={`identity-provisioned__success${flashActive ? ' identity-provisioned__success--flash' : ''}`}
        role="status"
        aria-live="polite"
      >
        <TypewriterText
          text={SUCCESS_TEXT}
          speed={30}
          startDelay={150}
          className="identity-provisioned__success-type"
          onComplete={handleSuccessComplete}
        />
      </p>

      {showCard ? (
        <AstraIdentityCard
          theme={theme}
          holderName={displayName}
          email={displayEmail}
          hideSecrets={false}
          authPhase="revealed"
          goldFlash
          className="identity-provisioned__card-slot"
        />
      ) : (
        <div className="identity-provisioned__card-placeholder" aria-hidden>
          <div className="astra-identity-card" />
        </div>
      )}

      {showButton ? (
        <button
          type="button"
          className="identity-provisioned__workspace-btn"
          onClick={onAccessWorkspace}
        >
          <span className="identity-provisioned__workspace-btn-type">Access Secure Workspace</span>
          <span className="identity-provisioned__workspace-arrow" aria-hidden>
            →
          </span>
        </button>
      ) : null}
    </div>
  )
}
