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
  }
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
    ctaText: 'Donate',
    ctaLink: '/donate',
    sticky: true,
  },
  footer: {
    backgroundColor: '#0A4D4A',
    textColor: '#ffffff',
    logoUrl: '',
    description: 'Equipping healthcare professionals for Kingdom engagement around the world.',
    copyright: '© Companions of Grace International. All rights reserved.',
    showSocial: true,
  },
  seo: {
    metaTitle: 'Companions of Grace International',
    metaDescription: 'Equipping healthcare professionals for Kingdom engagement through communities of grace.',
    keywords: 'COGI, healthcare mission',
    ogImageUrl: '',
    siteUrl: 'https://coginternational.org',
  },
  headerNav: [],
  footerNav: [],
  homepage: {
    heroHeadline: 'Equipping Healthcare Professionals for Kingdom Engagement',
    heroIntro: 'COGI cultivates communities of grace among healthcare professionals serving missionally around the world.',
    heroImageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1600&q=80',
    heroImageAlt: 'Healthcare professionals collaborating in a clinic',
    heroSlides: [
      { id: 's1', imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1600&q=80', alt: 'Healthcare professionals collaborating in a clinic' },
      { id: 's2', imageUrl: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1600&q=80', alt: 'Medical team serving together' },
      { id: 's3', imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=1600&q=80', alt: 'Community healthcare and care' },
    ],
    primaryCtaLabel: 'Join the Movement',
    primaryCtaHref: '/get-involved',
  },
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
  try {
    const res = await fetch(`/site-config.json?t=${Date.now()}`, { cache: 'no-store' })
    if (!res.ok) return defaults
    const data = (await res.json()) as Partial<SiteConfig>
    return {
      ...defaults,
      ...data,
      theme: { ...defaults.theme, ...data.theme },
      header: { ...defaults.header, ...data.header },
      footer: { ...defaults.footer, ...data.footer },
      seo: { ...defaults.seo, ...data.seo },
      homepage: { ...defaults.homepage, ...data.homepage },
      headerNav: data.headerNav?.length ? data.headerNav : defaults.headerNav,
      footerNav: data.footerNav?.length ? data.footerNav : defaults.footerNav,
    }
  } catch {
    return defaults
  }
}

export { defaults as defaultSiteConfig }
