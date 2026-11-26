import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getEvents } from '@/api/events'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { siteImages } from '@/data/siteCopy'
import { formatDate } from '@/lib/utils'

export function UpcomingEvents() {
  const { data: events = [], isLoading, isError } = useQuery({ queryKey: ['events'], queryFn: getEvents })
  const upcoming = events.filter(event => {
    const end = event.endDate || event.startDate
    return Date.parse(/^\d{4}-\d{2}-\d{2}$/.test(end) ? end + 'T23:59:59' : end) >= Date.now()
  }).sort((a, b) => Number(b.featured) - Number(a.featured) || Date.parse(a.startDate) - Date.parse(b.startDate)).slice(0, 6)
  const track = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (reduced || paused || upcoming.length < 2) return
    const timer = window.setInterval(() => {
      const node = track.current
      if (!node) return
      const last = node.scrollLeft + node.clientWidth >= node.scrollWidth - 10
      node.scrollTo({ left: last ? 0 : node.scrollLeft + node.clientWidth, behavior: 'smooth' })
    }, 6000)
    return () => window.clearInterval(timer)
  }, [paused, reduced, upcoming.length])

  if (isLoading || isError) return null
  if (!upcoming.length) return (
    <section id="upcoming-events" className="mx-auto max-w-7xl scroll-mt-28 px-4 py-16" aria-label="Upcoming events">
      <h2 className="font-display text-3xl text-teal-deep">Upcoming events</h2>
      <p className="mt-4 text-lg text-ink-muted">New event dates will be announced here. Check back for opportunities to learn, connect, and serve.</p>
      <Link to="/events" className="mt-5 inline-block font-semibold text-teal-deep underline">View event calendar</Link>
    </section>
  )
  return (
    <section id="upcoming-events" className="scroll-mt-28 mx-auto max-w-7xl px-4 py-16" aria-label="Upcoming events">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h2 className="font-display text-3xl text-teal-deep">Upcoming events</h2>
        <Link to="/events" className="text-sm font-semibold underline">View calendar</Link>
      </div>
      <div
        ref={track}
        className="region-track"
        onPointerEnter={() => setPaused(true)}
        onPointerLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false) }}
      >
        {upcoming.map(event => (
          <section key={event.id} className="overflow-hidden rounded-xl border border-mist-dark bg-white">
            <Link to={`/events/${event.slug}`} aria-label={`View ${event.title}`} className="relative block overflow-hidden">
              <img src={event.imageUrl || siteImages.historicGathering} alt="" loading="lazy" onError={e => { if (e.currentTarget.getAttribute('src') !== siteImages.historicGathering) e.currentTarget.src = siteImages.historicGathering }} className="aspect-video w-full object-cover" />
              <span className="absolute bottom-4 left-4 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-teal-deep">{formatDate(event.startDate)}</span>
            </Link>
            <div className="p-6">
            <p className="text-sm text-ink-muted">{formatDate(event.startDate)} · {event.location || event.venue}</p>
            <h3 className="mt-4 font-display text-2xl text-teal-deep">
              <Link to={`/events/${event.slug}`} className="hover:underline">{event.title}</Link>
            </h3>
            <p className="mt-3 text-ink-muted">{event.summary}</p>
            <Link to={`/events/${event.slug}`} className="mt-5 inline-block font-semibold text-teal-deep">Event details →</Link>
            </div>
          </section>
        ))}
      </div>
      {upcoming.length > 1 && (
        <div className="mt-4 flex gap-3">
          <button type="button" className="rounded-full border px-4 py-2" onClick={() => { setPaused(true); track.current?.scrollBy({ left: -350, behavior: reduced ? 'auto' : 'smooth' }) }}>Previous</button>
          <button type="button" className="rounded-full border px-4 py-2" onClick={() => { setPaused(true); track.current?.scrollBy({ left: 350, behavior: reduced ? 'auto' : 'smooth' }) }}>Next</button>
          {!reduced && <button type="button" className="rounded-full border px-4 py-2" onClick={() => setPaused(value => !value)}>{paused ? 'Resume' : 'Pause'}</button>}
        </div>
      )}
    </section>
  )
}
