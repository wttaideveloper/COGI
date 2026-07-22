import { useQuery } from '@tanstack/react-query'
import { getGlobalSettings } from '@/api/globalSettings'
import { SEO } from '@/components/ui/SEO'
import { PageHero } from '@/components/ui/Card'
import { ButtonLink } from '@/components/ui/Button'

export function AboutPage() {
  const { data: settings } = useQuery({ queryKey: ['globalSettings'], queryFn: getGlobalSettings })

  return (
    <>
      <SEO title="About Us" description={settings?.vision} path="/about" />
      <PageHero title="About Us" subtitle="Vision, mission, and the heart of COGI" />
      <div className="mx-auto max-w-4xl px-4 py-16">
        <section className="mb-16">
          <h2 className="font-display text-3xl text-teal-deep">Our Vision</h2>
          <p className="mt-4 text-lg leading-relaxed text-ink">{settings?.vision}</p>
        </section>
        <section className="mb-16">
          <h2 className="font-display text-3xl text-teal-deep">Our Mission</h2>
          <p className="mt-4 text-lg leading-relaxed text-ink">{settings?.mission}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {settings?.scriptureRefs.map((ref) => (
              <span key={ref} className="rounded-full bg-mist-dark px-4 py-1 text-sm font-medium text-teal-deep">{ref}</span>
            ))}
          </div>
        </section>
        <div className="grid gap-4 sm:grid-cols-2">
          <ButtonLink to="/about/our-story" variant="outline">Our Story</ButtonLink>
          <ButtonLink to="/about/beliefs" variant="outline">Our Beliefs</ButtonLink>
          <ButtonLink to="/about/board" variant="outline">Board Members</ButtonLink>
          <ButtonLink to="/about/partners" variant="outline">Our Partners</ButtonLink>
        </div>
      </div>
    </>
  )
}
