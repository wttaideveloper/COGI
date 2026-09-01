import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getTestimonials } from '@/api/testimonials'
import { getPrograms } from '@/api/programs'
import { SEO } from '@/components/ui/SEO'
import { PageHero, Card } from '@/components/ui/Card'
import { VideoPlayer } from '@/components/ui/VideoPlayer'
import { TestimonialCarousel } from '@/components/home/TestimonialCarousel'
import { useSiteConfig } from '@/contexts/SiteConfigContext'

export function TestimonialsPage() {
  const { data: testimonials } = useQuery({ queryKey: ['testimonials'], queryFn: getTestimonials })
  const { data: programs } = useQuery({ queryKey: ['programs'], queryFn: getPrograms })
  const [programFilter, setProgramFilter] = useState('')
  const { copy } = useSiteConfig()
  const page = copy.testimonials

  const filtered = testimonials?.filter((t) => !programFilter || t.program === programFilter) || []
  const videos = filtered.filter((t) => t.mediaType === 'video' && t.videoUrl)

  return (
    <>
      <SEO title={page.heroTitle} path="/resources/testimonials" />
      <PageHero title={page.heroTitle} subtitle={page.heroSubtitle} imageUrl={page.imageUrl} />
      <div className="mx-auto max-w-5xl px-4 py-16">
        {filtered.length ? (
          <div className="mb-16">
            <TestimonialCarousel items={filtered} />
          </div>
        ) : null}
        <label className="mb-8 flex items-center gap-2 text-sm">
          Filter by program:
          <select value={programFilter} onChange={(e) => setProgramFilter(e.target.value)} className="rounded-md border border-mist-dark px-3 py-2">
            <option value="">All Programs</option>
            {programs?.map((p) => <option key={p.id} value={p.title}>{p.title}</option>)}
          </select>
        </label>
        {videos.length ? (
          <div className="mb-12 grid gap-6 md:grid-cols-2">
            {videos.map((t) => (
              <Card key={`video-${t.id}`} className="overflow-hidden !p-0">
                <VideoPlayer src={t.videoUrl!} title={t.author} className="relative aspect-video w-full overflow-hidden bg-black" />
                <div className="p-5">
                  <p className="font-semibold text-teal-deep">{t.author}</p>
                  {t.role ? <p className="text-sm text-ink-muted">{t.role}</p> : null}
                </div>
              </Card>
            ))}
          </div>
        ) : null}
        <div className="grid gap-6 md:grid-cols-2">
          {filtered.map((t, index) => (
            <Card
              key={t.id}
              as="article"
              className={(filtered.length ?? 0) % 2 === 1 && index === filtered.length - 1 ? 'md:col-span-2 md:mx-auto md:w-full md:max-w-xl' : undefined}
            >
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
