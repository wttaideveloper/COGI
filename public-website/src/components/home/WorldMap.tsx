import { useEffect, useId, useMemo, useRef, useState, type PointerEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Location } from '@/types'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useSiteConfig } from '@/contexts/SiteConfigContext'
import { resolveMapPalette } from '@/lib/mapColors'

type Pin = { loc: Location; x: number; y: number }
type Side = 'left' | 'right' | 'top' | 'bottom'

function project(lat: number, lng: number) {
  return {
    x: ((lng + 180) / 360) * 100,
    y: ((90 - lat) / 180) * 100,
  }
}

function nearestArcs(pins: Pin[]) {
  const seen = new Set<string>()
  const arcs: Array<[Pin, Pin]> = []
  for (const a of pins) {
    const nearest = pins
      .filter((b) => b.loc.id !== a.loc.id)
      .map((b) => ({ b, d: (a.x - b.x) ** 2 + (a.y - b.y) ** 2 }))
      .sort((left, right) => left.d - right.d)
      .slice(0, 2)
    for (const { b } of nearest) {
      const key = [a.loc.id, b.loc.id].sort().join(':')
      if (seen.has(key)) continue
      seen.add(key)
      arcs.push([a, b])
    }
  }
  const india = pins.find((p) => /india/i.test(p.loc.country))
  const usa = pins.find((p) => /united states|usa/i.test(p.loc.country))
  if (india && usa) {
    const key = [india.loc.id, usa.loc.id].sort().join(':')
    if (!seen.has(key)) arcs.push([usa, india])
  }
  return arcs
}

function arcPath(a: Pin, b: Pin) {
  const dx = b.x - a.x
  const dy = b.y - a.y
  const dist = Math.hypot(dx, dy) || 1
  const bulge = Math.min(16, Math.max(5, dist * 0.24))
  const cx = (a.x + b.x) / 2 - (dy / dist) * bulge
  const cy = (a.y + b.y) / 2 + (dx / dist) * bulge
  return `M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`
}

