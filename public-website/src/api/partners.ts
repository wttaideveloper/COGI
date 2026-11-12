import { fetchFromStrapi } from '@/services/strapi'
import { fallbackPartners } from '@/data/fallback'
import type { Partner } from '@/types'

const EMFI_URL = 'https://emfi.in/'

function sanitizePartners(rows: Partner[]): Partner[] {
  return rows
    .filter((partner) => partner.name && !/placeholder/i.test(partner.description || ''))
    .map((partner) => {
      const url = partner.url?.includes('emfiindia.org') ? EMFI_URL : partner.url
      return url && url !== partner.url ? { ...partner, url } : partner
    })
}

export async function getPartners(): Promise<Partner[]> {
  const data = await fetchFromStrapi<{ data: Partner[] }>('/partners', {
    sort: 'order:asc',
  })
  const rows = sanitizePartners(data?.data ?? [])
  if (!data) return sanitizePartners(fallbackPartners)
  return rows
}
