import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getTestimonials } from '@/api/testimonials'
import { getPrograms } from '@/api/programs'
import { SEO } from '@/components/ui/SEO'
import { PageHero, Card } from '@/components/ui/Card'

export function TestimonialsPage() {
  const { data: testimonials } = useQuery({ queryKey: ['testimonials'], queryFn: getTestimonials })
  const { data: programs } = useQuery({ queryKey: ['programs'], queryFn: getPrograms })
  const [programFilter, setProgramFilter] = useState('')

  const filtered = testimonials?.filter((t) => !programFilter || t.program === programFilter)

  return (
    <>
      <SEO title="Testimonials" path="/resources/testimonials" />
      <PageHero title="Testimonials" subtitle="Voices from the COGI global fellowship" />
      <div className="mx-auto max-w-5xl px-4 py-16">
        <label className="mb-8 flex items-center gap-2 text-sm">
          Filter by program:
          <select value={programFilter} onChange={(e) => setProgramFilter(e.target.value)} className="rounded-md border border-mist-dark px-3 py-2">
            <option value="">All Programs</option>
            {programs?.map((p) => <option key={p.id} value={p.title}>{p.title}</option>)}
          </select>
        </label>
        <div className="grid gap-6 md:grid-cols-2">
          {filtered?.map((t) => (
            <Card key={t.id} as="article">
              <p className="font-display text-lg italic leading-relaxed text-ink">&ldquo;{t.quote}&rdquo;</p>
              <footer className="mt-4">
                <cite className="not-italic">
                  <span className="font-semibold text-teal-deep">{t.author}</span>
                  {t.role && <span className="text-ink-muted"> — {t.role}</span>}
                </cite>
                {(t.country || t.program) && (
                  <p className="text-xs text-ink-muted mt-1">{[t.country, t.program].filter(Boolean).join(' · ')}</p>
                )}
              </footer>
            </Card>
          ))}
        </div>
      </div>
    </>
  )
}
