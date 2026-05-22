import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { AppShell } from './components/AppShell'
import { CreateIdentity } from './components/CreateIdentity'
import { Home } from './components/Home'
import { IdentityAuthView } from './components/IdentityAuthView'
import { Login } from './components/Login'
import { LogoutSessionTerminal } from './components/LogoutSessionTerminal'
import { useAuth } from './context/AuthContext'
import './AppLogoutOverlay.css'
import { readStoredTheme, THEME_STORAGE_KEY } from './theme'
import { isValidEmail } from './utils/identity'
import {
  guestViewFromPath,
  navigateToPath,
  PATH_DASHBOARD,
  PATH_HOME,
  pathFromView,
} from './utils/routes'

const AUTH_SCAN_MS = 2400
const POST_REVEAL_CARD_MS = 5000
const LOGOUT_FADE_MS = 700

function App() {
  const { isAuthenticated, enterWorkspace, logout, user } = useAuth()
  const [theme, setTheme] = useState(readStoredTheme)
  const [view, setView] = useState(() =>
    isAuthenticated ? 'dashboard' : guestViewFromPath(window.location.pathname),
  )
  const [identityDraft, setIdentityDraft] = useState({ name: '', email: '' })
  const [cardAuthPhase, setCardAuthPhase] = useState('idle')
  const [showDashboardIntro, setShowDashboardIntro] = useState(false)
  const [logoutPhase, setLogoutPhase] = useState('idle')
  const cardTimersRef = useRef([])
  const skipCardResetRef = useRef(false)

  useLayoutEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  const clearCardTimers = useCallback(() => {
    cardTimersRef.current.forEach((id) => window.clearTimeout(id))
    cardTimersRef.current = []
  }, [])

  const resetIdentityCard = useCallback(() => {
    clearCardTimers()
    setIdentityDraft({ name: '', email: '' })
    setCardAuthPhase('idle')
  }, [clearCardTimers])

  useLayoutEffect(() => {
    if (!isAuthenticated) return
    setShowIdentityProgress(false)
    setIdentityPercent(0)
    if (!skipCardResetRef.current) {
      resetIdentityCard()
      setShowDashboardIntro(false)
    } else {
      skipCardResetRef.current = false
    }
    setView('dashboard')
    navigateToPath(PATH_DASHBOARD, { replace: true })
  }, [isAuthenticated, resetIdentityCard])

  useEffect(() => {
    if (isAuthenticated) return
    setShowDashboardIntro(false)
    resetIdentityCard()
  }, [isAuthenticated, resetIdentityCard])

  useEffect(() => () => clearCardTimers(), [clearCardTimers])

  const navigateView = useCallback(
    (nextView, options = {}) => {
      if (!isAuthenticated) {
        navigateToPath(pathFromView(nextView), options)
      }
      setView(nextView)
    },
    [isAuthenticated],
  )

  useEffect(() => {
    if (isAuthenticated) return undefined

    function handlePopState() {
      const nextView = guestViewFromPath(window.location.pathname)
      setView(nextView)
      if (window.location.pathname === PATH_DASHBOARD) {
        navigateToPath(PATH_HOME, { replace: true })
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [isAuthenticated])

  useEffect(() => {
    if (isAuthenticated) {
      if (view !== 'dashboard') setView('dashboard')
      if (window.location.pathname !== PATH_DASHBOARD) {
        navigateToPath(PATH_DASHBOARD, { replace: true })
      }
      return
    }

    if (window.location.pathname === PATH_DASHBOARD) {
      setView('welcome')
      navigateToPath(PATH_HOME, { replace: true })
      return
    }

    const pathView = guestViewFromPath(window.location.pathname)
    if (view === 'dashboard' || view !== pathView) {
      setView(pathView)
    }

    const expectedPath = pathFromView(pathView)
    if (window.location.pathname !== expectedPath) {
      navigateToPath(expectedPath, { replace: true })
    }
  }, [view, isAuthenticated])

  const isAuthView = view === 'identity-auth'
  const isCreateView = view === 'create-identity'
  const isLoginView =
    !isAuthenticated && !isAuthView && !isCreateView
  const [loginSecureBlur, setLoginSecureBlur] = useState(false)

  useEffect(() => {
    if (!isLoginView) setLoginSecureBlur(false)
  }, [isLoginView])

  useEffect(() => {
    if (loginSecureBlur) {
      document.documentElement.setAttribute('data-secure-blur', '')
    } else {
      document.documentElement.removeAttribute('data-secure-blur')
    }
    return () => document.documentElement.removeAttribute('data-secure-blur')
  }, [loginSecureBlur])
  const [createEntered, setCreateEntered] = useState(false)

  useLayoutEffect(() => {
    if (!isCreateView) {
      setCreateEntered(false)
      return
    }
    const id = window.requestAnimationFrame(() => setCreateEntered(true))
    return () => window.cancelAnimationFrame(id)
  }, [isCreateView])

  const [showIdentityProgress, setShowIdentityProgress] = useState(false)
  const [identityPercent, setIdentityPercent] = useState(0)

  function handleIdentityProgress(percent) {
    setShowIdentityProgress(true)
    setIdentityPercent(percent)
  }

  function handleDraftChange(draft) {
    setIdentityDraft((prev) => ({ ...prev, ...draft }))
  }

  const handleIdentityDetected = useCallback(() => {
    setCardAuthPhase('revealing')
  }, [])

  const closeDashboardIntro = useCallback(() => {
    setShowDashboardIntro(false)
    resetIdentityCard()
  }, [resetIdentityCard])

  const dismissDashboardIntro = useCallback(() => {
    clearCardTimers()
    closeDashboardIntro()
  }, [clearCardTimers, closeDashboardIntro])

  const handleCardRevealComplete = useCallback(() => {
    setCardAuthPhase('revealed')
    clearCardTimers()
    cardTimersRef.current.push(
      window.setTimeout(() => closeDashboardIntro(), POST_REVEAL_CARD_MS),
    )
  }, [clearCardTimers, closeDashboardIntro])

  const startDashboardCardAnimation = useCallback(
    ({ skipAuthSteps = false } = {}) => {
      clearCardTimers()
      setShowDashboardIntro(true)
      if (skipAuthSteps) {
        setCardAuthPhase('revealing')
        return
      }
      setCardAuthPhase('authenticating')
      cardTimersRef.current.push(
        window.setTimeout(() => setCardAuthPhase('detected'), AUTH_SCAN_MS),
      )
    },
    [clearCardTimers],
  )

  const clearLogoutOverlay = useCallback(() => {
    setLogoutPhase('idle')
  }, [])

  const handleLogoutAnimationComplete = useCallback(() => {
    logout()
    resetIdentityCard()
    setShowDashboardIntro(false)
    setView('welcome')
    navigateToPath(PATH_HOME, { replace: true })
    setLogoutPhase('fading')
  }, [logout, resetIdentityCard])

  useEffect(() => {
    if (logoutPhase !== 'fading') return undefined
    const timerId = window.setTimeout(() => clearLogoutOverlay(), LOGOUT_FADE_MS)
    return () => window.clearTimeout(timerId)
  }, [logoutPhase, clearLogoutOverlay])

  const handleLogoutClick = useCallback(() => {
    if (logoutPhase !== 'idle' || !isAuthenticated) return
    clearCardTimers()
    setShowDashboardIntro(false)
    setLogoutPhase('animating')
  }, [logoutPhase, isAuthenticated, clearCardTimers])

  const handleViewIdClick = useCallback(() => {
    if (showDashboardIntro || logoutPhase !== 'idle') return
    if (user) {
      setIdentityDraft({
        name: user.name?.trim() || '',
        email: user.email?.trim() || '',
      })
    }
    startDashboardCardAnimation({ skipAuthSteps: true })
  }, [showDashboardIntro, user, startDashboardCardAnimation])

  const handleAuthPanelAuthenticate = useCallback(() => {
    if (!identityDraft.name.trim() || !isValidEmail(identityDraft.email)) return
    skipCardResetRef.current = true
    enterWorkspace({
      name: identityDraft.name,
      email: identityDraft.email,
      astraId: 'ASTRA-ID-7X92A',
    })
    setShowIdentityProgress(false)
    setIdentityPercent(0)
    setView('dashboard')
    navigateToPath(PATH_DASHBOARD, { replace: false })
    startDashboardCardAnimation()
  }, [identityDraft, enterWorkspace, startDashboardCardAnimation])

  const showAuthCardDraft = isAuthView && cardAuthPhase !== 'idle'

  const identityCardProps = {
    theme,
    holderName: showAuthCardDraft ? identityDraft.name : isAuthView ? '' : identityDraft.name,
    email: showAuthCardDraft ? identityDraft.email : isAuthView ? '' : identityDraft.email,
    hideSecrets: cardAuthPhase !== 'revealed' && cardAuthPhase !== 'revealing',
    authPhase: cardAuthPhase,
    goldFlash: cardAuthPhase === 'revealed',
    onDetectComplete: handleIdentityDetected,
    onRevealComplete: handleCardRevealComplete,
    status: 'active',
  }

  function handleTooltipAuthenticate() {
    resetIdentityCard()
    navigateView('welcome')
    setShowIdentityProgress(false)
    setIdentityPercent(0)
  }

  function renderMain() {
    if (isAuthenticated) {
      return (
        <Home
          theme={theme}
          showIntroCard={showDashboardIntro}
          cardAuthPhase={cardAuthPhase}
          holderName={identityDraft.name}
          email={identityDraft.email}
          onDetectComplete={handleIdentityDetected}
          onRevealComplete={handleCardRevealComplete}
          onDismissIntroCard={dismissDashboardIntro}
        />
      )
    }
    if (isAuthView) {
      return (
        <IdentityAuthView
          identityCard={identityCardProps}
          name={identityDraft.name}
          email={identityDraft.email}
          onDraftChange={handleDraftChange}
          onAuthenticate={handleAuthPanelAuthenticate}
        />
      )
    }
    if (isCreateView) {
      return (
        <CreateIdentity
          theme={theme}
          entered={createEntered}
          onDraftChange={handleDraftChange}
          onIdentityProgress={handleIdentityProgress}
          onAccessWorkspace={(profile) => {
            enterWorkspace(profile)
            setShowIdentityProgress(false)
            setIdentityPercent(0)
            resetIdentityCard()
            setView('dashboard')
            navigateToPath(PATH_DASHBOARD, { replace: false })
          }}
        />
      )
    }
    return (
      <Login
        onSecureAccess={() => navigateView('identity-auth')}
        onSecureBlurChange={setLoginSecureBlur}
      />
    )
  }

  return (
    <>
    <AppShell
      theme={theme}
      onThemeChange={setTheme}
      loginView={isLoginView}
      loginSecureBlur={loginSecureBlur}
      showLastAccess={!isAuthenticated && !isCreateView && !isAuthView}
      showAuthTooltip={!isAuthenticated && !isAuthView}
      tooltipMode={isCreateView ? 'authenticate' : 'welcome'}
      onCreateIdentity={() => navigateView('create-identity')}
      onAuthenticate={handleTooltipAuthenticate}
      showIdentityProgress={!isAuthenticated && isCreateView && showIdentityProgress}
      identityPercent={identityPercent}
      dashboardCardOverlay={
        isAuthenticated && showDashboardIntro && logoutPhase === 'idle'
      }
      showDashboardIdIcon={
        isAuthenticated && !showDashboardIntro && logoutPhase === 'idle'
      }
      onViewIdClick={handleViewIdClick}
      onLogoutClick={handleLogoutClick}
    >
      {renderMain()}
    </AppShell>
      {logoutPhase !== 'idle' ? (
        <div
          className={`app-logout-overlay${logoutPhase === 'fading' ? ' app-logout-overlay--fading' : ''}`}
          aria-hidden={logoutPhase === 'fading'}
        >
          <LogoutSessionTerminal onComplete={handleLogoutAnimationComplete} />
        </div>
      ) : null}
    </>
  )
}

export default App
