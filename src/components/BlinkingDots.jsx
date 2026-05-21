import './BlinkingDots.css'

export function BlinkingDots() {
  return (
    <span className="blinking-dots" aria-hidden="true">
      <span className="blinking-dots__dot">.</span>
      <span className="blinking-dots__dot">.</span>
      <span className="blinking-dots__dot">.</span>
    </span>
  )
}
