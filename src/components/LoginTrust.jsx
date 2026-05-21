import { useEffect, useState } from 'react'
import './LoginTrust.css'

const SLIDE_MS = 4500

function ShieldIcon() {
  return (
    <svg className="login-trust__icon-svg" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3 4 6v6c0 5 3.5 8.5 8 9 4.5-.5 8-4 8-9V6l-8-3Z"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m9 12 2 2 4-4"
      />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg className="login-trust__icon-svg" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 11V8a5 5 0 0 1 10 0v3M6 11h12v10H6V11Z"
      />
      <circle cx="12" cy="16" r="1.25" fill="currentColor" />
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg className="login-trust__icon-svg" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 3l18 18M10.5 10.7A3 3 0 0 0 12 15a3 3 0 0 0 2.3-1M6.7 6.8C4.6 8.2 3 10.2 2 12c2.5 5 7.5 7 10 7 1.2 0 2.4-.3 3.5-.8M17.3 17.2C19.4 15.8 21 13.8 22 12c-2.5-5-7.5-7-10-7-1.1 0-2.2.2-3.2.6"
      />
    </svg>
  )
}

function ServerIcon() {
  return (
    <svg className="login-trust__icon-svg" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 7h14v4H5V7Zm0 6h14v4H5v-4Z"
      />
      <circle cx="8" cy="9" r="0.9" fill="currentColor" />
      <circle cx="8" cy="15" r="0.9" fill="currentColor" />
    </svg>
  )
}

function VerifiedBadge() {
  return (
    <svg className="login-trust__badge-svg" viewBox="0 0 24 24" aria-hidden>
      <circle cx="12" cy="12" r="11" fill="currentColor" />
      <path
        fill="none"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m8 12 2.5 2.5L16 9"
      />
    </svg>
  )
}

const TRUST_ITEMS = [
  {
    id: 'privacy',
    Icon: ShieldIcon,
    headline: 'We never share your data with anyone.',
    detail: '256-bit end-to-end encryption',
  },
  {
    id: 'auth',
    Icon: LockIcon,
    headline: 'Secure sign-in with protected sessions.',
    detail: 'Automatic timeout & credential hashing',
  },
  {
    id: 'tracking',
    Icon: EyeOffIcon,
    headline: 'No third-party tracking on your activity.',
    detail: 'Privacy-first analytics only',
  },
  {
    id: 'storage',
    Icon: ServerIcon,
    headline: 'Your data stays on encrypted servers.',
    detail: 'Redundant backups & access controls',
  },
]

function TrustBanner({ Icon, headline, detail, isActive }) {
  return (
    <aside className={`login-trust${isActive ? ' login-trust--active' : ''}`}>
      <span className="login-trust__icon">
        <Icon />
      </span>
      <div className="login-trust__copy">
        <p className="login-trust__headline">{headline}</p>
        <p className="login-trust__detail">{detail}</p>
      </div>
      <span
        className="login-trust__verified"
        aria-hidden={!isActive}
      >
        <VerifiedBadge />
      </span>
    </aside>
  )
}

export function LoginTrust() {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % TRUST_ITEMS.length)
    }, SLIDE_MS)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <div
      className="login-trust-carousel"
      aria-label="Security and privacy"
      aria-live="polite"
    >
      <div className="login-trust-carousel__viewport">
        <div
          className="login-trust-carousel__track"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {TRUST_ITEMS.map((item, i) => (
            <div
              key={item.id}
              className={`login-trust-carousel__slide${i === activeIndex ? ' login-trust-carousel__slide--active' : ''}`}
            >
              <TrustBanner
                Icon={item.Icon}
                headline={item.headline}
                detail={item.detail}
                isActive={i === activeIndex}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="login-trust-carousel__dots" aria-hidden>
        {TRUST_ITEMS.map((item, i) => (
          <span
            key={item.id}
            className={`login-trust-carousel__dot${i === activeIndex ? ' login-trust-carousel__dot--active' : ''}`}
          />
        ))}
      </div>
    </div>
  )
}
