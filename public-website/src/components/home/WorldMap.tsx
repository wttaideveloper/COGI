import { useMemo, useState } from 'react'
import type { Location } from '@/types'
import { useSiteConfig } from '@/contexts/SiteConfigContext'

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
  const { homepage, theme } = useSiteConfig()
  const ocean = homepage.mapOceanColor || theme.backgroundColor || '#F7FAFC'
  const land = homepage.mapLandColor || theme.primaryColor || '#1B3A6B'
  const pin = homepage.mapPinColor || theme.accentColor || '#2B6CB0'
  const active = homepage.mapActiveColor || theme.buttonHoverColor || '#3B82F6'
  const [hovered, setHovered] = useState<string | null>(null)
  const pins = useMemo(
    () =>
      locations
        .filter((loc) => loc.lat != null && loc.lng != null)
        .map((loc) => ({ loc, ...project(loc.lat as number, loc.lng as number) })),
    [locations],
  )
  const selected = locations.find((loc) => loc.country === activeCountry)
  const tooltip = locations.find((loc) => loc.country === hovered && loc.country !== activeCountry)
  const tooltipPin = pins.find((item) => item.loc.country === tooltip?.country)

  return (
    <div className="overflow-hidden rounded-3xl border border-black/5 shadow-[0_24px_60px_rgba(18,54,44,0.12)]">
      <div className="relative aspect-[2/1] w-full overflow-hidden" style={{ background: ocean }}>
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: land,
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
          style={{ background: `radial-gradient(ellipse at 50% 40%, transparent 45%, color-mix(in srgb, ${ocean} 55%, black) 140%)` }}
        />

        {pins.map(({ loc, x, y }) => {
          const isSelected = activeCountry === loc.country
          const isHovered = hovered === loc.country
          return (
            <button
              key={loc.id}
              type="button"
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${x}%`, top: `${y}%` }}
              aria-pressed={isSelected}
              aria-label={loc.country}
              onClick={() => onSelect(isSelected ? null : loc.country)}
              onMouseEnter={() => setHovered(loc.country)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(loc.country)}
              onBlur={() => setHovered(null)}
            >
              <span className="relative flex h-9 w-9 items-center justify-center">
                {isSelected ? (
                  <span className="absolute inset-1 animate-ping rounded-full opacity-70" style={{ background: active }} />
                ) : null}
                <span
                  className="relative block rounded-full border-2 border-white shadow-lg transition-transform"
                  style={{
                    width: isSelected || isHovered ? 16 : 12,
                    height: isSelected || isHovered ? 16 : 12,
                    background: isSelected || isHovered ? active : pin,
                    transform: isSelected || isHovered ? 'scale(1.15)' : 'scale(1)',
                  }}
                />
              </span>
              {isSelected ? (
                <span
                  className="absolute left-1/2 top-8 z-20 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold text-white shadow-lg"
                  style={{ background: land }}
                >
                  {loc.country}
                </span>
              ) : null}
            </button>
          )
        })}

        {tooltip && tooltipPin ? (
          <div
            className="pointer-events-none absolute z-20 w-56 -translate-x-1/2 rounded-2xl bg-white/95 px-3 py-2 text-left shadow-xl backdrop-blur"
            style={{
              left: `${tooltipPin.x}%`,
              top: `${Math.min(tooltipPin.y + 4, 78)}%`,
            }}
            role="tooltip"
          >
            <p className="text-sm font-bold" style={{ color: land }}>{tooltip.country}</p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em]" style={{ color: active }}>{tooltip.region}</p>
            <p className="mt-1 line-clamp-3 text-xs text-ink">{tooltip.summary}</p>
          </div>
        ) : null}
      </div>

      <div className="grid gap-0 bg-white lg:grid-cols-[1fr_340px]">
        <div className="p-5 md:p-6">
          <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: active }}>Click a nation</p>
          <p className="mt-1 text-sm text-ink">The country name appears on the map. Details and programs show in the panel.</p>
        </div>
        <aside className="border-t border-black/5 p-5 md:p-6 lg:border-l lg:border-t-0" style={{ background: `color-mix(in srgb, ${ocean} 70%, white)` }} aria-live="polite">
          {selected ? (
            <>
              <h3 className="font-display text-2xl font-bold" style={{ color: land }}>{selected.country}</h3>
              <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em]" style={{ color: active }}>{selected.region}</p>
              <p className="mt-3 text-sm leading-relaxed text-ink">{selected.summary}</p>
              {selected.programs.length ? (
                <div className="mt-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em]" style={{ color: land }}>Programs & initiatives</p>
                  <ul className="mt-2 space-y-1">
                    {selected.programs.map((program) => (
                      <li key={program} className="text-sm font-medium text-ink">
                        {program}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </>
          ) : (
            <p className="text-sm font-medium text-ink">Select a country on the map to explore COGI’s work on the ground.</p>
          )}
        </aside>
      </div>
    </div>
  )
}
