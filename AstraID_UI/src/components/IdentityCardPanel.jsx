import { AstraIdentityCard } from './AstraIdentityCard'
import { IdentityDetectedStatus } from './IdentityDetectedStatus'
import './IdentityCardPanel.css'

export function IdentityCardPanel({
  theme,
  holderName,
  email,
  hideSecrets,
  authPhase,
  goldFlash,
  onDetectComplete,
  onRevealComplete,
  status = 'active',
  showIdentityDetected = false,
  onIdentityDetectedComplete,
  className = '',
}) {
  return (
    <div className={`identity-card-panel${className ? ` ${className}` : ''}`}>
      <AstraIdentityCard
        theme={theme}
        holderName={holderName}
        email={email}
        hideSecrets={hideSecrets}
        authPhase={authPhase}
        goldFlash={goldFlash}
        onDetectComplete={onDetectComplete}
        onRevealComplete={onRevealComplete}
        status={status}
      />
      <IdentityDetectedStatus
        visible={showIdentityDetected}
        onAnimationComplete={onIdentityDetectedComplete}
      />
    </div>
  )
}
