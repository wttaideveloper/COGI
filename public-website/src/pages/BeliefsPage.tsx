import { fallbackBeliefs } from '@/data/fallback'
import { SEO } from '@/components/ui/SEO'
import { PageHero, Card } from '@/components/ui/Card'

export function BeliefsPage() {
  return (
    <>
      <SEO title="Our Beliefs" description="Statement of faith for Companions of Grace International" path="/about/beliefs" />
      <PageHero title="Our Beliefs" subtitle="Essential beliefs underlying our mission and purpose" />
      <div className="mx-auto max-w-4xl px-4 py-16">
        <p className="mb-12 text-lg text-ink-muted">
          We generate this statement of beliefs not to exhaustively cover the myriad of theological topics that might be addressed in such an exercise, but simply to state the essential beliefs that underlie our mission and purpose.
        </p>
        <div className="space-y-6">
          {fallbackBeliefs.map((belief) => (
            <Card key={belief.id} as="article">
              <h2 className="font-display text-xl text-teal-deep">{belief.title}</h2>
              <p className="mt-3 leading-relaxed text-ink-muted">{belief.content}</p>
            </Card>
          ))}
        </div>
      </div>
    </>
  )
}
