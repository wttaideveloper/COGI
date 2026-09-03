import { fetchFromStrapi } from '@/services/strapi'
import { defaultSiteCopy, mergeSiteCopy, siteImages, siteVideos, type SiteCopy } from '@/data/siteCopy'

export type { SiteCopy }
export { siteImages }

export type SiteNavItem = {
  id: string
  label: string
  href: string
  visible?: boolean
  children?: SiteNavItem[]
}

export type PublicCustomPage = {
  id: string
  title: string
  slug: string
  status?: string
  pageType?: 'content' | 'link'
  summary?: string
  heroImageUrl?: string
  externalUrl?: string
  showInHeader?: boolean
  showInFooter?: boolean
  seo?: { metaTitle?: string; metaDescription?: string; keywords?: string }
  sections?: Array<{ id: string; type: string; title: string; content: string; imageUrl?: string; buttonLabel?: string; buttonHref?: string }>
}

export type SiteConfig = {
  theme: {
    primaryColor: string
    secondaryColor: string
    backgroundColor: string
    textColor: string
    accentColor: string
    buttonHoverColor: string
    fontFamily: string
    headingFontFamily: string
  }
  header: {
    backgroundColor: string
    textColor: string
    logoUrl: string
    logoAlt: string
    logoHeight?: number
    ctaText: string
    ctaLink: string
    sticky: boolean
  }
  footer: {
    backgroundColor: string
    textColor: string
    logoUrl: string
    logoHeight?: number
    description: string
    copyright: string
    showSocial: boolean
    facebookUrl?: string
    instagramUrl?: string
    youtubeUrl?: string
    linkedinUrl?: string
    whatsappUrl?: string
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
  customPages: PublicCustomPage[]
  homepage: {
    heroHeadline: string
    heroIntro: string
    heroHeadlineSize?: number
    heroHeadlineCase?: 'as-typed' | 'uppercase' | 'lowercase'
    heroMedia?: 'video' | 'images'
    heroVideoUrl?: string
    heroImageUrl?: string
    heroImageAlt?: string
    heroSlideDuration?: number
    mapOceanColor?: string
    mapLandColor?: string
    mapPinColor?: string
    mapActiveColor?: string
    heroSlides?: Array<{ id: string; imageUrl: string; alt?: string }>
    primaryCtaLabel: string
    primaryCtaHref: string
    missionTitle?: string
    missionStatement?: string
    missionScripture?: string
    impactStats?: Array<{ id: string; value: string; label: string; description?: string }>
    sections?: Array<{
      id: string
      label: string
      enabled: boolean
      order: number
      summary: string
      kind?: 'built-in' | 'text' | 'split' | 'cta' | 'quote' | 'banner' | 'image'
      title?: string
      content?: string
      imageUrl?: string
      imageAlt?: string
      imageSide?: 'left' | 'right'
      buttonLabel?: string
      buttonHref?: string
      eyebrow?: string
    }>
  }
  copy: SiteCopy
  updatedAt?: string
}

const defaults: SiteConfig = {
  theme: {
    primaryColor: '#1F2937',
    secondaryColor: '#4B5563',
    backgroundColor: '#FFFFFF',
    textColor: '#1F2937',
    accentColor: '#5B8FB5',
    buttonHoverColor: '#4A7FA3',
    fontFamily: 'Plus Jakarta Sans, system-ui, sans-serif',
    headingFontFamily: 'Cormorant Garamond, Georgia, serif',
  },
  header: {
    backgroundColor: '#FFFFFF',
    textColor: '#1F2937',
    logoUrl: '/images/cogi-logo.png',
    logoAlt: 'Companions of Grace International',
    logoHeight: 64,
    ctaText: 'Give now',
    ctaLink: '/donate',
    sticky: true,
  },
  footer: {
    backgroundColor: '#ffffff',
    textColor: '#1A2332',
    logoUrl: '/images/cogi-logo.png',
    logoHeight: 48,
    description: 'Equipping healthcare professionals for Kingdom engagement through training, community, and mission.',
    copyright: '© Companions of Grace International. All rights reserved.',
    showSocial: true,
    linkedinUrl: 'https://linkedin.com/company/coginternational',
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
  customPages: [],
  homepage: {
    heroHeadline: 'Equipping Healthcare Professionals for Kingdom Engagement',
    heroIntro:
      'We are a global fellowship of Christ-followers cultivating Communities of Grace in healthcare by accompanying individuals and communities to develop a Kingdom perspective that shapes life, vocation, and service. In a rapidly changing global context, Companions of Grace seek to envision, empower, and engage healthcare professionals and communities in creative mission engagement, cultivating thriving Kingdom communities.',
    heroHeadlineSize: 64,
    heroHeadlineCase: 'uppercase' as const,
    heroMedia: 'video' as const,
    heroVideoUrl: siteVideos.intro,
    heroImageUrl: siteImages.heroCrowd,
    heroImageAlt: 'Healthcare professionals gathered in worship and mission',
    heroSlideDuration: 6,
    mapOceanColor: '#0B1016',
    mapLandColor: '#3A4A5C',
    mapPinColor: '#5BA8E0',
    mapActiveColor: '#2E7CB5',
    heroSlides: [
      { id: 'hero', imageUrl: siteImages.heroCrowd, alt: 'Healthcare professionals gathered in worship and mission' },
    ],
    primaryCtaLabel: 'Give now',
    primaryCtaHref: '/donate',
    missionTitle: 'Our Mission',
    missionStatement:
      'Our mission is to inspire and enable the global Christian healthcare community to be transformed so they think, live and work missionally and thrive in their calling to serve. We equip them to provide whole-person care, demonstrate God\'s love, and offer hope, healing, and wholeness through Jesus Christ.',
    missionScripture: 'Colossians 3:17  ·  Romans 12:2',
    impactStats: [
      { id: 'patients', value: '1,000+', label: 'Patients served through partners' },
      { id: 'volunteers', value: '200+', label: 'Volunteers & facilitators mobilized' },
      { id: 'countries', value: '10+', label: 'Countries engaged' },
      { id: 'professionals', value: '500+', label: 'Healthcare professionals equipped' },
    ],
    sections: [
      { id: 'hero', label: 'Hero', enabled: true, order: 1, summary: 'Primary homepage introduction and call to action.' },
      { id: 'newsletterBanner', label: 'Newsletter banner', enabled: true, order: 2, summary: 'Lead story / newsletter callout.' },
      { id: 'legacy', label: 'Legacy', enabled: true, order: 3, summary: 'Strong legacy, bold future.' },
      { id: 'mission', label: 'Mission', enabled: true, order: 4, summary: 'Mission statement and scripture.' },
      { id: 'video', label: 'Video', enabled: true, order: 5, summary: 'Introduction video / photo.' },
      {
        id: 'splitPrograms',
        label: 'Programs',
        enabled: true,
        order: 6,
        summary: 'Photo on one side, text on the other',
        kind: 'built-in',
        title: 'Programs',
        content: 'Training, formation, and Kingdom of God seminars that help healthcare professionals think, live, and work missionally — in clinics, hospitals, and communities around the world.',
        imageUrl: '/images/cogi-train.png',
        imageAlt: 'Healthcare professionals in training',
        imageSide: 'right',
        buttonLabel: 'Learn more',
        buttonHref: '/programs',
      },
      {
        id: 'splitStories',
        label: 'Stories',
        enabled: true,
        order: 7,
        summary: 'Photo on one side, text on the other',
        kind: 'built-in',
        title: 'Stories of transformation',
        content: 'From the bedside to the mission field, Companions of Grace walk with healthcare workers whose ordinary work is becoming extraordinary witness. Watch and read how communities of grace are taking shape.',
        imageUrl: '/images/cogi-kenya.png',
        imageAlt: 'Healthcare workers serving a community',
        imageSide: 'left',
        buttonLabel: 'See stories',
        buttonHref: '/resources/stories',
      },
      { id: 'methods', label: 'Methods', enabled: true, order: 8, summary: 'Enable, train, and support.' },
      { id: 'impact', label: 'Impact Stats', enabled: true, order: 9, summary: 'Countries, professionals, programs.' },
      { id: 'portfolio', label: 'Portfolio', enabled: true, order: 10, summary: 'Four ministry areas.' },
      { id: 'map', label: 'Where We Serve', enabled: true, order: 11, summary: 'Countries served.' },
      { id: 'stories', label: 'Featured Stories', enabled: true, order: 12, summary: 'Featured story teasers.' },
      { id: 'testimonials', label: 'Testimonials', enabled: true, order: 13, summary: 'Rotating quotes and clips.' },
      { id: 'events', label: 'Featured Event', enabled: true, order: 14, summary: 'Upcoming featured event.' },
      { id: 'newsletter', label: 'Newsletter', enabled: true, order: 15, summary: 'Newsletter signup.' },
      { id: 'donate', label: 'Donate CTA', enabled: true, order: 16, summary: 'Donate call to action.' },
      { id: 'faith', label: 'Statement of faith', enabled: true, order: 17, summary: 'Closing faith statement.' },
    ],
  },
  copy: defaultSiteCopy,
}

export function applyTheme(theme: SiteConfig['theme'], chrome?: Pick<SiteConfig, 'header' | 'footer'>) {
  const root = document.documentElement
  root.style.setProperty('--color-teal-deep', theme.primaryColor)
  root.style.setProperty('--color-teal-mid', theme.secondaryColor)
  root.style.setProperty('--color-teal-light', theme.buttonHoverColor || theme.accentColor)
  root.style.setProperty('--color-gold', theme.accentColor)
  root.style.setProperty('--color-gold-light', theme.buttonHoverColor || theme.accentColor)
  root.style.setProperty('--color-mist', theme.backgroundColor || '#ffffff')
  root.style.setProperty('--color-mist-dark', '#e8eef3')
  root.style.setProperty('--color-ink', theme.textColor)
  root.style.setProperty('--color-ink-muted', '#5a6a80')
  root.style.setProperty('--font-body', theme.fontFamily)
  root.style.setProperty('--font-display', theme.headingFontFamily)
  if (chrome?.header?.logoHeight) {
    root.style.setProperty('--header-logo-height', `${chrome.header.logoHeight}px`)
  }
  if (chrome?.footer?.logoHeight) {
    root.style.setProperty('--footer-logo-height', `${chrome.footer.logoHeight}px`)
  }
  document.body.style.backgroundColor = theme.backgroundColor
  document.body.style.color = theme.textColor
  document.body.style.fontFamily = theme.fontFamily
}

function isPlaceholderHeroVideo(url?: string) {
  if (!url) return true
  return url.includes('sGKtc3lI_Pg') || url === '/videos/intro.mp4' || url.includes('images.unsplash.com')
}

async function fetchSiteConfigFile(): Promise<Partial<SiteConfig> | null> {
  try {
    const res = await fetch(`/site-config.json?t=${Date.now()}`, { cache: 'no-store' })
    if (!res.ok) return null
    const data = (await res.json()) as Partial<SiteConfig>
    return data && typeof data === 'object' ? data : null
  } catch {
    return null
  }
}

export async function fetchSiteConfig(): Promise<SiteConfig> {
  const [fromStrapi, fromFile] = await Promise.all([
    fetchSiteConfigFromStrapi(),
    fetchSiteConfigFile(),
  ])
  if (fromStrapi && fromFile) {
    const fileWins = isNewer(fromFile.updatedAt, fromStrapi.updatedAt)
    const primary = fileWins ? fromFile : fromStrapi
    const secondary = fileWins ? fromStrapi : fromFile
    const merged = mergeSiteConfig({
      ...secondary,
      ...primary,
      homepage: { ...(secondary.homepage || {}), ...(primary.homepage || {}) } as SiteConfig['homepage'],
      copy: { ...(secondary.copy || {}), ...(primary.copy || {}) } as SiteCopy,
      headerNav: primary.headerNav?.length ? primary.headerNav : secondary.headerNav,
      footerNav: primary.footerNav?.length ? primary.footerNav : secondary.footerNav,
      customPages: mergeCustomPages(
        fileWins ? fromFile.customPages : fromStrapi.customPages,
        fileWins ? fromStrapi.customPages : fromFile.customPages,
      ),
    })
    const slides = merged.homepage.heroSlides || []
    const unsplashOnly = slides.length > 0 && slides.every((slide) => slide.imageUrl?.includes('images.unsplash.com'))
    if (isPlaceholderHeroVideo(merged.homepage.heroVideoUrl) || unsplashOnly) {
      merged.homepage.heroVideoUrl = siteVideos.intro
      if (unsplashOnly || merged.homepage.heroMedia !== 'images') merged.homepage.heroMedia = 'video'
    }
    return merged
  }
  if (fromStrapi) return fromStrapi
  if (fromFile) return mergeSiteConfig(fromFile)
  return defaults
}

function pageSlug(value?: string) {
  return String(value || '').replace(/^\/+/, '').replace(/\/+$/, '')
}

function mergeCustomPages(primary?: PublicCustomPage[], secondary?: PublicCustomPage[]) {
  const map = new Map<string, PublicCustomPage>()
  for (const page of [...(secondary || []), ...(primary || [])]) {
    const slug = pageSlug(page?.slug)
    if (!slug) continue
    map.set(slug, { ...page, slug })
  }
  return [...map.values()]
}

function isNewer(a?: string, b?: string) {
  return (Date.parse(a || '') || 0) >= (Date.parse(b || '') || 0)
}

function mergeHomeSections(
  incoming?: SiteConfig['homepage']['sections'],
): NonNullable<SiteConfig['homepage']['sections']> {
  const current = Array.isArray(incoming) ? incoming : []
  const byId = new Map(current.map((section) => [section.id, section]))
  const defaultsList = defaults.homepage.sections || []
  const restored = defaultsList.map((builtin) => {
    const existing = byId.get(builtin.id)
    return existing ? { ...builtin, ...existing, id: builtin.id } : { ...builtin }
  })
  const customs = current.filter((section) => !defaultsList.some((item) => item.id === section.id))
  return [...restored, ...customs].map((section, index) => ({ ...section, order: index + 1 }))
}

function mergeSiteConfig(data: Partial<SiteConfig>): SiteConfig {
  const homepage = {
    ...defaults.homepage,
    ...data.homepage,
    sections: mergeHomeSections(data.homepage?.sections ?? defaults.homepage.sections),
  }
  if (!homepage.heroVideoUrl || homepage.heroVideoUrl.includes('sGKtc3lI_Pg')) {
    homepage.heroVideoUrl = siteVideos.intro
  }
  const copy = mergeSiteCopy(data.copy)
  if (copy.homepage.videoUrl === '/videos/intro.mp4') {
    copy.homepage.videoUrl = siteVideos.intro
  }
  return {
    ...defaults,
    ...data,
    theme: { ...defaults.theme, ...data.theme },
    header: { ...defaults.header, ...data.header },
    footer: { ...defaults.footer, ...data.footer },
    seo: { ...defaults.seo, ...data.seo },
    homepage,
    copy,
    headerNav: data.headerNav?.length ? data.headerNav : defaults.headerNav,
    footerNav: data.footerNav?.length ? data.footerNav : defaults.footerNav,
    customPages: mergeCustomPages(data.customPages, defaults.customPages),
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
