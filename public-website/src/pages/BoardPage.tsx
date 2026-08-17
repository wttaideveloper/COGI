import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getBoardMembers } from '@/api/team'
import { SEO } from '@/components/ui/SEO'
import { PageHero, Card, Skeleton } from '@/components/ui/Card'
import { Modal } from '@/components/ui/Modal'
import type { TeamMember } from '@/types'
import { useSiteConfig } from '@/contexts/SiteConfigContext'

export function BoardPage() {
  const { data: members, isLoading } = useQuery({ queryKey: ['board'], queryFn: getBoardMembers })
  const [selected, setSelected] = useState<TeamMember | null>(null)
  const { copy } = useSiteConfig()
  const page = copy.board

  return (
    <>
      <SEO title={page.heroTitle} description={page.heroSubtitle} path="/about/board" />
      <PageHero title={page.heroTitle} subtitle={page.heroSubtitle} imageUrl={page.imageUrl} />
      <div className="mx-auto max-w-7xl px-4 py-16">
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-48" />)}</div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {members?.map((member) => (
              <button key={member.id} type="button" onClick={() => setSelected(member)} className="text-left">
                <Card className="h-full transition-shadow hover:shadow-md hover:border-gold/40">
                  <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-teal-gradient text-2xl font-display font-bold text-white">
                    {member.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </div>
                  <h2 className="font-display text-xl text-teal-deep">{member.name}</h2>
                  <p className="text-sm font-semibold text-gold">{member.title}</p>
                  {member.country && <p className="mt-1 text-sm text-ink-muted">{member.country}</p>}
                  <p className="mt-3 line-clamp-3 text-sm text-ink-muted">{member.bio}</p>
                  <span className="mt-4 inline-block text-sm font-semibold text-teal-mid">Read full bio →</span>
                </Card>
              </button>
            ))}
          </div>
        )}
      </div>
      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title={selected?.name ?? ''}>
        {selected && (
          <>
            <p className="font-semibold text-gold">{selected.title}</p>
            {selected.country && <p className="text-sm text-ink-muted">{selected.country}</p>}
            <p className="mt-4 leading-relaxed text-ink">{selected.bio}</p>
          </>
        )}
      </Modal>
    </>
  )
}
