import { fetchFromStrapi } from '@/services/strapi'
import { fallbackLocations } from '@/data/fallback'
import type { Location } from '@/types'

type StrapiLocation = Partial<Location> & { latitude?: number; longitude?: number; country: string }

export async function getLocations(): Promise<Location[]> {
  const data = await fetchFromStrapi<{ data: StrapiLocation[] }>('/locations', {
    sort: 'country:asc',
  })
  if (data === null) return fallbackLocations
  const rows = (data.data ?? []).map((l) => {
    const fallback = fallbackLocations.find((item) => item.country === l.country)
    return {
      id: String(l.id),
      country: l.country,
      region: l.region || fallback?.region || '',
      summary: l.summary || fallback?.summary || '',
      programs: l.programs?.length ? l.programs : fallback?.programs ?? [],
      lat: l.lat ?? l.latitude ?? fallback?.lat,
      lng: l.lng ?? l.longitude ?? fallback?.lng,
    }
  })
  return rows.length ? rows : fallbackLocations
}
