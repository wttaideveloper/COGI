import { describe, it, expect } from 'vitest'
import { fallbackPrograms, fallbackBoardMembers, fallbackTestimonials } from '@/data/fallback'

describe('COGI fallback content', () => {
  it('includes four programs from the requirements document', () => {
    expect(fallbackPrograms.length).toBeGreaterThanOrEqual(4)
    expect(fallbackPrograms.map((p) => p.slug)).toEqual(
      expect.arrayContaining([
        'kingdom-of-god',
        'missional-training',
        'care-for-the-caregiver',
        'missional-church-healthcare',
      ]),
    )
  })

  it('includes board members with chairman and CEO', () => {
    const titles = fallbackBoardMembers.map((m) => `${m.name} ${m.title}`).join(' ')
    expect(/chairman/i.test(titles)).toBe(true)
    expect(/ceo|president|chief executive/i.test(titles)).toBe(true)
  })

  it('includes written testimonials from the DOCX', () => {
    expect(fallbackTestimonials.length).toBeGreaterThanOrEqual(4)
    const authors = fallbackTestimonials.map((t) => t.author).join(' ')
    expect(authors).toMatch(/Stella/i)
    expect(authors).toMatch(/Abhilash/i)
    expect(authors).toMatch(/Chacko/i)
    expect(authors).toMatch(/Blessena/i)
  })
})
