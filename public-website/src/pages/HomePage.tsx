import { HomeBackdrop } from '@/components/home/HomeBackdrop'
import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { getHomepage } from '@/api/homepage'
import { getStories } from '@/api/stories'
import { getTestimonials } from '@/api/testimonials'
import { getFeaturedEvent } from '@/api/events'
import { getLocations } from '@/api/locations'
import { SEO } from '@/components/ui/SEO'
import { ButtonLink } from '@/components/ui/Button'
import { SectionHeading, Skeleton, ErrorState } from '@/components/ui/Card'
import { NewsletterForm } from '@/components/forms/NewsletterForm'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { formatDate } from '@/lib/utils'
import { useSiteConfig } from '@/contexts/SiteConfigContext'
import { WhereWeServeSection } from '@/components/home/WhereWeServeSection'
import { CustomHomeSection, SplitBand, isCustomHomeSection, isSplitHomeSection } from '@/components/home/CustomSection'
import { TestimonialCarousel } from '@/components/home/TestimonialCarousel'
import { siteImages } from '@/data/siteCopy'
import { MediaPreview } from '@/components/ui/MediaPreview'

const methodImages = [siteImages.enable, siteImages.train, siteImages.support]
const portfolioImages = [siteImages.historicGathering, siteImages.clinic, siteImages.careHands, siteImages.hope]

