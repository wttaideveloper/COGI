import { SEO } from '@/components/ui/SEO'
import { PageHero, Card } from '@/components/ui/Card'
import { GetInvolvedForm } from '@/components/forms/GetInvolvedForm'
import { NewsletterForm } from '@/components/forms/NewsletterForm'
import { useSiteConfig } from '@/contexts/SiteConfigContext'

// “Join the movement” is the Get Involved form title (Site pages → Get Involved).
// It is not a navbar label. Form posts land in admin Inbox → Messages.

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
          <h2 id="form" className="font-display text-2xl text-teal-deep">{page.formTitle}</h2>
          <p className="mt-2 text-ink-muted">{page.formIntro}</p>
          <p className="mt-2 text-sm text-ink-muted">Volunteer applications are stored in the admin inbox and emailed to the team.</p>
          <div className="mt-8">
            <GetInvolvedForm />
          </div>
        </Card>
        <Card className="mt-10">
          <h2 className="font-display text-2xl text-teal-deep">Stay in touch</h2>
          <p className="mt-2 text-ink-muted">Subscribe for stories, events, and ways to serve.</p>
          <div className="mt-6 max-w-md">
            <NewsletterForm />
          </div>
        </Card>
      </div>
    </>
  )
}
