import { MediaPreview } from '@/components/ui/MediaPreview'
import { SEO } from '@/components/ui/SEO'
import { PageHero, Card } from '@/components/ui/Card'
import { NewsletterForm } from '@/components/forms/NewsletterForm'
import { useSiteConfig } from '@/contexts/SiteConfigContext'

const giveLivelyUrl = import.meta.env.VITE_GIVELIVELY_URL || 'https://secure.givelively.org/donate/companions-of-grace-international'

export function DonatePage() {
  const { copy } = useSiteConfig()
  const page = copy.donate

  return (
    <>
      <SEO title={page.heroTitle} description={page.intro} path="/donate" />
      <PageHero title={page.heroTitle} subtitle={page.heroSubtitle} imageUrl={page.imageUrl} />
      <div className="mx-auto max-w-4xl px-4 py-16">
        <p className="mb-10 text-lg leading-relaxed text-ink">{page.intro}</p>
        <Card className="mb-10 overflow-hidden p-0">
          {page.imageUrl ? <MediaPreview src={page.imageUrl} alt={page.heroTitle} className="h-64 w-full object-cover" /> : null}
          <div className="p-6 text-center">
            <h2 className="font-display text-2xl text-teal-deep">{page.giveTitle}</h2>
            <p className="mt-4 text-ink-muted">{page.giveBody}</p>
            <a
              href={page.giveUrl || giveLivelyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center justify-center rounded-md bg-gold px-8 py-4 text-lg font-semibold text-white hover:bg-gold-light"
            >
              {page.giveCta}
            </a>
          </div>
        </Card>

        <div className="mb-12 grid gap-6 md:grid-cols-3">
          <Card as="article">
            <h3 className="font-display text-xl text-teal-deep">{page.mailTitle}</h3>
            <p className="mt-3 text-sm text-ink-muted">{page.mailBody}</p>
          </Card>
          <Card as="article">
            <h3 className="font-display text-xl text-teal-deep">{page.stockTitle}</h3>
            <p className="mt-3 text-sm text-ink-muted">{page.stockBody}</p>
          </Card>
          <Card as="article">
            <h3 className="font-display text-xl text-teal-deep">{page.legacyTitle}</h3>
            <p className="mt-3 text-sm text-ink-muted">{page.legacyBody}</p>
          </Card>
        </div>

        {page.faqTitle ? (
          <>
            <h2 id="faqs" className="mb-6 font-display text-2xl text-teal-deep">{page.faqTitle}</h2>
            <div className="space-y-4">
              {(page.faqs?.length ? page.faqs : []).map((faq) => (
                <Card key={faq.id} as="article">
                  <h3 className="font-semibold text-teal-deep">{faq.question}</h3>
                  <p className="mt-2 text-ink-muted">{faq.answer}</p>
                </Card>
              ))}
            </div>
          </>
        ) : null}
        <Card className="mt-12">
          <h2 className="font-display text-2xl text-teal-deep">Stay connected</h2>
          <p className="mt-2 text-ink-muted">Subscribe for stories of transformation and ways to give.</p>
          <div className="mt-6 max-w-md">
            <NewsletterForm />
          </div>
        </Card>
      </div>
    </>
  )
}
