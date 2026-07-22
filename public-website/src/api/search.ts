import { fetchFromStrapi } from '@/services/strapi'
import {
  fallbackBlogPosts,
  fallbackEvents,
  fallbackLegalPages,
  fallbackPrograms,
  fallbackStories,
} from '@/data/fallback'
import { fallbackGlobalSettings } from '@/data/fallback'
import type { SearchResult } from '@/types'

const staticPages: SearchResult[] = [
  { id: 'about', type: 'page', title: 'About Us', summary: fallbackGlobalSettings.vision, url: '/about' },
  { id: 'our-story', type: 'page', title: 'Our Story', summary: 'COGI timeline from 2019 to 2026', url: '/about/our-story' },
  { id: 'beliefs', type: 'page', title: 'Our Beliefs', summary: 'Statement of faith', url: '/about/beliefs' },
  { id: 'get-involved', type: 'page', title: 'Get Involved', summary: 'Pray, Participate, Partner', url: '/get-involved' },
  { id: 'donate', type: 'page', title: 'Donate', summary: 'Support missional healthcare worldwide', url: '/donate' },
  { id: 'contact', type: 'page', title: 'Contact', summary: fallbackGlobalSettings.contactEmail, url: '/contact' },
]

function buildLocalIndex(): SearchResult[] {
  const programResults: SearchResult[] = fallbackPrograms.map((p) => ({
    id: p.id,
    type: 'program',
    title: p.title,
    summary: p.summary,
    url: `/programs/${p.slug}`,
  }))

  const blogResults: SearchResult[] = fallbackBlogPosts.map((b) => ({
    id: b.id,
    type: 'blog',
    title: b.title,
    summary: b.summary,
    url: `/resources/blog/${b.slug}`,
  }))

  const eventResults: SearchResult[] = fallbackEvents.map((e) => ({
    id: e.id,
    type: 'event',
    title: e.title,
    summary: e.summary,
    url: `/events/${e.slug}`,
  }))

  const storyResults: SearchResult[] = fallbackStories.map((s) => ({
    id: s.id,
    type: 'story',
    title: s.title,
    summary: s.summary,
    url: `/resources/stories`,
  }))

  return [...staticPages, ...programResults, ...blogResults, ...eventResults, ...storyResults]
}

export async function searchSite(query: string): Promise<SearchResult[]> {
  if (!query.trim()) return []

  const strapiResults = await fetchFromStrapi<{ data: SearchResult[] }>('/search', { q: query })
  if (strapiResults?.data?.length) return strapiResults.data

  const q = query.toLowerCase()
  return buildLocalIndex().filter(
    (item) =>
      item.title.toLowerCase().includes(q) ||
      item.summary.toLowerCase().includes(q),
  )
}

export function getLegalPage(slug: string) {
  return fallbackLegalPages.find((p) => p.slug === slug)
}
