import { SEO } from '@/components/ui/SEO'
import { PageHero, Card } from '@/components/ui/Card'
import { GetInvolvedForm } from '@/components/forms/GetInvolvedForm'

const pathways = [
  { id: 'pray', title: 'Pray', description: 'Join our global prayer network for healthcare professionals, programs, and unreached communities.' },
  { id: 'participate', title: 'Participate', description: 'Enroll in a program, attend an event, or become a facilitator in your region.' },
  { id: 'partner', title: 'Partner', description: 'Churches, mission agencies, and healthcare institutions — explore collaboration with COGI.' },
] as const

export function GetInvolvedPage() {
  return (
    <>
      <SEO title="Get Involved" description="Pray, Participate, or Partner with COGI" path="/get-involved" />
      <PageHero title="Get Involved" subtitle="Pray · Participate · Partner" />
      <div className="mx-auto max-w-5xl px-4 py-16">
        <div className="mb-16 grid gap-6 md:grid-cols-3">
          {pathways.map((p) => (
            <Card key={p.id} as="article">
              <h2 className="font-display text-2xl text-teal-deep">{p.title}</h2>
              <p className="mt-3 text-ink-muted">{p.description}</p>
            </Card>
          ))}
        </div>
        <Card>
          <h2 className="font-display text-2xl text-teal-deep">Join the Movement</h2>
          <p className="mt-2 text-ink-muted">Tell us how you&apos;d like to engage and we&apos;ll connect you with the right pathway.</p>
          <div className="mt-8">
            <GetInvolvedForm />
          </div>
        </Card>
      </div>
    </>
  )
}
