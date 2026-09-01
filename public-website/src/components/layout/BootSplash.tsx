import { useEffect, useRef } from 'react'
import { useSiteConfig, useSiteReady } from '@/contexts/SiteConfigContext'
import { useReducedMotion } from '@/hooks/useReducedMotion'

const SPLASH_ID = 'boot-splash'
const MIN_MS = 1600
const MIN_REDUCED_MS = 250
const MAX_MS = 5000

function splashEl() {
  return document.getElementById(SPLASH_ID)
}

function hideSplash(reduced: boolean) {
  const el = splashEl()
  if (!el || el.classList.contains('is-leaving')) return
  document.documentElement.classList.remove('boot-splash-lock')
  if (reduced) {
    el.remove()
    return
  }
  el.classList.add('is-leaving')
  window.setTimeout(() => el.remove(), 700)
}

export function BootSplash() {
  const ready = useSiteReady()
  const { header, footer, theme } = useSiteConfig()
  const reduced = useReducedMotion()
  const openedAt = useRef(Date.now())

  useEffect(() => {
    const el = splashEl()
    if (!el) return

    const bgEl = el.querySelector<HTMLImageElement>('[data-splash-bg]')
    const logoEl = el.querySelector<HTMLImageElement>('[data-splash-logo]')
    const wordmark = el.querySelector<HTMLElement>('[data-splash-wordmark]')
    const scrim = el.querySelector<HTMLElement>('.boot-splash-scrim')
    if (bgEl) bgEl.hidden = true

    const logoUrl = header.logoUrl || footer.logoUrl
    if (logoEl) {
      if (logoUrl) {
        logoEl.onerror = () => {
          logoEl.hidden = true
          if (wordmark) wordmark.hidden = false
        }
        logoEl.onload = () => {
          logoEl.hidden = false
          if (wordmark) wordmark.hidden = true
        }
        logoEl.alt = header.logoAlt || 'Companions of Grace International'
        logoEl.hidden = false
        if (wordmark) wordmark.hidden = true
        if (logoEl.getAttribute('src') !== logoUrl) logoEl.src = logoUrl
      } else {
        logoEl.hidden = true
        if (wordmark) wordmark.hidden = false
      }
    }

    if (header.backgroundColor || theme.backgroundColor || theme.accentColor) {
      const headerColor = header.backgroundColor || theme.backgroundColor || '#ffffff'
      el.style.background = headerColor
      el.style.color = header.textColor || theme.textColor || '#1f2937'
      if (scrim) scrim.style.background = headerColor
      el.style.setProperty('--splash-accent', theme.accentColor || '#5b8fb5')
    }
  }, [header.logoUrl, header.logoAlt, header.backgroundColor, footer.logoUrl, theme.accentColor])

  useEffect(() => {
    let hideTimer: number | undefined
    let cancelled = false

    const scheduleHide = () => {
      const minMs = reduced ? MIN_REDUCED_MS : MIN_MS
      const wait = Math.max(0, minMs - (Date.now() - openedAt.current))
      hideTimer = window.setTimeout(() => {
        if (!cancelled) hideSplash(reduced)
      }, wait)
    }

    if (ready) scheduleHide()
    const maxTimer = window.setTimeout(() => {
      if (!cancelled) hideSplash(reduced)
    }, MAX_MS)

    return () => {
      cancelled = true
      if (hideTimer) window.clearTimeout(hideTimer)
      window.clearTimeout(maxTimer)
    }
  }, [ready, reduced])

  return null
}
