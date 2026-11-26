import { AboutHero } from '@/components/layout/AboutHero'
import { useState } from 'react'
import { SEO } from '@/components/ui/SEO'
import { Card } from '@/components/ui/Card'
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

function BoardPortrait({ name, src }: { name: string; src?: string }) {
  const [failed, setFailed] = useState(false)
  return src && !failed ? (
    <img src={src} alt={name} onError={() => setFailed(true)} className="aspect-[4/5] w-full rounded-xl object-cover object-top" />
  ) : (
    <div className="flex aspect-[4/5] w-full flex-col items-center justify-center gap-3 rounded-xl bg-mist text-teal-deep">
      <span aria-hidden="true" className="font-display text-4xl">{initials(name)}</span>
      <span className="text-sm">Photograph coming soon</span>
    </div>
  )
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
      <AboutHero title={page.heroTitle} subtitle={page.heroSubtitle} imageUrl={page.imageUrl} />
      <div className="about-body mx-auto max-w-7xl px-4 py-16">
        {members.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {members.map((member) => (
              <div key={member.id} className="text-left">
                <Card className="h-full transition-shadow hover:shadow-md hover:border-gold/40">
                  <button type="button" onClick={() => setSelectedId(member.id)} className="mb-5 block w-full rounded-xl text-left focus-visible:outline-2 focus-visible:outline-offset-4" aria-label={`Open photograph and profile for ${member.name}`}>
                    <BoardPortrait key={member.imageUrl || member.id} name={member.name} src={member.imageUrl} />
                  </button>
                  <h2 className="font-display text-xl text-teal-deep"><button type="button" onClick={() => setSelectedId(member.id)} className="text-left hover:underline" aria-label={`View profile for ${member.name}`}>{member.name}</button></h2>
                  <p className="text-sm font-semibold text-accent-ink">{member.title}</p>
                  {member.country ? <p className="mt-1 text-sm text-ink-muted">{member.country}</p> : null}
                  <p className="mt-3 line-clamp-3 whitespace-pre-line text-sm text-ink-muted">{stripHtml(member.bio)}</p>

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
          <div className="grid gap-6 sm:grid-cols-[160px_1fr]">
            <div className="mx-auto w-40 sm:mx-0"><BoardPortrait key={selected.imageUrl || selected.id} name={selected.name} src={selected.imageUrl} /></div>
            <div><p className="font-semibold text-accent-ink">{selected.title}</p>
            {selected.country ? <p className="text-sm text-ink-muted">{selected.country}</p> : null}
            <p className="mt-4 whitespace-pre-line leading-relaxed text-ink">{stripHtml(selected.bio)}</p></div>
          </div>
        ) : null}
      </Modal>
    </>
  )
}
