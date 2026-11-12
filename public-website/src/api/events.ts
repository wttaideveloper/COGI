import { fetchFromStrapi } from '@/services/strapi'
import { fallbackEvents } from '@/data/fallback'
import type { Event } from '@/types'

function relationLabel(value: unknown): string {
  if (!value) return ''
  if (typeof value === 'string') return value
  if (typeof value !== 'object') return ''
  const record = value as Record<string, unknown>
  const nested = (record.attributes || record.data || record) as Record<string, unknown>
  return String(nested.name || nested.title || nested.country || nested.label || '')
}

function mapEvent(raw: Record<string, unknown>): Event {
  const attrs = (raw.attributes && typeof raw.attributes === 'object' ? raw.attributes : raw) as Record<string, unknown>
  return {
    id: String(raw.documentId ?? raw.id ?? ''),
    slug: String(attrs.slug || ''),
    title: String(attrs.title || ''),
    summary: String(attrs.summary || ''),
    description: String(attrs.body || attrs.description || attrs.summary || ''),
    startDate: String(attrs.startDate || ''),
    endDate: attrs.endDate ? String(attrs.endDate) : undefined,
    venue: attrs.venue ? String(attrs.venue) : undefined,
    location: relationLabel(attrs.location) || undefined,
    category: relationLabel(attrs.category) || String(attrs.category || 'Event'),
    registrationUrl: attrs.externalUrl ? String(attrs.externalUrl) : undefined,
    featured: Boolean(attrs.featured),
  }
}

export async function getEvents(): Promise<Event[]> {
  const data = await fetchFromStrapi<{ data: Array<Record<string, unknown>> }>('/events', {
    sort: 'startDate:asc',
    populate: '*',
  })
  if (!data) return fallbackEvents
  return data.data.map(mapEvent)
}

export async function getEventBySlug(slug: string): Promise<Event | undefined> {
  const data = await fetchFromStrapi<{ data: Array<Record<string, unknown>> }>('/events', {
    'filters[slug][$eq]': slug,
    populate: '*',
  })
  if (!data) return fallbackEvents.find((e) => e.slug === slug)
  if (!data.data?.[0]) return undefined
  return mapEvent(data.data[0])
}

export async function getFeaturedEvent(): Promise<Event | null> {
  const events = await getEvents()
  return events.find((e) => e.featured) ?? events[0] ?? null
}
