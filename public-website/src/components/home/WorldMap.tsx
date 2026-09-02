import { useMemo, useState } from 'react'
import type { Location } from '@/types'
import { useReducedMotion } from '@/hooks/useReducedMotion'

type Pin = { loc: Location; x: number; y: number }
type Side = 'left' | 'right' | 'top' | 'bottom'

const PIN = '#5BA8E0'
const PIN_DEEP = '#2E7CB5'
const LAND = '#3A4A5C'
const LAND_LIGHT = '#5A6E84'
const OCEAN_TOP = '#141A22'
const OCEAN_BOTTOM = '#0B1016'

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

const LABEL_SIDE: Record<string, Side> = {
  'United States': 'left',
  Uganda: 'left',
  Kenya: 'right',
  Rwanda: 'left',
  Tanzania: 'bottom',
  India: 'top',
  Philippines: 'left',
  Singapore: 'left',
  Australia: 'left',
  'New Zealand': 'left',
}

function labelClass(side: Side) {
  if (side === 'left') return 'right-[26px] top-[10px]'
  if (side === 'top') return 'bottom-[38px] left-1/2 -translate-x-1/2'
  if (side === 'bottom') return 'top-[38px] left-1/2 -translate-x-1/2'
  return 'left-[26px] top-[10px]'
}

type Props = {
  locations: Location[]
  activeCountry: string | null
  onSelect: (country: string | null) => void
}

