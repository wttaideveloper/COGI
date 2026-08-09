import { fetchFromStrapi } from '@/services/strapi'
import { fallbackGlobalSettings } from '@/data/fallback'
import type { GlobalSettings } from '@/types'

export async function getGlobalSettings(): Promise<GlobalSettings> {
  const data = await fetchFromStrapi<{ data: GlobalSettings }>('/global-setting', {
    populate: '*',
  })
  return data?.data ?? fallbackGlobalSettings
}
