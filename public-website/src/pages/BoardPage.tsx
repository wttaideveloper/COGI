import { MediaPreview } from '@/components/ui/MediaPreview'
import { useState } from 'react'
import { SEO } from '@/components/ui/SEO'
import { PageHero, Card } from '@/components/ui/Card'
import { Modal } from '@/components/ui/Modal'
import { useSiteConfig } from '@/contexts/SiteConfigContext'
import { stripHtml } from '@/data/siteCopy'

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export function BoardPage() {
  const { copy } = useSiteConfig()
  const page = copy.board
  const members = page.members
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = members.find((member) => member.id === selectedId) ?? null

  return (
    <>
      <SEO title={page.heroTitle} description={page.heroSubtitle} path="/about/board" />
      <PageHero title={page.heroTitle} subtitle={page.heroSubtitle} imageUrl={page.imageUrl} />
      <div className="mx-auto max-w-7xl px-4 py-16">
        {members.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {members.map((member) => (
              <div key={member.id} className="text-left">
                <Card className="h-full transition-shadow hover:shadow-md hover:border-gold/40">
                  {member.imageUrl ? (
                    <MediaPreview src={member.imageUrl} alt={member.name} className="mb-4 h-20 w-20 rounded-full object-cover" />
                  ) : (
                    <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full border border-mist-dark bg-white text-2xl font-display font-bold text-gold">
                      {initials(member.name) || '—'}
                    </div>
                  )}
                  <h2 className="font-display text-xl text-teal-deep">{member.name}</h2>
                  <p className="text-sm font-semibold text-gold">{member.title}</p>
                  {member.country ? <p className="mt-1 text-sm text-ink-muted">{member.country}</p> : null}
                  <p className="mt-3 line-clamp-3 whitespace-pre-line text-sm text-ink-muted">{stripHtml(member.bio)}</p>
                  <button type="button" onClick={() => setSelectedId(member.id)} className="mt-4 inline-block text-sm font-semibold text-teal-mid">Read full bio →</button>
                </Card>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-ink-muted">Board members will appear here after they are published from Site pages.</p>
        )}
      </div>
      <Modal isOpen={!!selected} onClose={() => setSelectedId(null)} title={selected?.name ?? ''}>
        {selected ? (
          <>
            <p className="font-semibold text-gold">{selected.title}</p>
            {selected.country ? <p className="text-sm text-ink-muted">{selected.country}</p> : null}
            <p className="mt-4 whitespace-pre-line leading-relaxed text-ink">{stripHtml(selected.bio)}</p>
          </>
        ) : null}
      </Modal>
    </>
  )
}
