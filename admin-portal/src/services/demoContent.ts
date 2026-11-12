import { fallbackPrograms, fallbackBlogPosts, fallbackEvents, fallbackStories, fallbackTestimonials, fallbackPartners, fallbackLocations, fallbackGlobalSettings } from '../../../shared/fallback'
import { loadLocalRecords, saveLocalRecords } from './localRecords'
import { publishLocalContent, resolvePublishedSiteConfig } from './siteConfigStore'

type Row = { id: string; documentId?: string } & Record<string, unknown>
const seeds: Record<string, object[]> = {
  programs: fallbackPrograms, blog: fallbackBlogPosts, events: fallbackEvents, stories: fallbackStories,
  testimonials: fallbackTestimonials, partners: fallbackPartners, locations: fallbackLocations,
}

export function demoSeed(key: string): Row[] {
  return (seeds[key] || []).map((item) => {
    const row = item as Record<string, unknown>
    return { ...row, id: String(row.id), status: 'published', body: row.content ?? row.description ?? '',
      authorTitle: row.role, latitude: row.lat, longitude: row.lng, externalUrl: row.registrationUrl }
  })
}

export async function loadDemoRows(key: string, endpoint: string): Promise<Row[]> {
  const published = await resolvePublishedSiteConfig()
  return loadLocalRecords(key, (published?.content?.[endpoint] as Row[] | undefined) ?? demoSeed(key))
}

export async function publishDemoRow(key: string, endpoint: string, record: Row | null, removeId?: string) {
  const published = await resolvePublishedSiteConfig()
  const rows = (published?.content?.[endpoint] as Row[] | undefined) ?? demoSeed(key)
  const id = removeId || record?.id
  const next = rows.filter(row => String(row.documentId || row.id) !== id && row.id !== id)
  if (record) next.push({ ...record, status: 'published' })
  await publishLocalContent({ content: { ...published?.content, [endpoint]: next } })
}

export function storeDemoDraft(key: string, rows: Row[]) { saveLocalRecords(key, rows) }

export async function loadDemoSettings() {
  const published = await resolvePublishedSiteConfig()
  return published?.globalSettings || {
    ...fallbackGlobalSettings, primaryEmail: fallbackGlobalSettings.contactEmail,
    primaryPhone: fallbackGlobalSettings.contactPhone || '', maintenanceMode: false,
  }
}
