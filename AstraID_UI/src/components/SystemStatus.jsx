import './SystemStatus.css'

function ShieldIcon() {
  return (
    <svg className="system-status__shield-svg" viewBox="0 0 24 24" width="18" height="18" aria-hidden>
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

function CheckIcon() {
  return (
    <svg className="system-status__check-svg" viewBox="0 0 24 24" width="12" height="12" aria-hidden>
      <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.2" />
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m8 12 2.5 2.5L16 9"
      />
    </svg>
  )
}

export function SystemStatus() {
  return (
    <div className="system-status" role="status" aria-live="polite">
      <span className="system-status__shield">
        <ShieldIcon />
      </span>
      <span className="system-status__dot" aria-hidden />
      <div className="system-status__copy">
        <p className="system-status__label">
          <span className="system-status__prefix">System Status: </span>
          <span className="system-status__secure">Secure</span>
        </p>
        <p className="system-status__detail">
          <CheckIcon />
          <span>All services operational</span>
        </p>
      </div>
    </div>
  )
}
