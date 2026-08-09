import { fetchFromStrapi } from '@/services/strapi'

export interface PublicPageSection {
  id: string
  type: string
  title: string
  content: string
  imageUrl?: string
  buttonLabel?: string
  buttonHref?: string
}

export interface PublicPage {
  id: string
  title: string
  slug: string
  status: string
  summary?: string
  heroImageUrl?: string
  externalUrl?: string
  seo?: { metaTitle?: string; metaDescription?: string; keywords?: string }
  sections?: PublicPageSection[]
}

export async function getPageBySlug(slug: string): Promise<PublicPage | null> {
  const data = await fetchFromStrapi<{ data: Array<Record<string, unknown>> }>(`/pages`, {
    filters: { slug: { $eq: slug } },
  })
  if (!data?.data?.length) return null
  const raw = data.data[0]
  const attrs = (raw.attributes ?? raw) as Record<string, unknown>
  const sectionsRaw = attrs.sections as { value?: PublicPageSection[] } | PublicPageSection[] | null | undefined
  const sections = Array.isArray(sectionsRaw) ? sectionsRaw : (sectionsRaw?.value ?? [])
  const status = (attrs.status as string) ?? 'draft'
  const previewToken = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('preview') : null
  const isPreview = previewToken === 'draft'
  if (status !== 'published' && !isPreview) return null
  return {
    id: String(raw.id ?? raw.documentId ?? ''),
    title: (attrs.title as string) ?? '',
    slug: (attrs.slug as string) ?? slug,
    status,
    summary: attrs.summary as string | undefined,
    heroImageUrl: attrs.heroImageUrl as string | undefined,
    externalUrl: attrs.externalUrl as string | undefined,
    seo: attrs.seo as PublicPage['seo'],
    sections,
  }
}
