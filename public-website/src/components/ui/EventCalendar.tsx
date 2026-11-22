import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Event } from '@/types'

export function EventCalendar({ events }: { events: Event[] }) {
  const [month, setMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1))
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()
  const inMonth = events.filter(event => {
    const date = new Date(event.startDate)
    return date.getMonth() === month.getMonth() && date.getFullYear() === month.getFullYear()
  })
  const selected = inMonth.filter(event => new Date(event.startDate).getDate() === selectedDay)
  const move = (offset: number) => {
    setMonth(new Date(month.getFullYear(), month.getMonth() + offset, 1))
    setSelectedDay(null)
  }
  return (
    <section className="mb-12 rounded-xl border border-mist-dark p-4 sm:p-6" aria-label="Events calendar">
      <div className="mb-6 flex items-center justify-between gap-3">
        <button type="button" onClick={() => move(-1)} aria-label="Previous month" className="p-3">←</button>
        <h2 className="font-display text-xl text-teal-deep" aria-live="polite">{month.toLocaleDateString('en', { month: 'long', year: 'numeric' })}</h2>
        <button type="button" onClick={() => move(1)} aria-label="Next month" className="p-3">→</button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-sm">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <span key={day} className="py-2 font-semibold">{day}</span>)}
        {Array.from({ length: month.getDay() }, (_, index) => <span key={`empty-${index}`} />)}
        {Array.from({ length: days }, (_, index) => {
          const day = index + 1
          const daily = inMonth.filter(event => new Date(event.startDate).getDate() === day)
          return (
            <button type="button" key={day} disabled={!daily.length} aria-pressed={day === selectedDay}
              aria-label={`${day} ${month.toLocaleDateString('en', { month: 'long' })}, ${daily.length} events`}
              title={daily.map(event => event.title).join(', ')}
              onClick={() => setSelectedDay(day)}
              className={`min-h-11 rounded-md p-2 ${day === selectedDay ? 'bg-teal-deep text-white' : daily.length ? 'bg-mist font-bold text-teal-deep hover:bg-mist-dark' : 'text-ink-muted'}`}
            >{day}{daily.length > 0 && <span className="block text-xs">•</span>}</button>
          )
        })}
      </div>
      <div className="mt-6" aria-live="polite">
        {!inMonth.length && <p className="text-sm text-ink-muted">No events scheduled for this month.</p>}
        {selected.map(event => <p key={event.id} className="mt-2"><Link to={`/events/${event.slug}`} className="font-semibold text-teal-deep underline">{event.title}</Link><span className="ml-2 text-sm text-ink-muted">{event.location}</span></p>)}
      </div>
    </section>
  )
}
