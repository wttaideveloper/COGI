import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { mockHomepage } from '@/data/mock'
import { apiSingle, apiUpdateSingle, getErrorMessage, isDemoMode } from '@/services/strapi'
import { loadSiteConfig, readFileAsDataUrl, saveSiteConfig } from '@/services/siteConfigStore'
import { getPreviewUrl } from '@/utils/preview'
import type { HeroSlide, HomepageRecord } from '@/types'

function PageHeader({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-2 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h2 className="text-2xl font-extrabold text-[var(--color-primary)]">{title}</h2>
        {description ? <p className="mt-1 max-w-3xl text-sm text-slate-600">{description}</p> : null}
      </div>
      {action}
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="admin-label">{label}</span>
      {children}
    </label>
  )
}

function ErrorNotice({ error }: { error: unknown }) {
  return error ? (
    <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      Strapi request failed: {getErrorMessage(error)}. Showing local demo data so the UI remains usable.
    </div>
  ) : null
}

const HOMEPAGE_DRAFT_KEY = 'cogi_homepage_draft'

type HomepageDraftPayload = {
  values: HomepageRecord
  slides: HeroSlide[]
  savedAt: string
}

function loadHomepageDraft(): HomepageDraftPayload | null {
  try {
    const raw = localStorage.getItem(HOMEPAGE_DRAFT_KEY)
    return raw ? (JSON.parse(raw) as HomepageDraftPayload) : null
  } catch {
    return null
  }
}

