import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getPrograms } from '@/api/programs'
import { SEO } from '@/components/ui/SEO'
import { PageHero, Card, Skeleton } from '@/components/ui/Card'
import { ButtonLink } from '@/components/ui/Button'

export function ProgramsPage() {
  const { data: programs, isLoading } = useQuery({ queryKey: ['programs'], queryFn: getPrograms })

  return (
    <>
      <SEO title="Programs" description="COGI ministry programs for healthcare professionals" path="/programs" />
      <PageHero title="Our Programs" subtitle="Four ministry areas equipping healthcare professionals for Kingdom engagement" />
      <div className="mx-auto max-w-7xl px-4 py-16">
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2">{[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-56" />)}</div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            {programs?.map((program) => (
              <Card key={program.id} as="article" className="flex flex-col">
                <span className="text-xs font-semibold uppercase tracking-wide text-gold">{program.area}</span>
                <h2 className="mt-2 font-display text-2xl text-teal-deep">
                  <Link to={`/programs/${program.slug}`} className="hover:text-gold">{program.title}</Link>
                </h2>
                <p className="mt-3 flex-1 text-ink-muted">{program.summary}</p>
                <ul className="mt-4 space-y-1">
                  {program.experiences.map((exp) => (
                    <li key={exp.id} className="text-sm text-ink-muted">
                      · {exp.title}
                      {exp.status === 'development' && <span className="ml-2 text-xs text-gold">(under development)</span>}
                      {exp.status === 'placeholder' && <span className="ml-2 text-xs text-gold">(coming soon)</span>}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex gap-3">
                  <ButtonLink to={`/programs/${program.slug}`} size="sm">Learn More</ButtonLink>
                  <ButtonLink to="/get-involved" variant="outline" size="sm">Express Interest</ButtonLink>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
