import './LoginHero.css'

export function LoginHero({ visible = false, exiting = false, onSecureAccess }) {
  return (
    <div
      className={`login-hero${visible ? ' login-hero--visible' : ''}${exiting ? ' login-hero--exit' : ''}`}
      aria-hidden={!visible}
    >
      <div className="login-hero__head">
        <h1 className="login-hero__title">
          <span className="login-hero__word" style={{ '--hero-i': 0 }}>
            Secure
          </span>{' '}
          <span className="login-hero__word" style={{ '--hero-i': 1 }}>
            Digital
          </span>{' '}
          <span
            className="login-hero__word login-hero__word--accent"
            style={{ '--hero-i': 2 }}
          >
            Identity
          </span>
        </h1>
        <div className="login-hero__rule" aria-hidden />
        <p className="login-hero__subtitle">
          <span className="login-hero__subtitle-text">For The Modern World</span>
        </p>
      </div>

      <div className="login-hero__actions">
        <button
          type="button"
          className="login-hero__secure-btn"
        onClick={onSecureAccess}
        disabled={!visible || exiting}
        >
          <span className="login-hero__secure-btn-border" aria-hidden />
          <span className="login-hero__secure-btn-shimmer" aria-hidden />
          <span className="login-hero__secure-btn-glow" aria-hidden />
          <span className="login-hero__secure-btn-text">Secure Access</span>
          <span className="login-hero__secure-btn-arrow" aria-hidden>
            →
          </span>
        </button>
      </div>

      <p
        className="login-hero__footnote"
        aria-label="Quantum-secured identity infrastructure"
      >
        <span className="login-hero__footnote-shimmer" aria-hidden />
        <span className="login-hero__footnote-line" aria-hidden>
          Q U A N T U M - S E C U R E D
        </span>
        <span className="login-hero__footnote-line" aria-hidden>
          I D E N T I T Y &nbsp; I N F R A S T R U C T U R E
        </span>
      </p>
    </div>
  )
}
