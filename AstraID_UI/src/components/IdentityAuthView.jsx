import { useState } from 'react'
import { isValidEmail } from '../utils/identity'
import { IdentityAuthPanel } from './IdentityAuthPanel'
import { IdentityCardPanel } from './IdentityCardPanel'
import { LiveEncryptionStatus } from './LiveEncryptionStatus'
import { LoginScanPanel } from './LoginScanPanel'
import { LoginTrust } from './LoginTrust'
import './IdentityAuthView.css'

export function IdentityAuthView({
  identityCard,
  name = '',
  email = '',
  onDraftChange,
  onAuthenticate,
}) {
  const [showIdentityDetected, setShowIdentityDetected] = useState(false)
  const [identityDetectedComplete, setIdentityDetectedComplete] = useState(false)

  function resetIdentityDetect() {
    setShowIdentityDetected(false)
    setIdentityDetectedComplete(false)
  }

  function handleDraftChange(draft) {
    onDraftChange?.(draft)
    if (draft.email !== email || !isValidEmail(draft.email ?? '')) {
      resetIdentityDetect()
    }
  }

  function handleEmailValidated() {
    const isMobile = window.matchMedia('(max-width: 520px)').matches
    if (isMobile) {
      setShowIdentityDetected(false)
      setIdentityDetectedComplete(true)
      return
    }
    setShowIdentityDetected(true)
    setIdentityDetectedComplete(false)
  }

  const [cardFocusActive, setCardFocusActive] = useState(false)
  const [mobileCardOpen, setMobileCardOpen] = useState(false)
  const [mobileScanVisible, setMobileScanVisible] = useState(false)

  function handleAuthenticate(payload) {
    setCardFocusActive(true)
    onAuthenticate?.(payload)
  }

  const cardPanel = (
    <IdentityCardPanel
      {...identityCard}
      showIdentityDetected={showIdentityDetected}
      onIdentityDetectedComplete={() => setIdentityDetectedComplete(true)}
      className="identity-auth-view__card-panel"
    />
  )

  return (
    <section
      className={`identity-auth-view${cardFocusActive ? ' identity-auth-view--card-focus' : ''}`}
      aria-label="Identity Authentication"
    >
      <div
        className={`identity-auth-view__layout${cardFocusActive ? ' identity-auth-view__layout--card-focus' : ''}`}
      >
        <div
          className={`identity-auth-view__left identity-auth-view__fade-slot${mobileScanVisible ? ' identity-auth-view__left--scan-visible' : ''}`}
        >
          <div className="identity-auth-view__scan-stage">
            <LoginScanPanel active layout="auth" />
            <button
              type="button"
              className="identity-auth-view__card-chip"
              onClick={() => setMobileCardOpen(true)}
              aria-label="View Astra ID card"
            >
              <span className="identity-auth-view__card-chip-icon" aria-hidden>
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="5" width="18" height="14" rx="2.5" />
                  <circle cx="9" cy="11" r="1.75" />
                  <path d="M13 10.5h4M13 14h6" />
                </svg>
              </span>
            </button>
          </div>
        </div>

        <div className="identity-auth-view__center identity-auth-view__fade-slot">
          <IdentityAuthPanel
            visible
            placement="clear"
            showContinue
            name={name}
            email={email}
            onDraftChange={handleDraftChange}
            onEmailValidated={handleEmailValidated}
            onIdentityDetectReset={resetIdentityDetect}
            identityDetectedComplete={identityDetectedComplete}
            onAuthenticate={handleAuthenticate}
            onProceedStart={() => setMobileScanVisible(true)}
          />
        </div>

        <div
          className={`identity-auth-view__right identity-auth-view__right--desktop${cardFocusActive ? ' identity-auth-view__right--centered' : ''}`}
        >
          {cardPanel}
        </div>
      </div>

      <div
        className={`identity-auth-view__card-overlay${mobileCardOpen ? ' identity-auth-view__card-overlay--open' : ''}`}
        aria-hidden={!mobileCardOpen}
      >
        <button
          type="button"
          className="identity-auth-view__card-overlay-backdrop"
          onClick={() => setMobileCardOpen(false)}
          aria-label="Close Astra ID card"
        />
        <div
          className="identity-auth-view__card-overlay-panel"
          role="dialog"
          aria-modal="true"
          aria-label="Astra ID card"
        >
          <IdentityCardPanel
            {...identityCard}
            showIdentityDetected={showIdentityDetected}
            onIdentityDetectedComplete={() => setIdentityDetectedComplete(true)}
            className="identity-auth-view__card-panel identity-auth-view__card-panel--overlay"
          />
        </div>
      </div>

      <div className="identity-auth-view__encryption identity-auth-view__fade-slot">
        <LiveEncryptionStatus />
      </div>

      <div className="identity-auth-view__trust">
        <LoginTrust />
      </div>
    </section>
  )
}
