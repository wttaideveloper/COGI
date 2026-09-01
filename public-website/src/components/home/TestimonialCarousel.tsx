import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Testimonial } from '@/types'
import { VideoPlayer } from '@/components/ui/VideoPlayer'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export function TestimonialCarousel({ items }: { items: Testimonial[] }) {
  const reduced = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const current = items[index]

  useEffect(() => {
    if (reduced || paused || items.length < 2) return
    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % items.length)
    }, 8000)
    return () => window.clearInterval(timer)
  }, [items.length, paused, reduced])

  if (!current) return null

  return (
    <div
      className="mx-auto max-w-3xl"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <figure className="rounded-xl border border-mist-dark bg-white p-8 text-center shadow-sm">
        {current.mediaType === 'video' && current.videoUrl ? (
          <VideoPlayer src={current.videoUrl} title={current.author} className="relative mx-auto mb-6 aspect-video w-full overflow-hidden bg-black" />
        ) : null}
        <blockquote className="font-display text-2xl italic leading-relaxed text-teal-deep md:text-3xl">
          “{current.quote}”
        </blockquote>
        <figcaption className="mt-6">
          <p className="font-semibold text-ink">{current.author}</p>
          {current.role ? <p className="text-sm text-ink-muted">{current.role}</p> : null}
          {(current.country || current.program) ? (
            <p className="mt-1 text-xs uppercase tracking-wide text-gold">{[current.country, current.program].filter(Boolean).join(' · ')}</p>
          ) : null}
        </figcaption>
      </figure>
      {items.length > 1 ? (
        <div className="mt-6 flex justify-center gap-2" role="tablist" aria-label="Testimonials">
          {items.map((item, i) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              className={`h-2.5 w-2.5 rounded-full ${i === index ? 'bg-gold' : 'bg-mist-dark'}`}
              onClick={() => setIndex(i)}
            >
              <span className="sr-only">{item.author}</span>
            </button>
          ))}
        </div>
      ) : null}
      <p className="mt-6 text-center">
        <Link to="/resources/testimonials" className="text-sm font-semibold text-teal-deep hover:text-gold">Read more testimonials →</Link>
      </p>
    </div>
  )
}
