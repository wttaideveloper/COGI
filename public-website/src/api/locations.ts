import { fetchFromStrapi } from '@/services/strapi'
import { fallbackLocations } from '@/data/fallback'
import type { Location } from '@/types'

type StrapiLocation = Partial<Location> & { latitude?: number; longitude?: number; country: string }

export async function getLocations(): Promise<Location[]> {
  const data = await fetchFromStrapi<{ data: StrapiLocation[] }>('/locations', {
    sort: 'country:asc',
  })
  if (data === null) return fallbackLocations
  return (data.data ?? []).map((l) => ({
    id: String(l.id),
    country: l.country,
    region: l.region ?? '',
    summary: l.summary ?? '',
    programs: l.programs ?? [],
    lat: l.lat ?? l.latitude,
    lng: l.lng ?? l.longitude,
  }))
}
