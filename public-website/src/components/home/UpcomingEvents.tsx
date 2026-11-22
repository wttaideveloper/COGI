import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getEvents } from '@/api/events'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { formatDate } from '@/lib/utils'

export function UpcomingEvents() {
  const { data: events = [] } = useQuery({ queryKey: ['events'], queryFn: getEvents })
  const upcoming = events.filter(event => Date.parse(event.endDate || event.startDate) >= Date.now())
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

  if (!upcoming.length) return null
  return (
    <section className="mx-auto max-w-7xl px-4 py-16" aria-label="Upcoming events">
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
          <section key={event.id} className="rounded-xl border border-mist-dark bg-mist p-8">
            <p className="text-sm text-ink-muted">{formatDate(event.startDate)} · {event.location}</p>
            <h3 className="mt-4 font-display text-2xl text-teal-deep">
              <Link to={`/events/${event.slug}`} className="hover:underline">{event.title}</Link>
            </h3>
            <p className="mt-3 text-ink-muted">{event.summary}</p>
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
