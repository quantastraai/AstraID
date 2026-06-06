import './DashboardIdIcon.css'

function IdCardGlyph() {
  return (
    <svg
      className="dashboard-id-icon__glyph"
      viewBox="0 0 24 24"
      width="26"
      height="26"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <circle cx="9" cy="11" r="2" />
      <path d="M13 10.5h4M13 14h6" />
    </svg>
  )
}

export function DashboardIdIcon({ onClick, className = '' }) {
  return (
    <button
      type="button"
      id="dashboard-id-icon"
      className={`dashboard-id-icon dashboard-id-icon--header${className ? ` ${className}` : ''}`}
      onClick={onClick}
      aria-label="View ID"
      title="View ID"
    >
      <span className="dashboard-id-icon__frame">
        <IdCardGlyph />
      </span>
    </button>
  )
}
