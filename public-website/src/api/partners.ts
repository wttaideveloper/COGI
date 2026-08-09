import { fetchFromStrapi } from '@/services/strapi'
import { fallbackPartners } from '@/data/fallback'
import type { Partner } from '@/types'

export async function getPartners(): Promise<Partner[]> {
  const data = await fetchFromStrapi<{ data: Partner[] }>('/partners', {
    sort: 'order:asc',
  })
  if (data === null) return fallbackPartners
  return data.data ?? []
}
