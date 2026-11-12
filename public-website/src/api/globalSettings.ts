import { fetchFromStrapi } from '@/services/strapi'
import { fallbackGlobalSettings } from '@/data/fallback'
import type { GlobalSettings } from '@/types'

export function normalizeGlobalSettings(value: unknown): GlobalSettings {
  const record = value && typeof value === 'object' ? value as Record<string, unknown> : {}
  const raw = record.attributes && typeof record.attributes === 'object'
    ? record.attributes as Record<string, unknown> : record
  const text = (value: unknown, fallback: string) => typeof value === 'string' ? value : fallback
  const social = raw.social && typeof raw.social === 'object' ? raw.social as Record<string, unknown> : null
  const platforms = ['instagram', 'facebook', 'linkedin', 'youtube'] as const
  const labels = { instagram: 'Instagram', facebook: 'Facebook', linkedin: 'LinkedIn', youtube: 'YouTube' }
  const socialLinks = Array.isArray(raw.socialLinks)
    ? raw.socialLinks.filter((link): link is GlobalSettings['socialLinks'][number] =>
      Boolean(link && typeof link === 'object' && platforms.includes(link.platform) && typeof link.url === 'string' && typeof link.label === 'string'))
    : social ? platforms.flatMap(platform => typeof social[platform] === 'string' && social[platform]
      ? [{ platform, url: social[platform] as string, label: labels[platform] }] : [])
      : fallbackGlobalSettings.socialLinks
  return {
    ...fallbackGlobalSettings,
    organizationName: text(raw.organizationName, fallbackGlobalSettings.organizationName),
    tagline: text(raw.tagline, fallbackGlobalSettings.tagline),
    mission: text(raw.mission, fallbackGlobalSettings.mission),
    vision: text(raw.vision, fallbackGlobalSettings.vision),
    contactEmail: text(raw.primaryEmail ?? raw.contactEmail, fallbackGlobalSettings.contactEmail),
    contactPhone: text(raw.phone ?? raw.primaryPhone ?? raw.contactPhone, ''),
    address: text(raw.address, fallbackGlobalSettings.address || ''),
    socialLinks,
  }
}

export async function getGlobalSettings(): Promise<GlobalSettings> {
  const data = await fetchFromStrapi<{ data: unknown }>('/global-setting', {
    populate: '*',
  })
  return normalizeGlobalSettings(data?.data)
}
