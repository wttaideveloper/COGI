import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { mockHomepage } from '@/data/mock'
import { CUSTOM_BLOCK_OPTIONS, createHomepageBlock, ensureBuiltinSections, isCustomSection, isSplitSection, SECTION_HINTS } from '@/data/homepageBlocks'
import { mergeSiteCopy, type SiteCopy } from '@/data/siteCopy'
import { apiSingle, getErrorMessage, isDemoMode } from '@/services/strapi'
import { hydrateSiteConfigFromStrapi, loadSiteConfig, readFileAsDataUrl, saveSiteConfig, type SiteConfig } from '@/services/siteConfigStore'
import { getPreviewUrl } from '@/utils/preview'
import { MediaUpload, formatFileSize, validateMediaFile } from '@/components/MediaUpload'
import { RevertToLiveButton } from '@/components/RevertButton'
import type { HeroHeadlineCase, HeroMedia, HeroSlide, HomepageBlockKind, HomepageRecord, HomepageSection } from '@/types'

const HOMEPAGE_DRAFT_KEY = 'cogi_homepage_draft'

const HERO_MEDIA_OPTIONS: Array<{ id: HeroMedia; label: string; hint: string }> = [
  { id: 'video', label: 'Video', hint: 'YouTube link or upload an MP4 / WebM file' },
  { id: 'images', label: 'Image slider', hint: 'Rotate one or more photos behind the headline' },
]

const HERO_CASE_OPTIONS: Array<{ id: HeroHeadlineCase; label: string; hint: string }> = [
  { id: 'as-typed', label: 'As typed', hint: 'Keep the letters you typed' },
  { id: 'uppercase', label: 'UPPERCASE', hint: 'ALL CAPS' },
  { id: 'lowercase', label: 'lowercase', hint: 'all small letters' },
]

function heroTextTransform(value: HeroHeadlineCase | undefined): 'none' | 'uppercase' | 'lowercase' {
  if (value === 'lowercase') return 'lowercase'
  if (value === 'as-typed') return 'none'
  return 'uppercase'
}

function isEmbedVideo(url: string) {
  return /youtu\.be|youtube\.com|vimeo\.com/i.test(url)
}

function youtubeId(src: string) {
  return src.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{6,})/)?.[1] || null
}

function isFileVideo(url: string) {
  return url.startsWith('data:video') || /\.(mp4|webm|mov)(\?|$)/i.test(url)
}

type HeroMeta = { name: string; size: number; width?: number; height?: number }
type HomepageDraftPayload = {
  values: HomepageRecord
  copy: SiteCopy['homepage']
  savedAt: string
}

type EditorTab = {
  id: string
  label: string
  hint: string
}

function Field({
  label,
  children,
  hint,
  count,
  over,
}: {
  label: string
  children: ReactNode
  hint?: string
  count?: string
  over?: boolean
}) {
  return (
    <label className="hp-field">
      <span className="hp-field-head">
        <span className="admin-label">{label}</span>
        {count ? <span className={over ? 'hp-count hp-count-over' : 'hp-count'}>{count}</span> : null}
      </span>
      {children}
      {hint ? <span className="hp-hint">{hint}</span> : null}
    </label>
  )
}

function homepageFromConfig(config: SiteConfig): HomepageRecord {
  const home = config.homepage
  return {
    ...mockHomepage,
    ...home,
    heroHeadline: sampleOrEmpty(home.heroHeadline, SAMPLE_HEADLINES),
    heroIntro: sampleOrEmpty(home.heroIntro, SAMPLE_INTROS),
    primaryCtaLabel: sampleOrEmpty(home.primaryCtaLabel, SAMPLE_CTAS),
    heroHeadlineSize: home.heroHeadlineSize ?? 64,
    heroHeadlineCase: home.heroHeadlineCase ?? 'uppercase',
    heroMedia: home.heroMedia === 'video' ? 'video' : 'images',
    heroVideoUrl: home.heroVideoUrl ?? '',
    heroSlideDuration: home.heroSlideDuration ?? 6,
    mapOceanColor: home.mapOceanColor,
    mapLandColor: home.mapLandColor,
    mapPinColor: home.mapPinColor,
    mapActiveColor: home.mapActiveColor,
    stats: home.impactStats?.length ? home.impactStats.map((s) => ({ value: s.value, label: s.label })) : mockHomepage.stats,
    sections: ensureBuiltinSections(home.sections?.length ? home.sections : mockHomepage.sections),
    heroSlides: home.heroSlides,
  }
}

const SAMPLE_HEADLINES = [
  'Equipping Healthcare Professionals for Kingdom Engagement',
]
const SAMPLE_INTROS = [
  'We are a global fellowship of Christ-followers cultivating Communities of Grace in healthcare by accompanying individuals and communities to develop a Kingdom perspective that shapes life, vocation, and service. In a rapidly changing global context, Companions of Grace seek to envision, empower, and engage healthcare professionals and communities in creative mission engagement, cultivating thriving Kingdom communities.',
  'COGI cultivates communities of grace among healthcare professionals serving missionally around the world.',
]
const SAMPLE_CTAS = ['Give now', 'Join the Movement']

function sampleOrEmpty(value: string | undefined, samples: string | string[]) {
  const text = (value ?? '').trim()
  const list = Array.isArray(samples) ? samples : [samples]
  return list.some((sample) => text === sample.trim()) ? '' : (value ?? '')
}

function loadHomepageDraft(): HomepageDraftPayload | null {
  try {
    const raw = localStorage.getItem(HOMEPAGE_DRAFT_KEY)
    return raw ? (JSON.parse(raw) as HomepageDraftPayload) : null
  } catch {
    return null
  }
}

function readImageMeta(file: File, dataUrl: string): Promise<HeroMeta> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve({ name: file.name, size: file.size, width: img.naturalWidth, height: img.naturalHeight })
    img.onerror = () => resolve({ name: file.name, size: file.size })
    img.src = dataUrl
  })
}

