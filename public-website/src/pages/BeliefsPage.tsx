import { AboutHero } from '@/components/layout/AboutHero'
import { SEO } from '@/components/ui/SEO'
import { Card } from '@/components/ui/Card'
import { useSiteConfig } from '@/contexts/SiteConfigContext'

export function BeliefsPage() {
  const { copy } = useSiteConfig()
  const beliefs = copy.beliefs

  return (
    <>
      <SEO title={beliefs.heroTitle} description={beliefs.intro} path="/about/beliefs" />
      <AboutHero title={beliefs.heroTitle} subtitle={beliefs.heroSubtitle} imageUrl={beliefs.imageUrl} />
      <div className="about-body mx-auto max-w-6xl px-4 py-16">
        <p className="mb-12 text-lg text-ink-muted">{beliefs.intro}</p>
        <div className="grid gap-5 md:grid-cols-2">
          {beliefs.items.map((belief) => (
            <Card key={belief.id} as="article">
              <h2 className="font-display text-xl text-teal-deep">{belief.title}</h2>
              <p className="mt-3 leading-relaxed text-ink-muted">{belief.content}</p>
            </Card>
          ))}
        </div>
      </div>
    </>
  )
}
