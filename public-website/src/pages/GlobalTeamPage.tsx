import { AboutHero } from '@/components/layout/AboutHero'
import { MediaPreview } from '@/components/ui/MediaPreview'
import { useState } from 'react'
import { SEO } from '@/components/ui/SEO'
import { Card } from '@/components/ui/Card'
import { useSiteConfig } from '@/contexts/SiteConfigContext'
import { stripHtml } from '@/data/siteCopy'

export function GlobalTeamPage() {
  const { copy } = useSiteConfig()
  const page = copy.globalTeam
  const members = page.members
  const regions = [...new Set(members.map((member) => member.region).filter(Boolean))]
  const [expanded, setExpanded] = useState<string | null>(regions[0] ?? null)

  return (
    <>
      <SEO title={page.heroTitle} description={page.heroSubtitle} path="/about/global-team" />
      <AboutHero title={page.heroTitle} subtitle={page.heroSubtitle} imageUrl={page.imageUrl} />
      <div className="about-body mx-auto max-w-4xl px-4 py-16 space-y-4">
        {regions.length ? regions.map((region) => {
          const group = members.filter((member) => member.region === region)
          const isOpen = expanded === region
          return (
            <div key={region} className="rounded-xl border border-mist-dark overflow-hidden">
              <button
                type="button"
                className="flex w-full items-center justify-between bg-white px-6 py-4 text-left font-display text-xl text-teal-deep hover:bg-mist"
                onClick={() => setExpanded(isOpen ? null : region)}
                aria-expanded={isOpen}
              >
                {region}
                <span aria-hidden="true">{isOpen ? '−' : '+'}</span>
              </button>
              {isOpen && (
                <div className="grid gap-4 bg-mist/50 p-6 sm:grid-cols-2">
                  {group.map((member) => (
                    <Card key={member.id}>
                      {member.imageUrl ? <MediaPreview src={member.imageUrl} alt={member.name} className="mb-3 h-16 w-16 rounded-full object-cover" /> : null}
                      <h3 className="font-semibold text-teal-deep">{member.name}</h3>
                      <p className="text-sm text-accent-ink">{member.title}</p>
                      {member.country ? <p className="text-xs text-ink-muted">{member.country}</p> : null}
                      <p className="mt-2 whitespace-pre-line text-sm text-ink-muted">{stripHtml(member.bio)}</p>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )
        }) : (
          <p className="text-center text-ink-muted">Global team members will appear here after they are published from Site pages.</p>
        )}
      </div>
    </>
  )
}
