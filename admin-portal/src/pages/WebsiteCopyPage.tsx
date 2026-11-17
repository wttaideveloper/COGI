import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { IMAGE_HINT, MediaUpload } from '@/components/MediaUpload'
import { defaultSiteCopy, mergeSiteCopy, type CopyBlock, type SiteCopy } from '@/data/siteCopy'
import { captureDraftSnapshot, hydrateSiteConfigFromStrapi, loadSiteConfig, saveSiteConfig } from '@/services/siteConfigStore'
import { getErrorMessage } from '@/services/strapi'
import { getLiveUrl, getPreviewUrl } from '@/utils/preview'
import { RevertToLiveButton, UndoDraftButton } from '@/components/RevertButton'

const PAGE_TABS = [
  { id: 'about', label: 'Vision & Mission', hint: 'About COGI', href: '/about' },
  { id: 'story', label: 'Our Story', hint: 'Timeline and history', href: '/about/our-story' },
  { id: 'beliefs', label: 'Our Beliefs', hint: 'Statement of faith', href: '/about/beliefs' },
  { id: 'board', label: 'Board', hint: 'Board members page', href: '/about/board' },
  { id: 'globalTeam', label: 'Global Team', hint: 'Team page', href: '/about/global-team' },
  { id: 'partners', label: 'Partners', hint: 'Organizations we walk with', href: '/about/partners' },
  { id: 'programs', label: 'Programs', hint: 'Training and ministry', href: '/programs' },
  { id: 'events', label: 'Events', hint: 'Gatherings calendar', href: '/events' },
  { id: 'resources', label: 'Resources', hint: 'Stories, news, and more', href: '/resources' },
  { id: 'stories', label: 'Stories', hint: 'Stories of transformation', href: '/resources/stories' },
  { id: 'testimonials', label: 'Testimonials', hint: 'Quotes from the community', href: '/resources/testimonials' },
  { id: 'blog', label: 'Blog', hint: 'News and articles', href: '/resources/blog' },
  { id: 'involved', label: 'Get Involved', hint: 'Pray, give, partner', href: '/get-involved' },
  { id: 'donate', label: 'Donate', hint: 'Ways to give', href: '/donate' },
  { id: 'contact', label: 'Contact', hint: 'Form and details', href: '/contact' },
  { id: 'search', label: 'Search', hint: 'Site search page', href: '/search' },
] as const

type TabId = (typeof PAGE_TABS)[number]['id']

function Field({ label, children, hint, required }: { label: string; children: ReactNode; hint?: string; required?: boolean }) {
  return (
    <label className="hp-field">
      <span className="hp-field-head">
        <span className="admin-label">{label}{required ? ' *' : ''}</span>
      </span>
      {children}
      {hint ? <span className="hp-hint">{hint}</span> : null}
    </label>
  )
}

function TextInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return <input className="admin-input" value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
}

function TextArea({ value, onChange, rows = 4 }: { value: string; onChange: (v: string) => void; rows?: number }) {
  return <textarea className="admin-input" rows={rows} value={value} onChange={(e) => onChange(e.target.value)} />
}

function PhotoField({ label, value, onChange }: { label: string; value?: string; onChange: (v: string) => void }) {
  return (
    <MediaUpload
      kind="image"
      label={label}
      value={value}
      hint={IMAGE_HINT}
      noun="photo"
      onLoaded={(dataUrl) => onChange(dataUrl)}
      onClear={() => onChange('')}
    />
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
      <Field label="Page title" required><TextInput value={heroTitle} onChange={(v) => onChange({ heroTitle: v })} /></Field>
      <Field label="Subtitle" required><TextArea value={heroSubtitle} onChange={(v) => onChange({ heroSubtitle: v })} rows={2} /></Field>
      <PhotoField label="Hero photo" value={imageUrl} onChange={(v) => onChange({ imageUrl: v })} />
    </Card>
  )
}