function arcLength(a: Pin, b: Pin) {
  return Math.hypot(b.x - a.x, b.y - a.y)
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
  return 380 + (index < 0 ? REVEAL_ORDER.length : index) * 110
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
  const tiltRef = useRef<HTMLDivElement>(null)

  const pins = useMemo(
    () =>
      locations
        .filter((loc) => loc.lat != null && loc.lng != null)
        .map((loc) => ({ loc, ...project(loc.lat as number, loc.lng as number) })),
    [locations],
  )
  const arcs = useMemo(() => nearestArcs(pins), [pins])
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
    WebkitMaskSize: 'contain',
    maskSize: 'contain',
    WebkitMaskRepeat: 'no-repeat',
    maskRepeat: 'no-repeat',
    WebkitMaskPosition: 'center',
    maskPosition: 'center',
  } as const

  const focused = Boolean(selectedPin) && !reduced
  const focusOrigin = selectedPin
    ? `${Math.min(86, Math.max(14, selectedPin.x))}% ${Math.min(80, Math.max(18, selectedPin.y))}%`
    : '50% 42%'
  const focusScale = focused ? (compact ? 1.2 : 1.32) : 1

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (reduced || compact || event.pointerType !== 'mouse' || !tiltRef.current) return
    const box = event.currentTarget.getBoundingClientRect()
    const x = ((event.clientX - box.left) / box.width - 0.5) * 8
    const y = ((event.clientY - box.top) / box.height - 0.5) * 6
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
        className="relative aspect-[2.05/1] w-full overflow-hidden"
        style={{
          background: `radial-gradient(ellipse at 48% 36%, ${palette.oceanTop} 0%, ${palette.ocean} 58%)`,
        }}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 50% 18%, ${palette.pin}14 0%, transparent 42%)`,
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
          className="map-stage-focus absolute inset-2.5 sm:inset-3 md:inset-4"
          style={{
            transformOrigin: focusOrigin,
            transform: `scale(${focusScale})`,
          }}
        >
          <div
            ref={tiltRef}
            className="absolute inset-0"
            style={{ transition: reduced || compact ? undefined : 'transform 180ms ease-out' }}
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
                  transition: 'left 800ms cubic-bezier(0.22, 1, 0.36, 1), top 800ms cubic-bezier(0.22, 1, 0.36, 1)',
                }}
                aria-hidden="true"
              />
            ) : null}

            <svg
              className={`pointer-events-none absolute inset-0 h-full w-full ${reduced ? '' : 'map-arc-fade'}`}
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <defs>
                <filter id={`map-arc-glow-${uid}`} x="-25%" y="-25%" width="150%" height="150%">
                  <feGaussianBlur stdDeviation="0.45" />
                </filter>
              </defs>
              {arcs.map(([a, b], arcIndex) => {
                const related = Boolean(
                  focusCountry && (a.loc.country === focusCountry || b.loc.country === focusCountry),
                )
                const dimmed = Boolean(focusCountry) && !related
                const local = arcLength(a, b) < 12
                const d = arcPath(a, b)
                const restOpacity = local ? 0.28 : 0.58
                return (
                  <g
                    key={`${a.loc.id}-${b.loc.id}`}
                    style={{
                      opacity: dimmed ? 0.16 : related ? 1 : restOpacity,
                      transition: 'opacity 350ms ease',
                    }}
                  >
                    <path
                      d={d}
                      pathLength={1}
                      fill="none"
                      stroke={related ? palette.active : palette.pin}
                      strokeWidth={related ? 1.15 : local ? 0.7 : 0.9}
                      strokeLinecap="round"
                      className={reduced ? undefined : 'map-arc-draw'}
                      style={{ animationDelay: `${arcIndex * 90}ms` }}
                      filter={`url(#map-arc-glow-${uid})`}
                    />
                    <path
                      d={d}
                      fill="none"
                      stroke={related ? palette.active : palette.pin}
                      strokeWidth={related ? 0.5 : 0.32}
                      strokeDasharray={local ? '1.1 2.2' : '1.5 2.1'}
                      strokeLinecap="round"
                      opacity={related ? 0.95 : 0.55}
                      className={reduced ? undefined : 'map-arc-dash'}
                      style={{ animationDelay: `${arcIndex * 220}ms` }}
                    />
                    {!reduced && (!local || related) ? (
                      <path
                        d={d}
                        fill="none"
                        stroke={related ? palette.pinLight : palette.pin}
                        strokeWidth={related ? 0.72 : 0.45}
                        strokeDasharray="4 96"
                        strokeLinecap="round"
                        opacity={related ? 0.9 : 0.28}
                        className="map-arc-comet"
                        style={{ animationDelay: `${arcIndex * 0.7}s` }}
                      />
                    ) : null}
                  </g>
                )
              })}
            </svg>

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
                    opacity: dimmed ? 0.34 : 1,
                    transition: 'opacity 320ms ease',
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
                    style={reduced ? undefined : { animationDelay: `${revealDelay(loc.country)}ms` }}
                  >
                    <span
                      className="absolute left-1/2 top-[15px] h-3 w-5 -translate-x-1/2 rounded-full blur-[5px] transition-opacity duration-300"
                      style={{ background: pinFill, opacity: isSelected ? 0.72 : lit ? 0.5 : 0.22 }}
                    />
                    {!reduced ? (
                      <span
                        className={`absolute left-1/2 top-[10px] h-6 w-6 -translate-x-1/2 rounded-full ${isSelected ? 'map-pin-ripple-on' : 'map-pin-ripple'}`}
                        style={{
                          border: `1px solid ${pinFill}`,
                          animationDelay: `${Math.max(0, order) * 0.38}s`,
                          opacity: isSelected ? 1 : 0.55,
                        }}
                        aria-hidden="true"
                      />
                    ) : null}
                    {isSelected && !reduced ? (
                      <span
                        className="absolute left-1/2 top-[9px] h-7 w-7 -translate-x-1/2 rounded-full map-pin-halo"
                        style={{ boxShadow: `0 0 0 1px ${palette.active}99` }}
                        aria-hidden="true"
                      />
                    ) : null}
                    <svg
                      viewBox="0 0 24 34"
                      className={`relative h-8 w-[22px] origin-bottom transition-transform duration-300 ease-out ${
                        isSelected ? 'scale-110' : isHovered ? 'scale-[1.07]' : ''
                      }`}
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
                      className={`pointer-events-none absolute z-20 whitespace-nowrap rounded-full px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] backdrop-blur-md transition-opacity duration-300 ${labelClass(side)} ${
                        showLabel ? 'inline-flex opacity-100' : 'hidden'
                      } ${showLabel && !lit ? 'max-md:hidden' : ''}`}
                      style={
                        lit
                          ? {
                              background: pinFill,
                              color: '#fff',
                            }
                          : {
                              background: palette.light ? 'rgba(255,255,255,0.86)' : 'rgba(12,16,22,0.7)',
                              color: palette.light ? '#1F2937' : 'rgba(255,255,255,0.9)',
                              border: `1px solid ${palette.border}`,
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

        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(ellipse at 50% 46%, transparent 52%, ${palette.ocean} 100%)`,
            opacity: palette.light ? 0.22 : 0.36,
          }}
          aria-hidden="true"
        />
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
              exit={reduced ? undefined : { opacity: 0, y: 8, scale: 0.99 }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            >
              <NationPanel selected={selected} palette={palette} onClear={() => onSelect(null)} />
            </motion.div>
          ) : (
            <motion.p
              key="hint"
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduced ? undefined : { opacity: 0 }}
              transition={{ duration: 0.24 }}
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
