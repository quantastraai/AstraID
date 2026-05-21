import { useMemo } from 'react'
import './PasswordStrengthBar.css'

function getStrength(password) {
  if (!password) {
    return { percent: 0, label: '', level: 0, color: 'transparent' }
  }

  let score = 0
  if (password.length >= 6) score += 1
  if (password.length >= 10) score += 1
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1
  if (/\d/.test(password)) score += 1
  if (/[^a-zA-Z0-9]/.test(password)) score += 1

  const levels = [
    { percent: 18, label: 'weak', color: '#f08080' },
    { percent: 38, label: 'fair', color: '#e0a060' },
    { percent: 58, label: 'good', color: '#c9a962' },
    { percent: 78, label: 'strong', color: '#5eb89a' },
    { percent: 100, label: 'excellent', color: '#4ade80' },
  ]

  const idx = score > 0 ? Math.min(score, levels.length) - 1 : 0
  const level = levels[idx]
  return { ...level, level: score }
}

export function PasswordStrengthBar({ password }) {
  const strength = useMemo(() => getStrength(password), [password])

  return (
    <div
      className={`password-strength${password ? ' password-strength--active' : ''}`}
      aria-hidden={!password}
    >
      <div className="password-strength__track">
        <div
          className="password-strength__fill"
          style={{
            width: `${strength.percent}%`,
            backgroundColor: strength.color,
          }}
        />
        <div
          className="password-strength__pulse"
          style={{ left: `${strength.percent}%`, color: strength.color }}
        />
      </div>
      {password ? (
        <span className="password-strength__label" style={{ color: strength.color }}>
          {strength.label}
        </span>
      ) : (
        <span className="password-strength__label-placeholder" aria-hidden>
          excellent
        </span>
      )}
    </div>
  )
}
