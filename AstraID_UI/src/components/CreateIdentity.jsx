import { useCallback, useEffect, useRef, useState } from 'react'
import { BlinkingDots } from './BlinkingDots'
import { LoginTrust } from './LoginTrust'
import { EncryptionProcessingStep } from './EncryptionProcessingStep'
import { IdentityProvisioned } from './IdentityProvisioned'
import { PasswordStrengthBar } from './PasswordStrengthBar'
import { TypewriterText } from './TypewriterText'
import './CreateIdentity.css'

const TITLE_TEXT = 'Create Your Secure Digital Identity'
const SUBTITLE_TEXT = 'Advanced encrypted identity provisioning system'
const BUTTON_TEXT = 'Initialize Identity'
const INITIALIZING_TEXT = 'Initializing Secure Environment'
const TUNNEL_TEXT = 'Encrypted tunnel established ✓'
const NAME_PROMPT_TEXT = 'Enter your name'
const METADATA_TEXT = 'Identity metadata initialization'
const EMAIL_PROMPT_TEXT = 'Secure email address'
const EMAIL_VALIDATION_TEXT = 'encrypted mail tunnel established'
const CREATE_PASSWORD_TEXT = 'Create Master Password'
const CONFIRM_PASSWORD_TEXT = 'Confirm Master Password'
const AES_ENABLED_TEXT = 'AES-256 password vault encryption enabled'

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

