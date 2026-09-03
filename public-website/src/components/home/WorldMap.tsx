import { useEffect, useId, useMemo, useRef, useState, type PointerEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Location } from '@/types'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useSiteConfig } from '@/contexts/SiteConfigContext'
import { resolveMapPalette } from '@/lib/mapColors'

type Side = 'left' | 'right' | 'top' | 'bottom'

/** Crop the equirectangular frame above Antarctica (~60.5°S in the source SVG). */
const VIEW_LAT_SOUTH = -58
const VIEW_LAT_SPAN = 90 - VIEW_LAT_SOUTH
const VIEW_HEIGHT_FRACTION = VIEW_LAT_SPAN / 180
const VIEW_ASPECT = 2 / VIEW_HEIGHT_FRACTION
const VIEW_MASK_SIZE = `100% ${100 / VIEW_HEIGHT_FRACTION}%`

function project(lat: number, lng: number) {
  return {
    x: ((lng + 180) / 360) * 100,
    y: ((90 - lat) / VIEW_LAT_SPAN) * 100,
  }
}

function clampNumber(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

/**
 * Camera for selected-country focus: scale, then pan, then clamp.
 * Scaling around a clamped origin pushes eastern/western pins outside overflow:hidden.
 * Translate is in % of the stage (transform-origin 0 0).
 */
function focusCamera(xPct: number, yPct: number, scale: number, compact: boolean) {
  const padX = compact ? 12 : 9
  const padY = compact ? 16 : 12
  const coverMin = 100 * (1 - scale)
  const coverMax = 0

  let tx = clampNumber(50 - xPct * scale, coverMin, coverMax)
  let ty = clampNumber(42 - yPct * scale, coverMin, coverMax)

  const pinX = xPct * scale + tx
  const pinY = yPct * scale + ty
  if (pinX > 100 - padX) tx -= pinX - (100 - padX)
  if (pinX < padX) tx += padX - pinX
  if (pinY > 100 - padY) ty -= pinY - (100 - padY)
  if (pinY < padY) ty += padY - pinY

  return { tx, ty }
}

const LABEL_SIDE: Record<string, Side> = {
  'United States': 'left',
  Uganda: 'top',
  Kenya: 'right',
  Rwanda: 'left',
  Tanzania: 'bottom',
  India: 'top',
  Philippines: 'top',
  Singapore: 'left',
  Australia: 'left',
  'New Zealand': 'left',
}

const ANCHOR_LABELS = new Set(['United States', 'Kenya', 'India', 'Philippines', 'Australia'])

const REVEAL_ORDER = [
  'United States',
  'Uganda',
  'Kenya',
  'Rwanda',
  'Tanzania',
  'India',
  'Singapore',
  'Philippines',
  'Australia',
  'New Zealand',
]

function revealDelay(country: string) {
  const index = REVEAL_ORDER.indexOf(country)
  const i = index < 0 ? REVEAL_ORDER.length : index
  return 460 + i * 108 + (i % 2) * 24 + (i % 3) * 10
}

function revealDuration(country: string) {
  const i = Math.max(0, REVEAL_ORDER.indexOf(country))
  return `${0.64 + (i % 3) * 0.05}s`
}

function labelNudge(side: Side, hovered: boolean, selected: boolean) {
  const shift = hovered && !selected ? 2 : 0
  if (side === 'left') return { marginRight: shift }
  if (side === 'top') return { marginBottom: shift }
  if (side === 'bottom') return { marginTop: shift }
  return { marginLeft: shift }
}

function labelClass(side: Side) {
  if (side === 'left') return 'right-[calc(100%+8px)] top-1/2 -translate-y-1/2'
  if (side === 'top') return 'bottom-[calc(100%+10px)] left-1/2 -translate-x-1/2'
  if (side === 'bottom') return 'top-[calc(100%+10px)] left-1/2 -translate-x-1/2'
  return 'left-[calc(100%+8px)] top-1/2 -translate-y-1/2'
}

function useMedia(query: string) {
  const [matches, setMatches] = useState(false)
  useEffect(() => {
    const media = window.matchMedia(query)
    const update = () => setMatches(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [query])
  return matches
}

type Props = {
  locations: Location[]
  activeCountry: string | null
  onSelect: (country: string | null) => void
}

function NationPanel({
  selected,
  palette,
  onClear,
}: {
  selected: Location
  palette: ReturnType<typeof resolveMapPalette>
  onClear: () => void
}) {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-3 md:flex-row md:items-start md:gap-8">
      <div className="min-w-0 flex-1 text-center md:text-left">
        <p className="text-[10px] font-bold uppercase tracking-[0.28em]" style={{ color: palette.pinLight }}>
          {selected.region}
        </p>
        <h3 className="mt-1 font-display text-[1.85rem] font-semibold italic leading-tight md:text-3xl" style={{ color: palette.ink }}>
          {selected.country}
        </h3>
        <p className="mt-2 text-sm leading-relaxed md:text-[0.95rem]" style={{ color: palette.muted }}>
          {selected.summary}
        </p>
      </div>
      <div className="flex flex-col items-center gap-3 md:min-w-[13rem] md:items-end md:pt-5">
        {selected.programs.length ? (
          <div className="flex flex-wrap justify-center gap-1.5 md:justify-end">
            {selected.programs.map((program) => (
              <span
                key={program}
                className="rounded-full px-2.5 py-1 text-[11px] font-semibold"
                style={{
                  background: `${palette.pin}1f`,
                  color: palette.light ? palette.pinDeep : palette.pinLight,
                  boxShadow: `inset 0 0 0 1px ${palette.pin}2e`,
                }}
              >
                {program}
              </span>
            ))}
          </div>
        ) : null}
        <button
          type="button"
          onClick={onClear}
          className="min-h-11 rounded-full px-3 text-[11px] font-semibold uppercase tracking-[0.16em] md:min-h-0 md:py-1"
          style={{ color: palette.muted }}
          aria-label={`Clear ${selected.country} selection`}
        >
          Close
        </button>
      </div>
    </div>
  )
}

export function WorldMap({ locations, activeCountry, onSelect }: Props) {
  const reduced = useReducedMotion()
  const uid = useId().replace(/:/g, '')
  const { homepage } = useSiteConfig()
  const palette = useMemo(() => resolveMapPalette(homepage), [homepage])
  const [hovered, setHovered] = useState<string | null>(null)
  const compact = useMedia('(max-width: 767px)')
  const coarsePointer = useMedia('(hover: none)')
  const tiltRef = useRef<HTMLDivElement>(null)
  const lightMotion = compact || coarsePointer

  const pins = useMemo(
    () =>
      locations
        .filter((loc) => loc.lat != null && loc.lng != null)
        .map((loc) => ({ loc, ...project(loc.lat as number, loc.lng as number) })),
    [locations],
  )
  const selected = locations.find((loc) => loc.country === activeCountry)
  const selectedPin = pins.find((p) => p.loc.country === activeCountry)
  const focusCountry = hovered || activeCountry

  useEffect(() => {
    if (!activeCountry) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onSelect(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [activeCountry, onSelect])

  const mask = {
    WebkitMaskImage: 'url(/images/world-equirectangular.svg)',
    maskImage: 'url(/images/world-equirectangular.svg)',
    WebkitMaskSize: VIEW_MASK_SIZE,
    maskSize: VIEW_MASK_SIZE,
    WebkitMaskRepeat: 'no-repeat',
    maskRepeat: 'no-repeat',
    WebkitMaskPosition: 'center top',
    maskPosition: 'center top',
  } as const

  const focused = Boolean(selectedPin) && !reduced
  const focusScale = focused ? (compact ? 1.2 : 1.32) : 1
  const camera = focused && selectedPin ? focusCamera(selectedPin.x, selectedPin.y, focusScale, compact) : { tx: 0, ty: 0 }
  const canBreathe = !reduced && !lightMotion && !activeCountry && !hovered

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (reduced || lightMotion || event.pointerType !== 'mouse' || !tiltRef.current) return
    const box = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - box.left) / box.width - 0.5) * 6
    const y = ((event.clientY - box.top) / box.height - 0.5) * 4
    tiltRef.current.style.transform = `translate(${x}px, ${y}px)`
  }

  function onPointerLeave() {
    if (tiltRef.current) tiltRef.current.style.transform = 'translate(0px, 0px)'
  }

  return (
    <motion.div
      className="overflow-hidden rounded-xl border border-mist-dark md:rounded-2xl"
      style={{ background: palette.ocean }}
      initial={reduced ? false : { opacity: 0, scale: 0.97 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.28 }}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className="relative w-full overflow-hidden"
        style={{
          aspectRatio: `${VIEW_ASPECT}`,
          background: `radial-gradient(ellipse at 48% 36%, ${palette.oceanTop} 0%, ${palette.ocean} 58%)`,
        }}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 50% 18%, ${palette.pin}${lightMotion ? '0c' : '14'} 0%, transparent 42%)`,
          }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `linear-gradient(to right, ${palette.grid} 1px, transparent 1px), linear-gradient(to bottom, ${palette.grid} 1px, transparent 1px)`,
            backgroundSize: '8.33% 16.66%',
          }}
          aria-hidden="true"
        />

        <div
          className="map-stage-focus absolute inset-3 sm:inset-3.5 md:inset-5"
          style={{
            transform: `translate(${camera.tx}%, ${camera.ty}%) scale(${focusScale})`,
            transitionDelay: focused ? '90ms' : '0ms',
          }}
        >
          <div
            ref={tiltRef}
            className="absolute inset-0"
            style={{ transition: reduced || lightMotion ? undefined : 'transform 220ms ease-out' }}
          >
            <div
              className={!reduced && !lightMotion ? 'map-stage-breathe absolute inset-0' : 'absolute inset-0'}
              style={
                !reduced && !lightMotion
                  ? { animationPlayState: canBreathe ? 'running' : 'paused' }
                  : undefined
              }
            >
            <div className="absolute inset-0" style={{ backgroundColor: palette.land, ...mask }} aria-hidden="true" />
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background: `linear-gradient(180deg, ${palette.landLight} 0%, transparent 62%)`,
                opacity: 0.38,
                ...mask,
              }}
              aria-hidden="true"
            />

            {selectedPin ? (
              <div
                className="pointer-events-none absolute h-[30%] w-[24%] -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  left: `${selectedPin.x}%`,
                  top: `${selectedPin.y}%`,
                  background: `radial-gradient(circle, ${palette.active}4d 0%, transparent 72%)`,
                  transition: 'left 0.92s cubic-bezier(0.16, 1, 0.3, 1), top 0.92s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease',
                }}
                aria-hidden="true"
              />
            ) : null}

            {pins.map(({ loc, x, y }) => {
              const isSelected = activeCountry === loc.country
              const isHovered = hovered === loc.country
              const lit = isSelected || isHovered
              const dimmed = Boolean(focusCountry) && !lit
              const side = LABEL_SIDE[loc.country] || (x > 72 ? 'left' : 'right')
              const showLabel = lit || (ANCHOR_LABELS.has(loc.country) && !focusCountry)
              const pinFill = isSelected ? palette.active : palette.pin
              const order = REVEAL_ORDER.indexOf(loc.country)
              return (
                <button
                  key={loc.id}
                  type="button"
                  className="group absolute z-10 flex h-11 w-11 -translate-x-1/2 -translate-y-[80%] items-center justify-center"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    opacity: dimmed ? 0.42 : 1,
                    transition: 'opacity 400ms ease',
                    zIndex: lit ? 24 : ANCHOR_LABELS.has(loc.country) ? 12 : 10,
                  }}
                  aria-pressed={isSelected}
                  aria-label={`${loc.country}. ${loc.summary}`}
                  aria-describedby="map-nation-panel"
                  onClick={() => onSelect(isSelected ? null : loc.country)}
                  onMouseEnter={() => setHovered(loc.country)}
                  onMouseLeave={() => setHovered(null)}
                  onFocus={() => setHovered(loc.country)}
                  onBlur={() => setHovered(null)}
                >
                  <span
                    className={`relative block h-8 w-[22px] ${reduced ? '' : 'map-pin-enter'}`}
                    style={
                      reduced
                        ? undefined
                        : {
                            animationDelay: `${revealDelay(loc.country)}ms`,
                            animationDuration: revealDuration(loc.country),
                          }
                    }
                  >
                    <span
                      className="absolute left-1/2 top-[15px] h-3 w-5 -translate-x-1/2 rounded-full blur-[5px] transition-opacity duration-300"
                      style={{ background: pinFill, opacity: isSelected ? 0.72 : isHovered ? 0.46 : 0.22 }}
                    />
                    {!reduced && !isSelected && !lightMotion ? (
                      <span className="absolute left-1/2 top-[10px] h-6 w-6 -translate-x-1/2" aria-hidden="true">
                        <span
                          className="map-pin-ripple block h-full w-full rounded-full"
                          style={{
                            border: `1px solid ${pinFill}`,
                            animationDelay: `${Math.max(0, order) * 0.38}s`,
                            opacity: isHovered ? 0.42 : 0.55,
                          }}
                        />
                      </span>
                    ) : null}
                    {isSelected && !reduced ? (
                      <span
                        key={`focus-ring-${loc.country}`}
                        className="absolute left-1/2 top-[10px] h-6 w-6 -translate-x-1/2"
                        aria-hidden="true"
                      >
                        <span
                          className="map-focus-ring block h-full w-full rounded-full"
                          style={{
                            border: `1.5px solid ${palette.active}`,
                            boxShadow: `0 0 10px ${palette.active}55`,
                          }}
                        />
                      </span>
                    ) : null}
                    {isSelected && !reduced ? (
                      <span className="absolute left-1/2 top-[9px] h-7 w-7 -translate-x-1/2" aria-hidden="true">
                        <span
                          className="map-pin-halo block h-full w-full rounded-full"
                          style={{ boxShadow: `0 0 0 1px ${palette.active}99` }}
                        />
                      </span>
                    ) : null}
                    <svg
                      viewBox="0 0 24 34"
                      className="relative h-8 w-[22px] origin-bottom"
                      style={{
                        transform: isSelected ? 'scale(1.06)' : isHovered ? 'scale(1.05)' : 'scale(1)',
                        transition: 'transform 0.38s cubic-bezier(0.22, 1, 0.36, 1)',
                        transitionDelay: isSelected ? '160ms' : '0ms',
                      }}
                      aria-hidden="true"
                    >
                      <defs>
                        <linearGradient id={`pin-fill-${uid}-${loc.id}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={palette.pinLight} />
                          <stop offset="100%" stopColor={palette.pinDeep} />
                        </linearGradient>
                      </defs>
                      <path
                        d="M12 1.6c-5.15 0-9.3 4.15-9.3 9.2 0 6.9 9.3 21.2 9.3 21.2s9.3-14.3 9.3-21.2c0-5.05-4.15-9.2-9.3-9.2z"
                        fill={lit ? pinFill : `url(#pin-fill-${uid}-${loc.id})`}
                        stroke={palette.light ? '#fff' : 'rgba(255,255,255,0.88)'}
                        strokeWidth="1.35"
                      />
                      <circle cx="12" cy="10.8" r="2.9" fill="#fff" />
                    </svg>
                    <span
                      className={`pointer-events-none absolute z-20 whitespace-nowrap rounded-full px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] backdrop-blur-md ${labelClass(side)} ${
                        showLabel ? 'inline-flex' : 'hidden'
                      } ${showLabel && !lit ? 'max-md:hidden' : ''}`}
                      style={
                        isSelected
                          ? {
                              background: pinFill,
                              color: '#fff',
                              opacity: 1,
                              ...labelNudge(side, false, true),
                              transition: 'opacity 280ms ease, margin 280ms ease, filter 280ms ease, background-color 280ms ease',
                            }
                          : isHovered
                            ? {
                                background: pinFill,
                                color: '#fff',
                                opacity: 1,
                                filter: 'brightness(1.06)',
                                ...labelNudge(side, true, false),
                                transition: 'opacity 280ms ease, margin 280ms ease, filter 280ms ease, background-color 280ms ease',
                              }
                            : {
                                background: palette.light ? 'rgba(255,255,255,0.86)' : 'rgba(12,16,22,0.7)',
                                color: palette.light ? '#1F2937' : 'rgba(255,255,255,0.9)',
                                border: `1px solid ${palette.border}`,
                                opacity: showLabel ? 0.92 : 0,
                                ...labelNudge(side, false, false),
                                transition: 'opacity 280ms ease, margin 280ms ease, filter 280ms ease, background-color 280ms ease',
                              }
                      }
                    >
                      {loc.country}
                    </span>
                  </span>
                </button>
              )
            })}
            </div>
          </div>
        </div>

        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 50% 46%, transparent ${lightMotion ? '58%' : '50%'}, ${palette.ocean} 100%)`,
            opacity: lightMotion ? (palette.light ? 0.16 : 0.24) : palette.light ? 0.24 : 0.4,
          }}
          aria-hidden="true"
        />
        {!lightMotion ? (
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              boxShadow: `inset 0 0 90px 18px ${palette.ocean}`,
              opacity: palette.light ? 0.18 : 0.32,
            }}
            aria-hidden="true"
          />
        ) : null}
      </div>

      <aside
        id="map-nation-panel"
        className="px-5 py-4 md:px-8 md:py-5"
        style={{ background: palette.panel, borderTop: `1px solid ${palette.border}` }}
        aria-live="polite"
      >
        <AnimatePresence mode="wait">
          {selected ? (
            <motion.div
              key={selected.country}
              initial={reduced ? false : { opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduced ? undefined : { opacity: 0, y: 8, scale: 0.99, transition: { duration: 0.2, delay: 0 } }}
              transition={{
                duration: 0.4,
                delay: reduced ? 0 : 0.38,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <NationPanel selected={selected} palette={palette} onClear={() => onSelect(null)} />
            </motion.div>
          ) : (
            <motion.p
              key="hint"
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduced ? undefined : { opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="flex items-center justify-center gap-2.5 text-center text-sm"
              style={{ color: palette.muted }}
            >
              <span
                className="h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ background: palette.pin }}
                aria-hidden="true"
              />
              Select a location to explore COGI’s work in that nation.
            </motion.p>
          )}
        </AnimatePresence>
      </aside>
    </motion.div>
  )
}
