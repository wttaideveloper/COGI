import { Link } from 'react-router-dom'
import { SEO } from '@/components/ui/SEO'
import { PageHero, Card } from '@/components/ui/Card'
import { useSiteConfig } from '@/contexts/SiteConfigContext'

export function ResourcesPage() {
  const { copy } = useSiteConfig()
  const page = copy.resources

  return (
    <>
      <SEO title={page.heroTitle} description={page.heroSubtitle} path="/resources" />
      <PageHero title={page.heroTitle} subtitle={page.heroSubtitle} imageUrl={page.cards[0]?.imageUrl} />
      <div className="mx-auto max-w-5xl px-4 py-16 grid gap-6 md:grid-cols-3">
        {page.cards.map((r) => (
          <Link key={r.href || r.title} to={r.href || '/'}>
            <Card className="h-full overflow-hidden p-0 transition-shadow hover:border-gold/50 hover:shadow-md">
              {r.imageUrl ? <img src={r.imageUrl} alt="" className="h-40 w-full object-cover" /> : null}
              <div className="p-6">
                <h2 className="font-display text-xl text-teal-deep">{r.title}</h2>
                <p className="mt-3 text-ink-muted">{r.body}</p>
                <span className="mt-4 inline-block text-sm font-semibold text-teal-mid">Explore →</span>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </>
  )
}
