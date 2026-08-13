import { useEffect, useState, type ReactNode } from 'react'
import { colorPresets, fontOptions, headingFontOptions } from '@/data/siteSetup'
import { defaultSiteConfig, hydrateSiteConfigFromStrapi, readFileAsDataUrl, saveSiteConfig, type SiteConfig } from '@/services/siteConfigStore'
import { getErrorMessage } from '@/services/strapi'
import type { FooterSettings, HeaderSettings, SeoSettings, ThemeSettings } from '@/types'

function PageHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
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

function Field({ label, children, hint }: { label: string; children: ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="admin-label">{label}</span>
      {children}
      {hint ? <span className="mt-1 block text-xs text-slate-500">{hint}</span> : null}
    </label>
  )
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <Field label={label}>
      <div className="flex items-center gap-2">
        <input type="color" className="h-10 w-12 cursor-pointer rounded-lg border border-[var(--color-border)] bg-white p-1" value={value} onChange={(e) => onChange(e.target.value)} />
        <input className="admin-input" value={value} onChange={(e) => onChange(e.target.value)} />
      </div>
    </Field>
  )
}

function SaveBanner({ savedAs, error }: { savedAs: 'draft' | 'published' | null; error?: string | null }) {
  if (error) return <p className="mt-3 text-sm font-semibold text-red-700">{error}</p>
  if (savedAs === 'draft') return <p className="mt-3 text-sm font-semibold text-amber-700">Draft saved in Strapi — not live until you Publish.</p>
  if (savedAs === 'published') return <p className="mt-3 text-sm font-semibold text-emerald-700">Published live — the public website updates immediately.</p>
  return null
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

export function ThemePage() {
  const [theme, setTheme] = useState<ThemeSettings>(defaultSiteConfig().theme)
  const [savedAs, setSavedAs] = useState<'draft' | 'published' | null>(null)
  const [pending, setPending] = useState<'draft' | 'published' | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    hydrateSiteConfigFromStrapi().then((config) => {
      if (active) setTheme(config.theme)
    })
    return () => { active = false }
  }, [])

  async function save(status: 'draft' | 'published') {
    setPending(status)
    setError(null)
    try {
      await saveSiteConfig({ theme }, status)
      setSavedAs(status)
      window.setTimeout(() => setSavedAs(null), 4000)
    } catch (err) {
      setError(`Could not ${status === 'published' ? 'publish' : 'save'} to Strapi: ${getErrorMessage(err)}`)
    } finally {
      setPending(null)
    }
  }

  function patch(key: keyof ThemeSettings, value: string) {
    setTheme((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <>
      <PageHeader
        title="Theme & branding"
        description="Save a private draft in Strapi, then Publish live to update the public website immediately."
        action={<PublishActions pending={Boolean(pending)} pendingStatus={pending} onSave={save} />}
      />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
        <div className="space-y-4">
          <div className="admin-card p-5">
            <h3 className="font-bold text-[var(--color-primary)]">Color presets</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {colorPresets.map((preset) => (
                <button key={preset.name} type="button" className="rounded-xl border border-[var(--color-border)] bg-white p-3 text-left hover:border-[var(--color-sage)]" onClick={() => setTheme({
                  primaryColor: preset.primaryColor,
                  secondaryColor: preset.secondaryColor,
                  backgroundColor: preset.backgroundColor,
                  textColor: preset.textColor,
                  accentColor: preset.accentColor,
                  fontFamily: preset.fontFamily,
                  headingFontFamily: preset.headingFontFamily,
                })}>
                  <span className="mb-2 flex gap-1">
                    <i className="h-4 w-4 rounded-full" style={{ background: preset.primaryColor }} />
                    <i className="h-4 w-4 rounded-full" style={{ background: preset.secondaryColor }} />
                    <i className="h-4 w-4 rounded-full" style={{ background: preset.accentColor }} />
                  </span>
                  <span className="text-sm font-semibold">{preset.name}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="admin-card grid gap-4 p-5 md:grid-cols-2">
            <ColorField label="Primary" value={theme.primaryColor} onChange={(v) => patch('primaryColor', v)} />
            <ColorField label="Secondary" value={theme.secondaryColor} onChange={(v) => patch('secondaryColor', v)} />
            <ColorField label="Page background" value={theme.backgroundColor} onChange={(v) => patch('backgroundColor', v)} />
            <ColorField label="Body text" value={theme.textColor} onChange={(v) => patch('textColor', v)} />
            <ColorField label="Accent" value={theme.accentColor} onChange={(v) => patch('accentColor', v)} />
          </div>
          <div className="admin-card grid gap-4 p-5 md:grid-cols-2">
            <Field label="Body font">
              <select className="admin-input" value={theme.fontFamily} onChange={(e) => patch('fontFamily', e.target.value)}>
                {fontOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </Field>
            <Field label="Heading font">
              <select className="admin-input" value={theme.headingFontFamily} onChange={(e) => patch('headingFontFamily', e.target.value)}>
                {headingFontOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </Field>
          </div>
          <SaveBanner savedAs={savedAs} error={error} />
        </div>
        <div className="admin-card overflow-hidden p-0">
          <div className="border-b border-[var(--color-border)] px-4 py-3 text-sm font-semibold text-slate-600">Live preview</div>
          <div className="p-4" style={{ background: theme.backgroundColor, color: theme.textColor, fontFamily: theme.fontFamily }}>
            <div className="mb-4 h-2 rounded-full" style={{ background: theme.secondaryColor }} />
            <p className="m-0 text-sm">Body text preview — communities of grace among healthcare professionals.</p>
            <h3 className="mt-3 mb-0 text-xl font-bold" style={{ fontFamily: theme.headingFontFamily, color: theme.secondaryColor }}>Heading preview</h3>
            <span className="mt-4 inline-flex rounded-lg px-3 py-2 text-sm font-bold text-white" style={{ background: theme.primaryColor }}>Primary button</span>
          </div>
        </div>
      </div>
    </>
  )
}

export function HeaderEditorPage() {
  const [header, setHeader] = useState<HeaderSettings>(defaultSiteConfig().header)
  const [savedAs, setSavedAs] = useState<'draft' | 'published' | null>(null)
  const [pending, setPending] = useState<'draft' | 'published' | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    let active = true
    hydrateSiteConfigFromStrapi().then((config) => {
      if (active) setHeader(config.header)
    })
    return () => { active = false }
  }, [])

  function patch<K extends keyof HeaderSettings>(key: K, value: HeaderSettings[K]) {
    setHeader((prev) => ({ ...prev, [key]: value }))
  }

  async function onLogoFile(file: File | undefined) {
    if (!file) return
    setUploading(true)
    try {
      const dataUrl = await readFileAsDataUrl(file)
      setHeader((prev) => ({ ...prev, logoUrl: dataUrl, logoAlt: prev.logoAlt || file.name }))
    } finally {
      setUploading(false)
    }
  }

  async function save(status: 'draft' | 'published') {
    setPending(status)
    setError(null)
    try {
      const next = await saveSiteConfig({ header }, status)
      setHeader(next.header)
      setSavedAs(status)
      window.setTimeout(() => setSavedAs(null), 4000)
    } catch (err) {
      setError(`Could not ${status === 'published' ? 'publish' : 'save'} to Strapi: ${getErrorMessage(err)}`)
    } finally {
      setPending(null)
    }
  }

  return (
    <>
      <PageHeader
        title="Header & navigation bar"
        description="Save a private draft in Strapi, then Publish live to update the public header immediately."
        action={<PublishActions pending={Boolean(pending)} pendingStatus={pending} onSave={save} />}
      />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)]">
        <div className="space-y-4">
          <div className="admin-card grid gap-4 p-5 md:grid-cols-2">
            <ColorField label="Background" value={header.backgroundColor} onChange={(v) => patch('backgroundColor', v)} />
            <ColorField label="Text color" value={header.textColor} onChange={(v) => patch('textColor', v)} />
            <div className="md:col-span-2">
              <Field label="Upload header logo" hint="PNG, SVG, or JPG. Preview updates immediately — Publish live to send it to the website.">
                <input
                  className="admin-input"
                  type="file"
                  accept="image/*,.svg"
                  onChange={(e) => onLogoFile(e.target.files?.[0])}
                />
              </Field>
              {uploading ? <p className="mt-2 text-sm text-slate-500">Reading image…</p> : null}
            </div>
            <Field label="Logo URL (optional)">
              <input className="admin-input" value={header.logoUrl.startsWith('data:') ? '' : header.logoUrl} onChange={(e) => patch('logoUrl', e.target.value)} placeholder="Or paste an image URL" />
            </Field>
            <Field label="Logo alt text">
              <input className="admin-input" value={header.logoAlt} onChange={(e) => patch('logoAlt', e.target.value)} />
            </Field>
            <Field label="CTA button text">
              <input className="admin-input" value={header.ctaText} onChange={(e) => patch('ctaText', e.target.value)} />
            </Field>
            <Field label="CTA link">
              <input className="admin-input" value={header.ctaLink} onChange={(e) => patch('ctaLink', e.target.value)} placeholder="/donate" />
            </Field>
            <label className="flex items-center gap-2 text-sm font-semibold md:col-span-2">
              <input type="checkbox" checked={header.sticky} onChange={(e) => patch('sticky', e.target.checked)} />
              Sticky header on scroll
            </label>
            {header.logoUrl ? (
              <div className="md:col-span-2">
                <button type="button" className="btn-secondary" onClick={() => patch('logoUrl', '')}>Remove logo</button>
              </div>
            ) : null}
          </div>
          <SaveBanner savedAs={savedAs} error={error} />
        </div>
        <div className="admin-card overflow-hidden p-0">
          <div className="border-b border-[var(--color-border)] px-4 py-3 text-sm font-semibold text-slate-600">Header preview</div>
          <div className="site-header-preview" style={{ background: header.backgroundColor, color: header.textColor }}>
            {header.logoUrl ? (
              <img src={header.logoUrl} alt={header.logoAlt} className="h-10 max-w-[180px] object-contain" />
            ) : (
              <strong>COGI</strong>
            )}
            <span className="site-header-preview-nav">About · Programs · Resources</span>
            <span className="site-header-preview-cta" style={{ background: header.textColor, color: header.backgroundColor }}>
              {header.ctaText || 'Donate'}
            </span>
          </div>
        </div>
      </div>
    </>
  )
}

export function FooterEditorPage() {
  const [footer, setFooter] = useState<FooterSettings>(defaultSiteConfig().footer)
  const [savedAs, setSavedAs] = useState<'draft' | 'published' | null>(null)
  const [pending, setPending] = useState<'draft' | 'published' | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    let active = true
    hydrateSiteConfigFromStrapi().then((config) => {
      if (active) setFooter(config.footer)
    })
    return () => { active = false }
  }, [])

  function patch<K extends keyof FooterSettings>(key: K, value: FooterSettings[K]) {
    setFooter((prev) => ({ ...prev, [key]: value }))
  }

  async function onLogoFile(file: File | undefined) {
    if (!file) return
    setUploading(true)
    try {
      const dataUrl = await readFileAsDataUrl(file)
      setFooter((prev) => ({ ...prev, logoUrl: dataUrl }))
    } finally {
      setUploading(false)
    }
  }

  async function save(status: 'draft' | 'published') {
    setPending(status)
    setError(null)
    try {
      const next = await saveSiteConfig({ footer }, status)
      setFooter(next.footer)
      setSavedAs(status)
      window.setTimeout(() => setSavedAs(null), 4000)
    } catch (err) {
      setError(`Could not ${status === 'published' ? 'publish' : 'save'} to Strapi: ${getErrorMessage(err)}`)
    } finally {
      setPending(null)
    }
  }

  return (
    <>
      <PageHeader
        title="Footer"
        description="Save a private draft in Strapi, then Publish live to update the public footer immediately."
        action={<PublishActions pending={Boolean(pending)} pendingStatus={pending} onSave={save} />}
      />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)]">
        <div className="space-y-4">
          <div className="admin-card grid gap-4 p-5 md:grid-cols-2">
            <ColorField label="Background" value={footer.backgroundColor} onChange={(v) => patch('backgroundColor', v)} />
            <ColorField label="Text color" value={footer.textColor} onChange={(v) => patch('textColor', v)} />
            <div className="md:col-span-2">
              <Field label="Upload footer logo">
                <input className="admin-input" type="file" accept="image/*,.svg" onChange={(e) => onLogoFile(e.target.files?.[0])} />
              </Field>
              {uploading ? <p className="mt-2 text-sm text-slate-500">Reading image…</p> : null}
            </div>
            <Field label="Logo URL"><input className="admin-input" value={footer.logoUrl.startsWith('data:') ? '' : footer.logoUrl} onChange={(e) => patch('logoUrl', e.target.value)} /></Field>
            <Field label="Copyright"><input className="admin-input" value={footer.copyright} onChange={(e) => patch('copyright', e.target.value)} /></Field>
            <div className="md:col-span-2">
              <Field label="Description"><textarea className="admin-input min-h-24" value={footer.description} onChange={(e) => patch('description', e.target.value)} /></Field>
            </div>
            <label className="flex items-center gap-2 text-sm font-semibold md:col-span-2">
              <input type="checkbox" checked={footer.showSocial} onChange={(e) => patch('showSocial', e.target.checked)} />
              Show social links
            </label>
            {footer.showSocial ? (
              <>
                <Field label="Facebook URL"><input className="admin-input" value={footer.facebookUrl || ''} onChange={(e) => patch('facebookUrl', e.target.value)} /></Field>
                <Field label="Instagram URL"><input className="admin-input" value={footer.instagramUrl || ''} onChange={(e) => patch('instagramUrl', e.target.value)} /></Field>
                <Field label="YouTube URL"><input className="admin-input" value={footer.youtubeUrl || ''} onChange={(e) => patch('youtubeUrl', e.target.value)} /></Field>
              </>
            ) : null}
          </div>
          <SaveBanner savedAs={savedAs} error={error} />
        </div>
        <div className="admin-card overflow-hidden p-0">
          <div className="border-b border-[var(--color-border)] px-4 py-3 text-sm font-semibold text-slate-600">Footer preview</div>
          <div className="site-footer-preview" style={{ background: footer.backgroundColor, color: footer.textColor }}>
            {footer.logoUrl ? <img src={footer.logoUrl} alt="" className="mb-3 h-8 max-w-[160px] object-contain" /> : null}
            <p className="m-0 text-sm opacity-90">{footer.description}</p>
            <small className="mt-4 block opacity-70">{footer.copyright}</small>
          </div>
        </div>
      </div>
    </>
  )
}

