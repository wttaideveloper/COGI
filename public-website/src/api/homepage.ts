import { fetchFromStrapi } from '@/services/strapi'
import { fallbackHomepage } from '@/data/fallback'
import type { Homepage } from '@/types'

function mapHomepage(raw: Record<string, unknown>): Homepage {
  const attrs = (raw.attributes ?? raw) as Record<string, unknown>
  return {
    ...raw,
    hero: {
      headline: (attrs.heroHeadline as string) ?? fallbackHomepage.hero.headline,
      subheadline: (attrs.heroSubheadline as string) ?? fallbackHomepage.hero.subheadline,
      intro: (attrs.heroIntro as string) ?? fallbackHomepage.hero.intro,
      primaryCta: {
        label: (attrs.heroCtaLabel as string) ?? fallbackHomepage.hero.primaryCta.label,
        href: (attrs.heroCtaHref as string) ?? fallbackHomepage.hero.primaryCta.href,
      },
      secondaryCta: {
        label: (attrs.heroSecondaryCtaLabel as string) ?? fallbackHomepage.hero.secondaryCta.label,
        href: (attrs.heroSecondaryCtaHref as string) ?? fallbackHomepage.hero.secondaryCta.href,
      },
      imageAlt: (attrs.heroImageAlt as string) ?? fallbackHomepage.hero.imageAlt,
    },
    mission: {
      title: (attrs.missionHeading as string) ?? fallbackHomepage.mission.title,
      statement: (attrs.missionText as string) ?? fallbackHomepage.mission.statement,
      scripture: (attrs.missionScripture as string) ?? fallbackHomepage.mission.scripture,
    },
    video: {
      title: (attrs.videoHeading as string) ?? fallbackHomepage.video.title,
      description: (attrs.videoDescription as string) ?? fallbackHomepage.video.description,
      thumbnailAlt: (attrs.videoThumbnailAlt as string) ?? fallbackHomepage.video.thumbnailAlt,
      videoUrl: (attrs.videoUrl as string) ?? fallbackHomepage.video.videoUrl,
    },
    methods: (attrs.methods as Homepage['methods']) ?? fallbackHomepage.methods,
    impactStats: (attrs.impactStats as Homepage['impactStats']) ?? fallbackHomepage.impactStats,
    portfolio: (attrs.portfolioAreas as Homepage['portfolio']) ?? fallbackHomepage.portfolio,
    storiesTeaser: {
      title: (attrs.storiesIntroTitle as string) ?? fallbackHomepage.storiesTeaser.title,
      description: (attrs.storiesIntroDescription as string) ?? fallbackHomepage.storiesTeaser.description,
      featuredStoryIds: (attrs.featuredStoryIds as string[]) ?? fallbackHomepage.storiesTeaser.featuredStoryIds,
    },
    featuredEventId: attrs.featuredEventId as string | undefined,
    donateCta: {
      title: (attrs.donateCtaTitle as string) ?? fallbackHomepage.donateCta.title,
      description: (attrs.donateCtaDescription as string) ?? fallbackHomepage.donateCta.description,
      buttonLabel: (attrs.donateCtaButtonLabel as string) ?? fallbackHomepage.donateCta.buttonLabel,
    },
    newsletter: {
      title: (attrs.newsletterTitle as string) ?? fallbackHomepage.newsletter.title,
      description: (attrs.newsletterDescription as string) ?? fallbackHomepage.newsletter.description,
    },
  }
}

export async function getHomepage(): Promise<Homepage> {
  const data = await fetchFromStrapi<{ data: Record<string, unknown> }>('/homepage', {
    populate: '*',
  })
  if (!data?.data) return fallbackHomepage
  return mapHomepage(data.data)
}
