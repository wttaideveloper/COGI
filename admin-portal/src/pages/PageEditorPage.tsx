import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { mockPages } from '@/data/mock'
import { PAGE_SECTION_OPTIONS, PAGE_TEMPLATES, createSection, sectionsFromTemplate, slugify, type PageSection, type PageSectionType, type PageTemplateId } from '@/data/pageTemplates'
import { loadLocalRecords, saveLocalRecords } from '@/services/localRecords'
import { apiCreate, apiListAll, apiPublish, apiUnpublish, apiUpdate, getErrorMessage, isDemoMode } from '@/services/strapi'
import { notifyPublished } from '@/services/siteConfigStore'
import { getPreviewUrl } from '@/utils/preview'
import type { PageRecord } from '@/types'

const emptyPage = (): PageRecord & { sections: PageSection[] } => ({
  id: '',
  title: '',
  slug: '',
  status: 'draft',
  pageType: 'content',
  summary: '',
  heroImageUrl: '',
  externalUrl: '',
  showInHeader: true,
  showInFooter: false,
  templateId: 'starter',
  seo: { metaTitle: '', metaDescription: '', keywords: '' },
  sections: sectionsFromTemplate('starter'),
})

export default function PageEditorPage() {
  const { id } = useParams()
  const isNew = id === 'new' || !id
  const navigate = useNavigate()
  const qc = useQueryClient()
  const [step, setStep] = useState<'template' | 'editor'>(isNew ? 'template' : 'editor')
  const [page, setPage] = useState<PageRecord & { sections: PageSection[] }>(emptyPage)
  const [savedAs, setSavedAs] = useState<'draft' | 'published' | null>(null)
  const [localRows, setLocalRows] = useState(() => loadLocalRecords('pages', mockPages as PageRecord[]))

  const query = useQuery({
    queryKey: ['pages'],
    queryFn: () => apiListAll<PageRecord>('/pages'),
    enabled: !isDemoMode() && !isNew,
  })

  const rows = isDemoMode() || !query.data?.length ? localRows : query.data

  useEffect(() => {
    if (isNew) return
    const found = rows.find((row) => row.id === id || row.documentId === id)
    if (!found) return
    setPage({
      ...emptyPage(),
      ...found,
      pageType: found.pageType || 'content',
      summary: found.summary || '',
      heroImageUrl: found.heroImageUrl || '',
      externalUrl: found.externalUrl || '',
      showInHeader: found.showInHeader !== false,
      showInFooter: Boolean(found.showInFooter),
      seo: {
        metaTitle: found.seo?.metaTitle || found.title,
        metaDescription: found.seo?.metaDescription || '',
        keywords: found.seo?.keywords || '',
      },
      sections: (found.sections || []).map((section) => ({
        id: section.id,
        type: (section.type as PageSectionType) || 'text',
        title: section.title,
        content: section.content,
        imageUrl: section.imageUrl || '',
        buttonLabel: section.buttonLabel,
        buttonHref: section.buttonHref,
      })) as PageSection[],
    })
    setStep('editor')
  }, [id, isNew, rows])

  const selectedTemplate = useMemo(
    () => PAGE_TEMPLATES.find((item) => item.id === page.templateId) || PAGE_TEMPLATES[0],
    [page.templateId],
  )

  function patch<K extends keyof PageRecord>(key: K, value: PageRecord[K]) {
    setPage((prev) => ({ ...prev, [key]: value }))
  }

  function applyTemplate(templateId: PageTemplateId) {
    const template = PAGE_TEMPLATES.find((item) => item.id === templateId) || PAGE_TEMPLATES[0]
    setPage((prev) => ({
      ...prev,
      templateId,
      pageType: template.pageType,
      sections: sectionsFromTemplate(templateId),
      title: prev.title || template.label,
      slug: prev.slug || slugify(prev.title || template.label),
    }))
  }

  function startFromTemplate() {
    if (!page.title.trim()) {
      const title = selectedTemplate.label === 'Blank page' ? 'New Page' : selectedTemplate.label
      setPage((prev) => ({ ...prev, title, slug: slugify(title) }))
    } else if (!page.slug) {
      setPage((prev) => ({ ...prev, slug: slugify(prev.title) }))
    }
    setStep('editor')
  }

  function updateSection(sectionId: string, patchValue: Partial<PageSection>) {
    setPage((prev) => ({
      ...prev,
      sections: prev.sections.map((section) => (section.id === sectionId ? { ...section, ...patchValue } : section)) as PageSection[],
    }))
  }

  function moveSection(index: number, direction: -1 | 1) {
    setPage((prev) => {
      const next = [...prev.sections] as PageSection[]
      const target = index + direction
      if (target < 0 || target >= next.length) return prev
      const [row] = next.splice(index, 1)
      next.splice(target, 0, row)
      return { ...prev, sections: next }
    })
  }

  const save = useMutation({
    mutationFn: async (status: 'draft' | 'published') => {
      const payload: PageRecord = {
        ...page,
        status,
        title: page.title.trim() || 'Untitled page',
        slug: page.slug.trim() || slugify(page.title || 'untitled'),
        updatedAt: new Date().toISOString().slice(0, 10),
        seo: {
          metaTitle: page.seo?.metaTitle || page.title,
          metaDescription: page.seo?.metaDescription || page.summary || '',
          keywords: page.seo?.keywords || '',
        },
        sections: page.pageType === 'link' ? [] : page.sections,
      }
      const { id: _id, documentId: _documentId, createdAt: _createdAt, updatedAt: _updatedAt, ...body } = payload
      setPage((prev) => ({ ...prev, status }))
      if (isDemoMode()) {
        const id = String(page.id || page.documentId || Date.now())
        const record = { ...payload, id, documentId: id } as PageRecord
        setLocalRows((prev) => {
          const next = isNew
            ? [record, ...prev.filter((row) => row.slug !== record.slug)]
            : prev.map((row) => (row.id === page.id || row.documentId === page.documentId || row.slug === record.slug ? record : row))
          saveLocalRecords('pages', next)
          return next
        })
        return record
      }
      if (isNew) {
        const created = await apiCreate('/pages', body, 'draft')
        const createdId = (created as { data?: { documentId?: string } })?.data?.documentId
        if (createdId && status === 'published') await apiPublish('/pages', createdId)
        return created
      }
      const documentId = page.documentId || page.id || String(id)
      await apiUpdate('/pages', documentId, body, 'draft')
      if (status === 'published') await apiPublish('/pages', documentId)
      else await apiUnpublish('/pages', documentId)
      return payload
    },
    onSuccess: (_data, status) => {
      qc.invalidateQueries({ queryKey: ['pages'] })
      setSavedAs(status)
      if (status === 'published') notifyPublished()
      window.setTimeout(() => {
        setSavedAs(null)
        if (status === 'published') navigate('/pages')
      }, status === 'published' ? 900 : 1800)
    },
  })

  if (step === 'template' && isNew) {
    return (
      <>
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-[var(--color-primary)]">Create a new page</h2>
          <p className="mt-1 text-sm text-slate-600">Pick a layout, then add the words and photos. Main site pages such as About and Donate are edited under Site pages.</p>
          </div>
          <Link className="btn-secondary" to="/pages">Back to pages</Link>
        </div>

        <div className="admin-card mb-4 space-y-3 p-5">
          <label className="block">
            <span className="admin-label">Page title</span>
            <input
              className="admin-input"
              value={page.title}
              onChange={(e) => {
                const title = e.target.value
                setPage((prev) => ({ ...prev, title, slug: prev.slug || slugify(title) }))
              }}
              placeholder="e.g. Care for the Caregiver, About Us, Retreat 2026"
            />
          </label>
        </div>

        <div className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {PAGE_TEMPLATES.map((template) => (
            <button
              key={template.id}
              type="button"
              className={`page-template-card${page.templateId === template.id ? ' page-template-card-active' : ''}`}
              onClick={() => applyTemplate(template.id)}
            >
              <span className="text-2xl" aria-hidden="true">{template.emoji}</span>
              <strong className="mt-2 block">{template.label}</strong>
              <p className="mt-1 text-sm text-slate-600">{template.description}</p>
              <span className="mt-3 inline-block text-xs font-semibold text-[var(--color-sage)]">
                {template.pageType === 'link' ? 'Link only' : template.sections.length ? `${template.sections.length} sections` : 'Blank canvas'}
              </span>
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <button type="button" className="btn-primary" onClick={startFromTemplate}>Continue to editor</button>
          <Link className="btn-secondary" to="/pages">Cancel</Link>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[var(--color-primary)]">{isNew ? 'Create page' : 'Edit page'}</h2>
          <p className="mt-1 text-sm text-slate-600">This extra page appears at its URL after you publish. Main wording for About, Donate, and Contact is in Site pages.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {isNew ? <button type="button" className="btn-secondary" onClick={() => setStep('template')}>Change template</button> : null}
          <Link className="btn-secondary" to="/pages">Back</Link>
          <a className="btn-secondary" href={getPreviewUrl(page.slug || '')} target="_blank" rel="noreferrer">Preview</a>
          <button type="button" className="btn-secondary" disabled={save.isPending} onClick={() => save.mutate('draft')}>
            {save.isPending && save.variables === 'draft' ? 'Saving draft…' : 'Save as draft'}
          </button>
          <button type="button" className="btn-primary" disabled={save.isPending} onClick={() => save.mutate('published')}>
            {save.isPending && save.variables === 'published' ? 'Publishing…' : 'Publish live'}
          </button>
        </div>
      </div>

      {savedAs === 'draft' ? <p className="mb-4 text-sm font-semibold text-amber-700">Draft saved — not live on the public site yet.</p> : null}
      {savedAs === 'published' ? <p className="mb-4 text-sm font-semibold text-emerald-700">Published live — the public page updates immediately.</p> : null}
      {save.error ? <p className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{getErrorMessage(save.error)}</p> : null}

      <div className="mb-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-slate-600">
        Current status:{' '}
        <strong className={page.status === 'published' ? 'text-emerald-700' : 'text-amber-700'}>
          {page.status === 'published' ? 'Published (live)' : 'Draft'}
        </strong>
        . Use <strong>Save as draft</strong> to keep working privately, then <strong>Publish live</strong> when ready.
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
        <div className="space-y-4">
          <div className="admin-card grid gap-4 p-5 md:grid-cols-2">
            <h3 className="md:col-span-2 font-bold text-[var(--color-primary)]">Basics</h3>
            <label className="block">
              <span className="admin-label">Title</span>
              <input className="admin-input" value={page.title} onChange={(e) => patch('title', e.target.value)} />
            </label>
            <label className="block">
              <span className="admin-label">Slug / URL</span>
              <input className="admin-input" value={page.slug} onChange={(e) => patch('slug', slugify(e.target.value))} />
            </label>
            <label className="block">
              <span className="admin-label">Status</span>
              <select className="admin-input" value={page.status} onChange={(e) => patch('status', e.target.value as PageRecord['status'])}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </label>
            <label className="block">
              <span className="admin-label">Page type</span>
              <select className="admin-input" value={page.pageType || 'content'} onChange={(e) => patch('pageType', e.target.value as PageRecord['pageType'])}>
                <option value="content">Content page</option>
                <option value="link">Menu link only</option>
              </select>
            </label>
            <div className="md:col-span-2">
              <label className="block">
                <span className="admin-label">Summary</span>
                <textarea className="admin-input min-h-24" value={page.summary || ''} onChange={(e) => patch('summary', e.target.value)} placeholder="Short description for cards and SEO" />
              </label>
            </div>
            {page.pageType === 'link' ? (
              <div className="md:col-span-2">
                <label className="block">
                  <span className="admin-label">Link URL</span>
                  <input className="admin-input" value={page.externalUrl || ''} onChange={(e) => patch('externalUrl', e.target.value)} placeholder="/donate or https://..." />
                </label>
              </div>
            ) : (
              <div className="md:col-span-2">
                <label className="block">
                  <span className="admin-label">Hero / banner image URL</span>
                  <input className="admin-input" value={page.heroImageUrl || ''} onChange={(e) => patch('heroImageUrl', e.target.value)} placeholder="https://..." />
                </label>
              </div>
            )}
          </div>

          {page.pageType !== 'link' ? (
            <div className="admin-card space-y-4 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-bold text-[var(--color-primary)]">Content sections</h3>
                <div className="flex flex-wrap gap-2">
                  {PAGE_SECTION_OPTIONS.map((option) => (
                    <button
                      key={option.type}
                      type="button"
                      className="admin-ghost-btn"
                      title={option.description}
                      onClick={() => setPage((prev) => ({ ...prev, sections: [...prev.sections, createSection(option.type)] as PageSection[] }))}
                    >
                      + {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {!page.sections.length ? <p className="text-sm text-slate-500">No sections yet — add a block above.</p> : null}

              {page.sections.map((section, index) => (
                <div key={section.id} className="rounded-xl border border-[var(--color-border)] p-4">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <span className="rounded-full bg-[var(--color-mist)] px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-[var(--color-primary)]">
                      {section.type}
                    </span>
                    <div className="flex gap-1">
                      <button type="button" className="btn-secondary px-2 py-1" onClick={() => moveSection(index, -1)} disabled={index === 0}>↑</button>
                      <button type="button" className="btn-secondary px-2 py-1" onClick={() => moveSection(index, 1)} disabled={index === page.sections.length - 1}>↓</button>
                      <button type="button" className="btn-danger px-2 py-1" onClick={() => setPage((prev) => ({ ...prev, sections: prev.sections.filter((row) => row.id !== section.id) as PageSection[] }))}>Remove</button>
                    </div>
                  </div>
                  <div className="grid gap-3">
                    <input className="admin-input" value={section.title} onChange={(e) => updateSection(section.id, { title: e.target.value })} placeholder="Section title" />
                    <textarea className="admin-input min-h-24" value={section.content} onChange={(e) => updateSection(section.id, { content: e.target.value })} placeholder="Section content" />
                    {['banner', 'image', 'split'].includes(section.type) ? (
                      <input className="admin-input" value={section.imageUrl || ''} onChange={(e) => updateSection(section.id, { imageUrl: e.target.value })} placeholder="Image URL" />
                    ) : null}
                    {section.type === 'cta' ? (
                      <div className="grid gap-3 md:grid-cols-2">
                        <input className="admin-input" value={section.buttonLabel || ''} onChange={(e) => updateSection(section.id, { buttonLabel: e.target.value })} placeholder="Button label" />
                        <input className="admin-input" value={section.buttonHref || ''} onChange={(e) => updateSection(section.id, { buttonHref: e.target.value })} placeholder="Button link" />
                      </div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <div className="space-y-4">
          <div className="admin-card space-y-3 p-5">
            <h3 className="font-bold text-[var(--color-primary)]">Menu & visibility</h3>
            <label className="flex items-center gap-2 text-sm font-semibold">
              <input type="checkbox" checked={page.showInHeader !== false} onChange={(e) => patch('showInHeader', e.target.checked)} />
              Show in header menu
            </label>
            <label className="flex items-center gap-2 text-sm font-semibold">
              <input type="checkbox" checked={Boolean(page.showInFooter)} onChange={(e) => patch('showInFooter', e.target.checked)} />
              Show in footer menu
            </label>
            <p className="text-xs text-slate-500">After saving, also confirm order in Pages & Menus if you need drag-and-drop positioning.</p>
          </div>

          <div className="admin-card space-y-3 p-5">
            <h3 className="font-bold text-[var(--color-primary)]">SEO</h3>
            <label className="block">
              <span className="admin-label">Meta title</span>
              <input className="admin-input" value={page.seo?.metaTitle || ''} onChange={(e) => setPage((prev) => ({ ...prev, seo: { ...prev.seo, metaTitle: e.target.value } }))} />
            </label>
            <label className="block">
              <span className="admin-label">Meta description</span>
              <textarea className="admin-input min-h-24" value={page.seo?.metaDescription || ''} onChange={(e) => setPage((prev) => ({ ...prev, seo: { ...prev.seo, metaDescription: e.target.value } }))} />
            </label>
            <label className="block">
              <span className="admin-label">Keywords</span>
              <input className="admin-input" value={page.seo?.keywords || ''} onChange={(e) => setPage((prev) => ({ ...prev, seo: { ...prev.seo, keywords: e.target.value } }))} placeholder="comma, separated" />
            </label>
          </div>

          <div className="admin-card p-5 text-sm text-slate-600">
            <h3 className="mb-2 font-bold text-[var(--color-primary)]">Template</h3>
            <p>{selectedTemplate.emoji} {selectedTemplate.label}</p>
            <p className="mt-1">{selectedTemplate.description}</p>
          </div>

          <div className="admin-card space-y-3 p-5">
            <h3 className="font-bold text-[var(--color-primary)]">Publish</h3>
            <p className="text-sm text-slate-600">Save a draft first, then publish when the page is ready for the live site.</p>
            <button type="button" className="btn-secondary w-full" disabled={save.isPending} onClick={() => save.mutate('draft')}>
              Save as draft
            </button>
            <button type="button" className="btn-primary w-full" disabled={save.isPending} onClick={() => save.mutate('published')}>
              Publish live
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
