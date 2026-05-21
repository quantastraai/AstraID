import { useState } from 'react'
import { LoginIntroSequence } from './LoginIntroSequence'
import { LoginScanPanel } from './LoginScanPanel'
import { LoginTrust } from './LoginTrust'
import './Login.css'

export function Login({ onSecureAccess }) {
  const [heroReady, setHeroReady] = useState(false)

  return (
    <section className="login" aria-label="Security">
      <div className="login__layout">
        <div className="login__center">
          <div className="login__center-glow" aria-hidden>
            <div className="login__center-glow-rings">
              <span className="login__center-glow-ring" />
              <span className="login__center-glow-ring" />
              <span className="login__center-glow-ring" />
              <span className="login__center-glow-ring" />
            </div>
          </div>
          <LoginIntroSequence
            onSecureAccess={onSecureAccess}
            onHeroReady={() => setHeroReady(true)}
          />
        </div>
        <LoginScanPanel active={heroReady} />
      </div>
      <div className="login__content">
        <LoginTrust />
      </div>
    </section>
  )
}
