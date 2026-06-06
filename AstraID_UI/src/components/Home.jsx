import { useAuth } from '../context/AuthContext'
import { AstraIdentityCard } from './AstraIdentityCard'
import './Home.css'

export function Home({
  theme = 'dark',
  showIntroCard = false,
  cardAuthPhase = 'idle',
  holderName = '',
  email = '',
  onDetectComplete,
  onRevealComplete,
  onDismissIntroCard,
}) {
  const { user } = useAuth()

  const displayName = holderName.trim() || user?.name?.trim() || 'Identity Holder'
  const displayEmail = email.trim() || user?.email?.trim() || '—'
  const hideSecrets = cardAuthPhase !== 'revealed' && cardAuthPhase !== 'revealing'
  const goldFlash = cardAuthPhase === 'revealed'

  const canDismissByBackdrop = showIntroCard && cardAuthPhase === 'revealed'

  return (
    <section className="home-view" aria-label="Dashboard">
      <div
        className={`home-view__body${showIntroCard ? ' home-view__body--intro' : ''}`}
      >
        {showIntroCard ? (
          <div className="home-view__intro-stage">
            {canDismissByBackdrop ? (
              <button
                type="button"
                className="home-view__backdrop"
                aria-label="Close identity card"
                onClick={onDismissIntroCard}
              />
            ) : null}
            <div className="home-view__intro" role="status" aria-live="polite">
              <AstraIdentityCard
                theme={theme}
                holderName={displayName}
                email={displayEmail}
                hideSecrets={hideSecrets}
                authPhase={cardAuthPhase}
                goldFlash={goldFlash}
                onDetectComplete={onDetectComplete}
                onRevealComplete={onRevealComplete}
                status="active"
                className="home-view__card"
              />
            </div>
          </div>
        ) : (
          <div className="home-view__dashboard">
            <p className="home-view__welcome">
              Welcome, <span className="home-view__name">{displayName}</span>
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
