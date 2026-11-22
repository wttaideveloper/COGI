import type { CustomPagePublic, FooterSettings, HeaderSettings, HomepageRecord, HomepageSection, NavItem, SeoSettings, ThemeSettings } from '@/types'
import { mockFooter, mockHeader, mockSeo, mockTheme, mockFooterNavigation } from '@/data/siteSetup'
import { mockHomepage, mockNavigation } from '@/data/mock'
import { ensureBuiltinSections } from '@/data/homepageBlocks'
import { defaultSiteCopy, mergeSiteCopy, type SiteCopy } from '@/data/siteCopy'
import { apiPublishSingle, apiSingle, apiUpdateSingle, getJwt, getStrapiUrl, isDemoMode, uploadMedia } from '@/services/strapi'

export type SiteConfig = {
  contentSource?: 'strapi' | 'snapshot'
  legalPages?: Array<{ slug: string; title: string; content: string; lastUpdated: string }>
  content?: Record<string, Record<string, unknown>[]>
  globalSettings?: Record<string, unknown>
  theme: ThemeSettings
  header: HeaderSettings
  footer: FooterSettings
  seo: SeoSettings
  headerNav: NavItem[]
  footerNav: NavItem[]
  customPages: CustomPagePublic[]
  homepage: Pick<HomepageRecord, 'heroHeadline' | 'heroIntro' | 'heroHeadlineSize' | 'heroHeadlineCase' | 'heroMedia' | 'heroVideoUrl' | 'heroImageUrl' | 'heroImageAlt' | 'heroSlideDuration' | 'heroSlides' | 'primaryCtaLabel' | 'primaryCtaHref' | 'missionTitle' | 'missionStatement' | 'missionScripture' | 'mapOceanColor' | 'mapLandColor' | 'mapPinColor' | 'mapActiveColor'> & {
    impactStats?: Array<{ id: string; value: string; label: string; description?: string }>
    sections?: HomepageSection[]
  }
  copy: SiteCopy
  updatedAt: string
}

const STORAGE_KEY = 'cogi_site_config'
const PUBLISHED_KEY = 'cogi_site_config_published'
const PUBLISH_CHANNEL = 'cogi-cms-publish'

