export const PATH_CREATE_IDENTITY = '/create_identity'
export const PATH_IDENTITY_AUTH = '/identity-auth'
export const PATH_DASHBOARD = '/dashboard'
export const PATH_HOME = '/'

export function viewFromPath(pathname) {
  if (pathname === PATH_DASHBOARD) return 'dashboard'
  if (pathname === PATH_CREATE_IDENTITY) return 'create-identity'
  if (pathname === PATH_IDENTITY_AUTH) return 'identity-auth'
  return 'welcome'
}

/** Guest routes: /dashboard is auth-only — map to welcome at /. */
export function guestViewFromPath(pathname) {
  const view = viewFromPath(pathname)
  return view === 'dashboard' ? 'welcome' : view
}

export function pathFromView(view) {
  if (view === 'dashboard') return PATH_DASHBOARD
  if (view === 'create-identity') return PATH_CREATE_IDENTITY
  if (view === 'identity-auth') return PATH_IDENTITY_AUTH
  return PATH_HOME
}

export function navigateToPath(path, { replace = false } = {}) {
  const current = `${window.location.pathname}${window.location.search}${window.location.hash}`
  const next = path
  if (current === next) return

  if (replace) {
    window.history.replaceState(null, '', next)
  } else {
    window.history.pushState(null, '', next)
  }
  window.dispatchEvent(new PopStateEvent('popstate'))
}
