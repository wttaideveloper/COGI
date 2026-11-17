import { AboutHero } from '@/components/layout/AboutHero'
import { useQuery } from '@tanstack/react-query'
import { getPartners } from '@/api/partners'
import { SEO } from '@/components/ui/SEO'
import { Card, Skeleton } from '@/components/ui/Card'
import { useSiteConfig } from '@/contexts/SiteConfigContext'

export function PartnersPage() {
  const { data: partners, isLoading } = useQuery({ queryKey: ['partners'], queryFn: getPartners })
  const { copy } = useSiteConfig()
  const page = copy.partners

  return (
    <>
      <SEO title={page.heroTitle} description={page.heroSubtitle} path="/about/partners" />
      <AboutHero title={page.heroTitle} subtitle={page.heroSubtitle} imageUrl={page.imageUrl} />
      <div className="about-body mx-auto max-w-7xl px-4 py-16">
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-40" />)}</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {partners?.map((partner) => (
              <Card key={partner.id} as="article">
                <div className="mb-4 flex h-16 items-center">
                  <span className="font-display text-2xl font-bold text-teal-deep">{partner.name}</span>
                </div>
                {partner.region && <p className="text-xs font-semibold uppercase tracking-wide text-accent-ink">{partner.region}</p>}
                <p className="mt-3 text-ink-muted">{partner.description}</p>
                {partner.url && (
                  <a href={partner.url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-sm font-semibold text-teal-mid hover:text-accent-ink">
                    Visit website →
                  </a>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
