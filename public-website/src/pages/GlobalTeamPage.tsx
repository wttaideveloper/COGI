import { AboutHero } from '@/components/layout/AboutHero'
import { MediaPreview } from '@/components/ui/MediaPreview'
import { useRef } from 'react'
import { SEO } from '@/components/ui/SEO'
import { useSiteConfig } from '@/contexts/SiteConfigContext'
import { stripHtml } from '@/data/siteCopy'

export function GlobalTeamPage() {
  const { copy } = useSiteConfig()
  const page = copy.globalTeam
  const track = useRef<HTMLDivElement>(null)
  const regions = [...new Set(page.members.map(member => member.region).filter(Boolean))]
  const scroll = (direction: number) => {
    const node = track.current
    if (!node) return
    const card = node.firstElementChild as HTMLElement | null
    node.scrollBy({ left: direction * ((card?.offsetWidth || node.clientWidth) + 24), behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  }
  return (
    <>
      <SEO title={page.heroTitle} description={page.heroSubtitle} path="/about/global-team" />
      <AboutHero title={page.heroTitle} subtitle={page.heroSubtitle} imageUrl={page.imageUrl} />
      <div className="about-body mx-auto max-w-7xl px-4 py-16">
        <div className="mb-6 flex justify-end gap-3">
          <button type="button" onClick={() => scroll(-1)} className="rounded-full border border-mist-dark px-5 py-3" aria-label="Previous region">←</button>
          <button type="button" onClick={() => scroll(1)} className="rounded-full border border-mist-dark px-5 py-3" aria-label="Next region">→</button>
        </div>
        <div ref={track} className="region-track" tabIndex={0} aria-label="Regional teams">
          {regions.map(region => {
            const members = page.members.filter(member => member.region === region)
            const countries = [...new Set(members.map(member => member.country))]
            return (
              <section key={region} className="rounded-xl border border-mist-dark bg-white p-6">
                <h2 className="font-display text-3xl text-teal-deep">{region}</h2>
                {countries.map(country => (
                  <div key={country} className="mt-8">
                    <h3 className="border-b border-mist-dark pb-3 text-lg font-semibold text-teal-deep">{country}</h3>
                    <ul className="mt-4 grid gap-4 sm:grid-cols-2">
                      {members.filter(member => member.country === country).map(member => (
                        <li key={member.id}>
                          {member.imageUrl && <MediaPreview src={member.imageUrl} alt={member.name} className="mb-3 h-20 w-20 rounded-full object-cover" />}
                          <p className="font-semibold text-teal-deep">{member.name}</p>
                          {member.title && <p className="text-sm text-ink-muted">{member.title}</p>}
                          {member.bio && <p className="mt-2 text-sm text-ink-muted">{stripHtml(member.bio)}</p>}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </section>
            )
          })}
        </div>
      </div>
    </>
  )
}