export function SeoEditorPage() {
  const [seo, setSeo] = useState<SeoSettings>(defaultSiteConfig().seo)
  const [savedAs, setSavedAs] = useState<'draft' | 'published' | null>(null)
  const [pending, setPending] = useState<'draft' | 'published' | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    hydrateSiteConfigFromStrapi().then((config) => {
      if (active) setSeo(config.seo)
    })
    return () => { active = false }
  }, [])

  function patch(key: keyof SeoSettings, value: string) {
    setSeo((prev) => ({ ...prev, [key]: value }))
  }

  async function save(status: 'draft' | 'published') {
    setPending(status)
    setError(null)
    try {
      await saveSiteConfig({ seo }, status)
      setSavedAs(status)
      window.setTimeout(() => setSavedAs(null), 4000)
    } catch (err) {
      setError(`Could not ${status === 'published' ? 'publish' : 'save'} to Strapi: ${getErrorMessage(err)}`)
    } finally {
      setPending(null)
    }
  }

  return (
    <>
      <PageHeader
        title="SEO & social"
        description="Save a private draft in Strapi, then Publish live to update public meta tags immediately."
        action={<PublishActions pending={Boolean(pending)} pendingStatus={pending} onSave={save} />}
      />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)]">
        <div className="admin-card space-y-4 p-5">
          <Field label="Meta title"><input className="admin-input" value={seo.metaTitle} onChange={(e) => patch('metaTitle', e.target.value)} /></Field>
          <Field label="Meta description"><textarea className="admin-input min-h-24" value={seo.metaDescription} onChange={(e) => patch('metaDescription', e.target.value)} /></Field>
          <Field label="Keywords"><input className="admin-input" value={seo.keywords} onChange={(e) => patch('keywords', e.target.value)} /></Field>
          <Field label="Site URL"><input className="admin-input" value={seo.siteUrl} onChange={(e) => patch('siteUrl', e.target.value)} /></Field>
          <Field label="Open Graph image URL"><input className="admin-input" value={seo.ogImageUrl} onChange={(e) => patch('ogImageUrl', e.target.value)} /></Field>
          <SaveBanner savedAs={savedAs} error={error} />
        </div>
        <div className="admin-card overflow-hidden p-0">
          <div className="border-b border-[var(--color-border)] px-4 py-3 text-sm font-semibold text-slate-600">Search preview</div>
          <div className="space-y-2 p-4">
            <p className="m-0 text-lg font-semibold text-blue-800">{seo.metaTitle || 'Page title'}</p>
            <p className="m-0 text-sm text-emerald-700">{seo.siteUrl.replace(/^https?:\/\//, '')}</p>
            <p className="m-0 text-sm text-slate-600">{seo.metaDescription}</p>
          </div>
        </div>
      </div>
    </>
  )
}

export type { SiteConfig }
