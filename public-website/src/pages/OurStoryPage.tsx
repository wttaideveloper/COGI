import { MediaPreview } from '@/components/ui/MediaPreview'
import { motion } from 'framer-motion'
import { SEO } from '@/components/ui/SEO'
import { PageHero } from '@/components/ui/Card'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useSiteConfig } from '@/contexts/SiteConfigContext'

function MilestoneDescription({ text }: { text: string }) {
  const paragraphs = text
    .replace(/\r\n/g, '\n')
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean)

  if (!paragraphs.length) return null

  return (
    <div className="mt-2 space-y-3">
      {paragraphs.map((paragraph, index) => (
        <p key={index} className="whitespace-pre-line text-left leading-relaxed text-ink-muted">
          {paragraph}
        </p>
      ))}
    </div>
  )
}

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
          <MediaPreview src={story.imageUrl} alt={story.heroTitle} className="mb-12 h-72 w-full rounded-xl object-cover shadow-lg" />
        ) : null}
        <div className="relative border-l-2 border-gold pl-8">
          {story.milestones.map((milestone, i) => (
            <motion.article
              key={`${milestone.year}-${milestone.title}-${i}`}
              className="relative mb-12 last:mb-0 text-left"
              {...(reduced ? {} : { initial: { opacity: 0, x: -20 }, whileInView: { opacity: 1, x: 0 }, viewport: { once: true }, transition: { delay: i * 0.1 } })}
            >
              <span className="absolute -left-[41px] top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-gold ring-4 ring-white" aria-hidden="true" />
              <time className="block font-display text-2xl font-bold text-teal-deep">{milestone.year}</time>
              <h2 className="mt-1 font-display text-xl text-ink">{milestone.title}</h2>
              <MilestoneDescription text={milestone.description} />
            </motion.article>
          ))}
        </div>
      </div>
    </>
  )
}
