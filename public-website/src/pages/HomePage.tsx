import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { getHomepage } from '@/api/homepage'
import { getStories } from '@/api/stories'
import { getFeaturedEvent } from '@/api/events'
import { getLocations } from '@/api/locations'
import { SEO } from '@/components/ui/SEO'
import { ButtonLink } from '@/components/ui/Button'
import { Card, SectionHeading, Skeleton, ErrorState } from '@/components/ui/Card'
import { NewsletterForm } from '@/components/forms/NewsletterForm'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { formatDate } from '@/lib/utils'
import { useSiteConfig } from '@/contexts/SiteConfigContext'
import { HeroSlider } from '@/components/home/HeroSlider'

export function HomePage() {
  const reduced = useReducedMotion()
  const site = useSiteConfig()
  const { data: homepage, isLoading, isError, refetch } = useQuery({ queryKey: ['homepage'], queryFn: getHomepage })
  const { data: stories } = useQuery({ queryKey: ['stories'], queryFn: getStories })
  const { data: featuredEvent } = useQuery({ queryKey: ['featuredEvent'], queryFn: getFeaturedEvent })
  const { data: locations } = useQuery({ queryKey: ['locations'], queryFn: getLocations })
  const [activeCountry, setActiveCountry] = useState<string | null>(null)

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-16">
        <Skeleton className="h-96 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    )
  }

  if (isError || !homepage) {
    return <div className="mx-auto max-w-7xl px-4 py-16"><ErrorState message="Unable to load homepage." onRetry={() => refetch()} /></div>
  }

  const featuredStories = stories?.filter((s) => homepage.storiesTeaser.featuredStoryIds.includes(s.id)) ?? stories?.slice(0, 2) ?? []
  const selectedLocation = locations?.find((l) => l.country === activeCountry)
  const heroHeadline = site.homepage.heroHeadline || homepage.hero.headline
  const heroIntro = site.homepage.heroIntro || homepage.hero.intro
  const heroImageUrl = site.homepage.heroImageUrl
  const heroImageAlt = site.homepage.heroImageAlt || homepage.hero.imageAlt
  const primaryCtaLabel = site.homepage.primaryCtaLabel || homepage.hero.primaryCta.label
  const primaryCtaHref = site.homepage.primaryCtaHref || homepage.hero.primaryCta.href
  const heroSlides = (site.homepage.heroSlides?.length
    ? site.homepage.heroSlides
    : heroImageUrl
      ? [{ id: 'legacy', imageUrl: heroImageUrl, alt: heroImageAlt }]
      : []
  ).filter((slide) => Boolean(slide.imageUrl))

  const fadeUp = reduced
    ? { initial: false as const }
    : { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 } }

  return (
    <>
      <SEO description={heroIntro} />

      {/* Hero — full bleed slider */}
      <section className="relative min-h-[85vh] overflow-hidden" aria-label="Welcome">
        <HeroSlider slides={heroSlides} />
        <div className="relative z-10 mx-auto flex min-h-[85vh] max-w-7xl flex-col justify-end px-4 pb-20 pt-32 md:pb-24">
          <motion.div {...(reduced ? {} : { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8 } })}>
            <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-gold">Companions of Grace International</p>
            <h1 className="font-display text-4xl font-bold text-white md:text-6xl lg:text-7xl text-balance">
              {heroHeadline}
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-white/90 md:text-xl">{homepage.hero.subheadline}</p>
            <p className="mt-4 max-w-xl text-white/75">{heroIntro}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <ButtonLink to={primaryCtaHref} size="lg">{primaryCtaLabel}</ButtonLink>
              <ButtonLink to={homepage.hero.secondaryCta.href} variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-teal-deep">
                {homepage.hero.secondaryCta.label}
              </ButtonLink>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-mist-gradient py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <motion.div {...fadeUp}>
            <SectionHeading title={homepage.mission.title} />
            <p className="text-xl leading-relaxed text-ink">{homepage.mission.statement}</p>
            <blockquote className="mt-8 border-l-4 border-gold pl-6 text-left font-display text-lg italic text-teal-deep">
              {homepage.mission.scripture}
            </blockquote>
          </motion.div>
        </div>
      </section>

      {/* Video */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-4">
          <SectionHeading title={homepage.video.title} subtitle={homepage.video.description} />
          <div className="relative aspect-video overflow-hidden rounded-xl bg-teal-deep shadow-xl">
            <div className="absolute inset-0 flex items-center justify-center bg-teal-gradient">
              <div className="text-center text-white">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gold text-teal-deep">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
                </div>
                <p className="text-sm text-white/80">Introduction video — embed via Strapi media</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Methods */}
      <section className="bg-mist-gradient py-20">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeading title="Our Methods" subtitle="Enable, Train, and Support healthcare professionals for Kingdom engagement" />
          <div className="grid gap-8 md:grid-cols-3">
            {homepage.methods.map((method, i) => (
              <motion.div key={method.id} {...fadeUp} transition={{ delay: reduced ? 0 : i * 0.15 }}>
                <Card className="h-full border-t-4 border-t-gold">
                  <span className="text-3xl font-display font-bold text-gold">{String(i + 1).padStart(2, '0')}</span>
                  <h3 className="mt-2 font-display text-2xl text-teal-deep">{method.title}</h3>
                  <p className="text-sm font-semibold text-ink-muted">{method.subtitle}</p>
                  <p className="mt-3 text-ink-muted">{method.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="bg-teal-gradient py-16 text-white">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeading title="Our Impact" className="[&_h2]:text-white [&_p]:text-white/80" />
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {homepage.impactStats.map((stat) => (
              <div key={stat.id} className="text-center">
                <p className="font-display text-5xl font-bold text-gold md:text-6xl">{stat.value}</p>
                <p className="mt-2 text-lg font-semibold">{stat.label}</p>
                {stat.description && <p className="text-sm text-white/70">{stat.description}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeading title="Our Portfolio" subtitle="Four ministry areas equipping healthcare professionals worldwide" />
          <div className="grid gap-6 md:grid-cols-2">
            {homepage.portfolio.map((area) => (
              <Link key={area.id} to={`/programs/${area.programSlug}`} className="group">
                <Card className="h-full transition-shadow hover:shadow-md group-hover:border-gold/50">
                  <h3 className="font-display text-xl text-teal-deep group-hover:text-gold">{area.title}</h3>
                  <p className="mt-2 text-ink-muted">{area.summary}</p>
                  <span className="mt-4 inline-block text-sm font-semibold text-teal-mid group-hover:text-gold">Learn more →</span>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Where We Serve */}
      <section className="bg-mist-gradient py-20">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeading title="Where We Serve" subtitle="Communities of Grace across continents" />
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3" role="list" aria-label="Countries served">
              {locations?.map((loc) => (
                <button
                  key={loc.id}
                  type="button"
                  role="listitem"
                  onClick={() => setActiveCountry(loc.country)}
                  className={`rounded-lg px-4 py-3 text-left text-sm font-medium transition-colors ${
                    activeCountry === loc.country
                      ? 'bg-teal-deep text-white'
                      : 'bg-white text-teal-deep hover:bg-teal-deep/10'
                  }`}
                  aria-pressed={activeCountry === loc.country}
                >
                  {loc.country}
                </button>
              ))}
            </div>
            <Card aria-live="polite">
              {selectedLocation ? (
                <>
                  <h3 className="font-display text-2xl text-teal-deep">{selectedLocation.country}</h3>
                  <p className="text-sm text-ink-muted">{selectedLocation.region}</p>
                  <p className="mt-3 text-ink-muted">{selectedLocation.summary}</p>
                  <p className="mt-4 text-sm font-semibold text-teal-deep">Programs: {selectedLocation.programs.join(', ')}</p>
                </>
              ) : (
                <p className="text-ink-muted">Select a country to see ministry details.</p>
              )}
            </Card>
          </div>
        </div>
      </section>

      {/* Stories Teaser */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <SectionHeading title={homepage.storiesTeaser.title} subtitle={homepage.storiesTeaser.description} />
          <div className="grid gap-6 md:grid-cols-2">
            {featuredStories.map((story) => (
              <Card key={story.id} as="article">
                <span className="text-xs font-semibold uppercase tracking-wide text-gold">{story.country} · {story.program}</span>
                <h3 className="mt-2 font-display text-xl text-teal-deep">{story.title}</h3>
                <p className="mt-2 text-ink-muted">{story.summary}</p>
                <Link to="/resources/stories" className="mt-4 inline-block text-sm font-semibold text-teal-mid hover:text-gold">
                  {story.type === 'video' ? 'Watch' : 'Read'} →
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Event */}
      {featuredEvent && (
        <section className="bg-teal-deep py-16 text-white">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <p className="text-sm font-semibold uppercase tracking-wide text-gold">Featured Event</p>
            <h2 className="mt-2 font-display text-3xl font-bold">{featuredEvent.title}</h2>
            <p className="mt-2 text-white/80">{formatDate(featuredEvent.startDate)} · {featuredEvent.location}</p>
            <p className="mt-4 text-white/90">{featuredEvent.summary}</p>
            <ButtonLink to={`/events/${featuredEvent.slug}`} className="mt-6">View Event Details</ButtonLink>
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="py-20">
        <div className="mx-auto max-w-xl px-4">
          <SectionHeading title={homepage.newsletter.title} subtitle={homepage.newsletter.description} />
          <Card><NewsletterForm /></Card>
        </div>
      </section>

      {/* Donate CTA */}
      <section className="bg-mist-gradient py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="font-display text-3xl text-teal-deep">{homepage.donateCta.title}</h2>
          <p className="mt-4 text-lg text-ink-muted">{homepage.donateCta.description}</p>
          <ButtonLink to="/donate" size="lg" className="mt-8">{homepage.donateCta.buttonLabel}</ButtonLink>
        </div>
      </section>
    </>
  )
}
