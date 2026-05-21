import './DashboardLogoutIcon.css'

function LogoutGlyph() {
  return (
    <svg
      className="dashboard-logout-icon__glyph"
      viewBox="0 0 24 24"
      width="26"
      height="26"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 3v7.5" />
      <path d="M18.36 6.64a8.25 8.25 0 1 1-12.72 0" />
    </svg>
  )
}

export function DashboardLogoutIcon({ onClick, className = '' }) {
  return (
    <button
      type="button"
      className={`dashboard-logout-icon dashboard-logout-icon--header${className ? ` ${className}` : ''}`}
      onClick={onClick}
      aria-label="Sign out"
      title="Sign out"
    >
      <span className="dashboard-logout-icon__frame">
        <LogoutGlyph />
      </span>
    </button>
  )
}
