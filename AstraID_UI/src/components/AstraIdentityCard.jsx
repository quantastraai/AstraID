import { useCallback, useEffect, useState } from 'react'
import { TypewriterText } from './TypewriterText'
import './AstraIdentityCard.css'

export const ASTRA_ID_VALUE = 'ASTRA-ID-7X92A'

export function formatIssuedDate() {
  return new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

const DETECT_TEXT = 'Identity Detected ✓'
const VAULT_VALUE = '*******'
const FIELD_COUNT = 6

const MASK_ID = '··············'
const MASK_ISSUED = '········'
const MASK_STATUS = '······'

function CardRevealValue({
  fieldIndex,
  revealField,
  text,
  masked,
  className = '',
  speed = 40,
  onFieldComplete,
}) {
  const isDone = revealField > fieldIndex
  const isActive = revealField === fieldIndex

  if (isDone) {
    return <span className={className}>{text}</span>
  }

  if (isActive) {
    return (
      <TypewriterText
        key={`card-field-${fieldIndex}`}
        text={text}
        speed={speed}
        startDelay={fieldIndex === 0 ? 120 : 200}
        className={className}
        showCursor={false}
        onComplete={onFieldComplete}
      />
    )
  }

  return <span className={`${className} astra-identity-card__secret--hidden`.trim()}>{masked}</span>
}

export function AstraIdentityCard({
  theme = 'dark',
  holderName = '',
  email = '',
  hideSecrets = true,
  authPhase = 'idle',
  goldFlash = false,
  className = '',
  onDetectComplete,
  onRevealComplete,
  status = 'active',
}) {
  const [revealField, setRevealField] = useState(-1)
  const isStatusActive = status !== 'deactive'
  const statusText = isStatusActive ? 'Active' : 'Deactive'
  const statusToneClass = isStatusActive
    ? 'astra-identity-card__status--active'
    : 'astra-identity-card__status--deactive'
  const logoSrc = theme === 'light' ? '/astra-logo-light.png' : '/astra-logo.png'
  const isAuthenticating = authPhase === 'authenticating'
  const isDetected = authPhase === 'detected'
  const isRevealing = authPhase === 'revealing'
  const isRevealed = authPhase === 'revealed' && !hideSecrets
  const showOverlay = isAuthenticating || isDetected
  const useInstantReveal = authPhase === 'revealed' && !hideSecrets && !isRevealing

  const displayName = holderName.trim() || '—'
  const displayEmail = email.trim() || '—'
  const issuedText = formatIssuedDate()

  const handleFieldComplete = useCallback(() => {
    setRevealField((current) => {
      const next = current + 1
      if (next >= FIELD_COUNT) {
        onRevealComplete?.()
      }
      return next
    })
  }, [onRevealComplete])

  useEffect(() => {
    if (isRevealing) {
      setRevealField(0)
      return
    }
    if (useInstantReveal) {
      setRevealField(FIELD_COUNT)
      return
    }
    setRevealField(-1)
  }, [isRevealing, useInstantReveal])

  const activeRevealField = useInstantReveal ? FIELD_COUNT : revealField

  const cardClass = [
    'astra-identity-card',
    goldFlash ? ' astra-identity-card--gold-flash' : '',
    isAuthenticating ? ' astra-identity-card--authenticating' : '',
    isDetected ? ' astra-identity-card--detected' : '',
    isRevealing ? ' astra-identity-card--revealing' : '',
    isRevealed ? ' astra-identity-card--revealed' : '',
    className,
  ]
    .filter(Boolean)
    .join('')

  return (
    <article className={cardClass} aria-label="Astra identity card">
      <div className="astra-identity-card__holo" aria-hidden />
      <div className="astra-identity-card__scan" aria-hidden />
      {showOverlay ? (
        <div
          className={`astra-identity-card__overlay${isDetected ? ' astra-identity-card__overlay--detected' : ''}`}
          role="status"
          aria-live="polite"
        >
          {isAuthenticating ? (
            <span className="astra-identity-card__overlay-text">Authenticating identity…</span>
          ) : (
            <TypewriterText
              key="identity-detected"
              text={DETECT_TEXT}
              speed={42}
              startDelay={160}
              className="astra-identity-card__overlay-type"
              onComplete={() => onDetectComplete?.()}
              showCursor
            />
          )}
        </div>
      ) : null}
      <div className="astra-identity-card__inner">
        <header className="astra-identity-card__head">
          <div className="astra-identity-card__logo-wrap">
            <img
              className="astra-identity-card__logo"
              src={logoSrc}
              alt="Astra ID"
              width={1038}
              height={332}
              decoding="async"
            />
          </div>
          <span className="astra-identity-card__chip" aria-hidden />
        </header>
        <p className="astra-identity-card__id">
          <CardRevealValue
            fieldIndex={0}
            revealField={activeRevealField}
            text={ASTRA_ID_VALUE}
            masked={MASK_ID}
            className={
              activeRevealField > 0
                ? 'astra-identity-card__id-value astra-identity-card__secret--visible'
                : 'astra-identity-card__id-value'
            }
            speed={46}
            onFieldComplete={handleFieldComplete}
          />
        </p>
        <dl className="astra-identity-card__meta">
          <div className="astra-identity-card__row">
            <dt>Holder</dt>
            <dd>
              <CardRevealValue
                fieldIndex={1}
                revealField={activeRevealField}
                text={displayName}
                masked="—"
                speed={42}
                onFieldComplete={handleFieldComplete}
              />
            </dd>
          </div>
          <div className="astra-identity-card__row">
            <dt>Email</dt>
            <dd>
              <CardRevealValue
                fieldIndex={2}
                revealField={activeRevealField}
                text={displayEmail}
                masked="—"
                speed={38}
                onFieldComplete={handleFieldComplete}
              />
            </dd>
          </div>
          <div className="astra-identity-card__row">
            <dt>Vault</dt>
            <dd className="astra-identity-card__vault">
              <CardRevealValue
                fieldIndex={3}
                revealField={activeRevealField}
                text={VAULT_VALUE}
                masked="*******"
                speed={36}
                onFieldComplete={handleFieldComplete}
              />
            </dd>
          </div>
          <div className="astra-identity-card__row">
            <dt>Issued</dt>
            <dd className="astra-identity-card__issued">
              <CardRevealValue
                fieldIndex={4}
                revealField={activeRevealField}
                text={issuedText}
                masked={MASK_ISSUED}
                speed={40}
                onFieldComplete={handleFieldComplete}
              />
            </dd>
          </div>
          <div className="astra-identity-card__row">
            <dt>Status</dt>
            <dd
              className={`astra-identity-card__status${activeRevealField >= 5 ? ` ${statusToneClass}` : ''}`}
            >
              <CardRevealValue
                fieldIndex={5}
                revealField={activeRevealField}
                text={statusText}
                masked={MASK_STATUS}
                className="astra-identity-card__status-value"
                speed={38}
                onFieldComplete={handleFieldComplete}
              />
            </dd>
          </div>
        </dl>
      </div>
    </article>
  )
}
