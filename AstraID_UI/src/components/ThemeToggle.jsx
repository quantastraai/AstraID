import './ThemeToggle.css'

export function ThemeToggle({ theme, onThemeChange }) {
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      className={`theme-toggle ${isDark ? 'theme-toggle--dark' : 'theme-toggle--light'}`}
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={() => onThemeChange(isDark ? 'light' : 'dark')}
    >
      <span className="theme-toggle__inner" aria-hidden>
        <span className="theme-toggle__glow" />
        <span className="theme-toggle__thumb" />
        <span className="theme-toggle__icons">
          <span className="theme-toggle__icon-slot theme-toggle__icon-slot--sun">
            <svg
              className="theme-toggle__svg theme-toggle__svg--sun"
              viewBox="0 0 24 24"
              width="17"
              height="17"
              aria-hidden
            >
              <path
                fill="currentColor"
                d="M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12Zm0-2a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM11 1h2v3h-2V1Zm0 19h2v3h-2v-3ZM3.5 4.9l1.4-1.4 2.1 2.1L5.6 7 3.5 4.9Zm15.1 15.1-1.4-1.4-2.1 2.1 1.4 1.4 2.1-2.1ZM1 11h3v2H1v-2Zm19 0h3v2h-3v-2ZM5.6 17 3.5 19.1l2.1 2.1 1.4-1.4L5.6 17ZM21.1 5.6 19 3.5l-2.1 2.1 1.4 1.4L19 7l2.1-2.1Z"
              />
            </svg>
          </span>
          <span className="theme-toggle__icon-slot theme-toggle__icon-slot--moon">
            <svg
              className="theme-toggle__svg theme-toggle__svg--moon"
              viewBox="0 0 24 24"
              width="17"
              height="17"
              aria-hidden
            >
              <path
                fill="currentColor"
                d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-3.03 0-5.5-2.47-5.5-5.5 0-1.82.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"
              />
            </svg>
          </span>
        </span>
      </span>
    </button>
  )
}
