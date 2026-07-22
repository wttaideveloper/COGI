import { fetchFromStrapi } from '@/services/strapi'
import { fallbackStories } from '@/data/fallback'
import type { Story } from '@/types'

export async function getStories(): Promise<Story[]> {
  const data = await fetchFromStrapi<{ data: Story[] }>('/stories', {
    sort: 'featured:desc',
  })
  return data?.data ?? fallbackStories
}

export async function getStoryBySlug(slug: string): Promise<Story | undefined> {
  const data = await fetchFromStrapi<{ data: Story[] }>('/stories', {
    'filters[slug][$eq]': slug,
  })
  if (data?.data?.[0]) return data.data[0]
  return fallbackStories.find((s) => s.slug === slug)
}
