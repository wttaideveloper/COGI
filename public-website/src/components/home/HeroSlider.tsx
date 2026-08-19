import { useEffect, useState } from 'react'
import { clsx } from 'clsx'

export type HeroSlide = {
  id: string
  imageUrl: string
  alt?: string
}

type Props = {
  slides: HeroSlide[]
  intervalMs?: number
  className?: string
  objectPosition?: string
  children?: React.ReactNode
}

export function HeroSlider({ slides, intervalMs = 6000, className, objectPosition = 'center', children }: Props) {
  const valid = slides.filter((slide) => Boolean(slide.imageUrl))
  const [active, setActive] = useState(0)

  useEffect(() => {
    setActive(0)
  }, [valid.length])

  useEffect(() => {
    if (valid.length <= 1) return undefined
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % valid.length)
    }, intervalMs)
    return () => window.clearInterval(timer)
  }, [valid.length, intervalMs])

  if (!valid.length) {
    return (
      <div className={clsx('absolute inset-0 bg-teal-gradient', className)}>
        {children}
      </div>
    )
  }

  return (
    <div className={clsx('absolute inset-0', className)}>
      {valid.map((slide, index) => (
        <img
          key={slide.id}
          src={slide.imageUrl}
          alt={index === active ? (slide.alt || 'Hero banner') : ''}
          className={clsx(
            'absolute inset-0 h-full w-full object-cover transition-opacity duration-700',
            index === active ? 'opacity-100' : 'opacity-0',
          )}
          style={{ objectPosition }}
          aria-hidden={index !== active}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/15" />
      {children}
      {valid.length > 1 ? (
        <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2" role="tablist" aria-label="Hero slides">
          {valid.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              role="tab"
              aria-selected={index === active}
              aria-label={`Show slide ${index + 1}`}
              className={clsx(
                'h-2.5 rounded-full transition-all',
                index === active ? 'w-8 bg-gold' : 'w-2.5 bg-white/50 hover:bg-white/80',
              )}
              onClick={() => setActive(index)}
            />
          ))}
        </div>
      ) : null}
      {valid.length > 1 ? (
        <>
          <button
            type="button"
            className="absolute left-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-black/30 p-2 text-white backdrop-blur-sm hover:bg-black/50 md:inline-flex"
            aria-label="Previous slide"
            onClick={() => setActive((current) => (current + 1 + valid.length) % valid.length)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m15 18-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <button
            type="button"
            className="absolute right-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-black/30 p-2 text-white backdrop-blur-sm hover:bg-black/50 md:inline-flex"
            aria-label="Next slide"
            onClick={() => setActive((current) => (current + 1) % valid.length)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m9 18 6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </>
      ) : null}
    </div>
  )
}
