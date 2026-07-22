import { motion } from 'framer-motion'
import { fallbackTimeline } from '@/data/fallback'
import { SEO } from '@/components/ui/SEO'
import { PageHero } from '@/components/ui/Card'
import { useReducedMotion } from '@/hooks/useReducedMotion'

export function OurStoryPage() {
  const reduced = useReducedMotion()

  return (
    <>
      <SEO title="Our Story" description="COGI timeline from 2019 to 2026" path="/about/our-story" />
      <PageHero title="Our Story" subtitle="A fellowship born from prayer, friendship, and Kingdom vision" />
      <div className="mx-auto max-w-3xl px-4 py-16">
        <div className="relative border-l-2 border-gold pl-8">
          {fallbackTimeline.map((milestone, i) => (
            <motion.article
              key={milestone.year}
              className="relative mb-12 last:mb-0"
              {...(reduced ? {} : { initial: { opacity: 0, x: -20 }, whileInView: { opacity: 1, x: 0 }, viewport: { once: true }, transition: { delay: i * 0.1 } })}
            >
              <span className="absolute -left-[41px] flex h-5 w-5 items-center justify-center rounded-full bg-gold ring-4 ring-white" aria-hidden="true" />
              <time className="font-display text-2xl font-bold text-teal-deep">{milestone.year}</time>
              <h2 className="mt-1 font-display text-xl text-ink">{milestone.title}</h2>
              <p className="mt-2 text-ink-muted">{milestone.description}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </>
  )
}