export function defaultSiteConfig(): SiteConfig {
  return {
    theme: { ...mockTheme },
    header: { ...mockHeader, logoUrl: mockHeader.logoUrl || '/images/cogi-logo.png' },
    footer: { ...mockFooter, logoUrl: mockFooter.logoUrl || '/images/cogi-logo.png' },
    seo: { ...mockSeo },
    headerNav: structuredClone(mockNavigation[0].items),
    footerNav: structuredClone(mockFooterNavigation.items),
    customPages: [],
    homepage: {
      heroHeadline: mockHomepage.heroHeadline,
      heroIntro: mockHomepage.heroIntro,
      heroHeadlineSize: mockHomepage.heroHeadlineSize ?? 64,
      heroHeadlineCase: mockHomepage.heroHeadlineCase ?? 'uppercase',
      heroMedia: mockHomepage.heroMedia ?? 'images',
      heroVideoUrl: mockHomepage.heroVideoUrl ?? '',
      heroImageUrl: mockHomepage.heroImageUrl,
      heroImageAlt: mockHomepage.heroImageAlt,
      heroSlideDuration: mockHomepage.heroSlideDuration ?? 6,
      mapOceanColor: mockHomepage.mapOceanColor ?? '#0B1016',
      mapLandColor: mockHomepage.mapLandColor ?? '#3A4A5C',
      mapPinColor: mockHomepage.mapPinColor ?? '#5BA8E0',
      mapActiveColor: mockHomepage.mapActiveColor ?? '#2E7CB5',
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
    headerNav: Array.isArray(partial.headerNav) ? partial.headerNav : base.headerNav,
    footerNav: Array.isArray(partial.footerNav) ? partial.footerNav : base.footerNav,
    customPages: Array.isArray(partial.customPages) ? partial.customPages : (base.customPages || []),
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

export function loadPublishedSiteConfig(): SiteConfig | null {
  try {
    const raw = localStorage.getItem(PUBLISHED_KEY)
    if (!raw) return null
    return mergeConfig(JSON.parse(raw) as Partial<SiteConfig>)
  } catch {
    return null
  }
}

function rememberPublishedSiteConfig(config: SiteConfig) {
  localStorage.setItem(PUBLISHED_KEY, JSON.stringify(config))
}

async function fetchPublishedFromStrapi(): Promise<SiteConfig | null> {
  if (isDemoMode()) return null
  try {
    const record = await apiSingle<{ payload?: Partial<SiteConfig> }>('/site-config', { status: 'published' })
    if (record?.payload && typeof record.payload === 'object') {
      return mergeConfig(record.payload)
    }
  } catch {
    // No published document yet, or Strapi is offline.
  }
  return null
}

async function fetchPublishedFromPublicFile(): Promise<SiteConfig | null> {
  try {
    const response = await fetch('/__site-config', { cache: 'no-store' })
    if (!response.ok) return null
    const data = (await response.json()) as Partial<SiteConfig>
    if (!data || typeof data !== 'object') return null
    if (!data.theme && !data.homepage && !data.header) return null
    return mergeConfig(data)
  } catch {
    return null
  }
}

export async function resolvePublishedSiteConfig(): Promise<SiteConfig | null> {
  const [fromStrapi, fromFile] = await Promise.all([fetchPublishedFromStrapi(), fetchPublishedFromPublicFile()])
  const published = fromStrapi && fromFile
    ? (localIsNewer(fromFile, fromStrapi) ? fromFile : fromStrapi)
    : fromStrapi || fromFile
  if (published) {
    rememberPublishedSiteConfig(published)
    return published
  }
  return loadPublishedSiteConfig()
}

export type RevertScope = 'theme' | 'header' | 'footer' | 'seo' | 'homepage' | 'copy' | 'menus'

function applyRevertScope(current: SiteConfig, published: SiteConfig, scope: RevertScope): SiteConfig {
  if (scope === 'theme') {
    return {
      ...current,
      theme: structuredClone(published.theme),
      header: {
        ...current.header,
        logoUrl: published.header.logoUrl,
        logoAlt: published.header.logoAlt,
        logoHeight: published.header.logoHeight,
      },
      homepage: {
        ...current.homepage,
        mapOceanColor: published.homepage.mapOceanColor,
        mapLandColor: published.homepage.mapLandColor,
        mapPinColor: published.homepage.mapPinColor,
        mapActiveColor: published.homepage.mapActiveColor,
      },
    }
  }
  if (scope === 'header') {
    return { ...current, header: structuredClone(published.header) }
  }
  if (scope === 'footer') {
    return { ...current, footer: structuredClone(published.footer) }
  }
  if (scope === 'seo') {
    return { ...current, seo: structuredClone(published.seo) }
  }
  if (scope === 'homepage') {
    return {
      ...current,
      homepage: structuredClone(published.homepage),
      copy: { ...current.copy, homepage: structuredClone(published.copy.homepage) },
    }
  }
  if (scope === 'copy') {
    return {
      ...current,
      copy: { ...structuredClone(published.copy), homepage: current.copy.homepage },
    }
  }
  return {
    ...current,
    headerNav: structuredClone(published.headerNav),
    footerNav: structuredClone(published.footerNav),
  }
}

export async function revertSiteConfig(scope: RevertScope): Promise<SiteConfig> {
  const published = await resolvePublishedSiteConfig()
  if (!published) {
    throw new Error('Nothing published yet to revert to. Publish once first, then you can revert later drafts.')
  }
  const next = {
    ...applyRevertScope(loadSiteConfig(), published, scope),
    updatedAt: new Date().toISOString(),
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  try {
    await persistSiteConfigToStrapi(stripDataUrls(structuredClone(next)) as SiteConfig, 'draft')
  } catch {
    // Local draft already matches the last published values for this screen.
  }
  return next
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
    const token = getJwt()
    const response = await fetch('/__site-config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify(config),
    })
    if (!response.ok) throw new Error('Could not publish the website configuration. Please try again.')
  } catch (error) {
    if (isDemoMode()) throw error
    // Cache write is best-effort — Strapi remains the source of truth.
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

function dataUrlExt(value: string) {
  if (value.startsWith('data:image/png')) return 'png'
  if (value.startsWith('data:image/svg') || value.startsWith('data:image/svg+xml')) return 'svg'
  if (value.startsWith('data:image/webp')) return 'webp'
  if (value.startsWith('data:video/webm')) return 'webm'
  if (value.startsWith('data:video')) return 'mp4'
  return 'jpg'
}

export async function ensureRemoteUrl(value: string, alt = 'Uploaded image'): Promise<string> {
  if (!value?.startsWith('data:')) return value
  if (isDemoMode()) return value
  const ext = dataUrlExt(value)
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
  if (next.homepage.heroVideoUrl) {
    next.homepage.heroVideoUrl = await ensureRemoteUrl(next.homepage.heroVideoUrl, 'Hero video')
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
  next.copy = (await hydrateDataUrls(next.copy, 'copy')) as SiteCopy
  return next
}

async function hydrateDataUrls(value: unknown, key: string): Promise<unknown> {
  if (typeof value === 'string' && value.startsWith('data:')) {
    return ensureRemoteUrl(value, key)
  }
  if (Array.isArray(value)) {
    return Promise.all(value.map((item, index) => hydrateDataUrls(item, `${key}-${index + 1}`)))
  }
  if (value && typeof value === 'object') {
    const entries = await Promise.all(
      Object.entries(value as Record<string, unknown>).map(async ([childKey, child]) => [childKey, await hydrateDataUrls(child, childKey)]),
    )
    return Object.fromEntries(entries)
  }
  return value
}

async function persistSiteConfigToStrapi(config: SiteConfig, status: 'draft' | 'published') {
  if (isDemoMode()) return
  await apiUpdateSingle('/site-config', { payload: config }, 'draft')
  if (status === 'published') await apiPublishSingle('/site-config')
}

function localIsNewer(local: SiteConfig, incoming: SiteConfig) {
  if (!local.updatedAt) return false
  if (!incoming.updatedAt) return true
  return Date.parse(local.updatedAt) >= Date.parse(incoming.updatedAt)
}

export async function hydrateSiteConfigFromStrapi(): Promise<SiteConfig> {
  const local = loadSiteConfig()
  const published = await resolvePublishedSiteConfig()
  const latest = published && !localIsNewer(local, published) ? published : local
  if (isDemoMode()) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(latest))
    return latest
  }
  try {
    const record = await apiSingle<{ payload?: Partial<SiteConfig> }>('/site-config', { status: 'draft' })
    if (record?.payload && typeof record.payload === 'object') {
      const merged = mergeConfig(record.payload)
      if (localIsNewer(latest, merged)) {
        void resolvePublishedSiteConfig()
        localStorage.setItem(STORAGE_KEY, JSON.stringify(latest))
        return latest
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
      void resolvePublishedSiteConfig()
      return merged
    }
  } catch {
    try {
      const record = await apiSingle<{ payload?: Partial<SiteConfig> }>('/site-config')
      if (record?.payload && typeof record.payload === 'object') {
        const merged = mergeConfig(record.payload)
        if (localIsNewer(latest, merged)) {
          void resolvePublishedSiteConfig()
          localStorage.setItem(STORAGE_KEY, JSON.stringify(latest))
          return latest
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
        void resolvePublishedSiteConfig()
        return merged
      }
    } catch {
      // Strapi may be offline — keep the local draft.
    }
  }
  void resolvePublishedSiteConfig()
  localStorage.setItem(STORAGE_KEY, JSON.stringify(latest))
  return latest
}

const SNAPSHOT_PREFIX = 'cogi_draft_snapshot_'

export function captureDraftSnapshot(scope: RevertScope) {
  try {
    sessionStorage.setItem(`${SNAPSHOT_PREFIX}${scope}`, JSON.stringify(loadSiteConfig()))
  } catch {
    // sessionStorage may be unavailable or full
  }
}

export function restoreDraftSnapshot(scope: RevertScope): SiteConfig {
  const raw = sessionStorage.getItem(`${SNAPSHOT_PREFIX}${scope}`)
  if (!raw) {
    throw new Error('Nothing to undo. Save a draft first, or use Revert to live.')
  }
  const snapshot = mergeConfig(JSON.parse(raw) as Partial<SiteConfig>)
  const next = {
    ...applyRevertScope(loadSiteConfig(), snapshot, scope),
    updatedAt: new Date().toISOString(),
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  return next
}

function stripDataUrls(value: unknown): unknown {
  if (typeof value === 'string') return value.startsWith('data:') ? '' : value
  if (Array.isArray(value)) return value.map(stripDataUrls)
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, nested]) => [key, stripDataUrls(nested)]))
  }
  return value
}

export async function saveSiteConfig(partial: Partial<SiteConfig>, status: 'draft' | 'published' = 'draft'): Promise<SiteConfig> {
  let next = mergeConfig({
    ...loadSiteConfig(),
    ...partial,
    updatedAt: new Date().toISOString(),
  })

  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))

  if (isDemoMode()) {
    if (status === 'published') {
      await writePublicFile(next)
      rememberPublishedSiteConfig(next)
      notifyPublished()
    }
    return next
  }

  if (status === 'draft') {
    next = await prepareConfigForStrapi(next)
    await persistSiteConfigToStrapi(next, 'draft')
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    return next
  }

  next = await prepareConfigForStrapi(next)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  // Strapi is the source of truth: if it rejects the publish, surface the error instead of reporting success.
  await persistSiteConfigToStrapi(next, 'published')
  // The config-sync file is a read cache for the public site; a failure here must not hide a successful publish.
  await writePublicFile(next)
  rememberPublishedSiteConfig(next)
  notifyPublished()
  return next
}

