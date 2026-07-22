import { fetchFromStrapi } from '@/services/strapi'
import { fallbackPrograms } from '@/data/fallback'
import type { Program } from '@/types'

export async function getPrograms(): Promise<Program[]> {
  const data = await fetchFromStrapi<{ data: Program[] }>('/programs', {
    sort: 'order:asc',
    populate: 'deep',
  })
  return data?.data ?? fallbackPrograms
}

export async function getProgramBySlug(slug: string): Promise<Program | undefined> {
  const data = await fetchFromStrapi<{ data: Program[] }>('/programs', {
    'filters[slug][$eq]': slug,
    populate: 'deep',
  })
  if (data?.data?.[0]) return data.data[0]
  return fallbackPrograms.find((p) => p.slug === slug)
}
