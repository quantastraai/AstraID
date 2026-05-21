import { useEffect, useState } from 'react'
import { TypewriterText } from './TypewriterText'
import './IdentityProvisioned.css'

const SUCCESS_TEXT = 'Identity Successfully Provisioned'
const ASTRA_ID = 'ASTRA-ID-7X92A'

function formatIssuedDate() {
  return new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function IdentityProvisioned({ theme = 'dark', name, email, onAccessWorkspace }) {
  const logoSrc = theme === 'light' ? '/astra-logo-light.png' : '/astra-logo.png'
  const [flashActive, setFlashActive] = useState(false)
  const [showCard, setShowCard] = useState(false)
  const [showButton, setShowButton] = useState(false)

  const displayName = name.trim() || 'Identity Holder'
  const displayEmail = email.trim() || '—'

  function handleSuccessComplete() {
    setFlashActive(true)
    window.setTimeout(() => setShowCard(true), 500)
  }

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
        <article className="identity-provisioned__card identity-provisioned__card--gold-flash" aria-label="Astra identity card">
          <div className="identity-provisioned__card-holo" aria-hidden />
          <div className="identity-provisioned__card-gold-sweep" aria-hidden />
          <div className="identity-provisioned__card-scan" aria-hidden />
          <div className="identity-provisioned__card-inner">
          <header className="identity-provisioned__card-head">
            <div className="identity-provisioned__card-logo-wrap">
              <img
                className="identity-provisioned__card-logo"
                src={logoSrc}
                alt="Astra ID"
                width={1038}
                height={332}
                decoding="async"
              />
            </div>
            <span className="identity-provisioned__card-chip" aria-hidden />
          </header>
          <p className="identity-provisioned__card-id">{ASTRA_ID}</p>
          <dl className="identity-provisioned__card-meta">
            <div className="identity-provisioned__card-row">
              <dt>Holder</dt>
              <dd>{displayName}</dd>
            </div>
            <div className="identity-provisioned__card-row">
              <dt>Email</dt>
              <dd>{displayEmail}</dd>
            </div>
            <div className="identity-provisioned__card-row">
              <dt>Vault</dt>
              <dd className="identity-provisioned__card-vault">*******</dd>
            </div>
            <div className="identity-provisioned__card-row">
              <dt>Issued</dt>
              <dd>{formatIssuedDate()}</dd>
            </div>
            <div className="identity-provisioned__card-row">
              <dt>Status</dt>
              <dd className="identity-provisioned__card-status">Active</dd>
            </div>
          </dl>
          </div>
        </article>
      ) : (
        <div className="identity-provisioned__card-placeholder" aria-hidden>
          <article className="identity-provisioned__card" />
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
