import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const AUTH_STORAGE_KEY = 'astraid-session'

const DEMO_USER = {
  email: 'admin@astra.id',
  password: 'admin123',
}

const AuthContext = createContext(null)

function readSession() {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    if (data?.email) return data
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY)
  }
  return null
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readSession)

  const login = useCallback(async (email, password) => {
    const normalizedEmail = email.trim().toLowerCase()

    if (!normalizedEmail || !password) {
      throw new Error('Email and password are required.')
    }

    if (
      normalizedEmail !== DEMO_USER.email ||
      password !== DEMO_USER.password
    ) {
      throw new Error('Invalid email or password.')
    }

    const session = { email: normalizedEmail, name: 'Admin' }
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session))
    setUser(session)
    return session
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    setUser(null)
  }, [])

  const enterWorkspace = useCallback((profile) => {
    const session = {
      email: profile.email?.trim() || DEMO_USER.email,
      name: profile.name?.trim() || 'Identity Holder',
      astraId: profile.astraId || 'ASTRA-ID-7X92A',
    }
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session))
    setUser(session)
    return session
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      logout,
      enterWorkspace,
    }),
    [user, login, logout, enterWorkspace],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components -- hook paired with provider
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
