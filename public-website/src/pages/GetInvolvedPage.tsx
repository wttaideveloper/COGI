import { SEO } from '@/components/ui/SEO'
import { PageHero, Card } from '@/components/ui/Card'
import { GetInvolvedForm } from '@/components/forms/GetInvolvedForm'
import { useSiteConfig } from '@/contexts/SiteConfigContext'

export function GetInvolvedPage() {
  const { copy } = useSiteConfig()
  const page = copy.getInvolved

  return (
    <>
      <SEO title={page.heroTitle} description={page.heroSubtitle} path="/get-involved" />
      <PageHero title={page.heroTitle} subtitle={page.heroSubtitle} imageUrl={page.imageUrl} />
      <div className="mx-auto max-w-5xl px-4 py-16">
        <div className="mb-16 grid gap-6 md:grid-cols-3">
          {page.pathways.map((p) => (
            <Card key={p.title} as="article">
              <h2 className="font-display text-2xl text-teal-deep">{p.title}</h2>
              <p className="mt-3 text-ink-muted">{p.body}</p>
            </Card>
          ))}
        </div>
        <Card>
          <h2 className="font-display text-2xl text-teal-deep">{page.formTitle}</h2>
          <p className="mt-2 text-ink-muted">{page.formIntro}</p>
          <div className="mt-8">
            <GetInvolvedForm />
          </div>
        </Card>
      </div>
    </>
  )
}
