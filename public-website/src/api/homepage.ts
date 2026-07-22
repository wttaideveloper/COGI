import { fetchFromStrapi } from '@/services/strapi'
import { fallbackHomepage } from '@/data/fallback'
import type { Homepage } from '@/types'

export async function getHomepage(): Promise<Homepage> {
  const data = await fetchFromStrapi<{ data: Homepage }>('/homepage', {
    populate: 'deep',
  })
  return data?.data ?? fallbackHomepage
}
