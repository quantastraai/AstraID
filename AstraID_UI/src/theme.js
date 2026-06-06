export const THEME_STORAGE_KEY = 'astraid-theme'

export function readStoredTheme() {
  if (typeof window === 'undefined') return 'dark'
  const stored = localStorage.getItem(THEME_STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}
