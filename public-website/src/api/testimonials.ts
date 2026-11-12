import { fetchFromStrapi } from '@/services/strapi'
import { fallbackTestimonials } from '@/data/fallback'
import type { Testimonial } from '@/types'

function stripHtml(value: unknown) {
  return String(value ?? '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .trim()
}

function mapTestimonial(raw: Record<string, unknown>): Testimonial {
  const attrs = (raw.attributes && typeof raw.attributes === 'object' ? raw.attributes : raw) as Record<string, unknown>
  const program = attrs.program
  const programLabel = program && typeof program === 'object'
    ? String((program as { title?: string }).title || '')
    : String(program || '')
  return {
    id: String(raw.documentId ?? raw.id ?? ''),
    quote: stripHtml(attrs.quote),
    author: String(attrs.author || ''),
    role: attrs.authorTitle ? String(attrs.authorTitle) : undefined,
    country: attrs.country ? String(attrs.country) : undefined,
    program: programLabel || undefined,
    featured: Boolean(attrs.featured),
    mediaType: attrs.mediaType === 'video' ? 'video' : 'written',
    videoUrl: attrs.videoUrl ? String(attrs.videoUrl) : undefined,
  }
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const data = await fetchFromStrapi<{ data: Array<Record<string, unknown>> }>('/testimonials', {
    sort: 'featured:desc',
    populate: '*',
  })
  if (!data) return fallbackTestimonials
  return data.data.map(mapTestimonial)
}
