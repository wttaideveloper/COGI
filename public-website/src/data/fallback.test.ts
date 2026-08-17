import { describe, it, expect } from 'vitest'
import { fallbackPrograms, fallbackBoardMembers, fallbackTestimonials, fallbackLocations } from '@/data/fallback'

describe('COGI fallback content', () => {
  it('includes the four ministry pathways', () => {
    expect(fallbackPrograms.map((p) => p.slug)).toEqual(
      expect.arrayContaining([
        'kingdom-of-god',
        'missional-training',
        'care-for-the-caregiver',
        'missional-church-healthcare',
      ]),
    )
  })

  it('includes the founding board', () => {
    const names = fallbackBoardMembers.map((m) => m.name).join(' ')
    expect(names).toMatch(/Abraham Thomas/)
    expect(names).toMatch(/Mathew George/)
  })

  it('includes written testimonials', () => {
    expect(fallbackTestimonials.length).toBeGreaterThanOrEqual(3)
  })

  it('lists current areas of engagement', () => {
    const countries = fallbackLocations.map((l) => l.country)
    expect(countries).toEqual(
      expect.arrayContaining(['United States', 'India', 'Uganda', 'Philippines', 'Kenya', 'Singapore', 'Rwanda', 'Australia', 'Tanzania', 'New Zealand']),
    )
  })
})
