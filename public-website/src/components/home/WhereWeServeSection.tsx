import { useEffect, useRef } from 'react'
import type { Location } from '@/types'
import { useSiteConfig } from '@/contexts/SiteConfigContext'
import { resolveMapPalette } from '@/lib/mapColors'
import { WorldMap } from '@/components/home/WorldMap'

type Props = {
  locations: Location[]
  activeCountry: string | null
  onSelect: (country: string | null) => void
  title: string
  subtitle: string
}

export function WhereWeServeSection({ locations, activeCountry, onSelect, title, subtitle }: Props) {
  const site = useSiteConfig()
  const palette = resolveMapPalette(site.homepage)
  const keepRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!activeCountry) return
    const onPointerDown = (event: PointerEvent) => {
      const node = event.target
      if (node instanceof Node && keepRef.current?.contains(node)) return
      onSelect(null)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [activeCountry, onSelect])

  const locationGroups = ['Americas & Africa', 'Asia-Pacific']
    .map((region) => ({
      region,
      items: locations.filter((loc) => loc.region === region),
    }))
    .filter((group) => group.items.length)

  return (
    <section id="map" className="scroll-mt-28 bg-white py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-3xl text-center">
          <div className="flex items-center justify-center gap-4">
            <span className="h-px w-8 bg-gold/40 sm:w-14" aria-hidden="true" />
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-gold">Where we serve</p>
            <span className="h-px w-8 bg-gold/40 sm:w-14" aria-hidden="true" />
          </div>
          <h2 className="mt-4 font-display text-3xl font-semibold italic tracking-tight text-teal-deep md:text-5xl">
            {title}
          </h2>
          <p className="mx-auto mt-5 max-w-3xl text-pretty text-base leading-relaxed text-ink-muted md:text-lg">
            {subtitle}
          </p>
        </div>

        <div ref={keepRef}>
        <div className="mt-10 md:mt-12">
          <WorldMap locations={locations} activeCountry={activeCountry} onSelect={onSelect} />
        </div>

        <div className="mt-8 grid gap-8 sm:grid-cols-2 md:mt-10">
          {locationGroups.map((group) => (
            <div key={group.region}>
              <div className="mb-3.5 flex items-center gap-3">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-gold">{group.region}</h3>
                <span className="h-px flex-1 bg-mist-dark" aria-hidden="true" />
              </div>
              <div className="flex flex-wrap gap-2">
                {group.items.map((loc) => {
                  const on = activeCountry === loc.country
                  return (
                    <button
                      key={loc.id}
                      type="button"
                      onClick={() => onSelect(on ? null : loc.country)}
                      className="map-nation-chip min-h-11 rounded-full border px-4 py-2 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2"
                      style={
                        on
                          ? {
                              borderColor: palette.active,
                              background: palette.active,
                              color: '#fff',
                              boxShadow: `0 0 0 1px ${palette.active}`,
                            }
                          : {
                              borderColor: '#e2eaf1',
                              background: '#fff',
                              color: 'var(--color-ink)',
                            }
                      }
                      aria-pressed={on}
                      aria-label={`Show ${loc.country} on the map`}
                    >
                      {loc.country}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
        </div>
      </div>
    </section>
  )
}
