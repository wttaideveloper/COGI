import { fetchFromStrapi } from '@/services/strapi'
import { defaultSiteCopy, mergeSiteCopy, siteImages, type SiteCopy } from '@/data/siteCopy'

export type { SiteCopy }
export { siteImages }

export type SiteNavItem = {
  id: string
  label: string
  href: string
  visible?: boolean
  children?: SiteNavItem[]
}

export type SiteConfig = {
  theme: {
    primaryColor: string
    secondaryColor: string
    backgroundColor: string
    textColor: string
    accentColor: string
    fontFamily: string
    headingFontFamily: string
  }
  header: {
    backgroundColor: string
    textColor: string
    logoUrl: string
    logoAlt: string
    ctaText: string
    ctaLink: string
    sticky: boolean
  }
  footer: {
    backgroundColor: string
    textColor: string
    logoUrl: string
    description: string
    copyright: string
    showSocial: boolean
    facebookUrl?: string
    instagramUrl?: string
    youtubeUrl?: string
  }
  seo: {
    metaTitle: string
    metaDescription: string
    keywords: string
    ogImageUrl: string
    siteUrl: string
  }
  headerNav: SiteNavItem[]
  footerNav: SiteNavItem[]
  homepage: {
    heroHeadline: string
    heroIntro: string
    heroImageUrl?: string
    heroImageAlt?: string
    heroSlides?: Array<{ id: string; imageUrl: string; alt?: string }>
    primaryCtaLabel: string
    primaryCtaHref: string
    missionTitle?: string
    missionStatement?: string
    missionScripture?: string
    impactStats?: Array<{ id: string; value: string; label: string; description?: string }>
    sections?: Array<{ id: string; label: string; enabled: boolean; order: number; summary: string }>
  }
  copy: SiteCopy
  updatedAt?: string
}

const defaults: SiteConfig = {
  theme: {
    primaryColor: '#0A4D4A',
    secondaryColor: '#083B39',
    backgroundColor: '#F4F8F7',
    textColor: '#1A2E2D',
    accentColor: '#C9A227',
    fontFamily: 'Plus Jakarta Sans, system-ui, sans-serif',
    headingFontFamily: 'Cormorant Garamond, Georgia, serif',
  },
  header: {
    backgroundColor: '#ffffff',
    textColor: '#1A2E2D',
    logoUrl: '',
    logoAlt: 'Companions of Grace International',
    ctaText: 'Give now',
    ctaLink: '/donate',
    sticky: true,
  },
  footer: {
    backgroundColor: '#161412',
    textColor: '#ffffff',
    logoUrl: '',
    description: 'Equipping healthcare professionals for Kingdom engagement through training, community, and mission.',
    copyright: '© Companions of Grace International. All rights reserved.',
    showSocial: true,
  },
  seo: {
    metaTitle: 'COGI – Companions of Grace International',
    metaDescription:
      'Equipping healthcare professionals for Kingdom engagement through training, community, and missional healthcare programs worldwide.',
    keywords: 'COGI, Companions of Grace, healthcare missions, missional healthcare, Christian healthcare',
    ogImageUrl: siteImages.heroCrowd,
    siteUrl: 'https://coginternational.org',
  },
  headerNav: [],
  footerNav: [],
  homepage: {
    heroHeadline: 'Equipping Healthcare Professionals for Kingdom Engagement',
    heroIntro:
      'We are a global fellowship of Christ-followers cultivating Communities of Grace in healthcare by accompanying individuals and communities to develop a Kingdom perspective that shapes life, vocation, and service. In a rapidly changing global context, Companions of Grace seek to envision, empower, and engage healthcare professionals and communities in creative mission engagement, cultivating thriving Kingdom communities.',
    heroImageUrl: siteImages.heroCrowd,
    heroImageAlt: 'Healthcare professionals gathered in worship and mission',
    heroSlides: [
      { id: 's1', imageUrl: siteImages.heroCrowd, alt: 'A global gathering of believers on mission' },
      { id: 's2', imageUrl: siteImages.heroHands, alt: 'Hands joined in prayer and partnership' },
      { id: 's3', imageUrl: siteImages.kenya, alt: 'Ministry and training in East Africa' },
      { id: 's4', imageUrl: siteImages.historicGathering, alt: 'A historic gathering of the fellowship' },
    ],
    primaryCtaLabel: 'Give now',
    primaryCtaHref: '/donate',
    missionTitle: 'Our Mission',
    missionStatement:
      'Our mission is to inspire and enable the global Christian healthcare community to be transformed so they think, live and work missionally and thrive in their calling to serve. We equip them to provide whole-person care, demonstrate God\'s love, and offer hope, healing, and wholeness through Jesus Christ.',
    missionScripture: 'Colossians 3:17  ·  Romans 12:2',
    impactStats: [
      { id: 'countries', value: '10+', label: 'Countries engaged' },
      { id: 'professionals', value: '500+', label: 'Healthcare professionals equipped' },
      { id: 'programs', value: '30+', label: 'Programs, workshops & formation experiences' },
      { id: 'communities', value: '∞', label: 'Growing Communities of Grace' },
    ],
    sections: [
      { id: 'hero', label: 'Hero', enabled: true, order: 1, summary: 'Primary homepage introduction and call to action.' },
      { id: 'newsletterBanner', label: 'Newsletter banner', enabled: true, order: 2, summary: 'Lead story / newsletter callout.' },
      { id: 'legacy', label: 'Legacy', enabled: true, order: 3, summary: 'Strong legacy, bold future.' },
      { id: 'mission', label: 'Mission', enabled: true, order: 4, summary: 'Mission statement and scripture.' },
      { id: 'video', label: 'Video', enabled: true, order: 5, summary: 'Introduction video / photo.' },
      { id: 'methods', label: 'Methods', enabled: true, order: 6, summary: 'Enable, train, and support.' },
      { id: 'impact', label: 'Impact Stats', enabled: true, order: 7, summary: 'Countries, professionals, programs.' },
      { id: 'portfolio', label: 'Portfolio', enabled: true, order: 8, summary: 'Four ministry areas.' },
      { id: 'map', label: 'Where We Serve', enabled: true, order: 9, summary: 'Countries served.' },
      { id: 'stories', label: 'Featured Stories', enabled: true, order: 10, summary: 'Featured story teasers.' },
      { id: 'events', label: 'Featured Event', enabled: true, order: 11, summary: 'Upcoming featured event.' },
      { id: 'newsletter', label: 'Newsletter', enabled: true, order: 12, summary: 'Newsletter signup.' },
      { id: 'donate', label: 'Donate CTA', enabled: true, order: 13, summary: 'Donate call to action.' },
      { id: 'faith', label: 'Statement of faith', enabled: true, order: 14, summary: 'Closing faith statement.' },
    ],
  },
  copy: defaultSiteCopy,
}

