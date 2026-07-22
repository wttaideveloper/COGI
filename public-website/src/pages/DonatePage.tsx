import { fallbackFAQs } from '@/data/fallback'
import { SEO } from '@/components/ui/SEO'
import { PageHero, Card } from '@/components/ui/Card'

const giveLivelyUrl = import.meta.env.VITE_GIVELIVELY_URL || 'https://secure.givelively.org/donate/companions-of-grace-international'

export function DonatePage() {
  return (
    <>
      <SEO title="Donate" description="Support missional healthcare training worldwide" path="/donate" />
      <PageHero title="Donate" subtitle="Partner financially to equip healthcare professionals for Kingdom engagement" />
      <div className="mx-auto max-w-4xl px-4 py-16">
        <Card className="mb-12 text-center">
          <h2 className="font-display text-2xl text-teal-deep">Give via GiveLively</h2>
          <p className="mt-4 text-ink-muted">
            Your generosity supports seminars, training programs, and Communities of Grace across 10+ countries.
            Choose one-time or recurring gifts through our secure donation platform.
          </p>
          <div className="mt-8 rounded-xl border-2 border-dashed border-mist-dark bg-mist/50 p-12">
            <p className="text-ink-muted">GiveLively embed placeholder</p>
            <p className="mt-2 text-sm text-ink-muted">Configure <code className="text-teal-deep">VITE_GIVELIVELY_URL</code> in your environment</p>
            <a
              href={giveLivelyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center justify-center rounded-md bg-gold px-8 py-4 text-lg font-semibold text-teal-deep hover:bg-gold-light"
            >
              Donate Now
            </a>
          </div>
        </Card>

        <h2 className="font-display text-2xl text-teal-deep mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {fallbackFAQs.filter((f) => f.category === 'Donate' || f.category === 'Partnerships').map((faq) => (
            <Card key={faq.id} as="article">
              <h3 className="font-semibold text-teal-deep">{faq.question}</h3>
              <p className="mt-2 text-ink-muted">{faq.answer}</p>
            </Card>
          ))}
        </div>
      </div>
    </>
  )
}