export function WorldMap({ locations, activeCountry, onSelect }: Props) {
  const reduced = useReducedMotion()
  const [hovered, setHovered] = useState<string | null>(null)

  const pins = useMemo(
    () =>
      locations
        .filter((loc) => loc.lat != null && loc.lng != null)
        .map((loc) => ({ loc, ...project(loc.lat as number, loc.lng as number) })),
    [locations],
  )
  const arcs = useMemo(() => nearestArcs(pins), [pins])
  const selected = locations.find((loc) => loc.country === activeCountry)

  return (
    <div className="overflow-hidden rounded-3xl border border-[#1c2530] bg-[#0B1016] shadow-[0_24px_60px_rgba(11,16,22,0.28)]">
      <div
        className="relative aspect-[2.05/1] w-full overflow-hidden"
        style={{ background: `radial-gradient(ellipse at 50% 42%, #1a2430 0%, ${OCEAN_TOP} 48%, ${OCEAN_BOTTOM} 100%)` }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(91,168,224,0.22) 1px, transparent 1px), linear-gradient(to bottom, rgba(91,168,224,0.22) 1px, transparent 1px)',
            backgroundSize: '8.33% 16.66%',
          }}
          aria-hidden="true"
        />

        <div
          className="absolute inset-0"
          style={{
            backgroundColor: LAND,
            WebkitMaskImage: 'url(/images/world-equirectangular.svg)',
            maskImage: 'url(/images/world-equirectangular.svg)',
            WebkitMaskSize: 'contain',
            maskSize: 'contain',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            WebkitMaskPosition: 'center',
            maskPosition: 'center',
          }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `linear-gradient(180deg, ${LAND_LIGHT} 0%, transparent 55%)`,
            WebkitMaskImage: 'url(/images/world-equirectangular.svg)',
            maskImage: 'url(/images/world-equirectangular.svg)',
            WebkitMaskSize: 'contain',
            maskSize: 'contain',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            WebkitMaskPosition: 'center',
            maskPosition: 'center',
            opacity: 0.55,
          }}
          aria-hidden="true"
        />

        <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <filter id="map-arc-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="0.55" />
            </filter>
          </defs>
          {arcs.map(([a, b]) => (
            <g key={`${a.loc.id}-${b.loc.id}`}>
              <path d={arcPath(a, b)} fill="none" stroke={PIN} strokeWidth="1.1" opacity="0.16" filter="url(#map-arc-glow)" />
              <path
                d={arcPath(a, b)}
                fill="none"
                stroke={PIN}
                strokeWidth="0.42"
                strokeDasharray="1.4 1.6"
                strokeLinecap="round"
                opacity="0.7"
                className={reduced ? undefined : 'map-arc-dash'}
              />
            </g>
          ))}
        </svg>

        {pins.map(({ loc, x, y }) => {
          const isSelected = activeCountry === loc.country
          const isHovered = hovered === loc.country
          const lit = isSelected || isHovered
          const side = LABEL_SIDE[loc.country] || (x > 72 ? 'left' : 'right')
          return (
            <button
              key={loc.id}
              type="button"
              className="group absolute z-10 -translate-x-1/2 -translate-y-full"
              style={{ left: `${x}%`, top: `${y}%` }}
              aria-pressed={isSelected}
              aria-label={loc.country}
              onClick={() => onSelect(isSelected ? null : loc.country)}
              onMouseEnter={() => setHovered(loc.country)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(loc.country)}
              onBlur={() => setHovered(null)}
            >
              <span className="relative block h-11 w-8">
                <span
                  className={`absolute left-1/2 top-[22px] h-5 w-9 -translate-x-1/2 rounded-full blur-[7px] ${reduced ? '' : 'map-pin-glow'}`}
                  style={{ background: PIN, opacity: lit ? 0.7 : 0.42 }}
                />
                {isSelected && !reduced ? (
                  <span className="absolute left-1/2 top-[14px] -translate-x-1/2">
                    <span className="block h-6 w-6 rounded-full border border-[#5BA8E0]/70" style={{ animation: 'map-ring 1.8s ease-out infinite' }} />
                  </span>
                ) : null}
                <svg viewBox="0 0 24 34" className={`relative h-11 w-8 transition-transform duration-200 ${lit ? 'scale-110' : 'group-hover:scale-105'}`} aria-hidden="true">
                  <defs>
                    <linearGradient id={`pin-fill-${loc.id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8EC8F0" />
                      <stop offset="100%" stopColor={PIN_DEEP} />
                    </linearGradient>
                  </defs>
                  <path
                    d="M12 1.4c-5.5 0-9.8 4.4-9.8 9.7 0 7.3 9.8 21.6 9.8 21.6s9.8-14.3 9.8-21.6C21.8 5.8 17.5 1.4 12 1.4z"
                    fill={`url(#pin-fill-${loc.id})`}
                    stroke="#fff"
                    strokeWidth="1.6"
                  />
                  <circle cx="12" cy="11" r="3.6" fill="#fff" />
                </svg>
              </span>
              <span
                className={`pointer-events-none absolute z-20 inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] shadow-sm ${labelClass(side)} ${
                  lit ? 'opacity-100' : 'hidden md:inline-flex'
                }`}
                style={
                  lit
                    ? { background: PIN, color: '#fff', boxShadow: '0 8px 20px rgba(91,168,224,0.35)' }
                    : { background: 'rgba(12,16,22,0.88)', color: '#fff', border: '1px solid rgba(255,255,255,0.14)' }
                }
              >
                {loc.country}
              </span>
            </button>
          )
        })}
      </div>

      <aside className="border-t border-white/10 bg-[#10161e] px-5 py-6 md:px-8" aria-live="polite">
        {selected ? (
          <div className="mx-auto grid max-w-4xl gap-3 md:grid-cols-[auto_1fr] md:items-center md:gap-6">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#5BA8E0]/15 md:mx-0">
              <svg viewBox="0 0 24 34" className="h-7 w-5" aria-hidden="true">
                <path d="M12 1.4c-5.5 0-9.8 4.4-9.8 9.7 0 7.3 9.8 21.6 9.8 21.6s9.8-14.3 9.8-21.6C21.8 5.8 17.5 1.4 12 1.4z" fill={PIN} />
                <circle cx="12" cy="11" r="3.4" fill="#fff" />
              </svg>
            </span>
            <div className="text-center md:text-left">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#5BA8E0]">{selected.region}</p>
              <h3 className="mt-1 font-display text-2xl font-bold text-white">{selected.country}</h3>
              <p className="mt-1 text-sm leading-relaxed text-white/70">{selected.summary}</p>
              {selected.programs.length ? (
                <div className="mt-3 flex flex-wrap justify-center gap-2 md:justify-start">
                  {selected.programs.map((program) => (
                    <span key={program} className="rounded-full bg-[#5BA8E0]/15 px-3 py-1 text-xs font-semibold text-[#8EC8F0]">
                      {program}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        ) : (
          <p className="text-center text-sm text-white/60">Select a pin to see COGI’s work in that nation.</p>
        )}
      </aside>
    </div>
  )
}
