import type { FooterSettings, HeaderSettings, HomepageRecord, HomepageSection, NavItem, SeoSettings, ThemeSettings } from '@/types'
import { mockFooter, mockHeader, mockSeo, mockTheme, mockFooterNavigation } from '@/data/siteSetup'
import { mockHomepage, mockNavigation } from '@/data/mock'
import { ensureBuiltinSections } from '@/data/homepageBlocks'
import { defaultSiteCopy, mergeSiteCopy, type SiteCopy } from '@/data/siteCopy'
import { apiPublishSingle, apiSingle, apiUpdateSingle, getStrapiUrl, isDemoMode, uploadMedia } from '@/services/strapi'

export type SiteConfig = {
  theme: ThemeSettings
  header: HeaderSettings
  footer: FooterSettings
  seo: SeoSettings
  headerNav: NavItem[]
  footerNav: NavItem[]
  homepage: Pick<HomepageRecord, 'heroHeadline' | 'heroIntro' | 'heroHeadlineSize' | 'heroImageUrl' | 'heroImageAlt' | 'heroSlides' | 'primaryCtaLabel' | 'primaryCtaHref' | 'missionTitle' | 'missionStatement' | 'missionScripture'> & {
    impactStats?: Array<{ id: string; value: string; label: string; description?: string }>
    sections?: HomepageSection[]
  }
  copy: SiteCopy
  updatedAt: string
}

const STORAGE_KEY = 'cogi_site_config'
const PUBLISH_CHANNEL = 'cogi-cms-publish'

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
      heroHeadlineSize: mockHomepage.heroHeadlineSize ?? 64,
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
    copy: structuredClone(defaultSiteCopy),
    updatedAt: '',
  }
}

function mergeConfig(partial: Partial<SiteConfig>): SiteConfig {
  const base = defaultSiteConfig()
  return {
    ...base,
    ...partial,
    theme: { ...base.theme, ...partial.theme },
    header: { ...base.header, ...partial.header },
    footer: { ...base.footer, ...partial.footer },
    seo: { ...base.seo, ...partial.seo },
    homepage: {
      ...base.homepage,
      ...partial.homepage,
      sections: ensureBuiltinSections(partial.homepage?.sections ?? base.homepage.sections),
    },
    headerNav: partial.headerNav?.length ? partial.headerNav : base.headerNav,
    footerNav: partial.footerNav?.length ? partial.footerNav : base.footerNav,
    copy: mergeSiteCopy(partial.copy),
    updatedAt: partial.updatedAt || base.updatedAt,
  }
}

export function loadSiteConfig(): SiteConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultSiteConfig()
    return mergeConfig(JSON.parse(raw) as Partial<SiteConfig>)
  } catch {
    return defaultSiteConfig()
  }
}

export function notifyPublished() {
  try {
    const channel = new BroadcastChannel(PUBLISH_CHANNEL)
    channel.postMessage({ type: 'published', at: Date.now() })
    channel.close()
  } catch {
    // BroadcastChannel is unavailable in some browsers; localStorage still notifies same-origin tabs.
  }
  localStorage.setItem('cogi_cms_published_at', String(Date.now()))
}

async function writePublicFile(config: SiteConfig) {
  try {
    await fetch('/__site-config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    })
  } catch {
    // Public sync endpoint may be unavailable outside vite dev — Strapi remains the source of truth.
  }
}

function dataUrlToFile(dataUrl: string, filename: string): File {
  const [meta, encoded] = dataUrl.split(',')
  const mime = /data:(.*?);/.exec(meta)?.[1] || 'image/png'
  const binary = atob(encoded || '')
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i)
  return new File([bytes], filename, { type: mime })
}

export async function ensureRemoteUrl(value: string, alt = 'Uploaded image'): Promise<string> {
  if (!value?.startsWith('data:')) return value
  if (isDemoMode()) return value
  const ext = value.startsWith('data:image/png') ? 'png' : value.startsWith('data:image/svg') ? 'svg' : 'jpg'
  const uploaded = await uploadMedia(dataUrlToFile(value, `${alt}.${ext}`), alt)
  return uploaded.url?.startsWith('http') ? uploaded.url : `${getStrapiUrl()}${uploaded.url}`
}

async function prepareConfigForStrapi(config: SiteConfig): Promise<SiteConfig> {
  const next = structuredClone(config)
  next.header.logoUrl = await ensureRemoteUrl(next.header.logoUrl, next.header.logoAlt || 'Header logo')
  next.footer.logoUrl = await ensureRemoteUrl(next.footer.logoUrl, 'Footer logo')
  if (next.homepage.heroImageUrl) {
    next.homepage.heroImageUrl = await ensureRemoteUrl(next.homepage.heroImageUrl, next.homepage.heroImageAlt || 'Hero image')
  }
  if (next.homepage.heroSlides?.length) {
    next.homepage.heroSlides = await Promise.all(
      next.homepage.heroSlides.map(async (slide, index) => ({
        ...slide,
        imageUrl: await ensureRemoteUrl(slide.imageUrl, slide.alt || `Hero slide ${index + 1}`),
      })),
    )
  }
  if (next.homepage.sections?.length) {
    next.homepage.sections = await Promise.all(
      next.homepage.sections.map(async (section) => ({
        ...section,
        imageUrl: section.imageUrl
          ? await ensureRemoteUrl(section.imageUrl, section.imageAlt || section.label || 'Homepage section image')
          : section.imageUrl,
      })),
    )
  }
  return next
}

async function persistSiteConfigToStrapi(config: SiteConfig, status: 'draft' | 'published') {
  if (isDemoMode()) return
  await apiUpdateSingle('/site-config', { payload: config }, 'draft')
  if (status === 'published') await apiPublishSingle('/site-config')
}

export async function hydrateSiteConfigFromStrapi(): Promise<SiteConfig> {
  const local = loadSiteConfig()
  if (isDemoMode()) return local
  try {
    const record = await apiSingle<{ payload?: Partial<SiteConfig> }>('/site-config', { status: 'draft' })
    if (record?.payload && typeof record.payload === 'object') {
      const merged = mergeConfig(record.payload)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
      return merged
    }
  } catch {
    try {
      const record = await apiSingle<{ payload?: Partial<SiteConfig> }>('/site-config')
      if (record?.payload && typeof record.payload === 'object') {
        const merged = mergeConfig(record.payload)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
        return merged
      }
    } catch {
      // Strapi may be offline — keep the local draft.
    }
  }
  return local
}

export async function saveSiteConfig(partial: Partial<SiteConfig>, status: 'draft' | 'published' = 'draft'): Promise<SiteConfig> {
  let next = mergeConfig({
    ...loadSiteConfig(),
    ...partial,
    updatedAt: new Date().toISOString(),
  })

  if (status === 'published' && !isDemoMode()) {
    next = await prepareConfigForStrapi(next)
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))

  if (status === 'published') {
    await writePublicFile(next)
  }

  await persistSiteConfigToStrapi(next, status)

  if (status === 'published') notifyPublished()

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
