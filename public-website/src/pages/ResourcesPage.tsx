import { Link } from 'react-router-dom'
import { SEO } from '@/components/ui/SEO'
import { PageHero, Card } from '@/components/ui/Card'

const resources = [
  { to: '/resources/stories', title: 'Stories of Transformation', description: 'Video and written stories from healthcare professionals around the world.' },
  { to: '/resources/testimonials', title: 'Testimonials', description: 'Written reflections from program participants and partners.' },
  { to: '/resources/blog', title: 'Blog', description: 'Articles on missional living, programs, and partnerships.' },
]

export function ResourcesPage() {
  return (
    <>
      <SEO title="Resources" description="Stories, testimonials, and blog from COGI" path="/resources" />
      <PageHero title="Resources" subtitle="Stories, testimonies, and insights from the COGI fellowship" />
      <div className="mx-auto max-w-5xl px-4 py-16 grid gap-6 md:grid-cols-3">
        {resources.map((r) => (
          <Link key={r.to} to={r.to}>
            <Card className="h-full hover:border-gold/50 hover:shadow-md transition-shadow">
              <h2 className="font-display text-xl text-teal-deep">{r.title}</h2>
              <p className="mt-3 text-ink-muted">{r.description}</p>
              <span className="mt-4 inline-block text-sm font-semibold text-teal-mid">Explore →</span>
            </Card>
          </Link>
        ))}
      </div>
    </>
  )
}
