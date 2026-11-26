import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Story } from '@/types'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export function StoryCarousel({ stories }: { stories: Story[] }) {
  const track = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [interacting, setInteracting] = useState(false)
  const reduced = useReducedMotion()
  const move = useCallback((index: number) => {
    const node = track.current
    const card = node?.children[index] as HTMLElement | undefined
    if (node && card) node.scrollTo({ left: card.offsetLeft, behavior: reduced ? 'instant' : 'smooth' })
  }, [reduced])
  useEffect(() => {
    if (paused || interacting || reduced || stories.length < 2) return
    const timer = window.setInterval(() => move((active + 1) % stories.length), 6000)
    return () => window.clearInterval(timer)
  }, [active, paused, interacting, reduced, stories.length, move])
  if (!stories.length) return null
  return <div onMouseEnter={() => setInteracting(true)} onMouseLeave={() => setInteracting(false)}
    onFocus={() => setInteracting(true)} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setInteracting(false) }}
    role="region" aria-label="Stories of transformation" aria-roledescription="carousel">
    <div className="mb-5 flex justify-end gap-3">
      <button type="button" onClick={() => move((active - 1 + stories.length) % stories.length)} aria-label="Previous story">← Previous</button>
      {!reduced && <button type="button" onClick={() => setPaused(value => !value)}>{paused ? 'Play stories' : 'Pause stories'}</button>}
      <button type="button" onClick={() => move((active + 1) % stories.length)} aria-label="Next story">Next →</button>
    </div>
    <div ref={track} className="story-track" onScroll={() => {
      const node = track.current
      if (!node) return
      const distances = Array.from(node.children).map(child => Math.abs((child as HTMLElement).offsetLeft - node.scrollLeft))
      setActive(distances.indexOf(Math.min(...distances)))
    }}>
      {stories.map((story, index) => <article key={story.id} className="story-slide" data-active={index === active}>
        <Link to={`/resources/stories/${story.slug}`}>
          {story.imageUrl && <img src={story.imageUrl} alt="" loading="lazy" className="h-64 w-full object-cover" />}
          <div className="p-6">
            <p className="text-sm text-accent-ink">{story.country} · {story.program}</p>
            <h3 className="mt-2 font-display text-2xl text-teal-deep">{story.title}</h3>
            <p className="mt-3 text-ink-muted">{story.summary}</p>
            <span className="mt-4 block font-semibold text-teal-deep">{story.type === 'video' ? 'Watch full story' : 'Read story'} →</span>
          </div>
        </Link>
      </article>)}
    </div>
  </div>
}
