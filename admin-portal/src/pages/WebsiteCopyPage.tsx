import { useEffect, useState, type ReactNode } from 'react'
import { defaultSiteCopy, mergeSiteCopy, type CopyBlock, type SiteCopy } from '@/data/siteCopy'
import { hydrateSiteConfigFromStrapi, saveSiteConfig } from '@/services/siteConfigStore'
import { getErrorMessage } from '@/services/strapi'

const TABS = [
  { id: 'homepage', label: 'Homepage' },
  { id: 'about', label: 'About' },
  { id: 'story', label: 'Our Story' },
  { id: 'beliefs', label: 'Beliefs' },
  { id: 'involved', label: 'Get Involved' },
  { id: 'donate', label: 'Donate' },
  { id: 'resources', label: 'Resources' },
  { id: 'contact', label: 'Contact' },
  { id: 'listings', label: 'Listing pages' },
] as const

type TabId = (typeof TABS)[number]['id']

function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="admin-label">{label}</span>
      {children}
      {hint ? <span className="mt-1 block text-xs text-slate-500">{hint}</span> : null}
    </label>
  )
}

function TextInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return <input className="admin-input" value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
}

function TextArea({ value, onChange, rows = 4 }: { value: string; onChange: (v: string) => void; rows?: number }) {
  return <textarea className="admin-input" rows={rows} value={value} onChange={(e) => onChange(e.target.value)} />
}

function ImageField({ label, value, onChange }: { label: string; value?: string; onChange: (v: string) => void }) {
  return (
    <div>
      <Field label={label} hint="Paste a photo URL from the media library, such as /images/cogi-hero.png.">
        <TextInput value={value || ''} onChange={onChange} placeholder="/images/cogi-hero.png" />
      </Field>
      {value ? <img src={value} alt="" className="mt-2 h-28 w-full rounded-lg object-cover" /> : null}
    </div>
  )
}

function PublishActions({
  pending,
  pendingStatus,
  onSave,
}: {
  pending: boolean
  pendingStatus: 'draft' | 'published' | null
  onSave: (status: 'draft' | 'published') => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <button type="button" className="btn-secondary" disabled={pending} onClick={() => onSave('draft')}>
        {pending && pendingStatus === 'draft' ? 'Saving draft…' : 'Save as draft'}
      </button>
      <button type="button" className="btn-primary" disabled={pending} onClick={() => onSave('published')}>
        {pending && pendingStatus === 'published' ? 'Publishing…' : 'Publish live'}
      </button>
    </div>
  )
}

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="admin-card space-y-4 p-5">
      <h3 className="font-bold text-[var(--color-primary)]">{title}</h3>
      {children}
    </div>
  )
}

function HeroFields({
  title,
  heroTitle,
  heroSubtitle,
  imageUrl,
  onChange,
}: {
  title: string
  heroTitle: string
  heroSubtitle: string
  imageUrl?: string
  onChange: (patch: { heroTitle?: string; heroSubtitle?: string; imageUrl?: string }) => void
}) {
  return (
    <Card title={title}>
      <Field label="Page title"><TextInput value={heroTitle} onChange={(v) => onChange({ heroTitle: v })} /></Field>
      <Field label="Subtitle"><TextArea value={heroSubtitle} onChange={(v) => onChange({ heroSubtitle: v })} rows={2} /></Field>
      <ImageField label="Hero image URL" value={imageUrl} onChange={(v) => onChange({ imageUrl: v })} />
    </Card>
  )
}

