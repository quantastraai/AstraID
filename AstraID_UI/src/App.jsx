import { useLayoutEffect, useState } from 'react'
import { AppShell } from './components/AppShell'
import { CreateIdentity } from './components/CreateIdentity'
import { Home } from './components/Home'
import { Login } from './components/Login'
import { useAuth } from './context/AuthContext'
import { readStoredTheme, THEME_STORAGE_KEY } from './theme'

function App() {
  const { isAuthenticated, enterWorkspace } = useAuth()
  const [theme, setTheme] = useState(readStoredTheme)
  const [view, setView] = useState('welcome')

  useLayoutEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  useLayoutEffect(() => {
    if (!isAuthenticated) return
    setShowIdentityProgress(false)
    setIdentityPercent(0)
  }, [isAuthenticated])

  const isCreateView = view === 'create-identity'
  const [showIdentityProgress, setShowIdentityProgress] = useState(false)
  const [identityPercent, setIdentityPercent] = useState(0)

  function handleIdentityProgress(percent) {
    setShowIdentityProgress(true)
    setIdentityPercent(percent)
  }

  function renderMain() {
    if (isAuthenticated) return <Home />
    if (isCreateView) {
      return (
        <CreateIdentity
          theme={theme}
          onIdentityProgress={handleIdentityProgress}
          onAccessWorkspace={(profile) => {
            enterWorkspace(profile)
            setShowIdentityProgress(false)
            setIdentityPercent(0)
          }}
        />
      )
    }
    return <Login onSecureAccess={() => setView('create-identity')} />
  }

  return (
    <AppShell
      theme={theme}
      onThemeChange={setTheme}
      showLastAccess={!isAuthenticated && !isCreateView}
      showAuthTooltip={!isAuthenticated}
      tooltipMode={isCreateView ? 'authenticate' : 'welcome'}
      onCreateIdentity={() => setView('create-identity')}
      onAuthenticate={() => {
        setView('welcome')
        setShowIdentityProgress(false)
        setIdentityPercent(0)
      }}
      showIdentityProgress={!isAuthenticated && isCreateView && showIdentityProgress}
      identityPercent={identityPercent}
    >
      {renderMain()}
    </AppShell>
  )
}

export default App
