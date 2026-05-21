import './BlinkingDots.css'

export function BlinkingDots({ className = '' }) {
  const rootClass = ['blinking-dots', className].filter(Boolean).join(' ')
  return (
    <span className={rootClass} aria-hidden="true">
      <span className="blinking-dots__dot">.</span>
      <span className="blinking-dots__dot">.</span>
      <span className="blinking-dots__dot">.</span>
    </span>
  )
}
