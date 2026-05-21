import { useEffect, useRef, useState } from 'react'
import { isValidEmail } from '../utils/identity'
import { TypewriterText } from './TypewriterText'
import './IdentityAuthPanel.css'

const TITLE_TEXT = 'Identity Authentication Panel'
const NAME_PROMPT_TEXT = 'Enter your name / Astra ID'
const EMAIL_PROMPT_TEXT = 'Secure email address'
const EMAIL_VALIDATION_TEXT = 'encrypted mail tunnel established'
const PASSWORD_PROMPT_TEXT = 'Enter Master Password'
const AES_ENABLED_TEXT = 'AES-256 password vault encryption enabled'
const OTP_PROMPT_TEXT = 'Enter 6-digit OTP'
const EMPTY_OTP = ['', '', '', '', '', '']

function AuthShieldIcon() {
  return (
    <svg className="identity-auth-panel__icon" viewBox="0 0 24 24" width="28" height="28" aria-hidden>
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3 4 6v6c0 5 3.5 8.5 8 9 4.5-.5 8-4 8-9V6l-8-3Z"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        d="M9 12l2 2 4-4"
      />
    </svg>
  )
}

function NextStepIcon() {
  return (
    <svg
      className="identity-auth-panel__next-icon"
      viewBox="0 0 24 24"
      width="20"
      height="20"
      aria-hidden
    >
      <path
        d="M9 6l6 6-6 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function BackStepIcon() {
  return (
    <svg
      className="identity-auth-panel__back-icon"
      viewBox="0 0 24 24"
      width="20"
      height="20"
      aria-hidden
    >
      <path
        d="M15 6l-6 6 6 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function EyeToggleIcon({ visible }) {
  if (visible) {
    return (
      <svg className="identity-auth-panel__eye-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden>
        <path
          d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
        />
        <circle cx="12" cy="12" r="3" fill="none" stroke="currentColor" strokeWidth="1.75" />
      </svg>
    )
  }

  return (
    <svg className="identity-auth-panel__eye-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden>
      <path
        d="M3 3l18 18M9.88 9.88a3 3 0 1 0 4.24 4.24M10.58 10.58A10.07 10.07 0 0 1 12 19c-2.5 0-4.7-1-6.42-2.58M6.35 6.35A17.89 17.89 0 0 0 2 12s3.5 7 10 7c1.05 0 2.05-.2 3-.58M17.65 17.65A17.89 17.89 0 0 0 22 12s-3.5-7-10-7a9.86 9.86 0 0 0-4.11.88"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function PasswordInputWithEye({
  id,
  labelText,
  value,
  onChange,
  visible,
  onToggleVisible,
  autoFocus,
  tabIndex,
}) {
  return (
    <label className="identity-auth-panel__field-label identity-auth-panel__field-label--password" htmlFor={id}>
      <span className="identity-auth-panel__sr-only">{labelText}</span>
      <div className="identity-auth-panel__password-field">
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          className="identity-auth-panel__input identity-auth-panel__input--with-eye"
          value={value}
          onChange={onChange}
          autoComplete="current-password"
          autoFocus={autoFocus}
          placeholder=""
          tabIndex={tabIndex}
        />
        <button
          type="button"
          className="identity-auth-panel__password-toggle"
          aria-label={visible ? 'Hide password' : 'Show password'}
          onClick={onToggleVisible}
          tabIndex={tabIndex}
        >
          <EyeToggleIcon visible={visible} />
        </button>
      </div>
    </label>
  )
}

function OtpDigitInputs({ digits, onChange, enabled, onComplete }) {
  const inputRefs = useRef([])

  function focusIndex(index) {
    inputRefs.current[index]?.focus()
  }

  useEffect(() => {
    if (!enabled) return undefined
    const id = window.requestAnimationFrame(() => focusIndex(0))
    return () => window.cancelAnimationFrame(id)
  }, [enabled])

  function updateDigits(nextDigits) {
    onChange(nextDigits)
    if (nextDigits.every((d) => /^\d$/.test(d))) {
      onComplete?.()
    }
  }

  function handleChange(index, raw) {
    const digit = raw.replace(/\D/g, '').slice(-1)
    const next = [...digits]
    next[index] = digit
    updateDigits(next)
    if (digit && index < 5) focusIndex(index + 1)
  }

  function handleKeyDown(index, e) {
    if (e.key === 'Backspace') {
      if (digits[index]) {
        const next = [...digits]
        next[index] = ''
        onChange(next)
        return
      }
      if (index > 0) {
        focusIndex(index - 1)
        const next = [...digits]
        next[index - 1] = ''
        onChange(next)
      }
    }
    if (e.key === 'ArrowLeft' && index > 0) focusIndex(index - 1)
    if (e.key === 'ArrowRight' && index < 5) focusIndex(index + 1)
  }

  function handlePaste(e) {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (!pasted) return
    e.preventDefault()
    const next = [...digits]
    for (let i = 0; i < 6; i += 1) next[i] = pasted[i] ?? ''
    updateDigits(next)
    focusIndex(Math.min(pasted.length, 5))
  }

  return (
    <div className="identity-auth-panel__otp-row" role="group" aria-label="Six digit one-time password">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el
          }}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
          maxLength={1}
          className="identity-auth-panel__otp-box"
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={!enabled}
          tabIndex={enabled ? 0 : -1}
          aria-label={`Digit ${index + 1} of 6`}
        />
      ))}
    </div>
  )
}