export default function WebsiteCopyPage() {
  const [copy, setCopy] = useState<SiteCopy>(defaultSiteCopy)
  const [tab, setTab] = useState<TabId>('homepage')
  const [savedAs, setSavedAs] = useState<'draft' | 'published' | null>(null)
  const [pending, setPending] = useState<'draft' | 'published' | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    hydrateSiteConfigFromStrapi().then((config) => {
      if (active) setCopy(mergeSiteCopy(config.copy))
    })
    return () => { active = false }
  }, [])

  async function save(status: 'draft' | 'published') {
    setPending(status)
    setError(null)
    try {
      await saveSiteConfig({ copy }, status)
      setSavedAs(status)
      window.setTimeout(() => setSavedAs(null), 4000)
    } catch (err) {
      setError(`Could not ${status === 'published' ? 'publish' : 'save'} to Strapi: ${getErrorMessage(err)}`)
    } finally {
      setPending(null)
    }
  }

  function patch<K extends keyof SiteCopy>(key: K, value: SiteCopy[K]) {
    setCopy((prev) => ({ ...prev, [key]: value }))
  }

  const home = copy.homepage

  return (
    <>
      <div className="mb-2 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-[var(--color-primary)]">Website copy</h2>
          <p className="mt-1 max-w-3xl text-sm text-slate-600">
            Edit every public page headline, body, and photo. Draft privately, then Publish live so the website updates immediately.
          </p>
        </div>
        <PublishActions pending={Boolean(pending)} pendingStatus={pending} onSave={save} />
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={tab === item.id ? 'btn-primary' : 'btn-secondary'}
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </button>
        ))}
        <button type="button" className="btn-secondary" onClick={() => setCopy(structuredClone(defaultSiteCopy))}>
          Restore defaults
        </button>
      </div>

      {error ? <p className="mb-4 text-sm font-semibold text-red-700">{error}</p> : null}
      {savedAs === 'draft' ? <p className="mb-4 text-sm font-semibold text-amber-700">Draft saved in Strapi — not live until you Publish.</p> : null}
      {savedAs === 'published' ? <p className="mb-4 text-sm font-semibold text-emerald-700">Published live — the public website updates immediately.</p> : null}

      <div className="space-y-5">
        {tab === 'homepage' && (
          <>
            <Card title="Hero overlay">
              <Field label="Eyebrow"><TextInput value={home.eyebrow} onChange={(v) => patch('homepage', { ...home, eyebrow: v })} /></Field>
              <Field label="Secondary CTA label"><TextInput value={home.secondaryCtaLabel} onChange={(v) => patch('homepage', { ...home, secondaryCtaLabel: v })} /></Field>
              <Field label="Secondary CTA link"><TextInput value={home.secondaryCtaHref} onChange={(v) => patch('homepage', { ...home, secondaryCtaHref: v })} /></Field>
              <p className="text-xs text-slate-500">Headline, intro, primary button, and hero photos are edited on the Homepage screen.</p>
            </Card>
            <Card title="Newsletter banner">
              <Field label="Title"><TextInput value={home.newsletterBannerTitle} onChange={(v) => patch('homepage', { ...home, newsletterBannerTitle: v })} /></Field>
              <Field label="Body"><TextArea value={home.newsletterBannerBody} onChange={(v) => patch('homepage', { ...home, newsletterBannerBody: v })} /></Field>
              <Field label="Button"><TextInput value={home.newsletterBannerCta} onChange={(v) => patch('homepage', { ...home, newsletterBannerCta: v })} /></Field>
            </Card>
            <Card title="Legacy band">
              <Field label="Title"><TextInput value={home.legacyTitle} onChange={(v) => patch('homepage', { ...home, legacyTitle: v })} /></Field>
              <Field label="Body"><TextArea value={home.legacyBody} onChange={(v) => patch('homepage', { ...home, legacyBody: v })} rows={5} /></Field>
            </Card>
            <Card title="Video / photo">
              <Field label="Title"><TextInput value={home.videoTitle} onChange={(v) => patch('homepage', { ...home, videoTitle: v })} /></Field>
              <Field label="Description"><TextArea value={home.videoDescription} onChange={(v) => patch('homepage', { ...home, videoDescription: v })} /></Field>
              <ImageField label="Photo URL" value={home.videoImageUrl} onChange={(v) => patch('homepage', { ...home, videoImageUrl: v })} />
              <Field label="Video URL"><TextInput value={home.videoUrl} onChange={(v) => patch('homepage', { ...home, videoUrl: v })} /></Field>
            </Card>
            <Card title="Section headings">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Methods title"><TextInput value={home.methodsTitle} onChange={(v) => patch('homepage', { ...home, methodsTitle: v })} /></Field>
                <Field label="Methods subtitle"><TextInput value={home.methodsSubtitle} onChange={(v) => patch('homepage', { ...home, methodsSubtitle: v })} /></Field>
                <Field label="Portfolio title"><TextInput value={home.portfolioTitle} onChange={(v) => patch('homepage', { ...home, portfolioTitle: v })} /></Field>
                <Field label="Portfolio subtitle"><TextInput value={home.portfolioSubtitle} onChange={(v) => patch('homepage', { ...home, portfolioSubtitle: v })} /></Field>
                <Field label="Map title"><TextInput value={home.mapTitle} onChange={(v) => patch('homepage', { ...home, mapTitle: v })} /></Field>
                <Field label="Map subtitle"><TextInput value={home.mapSubtitle} onChange={(v) => patch('homepage', { ...home, mapSubtitle: v })} /></Field>
                <Field label="Stories title"><TextInput value={home.storiesTitle} onChange={(v) => patch('homepage', { ...home, storiesTitle: v })} /></Field>
                <Field label="Stories subtitle"><TextInput value={home.storiesSubtitle} onChange={(v) => patch('homepage', { ...home, storiesSubtitle: v })} /></Field>
                <Field label="Watch stories button"><TextInput value={home.watchStoriesCta} onChange={(v) => patch('homepage', { ...home, watchStoriesCta: v })} /></Field>
                <Field label="Read stories button"><TextInput value={home.readStoriesCta} onChange={(v) => patch('homepage', { ...home, readStoriesCta: v })} /></Field>
                <Field label="Impact title"><TextInput value={home.impactTitle} onChange={(v) => patch('homepage', { ...home, impactTitle: v })} /></Field>
                <Field label="Impact intro"><TextArea value={home.impactIntro} onChange={(v) => patch('homepage', { ...home, impactIntro: v })} /></Field>
              </div>
            </Card>
            <Card title="Statement of faith">
              <Field label="Title"><TextInput value={home.faithTitle} onChange={(v) => patch('homepage', { ...home, faithTitle: v })} /></Field>
              <Field label="Statement"><TextArea value={home.faithStatement} onChange={(v) => patch('homepage', { ...home, faithStatement: v })} rows={6} /></Field>
            </Card>
          </>
        )}

        {tab === 'about' && (
          <HeroFields
            title="About page"
            heroTitle={copy.about.heroTitle}
            heroSubtitle={copy.about.heroSubtitle}
            imageUrl={copy.about.imageUrl}
            onChange={(p) => patch('about', { ...copy.about, ...p })}
          />
        )}
        {tab === 'about' && (
          <Card title="Section titles">
            <Field label="Vision heading"><TextInput value={copy.about.visionTitle} onChange={(v) => patch('about', { ...copy.about, visionTitle: v })} /></Field>
            <Field label="Mission heading"><TextInput value={copy.about.missionTitle} onChange={(v) => patch('about', { ...copy.about, missionTitle: v })} /></Field>
            <p className="text-xs text-slate-500">Vision and mission body text come from Settings → organization identity.</p>
          </Card>
        )}

        {tab === 'story' && (
          <>
            <HeroFields
              title="Our story"
              heroTitle={copy.story.heroTitle}
              heroSubtitle={copy.story.heroSubtitle}
              imageUrl={copy.story.imageUrl}
              onChange={(p) => patch('story', { ...copy.story, ...p, imageUrl: p.imageUrl ?? copy.story.imageUrl })}
            />
            <Card title="Introduction">
              <Field label="Intro"><TextArea value={copy.story.intro} onChange={(v) => patch('story', { ...copy.story, intro: v })} rows={5} /></Field>
            </Card>
            <Card title="Timeline">
              {copy.story.milestones.map((item, index) => (
                <div key={`${item.year}-${index}`} className="grid gap-3 rounded-xl border border-[var(--color-border)] p-3 md:grid-cols-[100px_1fr_auto]">
                  <Field label="Year"><TextInput value={item.year} onChange={(v) => {
                    const milestones = copy.story.milestones.map((row, i) => (i === index ? { ...row, year: v } : row))
                    patch('story', { ...copy.story, milestones })
                  }} /></Field>
                  <div className="space-y-3">
                    <Field label="Title"><TextInput value={item.title} onChange={(v) => {
                      const milestones = copy.story.milestones.map((row, i) => (i === index ? { ...row, title: v } : row))
                      patch('story', { ...copy.story, milestones })
                    }} /></Field>
                    <Field label="Description"><TextArea value={item.description} onChange={(v) => {
                      const milestones = copy.story.milestones.map((row, i) => (i === index ? { ...row, description: v } : row))
                      patch('story', { ...copy.story, milestones })
                    }} rows={3} /></Field>
                  </div>
                  <button type="button" className="btn-danger self-start" onClick={() => patch('story', { ...copy.story, milestones: copy.story.milestones.filter((_, i) => i !== index) })}>Remove</button>
                </div>
              ))}
              <button type="button" className="btn-secondary" onClick={() => patch('story', { ...copy.story, milestones: [...copy.story.milestones, { year: '', title: '', description: '' }] })}>Add milestone</button>
            </Card>
          </>
        )}

        {tab === 'beliefs' && (
          <>
            <HeroFields
              title="Our beliefs"
              heroTitle={copy.beliefs.heroTitle}
              heroSubtitle={copy.beliefs.heroSubtitle}
              imageUrl={copy.beliefs.imageUrl}
              onChange={(p) => patch('beliefs', { ...copy.beliefs, ...p })}
            />
            <Card title="Introduction">
              <Field label="Intro"><TextArea value={copy.beliefs.intro} onChange={(v) => patch('beliefs', { ...copy.beliefs, intro: v })} /></Field>
            </Card>
            <Card title="Beliefs">
              {copy.beliefs.items.map((item, index) => (
                <div key={item.id || index} className="space-y-3 rounded-xl border border-[var(--color-border)] p-3">
                  <div className="grid gap-3 md:grid-cols-[1fr_auto]">
                    <Field label="Title"><TextInput value={item.title} onChange={(v) => {
                      const items = copy.beliefs.items.map((row, i) => (i === index ? { ...row, title: v } : row))
                      patch('beliefs', { ...copy.beliefs, items })
                    }} /></Field>
                    <button type="button" className="btn-danger self-end" onClick={() => patch('beliefs', { ...copy.beliefs, items: copy.beliefs.items.filter((_, i) => i !== index) })}>Remove</button>
                  </div>
                  <Field label="Content"><TextArea value={item.content} onChange={(v) => {
                    const items = copy.beliefs.items.map((row, i) => (i === index ? { ...row, content: v } : row))
                    patch('beliefs', { ...copy.beliefs, items })
                  }} /></Field>
                </div>
              ))}
              <button type="button" className="btn-secondary" onClick={() => patch('beliefs', { ...copy.beliefs, items: [...copy.beliefs.items, { id: `belief-${Date.now()}`, title: '', content: '' }] })}>Add belief</button>
            </Card>
          </>
        )}

        {tab === 'involved' && (
          <>
            <HeroFields
              title="Get involved"
              heroTitle={copy.getInvolved.heroTitle}
              heroSubtitle={copy.getInvolved.heroSubtitle}
              imageUrl={copy.getInvolved.imageUrl}
              onChange={(p) => patch('getInvolved', { ...copy.getInvolved, ...p, imageUrl: p.imageUrl ?? copy.getInvolved.imageUrl })}
            />
            <Card title="Form">
              <Field label="Form title"><TextInput value={copy.getInvolved.formTitle} onChange={(v) => patch('getInvolved', { ...copy.getInvolved, formTitle: v })} /></Field>
              <Field label="Form intro"><TextArea value={copy.getInvolved.formIntro} onChange={(v) => patch('getInvolved', { ...copy.getInvolved, formIntro: v })} rows={2} /></Field>
            </Card>
            <Card title="Pathways">
              {copy.getInvolved.pathways.map((item, index) => (
                <BlockEditor
                  key={index}
                  block={item}
                  onChange={(block) => {
                    const pathways = copy.getInvolved.pathways.map((row, i) => (i === index ? block : row))
                    patch('getInvolved', { ...copy.getInvolved, pathways })
                  }}
                  onRemove={() => patch('getInvolved', { ...copy.getInvolved, pathways: copy.getInvolved.pathways.filter((_, i) => i !== index) })}
                />
              ))}
              <button type="button" className="btn-secondary" onClick={() => patch('getInvolved', { ...copy.getInvolved, pathways: [...copy.getInvolved.pathways, { title: '', body: '' }] })}>Add pathway</button>
            </Card>
          </>
        )}

        {tab === 'donate' && (
          <>
            <HeroFields
              title="Donate"
              heroTitle={copy.donate.heroTitle}
              heroSubtitle={copy.donate.heroSubtitle}
              imageUrl={copy.donate.imageUrl}
              onChange={(p) => patch('donate', { ...copy.donate, ...p, imageUrl: p.imageUrl ?? copy.donate.imageUrl })}
            />
            <Card title="Ways to give">
              <Field label="Intro"><TextArea value={copy.donate.intro} onChange={(v) => patch('donate', { ...copy.donate, intro: v })} /></Field>
              <Field label="Online title"><TextInput value={copy.donate.giveTitle} onChange={(v) => patch('donate', { ...copy.donate, giveTitle: v })} /></Field>
              <Field label="Online body"><TextArea value={copy.donate.giveBody} onChange={(v) => patch('donate', { ...copy.donate, giveBody: v })} /></Field>
              <Field label="Give button"><TextInput value={copy.donate.giveCta} onChange={(v) => patch('donate', { ...copy.donate, giveCta: v })} /></Field>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Field label="Mail title"><TextInput value={copy.donate.mailTitle} onChange={(v) => patch('donate', { ...copy.donate, mailTitle: v })} /></Field>
                  <Field label="Mail body"><TextArea value={copy.donate.mailBody} onChange={(v) => patch('donate', { ...copy.donate, mailBody: v })} /></Field>
                </div>
                <div>
                  <Field label="Stock title"><TextInput value={copy.donate.stockTitle} onChange={(v) => patch('donate', { ...copy.donate, stockTitle: v })} /></Field>
                  <Field label="Stock body"><TextArea value={copy.donate.stockBody} onChange={(v) => patch('donate', { ...copy.donate, stockBody: v })} /></Field>
                </div>
                <div>
                  <Field label="Legacy title"><TextInput value={copy.donate.legacyTitle} onChange={(v) => patch('donate', { ...copy.donate, legacyTitle: v })} /></Field>
                  <Field label="Legacy body"><TextArea value={copy.donate.legacyBody} onChange={(v) => patch('donate', { ...copy.donate, legacyBody: v })} /></Field>
                </div>
              </div>
              <Field label="FAQ heading"><TextInput value={copy.donate.faqTitle} onChange={(v) => patch('donate', { ...copy.donate, faqTitle: v })} /></Field>
            </Card>
          </>
        )}

        {tab === 'resources' && (
          <>
            <HeroFields
              title="Resources hub"
              heroTitle={copy.resources.heroTitle}
              heroSubtitle={copy.resources.heroSubtitle}
              onChange={(p) => patch('resources', { ...copy.resources, ...p })}
            />
            <Card title="Resource cards">
              {copy.resources.cards.map((item, index) => (
                <BlockEditor
                  key={index}
                  block={item}
                  showLink
                  showImage
                  onChange={(block) => {
                    const cards = copy.resources.cards.map((row, i) => (i === index ? block : row))
                    patch('resources', { ...copy.resources, cards })
                  }}
                  onRemove={() => patch('resources', { ...copy.resources, cards: copy.resources.cards.filter((_, i) => i !== index) })}
                />
              ))}
              <button type="button" className="btn-secondary" onClick={() => patch('resources', { ...copy.resources, cards: [...copy.resources.cards, { title: '', body: '', href: '' }] })}>Add card</button>
            </Card>
          </>
        )}

        {tab === 'contact' && (
          <>
            <HeroFields
              title="Contact"
              heroTitle={copy.contact.heroTitle}
              heroSubtitle={copy.contact.heroSubtitle}
              imageUrl={copy.contact.imageUrl}
              onChange={(p) => patch('contact', { ...copy.contact, ...p })}
            />
            <Card title="Page labels">
              <Field label="Form title"><TextInput value={copy.contact.formTitle} onChange={(v) => patch('contact', { ...copy.contact, formTitle: v })} /></Field>
              <Field label="Info title"><TextInput value={copy.contact.infoTitle} onChange={(v) => patch('contact', { ...copy.contact, infoTitle: v })} /></Field>
              <Field label="Social title"><TextInput value={copy.contact.socialTitle} onChange={(v) => patch('contact', { ...copy.contact, socialTitle: v })} /></Field>
              <Field label="Map note"><TextInput value={copy.contact.mapNote} onChange={(v) => patch('contact', { ...copy.contact, mapNote: v })} /></Field>
            </Card>
          </>
        )}

        {tab === 'listings' && (
          <>
            <HeroFields title="Programs" heroTitle={copy.programs.heroTitle} heroSubtitle={copy.programs.heroSubtitle} imageUrl={copy.programs.imageUrl} onChange={(p) => patch('programs', { ...copy.programs, ...p })} />
            <Card title="Program buttons">
              <Field label="Learn more"><TextInput value={copy.programs.learnMore} onChange={(v) => patch('programs', { ...copy.programs, learnMore: v })} /></Field>
              <Field label="Express interest"><TextInput value={copy.programs.expressInterest} onChange={(v) => patch('programs', { ...copy.programs, expressInterest: v })} /></Field>
            </Card>
            <HeroFields title="Events" heroTitle={copy.events.heroTitle} heroSubtitle={copy.events.heroSubtitle} imageUrl={copy.events.imageUrl} onChange={(p) => patch('events', { ...copy.events, ...p })} />
            <HeroFields title="Board" heroTitle={copy.board.heroTitle} heroSubtitle={copy.board.heroSubtitle} imageUrl={copy.board.imageUrl} onChange={(p) => patch('board', { ...copy.board, ...p })} />
            <HeroFields title="Global team" heroTitle={copy.globalTeam.heroTitle} heroSubtitle={copy.globalTeam.heroSubtitle} imageUrl={copy.globalTeam.imageUrl} onChange={(p) => patch('globalTeam', { ...copy.globalTeam, ...p })} />
            <HeroFields title="Partners" heroTitle={copy.partners.heroTitle} heroSubtitle={copy.partners.heroSubtitle} imageUrl={copy.partners.imageUrl} onChange={(p) => patch('partners', { ...copy.partners, ...p })} />
            <HeroFields title="Stories" heroTitle={copy.storiesPage.heroTitle} heroSubtitle={copy.storiesPage.heroSubtitle} imageUrl={copy.storiesPage.imageUrl} onChange={(p) => patch('storiesPage', { ...copy.storiesPage, ...p })} />
            <HeroFields title="Testimonials" heroTitle={copy.testimonials.heroTitle} heroSubtitle={copy.testimonials.heroSubtitle} imageUrl={copy.testimonials.imageUrl} onChange={(p) => patch('testimonials', { ...copy.testimonials, ...p })} />
            <HeroFields title="Blog" heroTitle={copy.blog.heroTitle} heroSubtitle={copy.blog.heroSubtitle} imageUrl={copy.blog.imageUrl} onChange={(p) => patch('blog', { ...copy.blog, ...p })} />
            <Card title="Blog note">
              <Field label="Optional footnote"><TextInput value={copy.blog.migrationNote} onChange={(v) => patch('blog', { ...copy.blog, migrationNote: v })} /></Field>
            </Card>
            <HeroFields title="Search" heroTitle={copy.search.heroTitle} heroSubtitle={copy.search.heroSubtitle} onChange={(p) => patch('search', { ...copy.search, ...p })} />
            <Card title="Search form">
              <Field label="Placeholder"><TextInput value={copy.search.placeholder} onChange={(v) => patch('search', { ...copy.search, placeholder: v })} /></Field>
              <Field label="Button"><TextInput value={copy.search.button} onChange={(v) => patch('search', { ...copy.search, button: v })} /></Field>
            </Card>
          </>
        )}
      </div>
    </>
  )
}

function BlockEditor({
  block,
  onChange,
  onRemove,
  showLink,
  showImage,
}: {
  block: CopyBlock
  onChange: (block: CopyBlock) => void
  onRemove: () => void
  showLink?: boolean
  showImage?: boolean
}) {
  return (
    <div className="space-y-3 rounded-xl border border-[var(--color-border)] p-3">
      <div className="grid gap-3 md:grid-cols-[1fr_auto]">
        <Field label="Title"><TextInput value={block.title} onChange={(v) => onChange({ ...block, title: v })} /></Field>
        <button type="button" className="btn-danger self-end" onClick={onRemove}>Remove</button>
      </div>
      <Field label="Body"><TextArea value={block.body} onChange={(v) => onChange({ ...block, body: v })} /></Field>
      {showLink ? <Field label="Link"><TextInput value={block.href || ''} onChange={(v) => onChange({ ...block, href: v })} /></Field> : null}
      {showImage ? <ImageField label="Image URL" value={block.imageUrl} onChange={(v) => onChange({ ...block, imageUrl: v })} /> : null}
    </div>
  )
}
