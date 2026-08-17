import { useMemo, useState } from 'react'
import type { Location } from '@/types'

function project(lat: number, lng: number) {
  return {
    x: ((lng + 180) / 360) * 100,
    y: ((90 - lat) / 180) * 100,
  }
}

type Props = {
  locations: Location[]
  activeCountry: string | null
  onSelect: (country: string | null) => void
}

export function WorldMap({ locations, activeCountry, onSelect }: Props) {
  const [hovered, setHovered] = useState<string | null>(null)
  const pins = useMemo(
    () =>
      locations
        .filter((loc) => loc.lat != null && loc.lng != null)
        .map((loc) => ({ loc, ...project(loc.lat as number, loc.lng as number) })),
    [locations],
  )
  const active = locations.find((loc) => loc.country === activeCountry)
  const tooltip = locations.find((loc) => loc.country === (hovered || activeCountry))
  const tooltipPin = pins.find((pin) => pin.loc.country === tooltip?.country)

  return (
    <div className="overflow-hidden border border-mist-dark bg-[#d7e4dc]">
      <div className="relative aspect-[2/1] w-full">
        <img
          src="/images/world-equirectangular.svg"
          alt="World map of current COGI engagement"
          className="absolute inset-0 h-full w-full object-contain object-center [filter:sepia(12%)_hue-rotate(95deg)_saturate(65%)_brightness(1.4)]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-[#d7e4dc]/20" />

        {pins.map(({ loc, x, y }) => {
          const selected = activeCountry === loc.country
          const isHovered = hovered === loc.country
          return (
            <button
              key={loc.id}
              type="button"
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${x}%`, top: `${y}%` }}
              aria-pressed={selected}
              aria-label={loc.country}
              onClick={() => onSelect(selected ? null : loc.country)}
              onMouseEnter={() => setHovered(loc.country)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(loc.country)}
              onBlur={() => setHovered(null)}
            >
              <span className="relative flex h-8 w-8 items-center justify-center">
                {selected ? (
                  <span className="absolute inset-0 animate-ping rounded-full bg-gold/50" />
                ) : null}
                <span
                  className={`relative block rounded-full border-2 border-white shadow-lg transition-transform ${
                    selected || isHovered ? 'h-4 w-4 scale-125 bg-gold' : 'h-3 w-3 bg-teal-deep hover:bg-gold'
                  }`}
                />
              </span>
            </button>
          )
        })}

        {tooltip && tooltipPin ? (
          <div
            className="pointer-events-none absolute z-20 w-56 -translate-x-1/2 rounded-sm bg-white px-3 py-2 text-left shadow-xl"
            style={{
              left: `${tooltipPin.x}%`,
              top: `${Math.min(tooltipPin.y + 4, 78)}%`,
            }}
            role="tooltip"
          >
            <p className="text-sm font-bold text-teal-deep">{tooltip.country}</p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gold">{tooltip.region}</p>
            <p className="mt-1 line-clamp-3 text-xs text-ink-muted">{tooltip.summary}</p>
          </div>
        ) : null}
      </div>

      <div className="grid gap-0 border-t border-mist-dark bg-white lg:grid-cols-[1fr_320px]">
        <div className="p-5">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">Click a nation</p>
          <p className="mt-1 text-sm text-ink-muted">Hover for a summary. Select a pin to see programs, communities, and partnerships.</p>
        </div>
        <aside className="border-t border-mist-dark bg-[#f6f3ee] p-5 lg:border-l lg:border-t-0" aria-live="polite">
          {active ? (
            <>
              <h3 className="font-display text-2xl text-teal-deep">{active.country}</h3>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-gold">{active.region}</p>
              <p className="mt-3 text-sm leading-relaxed text-ink-muted">{active.summary}</p>
              {active.programs.length ? (
                <div className="mt-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-teal-deep">Programs & initiatives</p>
                  <ul className="mt-2 space-y-1">
                    {active.programs.map((program) => (
                      <li key={program} className="text-sm text-ink">
                        {program}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </>
          ) : (
            <p className="text-sm text-ink-muted">Select a country on the map to explore COGI’s work on the ground.</p>
          )}
        </aside>
      </div>
    </div>
  )
}
