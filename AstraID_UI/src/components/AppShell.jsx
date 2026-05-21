import './AppShell.css'
import { CreateIdentityTooltip } from './CreateIdentityTooltip'
import { IdentityCreationProgress } from './IdentityCreationProgress'
import { LastSecureAccess } from './LastSecureAccess'
import { ProjectCredit } from './ProjectCredit'
import { SystemStatus } from './SystemStatus'
import { DashboardIdIcon } from './DashboardIdIcon'
import { DashboardLogoutIcon } from './DashboardLogoutIcon'
import { ThemeToggle } from './ThemeToggle'

export function AppShell({
  theme,
  onThemeChange,
  children,
  showLastAccess = true,
  showIdentityProgress = false,
  identityPercent = 0,
  showAuthTooltip = true,
  tooltipMode = 'welcome',
  onCreateIdentity,
  onAuthenticate,
  dashboardCardOverlay = false,
  showDashboardIdIcon = false,
  onViewIdClick,
  onLogoutClick,
}) {
  const logoSrc = theme === 'light' ? '/astra-logo-light.png' : '/astra-logo.png'

  return (
    <div
      className={`app-shell${dashboardCardOverlay ? ' app-shell--card-overlay' : ''}`}
    >
      {dashboardCardOverlay ? (
        <div className="app-shell__card-backdrop" aria-hidden />
      ) : null}
      <header
        className={`brand-bar${showDashboardIdIcon ? ' brand-bar--with-id-icon' : ''}`}
        aria-label="Astra ID"
      >
        <div className="brand-logo-wrap">
          <img
            className="brand-logo"
            src={logoSrc}
            alt="Astra ID"
            width={1038}
            height={332}
            decoding="async"
          />
        </div>
        {showDashboardIdIcon ? (
          <div className="brand-bar__center">
            <div className="brand-bar__header-icons">
              <DashboardIdIcon
                className="brand-bar__id-icon"
                onClick={onViewIdClick}
              />
              <DashboardLogoutIcon
                className="brand-bar__logout-icon"
                onClick={onLogoutClick}
              />
            </div>
          </div>
        ) : null}
        <div className="brand-bar__actions">
          <ThemeToggle theme={theme} onThemeChange={onThemeChange} />
          <SystemStatus />
        </div>
      </header>
      <main className="app-shell__main">{children}</main>
      {showAuthTooltip ? (
        <CreateIdentityTooltip
          mode={tooltipMode}
          onCreateIdentity={onCreateIdentity}
          onAuthenticate={onAuthenticate}
        />
      ) : null}
      {showLastAccess ? <LastSecureAccess /> : null}
      {showIdentityProgress ? (
        <IdentityCreationProgress visible targetPercent={identityPercent} />
      ) : null}
      <ProjectCredit />
    </div>
  )
}
