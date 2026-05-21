import { useEffect, useRef, useState } from 'react'
import { TypewriterText } from './TypewriterText'
import './LoginScanPanel.css'

const TERMINAL_SCRIPT = [
  { type: 'cmd', text: 'astra scan --identity-verify' },
  { type: 'out', text: '→ channel: biometric [open]' },
  { type: 'cmd', text: 'verify --zero-trust --handshake' },
  { type: 'out', text: '→ tunnel: established ✓' },
  { type: 'cmd', text: 'vault --probe --cipher=aes256' },
  { type: 'out', text: '→ vault integrity: sealed' },
  { type: 'cmd', text: 'access-gate --status' },
  { type: 'out', text: '→ awaiting secure authorization...' },
]

const LINE_GAP_MS = 380
const LOOP_RESET_MS = 2400
const TYPE_SPEED = 22
const MAX_VISIBLE_LINES = 4

const HOLOGRAPHIC_FACE_SRC = '/holographic-face.png'

function HolographicFace() {
  return (
    <div className="login-scan-visual__face-stage">
      <div className="login-scan-visual__face-bg" aria-hidden />
      <div className="login-scan-visual__face-vignette" aria-hidden />
      <div className="login-scan-visual__face-img-wrap">
        <img
          className="login-scan-visual__face-img"
          src={HOLOGRAPHIC_FACE_SRC}
          alt=""
          width={512}
          height={512}
          decoding="async"
        />
      </div>
      <div className="login-scan-visual__face-glow" aria-hidden />
      <div className="login-scan-visual__face-shimmer" aria-hidden />
      <div className="login-scan-visual__face-scan" aria-hidden />
    </div>
  )
}

function IdentityScanVisual({ topDown = false }) {
  return (
    <div
      className={`login-scan-visual${topDown ? ' login-scan-visual--topdown' : ''}`}
      aria-hidden
    >
      <div className="login-scan-visual__frame">
        <div className="login-scan-visual__holo" />
        <div className="login-scan-visual__grid" />
        <div className="login-scan-visual__scan-line" />
        <span className="login-scan-visual__corner login-scan-visual__corner--tl" />
        <span className="login-scan-visual__corner login-scan-visual__corner--tr" />
        <span className="login-scan-visual__corner login-scan-visual__corner--bl" />
        <span className="login-scan-visual__corner login-scan-visual__corner--br" />

        <HolographicFace />
      </div>
      <p className="login-scan-visual__label">
        <span className="login-scan-visual__label-dot" />
        Identity Scan
      </p>
    </div>
  )
}

function LoginScanTerminal({ active }) {
  const [scriptIndex, setScriptIndex] = useState(0)
  const [lines, setLines] = useState([])
  const [typing, setTyping] = useState(false)
  const [cycleKey, setCycleKey] = useState(0)
  const scriptIndexRef = useRef(0)

  useEffect(() => {
    scriptIndexRef.current = scriptIndex
  }, [scriptIndex])

  useEffect(() => {
    if (!active) {
      setScriptIndex(0)
      setLines([])
      setTyping(false)
      return undefined
    }

    setScriptIndex(0)
    setLines([])
    setTyping(true)
    return undefined
  }, [active])

  useEffect(() => {
    if (!active || scriptIndex < TERMINAL_SCRIPT.length) return undefined

    const resetId = window.setTimeout(() => {
      setLines([])
      setScriptIndex(0)
      setTyping(true)
      setCycleKey((k) => k + 1)
    }, LOOP_RESET_MS)

    return () => window.clearTimeout(resetId)
  }, [active, scriptIndex])

  function handleLineComplete() {
    const idx = scriptIndexRef.current
    const entry = TERMINAL_SCRIPT[idx]
    if (!entry) return

    setLines((prev) => [...prev, entry].slice(-MAX_VISIBLE_LINES))
    setTyping(false)

    window.setTimeout(() => {
      const next = idx + 1
      setScriptIndex(next)
      setTyping(next < TERMINAL_SCRIPT.length)
    }, LINE_GAP_MS)
  }

  const currentEntry = TERMINAL_SCRIPT[scriptIndex]
  const showCurrent = active && typing && scriptIndex < TERMINAL_SCRIPT.length && currentEntry

  return (
    <div className="login-scan-terminal">
      <div className="login-scan-terminal__head">
        <span className="login-scan-terminal__dot" />
        <span className="login-scan-terminal__dot" />
        <span className="login-scan-terminal__dot" />
        <span className="login-scan-terminal__head-label">astra-shell</span>
      </div>
      <div className="login-scan-terminal__body">
        {lines.map((line, i) => (
          <p
            key={`${line.text}-${i}`}
            className={`login-scan-terminal__line login-scan-terminal__line--${line.type}`}
          >
            {line.type === 'cmd' ? (
              <>
                <span className="login-scan-terminal__prompt">astra@secure:~$</span>{' '}
                {line.text}
              </>
            ) : (
              line.text
            )}
          </p>
        ))}
        {showCurrent ? (
          <p
            className={`login-scan-terminal__line login-scan-terminal__line--${currentEntry.type} login-scan-terminal__line--active`}
          >
            {currentEntry.type === 'cmd' ? (
              <>
                <span className="login-scan-terminal__prompt">astra@secure:~$</span>{' '}
                <TypewriterText
                  key={`cmd-${cycleKey}-${scriptIndex}-${lines.length}`}
                  text={currentEntry.text}
                  speed={TYPE_SPEED}
                  startDelay={0}
                  className="login-scan-terminal__type"
                  onComplete={handleLineComplete}
                  showCursor
                />
              </>
            ) : (
              <TypewriterText
                key={`out-${cycleKey}-${scriptIndex}-${lines.length}`}
                text={currentEntry.text}
                speed={TYPE_SPEED}
                startDelay={0}
                className="login-scan-terminal__type"
                onComplete={handleLineComplete}
                showCursor
              />
            )}
          </p>
        ) : null}
      </div>
    </div>
  )
}

export function LoginScanPanel({
  active = false,
  expanding = false,
  topDownScan = false,
  layout = 'default',
}) {
  const panelClass = [
    'login-scan-panel',
    expanding ? ' login-scan-panel--expand' : '',
    layout === 'auth' ? ' login-scan-panel--auth' : '',
  ]
    .filter(Boolean)
    .join('')

  return (
    <aside className={panelClass} aria-label="Identity scan" aria-hidden={!active}>
      <IdentityScanVisual topDown={topDownScan} />
      <LoginScanTerminal active={active} />
    </aside>
  )
}