// Collection publishing must not publish unrelated unsaved page drafts.
export async function publishLocalContent(patch: Pick<SiteConfig, 'content' | 'globalSettings'>) {
  const published = await resolvePublishedSiteConfig() || defaultSiteConfig()
  const next = mergeConfig({ ...published, ...patch, contentSource: 'snapshot', updatedAt: new Date().toISOString() })
  await writePublicFile(next)
  rememberPublishedSiteConfig(next)
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...loadSiteConfig(), ...patch }))
  notifyPublished()
}

function pageHref(page: CustomPagePublic) {
  if (page.pageType === 'link' && page.externalUrl) return page.externalUrl
  const slug = (page.slug || '').replace(/^\/+/, '')
  return slug ? `/${slug}` : '/'
}

function withoutPageNav(items: NavItem[], page: CustomPagePublic): NavItem[] {
  const ids = new Set([`custom-${page.id}`, `custom-${page.slug}`, `page-${page.slug}`])
  return items.filter((item) => !ids.has(item.id))
}

export async function syncCustomPageToSite(page: CustomPagePublic, status: 'draft' | 'published'): Promise<void> {
  const config = loadSiteConfig()
  const live = status === 'published'
  const href = pageHref(page)
  const navId = `custom-${page.slug || page.id}`
  const navItem: NavItem = { id: navId, label: page.title || 'Untitled page', href, visible: true }
  const customPages = (config.customPages || []).filter((row) => row.slug !== page.slug && row.id !== page.id)
  if (live && page.pageType !== 'link') {
    customPages.push({ ...page, status: 'published' })
  }
  const headerBase = withoutPageNav(config.headerNav, page)
  const footerBase = withoutPageNav(config.footerNav, page)
  const headerNav = live && page.showInHeader !== false && !headerBase.some((item) => item.href === href || (item.children || []).some((child) => child.href === href))
    ? [...headerBase, navItem]
    : headerBase
  const footerNav = live && Boolean(page.showInFooter) && !footerBase.some((item) => item.href === href)
    ? [...footerBase, navItem]
    : footerBase
  await saveSiteConfig({ customPages, headerNav, footerNav }, live ? 'published' : 'draft')
}

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result || ''))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}
