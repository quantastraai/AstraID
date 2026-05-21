const FLY_MS = 1100

export function flyCardToIdIcon(cardElement, { targetId = 'dashboard-id-icon', onComplete } = {}) {
  if (typeof window === 'undefined') {
    onComplete?.()
    return () => {}
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const target = document.getElementById(targetId)

  if (!cardElement || !target || prefersReducedMotion) {
    if (cardElement) cardElement.style.visibility = 'hidden'
    target?.classList.add('dashboard-id-icon--arrived')
    window.setTimeout(() => {
      target?.classList.remove('dashboard-id-icon--arrived')
      onComplete?.()
    }, prefersReducedMotion ? 120 : 0)
    return () => {}
  }

  const from = cardElement.getBoundingClientRect()
  const to = target.getBoundingClientRect()

  const clone = cardElement.cloneNode(true)
  clone.classList.add('identity-card-fly-clone')
  clone.setAttribute('aria-hidden', 'true')

  const originX = from.left + from.width / 2
  const originY = from.top + from.height / 2
  const targetX = to.left + to.width / 2
  const targetY = to.top + to.height / 2
  const translateX = targetX - originX
  const translateY = targetY - originY
  const scale = Math.min((to.width * 0.9) / from.width, (to.height * 0.9) / from.height, 0.22)

  Object.assign(clone.style, {
    position: 'fixed',
    left: `${from.left}px`,
    top: `${from.top}px`,
    width: `${from.width}px`,
    height: `${from.height}px`,
    margin: '0',
    zIndex: '1200',
    pointerEvents: 'none',
    transformOrigin: 'center center',
    transition: 'none',
    opacity: '1',
  })

  document.body.appendChild(clone)
  cardElement.style.visibility = 'hidden'

  const finish = () => {
    clone.remove()
    target.classList.add('dashboard-id-icon--arrived')
    window.setTimeout(() => target.classList.remove('dashboard-id-icon--arrived'), 900)
    onComplete?.()
  }

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      clone.style.transition = `transform ${FLY_MS}ms cubic-bezier(0.4, 0, 0.15, 1), opacity ${FLY_MS}ms ease`
      clone.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`
      clone.style.opacity = '0'
    })
  })

  const timerId = window.setTimeout(finish, FLY_MS + 40)

  return () => {
    window.clearTimeout(timerId)
    clone.remove()
  }
}
