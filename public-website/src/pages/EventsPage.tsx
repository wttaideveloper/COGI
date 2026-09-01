import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getEvents } from '@/api/events'
import { SEO } from '@/components/ui/SEO'
import { PageHero, Card } from '@/components/ui/Card'
import { formatDate } from '@/lib/utils'
import { useSiteConfig } from '@/contexts/SiteConfigContext'

export function EventsPage() {
  const { data: events } = useQuery({ queryKey: ['events'], queryFn: getEvents })
  const { copy } = useSiteConfig()
  const page = copy.events

  return (
    <>
      <SEO title={page.heroTitle} description={page.heroSubtitle} path="/events" />
      <PageHero title={page.heroTitle} subtitle={page.heroSubtitle} imageUrl={page.imageUrl} />
      <div className="mx-auto max-w-4xl px-4 py-16 space-y-6">
        <Link to="/" className="inline-block text-sm font-semibold text-teal-deep hover:text-gold">← Back to home</Link>
        {events?.map((event) => (
          <Card key={event.id} as="article">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                {event.featured && <span className="rounded-full bg-gold/20 px-3 py-1 text-xs font-semibold text-gold">Featured</span>}
                <h2 className="mt-2 font-display text-2xl text-teal-deep">
                  <Link to={`/events/${event.slug}`} className="hover:text-gold">{event.title}</Link>
                </h2>
                <p className="mt-1 text-sm text-ink-muted">
                  {formatDate(event.startDate)}
                  {event.endDate && ` – ${formatDate(event.endDate)}`}
                  {event.location && ` · ${event.location}`}
                </p>
              </div>
              <span className="rounded-full bg-teal-deep/10 px-3 py-1 text-xs font-semibold text-teal-deep">{event.category}</span>
            </div>
            <p className="mt-3 text-ink-muted">{event.summary}</p>
            <Link to={`/events/${event.slug}`} className="mt-4 inline-block text-sm font-semibold text-teal-mid hover:text-gold">View details →</Link>
          </Card>
        ))}
      </div>
    </>
  )
}
