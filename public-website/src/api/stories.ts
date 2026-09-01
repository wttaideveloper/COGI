import { fetchFromStrapi } from '@/services/strapi'
import { fallbackStories } from '@/data/fallback'
import type { Story } from '@/types'

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337'

function mediaUrl(value: unknown): string | undefined {
  if (!value) return undefined
  if (typeof value === 'string') {
    if (!value) return undefined
    return value.startsWith('http') || value.startsWith('/') || value.startsWith('data:') ? value : `${STRAPI_URL}${value}`
  }
  if (typeof value !== 'object') return undefined
  const record = value as Record<string, unknown>
  if (typeof record.url === 'string') return mediaUrl(record.url)
  if (record.data && typeof record.data === 'object') {
    const nested = record.data as Record<string, unknown>
    return mediaUrl(nested.attributes || nested)
  }
  return undefined
}

function relationTitle(value: unknown): string {
  if (!value) return ''
  if (typeof value === 'string') return value
  if (typeof value !== 'object') return ''
  const record = value as Record<string, unknown>
  if (typeof record.title === 'string') return record.title
  if (record.data && typeof record.data === 'object') {
    const nested = record.data as Record<string, unknown>
    return relationTitle(nested.attributes || nested)
  }
  return ''
}

function stripHtml(value: unknown) {
  return String(value ?? '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .trim()
}

function mapStory(raw: Record<string, unknown>): Story {
  const attrs = (raw.attributes && typeof raw.attributes === 'object' ? raw.attributes : raw) as Record<string, unknown>
  const content = String(attrs.body || attrs.content || attrs.summary || '')
  return {
    id: String(raw.documentId ?? raw.id ?? ''),
    slug: String(attrs.slug || ''),
    title: String(attrs.title || ''),
    summary: stripHtml(attrs.summary || attrs.body || ''),
    type: attrs.type === 'video' ? 'video' : 'written',
    country: String(attrs.country || ''),
    program: relationTitle(attrs.program),
    featured: Boolean(attrs.featured),
    videoUrl: attrs.videoUrl ? String(attrs.videoUrl) : undefined,
    imageUrl: mediaUrl(attrs.thumbnail) || mediaUrl(attrs.imageUrl),
    content,
  }
}

export async function getStories(): Promise<Story[]> {
  const data = await fetchFromStrapi<{ data: Array<Record<string, unknown>> }>('/stories', {
    sort: 'featured:desc',
    populate: '*',
  })
  if (!data?.data?.length) return fallbackStories
  return data.data.map(mapStory)
}

export async function getStoryBySlug(slug: string): Promise<Story | undefined> {
  const data = await fetchFromStrapi<{ data: Array<Record<string, unknown>> }>('/stories', {
    'filters[slug][$eq]': slug,
    populate: '*',
  })
  if (data?.data?.[0]) return mapStory(data.data[0])
  return fallbackStories.find((s) => s.slug === slug)
}
