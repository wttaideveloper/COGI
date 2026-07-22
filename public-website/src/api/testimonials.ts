import { fetchFromStrapi } from '@/services/strapi'
import { fallbackTestimonials } from '@/data/fallback'
import type { Testimonial } from '@/types'

export async function getTestimonials(): Promise<Testimonial[]> {
  const data = await fetchFromStrapi<{ data: Testimonial[] }>('/testimonials', {
    sort: 'featured:desc',
  })
  return data?.data ?? fallbackTestimonials
}
