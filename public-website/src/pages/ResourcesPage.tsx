import { MediaPreview } from '@/components/ui/MediaPreview'
import { Link } from 'react-router-dom'
import { SEO } from '@/components/ui/SEO'
import { PageHero, Card } from '@/components/ui/Card'
import { useSiteConfig } from '@/contexts/SiteConfigContext'

function resourceHref(title: string, href?: string) {
  const raw = (href || '').trim()
  let next = raw
  if (raw.startsWith('http://') || raw.startsWith('https://')) return raw
  if (raw.startsWith('/')) next = raw
  else if (raw) next = `/${raw.replace(/^\/+/, '')}`
  const normalized = next.replace(/\/+$/, '') || '/'
  if (!next || normalized === '/resources') {
    const key = title.toLowerCase()
    if (key.includes('stor')) return '/resources/stories'
    if (key.includes('testimonial')) return '/resources/testimonials'
    if (key.includes('blog') || key.includes('news')) return '/resources/blog'
    return '/resources/stories'
  }
  return next
}

export function ResourcesPage() {
  const { copy } = useSiteConfig()
  const page = copy.resources

  return (
    <>
      <SEO title={page.heroTitle} description={page.heroSubtitle} path="/resources" />
      <PageHero title={page.heroTitle} subtitle={page.heroSubtitle} imageUrl={page.imageUrl || page.cards[0]?.imageUrl} />
      <div className="mx-auto max-w-5xl px-4 py-16 grid gap-6 md:grid-cols-3 md:items-stretch">
        {page.cards.map((r) => (
          <div key={r.href || r.title} className="flex min-h-full">
            <Card className="flex h-full w-full min-h-[22rem] flex-col overflow-hidden !p-0 transition-shadow hover:border-gold/50 hover:shadow-md">
              {r.imageUrl ? <MediaPreview src={r.imageUrl} alt={r.title} className="h-40 w-full shrink-0 object-cover" /> : <div className="h-40 w-full shrink-0 bg-mist" />}
              <Link to={resourceHref(r.title, r.href)} className="flex flex-1 flex-col p-6">
                <h2 className="font-display text-xl text-teal-deep">{r.title}</h2>
                <p className="mt-3 flex-1 text-ink-muted">{r.body}</p>
                <span className="mt-auto pt-4 inline-block text-sm font-semibold text-teal-mid">Explore →</span>
              </Link>
            </Card>
          </div>
        ))}
      </div>
    </>
  )
}