export function HomePage() {

  const reduced = useReducedMotion()
  const site = useSiteConfig()
  const [searchParams] = useSearchParams()
  const { data: homepage, isLoading, isError, refetch } = useQuery({ queryKey: ['homepage'], queryFn: getHomepage })
  const { data: stories } = useQuery({ queryKey: ['stories'], queryFn: getStories })
  const { data: testimonials } = useQuery({ queryKey: ['testimonials'], queryFn: getTestimonials })
  const { data: featuredEvent } = useQuery({ queryKey: ['featuredEvent'], queryFn: getFeaturedEvent })
  const { data: locations } = useQuery({ queryKey: ['locations'], queryFn: getLocations })
  const locationParam = searchParams.get('location')
  const [activeCountry, setActiveCountry] = useState<string | null>(locationParam)

  useEffect(() => {
    if (locationParam) setActiveCountry(locationParam)
  }, [locationParam])

  useEffect(() => {
    if (isLoading) return
    if (window.location.hash !== '#map' && !locationParam) return
    const node = document.getElementById('map')
    if (!node) return
    const timer = window.setTimeout(() => node.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80)
    return () => window.clearTimeout(timer)
  }, [isLoading, locationParam, locations])

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

  const copy = site.copy.homepage
  const matchedStories = stories?.filter((s) => homepage.storiesTeaser.featuredStoryIds.includes(s.id)) ?? []
  const featuredStories = (matchedStories.length ? matchedStories : stories?.slice(0, 2) ?? []).slice(0, 2)
  const heroPhoto = site.homepage.heroSlides?.find(slide => slide.imageUrl)
  const heroHeadline = site.homepage.heroHeadline || homepage.hero.headline
  const heroIntro = site.homepage.heroIntro || homepage.hero.intro
  const heroHeadlineSize = site.homepage.heroHeadlineSize || 64
  const heroHeadlineCase = site.homepage.heroHeadlineCase || 'uppercase'
  const primaryCtaLabel = site.homepage.primaryCtaLabel || homepage.hero.primaryCta.label
  const primaryCtaHref = site.homepage.primaryCtaHref || homepage.hero.primaryCta.href
  const missionTitle = site.homepage.missionTitle || homepage.mission.title
  const missionStatement = site.homepage.missionStatement || homepage.mission.statement
  const missionScripture = site.homepage.missionScripture || homepage.mission.scripture
  const impactStats = site.homepage.impactStats?.length ? site.homepage.impactStats : homepage.impactStats
  const orderedSections = [...(site.homepage.sections?.length ? site.homepage.sections : [
    { id: 'hero', label: 'Hero', enabled: true, order: 1, summary: '' },
    { id: 'newsletterBanner', label: 'Gold banner', enabled: true, order: 2, summary: '' },
    { id: 'legacy', label: 'Legacy', enabled: true, order: 3, summary: '' },
    { id: 'video', label: 'Video', enabled: true, order: 4, summary: '' },
    { id: 'mission', label: 'Mission', enabled: true, order: 5, summary: '' },
    { id: 'splitPrograms', label: 'Programs', enabled: true, order: 6, summary: '' },
    { id: 'splitStories', label: 'Stories', enabled: true, order: 7, summary: '' },
    { id: 'methods', label: 'Methods', enabled: true, order: 8, summary: '' },
    { id: 'impact', label: 'Impact', enabled: true, order: 9, summary: '' },
    { id: 'portfolio', label: 'Portfolio', enabled: true, order: 10, summary: '' },
    { id: 'map', label: 'Map', enabled: true, order: 11, summary: '' },
    { id: 'stories', label: 'Stories', enabled: true, order: 12, summary: '' },
    { id: 'testimonials', label: 'Testimonials', enabled: true, order: 13, summary: '' },
    { id: 'events', label: 'Events', enabled: true, order: 14, summary: '' },
    { id: 'newsletter', label: 'Newsletter', enabled: true, order: 14, summary: '' },
    { id: 'donate', label: 'Donate', enabled: true, order: 15, summary: '' },
    { id: 'faith', label: 'Faith', enabled: true, order: 16, summary: '' },
  ])]
    .sort((a, b) => a.order - b.order)
    .filter((section) => section.enabled !== false)
    .filter((section) => section.id !== 'video')

  return (
    <div className="home-experience">
      <SEO description={heroIntro} />
      {orderedSections.map((section) => {
        if (isCustomHomeSection(section)) return <CustomHomeSection key={section.id} section={section} />
        if (isSplitHomeSection(section)) {
          return (
            <SplitBand
              key={section.id}
              section={section}
              tone={section.id === 'splitStories' ? 'mist' : 'white'}
            />
          )
        }
        if (section.id === 'hero') return (
      <section key="hero" className="home-scroll-scene" data-entrance={'animation' in section ? section.animation : undefined} aria-label="Welcome">
        <div className="home-scroll-stage">
        <div className="home-scene-backdrop" aria-hidden="true" />
        <HomeBackdrop />
        <div className="home-scroll-layout">
          <div className="home-scroll-copy">
          <div>
            <h1
              className="max-w-5xl font-display font-bold leading-[0.95] tracking-wide text-white"
              style={{
                fontSize: `clamp(2.9rem, 6.5vw, ${heroHeadlineSize}px)`,
                textTransform: heroHeadlineCase === 'lowercase' ? 'lowercase' : heroHeadlineCase === 'as-typed' ? 'none' : 'uppercase',
              }}
            >
              {heroHeadline}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/90 md:text-xl">{heroIntro}</p>
            <div className="pointer-events-auto mt-8 flex w-fit flex-wrap items-center gap-6">
              <ButtonLink to={primaryCtaHref} size="lg" className="rounded-sm uppercase tracking-[0.22em]">
                {primaryCtaLabel}
              </ButtonLink>
              {copy.secondaryCtaLabel ? (
                <Link to={copy.secondaryCtaHref} className="text-sm font-bold uppercase tracking-[0.18em] text-white underline-offset-4 hover:underline">
                  {copy.secondaryCtaLabel}
                </Link>
              ) : null}
            </div>
          </div>
          </div>
          <div className="hero-photograph">
            <MediaPreview src={heroPhoto?.imageUrl || site.homepage.heroImageUrl || siteImages.historicGathering}
              alt={heroPhoto?.alt || site.homepage.heroImageAlt || 'Fellowship gathering'} className="h-full w-full" />
          </div>
        </div>
        </div>
      </section>
        )
        if (section.id === 'newsletterBanner') return (
      <section key="newsletterBanner" className="home-dispatch border-y border-mist-dark bg-white py-16 text-teal-deep">
        <div className="mx-auto grid max-w-5xl gap-10 px-4 md:grid-cols-2 md:items-center">
          <div className="text-center md:text-left">
            <p className="text-xs font-bold uppercase tracking-[0.28em]">{copy.eyebrow}</p>
            <h2 className="mt-3 font-display text-4xl font-bold italic md:text-5xl">{copy.newsletterBannerTitle}</h2>
            <p className="mt-5 text-lg leading-relaxed">{copy.newsletterBannerBody}</p>
            <ButtonLink to="/resources/stories" className="mt-8 rounded-sm uppercase tracking-[0.2em]">
              {copy.newsletterBannerCta}
            </ButtonLink>
          </div>
          <div className="border border-mist-dark bg-white p-6 text-left text-ink">
            <p className="mb-4 text-sm font-semibold text-teal-deep">Subscribe for stories and events</p>
            <NewsletterForm />
          </div>
        </div>
      </section>
        )
        if (section.id === 'legacy') return (
      <section key="legacy" className="border-y border-mist-dark bg-white py-14 md:py-20">
        <div className="relative z-10 mx-auto max-w-5xl px-4 text-center text-ink">
              <h2 className="font-display text-4xl font-bold uppercase tracking-wide text-teal-deep md:text-6xl">{copy.legacyTitle}</h2>
              <p className="mx-auto mt-8 max-w-3xl text-lg leading-relaxed text-ink-muted">{copy.legacyBody}</p>
        </div>
      </section>
        )
        if (section.id === 'mission') return (
      <section key="mission" className="bg-white py-14 md:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">{missionTitle}</p>
            <p className="mt-6 font-display text-2xl leading-relaxed text-ink md:text-3xl">{missionStatement}</p>
            <p className="mt-8 text-sm font-semibold uppercase tracking-[0.2em] text-teal-deep">{missionScripture}</p>
          </div>
        </div>
      </section>
        )
        if (section.id === 'methods') return (
      <section key="methods" className="bg-white py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <p className="text-center text-xs font-bold uppercase tracking-[0.3em] text-gold">{copy.methodsTitle}</p>
          <h2 className="mx-auto mt-4 max-w-3xl text-center font-display text-3xl font-semibold text-teal-deep md:text-5xl">
            {copy.methodsSubtitle}
          </h2>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {homepage.methods.map((method, i) => (
              <div key={method.id} className="overflow-hidden rounded-xl border border-mist-dark bg-white">
                <MediaPreview src={methodImages[i] || siteImages.missionField} alt={method.title} className="h-52 w-full object-cover" />
                <div className="p-6">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-gold">{method.title}</p>
                  <h3 className="mt-2 font-display text-3xl text-teal-deep">{method.subtitle}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-muted">{method.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
        )
        if (section.id === 'impact') return (
      <section key="impact" className="home-impact border-y border-mist-dark bg-white py-20 text-ink">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">{copy.impactTitle}</p>
          <p className="mx-auto mt-5 max-w-3xl text-lg text-ink-muted">{copy.impactIntro}</p>
          <div className="mt-12 grid grid-cols-2 gap-10 md:grid-cols-4">
            {impactStats.map((stat) => (
              <div key={stat.id}>
                <p className="font-display text-5xl font-bold text-gold md:text-6xl">{stat.value}</p>
                <p className="mt-3 text-[11px] font-bold uppercase leading-snug tracking-[0.16em] text-teal-deep">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
        )
        if (section.id === 'portfolio') return (
      <section key="portfolio" className="bg-white py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <p className="text-center text-xs font-bold uppercase tracking-[0.3em] text-gold">What we do</p>
          <SectionHeading title={copy.portfolioTitle} subtitle={copy.portfolioSubtitle} />
          <div className="grid gap-6 md:grid-cols-2">
            {homepage.portfolio.map((area, i) => (
              <article key={area.id} className="group overflow-hidden rounded-xl border border-mist-dark bg-white">
                <MediaPreview src={portfolioImages[i] || siteImages.clinic} alt={area.title} className="h-44 w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="p-6">
                  <h3 className="font-display text-3xl text-teal-deep group-hover:text-gold">{area.title}</h3>
                  <p className="mt-3 max-w-xl text-sm text-ink-muted">{area.summary}</p>
                  <Link to={`/programs/${area.programSlug}`} className="mt-4 inline-block text-xs font-bold uppercase tracking-[0.18em] text-gold">Learn more</Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
        )
        if (section.id === 'map') return (
          <WhereWeServeSection
            key="map"
            locations={locations ?? []}
            activeCountry={activeCountry}
            onSelect={setActiveCountry}
            title={copy.mapTitle}
            subtitle={copy.mapSubtitle}
          />
        )
        if (section.id === 'stories') return (
      <section key="stories" className="bg-white py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-center font-display text-3xl text-teal-deep md:text-5xl">{copy.storiesTitle}</h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-lg text-ink-muted">{copy.storiesSubtitle}</p>
          <div className="mt-8 mb-12 flex flex-wrap justify-center gap-4">
            <ButtonLink to="/resources/stories" className="rounded-sm uppercase tracking-[0.2em]">{copy.watchStoriesCta}</ButtonLink>
            <ButtonLink to="/resources/stories" variant="outline" className="rounded-sm uppercase tracking-[0.2em]">{copy.readStoriesCta}</ButtonLink>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {featuredStories.map((story) => (
              <article key={story.id} className="overflow-hidden">
                {story.type === 'video' && story.videoUrl ? (
                  <MediaPreview video src={story.videoUrl} poster={story.imageUrl} alt={story.title} className="relative h-72 w-full overflow-hidden bg-black" />
                ) : story.imageUrl ? (
                  <MediaPreview src={story.imageUrl} alt={story.title} className="h-72 w-full object-cover" />
                ) : null}
                <div className="pt-5">
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-gold">{story.country} · {story.program}</span>
                  <h3 className="mt-2 font-display text-2xl text-teal-deep">{story.title}</h3>
                  {story.summary ? (
                    <blockquote className="mt-2 font-display text-lg italic text-teal-deep">“{story.summary}”</blockquote>
                  ) : null}
                  <Link to={`/resources/stories/${story.slug}`} className="mt-4 inline-block text-xs font-bold uppercase tracking-[0.18em] text-teal-deep hover:text-gold">
                    {story.type === 'video' ? 'Watch full story' : 'Read'}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
        )
        if (section.id === 'testimonials') return testimonials?.length ? (
      <section key="testimonials" className="bg-mist-gradient py-14 md:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <p className="text-center text-xs font-bold uppercase tracking-[0.3em] text-gold">Voices from the fellowship</p>
          <h2 className="mx-auto mt-4 max-w-3xl text-center font-display text-3xl text-teal-deep md:text-5xl">From volunteers and partners</h2>
          <div className="mt-12">
            <TestimonialCarousel items={testimonials} />
          </div>
        </div>
      </section>
        ) : null
        if (section.id === 'events') return featuredEvent ? (
        <section key="events" className="border-y border-mist-dark bg-white py-20 text-ink">
          <div className="mx-auto max-w-4xl px-4 text-center">
            {siteImages.historicGathering ? (
              <MediaPreview src={siteImages.historicGathering} alt={featuredEvent.title} className="mb-8 h-56 w-full rounded-xl object-cover" />
            ) : null}
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-gold">Featured Event</p>
            <h2 className="mt-3 font-display text-4xl font-bold text-teal-deep">{featuredEvent.title}</h2>
            <p className="mt-2 text-ink-muted">{formatDate(featuredEvent.startDate)} · {featuredEvent.location}</p>
            <p className="mt-4 text-ink-muted">{featuredEvent.summary}</p>
            <ButtonLink to={`/events/${featuredEvent.slug}`} className="mt-6 rounded-sm uppercase tracking-[0.2em]">View Event Details</ButtonLink>
          </div>
        </section>
        ) : null
        if (section.id === 'newsletter') return (
      <section key="newsletter" className="bg-white py-20">
        <div className="mx-auto max-w-xl px-4">
          <SectionHeading title={homepage.newsletter.title} subtitle={homepage.newsletter.description} />
          <div className="border border-mist-dark bg-white p-6"><NewsletterForm /></div>
        </div>
      </section>
        )
        if (section.id === 'donate') return (
      <section key="donate" className="border-y border-mist-dark bg-white py-14 text-ink md:py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          {siteImages.give ? (
            <MediaPreview src={siteImages.give} alt={homepage.donateCta.title} className="mb-8 h-52 w-full rounded-xl object-cover" />
          ) : null}
          <h2 className="font-display text-4xl uppercase tracking-wide text-teal-deep md:text-5xl">{homepage.donateCta.title}</h2>
          <p className="mt-5 text-lg text-ink-muted">{homepage.donateCta.description}</p>
          <ButtonLink to="/donate" size="lg" className="mt-8 rounded-sm uppercase tracking-[0.22em]">{homepage.donateCta.buttonLabel}</ButtonLink>
        </div>
      </section>
        )
        if (section.id === 'faith') return (
      <section key="faith" className="border-t border-mist-dark bg-white py-20 text-ink">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-xs font-bold uppercase tracking-[0.32em] text-gold">{copy.faithTitle}</h2>
          <p className="mt-8 font-display text-xl leading-relaxed text-ink-muted md:text-2xl">{copy.faithStatement}</p>
          <Link to="/about/beliefs" className="mt-8 inline-block text-xs font-bold uppercase tracking-[0.22em] text-gold hover:text-teal-deep">
            Read our beliefs
          </Link>
        </div>
      </section>
        )
        return null
      }).map((content, index) => {
        if (!content) return null
        const section = orderedSections[index]
        const effect = 'animation' in section ? section.animation : 'none'
        if (reduced || !effect || effect === 'none' || effect === 'editorial') return <div key={section.id}>{content}</div>
        return (
          <motion.div key={section.id}
            initial={{ opacity: 0, y: effect === 'rise' ? 28 : 0, scale: effect === 'zoom' ? 0.96 : 1 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 'some' }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            {content}
          </motion.div>
        )
      })}
    </div>
  )
}
