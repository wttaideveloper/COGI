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
    <section id="map" className="scroll-mt-28 bg-white py-9 md:py-12">
      <div className="mx-auto max-w-3xl px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-teal-deep md:text-5xl">
            {title}
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-pretty text-base leading-relaxed text-ink-muted md:text-lg">
            {subtitle}
          </p>
        </div>

        <div ref={keepRef}>
        <div className="mt-5">
          <WorldMap locations={locations} activeCountry={activeCountry} onSelect={onSelect} />
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {locationGroups.map((group) => (
            <div key={group.region}>
              <div className="mb-3.5 flex items-center gap-3">
                <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-accent-ink">{group.region}</h3>
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