function ValidationCheckIcon() {
  return (
    <svg
      className="identity-auth-panel__validation-check"
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

export function IdentityAuthPanel({
  visible = false,
  placement = 'dock',
  showContinue = false,
  name = '',
  email = '',
  onDraftChange,
  onEmailValidated,
  onIdentityDetectReset,
  identityDetectedComplete = false,
  onAuthenticate,
}) {
  const [titleDone, setTitleDone] = useState(false)
  const [formStep, setFormStep] = useState('intro')
  const [showNameFields, setShowNameFields] = useState(false)
  const [showEmailFields, setShowEmailFields] = useState(false)
  const [emailValidated, setEmailValidated] = useState(false)
  const [emailValidationReady, setEmailValidationReady] = useState(false)
  const [showPasswordFields, setShowPasswordFields] = useState(false)
  const [password, setPassword] = useState('')
  const [showPasswordText, setShowPasswordText] = useState(false)
  const [showAesMessage, setShowAesMessage] = useState(false)
  const [aesMessageReady, setAesMessageReady] = useState(false)
  const [showOtpFields, setShowOtpFields] = useState(false)
  const [otpDigits, setOtpDigits] = useState(EMPTY_OTP)

  const isCenter = placement === 'center'
  const isClear = placement === 'clear'
  const isOverlay = placement === 'dock'
  const hasName = name.trim().length > 0
  const hasValidEmail = isValidEmail(email)
  const canProceedPassword = password.trim().length >= 8
  const isOtpComplete = otpDigits.every((d) => /^\d$/.test(d))

  useEffect(() => {
    if (!visible) {
      setTitleDone(false)
      setFormStep('intro')
      setShowNameFields(false)
      setShowEmailFields(false)
      setEmailValidated(false)
      setEmailValidationReady(false)
      setShowPasswordFields(false)
      setPassword('')
      setShowPasswordText(false)
      setShowAesMessage(false)
      setAesMessageReady(false)
      setShowOtpFields(false)
      setOtpDigits(EMPTY_OTP)
    }
  }, [visible])

  useEffect(() => {
    if (formStep !== 'email' || !hasValidEmail) {
      setEmailValidated(false)
      setEmailValidationReady(false)
      return undefined
    }

    const timerId = window.setTimeout(() => setEmailValidated(true), 450)
    return () => window.clearTimeout(timerId)
  }, [email, formStep, hasValidEmail])

  useEffect(() => {
    setEmailValidationReady(false)
  }, [emailValidated])

  useEffect(() => {
    if (formStep === 'email' && emailValidationReady) {
      onEmailValidated?.()
    }
  }, [formStep, emailValidationReady, onEmailValidated])

  useEffect(() => {
    if (formStep !== 'password') {
      setShowAesMessage(false)
      setAesMessageReady(false)
      return undefined
    }
    if (!canProceedPassword) {
      setShowAesMessage(false)
      setAesMessageReady(false)
      return undefined
    }

    const timerId = window.setTimeout(() => setShowAesMessage(true), 400)
    return () => window.clearTimeout(timerId)
  }, [formStep, canProceedPassword, password])

  useEffect(() => {
    setAesMessageReady(false)
  }, [showAesMessage])

  function handleProceed() {
    setFormStep('name')
    setShowNameFields(false)
  }

  function handleNameChange(e) {
    onDraftChange?.({ name: e.target.value, email })
  }

  function handleEmailChange(e) {
    onDraftChange?.({ name, email: e.target.value })
  }

  function handleNameNext() {
    setFormStep('email')
    setShowEmailFields(false)
    setEmailValidated(false)
    setEmailValidationReady(false)
  }

  function handleEmailBack() {
    onIdentityDetectReset?.()
    setFormStep('name')
    setShowNameFields(true)
  }

  function handleEmailNext() {
    setFormStep('password')
    setShowPasswordFields(false)
    setPassword('')
    setShowPasswordText(false)
    setShowAesMessage(false)
    setAesMessageReady(false)
  }

  function handlePasswordBack() {
    setFormStep('email')
    setShowEmailFields(true)
    setShowPasswordFields(false)
    setShowAesMessage(false)
    setAesMessageReady(false)
  }

  function handlePasswordNext() {
    setFormStep('otp')
    setShowOtpFields(false)
    setOtpDigits(EMPTY_OTP)
  }

  function handleOtpBack() {
    setFormStep('password')
    setShowPasswordFields(true)
    setShowOtpFields(false)
    setOtpDigits(EMPTY_OTP)
  }

  function handleAuthenticate() {
    if (!isOtpComplete) return
    onAuthenticate?.({ otp: otpDigits.join('') })
  }

  function renderNameStep() {
    return (
      <div className="identity-auth-panel__form">
        <p className="identity-auth-panel__prompt">
          <TypewriterText
            text={NAME_PROMPT_TEXT}
            speed={34}
            startDelay={80}
            className="identity-auth-panel__prompt-type"
            onComplete={() => setShowNameFields(true)}
          />
        </p>
        <div
          className={`identity-auth-panel__fields${showNameFields ? ' identity-auth-panel__fields--visible' : ''}`}
        >
          <label className="identity-auth-panel__field-label" htmlFor="auth-identity-name">
            <span className="identity-auth-panel__sr-only">{NAME_PROMPT_TEXT}</span>
            <input
              id="auth-identity-name"
              type="text"
              className="identity-auth-panel__input"
              value={name}
              onChange={handleNameChange}
              autoComplete="name"
              autoFocus={showNameFields}
              placeholder=""
              tabIndex={showNameFields ? 0 : -1}
            />
          </label>
          <button
            type="button"
            className={`identity-auth-panel__next-btn${hasName ? ' identity-auth-panel__next-btn--visible' : ''}`}
            aria-label="Continue to secure email address"
            disabled={!hasName}
            onClick={handleNameNext}
            tabIndex={hasName ? 0 : -1}
          >
            <NextStepIcon />
          </button>
        </div>
      </div>
    )
  }

  function renderEmailStep() {
    return (
      <div className="identity-auth-panel__form">
        <p className="identity-auth-panel__prompt">
          <TypewriterText
            text={EMAIL_PROMPT_TEXT}
            speed={34}
            startDelay={80}
            className="identity-auth-panel__prompt-type"
            onComplete={() => setShowEmailFields(true)}
          />
        </p>
        <div
          className={`identity-auth-panel__fields${showEmailFields ? ' identity-auth-panel__fields--visible' : ''}`}
        >
          <label className="identity-auth-panel__field-label" htmlFor="auth-identity-email">
            <span className="identity-auth-panel__sr-only">{EMAIL_PROMPT_TEXT}</span>
            <input
              id="auth-identity-email"
              type="email"
              className="identity-auth-panel__input"
              value={email}
              onChange={handleEmailChange}
              autoComplete="email"
              autoFocus={showEmailFields}
              placeholder=""
              tabIndex={showEmailFields ? 0 : -1}
            />
          </label>
          <div className="identity-auth-panel__validation-slot">
            {emailValidated ? (
              <p className="identity-auth-panel__email-validation" role="status" aria-live="polite">
                <TypewriterText
                  text={EMAIL_VALIDATION_TEXT}
                  speed={26}
                  className="identity-auth-panel__email-validation-type"
                  onComplete={() => setEmailValidationReady(true)}
                />
                {emailValidationReady ? (
                  <span className="identity-auth-panel__email-validation-icon">
                    <ValidationCheckIcon />
                  </span>
                ) : null}
              </p>
            ) : (
              <p className="identity-auth-panel__email-validation-placeholder" aria-hidden="true">
                {EMAIL_VALIDATION_TEXT}
              </p>
            )}
          </div>
          <div
            className={`identity-auth-panel__nav${showEmailFields ? ' identity-auth-panel__nav--with-back' : ''}${showEmailFields && identityDetectedComplete ? ' identity-auth-panel__nav--dual' : ''}`}
          >
            {showEmailFields ? (
              <button
                type="button"
                className="identity-auth-panel__back-btn"
                aria-label="Back to enter your name"
                onClick={handleEmailBack}
                tabIndex={0}
              >
                <BackStepIcon />
              </button>
            ) : null}
            <button
              type="button"
              className={`identity-auth-panel__next-btn${identityDetectedComplete ? ' identity-auth-panel__next-btn--visible' : ''}`}
              aria-label="Continue after identity detected"
              disabled={!identityDetectedComplete}
              onClick={handleEmailNext}
              tabIndex={identityDetectedComplete ? 0 : -1}
            >
              <NextStepIcon />
            </button>
          </div>
        </div>
      </div>
    )
  }

  function renderPasswordStep() {
    return (
      <div className="identity-auth-panel__form">
        <p className="identity-auth-panel__prompt">
          <TypewriterText
            text={PASSWORD_PROMPT_TEXT}
            speed={32}
            startDelay={80}
            className="identity-auth-panel__prompt-type"
            onComplete={() => setShowPasswordFields(true)}
          />
        </p>
        <div
          className={`identity-auth-panel__fields${showPasswordFields ? ' identity-auth-panel__fields--visible' : ''}`}
        >
          <PasswordInputWithEye
            id="auth-identity-password"
            labelText={PASSWORD_PROMPT_TEXT}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            visible={showPasswordText}
            onToggleVisible={() => setShowPasswordText((v) => !v)}
            autoFocus={showPasswordFields}
            tabIndex={showPasswordFields ? 0 : -1}
          />
          <div className="identity-auth-panel__validation-slot">
            {showAesMessage ? (
              <p className="identity-auth-panel__aes-message" role="status" aria-live="polite">
                <TypewriterText
                  text={AES_ENABLED_TEXT}
                  speed={24}
                  className="identity-auth-panel__aes-message-type"
                  onComplete={() => setAesMessageReady(true)}
                />
              </p>
            ) : (
              <p className="identity-auth-panel__email-validation-placeholder" aria-hidden="true">
                {AES_ENABLED_TEXT}
              </p>
            )}
          </div>
          <div
            className={`identity-auth-panel__nav${showPasswordFields ? ' identity-auth-panel__nav--with-back' : ''}${showPasswordFields && aesMessageReady ? ' identity-auth-panel__nav--dual' : ''}`}
          >
            {showPasswordFields ? (
              <button
                type="button"
                className="identity-auth-panel__back-btn"
                aria-label="Back to secure email address"
                onClick={handlePasswordBack}
                tabIndex={0}
              >
                <BackStepIcon />
              </button>
            ) : null}
            <button
              type="button"
              className={`identity-auth-panel__next-btn${aesMessageReady ? ' identity-auth-panel__next-btn--visible' : ''}`}
              aria-label="Continue after password encryption enabled"
              disabled={!aesMessageReady}
              onClick={handlePasswordNext}
              tabIndex={aesMessageReady ? 0 : -1}
            >
              <NextStepIcon />
            </button>
          </div>
        </div>
      </div>
    )
  }

  function renderOtpStep() {
    return (
      <div className="identity-auth-panel__form">
        <p className="identity-auth-panel__prompt">
          <TypewriterText
            text={OTP_PROMPT_TEXT}
            speed={32}
            startDelay={80}
            className="identity-auth-panel__prompt-type"
            onComplete={() => setShowOtpFields(true)}
          />
        </p>
        <div
          className={`identity-auth-panel__fields${showOtpFields ? ' identity-auth-panel__fields--visible' : ''}`}
        >
          <OtpDigitInputs
            digits={otpDigits}
            onChange={setOtpDigits}
            enabled={showOtpFields}
          />
          <button
            type="button"
            className={`identity-auth-panel__authenticate-btn${showOtpFields ? ' identity-auth-panel__authenticate-btn--visible' : ''}`}
            disabled={!isOtpComplete}
            onClick={handleAuthenticate}
            tabIndex={showOtpFields ? 0 : -1}
          >
            Authenticate
          </button>
          <div
            className={`identity-auth-panel__nav identity-auth-panel__nav--otp-back${showOtpFields ? ' identity-auth-panel__nav--with-back' : ''}`}
          >
            {showOtpFields ? (
              <button
                type="button"
                className="identity-auth-panel__back-btn"
                aria-label="Back to enter master password"
                onClick={handleOtpBack}
                tabIndex={0}
              >
                <BackStepIcon />
              </button>
            ) : null}
          </div>
        </div>
      </div>
    )
  }

  function renderFormStep() {
    if (formStep === 'name') return renderNameStep()
    if (formStep === 'email') return renderEmailStep()
    if (formStep === 'password') return renderPasswordStep()
    if (formStep === 'otp') return renderOtpStep()
    return null
  }

  const showIntroActions = formStep === 'intro'
  const isFormStep =
    formStep === 'name' || formStep === 'email' || formStep === 'password' || formStep === 'otp'
  const usesActionSlot = showIntroActions || isFormStep

  const panelClass = [
    'identity-auth-panel',
    visible && isOverlay ? ' identity-auth-panel--visible' : '',
    visible && isCenter ? ' identity-auth-panel--center identity-auth-panel--center-visible' : '',
    isClear ? ' identity-auth-panel--clear' : '',
    visible && isClear ? ' identity-auth-panel--clear-visible' : '',
    usesActionSlot ? ' identity-auth-panel--action-slot-layout' : '',
    isFormStep ? ' identity-auth-panel--form-active' : '',
  ]
    .filter(Boolean)
    .join('')

  const body = (
    <>
      <header className="identity-auth-panel__head">
        <AuthShieldIcon />
        <div className="identity-auth-panel__titles">
          <h2 className="identity-auth-panel__title">
            {visible ? (
              <TypewriterText
                key="auth-panel-title"
                text={TITLE_TEXT}
                speed={26}
                startDelay={280}
                className="identity-auth-panel__title-type"
                onComplete={() => setTitleDone(true)}
                showCursor
              />
            ) : (
              <span className="identity-auth-panel__title-placeholder" aria-hidden="true">
                {TITLE_TEXT}
              </span>
            )}
          </h2>
          <p
            className={`identity-auth-panel__subtitle${titleDone ? ' identity-auth-panel__subtitle--visible' : ''}`}
          >
            Secure credential verification gateway
          </p>
        </div>
      </header>
      {usesActionSlot ? (
        <div className="identity-auth-panel__action-slot">
          {showIntroActions ? (
            <div className="identity-auth-panel__intro-main">
              <div
                className={`identity-auth-panel__status${titleDone ? ' identity-auth-panel__status--visible' : ''}`}
                role="status"
                aria-live="polite"
              >
                <span className="identity-auth-panel__status-dot" aria-hidden />
                <span className="identity-auth-panel__status-text">Initializing secure session…</span>
              </div>
              {showContinue ? (
                <button
                  type="button"
                  className={`identity-auth-panel__continue${titleDone ? ' identity-auth-panel__continue--visible' : ''}`}
                  onClick={handleProceed}
                  disabled={!titleDone}
                  tabIndex={titleDone ? 0 : -1}
                >
                  Proceed to Authenticate Identity →
                </button>
              ) : null}
            </div>
          ) : null}
          {isFormStep ? renderFormStep() : null}
        </div>
      ) : null}
    </>
  )

  return (
    <div
      className={panelClass}
      role="region"
      aria-label="Identity Authentication Panel"
      aria-hidden={!visible}
    >
      {isClear ? (
        <div className="identity-auth-panel__surface">{body}</div>
      ) : (
        <div className="identity-auth-panel__glass">
          <div className="identity-auth-panel__shine" aria-hidden />
          {body}
        </div>
      )}
    </div>
  )
}