function LivePreview({ title, subtitle, imageUrl }: { title: string; subtitle: string; imageUrl?: string }) {
  return (
    <aside>
      <p className="hp-preview-label">How visitors see it</p>
      <div className="hp-canvas hp-canvas-teal" style={imageUrl ? { backgroundImage: `linear-gradient(rgba(255,255,255,0.86), rgba(255,255,255,0.92)), url(${imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}>
        <p className="hp-kicker">Page banner</p>
        <h4>{title || 'Page title'}</h4>
        <p>{subtitle || 'Subtitle'}</p>
      </div>
    </aside>
  )
}

export default function WebsiteCopyPage() {
  const [copy, setCopy] = useState<SiteCopy>(() => mergeSiteCopy(loadSiteConfig().copy))
  const [searchParams] = useSearchParams()
  const [tab, setTab] = useState<TabId>(() => PAGE_TABS.find(page => page.id === searchParams.get('tab'))?.id || 'about')
  const [search, setSearch] = useState('')
  const [savedAs, setSavedAs] = useState<'draft' | 'published' | null>(null)
  const [pending, setPending] = useState<'draft' | 'published' | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    captureDraftSnapshot('copy')
    let active = true
    hydrateSiteConfigFromStrapi().then((config) => {
      if (active) {
        setCopy(mergeSiteCopy(config.copy))
        captureDraftSnapshot('copy')
      }
    })
    return () => { active = false }
  }, [])

  async function save(status: 'draft' | 'published') {
    if (status === 'published') {
      const issue = firstBlankPublishIssue(copy)
      if (issue) {
        setTab(issue.tab)
        setError(`Cannot publish live with blank fields on ${issue.label}. Fill: ${issue.fields.join(', ')}.`)
        return
      }
    }
    setPending(status)
    setError(null)
    try {
      await saveSiteConfig({ copy }, status)
      if (status === 'draft') captureDraftSnapshot('copy')
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

  const active = PAGE_TABS.find((item) => item.id === tab) || PAGE_TABS[0]
  const visibleTabs = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return PAGE_TABS
    return PAGE_TABS.filter((item) => item.label.toLowerCase().includes(q) || item.hint.toLowerCase().includes(q))
  }, [search])

  return (
    <div className="hp-page">
      <div className="hp-toolbar">
        <div className="hp-toolbar-copy">
          <p className={savedAs === 'draft' ? 'hp-status hp-status-draft' : 'hp-status hp-status-live'}>
            <i className="hp-status-dot" />
            {savedAs === 'draft' ? 'Unpublished draft' : 'Live site pages'}
          </p>
          <p>These are the main website pages visitors already see. Change the words and photos, then publish. The homepage is edited separately.</p>
        </div>
        <div className="hp-toolbar-actions">
          <Link className="btn-secondary" to="/homepage">Homepage</Link>
          <a className="btn-secondary" href={getPreviewUrl(active.href)} target="_blank" rel="noreferrer">Preview page</a>
          <button type="button" className="btn-secondary" disabled={Boolean(pending)} onClick={() => save('draft')}>
            {pending === 'draft' ? 'Saving…' : 'Save draft'}
          </button>
          <button type="button" className="btn-primary" disabled={Boolean(pending)} onClick={() => save('published')}>
            {pending === 'published' ? 'Publishing…' : 'Publish live'}
          </button>
          <UndoDraftButton
            scope="copy"
            disabled={Boolean(pending)}
            onRestored={(config) => {
              setCopy(mergeSiteCopy(config.copy))
              setSavedAs(null)
            }}
          />
          <RevertToLiveButton
            scope="copy"
            disabled={Boolean(pending)}
            onReverted={(config) => {
              setCopy(mergeSiteCopy(config.copy))
              setSavedAs(null)
            }}
          />
        </div>
      </div>

      {error ? <p className="hp-flash hp-flash-err">{error}</p> : null}
      {savedAs === 'draft' ? <p className="hp-flash hp-flash-warn">Draft saved. Publish when you want visitors to see it.</p> : null}
      {savedAs === 'published' ? <p className="hp-flash hp-flash-ok">Published. The public website updates immediately.</p> : null}

      <div className="hp-workspace">
        <nav className="hp-rail" aria-label="Website pages">
          <div className="hp-rail-head">
            <p className="hp-rail-label">Site pages</p>
            <p className="hp-side-count">{PAGE_TABS.length}</p>
          </div>
          <p className="hp-hint">Click a page to edit the wording visitors see.</p>
          <div className="hp-search">
            <input
              className="admin-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Find a page…"
              aria-label="Find a site page"
            />
          </div>
          <div className="hp-nav-wrap">
            <div className="hp-nav">
              {visibleTabs.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={item.id === tab ? 'hp-nav-item hp-nav-item-active' : 'hp-nav-item'}
                  onClick={() => setTab(item.id)}
                >
                  <span className="hp-nav-num">{PAGE_TABS.findIndex((row) => row.id === item.id) + 1}</span>
                  <span className="hp-nav-copy">
                    <span className="hp-nav-title">{item.label}</span>
                    <span className="hp-nav-hint">{item.hint}</span>
                  </span>
                </button>
              ))}
              {visibleTabs.length === 0 ? <p className="hp-hint" style={{ padding: '0.6rem' }}>No matching pages.</p> : null}
            </div>
          </div>
          <Link className="admin-preview-btn" to="/pages">Need an extra page?</Link>
        </nav>

        <div className="hp-editor">
          <div className="hp-editor-head">
            <div>
              <p className="hp-step">Page {PAGE_TABS.findIndex((item) => item.id === tab) + 1} of {PAGE_TABS.length}</p>
              <h3>{active.label}</h3>
              <p>{active.hint}. Changes go live after you publish.</p>
            </div>
            <a className="btn-secondary" href={getLiveUrl(active.href)} target="_blank" rel="noreferrer">Open on website</a>
          </div>

          <div className="hp-editor-split">
            <div className="hp-fields">
              {tab === 'about' && (
                <>
                  <HeroFields
                    title="About page"
                    heroTitle={copy.about.heroTitle}
                    heroSubtitle={copy.about.heroSubtitle}
                    imageUrl={copy.about.imageUrl}
                    onChange={(p) => patch('about', { ...copy.about, ...p })}
                  />
                  <Card title="Vision & mission">
                    <Field label="Vision heading" required><TextInput value={copy.about.visionTitle} onChange={(v) => patch('about', { ...copy.about, visionTitle: v })} /></Field>
                    <Field label="Vision" required hint="Shown on the public Vision & Mission page.">
                      <TextArea value={copy.about.visionBody} onChange={(v) => patch('about', { ...copy.about, visionBody: v })} rows={5} />
                    </Field>
                    <Field label="Mission heading" required><TextInput value={copy.about.missionTitle} onChange={(v) => patch('about', { ...copy.about, missionTitle: v })} /></Field>
                    <Field label="Mission" required>
                      <TextArea value={copy.about.missionBody} onChange={(v) => patch('about', { ...copy.about, missionBody: v })} rows={5} />
                    </Field>
                    <Field label="Scripture" hint="Separate references with a middot (·) or comma.">
                      <TextInput value={copy.about.scripture} onChange={(v) => patch('about', { ...copy.about, scripture: v })} />
                    </Field>
                  </Card>
                </>
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
                      <div key={`milestone-${index}`} className="grid gap-3 rounded-xl border border-[var(--color-border)] p-3">
                        <div className="grid gap-3 md:grid-cols-[100px_1fr_auto]">
                          <Field label="Year"><input className="admin-input" inputMode="numeric" maxLength={4} value={item.year} onChange={(e) => {
                            const year = e.target.value.replace(/\D/g, '').slice(0, 4)
                            const milestones = copy.story.milestones.map((row, i) => (i === index ? { ...row, year } : row))
                            patch('story', { ...copy.story, milestones })
                          }} /></Field>
                          <Field label="Title"><TextInput value={item.title} onChange={(v) => {
                            const milestones = copy.story.milestones.map((row, i) => (i === index ? { ...row, title: v } : row))
                            patch('story', { ...copy.story, milestones })
                          }} /></Field>
                          <button type="button" className="btn-danger self-end" onClick={() => patch('story', { ...copy.story, milestones: copy.story.milestones.filter((_, i) => i !== index) })}>Remove</button>
                        </div>
                        <Field label="Description"><TextArea value={item.description} onChange={(v) => {
                          const milestones = copy.story.milestones.map((row, i) => (i === index ? { ...row, description: v } : row))
                          patch('story', { ...copy.story, milestones })
                        }} rows={3} /></Field>
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

              {tab === 'board' && (
                <>
                  <HeroFields title="Board" heroTitle={copy.board.heroTitle} heroSubtitle={copy.board.heroSubtitle} imageUrl={copy.board.imageUrl} onChange={(p) => patch('board', { ...copy.board, ...p })} />
                  <Card title="Board members">
                    <p className="hp-hint">These people appear on the public Board page after you publish. Add, edit, or remove anyone on the board.</p>
                    {copy.board.members.map((member, index) => (
                      <div key={member.id || index} className="space-y-3 rounded-xl border border-[var(--color-border)] p-3">
                        <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
                          <Field label="Name" required><TextInput value={member.name} onChange={(v) => {
                            const members = copy.board.members.map((row, i) => (i === index ? { ...row, name: v } : row))
                            patch('board', { ...copy.board, members })
                          }} /></Field>
                          <Field label="Title" required><TextInput value={member.title} onChange={(v) => {
                            const members = copy.board.members.map((row, i) => (i === index ? { ...row, title: v } : row))
                            patch('board', { ...copy.board, members })
                          }} /></Field>
                          <button type="button" className="btn-danger self-end" onClick={() => patch('board', { ...copy.board, members: copy.board.members.filter((_, i) => i !== index) })}>Remove</button>
                        </div>
                        <Field label="Country"><TextInput value={member.country} onChange={(v) => {
                          const members = copy.board.members.map((row, i) => (i === index ? { ...row, country: v } : row))
                          patch('board', { ...copy.board, members })
                        }} /></Field>
                        <Field label="Bio" required><TextArea value={member.bio} onChange={(v) => {
                          const members = copy.board.members.map((row, i) => (i === index ? { ...row, bio: v } : row))
                          patch('board', { ...copy.board, members })
                        }} rows={4} /></Field>
                        <PhotoField
                          label="Photo (optional)"
                          value={member.imageUrl}
                          onChange={(v) => {
                            const members = copy.board.members.map((row, i) => (i === index ? { ...row, imageUrl: v } : row))
                            patch('board', { ...copy.board, members })
                          }}
                        />
                      </div>
                    ))}
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => patch('board', { ...copy.board, members: [...copy.board.members, { id: `board-${Date.now()}`, name: '', title: '', country: '', bio: '' }] })}
                    >
                      Add board member
                    </button>
                  </Card>
                </>
              )}
              {tab === 'globalTeam' && (
                <>
                  <HeroFields title="Global team" heroTitle={copy.globalTeam.heroTitle} heroSubtitle={copy.globalTeam.heroSubtitle} imageUrl={copy.globalTeam.imageUrl} onChange={(p) => patch('globalTeam', { ...copy.globalTeam, ...p })} />
                  <Card title="Team members">
                    <p className="hp-hint">These people appear on the public Global team page after you publish.</p>
                    {(copy.globalTeam.members ?? []).map((member, index) => (
                      <div key={member.id || index} className="space-y-3 rounded-xl border border-[var(--color-border)] p-3">
                        <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
                          <Field label="Name" required><TextInput value={member.name} onChange={(v) => {
                            const members = copy.globalTeam.members.map((row, i) => (i === index ? { ...row, name: v } : row))
                            patch('globalTeam', { ...copy.globalTeam, members })
                          }} placeholder="Name" /></Field>
                          <Field label="Title" required><TextInput value={member.title} onChange={(v) => {
                            const members = copy.globalTeam.members.map((row, i) => (i === index ? { ...row, title: v } : row))
                            patch('globalTeam', { ...copy.globalTeam, members })
                          }} placeholder="Role or title" /></Field>
                          <button type="button" className="btn-danger self-end" onClick={() => patch('globalTeam', { ...copy.globalTeam, members: copy.globalTeam.members.filter((_, i) => i !== index) })}>Remove</button>
                        </div>
                        <div className="grid gap-3 md:grid-cols-2">
                          <Field label="Region"><TextInput value={member.region} onChange={(v) => {
                            const members = copy.globalTeam.members.map((row, i) => (i === index ? { ...row, region: v } : row))
                            patch('globalTeam', { ...copy.globalTeam, members })
                          }} placeholder="Americas & Africa" /></Field>
                          <Field label="Country"><TextInput value={member.country} onChange={(v) => {
                            const members = copy.globalTeam.members.map((row, i) => (i === index ? { ...row, country: v } : row))
                            patch('globalTeam', { ...copy.globalTeam, members })
                          }} placeholder="Kenya" /></Field>
                        </div>
                        <Field label="Bio" required><TextArea value={member.bio} onChange={(v) => {
                          const members = copy.globalTeam.members.map((row, i) => (i === index ? { ...row, bio: v } : row))
                          patch('globalTeam', { ...copy.globalTeam, members })
                        }} rows={3} /></Field>
                        <PhotoField
                          label="Photo (optional)"
                          value={member.imageUrl}
                          onChange={(v) => {
                            const members = copy.globalTeam.members.map((row, i) => (i === index ? { ...row, imageUrl: v } : row))
                            patch('globalTeam', { ...copy.globalTeam, members })
                          }}
                        />
                      </div>
                    ))}
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => patch('globalTeam', { ...copy.globalTeam, members: [...copy.globalTeam.members, { id: `gt-${Date.now()}`, name: '', title: '', region: '', country: '', bio: '' }] })}
                    >
                      Add team member
                    </button>
                  </Card>
                </>
              )}
              {tab === 'partners' && (
                <HeroFields title="Partners" heroTitle={copy.partners.heroTitle} heroSubtitle={copy.partners.heroSubtitle} imageUrl={copy.partners.imageUrl} onChange={(p) => patch('partners', { ...copy.partners, ...p })} />
              )}
              {tab === 'programs' && (
                <>
                  <HeroFields title="Programs" heroTitle={copy.programs.heroTitle} heroSubtitle={copy.programs.heroSubtitle} imageUrl={copy.programs.imageUrl} onChange={(p) => patch('programs', { ...copy.programs, ...p })} />
                  <Card title="Program buttons">
                    <Field label="Learn more" hint="Shown on every program card. Each button opens that program’s page (/programs/slug).">
                      <TextInput value={copy.programs.learnMore} onChange={(v) => patch('programs', { ...copy.programs, learnMore: v })} placeholder="Learn more" />
                    </Field>
                    <Field label="Express interest" hint="Shown on every program card. Opens Get Involved (/get-involved).">
                      <TextInput value={copy.programs.expressInterest} onChange={(v) => patch('programs', { ...copy.programs, expressInterest: v })} placeholder="Express interest" />
                    </Field>
                    <p className="hp-hint">The public site has four programs. Edit each program’s title, summary, and experiences under Website content → Programs. Button wording above is shared by all cards.</p>
                    <ul className="space-y-2 text-sm text-slate-700">
                      <li><strong>Kingdom of God Studies &amp; Seminars</strong> — Learn more → /programs/kingdom-of-god</li>
                      <li><strong>Missional Healthcare Training</strong> — Learn more → /programs/missional-training</li>
                      <li><strong>Care for the Caregiver</strong> — Learn more → /programs/care-for-the-caregiver</li>
                      <li><strong>Missional Church &amp; Healthcare</strong> — Learn more → /programs/missional-church-healthcare</li>
                    </ul>
                  </Card>
                </>
              )}
              {tab === 'events' && (
                <>
                  <HeroFields title="Events" heroTitle={copy.events.heroTitle} heroSubtitle={copy.events.heroSubtitle} imageUrl={copy.events.imageUrl} onChange={(p) => patch('events', { ...copy.events, ...p })} />
                  <Card title="Page wording">
                    <Field label="Featured badge"><TextInput value={copy.events.featuredLabel} onChange={v => patch('events', { ...copy.events, featuredLabel: v })} /></Field>
                    <Field label="Event link text"><TextInput value={copy.events.detailsLabel} onChange={v => patch('events', { ...copy.events, detailsLabel: v })} /></Field>
                  </Card>
                  <p className="hp-hint">Individual events are created under Website content → Events. Use this screen for the banner and listing labels.</p>
                  <Link className="btn-secondary w-fit" to="/events/new">Create an event</Link>
                </>
              )}
              {tab === 'resources' && (
                <>
                  <HeroFields
                    title="Resources hub"
                    heroTitle={copy.resources.heroTitle}
                    heroSubtitle={copy.resources.heroSubtitle}
                    imageUrl={copy.resources.imageUrl}
                    onChange={(p) => patch('resources', { ...copy.resources, ...p })}
                  />
                  <Card title="Page wording">
                    <Field label="Default card link text"><TextInput value={copy.resources.exploreLabel} onChange={v => patch('resources', { ...copy.resources, exploreLabel: v })} /></Field>
                  </Card>
                  <Card title="Resource cards">
                    {copy.resources.cards.map((item, index) => (
                      <BlockEditor
                        key={index}
                        block={item}
                        showLink
                        showImage
                        showCta
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
              {tab === 'stories' && (
                <>
                  <HeroFields title="Stories" heroTitle={copy.storiesPage.heroTitle} heroSubtitle={copy.storiesPage.heroSubtitle} imageUrl={copy.storiesPage.imageUrl} onChange={(p) => patch('storiesPage', { ...copy.storiesPage, ...p })} />
                  <p className="hp-hint">Individual stories are edited under Website content → Stories.</p>
                </>
              )}
              {tab === 'testimonials' && (
                <>
                  <HeroFields title="Testimonials" heroTitle={copy.testimonials.heroTitle} heroSubtitle={copy.testimonials.heroSubtitle} imageUrl={copy.testimonials.imageUrl} onChange={(p) => patch('testimonials', { ...copy.testimonials, ...p })} />
                  <p className="hp-hint">Individual quotes are edited under Website content → Testimonials.</p>
                </>
              )}
              {tab === 'blog' && (
                <>
                  <HeroFields title="Blog" heroTitle={copy.blog.heroTitle} heroSubtitle={copy.blog.heroSubtitle} imageUrl={copy.blog.imageUrl} onChange={(p) => patch('blog', { ...copy.blog, ...p })} />
                  <Card title="Blog note">
                    <Field label="Optional footnote"><TextInput value={copy.blog.migrationNote} onChange={(v) => patch('blog', { ...copy.blog, migrationNote: v })} /></Field>
                    <p className="hp-hint">Articles are edited under Website content → Blog.</p>
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
                    onChange={(p) => patch('getInvolved', { ...copy.getInvolved, ...p })}
                  />
                  <Card title="Page wording">
                    <Field label="Newsletter heading"><TextInput value={copy.getInvolved.newsletterTitle} onChange={v => patch('getInvolved', { ...copy.getInvolved, newsletterTitle: v })} /></Field>
                    <Field label="Newsletter introduction"><TextInput value={copy.getInvolved.newsletterIntro} onChange={v => patch('getInvolved', { ...copy.getInvolved, newsletterIntro: v })} /></Field>
                    <Field label="Submit button text"><TextInput value={copy.getInvolved.submitLabel} onChange={v => patch('getInvolved', { ...copy.getInvolved, submitLabel: v })} /></Field>
                  </Card>
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
                    onChange={(p) => patch('donate', { ...copy.donate, ...p })}
                  />
                  <Card title="Ways to give">
                    <Field label="Intro"><TextArea value={copy.donate.intro} onChange={(v) => patch('donate', { ...copy.donate, intro: v })} /></Field>
                    <Field label="Online title"><TextInput value={copy.donate.giveTitle} onChange={(v) => patch('donate', { ...copy.donate, giveTitle: v })} /></Field>
                    <Field label="Online body"><TextArea value={copy.donate.giveBody} onChange={(v) => patch('donate', { ...copy.donate, giveBody: v })} /></Field>
                    <Field label="Give button"><TextInput value={copy.donate.giveCta} onChange={(v) => patch('donate', { ...copy.donate, giveCta: v })} /></Field>
                    <Field label="Donation link"><TextInput value={copy.donate.giveUrl || ''} onChange={v => patch('donate', { ...copy.donate, giveUrl: v })} placeholder="https://secure.givelively.org/donate/companions-of-grace-international" /></Field>
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
                    <Field label="FAQ heading"><TextInput value={copy.donate.faqTitle} onChange={(v) => patch('donate', { ...copy.donate, faqTitle: v })} placeholder="Frequently asked questions" /></Field>
                    {(copy.donate.faqs ?? []).map((faq, index) => (
                      <div key={faq.id || index} className="space-y-3 rounded-xl border border-[var(--color-border)] p-3">
                        <div className="flex items-start justify-between gap-3">
                          <Field label="Question">
                            <TextInput
                              value={faq.question}
                              onChange={(v) => {
                                const faqs = (copy.donate.faqs ?? []).map((row, i) => (i === index ? { ...row, question: v } : row))
                                patch('donate', { ...copy.donate, faqs })
                              }}
                              placeholder="e.g. How do I donate to COGI?"
                            />
                          </Field>
                          <button type="button" className="btn-danger mt-6" onClick={() => patch('donate', { ...copy.donate, faqs: (copy.donate.faqs ?? []).filter((_, i) => i !== index) })}>Remove</button>
                        </div>
                        <Field label="Answer">
                          <TextArea
                            value={faq.answer}
                            onChange={(v) => {
                              const faqs = (copy.donate.faqs ?? []).map((row, i) => (i === index ? { ...row, answer: v } : row))
                              patch('donate', { ...copy.donate, faqs })
                            }}
                            rows={3}
                          />
                        </Field>
                      </div>
                    ))}
                    <button type="button" className="btn-secondary" onClick={() => patch('donate', { ...copy.donate, faqs: [...(copy.donate.faqs ?? []), { id: `faq-${Date.now()}`, question: '', answer: '' }] })}>Add question</button>
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
                  <Card title="Page wording">
                    <Field label="Public email (overrides global settings)"><TextInput value={copy.contact.email} onChange={v => patch('contact', { ...copy.contact, email: v })} /></Field>
                    <Field label="Public phone (overrides global settings)"><TextInput value={copy.contact.phone} onChange={v => patch('contact', { ...copy.contact, phone: v })} /></Field>
                    <Field label="Office address (overrides global settings)"><TextInput value={copy.contact.office} onChange={v => patch('contact', { ...copy.contact, office: v })} /></Field>
                    <Field label="Submit button text"><TextInput value={copy.contact.submitLabel} onChange={v => patch('contact', { ...copy.contact, submitLabel: v })} /></Field>
                  </Card>
                  <Card title="Page labels">
                    <Field label="Form title"><TextInput value={copy.contact.formTitle} onChange={(v) => patch('contact', { ...copy.contact, formTitle: v })} /></Field>
                    <Field label="Info title"><TextInput value={copy.contact.infoTitle} onChange={(v) => patch('contact', { ...copy.contact, infoTitle: v })} /></Field>
                    <Field label="Social title"><TextInput value={copy.contact.socialTitle} onChange={(v) => patch('contact', { ...copy.contact, socialTitle: v })} /></Field>
                    <Field label="Map note"><TextInput value={copy.contact.mapNote} onChange={(v) => patch('contact', { ...copy.contact, mapNote: v })} /></Field>
                  </Card>
                </>
              )}
              {tab === 'search' && (
                <>
                  <HeroFields title="Search" heroTitle={copy.search.heroTitle} heroSubtitle={copy.search.heroSubtitle} imageUrl={copy.search.imageUrl} onChange={(p) => patch('search', { ...copy.search, ...p })} />
                  <Card title="Search form">
                    <Field label="Placeholder"><TextInput value={copy.search.placeholder} onChange={(v) => patch('search', { ...copy.search, placeholder: v })} /></Field>
                    <Field label="Button"><TextInput value={copy.search.button} onChange={(v) => patch('search', { ...copy.search, button: v })} /></Field>
                  </Card>
                </>
              )}

              <button type="button" className="btn-secondary" onClick={() => setCopy(structuredClone(defaultSiteCopy))}>
                Restore original wording
              </button>
            </div>

            <LivePreview
              title={previewTitle(copy, tab)}
              subtitle={previewSubtitle(copy, tab)}
              imageUrl={previewImage(copy, tab)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function preferFilled(value?: string) {
  return (value ?? '').trim()
}

function firstBlankPublishIssue(copy: SiteCopy): { tab: TabId; label: string; fields: string[] } | null {
  const pages: Array<{ tab: TabId; label: string; fields: Array<[string, string | undefined]> }> = [
    {
      tab: 'about',
      label: 'Vision & Mission',
      fields: [
        ['Page title', copy.about.heroTitle],
        ['Subtitle', copy.about.heroSubtitle],
        ['Vision heading', copy.about.visionTitle],
        ['Vision', copy.about.visionBody],
        ['Mission heading', copy.about.missionTitle],
        ['Mission', copy.about.missionBody],
      ],
    },
    {
      tab: 'story',
      label: 'Our Story',
      fields: [
        ['Page title', copy.story.heroTitle],
        ['Subtitle', copy.story.heroSubtitle],
        ['Intro', copy.story.intro],
        ...copy.story.milestones.flatMap((item, index) => [
          [`Milestone ${index + 1} year`, item.year] as [string, string],
          [`Milestone ${index + 1} title`, item.title] as [string, string],
          [`Milestone ${index + 1} description`, item.description] as [string, string],
        ]),
      ],
    },
    {
      tab: 'beliefs',
      label: 'Our Beliefs',
      fields: [
        ['Page title', copy.beliefs.heroTitle],
        ['Subtitle', copy.beliefs.heroSubtitle],
        ['Intro', copy.beliefs.intro],
        ...copy.beliefs.items.flatMap((item, index) => [
          [`Belief ${index + 1} title`, item.title] as [string, string],
          [`Belief ${index + 1} content`, item.content] as [string, string],
        ]),
      ],
    },
    { tab: 'board', label: 'Board', fields: [
      ['Page title', copy.board.heroTitle],
      ['Subtitle', copy.board.heroSubtitle],
      ...copy.board.members.flatMap((item, index) => [
        [`Member ${index + 1} name`, item.name] as [string, string],
        [`Member ${index + 1} title`, item.title] as [string, string],
        [`Member ${index + 1} bio`, item.bio] as [string, string],
      ]),
    ] },
    { tab: 'globalTeam', label: 'Global Team', fields: [
      ['Page title', copy.globalTeam.heroTitle],
      ['Subtitle', copy.globalTeam.heroSubtitle],
      ...(copy.globalTeam.members ?? []).flatMap((item, index) => [
        [`Member ${index + 1} name`, item.name] as [string, string],
        [`Member ${index + 1} title`, item.title] as [string, string],
        [`Member ${index + 1} bio`, item.bio] as [string, string],
      ]),
    ] },
    { tab: 'partners', label: 'Partners', fields: [['Page title', copy.partners.heroTitle], ['Subtitle', copy.partners.heroSubtitle]] },
    { tab: 'programs', label: 'Programs', fields: [['Page title', copy.programs.heroTitle], ['Subtitle', copy.programs.heroSubtitle], ['Learn more', copy.programs.learnMore], ['Express interest', copy.programs.expressInterest]] },
    { tab: 'events', label: 'Events', fields: [['Page title', copy.events.heroTitle], ['Subtitle', copy.events.heroSubtitle]] },
    {
      tab: 'resources',
      label: 'Resources',
      fields: [
        ['Page title', copy.resources.heroTitle],
        ['Subtitle', copy.resources.heroSubtitle],
        ...copy.resources.cards.flatMap((item, index) => [
          [`Card ${index + 1} title`, item.title] as [string, string],
          [`Card ${index + 1} body`, item.body] as [string, string],
        ]),
      ],
    },
    { tab: 'stories', label: 'Stories', fields: [['Page title', copy.storiesPage.heroTitle], ['Subtitle', copy.storiesPage.heroSubtitle]] },
    { tab: 'testimonials', label: 'Testimonials', fields: [['Page title', copy.testimonials.heroTitle], ['Subtitle', copy.testimonials.heroSubtitle]] },
    { tab: 'blog', label: 'Blog', fields: [['Page title', copy.blog.heroTitle], ['Subtitle', copy.blog.heroSubtitle]] },
    {
      tab: 'involved',
      label: 'Get Involved',
      fields: [
        ['Page title', copy.getInvolved.heroTitle],
        ['Subtitle', copy.getInvolved.heroSubtitle],
        ['Form title', copy.getInvolved.formTitle],
        ['Form intro', copy.getInvolved.formIntro],
        ...copy.getInvolved.pathways.flatMap((item, index) => [
          [`Pathway ${index + 1} title`, item.title] as [string, string],
          [`Pathway ${index + 1} body`, item.body] as [string, string],
        ]),
      ],
    },
    {
      tab: 'donate',
      label: 'Donate',
      fields: [
        ['Page title', copy.donate.heroTitle],
        ['Subtitle', copy.donate.heroSubtitle],
        ['Intro', copy.donate.intro],
        ['Online title', copy.donate.giveTitle],
        ['Online body', copy.donate.giveBody],
        ['Give button', copy.donate.giveCta],
        ...(copy.donate.faqs ?? []).flatMap((item, index) => [
          [`FAQ ${index + 1} question`, item.question] as [string, string],
          [`FAQ ${index + 1} answer`, item.answer] as [string, string],
        ]),
      ],
    },
    {
      tab: 'contact',
      label: 'Contact',
      fields: [
        ['Page title', copy.contact.heroTitle],
        ['Subtitle', copy.contact.heroSubtitle],
        ['Form title', copy.contact.formTitle],
        ['Info title', copy.contact.infoTitle],
      ],
    },
    { tab: 'search', label: 'Search', fields: [['Page title', copy.search.heroTitle], ['Button', copy.search.button]] },
  ]

  for (const page of pages) {
    const fields = page.fields.filter(([, value]) => !preferFilled(value)).map(([name]) => name)
    if (fields.length) return { tab: page.tab, label: page.label, fields }
  }
  return null
}

function previewTitle(copy: SiteCopy, tab: TabId) {
  switch (tab) {
    case 'about': return copy.about.heroTitle
    case 'story': return copy.story.heroTitle
    case 'beliefs': return copy.beliefs.heroTitle
    case 'board': return copy.board.heroTitle
    case 'globalTeam': return copy.globalTeam.heroTitle
    case 'partners': return copy.partners.heroTitle
    case 'programs': return copy.programs.heroTitle
    case 'events': return copy.events.heroTitle
    case 'resources': return copy.resources.heroTitle
    case 'stories': return copy.storiesPage.heroTitle
    case 'testimonials': return copy.testimonials.heroTitle
    case 'blog': return copy.blog.heroTitle
    case 'involved': return copy.getInvolved.heroTitle
    case 'donate': return copy.donate.heroTitle
    case 'contact': return copy.contact.heroTitle
    case 'search': return copy.search.heroTitle
  }
}

function previewSubtitle(copy: SiteCopy, tab: TabId) {
  switch (tab) {
    case 'about': return copy.about.heroSubtitle
    case 'story': return copy.story.heroSubtitle
    case 'beliefs': return copy.beliefs.heroSubtitle
    case 'board': return copy.board.heroSubtitle
    case 'globalTeam': return copy.globalTeam.heroSubtitle
    case 'partners': return copy.partners.heroSubtitle
    case 'programs': return copy.programs.heroSubtitle
    case 'events': return copy.events.heroSubtitle
    case 'resources': return copy.resources.heroSubtitle
    case 'stories': return copy.storiesPage.heroSubtitle
    case 'testimonials': return copy.testimonials.heroSubtitle
    case 'blog': return copy.blog.heroSubtitle
    case 'involved': return copy.getInvolved.heroSubtitle
    case 'donate': return copy.donate.heroSubtitle
    case 'contact': return copy.contact.heroSubtitle
    case 'search': return copy.search.heroSubtitle
  }
}

function previewImage(copy: SiteCopy, tab: TabId) {
  switch (tab) {
    case 'about': return copy.about.imageUrl
    case 'story': return copy.story.imageUrl
    case 'beliefs': return copy.beliefs.imageUrl
    case 'board': return copy.board.imageUrl
    case 'globalTeam': return copy.globalTeam.imageUrl
    case 'partners': return copy.partners.imageUrl
    case 'programs': return copy.programs.imageUrl
    case 'events': return copy.events.imageUrl
    case 'stories': return copy.storiesPage.imageUrl
    case 'testimonials': return copy.testimonials.imageUrl
    case 'blog': return copy.blog.imageUrl
    case 'involved': return copy.getInvolved.imageUrl
    case 'donate': return copy.donate.imageUrl
    case 'contact': return copy.contact.imageUrl
    case 'resources': return copy.resources.imageUrl
    case 'search': return copy.search.imageUrl
  }
}

function BlockEditor({
  block,
  onChange,
  onRemove,
  showLink,
  showImage,
  showCta,
}: {
  block: CopyBlock
  onChange: (block: CopyBlock) => void
  onRemove: () => void
  showLink?: boolean
  showImage?: boolean
  showCta?: boolean
}) {
  return (
    <div className="space-y-3 rounded-xl border border-[var(--color-border)] p-3">
      <div className="grid gap-3 md:grid-cols-[1fr_auto]">
        <Field label="Title"><TextInput value={block.title} onChange={(v) => onChange({ ...block, title: v })} /></Field>
        <button type="button" className="btn-danger self-end" onClick={onRemove}>Remove</button>
      </div>
      <Field label="Body"><TextArea value={block.body} onChange={(v) => onChange({ ...block, body: v })} /></Field>
      {showCta && <Field label="Card link text"><TextInput value={block.cta || ''} onChange={v => onChange({ ...block, cta: v })} /></Field>}
      {showLink ? <Field label="Link" hint="Use a site path like /resources/stories"><TextInput value={block.href || ''} onChange={(v) => onChange({ ...block, href: v })} placeholder="/resources/stories" /></Field> : null}
      {showImage ? <PhotoField label="Photo" value={block.imageUrl} onChange={(v) => onChange({ ...block, imageUrl: v })} /> : null}
    </div>
  )
}
