import { useEffect, useRef, useState } from 'react'
import './TypewriterText.css'

export function TypewriterText({
  text,
  speed = 42,
  startDelay = 0,
  className = '',
  onComplete,
  showCursor = true,
}) {
  const [displayed, setDisplayed] = useState('')
  const [active, setActive] = useState(false)
  const onCompleteRef = useRef(onComplete)
  onCompleteRef.current = onComplete

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      setDisplayed(text)
      setActive(false)
      onCompleteRef.current?.()
      return undefined
    }

    let index = 0
    let intervalId
    let startTimeoutId

    setDisplayed('')
    setActive(true)

    const tick = () => {
      index += 1
      setDisplayed(text.slice(0, index))
      if (index >= text.length) {
        window.clearInterval(intervalId)
        setActive(false)
        onCompleteRef.current?.()
      }
    }

    startTimeoutId = window.setTimeout(() => {
      tick()
      if (text.length > 1) {
        intervalId = window.setInterval(tick, speed)
      }
    }, startDelay)

    return () => {
      window.clearTimeout(startTimeoutId)
      window.clearInterval(intervalId)
    }
  }, [text, speed, startDelay])

  const classes = [
    'typewriter',
    active ? 'typewriter--active' : 'typewriter--idle',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <span className={classes}>
      {displayed}
      {showCursor && active ? (
        <span className="typewriter__cursor" aria-hidden="true" />
      ) : null}
    </span>
  )
}
