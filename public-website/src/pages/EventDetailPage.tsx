import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getEventBySlug } from '@/api/events'
import { SEO } from '@/components/ui/SEO'
import { PageHero, Card, ErrorState, Skeleton } from '@/components/ui/Card'
import { ButtonLink } from '@/components/ui/Button'
import { formatDate } from '@/lib/utils'

export function EventDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: event, isLoading, isError } = useQuery({
    queryKey: ['event', slug],
    queryFn: () => getEventBySlug(slug!),
    enabled: !!slug,
  })

  if (isLoading) return <div className="mx-auto max-w-3xl px-4 py-16"><Skeleton className="h-64" /></div>
  if (isError || !event) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <ErrorState message="Event not found." />
        <Link to="/events" className="mt-4 inline-block text-teal-deep">← Back to Events</Link>
      </div>
    )
  }

  return (
    <>
      <SEO title={event.title} description={event.summary} path={`/events/${event.slug}`} />
      <PageHero title={event.title} subtitle={event.category} />
      <div className="mx-auto max-w-3xl px-4 py-16">
        <Link to="/events" className="mb-8 inline-block text-sm font-semibold text-teal-deep hover:text-accent-ink">← Back to Events</Link>
        <Card>
          <dl className="grid gap-4 sm:grid-cols-2">
            <div><dt className="text-sm font-semibold text-ink-muted">Date</dt><dd>{formatDate(event.startDate)}{event.endDate && ` – ${formatDate(event.endDate)}`}</dd></div>
            {event.venue && <div><dt className="text-sm font-semibold text-ink-muted">Venue</dt><dd>{event.venue}</dd></div>}
            {event.location && <div><dt className="text-sm font-semibold text-ink-muted">Location</dt><dd>{event.location}</dd></div>}
          </dl>
          <p className="mt-6 leading-relaxed text-ink">{event.description}</p>
          <ButtonLink to={event.registrationUrl ?? '/get-involved'} className="mt-8">
            Register Interest
          </ButtonLink>
        </Card>
        <Link to="/events" className="mt-8 inline-block text-teal-deep hover:text-accent-ink">← Back to Events</Link>
      </div>
    </>
  )
}
