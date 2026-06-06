import { useEffect, useState } from 'react'
import './CreateIdentityTooltip.css'

const OPEN_MS = 5000
const CLOSE_MS = 2000

export function CreateIdentityTooltip({
  mode = 'welcome',
  onCreateIdentity,
  onAuthenticate,
}) {
  const [visible, setVisible] = useState(true)
  const isAuthenticate = mode === 'authenticate'

  function handleActionClick() {
    if (isAuthenticate) onAuthenticate?.()
    else onCreateIdentity?.()
  }

  useEffect(() => {
    let timeoutId

    const schedule = (show) => {
      setVisible(show)
      timeoutId = window.setTimeout(
        () => schedule(!show),
        show ? OPEN_MS : CLOSE_MS,
      )
    }

    schedule(true)
    return () => window.clearTimeout(timeoutId)
  }, [mode])

  return (
    <aside
      className={`create-tooltip${isAuthenticate ? ' create-tooltip--authenticate' : ''}${visible ? ' create-tooltip--visible' : ' create-tooltip--hidden'}`}
      aria-live="polite"
      aria-hidden={!visible}
    >
      <p className="create-tooltip__text">
        {isAuthenticate ? (
          <>
            Already Have An AstraID?{' '}
            <button
              type="button"
              className="create-tooltip__action"
              onClick={handleActionClick}
            >
              Authenticate
            </button>
          </>
        ) : (
          <>
            New to AstraID?{' '}
            <button
              type="button"
              className="create-tooltip__action"
              onClick={handleActionClick}
            >
              Create Identity
            </button>
          </>
        )}
      </p>
    </aside>
  )
}