function NextStepIcon() {
  return (
    <svg
      className="create-identity-page__next-icon"
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
      className="create-identity-page__back-icon"
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

function StepNavButtons({
  showBack = false,
  onBack,
  nextVisible = false,
  nextDisabled = true,
  onNext,
  nextAriaLabel,
  backAriaLabel = 'Go back',
  nextTabIndex = -1,
}) {
  const navClass = [
    'create-identity-page__nav',
    showBack ? ' create-identity-page__nav--with-back' : '',
    showBack && nextVisible ? ' create-identity-page__nav--dual' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={navClass}>
      {showBack ? (
        <button
          type="button"
          className="create-identity-page__back-btn"
          aria-label={backAriaLabel}
          onClick={onBack}
          tabIndex={0}
        >
          <BackStepIcon />
        </button>
      ) : null}
      <button
        type="button"
        className={`create-identity-page__next-btn${nextVisible ? ' create-identity-page__next-btn--visible' : ''}`}
        aria-label={nextAriaLabel}
        disabled={nextDisabled}
        tabIndex={nextTabIndex}
        onClick={onNext}
      >
        <NextStepIcon />
      </button>
    </div>
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
    <div className="create-identity-page__name-label">
      <span id={`${id}-label`} className="visually-hidden">
        {labelText}
      </span>
      <div className="create-identity-page__password-field">
        <input
          id={id}
          type={visible ? 'text' : 'password'}
          className="create-identity-page__name-input create-identity-page__name-input--with-eye"
          value={value}
          onChange={onChange}
          autoComplete="new-password"
          aria-labelledby={`${id}-label`}
          autoFocus={autoFocus}
          placeholder=""
          tabIndex={tabIndex}
        />
        <button
          type="button"
          className="create-identity-page__password-toggle"
          aria-label={visible ? 'Hide password' : 'Show password'}
          onClick={onToggleVisible}
          tabIndex={tabIndex}
        >
          <EyeToggleIcon visible={visible} />
        </button>
      </div>
    </div>
  )
}

function EyeToggleIcon({ visible }) {
  if (visible) {
    return (
      <svg className="create-identity-page__eye-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden>
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
    <svg className="create-identity-page__eye-icon" viewBox="0 0 24 24" width="18" height="18" aria-hidden>
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

function ValidationCheckIcon() {
  return (
    <svg
      className="create-identity-page__validation-check"
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

const INIT_PHASE_MS = 5000
const TUNNEL_PHASE_MS = 5000
const PROGRESS_NEXT_CLICKS = 4
const PROGRESS_PER_NEXT = 100 / PROGRESS_NEXT_CLICKS
const MOBILE_BREAKPOINT = '(max-width: 520px)'

export function CreateIdentity({
  theme = 'dark',
  entered = true,
  onDraftChange,
  onIdentityProgress,
  onAccessWorkspace,
}) {
  const prevInitPhaseRef = useRef('idle')
  const [progressNextCount, setProgressNextCount] = useState(0)
  const [showSubtitle, setShowSubtitle] = useState(false)
  const [showButton, setShowButton] = useState(false)
  const [buttonReady, setButtonReady] = useState(false)
  const [initPhase, setInitPhase] = useState('idle')
  const [showInitDots, setShowInitDots] = useState(false)
  const [formStep, setFormStep] = useState('name')
  const [showNameFields, setShowNameFields] = useState(false)
  const [showEmailFields, setShowEmailFields] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [emailValidated, setEmailValidated] = useState(false)
  const [emailValidationReady, setEmailValidationReady] = useState(false)
  const [showCreatePasswordFields, setShowCreatePasswordFields] = useState(false)
  const [showConfirmPasswordFields, setShowConfirmPasswordFields] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCreatePasswordText, setShowCreatePasswordText] = useState(false)
  const [showConfirmPasswordText, setShowConfirmPasswordText] = useState(false)
  const [showAesMessage, setShowAesMessage] = useState(false)
  const [aesMessageReady, setAesMessageReady] = useState(false)
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(MOBILE_BREAKPOINT).matches,
  )

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_BREAKPOINT)
    const handleChange = () => setIsMobile(mediaQuery.matches)
    handleChange()
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    if (isMobile && entered) {
      setShowSubtitle(true)
      setShowButton(true)
      setButtonReady(true)
      return
    }

    if (!isMobile && entered && initPhase === 'idle') {
      setShowSubtitle(true)
      setShowButton(true)
      setButtonReady(true)
    }
  }, [isMobile, entered, initPhase])

  useEffect(() => {
    onDraftChange?.({ name, email })
  }, [name, email, onDraftChange])

  const hasName = name.trim().length > 0
  const hasValidEmail = isValidEmail(email)
  const canProceedCreatePassword = password.trim().length >= 8
  const passwordsMatch =
    password.length > 0 && confirmPassword.length > 0 && password === confirmPassword

  function handleInitialize() {
    setInitPhase('initializing')
    setShowInitDots(false)
  }

  useEffect(() => {
    if (initPhase !== 'initializing') return undefined

    const timerId = window.setTimeout(() => {
      setShowInitDots(false)
      setInitPhase('tunnel')
    }, INIT_PHASE_MS)

    return () => window.clearTimeout(timerId)
  }, [initPhase])

  useEffect(() => {
    if (initPhase !== 'tunnel') return undefined

    const timerId = window.setTimeout(() => {
      setInitPhase('enter-name')
    }, TUNNEL_PHASE_MS)

    return () => window.clearTimeout(timerId)
  }, [initPhase])

  function advanceIdentityProgress() {
    setProgressNextCount((count) => {
      const nextCount = Math.min(PROGRESS_NEXT_CLICKS, count + 1)
      onIdentityProgress?.(Math.round(nextCount * PROGRESS_PER_NEXT))
      return nextCount
    })
  }

  useEffect(() => {
    if (prevInitPhaseRef.current === 'tunnel' && initPhase === 'enter-name') {
      setProgressNextCount(0)
      onIdentityProgress?.(0)
    }
    prevInitPhaseRef.current = initPhase
  }, [initPhase, onIdentityProgress])

  useEffect(() => {
    if (initPhase !== 'enter-name') return
    setProgressNextCount(0)
    setFormStep('name')
    setShowNameFields(false)
    setShowEmailFields(false)
    setName('')
    setEmail('')
    setEmailValidated(false)
    setEmailValidationReady(false)
    setShowCreatePasswordFields(false)
    setShowConfirmPasswordFields(false)
    setPassword('')
    setConfirmPassword('')
    setShowCreatePasswordText(false)
    setShowConfirmPasswordText(false)
    setShowAesMessage(false)
    setAesMessageReady(false)
  }, [initPhase])

  function retreatIdentityProgress() {
    setProgressNextCount((count) => {
      const nextCount = Math.max(0, count - 1)
      onIdentityProgress?.(Math.round(nextCount * PROGRESS_PER_NEXT))
      return nextCount
    })
  }

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

  function handleNameNext() {
    setFormStep('email')
    setShowEmailFields(false)
    setEmailValidated(false)
    setEmailValidationReady(false)
    advanceIdentityProgress()
  }

  function handleEmailBack() {
    setFormStep('name')
    setShowNameFields(true)
    retreatIdentityProgress()
  }

  function handleEmailNext() {
    setFormStep('create-password')
    setShowCreatePasswordFields(false)
    setPassword('')
    advanceIdentityProgress()
  }

  function handleCreatePasswordBack() {
    setFormStep('email')
    setShowEmailFields(true)
    if (hasValidEmail) setEmailValidated(true)
    if (emailValidationReady) setEmailValidationReady(true)
    retreatIdentityProgress()
  }

  function handleCreatePasswordNext() {
    setFormStep('confirm-password')
    setShowConfirmPasswordFields(false)
    setConfirmPassword('')
    setShowConfirmPasswordText(false)
    setShowAesMessage(false)
    setAesMessageReady(false)
    advanceIdentityProgress()
  }

  function handleConfirmPasswordBack() {
    setFormStep('create-password')
    setShowCreatePasswordFields(true)
    retreatIdentityProgress()
  }

  const handleEncryptionComplete = useCallback(() => {
    if (isMobile) {
      onIdentityProgress?.(null)
    }
    setFormStep('identity-provisioned')
  }, [isMobile, onIdentityProgress])

  function handleConfirmPasswordNext() {
    setFormStep('encryption-processing')
    advanceIdentityProgress()
  }

  useEffect(() => {
    if (formStep !== 'confirm-password') {
      setShowAesMessage(false)
      setAesMessageReady(false)
      return
    }
    if (!passwordsMatch) {
      setShowAesMessage(false)
      setAesMessageReady(false)
      return
    }
    const timerId = window.setTimeout(() => setShowAesMessage(true), 400)
    return () => window.clearTimeout(timerId)
  }, [formStep, passwordsMatch, confirmPassword])

  useEffect(() => {
    setAesMessageReady(false)
  }, [showAesMessage])

  useEffect(() => {
    if (formStep === 'identity-provisioned' && !isMobile) {
      onIdentityProgress?.(100)
    }
  }, [formStep, onIdentityProgress, isMobile])

  function renderActions() {
    if (initPhase === 'initializing') {
      return (
        <p
          className="create-identity-page__init-status"
          role="status"
          aria-live="polite"
          aria-label={`${INITIALIZING_TEXT}...`}
        >
          <TypewriterText
            text={INITIALIZING_TEXT}
            speed={32}
            startDelay={120}
            className="create-identity-page__init-status-type"
            onComplete={() => setShowInitDots(true)}
          />
          {showInitDots ? <BlinkingDots /> : null}
        </p>
      )
    }

    if (initPhase === 'tunnel') {
      return (
        <p
          className="create-identity-page__tunnel-status"
          role="status"
          aria-live="polite"
        >
          <TypewriterText
            text={TUNNEL_TEXT}
            speed={28}
            className="create-identity-page__tunnel-status-type"
          />
        </p>
      )
    }

    if (showButton) {
      return (
        <button
          type="button"
          className="create-identity-page__init-btn"
          disabled={!buttonReady}
          aria-label={BUTTON_TEXT}
          onClick={handleInitialize}
        >
          <span className="create-identity-page__init-btn-type">{BUTTON_TEXT}</span>
        </button>
      )
    }

    return (
      <span className="create-identity-page__init-btn-placeholder" aria-hidden="true">
        {BUTTON_TEXT}
      </span>
    )
  }

  function renderEmailStep() {
    return (
      <div className="create-identity-page__name-form">
        <p className="create-identity-page__name-prompt">
          <TypewriterText
            text={EMAIL_PROMPT_TEXT}
            speed={34}
            startDelay={100}
            className="create-identity-page__name-prompt-type"
            onComplete={() => setShowEmailFields(true)}
          />
        </p>
        <div
          className={`create-identity-page__fields${showEmailFields ? ' create-identity-page__fields--visible' : ''}`}
        >
          <label className="create-identity-page__name-label" htmlFor="identity-email">
            <span className="visually-hidden">{EMAIL_PROMPT_TEXT}</span>
            <input
              id="identity-email"
              type="email"
              className="create-identity-page__name-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              autoFocus={showEmailFields}
              placeholder=""
              tabIndex={showEmailFields ? 0 : -1}
            />
          </label>
          <div className="create-identity-page__validation-slot">
            {emailValidated ? (
              <p className="create-identity-page__email-validation" role="status" aria-live="polite">
                <TypewriterText
                  text={EMAIL_VALIDATION_TEXT}
                  speed={26}
                  className="create-identity-page__email-validation-type"
                  onComplete={() => setEmailValidationReady(true)}
                />
                {emailValidationReady ? (
                  <span className="create-identity-page__email-validation-icon">
                    <ValidationCheckIcon />
                  </span>
                ) : null}
              </p>
            ) : (
              <p className="create-identity-page__email-validation-placeholder" aria-hidden="true">
                {EMAIL_VALIDATION_TEXT}
              </p>
            )}
          </div>
          <StepNavButtons
            showBack={showEmailFields}
            onBack={handleEmailBack}
            backAriaLabel="Back to enter your name"
            nextVisible={emailValidationReady}
            nextDisabled={!emailValidationReady}
            onNext={handleEmailNext}
            nextAriaLabel="Continue to create password"
            nextTabIndex={emailValidationReady ? 0 : -1}
          />
        </div>
      </div>
    )
  }

  function renderCreatePasswordStep() {
    return (
      <div className="create-identity-page__name-form">
        <p className="create-identity-page__name-prompt">
          <TypewriterText
            text={CREATE_PASSWORD_TEXT}
            speed={32}
            startDelay={100}
            className="create-identity-page__name-prompt-type"
            onComplete={() => setShowCreatePasswordFields(true)}
          />
        </p>
        <div
          className={`create-identity-page__fields${showCreatePasswordFields ? ' create-identity-page__fields--visible' : ''}`}
        >
          <PasswordInputWithEye
            id="identity-password"
            labelText={CREATE_PASSWORD_TEXT}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            visible={showCreatePasswordText}
            onToggleVisible={() => setShowCreatePasswordText((v) => !v)}
            autoFocus={showCreatePasswordFields}
            tabIndex={showCreatePasswordFields ? 0 : -1}
          />
          <PasswordStrengthBar password={password} />
          <StepNavButtons
            showBack={showCreatePasswordFields}
            onBack={handleCreatePasswordBack}
            backAriaLabel="Back to secure email address"
            nextVisible={canProceedCreatePassword}
            nextDisabled={!canProceedCreatePassword}
            onNext={handleCreatePasswordNext}
            nextAriaLabel="Continue to confirm password"
            nextTabIndex={canProceedCreatePassword ? 0 : -1}
          />
        </div>
      </div>
    )
  }

  function renderConfirmPasswordStep() {
    return (
      <div className="create-identity-page__name-form">
        <p className="create-identity-page__name-prompt">
          <TypewriterText
            text={CONFIRM_PASSWORD_TEXT}
            speed={32}
            startDelay={100}
            className="create-identity-page__name-prompt-type"
            onComplete={() => setShowConfirmPasswordFields(true)}
          />
        </p>
        <div
          className={`create-identity-page__fields${showConfirmPasswordFields ? ' create-identity-page__fields--visible' : ''}`}
        >
          <PasswordInputWithEye
            id="identity-password-confirm"
            labelText={CONFIRM_PASSWORD_TEXT}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            visible={showConfirmPasswordText}
            onToggleVisible={() => setShowConfirmPasswordText((v) => !v)}
            autoFocus={showConfirmPasswordFields}
            tabIndex={showConfirmPasswordFields ? 0 : -1}
          />
          <div className="create-identity-page__validation-slot">
            {showAesMessage ? (
              <p className="create-identity-page__aes-message" role="status" aria-live="polite">
                <TypewriterText
                  text={AES_ENABLED_TEXT}
                  speed={24}
                  className="create-identity-page__aes-message-type"
                  onComplete={() => setAesMessageReady(true)}
                />
              </p>
            ) : (
              <p className="create-identity-page__email-validation-placeholder" aria-hidden="true">
                {AES_ENABLED_TEXT}
              </p>
            )}
          </div>
          <StepNavButtons
            showBack={showConfirmPasswordFields}
            onBack={handleConfirmPasswordBack}
            backAriaLabel="Back to create master password"
            nextVisible={aesMessageReady}
            nextDisabled={!aesMessageReady}
            onNext={handleConfirmPasswordNext}
            nextAriaLabel="Continue to encryption processing"
            nextTabIndex={aesMessageReady ? 0 : -1}
          />
        </div>
      </div>
    )
  }

  function renderNameForm() {
    if (formStep === 'email') return renderEmailStep()
    if (formStep === 'create-password') return renderCreatePasswordStep()
    if (formStep === 'confirm-password') return renderConfirmPasswordStep()
    if (formStep === 'encryption-processing') {
      return (
        <EncryptionProcessingStep
          key="encryption-processing"
          onComplete={handleEncryptionComplete}
        />
      )
    }

    if (formStep === 'identity-provisioned') {
      return (
        <IdentityProvisioned
          theme={theme}
          name={name}
          email={email}
          onAccessWorkspace={() =>
            onAccessWorkspace?.({ name, email, astraId: 'ASTRA-ID-7X92A' })
          }
        />
      )
    }

    return (
      <div className="create-identity-page__name-form">
        <p className="create-identity-page__name-prompt">
          <TypewriterText
            text={NAME_PROMPT_TEXT}
            speed={36}
            startDelay={100}
            className="create-identity-page__name-prompt-type"
            onComplete={() => setShowNameFields(true)}
          />
        </p>
        <div
          className={`create-identity-page__fields${showNameFields ? ' create-identity-page__fields--visible' : ''}`}
        >
          <label className="create-identity-page__name-label" htmlFor="identity-name">
            <span className="visually-hidden">{NAME_PROMPT_TEXT}</span>
            <input
              id="identity-name"
              type="text"
              className="create-identity-page__name-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              autoFocus={showNameFields}
              placeholder=""
              tabIndex={showNameFields ? 0 : -1}
            />
          </label>
          <p className="create-identity-page__metadata" role="status" aria-live="polite">
            <span className="create-identity-page__metadata-type">{METADATA_TEXT}</span>
            <BlinkingDots />
          </p>
          <button
            type="button"
            className={`create-identity-page__next-btn${hasName ? ' create-identity-page__next-btn--visible' : ''}`}
            aria-label="Continue to email verification"
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

  const isNameEntry = initPhase === 'enter-name'
  const hideTopHeadings =
    formStep === 'encryption-processing' || formStep === 'identity-provisioned'
  const showHeroIdle = initPhase === 'idle' && !hideTopHeadings

  return (
    <>
      <section
        className={`create-identity-page${entered ? ' create-identity-page--entered' : ''}${isNameEntry ? ' create-identity-page--name-entry' : ''}${hideTopHeadings ? ' create-identity-page--encryption create-identity-page--provisioned' : ''}${showHeroIdle ? ' create-identity-page--hero-idle' : ''}`}
        aria-labelledby={hideTopHeadings ? undefined : 'create-identity-heading'}
      >
        {showHeroIdle ? (
          <div className="create-identity-page__hero-stage" aria-hidden>
            <div className="create-identity-page__center-glow">
              <div className="create-identity-page__center-glow-rings">
                <span className="create-identity-page__center-glow-ring" />
                <span className="create-identity-page__center-glow-ring" />
                <span className="create-identity-page__center-glow-ring" />
                <span className="create-identity-page__center-glow-ring" />
              </div>
            </div>
          </div>
        ) : null}
        <header
          className={`create-identity-page__intro${hideTopHeadings ? ' create-identity-page__intro--hidden' : ''}${showHeroIdle ? ' create-identity-page__intro--hero' : ''}${entered && showHeroIdle ? ' create-identity-page__intro--hero-entered' : ''}`}
        >
          <h1 id="create-identity-heading" className="create-identity-page__title">
            {showHeroIdle ? (
              <span className="create-identity-page__title-type create-identity-page__title-type--stacked">
                <span className="create-identity-page__title-line create-identity-page__title-line--lead">
                  Create Your
                </span>
                <span className="create-identity-page__title-line create-identity-page__title-line--main">
                  <span
                    className="create-identity-page__title-word"
                    style={{ '--hero-i': 0 }}
                  >
                    Secure
                  </span>{' '}
                  <span
                    className="create-identity-page__title-word"
                    style={{ '--hero-i': 1 }}
                  >
                    Digital
                  </span>{' '}
                  <span
                    className="create-identity-page__title-word create-identity-page__title-word--accent"
                    style={{ '--hero-i': 2 }}
                  >
                    Identity
                  </span>
                </span>
              </span>
            ) : (
              <span className="create-identity-page__title-type">{TITLE_TEXT}</span>
            )}
          </h1>
          {showSubtitle ? <div className="create-identity-page__title-rule" aria-hidden /> : null}
          <p className="create-identity-page__subtitle">
            {showSubtitle ? (
              showHeroIdle ? (
                <span className="create-identity-page__subtitle-type create-identity-page__subtitle-type--hero">
                  {SUBTITLE_TEXT}
                </span>
              ) : (
                <span className="create-identity-page__subtitle-type">{SUBTITLE_TEXT}</span>
              )
            ) : (
              <span className="create-identity-page__subtitle-placeholder" aria-hidden="true">
                {SUBTITLE_TEXT}
              </span>
            )}
          </p>
          {!isNameEntry ? (
            <div className="create-identity-page__actions">{renderActions()}</div>
          ) : null}
        </header>
        {isNameEntry ? (
          <div className="create-identity-page__name-center">{renderNameForm()}</div>
        ) : null}
      </section>
      {formStep !== 'identity-provisioned' ? (
        <div className="create-identity-page__content">
          <LoginTrust />
        </div>
      ) : null}
    </>
  )
}