export function applyTheme(theme: SiteConfig['theme']) {
  const root = document.documentElement
  root.style.setProperty('--color-teal-deep', theme.primaryColor)
  root.style.setProperty('--color-teal-mid', theme.secondaryColor)
  root.style.setProperty('--color-gold', theme.accentColor)
  root.style.setProperty('--color-mist', theme.backgroundColor)
  root.style.setProperty('--color-ink', theme.textColor)
  root.style.setProperty('--font-body', theme.fontFamily)
  root.style.setProperty('--font-display', theme.headingFontFamily)
  document.body.style.backgroundColor = theme.backgroundColor
  document.body.style.color = theme.textColor
  document.body.style.fontFamily = theme.fontFamily
}

export async function fetchSiteConfig(): Promise<SiteConfig> {
  const fromStrapi = await fetchSiteConfigFromStrapi()
  if (fromStrapi) return fromStrapi
  try {
    const res = await fetch(`/site-config.json?t=${Date.now()}`, { cache: 'no-store' })
    if (!res.ok) return defaults
    const data = (await res.json()) as Partial<SiteConfig>
    return mergeSiteConfig(data)
  } catch {
    return defaults
  }
}

function mergeSiteConfig(data: Partial<SiteConfig>): SiteConfig {
  return {
    ...defaults,
    ...data,
    theme: { ...defaults.theme, ...data.theme },
    header: { ...defaults.header, ...data.header },
    footer: { ...defaults.footer, ...data.footer },
    seo: { ...defaults.seo, ...data.seo },
    homepage: { ...defaults.homepage, ...data.homepage },
    copy: mergeSiteCopy(data.copy),
    headerNav: data.headerNav?.length ? data.headerNav : defaults.headerNav,
    footerNav: data.footerNav?.length ? data.footerNav : defaults.footerNav,
  }
}

async function fetchSiteConfigFromStrapi(): Promise<SiteConfig | null> {
  const data = await fetchFromStrapi<{ data?: Record<string, unknown> | null }>('/site-config')
  const raw = data?.data
  if (!raw || typeof raw !== 'object') return null
  const attrs = (raw.attributes && typeof raw.attributes === 'object' ? raw.attributes : raw) as Record<string, unknown>
  const payload = attrs.payload as Partial<SiteConfig> | undefined
  if (!payload || typeof payload !== 'object') return null
  if (!payload.theme && !payload.homepage && !payload.header) return null
  return mergeSiteConfig(payload)
}

export { defaults as defaultSiteConfig }
