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
    setShowIdentityDetected(true)
    setIdentityDetectedComplete(false)
  }

  const [cardFocusActive, setCardFocusActive] = useState(false)

  function handleAuthenticate(payload) {
    setCardFocusActive(true)
    onAuthenticate?.(payload)
  }

  return (
    <section
      className={`identity-auth-view${cardFocusActive ? ' identity-auth-view--card-focus' : ''}`}
      aria-label="Identity Authentication"
    >
      <div
        className={`identity-auth-view__layout${cardFocusActive ? ' identity-auth-view__layout--card-focus' : ''}`}
      >
        <div className="identity-auth-view__left identity-auth-view__fade-slot">
          <LoginScanPanel active layout="auth" />
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
          />
        </div>

        <div
          className={`identity-auth-view__right${cardFocusActive ? ' identity-auth-view__right--centered' : ''}`}
        >
          <IdentityCardPanel
            {...identityCard}
            showIdentityDetected={showIdentityDetected}
            onIdentityDetectedComplete={() => setIdentityDetectedComplete(true)}
            className="identity-auth-view__card-panel"
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
