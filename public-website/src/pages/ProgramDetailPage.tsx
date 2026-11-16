import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getProgramBySlug } from '@/api/programs'
import { SEO } from '@/components/ui/SEO'
import { PageHero, Card, Skeleton, ErrorState } from '@/components/ui/Card'
import { ButtonLink } from '@/components/ui/Button'

export function ProgramDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: program, isLoading, isError } = useQuery({
    queryKey: ['program', slug],
    queryFn: () => getProgramBySlug(slug!),
    enabled: !!slug,
  })

  if (isLoading) return <div className="mx-auto max-w-4xl px-4 py-16"><Skeleton className="h-96" /></div>
  if (isError || !program) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16">
        <ErrorState message="Program not found." />
        <Link to="/programs" className="mt-4 inline-block text-teal-deep hover:text-accent-ink">← Back to Programs</Link>
      </div>
    )
  }

  return (
    <>
      <SEO title={program.title} description={program.summary} path={`/programs/${program.slug}`} />
      <PageHero title={program.title} subtitle={program.area} />
      <div className="mx-auto max-w-4xl px-4 py-16">
        <p className="text-lg leading-relaxed text-ink">{program.description}</p>
        <p className="mt-4 text-ink-muted"><strong>Audience:</strong> {program.audience}</p>

        <h2 className="mt-12 font-display text-2xl text-teal-deep">Program Experiences</h2>
        <div className="mt-6 space-y-6">
          {program.experiences.map((exp) => (
            <Card key={exp.id} as="article">
              <div className="flex items-start justify-between gap-4">
                <h3 className="font-display text-xl text-teal-deep">{exp.title}</h3>
                {exp.status === 'development' && <span className="shrink-0 rounded-full bg-gold/20 px-3 py-1 text-xs font-semibold text-accent-ink">Under Development</span>}
                {exp.status === 'placeholder' && <span className="shrink-0 rounded-full bg-mist-dark px-3 py-1 text-xs font-semibold text-ink-muted">Coming Soon</span>}
              </div>
              <p className="mt-3 text-ink-muted">{exp.description}</p>
            </Card>
          ))}
        </div>

        <h2 className="mt-12 font-display text-2xl text-teal-deep">Highlights</h2>
        <ul className="mt-4 list-inside list-disc space-y-2 text-ink-muted">
          {program.highlights.map((h) => <li key={h}>{h}</li>)}
        </ul>

        <div className="mt-12 flex flex-wrap gap-4">
          <ButtonLink to="/get-involved" size="lg">Express Interest</ButtonLink>
          <ButtonLink to="/contact" variant="outline" size="lg">Contact Us</ButtonLink>
        </div>
      </div>
    </>
  )
}
