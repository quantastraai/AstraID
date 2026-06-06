import { useCallback, useEffect, useRef, useState } from 'react'
import { BlinkingDots } from './BlinkingDots'
import { TypewriterText } from './TypewriterText'
import './EncryptionProcessingStep.css'

const TITLE_TEXT = 'Encryption Processing Screen'
const PROCESS_STEPS = [
  'Generating Secure Identity...',
  'Encrypting Credentials...',
  'Establishing Zero-Trust Authentication....',
]
const STEP_LOADING_MS = 2800
const STEP_DONE_MS = 320

function StepCheckIcon() {
  return (
    <svg
      className="encryption-step__check-icon"
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

export function EncryptionProcessingStep({ onComplete }) {
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  const [titleReady, setTitleReady] = useState(false)
  const [currentStep, setCurrentStep] = useState(-1)
  const [stepPhase, setStepPhase] = useState('idle')

  const handleTitleReady = useCallback(() => {
    setTitleReady(true)
    setCurrentStep(0)
    setStepPhase('typing')
  }, [])

  const handleStepTypeComplete = useCallback(() => {
    setStepPhase('loading')
  }, [])

  useEffect(() => {
    if (!titleReady || currentStep < 0) return undefined
    if (stepPhase !== 'loading') return undefined

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const delay = prefersReduced ? 450 : STEP_LOADING_MS

    const timerId = window.setTimeout(() => {
      setStepPhase('done')
    }, delay)

    return () => window.clearTimeout(timerId)
  }, [titleReady, currentStep, stepPhase])

  useEffect(() => {
    if (!titleReady || currentStep < 0 || stepPhase !== 'done') return undefined

    const timerId = window.setTimeout(() => {
      if (currentStep >= PROCESS_STEPS.length - 1) {
        onCompleteRef.current?.()
        return
      }
      setCurrentStep((index) => index + 1)
      setStepPhase('typing')
    }, STEP_DONE_MS)

    return () => window.clearTimeout(timerId)
  }, [titleReady, currentStep, stepPhase])

  return (
    <div className="encryption-processing">
      <p className="encryption-processing__title">
        <TypewriterText
          text={TITLE_TEXT}
          speed={30}
          startDelay={100}
          className="encryption-processing__title-type"
          onComplete={handleTitleReady}
        />
      </p>

      {titleReady ? (
        <div className="encryption-processing__terminal" aria-label="Encryption progress">
          <div className="encryption-processing__terminal-head" aria-hidden>
            <span className="encryption-processing__terminal-dot" />
            <span className="encryption-processing__terminal-dot" />
            <span className="encryption-processing__terminal-dot" />
            <span className="encryption-processing__terminal-label">astra-vault.sh</span>
          </div>
          <ul className="encryption-processing__steps">
            {PROCESS_STEPS.map((text, index) => {
              const isPast = index < currentStep
              const isCurrent = index === currentStep
              if (!isPast && !isCurrent) return null

              const status = isPast ? 'done' : stepPhase

              return (
                <li key={text} className={`encryption-step encryption-step--${status}`}>
                  <div className="encryption-step__row">
                    <span className="encryption-step__prefix" aria-hidden>
                      &gt;
                    </span>
                    {status === 'typing' ? (
                      <TypewriterText
                        key={`step-type-${index}`}
                        text={text}
                        speed={26}
                        className="encryption-step__type"
                        onComplete={handleStepTypeComplete}
                      />
                    ) : (
                      <span className="encryption-step__text">{text}</span>
                    )}
                    {status === 'loading' ? <BlinkingDots /> : null}
                    {status === 'done' ? (
                      <span className="encryption-step__check">
                        <StepCheckIcon />
                      </span>
                    ) : null}
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      ) : (
        <div
          className="encryption-processing__terminal encryption-processing__terminal--placeholder"
          aria-hidden
        >
          <ul className="encryption-processing__steps">
            {PROCESS_STEPS.map((text) => (
              <li key={text} className="encryption-step encryption-step--placeholder">
                <div className="encryption-step__row">
                  <span className="encryption-step__prefix">&gt;</span>
                  <span className="encryption-step__text">{text}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
