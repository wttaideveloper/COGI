import { fetchFromStrapi } from '@/services/strapi'
import { fallbackEvents } from '@/data/fallback'
import type { Event } from '@/types'

export async function getEvents(): Promise<Event[]> {
  const data = await fetchFromStrapi<{ data: Event[] }>('/events', {
    sort: 'startDate:asc',
  })
  return data?.data ?? fallbackEvents
}

export async function getEventBySlug(slug: string): Promise<Event | undefined> {
  const data = await fetchFromStrapi<{ data: Event[] }>('/events', {
    'filters[slug][$eq]': slug,
  })
  if (data?.data?.[0]) return data.data[0]
  return fallbackEvents.find((e) => e.slug === slug)
}

export async function getFeaturedEvent(): Promise<Event | null> {
  const events = await getEvents()
  return events.find((e) => e.featured) ?? events[0] ?? null
}
