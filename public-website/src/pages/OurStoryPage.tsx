import { motion } from 'framer-motion'
import { SEO } from '@/components/ui/SEO'
import { PageHero } from '@/components/ui/Card'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useSiteConfig } from '@/contexts/SiteConfigContext'

export function OurStoryPage() {
  const reduced = useReducedMotion()
  const { copy } = useSiteConfig()
  const story = copy.story

  return (
    <>
      <SEO title={story.heroTitle} description={story.intro} path="/about/our-story" />
      <PageHero title={story.heroTitle} subtitle={story.heroSubtitle} imageUrl={story.imageUrl} />
      <div className="mx-auto max-w-3xl px-4 py-16">
        <p className="mb-12 text-lg leading-relaxed text-ink">{story.intro}</p>
        {story.imageUrl ? (
          <img src={story.imageUrl} alt="" className="mb-12 h-72 w-full rounded-xl object-cover shadow-lg" />
        ) : null}
        <div className="relative border-l-2 border-gold pl-8">
          {story.milestones.map((milestone, i) => (
            <motion.article
              key={`${milestone.year}-${milestone.title}`}
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
