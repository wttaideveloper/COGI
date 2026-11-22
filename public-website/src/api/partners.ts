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
  const data = await fetchFromStrapi<{ data: Array<Partner & { logo?: { url?: string } | null }> }>('/partners', {
    sort: 'order:asc',
    populate: '*',
  })
  const rows = sanitizePartners((data?.data ?? []).map(partner => ({
    ...partner,
    logoUrl: partner.logo?.url ? (partner.logo.url.startsWith('http') ? partner.logo.url : (import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337') + partner.logo.url) : partner.logoUrl,
  })))
  if (!data) return sanitizePartners(fallbackPartners)
  return rows
}