export default function HomepageManagerPage() {
  const query = useQuery({ queryKey: ['homepage'], queryFn: () => apiSingle<HomepageRecord>('/homepage'), enabled: !isDemoMode() })
  const stored = loadSiteConfig().homepage
  const existingDraft = loadHomepageDraft()
  const data = existingDraft?.values ?? query.data ?? { ...mockHomepage, ...stored }
  const form = useForm<HomepageRecord>({ values: data })
  const [savedAs, setSavedAs] = useState<'draft' | 'published' | null>(null)
  const [hasDraft, setHasDraft] = useState(Boolean(existingDraft))
  const [slides, setSlides] = useState<HeroSlide[]>(() => {
    if (existingDraft?.slides?.length) return existingDraft.slides
    if (stored.heroSlides?.length) return stored.heroSlides
    if (mockHomepage.heroSlides?.length) return mockHomepage.heroSlides
    if (stored.heroImageUrl) return [{ id: 'legacy', imageUrl: stored.heroImageUrl, alt: stored.heroImageAlt }]
    return []
  })
  const [draftUrl, setDraftUrl] = useState('')
  const [draftAlt, setDraftAlt] = useState('')

  const mutation = useMutation({
    mutationFn: async ({ values, status }: { values: HomepageRecord; status: 'draft' | 'published' }) => {
      const nextSlides = slides.filter((slide) => slide.imageUrl)
      const payload = { ...values, heroSlides: nextSlides }
      if (status === 'draft') {
        localStorage.setItem(
          HOMEPAGE_DRAFT_KEY,
          JSON.stringify({ values: payload, slides: nextSlides, savedAt: new Date().toISOString() } satisfies HomepageDraftPayload),
        )
        return { values: payload, status }
      }
      await saveSiteConfig({
        homepage: {
          heroHeadline: values.heroHeadline,
          heroIntro: values.heroIntro,
          heroImageUrl: nextSlides[0]?.imageUrl || values.heroImageUrl,
          heroImageAlt: nextSlides[0]?.alt || values.heroImageAlt,
          heroSlides: nextSlides,
          primaryCtaLabel: values.primaryCtaLabel,
          primaryCtaHref: values.primaryCtaHref,
        },
      })
      localStorage.removeItem(HOMEPAGE_DRAFT_KEY)
      if (!isDemoMode()) await apiUpdateSingle('/homepage', payload)
      return { values: payload, status }
    },
    onSuccess: (_data, variables) => {
      setSavedAs(variables.status)
      setHasDraft(variables.status === 'draft')
      window.setTimeout(() => setSavedAs(null), 3000)
    },
  })

  async function addSlideFromFile(file: File | undefined) {
    if (!file) return
    const url = await readFileAsDataUrl(file)
    setSlides((prev) => [...prev, { id: `slide-${Date.now()}`, imageUrl: url, alt: file.name }])
  }

  function addSlideFromUrl() {
    if (!draftUrl.trim()) return
    setSlides((prev) => [...prev, { id: `slide-${Date.now()}`, imageUrl: draftUrl.trim(), alt: draftAlt.trim() || 'Hero slide' }])
    setDraftUrl('')
    setDraftAlt('')
  }

  function moveSlide(index: number, direction: -1 | 1) {
    const target = index + direction
    if (target < 0 || target >= slides.length) return
    const next = [...slides]
    const [row] = next.splice(index, 1)
    next.splice(target, 0, row)
    setSlides(next)
  }

  const sections = form.watch('sections') || []

  return (
    <>
      <PageHeader
        title="Homepage Manager"
        description="Edit hero slider images, copy, and CTAs. Draft privately, then publish live to the public site."
        action={<a className="btn-secondary" href={getPreviewUrl('/')} target="_blank" rel="noreferrer">Preview</a>}
      />
      <ErrorNotice error={query.error} />
      {hasDraft ? <p className="mb-4 text-sm font-semibold text-amber-700">Unpublished draft loaded — not live until you Publish.</p> : null}
      {savedAs === 'draft' ? <p className="mb-4 text-sm font-semibold text-amber-700">Draft saved — not live on the public site yet.</p> : null}
      {savedAs === 'published' ? <p className="mb-4 text-sm font-semibold text-emerald-700">Published live — refresh the public site to see changes.</p> : null}
      <form
        className="grid gap-6 xl:grid-cols-[1fr_360px]"
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit((v) => mutation.mutate({ values: v, status: 'draft' }))()
        }}
      >
        <div className="space-y-6">
          <div className="admin-card p-5">
            <h3 className="mb-4 font-bold">Hero content</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Headline"><input className="admin-input" {...form.register('heroHeadline')} /></Field>
              <Field label="Primary CTA label"><input className="admin-input" {...form.register('primaryCtaLabel')} /></Field>
              <Field label="Primary CTA href"><input className="admin-input" {...form.register('primaryCtaHref')} /></Field>
              <div className="md:col-span-2"><Field label="Intro"><textarea className="admin-input min-h-28" {...form.register('heroIntro')} /></Field></div>
            </div>
          </div>

          <div className="admin-card p-5">
            <h3 className="mb-1 font-bold">Hero image slider</h3>
            <p className="mb-4 text-sm text-slate-600">Add multiple images for the homepage hero carousel. Reorder with ↑ / ↓.</p>
            <div className="space-y-3">
              {slides.map((slide, index) => (
                <div key={slide.id} className="grid gap-3 rounded-xl border border-[var(--color-border)] p-3 md:grid-cols-[120px_1fr_auto]">
                  <img src={slide.imageUrl} alt={slide.alt || ''} className="h-20 w-full rounded-lg object-cover" />
                  <div className="grid gap-2">
                    <input
                      className="admin-input"
                      value={slide.alt || ''}
                      onChange={(e) => setSlides((prev) => prev.map((row) => (row.id === slide.id ? { ...row, alt: e.target.value } : row)))}
                      placeholder="Alt text"
                    />
                    <input
                      className="admin-input"
                      value={slide.imageUrl.startsWith('data:') ? '(uploaded image)' : slide.imageUrl}
                      onChange={(e) => setSlides((prev) => prev.map((row) => (row.id === slide.id ? { ...row, imageUrl: e.target.value } : row)))}
                      disabled={slide.imageUrl.startsWith('data:')}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <button type="button" className="btn-secondary px-2 py-1" onClick={() => moveSlide(index, -1)} disabled={index === 0}>↑</button>
                    <button type="button" className="btn-secondary px-2 py-1" onClick={() => moveSlide(index, 1)} disabled={index === slides.length - 1}>↓</button>
                    <button type="button" className="btn-danger px-2 py-1" onClick={() => setSlides((prev) => prev.filter((row) => row.id !== slide.id))}>Remove</button>
                  </div>
                </div>
              ))}
              {!slides.length ? <p className="text-sm text-slate-500">No slides yet — upload or paste an image URL below.</p> : null}
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-[1fr_1fr_auto]">
              <Field label="Image URL"><input className="admin-input" value={draftUrl} onChange={(e) => setDraftUrl(e.target.value)} placeholder="https://..." /></Field>
              <Field label="Alt text"><input className="admin-input" value={draftAlt} onChange={(e) => setDraftAlt(e.target.value)} placeholder="Describe the image" /></Field>
              <button type="button" className="btn-secondary self-end" onClick={addSlideFromUrl}>Add URL slide</button>
            </div>
            <div className="mt-3">
              <Field label="Upload slide image">
                <input className="admin-input" type="file" accept="image/*" onChange={(e) => addSlideFromFile(e.target.files?.[0])} />
              </Field>
            </div>
          </div>

          <div className="admin-card p-5">
            <h3 className="mb-4 font-bold">Mission</h3>
            <Field label="Title"><input className="admin-input" {...form.register('missionTitle')} /></Field>
            <Field label="Statement"><textarea className="admin-input mt-3 min-h-28" {...form.register('missionStatement')} /></Field>
          </div>

          <div className="admin-card p-5">
            <h3 className="mb-4 font-bold">Impact stats</h3>
            <div className="grid gap-3 md:grid-cols-3">
              {data.stats.map((_, i) => (
                <div key={i} className="rounded-xl border border-[var(--color-border)] p-3">
                  <input className="admin-input mb-2" {...form.register(`stats.${i}.value`)} />
                  <input className="admin-input" {...form.register(`stats.${i}.label`)} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="admin-card p-5">
          <h3 className="mb-4 font-bold">Sections</h3>
          <div className="space-y-3">
            {sections.map((section, i) => (
              <div key={section.id} className="rounded-xl border border-[var(--color-border)] p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{section.label}</div>
                    <div className="text-xs text-slate-500">Order {section.order}</div>
                  </div>
                  <input type="checkbox" {...form.register(`sections.${i}.enabled`)} />
                </div>
                <p className="mt-2 text-sm text-slate-600">{section.summary}</p>
                <input type="number" className="admin-input mt-2" {...form.register(`sections.${i}.order`, { valueAsNumber: true })} />
              </div>
            ))}
          </div>
          {slides[0] ? (
            <div className="mt-5 overflow-hidden rounded-xl border border-[var(--color-border)]">
              <img src={slides[0].imageUrl} alt={slides[0].alt || 'Preview'} className="max-h-48 w-full object-cover" />
              <p className="p-2 text-center text-xs text-slate-500">{slides.length} slide{slides.length === 1 ? '' : 's'} in slider</p>
            </div>
          ) : null}
          <div className="mt-5 space-y-2">
            <p className="text-sm text-slate-600">
              Use <strong>Save as draft</strong> while editing, then <strong>Publish live</strong> when ready.
            </p>
            <button
              type="button"
              className="btn-secondary w-full"
              disabled={mutation.isPending}
              onClick={() => form.handleSubmit((v) => mutation.mutate({ values: v, status: 'draft' }))()}
            >
              {mutation.isPending && mutation.variables?.status === 'draft' ? 'Saving draft…' : 'Save as draft'}
            </button>
            <button
              type="button"
              className="btn-primary w-full"
              disabled={mutation.isPending}
              onClick={() => form.handleSubmit((v) => mutation.mutate({ values: v, status: 'published' }))()}
            >
              {mutation.isPending && mutation.variables?.status === 'published' ? 'Publishing…' : 'Publish live'}
            </button>
          </div>
        </div>
      </form>
    </>
  )
}
