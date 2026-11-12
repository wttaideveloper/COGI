import { afterEach, expect, it, vi } from 'vitest'
vi.mock('@/services/strapi', () => ({ fetchFromStrapi: vi.fn() }))
import { fetchFromStrapi } from '@/services/strapi'
import { getPrograms, getProgramBySlug } from './programs'
import { getStories, getStoryBySlug } from './stories'
import { getBlogPosts, getBlogPostBySlug } from './blog'
import { getEvents, getEventBySlug } from './events'
import { getPartners } from './partners'
import { getLocations } from './locations'
import { getTestimonials } from './testimonials'

afterEach(() => vi.clearAllMocks())
it('does not resurrect deleted or unpublished collections from fallback data', async () => {
  vi.mocked(fetchFromStrapi).mockResolvedValue({ data: [] })
  for (const get of [getPrograms, getStories, getBlogPosts, getEvents, getPartners, getLocations, getTestimonials]) expect(await get()).toEqual([])
  for (const get of [getProgramBySlug, getStoryBySlug, getBlogPostBySlug, getEventBySlug]) expect(await get('kingdom-of-god')).toBeUndefined()
})

it('still provides fallback content when the backend is unavailable', async () => {
  vi.mocked(fetchFromStrapi).mockResolvedValue(null)
  expect((await getPrograms()).length).toBeGreaterThan(0)
})
