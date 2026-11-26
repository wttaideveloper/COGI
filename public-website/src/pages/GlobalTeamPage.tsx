import { AboutHero } from '@/components/layout/AboutHero'
import { useRef, useState } from 'react'
import { SEO } from '@/components/ui/SEO'
import { useSiteConfig } from '@/contexts/SiteConfigContext'
import { stripHtml } from '@/data/siteCopy'

function TeamPhoto({ name, src }: { name: string; src?: string }) {
  const [failed, setFailed] = useState(false)
  return src && !failed ? <img src={src} alt={name} onError={() => setFailed(true)} loading="lazy" className="h-28 w-28 rounded-xl object-cover object-top" /> : <div className="flex h-28 w-28 flex-col items-center justify-center rounded-xl bg-mist text-teal-deep"><span aria-hidden="true" className="text-2xl">{name.split(' ').map(word => word[0]).slice(0, 2).join('')}</span><span className="mt-2 text-xs">Photo coming soon</span></div>
}

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
                        <li key={member.id} className="rounded-xl border border-mist-dark p-4">
                          <div className="mb-4"><TeamPhoto key={member.imageUrl || member.id} name={member.name} src={member.imageUrl} /></div>
                          <p className="font-semibold text-teal-deep">{member.name}</p>
                          <p className="mt-1 text-sm text-accent-ink">{member.title || 'Role details coming soon'}</p>
                          <h4 className="mt-4 text-sm font-semibold text-teal-deep">Responsibilities</h4>
                          <p className="mt-1 whitespace-pre-line text-sm text-ink-muted">{stripHtml(member.responsibilities) || 'Details coming soon.'}</p>
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
