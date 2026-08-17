import { useQuery } from '@tanstack/react-query'
import { getGlobalSettings } from '@/api/globalSettings'
import { SEO } from '@/components/ui/SEO'
import { PageHero } from '@/components/ui/Card'
import { ButtonLink } from '@/components/ui/Button'
import { useSiteConfig } from '@/contexts/SiteConfigContext'

export function AboutPage() {
  const { data: settings } = useQuery({ queryKey: ['globalSettings'], queryFn: getGlobalSettings })
  const { copy } = useSiteConfig()
  const page = copy.about

  return (
    <>
      <SEO title={page.heroTitle} description={settings?.vision} path="/about" />
      <PageHero title={page.heroTitle} subtitle={page.heroSubtitle} imageUrl={page.imageUrl} />
      <div className="mx-auto max-w-4xl px-4 py-16">
        <section className="mb-16">
          <h2 className="font-display text-3xl text-teal-deep">{page.visionTitle}</h2>
          <p className="mt-4 text-lg leading-relaxed text-ink">{settings?.vision}</p>
        </section>
        <section className="mb-16">
          <h2 className="font-display text-3xl text-teal-deep">{page.missionTitle}</h2>
          <p className="mt-4 text-lg leading-relaxed text-ink">{settings?.mission}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {settings?.scriptureRefs.map((ref) => (
              <span key={ref} className="rounded-full bg-mist-dark px-4 py-1 text-sm font-medium text-teal-deep">{ref}</span>
            ))}
          </div>
        </section>
        <div className="grid gap-4 sm:grid-cols-2">
          <ButtonLink to="/about/our-story" variant="outline">Our Story</ButtonLink>
          <ButtonLink to="/about/beliefs" variant="outline">Our Beliefs</ButtonLink>
          <ButtonLink to="/about/board" variant="outline">Board Members</ButtonLink>
          <ButtonLink to="/about/partners" variant="outline">Our Partners</ButtonLink>
        </div>
      </div>
    </>
  )
}
