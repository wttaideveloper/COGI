import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getGlobalTeam } from '@/api/team'
import { SEO } from '@/components/ui/SEO'
import { PageHero, Card } from '@/components/ui/Card'

export function GlobalTeamPage() {
  const { data: team } = useQuery({ queryKey: ['globalTeam'], queryFn: getGlobalTeam })
  const regions = [...new Set(team?.map((m) => m.region).filter(Boolean) as string[])]
  const [expanded, setExpanded] = useState<string | null>(regions[0] ?? null)

  return (
    <>
      <SEO title="Global Team" description="COGI team members by region" path="/about/global-team" />
      <PageHero title="Global Team" subtitle="Facilitators, mentors, and coordinators across our regions" />
      <div className="mx-auto max-w-4xl px-4 py-16 space-y-4">
        {regions.map((region) => {
          const members = team?.filter((m) => m.region === region) ?? []
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
                  {members.map((member) => (
                    <Card key={member.id}>
                      <h3 className="font-semibold text-teal-deep">{member.name}</h3>
                      <p className="text-sm text-gold">{member.title}</p>
                      {member.country && <p className="text-xs text-ink-muted">{member.country}</p>}
                      <p className="mt-2 text-sm text-ink-muted">{member.bio}</p>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </>
  )
}
