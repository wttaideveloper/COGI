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
import { SectionHeading, Skeleton, ErrorState } from '@/components/ui/Card'
import { NewsletterForm } from '@/components/forms/NewsletterForm'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { formatDate } from '@/lib/utils'
import { useSiteConfig } from '@/contexts/SiteConfigContext'
import { HeroSlider } from '@/components/home/HeroSlider'
import { WorldMap } from '@/components/home/WorldMap'
import { CustomHomeSection, isCustomHomeSection } from '@/components/home/CustomSection'
import { siteImages } from '@/data/siteCopy'
import { VideoPlayer } from '@/components/ui/VideoPlayer'

const methodImages = [siteImages.enable, siteImages.train, siteImages.support]
const portfolioImages = [siteImages.historicGathering, siteImages.clinic, siteImages.careHands, siteImages.hope]

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

  const copy = site.copy.homepage
  const matchedStories = stories?.filter((s) => homepage.storiesTeaser.featuredStoryIds.includes(s.id)) ?? []
  const featuredStories = (matchedStories.length ? matchedStories : stories?.slice(0, 2) ?? []).slice(0, 2)
  const locationGroups = ['Americas & Africa', 'Asia-Pacific']
    .map((region) => ({
      region,
      items: locations?.filter((loc) => loc.region === region) ?? [],
    }))
    .filter((group) => group.items.length)
  const heroHeadline = site.homepage.heroHeadline || homepage.hero.headline
  const heroIntro = site.homepage.heroIntro || homepage.hero.intro
  const heroImageUrl = site.homepage.heroImageUrl || site.homepage.heroSlides?.[0]?.imageUrl
  const heroImageAlt = site.homepage.heroImageAlt || homepage.hero.imageAlt
  const heroHeadlineSize = site.homepage.heroHeadlineSize || 64
  const primaryCtaLabel = site.homepage.primaryCtaLabel || homepage.hero.primaryCta.label
  const primaryCtaHref = site.homepage.primaryCtaHref || homepage.hero.primaryCta.href
  const missionTitle = site.homepage.missionTitle || homepage.mission.title
  const missionStatement = site.homepage.missionStatement || homepage.mission.statement
  const missionScripture = site.homepage.missionScripture || homepage.mission.scripture
  const heroSlides = (heroImageUrl
    ? [{ id: 'hero', imageUrl: heroImageUrl, alt: heroImageAlt }]
    : []
  ).filter((slide) => Boolean(slide.imageUrl))
  const impactStats = site.homepage.impactStats?.length ? site.homepage.impactStats : homepage.impactStats
  const sectionEnabled = (id: string): boolean => {
    const list = site.homepage.sections
    if (!list?.length) return true
    const found = list.find((s) => s.id === id)
    return found ? found.enabled : true
  }
  const orderedSections = [...(site.homepage.sections?.length ? site.homepage.sections : [
    { id: 'hero', label: 'Hero', enabled: true, order: 1, summary: '' },
    { id: 'newsletterBanner', label: 'Gold banner', enabled: true, order: 2, summary: '' },
    { id: 'legacy', label: 'Legacy', enabled: true, order: 3, summary: '' },
    { id: 'video', label: 'Video', enabled: true, order: 4, summary: '' },
    { id: 'mission', label: 'Mission', enabled: true, order: 5, summary: '' },
    { id: 'methods', label: 'Methods', enabled: true, order: 6, summary: '' },
    { id: 'impact', label: 'Impact', enabled: true, order: 7, summary: '' },
    { id: 'portfolio', label: 'Portfolio', enabled: true, order: 8, summary: '' },
    { id: 'map', label: 'Map', enabled: true, order: 9, summary: '' },
    { id: 'stories', label: 'Stories', enabled: true, order: 10, summary: '' },
    { id: 'events', label: 'Events', enabled: true, order: 11, summary: '' },
    { id: 'newsletter', label: 'Newsletter', enabled: true, order: 12, summary: '' },
    { id: 'donate', label: 'Donate', enabled: true, order: 13, summary: '' },
    { id: 'faith', label: 'Faith', enabled: true, order: 14, summary: '' },
  ])]
    .sort((a, b) => a.order - b.order)
    .filter((section) => section.enabled !== false)
    .filter((section) => !(section.id === 'video' && sectionEnabled('legacy')))

  const fadeUp = reduced
    ? { initial: false as const }
    : { initial: { opacity: 0, y: 24 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 } }

  return (
    <>
      <SEO description={heroIntro} />
      {orderedSections.map((section) => {
        if (isCustomHomeSection(section)) return <CustomHomeSection key={section.id} section={section} />
        if (section.id === 'hero') return (
      <section key="hero" className="relative min-h-[92vh] overflow-hidden" aria-label="Welcome">
        <HeroSlider slides={heroSlides} />
        <div className="relative z-10 mx-auto flex min-h-[92vh] max-w-6xl flex-col justify-end px-4 pb-24 pt-32 md:pb-28">
          <motion.div {...(reduced ? {} : { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8 } })}>
            <h1
              className="max-w-5xl font-display font-bold uppercase leading-[0.95] tracking-wide text-white"
              style={{ fontSize: `clamp(1.85rem, 4.6vw, ${heroHeadlineSize}px)` }}
            >
              {heroHeadline}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/90 md:text-xl">{heroIntro}</p>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <ButtonLink to={primaryCtaHref} size="lg" className="rounded-sm uppercase tracking-[0.22em]">
                {primaryCtaLabel}
              </ButtonLink>
              <Link to={copy.secondaryCtaHref} className="text-sm font-bold uppercase tracking-[0.18em] text-white underline-offset-4 hover:underline">
                {copy.secondaryCtaLabel}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
        )
        if (section.id === 'newsletterBanner') return (
      <section key="newsletterBanner" className="bg-gold py-16 text-teal-deep">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.28em]">{copy.eyebrow}</p>
          <h2 className="mt-3 font-display text-4xl font-bold italic md:text-5xl">{copy.newsletterBannerTitle}</h2>
          <p className="mt-5 text-lg leading-relaxed">{copy.newsletterBannerBody}</p>
          <ButtonLink to="/resources/stories" className="mt-8 rounded-sm bg-teal-deep uppercase tracking-[0.2em] text-white hover:bg-teal-mid">
            {copy.newsletterBannerCta}
          </ButtonLink>
        </div>
      </section>
        )
        if (section.id === 'legacy' || section.id === 'video') return (
      <section key="legacy-video" className="relative overflow-hidden py-24 md:py-32">
        <img src={site.homepage.heroSlides?.[2]?.imageUrl || copy.videoImageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative z-10 mx-auto max-w-5xl px-4 text-center text-white">
          {sectionEnabled('legacy') && (
            <>
              <h2 className="font-display text-4xl font-bold uppercase tracking-wide md:text-6xl">{copy.legacyTitle}</h2>
              <p className="mx-auto mt-8 max-w-3xl text-lg leading-relaxed text-white/90">{copy.legacyBody}</p>
            </>
          )}
          {sectionEnabled('video') && (
            <div className="mx-auto mt-12 max-w-4xl">
              <p className="mb-6 font-display text-xl italic text-gold">{copy.videoDescription}</p>
              <VideoPlayer
                src={homepage.video.videoUrl || copy.videoUrl}
                poster={copy.videoImageUrl}
                title={copy.videoTitle}
                className="relative aspect-video overflow-hidden bg-black shadow-2xl"
              />
            </div>
          )}
        </div>
      </section>
        )
        if (section.id === 'mission') return (
      <section key="mission" className="bg-white py-24">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <motion.div {...fadeUp}>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">{missionTitle}</p>
            <p className="mt-6 font-display text-2xl leading-relaxed text-ink md:text-3xl">{missionStatement}</p>
            <p className="mt-8 text-sm font-semibold uppercase tracking-[0.2em] text-teal-deep">{missionScripture}</p>
          </motion.div>
        </div>
      </section>
        )
        if (section.id === 'methods') return (
      <section key="methods" className="bg-[#f6f3ee] py-24">
        <div className="mx-auto max-w-7xl px-4">
          <p className="text-center text-xs font-bold uppercase tracking-[0.3em] text-gold">{copy.methodsTitle}</p>
          <h2 className="mx-auto mt-4 max-w-3xl text-center font-display text-3xl font-semibold text-teal-deep md:text-5xl">
            {copy.methodsSubtitle}
          </h2>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {homepage.methods.map((method, i) => (
              <motion.div key={method.id} {...fadeUp} className="group relative min-h-[420px] overflow-hidden">
                <img src={methodImages[i] || siteImages.missionField} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />
                <div className="relative z-10 flex h-full min-h-[420px] flex-col justify-end p-8 text-white">
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-gold">{method.title}</p>
                  <h3 className="mt-2 font-display text-3xl">{method.subtitle}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/85">{method.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
        )
        if (section.id === 'impact') return (
      <section key="impact" className="bg-teal-deep py-20 text-white">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">{copy.impactTitle}</p>
          <p className="mx-auto mt-5 max-w-3xl text-lg text-white/85">{copy.impactIntro}</p>
          <div className="mt-12 grid grid-cols-2 gap-10 md:grid-cols-4">
            {impactStats.map((stat) => (
              <div key={stat.id}>
                <p className="font-display text-5xl font-bold text-gold md:text-6xl">{stat.value}</p>
                <p className="mt-3 text-[11px] font-bold uppercase leading-snug tracking-[0.16em]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
        )
        if (section.id === 'portfolio') return (
      <section key="portfolio" className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4">
          <p className="text-center text-xs font-bold uppercase tracking-[0.3em] text-gold">What we do</p>
          <SectionHeading title={copy.portfolioTitle} subtitle={copy.portfolioSubtitle} />
          <div className="grid gap-6 md:grid-cols-2">
            {homepage.portfolio.map((area, i) => (
              <Link key={area.id} to={`/programs/${area.programSlug}`} className="group relative min-h-[280px] overflow-hidden">
                <img src={portfolioImages[i] || siteImages.clinic} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="relative z-10 flex h-full min-h-[280px] flex-col justify-end p-8 text-white">
                  <h3 className="font-display text-3xl group-hover:text-gold">{area.title}</h3>
                  <p className="mt-3 max-w-xl text-sm text-white/85">{area.summary}</p>
                  <span className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-gold">Learn more</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
        )
        if (section.id === 'map') return (
      <section key="map" className="bg-[#f6f3ee] py-24">
        <div className="mx-auto max-w-7xl px-4">
          <p className="text-center text-xs font-bold uppercase tracking-[0.3em] text-gold">Where we serve</p>
          <h2 className="mx-auto mt-4 max-w-3xl text-center font-display text-3xl text-teal-deep md:text-5xl">{copy.mapTitle}</h2>
          <p className="mx-auto mt-5 max-w-3xl text-center text-lg text-ink-muted">{copy.mapSubtitle}</p>
          <div className="mt-12">
            <WorldMap locations={locations ?? []} activeCountry={activeCountry} onSelect={setActiveCountry} />
          </div>
          <div className="mt-8 grid gap-8 sm:grid-cols-2">
            {locationGroups.map((group) => (
              <div key={group.region}>
                <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-gold">{group.region}</h3>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((loc) => (
                    <button
                      key={loc.id}
                      type="button"
                      onClick={() => setActiveCountry(activeCountry === loc.country ? null : loc.country)}
                      className={`rounded-sm px-3 py-2 text-sm font-medium transition-colors ${
                        activeCountry === loc.country ? 'bg-teal-deep text-white' : 'bg-white text-teal-deep hover:bg-teal-deep/10'
                      }`}
                      aria-pressed={activeCountry === loc.country}
                    >
                      {loc.country}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
        )
        if (section.id === 'stories') return (
      <section key="stories" className="bg-white py-24">
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
                  <VideoPlayer src={story.videoUrl} poster={story.imageUrl} title={story.title} className="relative h-72 w-full overflow-hidden bg-black" />
                ) : story.imageUrl ? (
                  <img src={story.imageUrl} alt="" className="h-72 w-full object-cover" />
                ) : null}
                <div className="pt-5">
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-gold">{story.country} · {story.program}</span>
                  <h3 className="mt-2 font-display text-2xl text-teal-deep">{story.title}</h3>
                  <p className="mt-2 text-ink-muted">{story.summary}</p>
                  <Link to="/resources/stories" className="mt-4 inline-block text-xs font-bold uppercase tracking-[0.18em] text-teal-deep hover:text-gold">
                    {story.type === 'video' ? 'Watch full story' : 'Read'}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
        )
        if (section.id === 'events') return featuredEvent ? (
        <section key="events" className="relative overflow-hidden py-20 text-white">
          <img src={siteImages.historicGathering} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/75" />
          <div className="relative z-10 mx-auto max-w-4xl px-4 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-gold">Featured Event</p>
            <h2 className="mt-3 font-display text-4xl font-bold">{featuredEvent.title}</h2>
            <p className="mt-2 text-white/80">{formatDate(featuredEvent.startDate)} · {featuredEvent.location}</p>
            <p className="mt-4 text-white/90">{featuredEvent.summary}</p>
            <ButtonLink to={`/events/${featuredEvent.slug}`} className="mt-6 rounded-sm uppercase tracking-[0.2em]">View Event Details</ButtonLink>
          </div>
        </section>
        ) : null
        if (section.id === 'newsletter') return (
      <section key="newsletter" className="bg-[#f6f3ee] py-20">
        <div className="mx-auto max-w-xl px-4">
          <SectionHeading title={homepage.newsletter.title} subtitle={homepage.newsletter.description} />
          <div className="border border-mist-dark bg-white p-6"><NewsletterForm /></div>
        </div>
      </section>
        )
        if (section.id === 'donate') return (
      <section key="donate" className="relative overflow-hidden py-24 text-white">
        <img src={siteImages.give} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/70" />
        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
          <h2 className="font-display text-4xl uppercase tracking-wide md:text-5xl">{homepage.donateCta.title}</h2>
          <p className="mt-5 text-lg text-white/90">{homepage.donateCta.description}</p>
          <ButtonLink to="/donate" size="lg" className="mt-8 rounded-sm uppercase tracking-[0.22em]">{homepage.donateCta.buttonLabel}</ButtonLink>
        </div>
      </section>
        )
        if (section.id === 'faith') return (
      <section key="faith" className="bg-[#161412] py-20 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-xs font-bold uppercase tracking-[0.32em] text-gold">{copy.faithTitle}</h2>
          <p className="mt-8 font-display text-xl leading-relaxed text-white/90 md:text-2xl">{copy.faithStatement}</p>
          <Link to="/about/beliefs" className="mt-8 inline-block text-xs font-bold uppercase tracking-[0.22em] text-gold hover:text-white">
            Read our beliefs
          </Link>
        </div>
      </section>
        )
        return null
      })}
    </>
  )
}