export default function HomepageManagerPage() {
  const query = useQuery({ queryKey: ['homepage'], queryFn: () => apiSingle<HomepageRecord>('/homepage'), enabled: !isDemoMode() })
  const stored = loadSiteConfig()
  const existingDraft = loadHomepageDraft()
  const [hydrated, setHydrated] = useState<HomepageRecord | null>(null)
  const data = existingDraft?.values ?? hydrated ?? query.data ?? { ...mockHomepage, ...stored.homepage }
  const safeData: HomepageRecord = {
    ...mockHomepage,
    ...data,
    heroHeadline: sampleOrEmpty(data.heroHeadline, SAMPLE_HEADLINES),
    heroIntro: sampleOrEmpty(data.heroIntro, SAMPLE_INTROS),
    primaryCtaLabel: sampleOrEmpty(data.primaryCtaLabel, SAMPLE_CTAS),
    heroHeadlineSize: data.heroHeadlineSize ?? mockHomepage.heroHeadlineSize ?? 64,
    heroHeadlineCase: data.heroHeadlineCase ?? mockHomepage.heroHeadlineCase ?? 'uppercase',
    heroMedia: data.heroMedia === 'video' ? 'video' : 'images',
    heroVideoUrl: data.heroVideoUrl ?? '',
    heroSlideDuration: data.heroSlideDuration ?? mockHomepage.heroSlideDuration ?? 6,
    heroSlides: (Array.isArray(data.heroSlides) && data.heroSlides.length
      ? data.heroSlides
      : data.heroImageUrl
        ? [{ id: 'hero', imageUrl: data.heroImageUrl, alt: data.heroImageAlt || 'Hero image' }]
        : mockHomepage.heroSlides),
    mapOceanColor: data.mapOceanColor ?? mockHomepage.mapOceanColor,
    mapLandColor: data.mapLandColor ?? mockHomepage.mapLandColor,
    mapPinColor: data.mapPinColor ?? mockHomepage.mapPinColor,
    mapActiveColor: data.mapActiveColor ?? mockHomepage.mapActiveColor,
    stats: Array.isArray(data.stats) && data.stats.length ? data.stats : mockHomepage.stats,
    sections: ensureBuiltinSections(Array.isArray(data.sections) ? data.sections : mockHomepage.sections),
  }
  const form = useForm<HomepageRecord>({ values: safeData })
  const [copyHome, setCopyHome] = useState<SiteCopy['homepage']>(() =>
    existingDraft?.copy ?? mergeSiteCopy(stored.copy).homepage,
  )
  const [savedAs, setSavedAs] = useState<'draft' | 'published' | null>(null)
  const [hasDraft, setHasDraft] = useState(Boolean(existingDraft))
  const [heroMeta, setHeroMeta] = useState<HeroMeta | null>(null)
  const [heroUrlInput, setHeroUrlInput] = useState('')
  const [heroVideoInput, setHeroVideoInput] = useState('')
  const [heroUploadError, setHeroUploadError] = useState('')
  const [activeSlide, setActiveSlide] = useState(0)
  const [activeTab, setActiveTab] = useState('hero')
  const [dragOver, setDragOver] = useState(false)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [sectionQuery, setSectionQuery] = useState('')

  useEffect(() => {
    let active = true
    hydrateSiteConfigFromStrapi().then((config) => {
      if (!active) return
      setHydrated(homepageFromConfig(config))
      if (!loadHomepageDraft()?.copy) setCopyHome(mergeSiteCopy(config.copy).homepage)
    })
    return () => { active = false }
  }, [])

  const mutation = useMutation({
    mutationFn: async ({ values, status }: { values: HomepageRecord; status: 'draft' | 'published' }) => {
      const slides = (values.heroSlides || []).filter((slide) => Boolean(slide.imageUrl))
      const first = slides[0]
      const payload: HomepageRecord = {
        ...values,
        heroHeadlineSize: Number(values.heroHeadlineSize) || 64,
        heroHeadlineCase: values.heroHeadlineCase || 'uppercase',
        heroMedia: values.heroMedia === 'video' ? 'video' : 'images',
        heroVideoUrl: values.heroVideoUrl || '',
        heroSlideDuration: Number(values.heroSlideDuration) || 6,
        heroImageUrl: first?.imageUrl || values.heroImageUrl || '',
        heroImageAlt: first?.alt || values.heroImageAlt || '',
        heroSlides: slides,
      }
      localStorage.setItem(
        HOMEPAGE_DRAFT_KEY,
        JSON.stringify({ values: payload, copy: copyHome, savedAt: new Date().toISOString() } satisfies HomepageDraftPayload),
      )
      const currentCopy = loadSiteConfig().copy
      const saved = await saveSiteConfig({
        homepage: {
          heroHeadline: payload.heroHeadline,
          heroIntro: payload.heroIntro,
          heroHeadlineSize: payload.heroHeadlineSize,
          heroHeadlineCase: payload.heroHeadlineCase,
          heroMedia: payload.heroMedia,
          heroVideoUrl: payload.heroVideoUrl,
          heroImageUrl: payload.heroImageUrl,
          heroImageAlt: payload.heroImageAlt,
          heroSlideDuration: payload.heroSlideDuration,
          mapOceanColor: payload.mapOceanColor,
          mapLandColor: payload.mapLandColor,
          mapPinColor: payload.mapPinColor,
          mapActiveColor: payload.mapActiveColor,
          heroSlides: payload.heroSlides,
          primaryCtaLabel: payload.primaryCtaLabel,
          primaryCtaHref: payload.primaryCtaHref,
          missionTitle: payload.missionTitle,
          missionStatement: payload.missionStatement,
          missionScripture: payload.missionScripture ?? '',
          impactStats: (payload.stats || []).map((s) => ({ id: s.label, value: s.value, label: s.label })),
          sections: ensureBuiltinSections(payload.sections),
        },
        copy: { ...currentCopy, homepage: copyHome },
      }, status)
      if (status === 'published') localStorage.removeItem(HOMEPAGE_DRAFT_KEY)
      return { values: payload, status }
    },
    onSuccess: (_data, variables) => {
      setSavedAs(variables.status)
      setHasDraft(variables.status === 'draft')
      window.setTimeout(() => setSavedAs(null), 3000)
    },
  })

  async function onHeroFile(file: File | undefined, replaceIndex?: number) {
    if (!file) return
    const check = validateMediaFile(file, 'image')
    if (check.error) {
      setHeroUploadError(check.error)
      return
    }
    setHeroUploadError('')
    const url = await readFileAsDataUrl(file)
    const alt = file.name.replace(/\.[^.]+$/, '')
    const nextSlide: HeroSlide = { id: `hero-${Date.now()}`, imageUrl: url, alt }
    const current = currentSlides()
    const next = replaceIndex != null && current[replaceIndex]
      ? current.map((slide, index) => (index === replaceIndex ? { ...slide, imageUrl: url, alt: slide.alt || alt } : slide))
      : [...current, nextSlide]
    setHeroSlides(next)
    setActiveSlide(replaceIndex != null ? replaceIndex : next.length - 1)
    setHeroMeta(await readImageMeta(file, url))
  }

  async function onHeroVideoFile(file: File | undefined) {
    if (!file) return
    const check = validateMediaFile(file, 'video')
    if (check.error) {
      setHeroUploadError(check.error)
      return
    }
    setHeroUploadError(check.warning || '')
    const url = await readFileAsDataUrl(file)
    form.setValue('heroVideoUrl', url, { shouldDirty: true })
    form.setValue('heroMedia', 'video', { shouldDirty: true })
    setHeroMeta({ name: file.name, size: file.size })
  }

  function currentSlides(): HeroSlide[] {
    const slides = (form.getValues('heroSlides') || []).filter((slide) => Boolean(slide.imageUrl))
    if (slides.length) return slides
    const url = form.getValues('heroImageUrl')
    return url ? [{ id: 'hero', imageUrl: url, alt: form.getValues('heroImageAlt') || 'Hero image' }] : []
  }

  function setHeroSlides(next: HeroSlide[]) {
    form.setValue('heroSlides', next, { shouldDirty: true })
    form.setValue('heroImageUrl', next[0]?.imageUrl || '', { shouldDirty: true })
    form.setValue('heroImageAlt', next[0]?.alt || '', { shouldDirty: true })
  }

  function moveHeroSlide(index: number, dir: -1 | 1) {
    const slides = currentSlides()
    const target = index + dir
    if (target < 0 || target >= slides.length) return
    const next = [...slides]
    const [item] = next.splice(index, 1)
    next.splice(target, 0, item)
    setHeroSlides(next)
    setActiveSlide(target)
  }

  function removeHeroSlide(index: number) {
    const next = currentSlides().filter((_, i) => i !== index)
    setHeroSlides(next)
    setActiveSlide((prev) => Math.max(0, Math.min(prev, next.length - 1)))
  }

  function applyHeroUrl() {
    if (!heroUrlInput.trim()) return
    const next = [...currentSlides(), { id: `hero-${Date.now()}`, imageUrl: heroUrlInput.trim(), alt: 'Hero banner' }]
    setHeroSlides(next)
    setActiveSlide(next.length - 1)
    setHeroUrlInput('')
  }

  function applyHeroVideoUrl() {
    const url = heroVideoInput.trim() || (youtubeId(heroVideoUrl) ? heroVideoUrl : '')
    if (!url) return
    if (!youtubeId(url) && !isEmbedVideo(url)) {
      setHeroUploadError('Paste a YouTube link (watch, share, or Shorts). Or upload an MP4 / WebM file below.')
      return
    }
    form.setValue('heroVideoUrl', url, { shouldDirty: true })
    form.setValue('heroMedia', 'video', { shouldDirty: true })
    setHeroVideoInput(url)
    setHeroUploadError('')
  }

  function patchCopy<K extends keyof SiteCopy['homepage']>(key: K, value: SiteCopy['homepage'][K]) {
    setCopyHome((prev) => ({ ...prev, [key]: value }))
  }

  function save(status: 'draft' | 'published') {
    form.handleSubmit((v) => mutation.mutate({ values: v, status }))()
  }

  const sections = form.watch('sections') || []
  const heroImageUrl = form.watch('heroImageUrl')
  const heroSlides = (form.watch('heroSlides') || []).filter((slide) => Boolean(slide.imageUrl))
  const bannerSlides = heroSlides.length
    ? heroSlides
    : heroImageUrl
      ? [{ id: 'hero', imageUrl: heroImageUrl, alt: form.watch('heroImageAlt') || 'Hero image' }]
      : []
  const previewSlide = bannerSlides[Math.min(activeSlide, Math.max(0, bannerSlides.length - 1))]
  const slideDuration = Number(form.watch('heroSlideDuration') || 6)
  const headlineSize = Number(form.watch('heroHeadlineSize') || 64)
  const headlineCase = (form.watch('heroHeadlineCase') || 'uppercase') as HeroHeadlineCase
  const heroMedia = (form.watch('heroMedia') === 'video' ? 'video' : 'images') as HeroMedia
  const heroVideoUrl = form.watch('heroVideoUrl') || ''
  const youtubeThumbId = youtubeId(heroVideoUrl)
  const youtubeField = heroVideoInput || (youtubeThumbId ? heroVideoUrl : '')
  const headline = form.watch('heroHeadline') || ''
  const intro = form.watch('heroIntro') || ''
  const primaryCta = form.watch('primaryCtaLabel') || 'Give now'
  const sortedSections = useMemo(
    () => [...sections].sort((a, b) => a.order - b.order),
    [sections],
  )
  const navTabs: EditorTab[] = sortedSections.map((section) => ({
    id: section.id,
    label: section.label,
    hint: SECTION_HINTS[section.id] || section.summary || 'Custom section',
  }))
  const tabIndex = Math.max(0, navTabs.findIndex((tab) => tab.id === activeTab))
  const currentTab = navTabs.find((tab) => tab.id === activeTab) ?? navTabs[0] ?? { id: 'hero', label: 'Hero banner', hint: '' }
  const activeSection = sortedSections.find((section) => section.id === activeTab)
  const customEditing = Boolean(activeSection && isCustomSection(activeSection))
  const splitEditing = Boolean(activeSection && isSplitSection(activeSection))
  const visibleCount = sortedSections.filter((s) => s.enabled).length
  const draftOpen = hasDraft && savedAs !== 'published'
  const filteredSections = useMemo(() => {
    const q = sectionQuery.trim().toLowerCase()
    if (!q) return sortedSections
    return sortedSections.filter((section) => {
      const hint = SECTION_HINTS[section.id] || section.summary || ''
      return section.label.toLowerCase().includes(q) || hint.toLowerCase().includes(q)
    })
  }, [sortedSections, sectionQuery])

  function setSectionEnabled(id: string, enabled: boolean) {
    form.setValue(
      'sections',
      sections.map((s) => (s.id === id ? { ...s, enabled } : s)),
      { shouldDirty: true },
    )
  }

  function moveSection(id: string, dir: -1 | 1) {
    const ordered = [...sections].sort((a, b) => a.order - b.order)
    const i = ordered.findIndex((s) => s.id === id)
    const j = i + dir
    if (i < 0 || j < 0 || j >= ordered.length) return
    const a = ordered[i]
    const b = ordered[j]
    form.setValue(
      'sections',
      sections.map((s) => {
        if (s.id === a.id) return { ...s, order: b.order }
        if (s.id === b.id) return { ...s, order: a.order }
        return s
      }),
      { shouldDirty: true },
    )
  }

  function patchSection(id: string, patch: Partial<HomepageSection>) {
    form.setValue(
      'sections',
      sections.map((s) => (s.id === id ? { ...s, ...patch } : s)),
      { shouldDirty: true },
    )
  }

  function addSection(kind: Exclude<HomepageBlockKind, 'built-in'>) {
    const nextOrder = Math.max(0, ...sections.map((s) => s.order)) + 1
    const block = createHomepageBlock(kind, nextOrder)
    form.setValue('sections', [...sections, block], { shouldDirty: true })
    setActiveTab(block.id)
    setPickerOpen(false)
  }

  function removeSection(id: string) {
    const target = sections.find((s) => s.id === id)
    if (!target || !isCustomSection(target)) return
    if (!window.confirm(`Remove “${target.label}” from the homepage?`)) return
    form.setValue('sections', sections.filter((s) => s.id !== id), { shouldDirty: true })
    if (activeTab === id) setActiveTab('hero')
  }

  return (
    <div className="hp-page">
      <div className="hp-toolbar">
        <div className="hp-toolbar-copy">
          <p className={draftOpen ? 'hp-status hp-status-draft' : 'hp-status hp-status-live'}>
            <i className="hp-status-dot" />
            {draftOpen ? 'Unpublished draft' : 'Live homepage'}
          </p>
          <p>Click a block on the left, change the words or photos, then publish. Turn a block off if you do not want it on the live homepage.</p>
        </div>
        <div className="hp-toolbar-actions">
          <a className="btn-secondary" href={getPreviewUrl('/')} target="_blank" rel="noreferrer">Preview</a>
          <button type="button" className="btn-secondary" disabled={mutation.isPending} onClick={() => save('draft')}>
            {mutation.isPending && mutation.variables?.status === 'draft' ? 'Saving…' : 'Save draft'}
          </button>
          <button type="button" className="btn-primary" disabled={mutation.isPending} onClick={() => save('published')}>
            {mutation.isPending && mutation.variables?.status === 'published' ? 'Publishing…' : 'Publish live'}
          </button>
          <RevertToLiveButton
            scope="homepage"
            disabled={mutation.isPending}
            onReverted={(config) => {
              localStorage.removeItem(HOMEPAGE_DRAFT_KEY)
              const restored = homepageFromConfig(config)
              form.reset(restored)
              setHydrated(restored)
              setCopyHome(mergeSiteCopy(config.copy).homepage)
              setHasDraft(false)
              setSavedAs(null)
            }}
          />
        </div>
      </div>

      {query.error ? (
        <p className="hp-flash hp-flash-warn">Could not reach Strapi: {getErrorMessage(query.error)}. Local content is shown so you can keep editing.</p>
      ) : null}
      {draftOpen && savedAs !== 'draft' ? (
        <p className="hp-flash hp-flash-warn">This draft is not live yet. Publish when you want visitors to see it.</p>
      ) : null}
      {savedAs === 'draft' ? <p className="hp-flash hp-flash-warn">Draft saved. Publish when you are ready.</p> : null}
      {savedAs === 'published' ? <p className="hp-flash hp-flash-ok">Published. The public homepage updates immediately.</p> : null}
      {mutation.error ? <p className="hp-flash hp-flash-err">{getErrorMessage(mutation.error)}</p> : null}

      <div className="hp-workspace">
        <nav className="hp-rail" aria-label="Homepage sections">
          <div className="hp-rail-head">
            <p className="hp-rail-label">Homepage blocks</p>
            <p className="hp-side-count">{visibleCount} showing</p>
          </div>
          <p className="hp-hint">Click a block to edit it. Use On/Off to hide it from visitors.</p>
          <div className="hp-search">
            <input
              className="admin-input"
              value={sectionQuery}
              onChange={(e) => setSectionQuery(e.target.value)}
              placeholder="Find a block…"
              aria-label="Find a homepage block"
            />
          </div>
          <div className="hp-nav-wrap">
            <div className="hp-nav">
              {filteredSections.map((section) => {
                const i = sortedSections.findIndex((item) => item.id === section.id)
                return (
                  <div
                    key={section.id}
                    className={[
                      'hp-nav-item',
                      section.id === activeTab ? 'hp-nav-item-active' : '',
                      section.enabled ? '' : 'hp-nav-item-off',
                    ].filter(Boolean).join(' ')}
                  >
                    <span className="hp-nav-num">{i + 1}</span>
                    <button type="button" className="hp-nav-copy" onClick={() => setActiveTab(section.id)}>
                      <span className="hp-nav-title">{section.label}</span>
                      <span className="hp-nav-hint">{section.enabled ? (SECTION_HINTS[section.id] || section.summary || 'Custom block') : 'Hidden from the live page'}</span>
                    </button>
                    <div className="hp-move">
                      <button type="button" disabled={i === 0} aria-label={`Move ${section.label} up`} onClick={() => moveSection(section.id, -1)}>↑</button>
                      <button type="button" disabled={i === sortedSections.length - 1} aria-label={`Move ${section.label} down`} onClick={() => moveSection(section.id, 1)}>↓</button>
                    </div>
                    <button
                      type="button"
                      className={section.enabled ? 'admin-switch admin-switch-on' : 'admin-switch'}
                      aria-pressed={section.enabled}
                      aria-label={`${section.enabled ? 'Hide' : 'Show'} ${section.label}`}
                      onClick={() => setSectionEnabled(section.id, !section.enabled)}
                    />
                    <span className={section.enabled ? 'hp-vis hp-on' : 'hp-vis hp-off'}>{section.enabled ? 'On' : 'Off'}</span>
                  </div>
                )
              })}
            </div>
            <div className="hp-nav-fade" aria-hidden="true" />
          </div>
          {!filteredSections.length ? <p className="hp-hint">No blocks match that search.</p> : null}
          <button type="button" className="btn-primary hp-add-btn" onClick={() => setPickerOpen(true)}>
            + Add a block
          </button>
        </nav>

        <section className="hp-editor">
          <div className="hp-editor-head">
            <div>
              <p className="hp-step">Section {tabIndex + 1} of {navTabs.length || 1}</p>
              <h3>{currentTab.label}</h3>
              <p>{currentTab.hint}</p>
            </div>
            <div className="hp-pager">
              {customEditing ? (
                <button type="button" className="hp-danger" onClick={() => removeSection(activeTab)}>Remove section</button>
              ) : null}
              <button type="button" className="btn-secondary" disabled={tabIndex <= 0} aria-disabled={tabIndex <= 0} onClick={() => { if (tabIndex > 0) setActiveTab(navTabs[tabIndex - 1].id) }}>
                Previous
              </button>
              <button type="button" className="btn-secondary" disabled={tabIndex >= navTabs.length - 1} aria-disabled={tabIndex >= navTabs.length - 1} onClick={() => { if (tabIndex < navTabs.length - 1) setActiveTab(navTabs[tabIndex + 1].id) }}>
                Next
              </button>
            </div>
          </div>

          {activeTab === 'hero' ? (
            <div className="hp-hero">
              <div className="hp-fields">
                <Field label="Hero background" hint="Choose video or an image slider. Headline and buttons stay the same either way.">
                  <div className="hp-case hp-case-2" role="group" aria-label="Hero background">
                    {HERO_MEDIA_OPTIONS.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        className={heroMedia === option.id ? 'hp-case-btn hp-case-btn-on' : 'hp-case-btn'}
                        onClick={() => form.setValue('heroMedia', option.id, { shouldDirty: true })}
                      >
                        <strong>{option.label}</strong>
                        <span>{option.hint}</span>
                      </button>
                    ))}
                  </div>
                </Field>
                <Field label="Headline" hint="This sits over the photo or film. Keep it short." count={`${headline.length}/80`} over={headline.length > 80}>
                  <input className="admin-input" {...form.register('heroHeadline')} placeholder={SAMPLE_HEADLINES[0]} />
                </Field>
                <Field label="Headline letters" hint="Choose how the headline looks on the public homepage.">
                  <div className="hp-case" role="group" aria-label="Headline letter case">
                    {HERO_CASE_OPTIONS.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        className={headlineCase === option.id ? 'hp-case-btn hp-case-btn-on' : 'hp-case-btn'}
                        onClick={() => form.setValue('heroHeadlineCase', option.id, { shouldDirty: true })}
                      >
                        <strong>{option.label}</strong>
                        <span>{option.hint}</span>
                      </button>
                    ))}
                  </div>
                </Field>
                <Field label="Headline size" hint="Large screens use this size. Phones stay smaller automatically.">
                  <div className="hp-size">
                    <input className="hp-range" type="range" min={32} max={96} step={2} {...form.register('heroHeadlineSize', { valueAsNumber: true })} />
                    <output>{headlineSize}px</output>
                  </div>
                </Field>
                <Field label="Intro paragraph" count={`${intro.length}/280`} over={intro.length > 280}>
                  <textarea className="admin-input min-h-28" {...form.register('heroIntro')} placeholder={SAMPLE_INTROS[1]} />
                </Field>
                <div className="hp-grid-2">
                  <Field label="Main button" hint="Example: Give now">
                    <input className="admin-input" {...form.register('primaryCtaLabel')} placeholder={SAMPLE_CTAS[0]} />
                  </Field>
                  <Field label="Main button link" hint="Example: /donate">
                    <input className="admin-input" {...form.register('primaryCtaHref')} />
                  </Field>
                  <Field label="Second button">
                    <input className="admin-input" value={copyHome.secondaryCtaLabel} onChange={(e) => patchCopy('secondaryCtaLabel', e.target.value)} />
                  </Field>
                  <Field label="Second button link">
                    <input className="admin-input" value={copyHome.secondaryCtaHref} onChange={(e) => patchCopy('secondaryCtaHref', e.target.value)} />
                  </Field>
                </div>
                <Field label="Photo description" hint="Read aloud for visitors who cannot see the image.">
                  <input className="admin-input" {...form.register('heroImageAlt')} />
                </Field>
              </div>

              <div className="hp-fields">
                <div
                  className="hp-preview"
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault()
                    setDragOver(false)
                    const file = e.dataTransfer.files?.[0]
                    if (!file) return
                    if (heroMedia === 'video' && (file.type.startsWith('video/') || /\.(mp4|webm|mov)$/i.test(file.name))) {
                      void onHeroVideoFile(file)
                    } else {
                      void onHeroFile(file)
                    }
                  }}
                  style={dragOver ? { outline: '2px solid var(--color-sage)', outlineOffset: 2 } : undefined}
                >
                  {heroMedia === 'video' && heroVideoUrl && isFileVideo(heroVideoUrl) ? (
                    <video src={heroVideoUrl} muted loop playsInline autoPlay poster={previewSlide?.imageUrl} />
                  ) : youtubeThumbId ? (
                    <img src={`https://img.youtube.com/vi/${youtubeThumbId}/hqdefault.jpg`} alt="" />
                  ) : previewSlide ? (
                    <img src={previewSlide.imageUrl} alt="" />
                  ) : (
                    <div className="hp-preview-empty">
                      {heroMedia === 'video'
                        ? 'Add a YouTube link or upload a video to preview'
                        : 'Upload a photo to preview the banner'}
                    </div>
                  )}
                  <div className="hp-preview-scrim" />
                  <div className="hp-preview-copy">
                    {heroMedia === 'video' && heroVideoUrl ? (
                      <span className="hp-preview-badge">{youtubeThumbId ? 'YouTube video' : isFileVideo(heroVideoUrl) ? 'Uploaded video' : 'Video'}</span>
                    ) : heroMedia === 'images' && bannerSlides.length > 1 ? (
                      <span className="hp-preview-badge">Image slider · {bannerSlides.length} photos</span>
                    ) : null}
                    <h4 style={{ fontSize: `${Math.max(14, Math.round(headlineSize * 0.45))}px`, textTransform: heroTextTransform(headlineCase) }}>{headline || 'Headline'}</h4>
                    <p className="line-clamp-2">{intro || 'Intro text appears here.'}</p>
                    <div className="hp-preview-ctas">
                      <span className="hp-preview-primary">{primaryCta}</span>
                      <span className="hp-preview-secondary">{copyHome.secondaryCtaLabel}</span>
                    </div>
                  </div>
                </div>
                {heroMedia === 'video' ? (
                  <>
                    <Field label="YouTube" hint="Paste a YouTube watch, share, or Shorts link.">
                      <div className="hp-url-row">
                        <input
                          className="admin-input"
                          value={youtubeField}
                          onChange={(e) => setHeroVideoInput(e.target.value)}
                          placeholder="https://www.youtube.com/watch?v=..."
                        />
                        <button type="button" className="btn-secondary" onClick={applyHeroVideoUrl}>Use YouTube</button>
                      </div>
                    </Field>
                    {youtubeThumbId && youtubeField === heroVideoUrl ? (
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => {
                          form.setValue('heroVideoUrl', '', { shouldDirty: true })
                          setHeroVideoInput('')
                        }}
                      >
                        Remove YouTube video
                      </button>
                    ) : null}
                    <MediaUpload
                      kind="video"
                      label="Or upload a video file"
                      value={isFileVideo(heroVideoUrl) ? heroVideoUrl : ''}
                      onLoaded={(url, file) => {
                        form.setValue('heroVideoUrl', url, { shouldDirty: true })
                        form.setValue('heroMedia', 'video', { shouldDirty: true })
                        setHeroVideoInput('')
                        setHeroMeta({ name: file.name, size: file.size })
                        setHeroUploadError('')
                      }}
                      onClear={() => {
                        form.setValue('heroVideoUrl', '', { shouldDirty: true })
                        setHeroMeta(null)
                      }}
                    />
                    <p className="hp-hint">Use either YouTube or an uploaded file — the last one you add is what visitors see. Optional poster photo below is shown while the video loads.</p>
                  </>
                ) : (
                  <Field label="Slide duration" hint={bannerSlides.length > 1 ? 'How long each photo stays before the next one.' : 'Add more than one photo to create a slideshow.'}>
                    <div className="hp-size">
                      <input className="hp-range" type="range" min={3} max={12} step={1} {...form.register('heroSlideDuration', { valueAsNumber: true })} />
                      <output>{slideDuration}s</output>
                    </div>
                  </Field>
                )}
                {heroMedia === 'images' ? (
                <div className="hp-slides">
                  {bannerSlides.map((slide, index) => (
                    <div key={slide.id} className={index === activeSlide ? 'hp-slide hp-slide-on' : 'hp-slide'}>
                      <button type="button" className="hp-slide-thumb" onClick={() => setActiveSlide(index)}>
                        <img src={slide.imageUrl} alt="" />
                        <span>{index + 1}</span>
                      </button>
                      <div className="hp-slide-actions">
                        <button type="button" className="btn-secondary px-2 py-1 text-xs" disabled={index === 0} onClick={() => moveHeroSlide(index, -1)}>↑</button>
                        <button type="button" className="btn-secondary px-2 py-1 text-xs" disabled={index === bannerSlides.length - 1} onClick={() => moveHeroSlide(index, 1)}>↓</button>
                        <label className="btn-secondary px-2 py-1 text-xs cursor-pointer">
                          Replace
                          <input className="sr-only" type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => { onHeroFile(e.target.files?.[0], index); e.currentTarget.value = '' }} />
                        </label>
                        <button type="button" className="hp-danger" onClick={() => removeHeroSlide(index)}>Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
                ) : null}
                <MediaUpload
                  kind="image"
                  label={heroMedia === 'video' ? 'Optional poster photo' : 'Upload banner photo'}
                  onLoaded={async (url, file) => {
                    setHeroUploadError('')
                    const next = [...currentSlides(), { id: `hero-${Date.now()}`, imageUrl: url, alt: file.name.replace(/\.[^.]+$/, '') }]
                    setHeroSlides(next)
                    setActiveSlide(next.length - 1)
                    setHeroMeta(await readImageMeta(file, url))
                  }}
                  extra={(
                    <div className="hp-url-row">
                      <input className="admin-input" value={heroUrlInput} onChange={(e) => setHeroUrlInput(e.target.value)} placeholder="Or paste a photo URL" />
                      <button type="button" className="btn-secondary" onClick={applyHeroUrl}>Add URL</button>
                    </div>
                  )}
                />
                {heroUploadError ? <p className="hp-upload-error" role="alert">{heroUploadError}</p> : null}
                {heroMeta ? (
                  <div className="hp-meta">
                    <span className="hp-chip">{heroMeta.name}</span>
                    <span className="hp-chip">{formatFileSize(heroMeta.size)}</span>
                    {heroMeta.width && heroMeta.height ? <span className="hp-chip">{heroMeta.width} × {heroMeta.height} px</span> : null}
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}

          {activeTab === 'newsletterBanner' ? (
            <div className="hp-editor-split">
              <div className="hp-fields">
                <Field label="Small label" hint="Shown above the title.">
                  <input className="admin-input" value={copyHome.eyebrow} onChange={(e) => patchCopy('eyebrow', e.target.value)} />
                </Field>
                <Field label="Title">
                  <input className="admin-input" value={copyHome.newsletterBannerTitle} onChange={(e) => patchCopy('newsletterBannerTitle', e.target.value)} />
                </Field>
                <Field label="Body">
                  <textarea className="admin-input min-h-24" value={copyHome.newsletterBannerBody} onChange={(e) => patchCopy('newsletterBannerBody', e.target.value)} />
                </Field>
                <Field label="Button text" hint="Opens the Stories page.">
                  <input className="admin-input" value={copyHome.newsletterBannerCta} onChange={(e) => patchCopy('newsletterBannerCta', e.target.value)} />
                </Field>
              </div>
              <div>
                <p className="hp-preview-label">Visitor preview</p>
                <div className="hp-canvas hp-canvas-gold">
                  <p className="hp-kicker">{copyHome.eyebrow || 'Small label'}</p>
                  <h4>{copyHome.newsletterBannerTitle || 'Title'}</h4>
                  <p>{copyHome.newsletterBannerBody || 'Body text appears here.'}</p>
                  <span className="hp-canvas-btn">{copyHome.newsletterBannerCta || 'Button'}</span>
                </div>
              </div>
            </div>
          ) : null}

          {activeTab === 'legacy' ? (
            <div className="hp-editor-split">
              <div className="hp-fields">
                <Field label="Title">
                  <input className="admin-input" value={copyHome.legacyTitle} onChange={(e) => patchCopy('legacyTitle', e.target.value)} />
                </Field>
                <Field label="Body">
                  <textarea className="admin-input min-h-32" value={copyHome.legacyBody} onChange={(e) => patchCopy('legacyBody', e.target.value)} />
                </Field>
              </div>
              <div>
                <p className="hp-preview-label">Visitor preview</p>
                <div className="hp-canvas hp-canvas-dark">
                  <h4>{copyHome.legacyTitle || 'Title'}</h4>
                  <p>{copyHome.legacyBody || 'Body text appears here.'}</p>
                </div>
              </div>
            </div>
          ) : null}

          {activeTab === 'video' ? (
            <div className="hp-hero">
              <div className="hp-fields">
                <Field label="Title">
                  <input className="admin-input" value={copyHome.videoTitle} onChange={(e) => patchCopy('videoTitle', e.target.value)} />
                </Field>
                <Field label="Description">
                  <textarea className="admin-input min-h-24" value={copyHome.videoDescription} onChange={(e) => patchCopy('videoDescription', e.target.value)} />
                </Field>
                <MediaUpload
                  kind="image"
                  label="Thumbnail photo"
                  value={copyHome.videoImageUrl}
                  onLoaded={(url) => patchCopy('videoImageUrl', url)}
                  onClear={() => patchCopy('videoImageUrl', '')}
                />
                <MediaUpload
                  kind="video"
                  label="Video file"
                  value={copyHome.videoUrl?.startsWith('data:video') ? copyHome.videoUrl : ''}
                  onLoaded={(url) => patchCopy('videoUrl', url)}
                  onClear={() => patchCopy('videoUrl', '')}
                  extra={(
                    <Field label="Or paste a video link" hint="YouTube, Vimeo, or a direct MP4 URL.">
                      <input
                        className="admin-input"
                        value={copyHome.videoUrl?.startsWith('data:') ? '' : copyHome.videoUrl}
                        onChange={(e) => patchCopy('videoUrl', e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=…"
                      />
                    </Field>
                  )}
                />
              </div>
              <div>
                <p className="hp-preview-label">Thumbnail preview</p>
                {copyHome.videoImageUrl ? (
                  <img src={copyHome.videoImageUrl} alt="" className="hp-thumb" style={{ height: 220 }} />
                ) : (
                  <div className="hp-preview-empty" style={{ borderRadius: '1rem', background: 'var(--color-mist)', color: 'var(--color-ink-muted)' }}>No thumbnail yet</div>
                )}
              </div>
            </div>
          ) : null}

          {activeTab === 'mission' ? (
            <div className="hp-editor-split">
              <div className="hp-fields">
                <Field label="Title">
                  <input className="admin-input" {...form.register('missionTitle')} />
                </Field>
                <Field label="Mission statement">
                  <textarea className="admin-input min-h-32" {...form.register('missionStatement')} />
                </Field>
                <Field label="Scripture" hint="Optional. Shown under the statement.">
                  <input className="admin-input" {...form.register('missionScripture')} />
                </Field>
              </div>
              <div>
                <p className="hp-preview-label">Visitor preview</p>
                <div className="hp-canvas hp-canvas-mist">
                  <p className="hp-kicker">{form.watch('missionTitle') || 'Title'}</p>
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 600 }}>{form.watch('missionStatement') || 'Mission statement'}</h4>
                  <p>{form.watch('missionScripture') || ''}</p>
                </div>
              </div>
            </div>
          ) : null}

          {activeTab === 'methods' ? (
            <div className="hp-fields">
              <Field label="Title">
                <input className="admin-input" value={copyHome.methodsTitle} onChange={(e) => patchCopy('methodsTitle', e.target.value)} />
              </Field>
              <Field label="Subtitle">
                <input className="admin-input" value={copyHome.methodsSubtitle} onChange={(e) => patchCopy('methodsSubtitle', e.target.value)} />
              </Field>
              <div className="hp-note">The three method cards come from Programs. Change headings here; edit card content in Programs.</div>
            </div>
          ) : null}

          {activeTab === 'impact' ? (
            <div className="hp-fields">
              <Field label="Title">
                <input className="admin-input" value={copyHome.impactTitle} onChange={(e) => patchCopy('impactTitle', e.target.value)} />
              </Field>
              <Field label="Intro">
                <textarea className="admin-input min-h-24" value={copyHome.impactIntro} onChange={(e) => patchCopy('impactIntro', e.target.value)} />
              </Field>
              <div className="hp-grid-2">
                {safeData.stats.map((_, i) => (
                  <div key={i} className="hp-stat-card">
                    <Field label="Number">
                      <input className="admin-input" {...form.register(`stats.${i}.value`)} placeholder="500+" />
                    </Field>
                    <Field label="What it measures">
                      <input className="admin-input" {...form.register(`stats.${i}.label`)} placeholder="Professionals equipped" />
                    </Field>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {activeTab === 'portfolio' ? (
            <div className="hp-fields">
              <Field label="Title">
                <input className="admin-input" value={copyHome.portfolioTitle} onChange={(e) => patchCopy('portfolioTitle', e.target.value)} />
              </Field>
              <Field label="Subtitle">
                <textarea className="admin-input min-h-24" value={copyHome.portfolioSubtitle} onChange={(e) => patchCopy('portfolioSubtitle', e.target.value)} />
              </Field>
              <div className="hp-note">
                Portfolio cards list your programs.
                <div className="hp-note-actions">
                  <Link className="btn-secondary" to="/programs">Edit programs</Link>
                </div>
              </div>
            </div>
          ) : null}

          {activeTab === 'map' ? (
            <div className="hp-fields">
              <Field label="Title">
                <input className="admin-input" value={copyHome.mapTitle} onChange={(e) => patchCopy('mapTitle', e.target.value)} />
              </Field>
              <Field label="Subtitle">
                <textarea className="admin-input min-h-24" value={copyHome.mapSubtitle} onChange={(e) => patchCopy('mapSubtitle', e.target.value)} />
              </Field>
              <div className="hp-map-preview" style={{ background: form.watch('mapOceanColor') || '#F7FAFC' }}>
                <div className="hp-map-land" style={{ background: form.watch('mapLandColor') || '#1B3A6B' }} />
                <span className="hp-map-pin" style={{ background: form.watch('mapPinColor') || '#2B6CB0' }} />
                <span className="hp-map-pin hp-map-pin-on" style={{ background: form.watch('mapActiveColor') || '#3B82F6' }} />
                <p>Ocean, land, and pin colors update the public map.</p>
              </div>
              <div className="hp-grid-2">
                <Field label="Ocean color">
                  <div className="hp-color">
                    <input type="color" value={form.watch('mapOceanColor') || '#F7FAFC'} onChange={(e) => form.setValue('mapOceanColor', e.target.value, { shouldDirty: true })} />
                    <input className="admin-input" value={form.watch('mapOceanColor') || '#F7FAFC'} onChange={(e) => form.setValue('mapOceanColor', e.target.value, { shouldDirty: true })} />
                  </div>
                </Field>
                <Field label="Land color">
                  <div className="hp-color">
                    <input type="color" value={form.watch('mapLandColor') || '#1B3A6B'} onChange={(e) => form.setValue('mapLandColor', e.target.value, { shouldDirty: true })} />
                    <input className="admin-input" value={form.watch('mapLandColor') || '#1B3A6B'} onChange={(e) => form.setValue('mapLandColor', e.target.value, { shouldDirty: true })} />
                  </div>
                </Field>
                <Field label="Pin color">
                  <div className="hp-color">
                    <input type="color" value={form.watch('mapPinColor') || '#2B6CB0'} onChange={(e) => form.setValue('mapPinColor', e.target.value, { shouldDirty: true })} />
                    <input className="admin-input" value={form.watch('mapPinColor') || '#2B6CB0'} onChange={(e) => form.setValue('mapPinColor', e.target.value, { shouldDirty: true })} />
                  </div>
                </Field>
                <Field label="Selected pin color">
                  <div className="hp-color">
                    <input type="color" value={form.watch('mapActiveColor') || '#3B82F6'} onChange={(e) => form.setValue('mapActiveColor', e.target.value, { shouldDirty: true })} />
                    <input className="admin-input" value={form.watch('mapActiveColor') || '#3B82F6'} onChange={(e) => form.setValue('mapActiveColor', e.target.value, { shouldDirty: true })} />
                  </div>
                </Field>
              </div>
              <div className="hp-note">
                Country pins are edited in Locations. Publish live to show the new map colors on the public homepage.
                <div className="hp-note-actions">
                  <Link className="btn-secondary" to="/locations">Edit locations</Link>
                </div>
              </div>
            </div>
          ) : null}

          {activeTab === 'stories' ? (
            <div className="hp-fields">
              <Field label="Title">
                <input className="admin-input" value={copyHome.storiesTitle} onChange={(e) => patchCopy('storiesTitle', e.target.value)} />
              </Field>
              <Field label="Subtitle">
                <input className="admin-input" value={copyHome.storiesSubtitle} onChange={(e) => patchCopy('storiesSubtitle', e.target.value)} />
              </Field>
              <div className="hp-grid-2">
                <Field label="Watch stories button">
                  <input className="admin-input" value={copyHome.watchStoriesCta} onChange={(e) => patchCopy('watchStoriesCta', e.target.value)} />
                </Field>
                <Field label="Read stories button">
                  <input className="admin-input" value={copyHome.readStoriesCta} onChange={(e) => patchCopy('readStoriesCta', e.target.value)} />
                </Field>
              </div>
              <div className="hp-note">
                Choose which stories appear in the Stories module.
                <div className="hp-note-actions">
                  <Link className="btn-secondary" to="/stories">Edit stories</Link>
                </div>
              </div>
            </div>
          ) : null}

          {activeTab === 'faith' ? (
            <div className="hp-fields">
              <Field label="Title">
                <input className="admin-input" value={copyHome.faithTitle} onChange={(e) => patchCopy('faithTitle', e.target.value)} />
              </Field>
              <Field label="Statement">
                <textarea className="admin-input min-h-36" value={copyHome.faithStatement} onChange={(e) => patchCopy('faithStatement', e.target.value)} />
              </Field>
            </div>
          ) : null}

          {activeTab === 'events' ? (
            <div className="hp-note">
              This block shows the next featured event from the Events module.
              <div className="hp-note-actions"><Link className="btn-secondary" to="/events">Edit events</Link></div>
            </div>
          ) : null}
          {activeTab === 'newsletter' ? (
            <div className="hp-note">
              This block shows the newsletter signup form. Subscriber lists are in Newsletter.
              <div className="hp-note-actions"><Link className="btn-secondary" to="/newsletter">Open newsletter</Link></div>
            </div>
          ) : null}
          {activeTab === 'donate' ? (
            <div className="hp-note">
              This block invites people to give. Edit donate page copy in Website Copy or the Donate page.
              <div className="hp-note-actions"><Link className="btn-secondary" to="/website-copy">Edit website copy</Link></div>
            </div>
          ) : null}

          {(customEditing || splitEditing) && activeSection ? (
            <div className="hp-fields">
              {customEditing ? (
                <Field label="Section name" hint="Shown in this admin list. Visitors see the title below.">
                  <input className="admin-input" value={activeSection.label} onChange={(e) => patchSection(activeSection.id, { label: e.target.value })} />
                </Field>
              ) : null}
              {activeSection.kind === 'banner' || activeSection.kind === 'cta' ? (
                <Field label="Small label above the title">
                  <input className="admin-input" value={activeSection.eyebrow || ''} onChange={(e) => patchSection(activeSection.id, { eyebrow: e.target.value })} />
                </Field>
              ) : null}
              <Field label="Title">
                <input className="admin-input" value={activeSection.title || ''} onChange={(e) => patchSection(activeSection.id, { title: e.target.value })} />
              </Field>
              <Field label={activeSection.kind === 'quote' ? 'Quote' : 'Body'}>
                <textarea className="admin-input min-h-28" value={activeSection.content || ''} onChange={(e) => patchSection(activeSection.id, { content: e.target.value })} />
              </Field>
              {splitEditing || ['banner', 'image'].includes(activeSection.kind || '') ? (
                <>
                  <MediaUpload
                    kind="image"
                    label="Photo"
                    value={activeSection.imageUrl}
                    onLoaded={(url, file) => patchSection(activeSection.id, { imageUrl: url, imageAlt: activeSection.imageAlt || file.name.replace(/\.[^.]+$/, '') })}
                    onClear={() => patchSection(activeSection.id, { imageUrl: '' })}
                  />
                  <Field label="Photo description">
                    <input className="admin-input" value={activeSection.imageAlt || ''} onChange={(e) => patchSection(activeSection.id, { imageAlt: e.target.value })} />
                  </Field>
                </>
              ) : null}
              {splitEditing ? (
                <Field label="Photo placement" hint="Same layout as Colson Center: a full-height photo beside the story.">
                  <div className="hp-case hp-case-2" role="group" aria-label="Photo placement">
                    <button
                      type="button"
                      className={activeSection.imageSide === 'left' ? 'hp-case-btn hp-case-btn-on' : 'hp-case-btn'}
                      onClick={() => patchSection(activeSection.id, { imageSide: 'left' })}
                    >
                      <strong>Image on left</strong>
                      <span>Photo first, then text</span>
                    </button>
                    <button
                      type="button"
                      className={activeSection.imageSide !== 'left' ? 'hp-case-btn hp-case-btn-on' : 'hp-case-btn'}
                      onClick={() => patchSection(activeSection.id, { imageSide: 'right' })}
                    >
                      <strong>Image on right</strong>
                      <span>Text first, then photo</span>
                    </button>
                  </div>
                </Field>
              ) : null}
              {splitEditing || activeSection.kind === 'cta' || activeSection.kind === 'banner' ? (
                <div className="hp-grid-2">
                  <Field label="Button text">
                    <input className="admin-input" value={activeSection.buttonLabel || ''} onChange={(e) => patchSection(activeSection.id, { buttonLabel: e.target.value })} />
                  </Field>
                  <Field label="Button link">
                    <input className="admin-input" value={activeSection.buttonHref || ''} onChange={(e) => patchSection(activeSection.id, { buttonHref: e.target.value })} />
                  </Field>
                </div>
              ) : null}
            </div>
          ) : null}
        </section>
      </div>

      {pickerOpen ? (
        <div className="admin-modal-backdrop" onClick={() => setPickerOpen(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-labelledby="add-section-title">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <h3 id="add-section-title" className="text-lg font-extrabold text-[var(--color-primary)]">Add a homepage block</h3>
                <p className="mt-1 text-sm text-slate-600">Pick a layout. Then type the words, add a photo if you want one, and publish.</p>
              </div>
              <button type="button" className="admin-icon-btn admin-modal-close" onClick={() => setPickerOpen(false)} aria-label="Close">×</button>
            </div>
            <div className="hp-picker">
              {CUSTOM_BLOCK_OPTIONS.map((option) => (
                <button key={option.kind} type="button" className="hp-picker-card" onClick={() => addSection(option.kind)}>
                  <strong>{option.label}</strong>
                  <span>{option.summary}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
