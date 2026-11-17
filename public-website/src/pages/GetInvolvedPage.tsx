import { PhotoHero } from '@/components/layout/PhotoHero'
import { SEO } from '@/components/ui/SEO'
import { Card } from '@/components/ui/Card'
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
      <PhotoHero title={page.heroTitle} subtitle={page.heroSubtitle} imageUrl={page.imageUrl} />
      <div className="about-body mx-auto max-w-6xl">
        <div className="mb-16 grid gap-6 md:grid-cols-3">
          {page.pathways.map((p) => (
            <Card key={p.title} as="article">
              <h2 className="font-display text-2xl text-teal-deep">{p.title}</h2>
              <p className="mt-3 text-ink-muted">{p.body}</p>
            </Card>
          ))}
        </div>
        <div className="grid items-start gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Card>
          <h2 id="form" className="font-display text-2xl text-teal-deep">{page.formTitle}</h2>
          <p className="mt-2 text-ink-muted">{page.formIntro}</p>
          <div className="mt-8">
            <GetInvolvedForm submitLabel={page.submitLabel} />
          </div>
        </Card>
        <Card className="bg-mist-dark/40">
          <h2 className="font-display text-2xl text-teal-deep">{page.newsletterTitle}</h2>
          <p className="mt-2 text-ink-muted">{page.newsletterIntro}</p>
          <div className="mt-6 max-w-md">
            <NewsletterForm />
          </div>
        </Card>
        </div>
      </div>
    </>
  )
}
