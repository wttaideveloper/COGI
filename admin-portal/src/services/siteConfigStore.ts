import type { FooterSettings, HeaderSettings, HomepageRecord, HomepageSection, NavItem, SeoSettings, ThemeSettings } from '@/types'
import { mockFooter, mockHeader, mockSeo, mockTheme, mockFooterNavigation } from '@/data/siteSetup'
import { mockHomepage, mockNavigation } from '@/data/mock'

export type SiteConfig = {
  theme: ThemeSettings
  header: HeaderSettings
  footer: FooterSettings
  seo: SeoSettings
  headerNav: NavItem[]
  footerNav: NavItem[]
  homepage: Pick<HomepageRecord, 'heroHeadline' | 'heroIntro' | 'heroImageUrl' | 'heroImageAlt' | 'heroSlides' | 'primaryCtaLabel' | 'primaryCtaHref' | 'missionTitle' | 'missionStatement' | 'missionScripture'> & {
    impactStats?: Array<{ id: string; value: string; label: string; description?: string }>
    sections?: HomepageSection[]
  }
  updatedAt: string
}

const STORAGE_KEY = 'cogi_site_config'

export function defaultSiteConfig(): SiteConfig {
  return {
    theme: { ...mockTheme },
    header: { ...mockHeader, logoUrl: '' },
    footer: { ...mockFooter, logoUrl: '' },
    seo: { ...mockSeo },
    headerNav: structuredClone(mockNavigation[0].items),
    footerNav: structuredClone(mockFooterNavigation.items),
    homepage: {
      heroHeadline: mockHomepage.heroHeadline,
      heroIntro: mockHomepage.heroIntro,
      heroImageUrl: mockHomepage.heroImageUrl,
      heroImageAlt: mockHomepage.heroImageAlt,
      heroSlides: structuredClone(mockHomepage.heroSlides || []),
      primaryCtaLabel: mockHomepage.primaryCtaLabel,
      primaryCtaHref: mockHomepage.primaryCtaHref,
      missionTitle: mockHomepage.missionTitle,
      missionStatement: mockHomepage.missionStatement,
      missionScripture: mockHomepage.missionScripture ?? '',
      impactStats: (mockHomepage.stats || []).map((s) => ({ id: s.label, value: s.value, label: s.label })),
      sections: structuredClone(mockHomepage.sections || []),
    },
    updatedAt: '',
  }
}

export function loadSiteConfig(): SiteConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultSiteConfig()
    return { ...defaultSiteConfig(), ...JSON.parse(raw) }
  } catch {
    return defaultSiteConfig()
  }
}

export async function saveSiteConfig(partial: Partial<SiteConfig>): Promise<SiteConfig> {
  const next: SiteConfig = {
    ...loadSiteConfig(),
    ...partial,
    updatedAt: new Date().toISOString(),
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))

  try {
    await fetch('/__site-config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(next),
    })
  } catch {
    // Public sync endpoint may be unavailable outside vite dev — localStorage still holds admin copy.
  }

  return next
}

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}
