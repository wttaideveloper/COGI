import { fetchFromStrapi } from '@/services/strapi'
import { fallbackLocations } from '@/data/fallback'
import type { Location } from '@/types'

export async function getLocations(): Promise<Location[]> {
  const data = await fetchFromStrapi<{ data: Location[] }>('/locations', {
    sort: 'country:asc',
  })
  return data?.data ?? fallbackLocations
}
