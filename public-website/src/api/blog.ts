import { fetchFromStrapi } from '@/services/strapi'
import { fallbackBlogPosts } from '@/data/fallback'
import type { BlogPost } from '@/types'

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337'

function mediaUrl(value: unknown): string | undefined {
  if (!value) return undefined
  if (typeof value === 'string') {
    if (!value) return undefined
    if (value.startsWith('/uploads/')) return `${STRAPI_URL}${value}`
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

function mapBlog(raw: Record<string, unknown>): BlogPost {
  const attrs = (raw.attributes && typeof raw.attributes === 'object' ? raw.attributes : raw) as Record<string, unknown>
  const category = attrs.category
  const categoryLabel = category && typeof category === 'object'
    ? String((category as { name?: string; title?: string }).name || (category as { title?: string }).title || '')
    : String(category || '')
  return {
    id: String(raw.documentId ?? raw.id ?? ''),
    slug: String(attrs.slug || ''),
    title: String(attrs.title || ''),
    summary: String(attrs.summary || ''),
    content: String(attrs.body || attrs.content || ''),
    author: String(attrs.author || 'COGI'),
    category: categoryLabel,
    publishedAt: String(attrs.publishedAt || attrs.updatedAt || ''),
    imageUrl: mediaUrl(attrs.featuredImage) || mediaUrl(attrs.imageUrl),
  }
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const data = await fetchFromStrapi<{ data: Array<Record<string, unknown>> }>('/news-articles', {
    sort: 'publishedAt:desc',
    populate: '*',
  })
  if (!data) return fallbackBlogPosts
  return data.data.map(mapBlog)
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const data = await fetchFromStrapi<{ data: Array<Record<string, unknown>> }>('/news-articles', {
    'filters[slug][$eq]': slug,
    populate: '*',
  })
  if (data?.data?.[0]) return mapBlog(data.data[0])
  return data ? undefined : fallbackBlogPosts.find((p) => p.slug === slug)
}
