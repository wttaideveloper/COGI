import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getLocations } from '@/api/locations'
import { WhereWeServeSection } from '@/components/home/WhereWeServeSection'
import { AboutHero } from '@/components/layout/AboutHero'
import { SEO } from '@/components/ui/SEO'
import { useSiteConfig } from '@/contexts/SiteConfigContext'
import { defaultSiteCopy } from '@/data/siteCopy'

function scripturePills(value: string) {
  return value.split(/[·,;]+/).map((item) => item.trim()).filter(Boolean)
}

export function AboutPage() {
  const { copy } = useSiteConfig()
  const { data: locations = [] } = useQuery({ queryKey: ['locations'], queryFn: getLocations })
  const [activeCountry, setActiveCountry] = useState<string | null>(null)
  const defaults = defaultSiteCopy.about
  const page = copy.about
  const heroTitle = page.heroTitle?.trim() || defaults.heroTitle
  const heroSubtitle = page.heroSubtitle?.trim() || defaults.heroSubtitle
  const visionTitle = page.visionTitle?.trim() || defaults.visionTitle
  const visionBody = page.visionBody?.trim() || defaults.visionBody
  const missionTitle = page.missionTitle?.trim() || defaults.missionTitle
  const missionBody = page.missionBody?.trim() || defaults.missionBody
  const refs = scripturePills(page.scripture?.trim() || defaults.scripture)

  return (
    <>
      <SEO title={heroTitle} description={visionBody} path="/about" />
      <AboutHero title={heroTitle} subtitle={heroSubtitle} imageUrl={page.imageUrl || defaults.imageUrl} />
      <div className="about-body about-purpose mx-auto max-w-4xl px-4 py-16">
        <section className="mb-16">
          <h2 className="font-display text-3xl text-teal-deep">{visionTitle}</h2>
          <p className="mt-4 text-lg leading-relaxed text-ink">{visionBody}</p>
        </section>
        <section className="mb-16">
          <h2 className="font-display text-3xl text-teal-deep">{missionTitle}</h2>
          <p className="mt-4 text-lg leading-relaxed text-ink">{missionBody}</p>
          {refs.length ? (
            <div className="mt-6 flex flex-wrap gap-3">
              {refs.map((ref) => (
                <span key={ref} className="rounded-full bg-mist-dark px-4 py-1 text-sm font-medium text-teal-deep">{ref}</span>
              ))}
            </div>
          ) : null}
        </section>

      </div>
      <WhereWeServeSection locations={locations} activeCountry={activeCountry} onSelect={setActiveCountry} title={copy.homepage.mapTitle} subtitle={copy.homepage.mapSubtitle} />
    </>
  )
}
