import { buttonHoverStyle } from '../../../shared/buttonHover'
import { useEffect, useState, type ReactNode } from 'react'
import { colorPresets, fontOptions, headingFontOptions } from '@/data/siteSetup'
import { captureDraftSnapshot, hydrateSiteConfigFromStrapi, loadSiteConfig, saveSiteConfig, type RevertScope, type SiteConfig } from '@/services/siteConfigStore'
import { getErrorMessage } from '@/services/strapi'
import { LOGO_HINT, MediaUpload } from '@/components/MediaUpload'
import { MapColorFields, type MapColors } from '@/components/MapColorFields'
import { RevertToLiveButton, UndoDraftButton } from '@/components/RevertButton'
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

function normalizeLogoUrl(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return ''
  if (trimmed.startsWith('data:') || trimmed.startsWith('/') || trimmed.startsWith('blob:')) return trimmed
  if (/^https?:\/\//i.test(trimmed)) return trimmed
  return `https://${trimmed}`
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
  scope,
  pending,
  pendingStatus,
  onSave,
  onReverted,
}: {
  scope: RevertScope
  pending: boolean
  pendingStatus: 'draft' | 'published' | null
  onSave: (status: 'draft' | 'published') => void
  onReverted: (config: SiteConfig) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <button type="button" className="btn-secondary" disabled={pending} onClick={() => onSave('draft')}>
        {pending && pendingStatus === 'draft' ? 'Saving draft…' : 'Save as draft'}
      </button>
      <button type="button" className="btn-primary" disabled={pending} onClick={() => onSave('published')}>
        {pending && pendingStatus === 'published' ? 'Publishing…' : 'Publish live'}
      </button>
      <UndoDraftButton scope={scope} disabled={pending} onRestored={onReverted} />
      <RevertToLiveButton scope={scope} disabled={pending} onReverted={onReverted} />
    </div>
  )
}

function mapColorsFromConfig(config: SiteConfig): MapColors {
  return {
    mapOceanColor: config.homepage.mapOceanColor || '#0B1016',
    mapLandColor: config.homepage.mapLandColor || '#3A4A5C',
    mapPinColor: config.homepage.mapPinColor || '#5BA8E0',
    mapActiveColor: config.homepage.mapActiveColor || '#2E7CB5',
  }
}

export function ThemePage() {
  const initial = loadSiteConfig()
  const [theme, setTheme] = useState<ThemeSettings>({ ...initial.theme, buttonHoverColor: initial.theme.buttonHoverColor || '#3B82F6' })
  const [mapColors, setMapColors] = useState<MapColors>(() => mapColorsFromConfig(initial))
  const [logoUrl, setLogoUrl] = useState(initial.header.logoUrl)
  const [logoAlt, setLogoAlt] = useState(initial.header.logoAlt)
  const [logoHeight, setLogoHeight] = useState(initial.header.logoHeight ?? 48)
  const [savedAs, setSavedAs] = useState<'draft' | 'published' | null>(null)
  const [pending, setPending] = useState<'draft' | 'published' | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    captureDraftSnapshot('theme')
    let active = true
    hydrateSiteConfigFromStrapi().then((config) => {
      if (active) {
        setTheme({ ...config.theme, buttonHoverColor: config.theme.buttonHoverColor || '#3B82F6' })
        setMapColors(mapColorsFromConfig(config))
        setLogoUrl(config.header.logoUrl)
        setLogoAlt(config.header.logoAlt)
        setLogoHeight(config.header.logoHeight ?? 48)
        captureDraftSnapshot('theme')
      }
    })
    return () => { active = false }
  }, [])

  async function save(status: 'draft' | 'published') {
    setPending(status)
    setError(null)
    try {
      const current = loadSiteConfig()
      await saveSiteConfig({
        theme,
        header: { ...current.header, logoUrl, logoAlt, logoHeight },
        homepage: {
          ...current.homepage,
          mapOceanColor: mapColors.mapOceanColor,
          mapLandColor: mapColors.mapLandColor,
          mapPinColor: mapColors.mapPinColor,
          mapActiveColor: mapColors.mapActiveColor,
        },
      }, status)
      if (status === 'draft') captureDraftSnapshot('theme')
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
        action={<PublishActions scope="theme" pending={Boolean(pending)} pendingStatus={pending} onSave={save} onReverted={(config) => {
          setTheme(config.theme)
          setMapColors(mapColorsFromConfig(config))
          setLogoUrl(config.header.logoUrl)
          setLogoAlt(config.header.logoAlt)
          setLogoHeight(config.header.logoHeight ?? 48)
          setSavedAs(null)
        }} />}
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
                  buttonHoverColor: preset.buttonHoverColor,
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
            <ColorField label="Accent / button" value={theme.accentColor} onChange={(v) => patch('accentColor', v)} />
            <ColorField label="Button hover" value={theme.buttonHoverColor || theme.accentColor} onChange={(v) => patch('buttonHoverColor', v)} />
            <Field label="Button hover animation">
              <select className="admin-input" value={theme.buttonHoverAnimation || 'sweep'} onChange={e => patch('buttonHoverAnimation', e.target.value)}>
                <option value="sweep">Sweep from left</option>
                <option value="rise">Fill from bottom</option>
                <option value="instant">Instant fill</option>
              </select>
            </Field>
          </div>
          <div className="admin-card p-5">
            <h3 className="font-bold text-[var(--color-primary)]">World map colors</h3>
            <p className="mt-1 text-sm text-slate-600">Ocean, land, and pin colors for the homepage “Where we serve” map. Publish live to update the public site.</p>
            <div className="mt-4">
              <MapColorFields colors={mapColors} onChange={setMapColors} />
            </div>
          </div>
          <div className="admin-card p-5">
            <h3 className="font-bold text-[var(--color-primary)]">Site logo</h3>
            <p className="mt-1 text-sm text-slate-600">Upload the header logo. Publish live to show it on the public site.</p>
            <div className="mt-4 grid gap-4">
              <MediaUpload
                kind="image"
                label="Upload logo"
                hint={LOGO_HINT}
                allowSvg
                maxBytes={2 * 1024 * 1024}
                recommendedBytes={500 * 1024}
                value={logoUrl}
                onLoaded={(url, file) => {
                  setLogoUrl(url)
                  setLogoAlt((prev) => prev || file.name.replace(/\.[^.]+$/, ''))
                }}
                onClear={() => setLogoUrl('')}
                noun="logo"
              />
              <Field label="Logo alt text">
                <input className="admin-input" value={logoAlt} onChange={(e) => setLogoAlt(e.target.value)} />
              </Field>
              <Field label="Logo size" hint="Height on the public header. Width scales with the image.">
                <div className="hp-size">
                  <input className="hp-range" type="range" min={28} max={88} step={2} value={logoHeight} onChange={(e) => setLogoHeight(Number(e.target.value))} />
                  <output>{logoHeight}px</output>
                </div>
              </Field>
            </div>
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
            {logoUrl ? <img src={logoUrl} alt="" className="mt-4 max-w-[220px] object-contain" style={{ height: logoHeight }} /> : null}
            <button type="button" className="theme-hover-preview mt-4 rounded-lg px-3 py-2 text-sm font-bold text-white"
              style={{ backgroundColor: theme.accentColor, ...buttonHoverStyle(theme.buttonHoverColor || theme.accentColor, theme.buttonHoverAnimation) }}>
              Preview button
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export function HeaderEditorPage() {
  const initial = loadSiteConfig()
  const [header, setHeader] = useState<HeaderSettings>(initial.header)
  const [logoUrlDraft, setLogoUrlDraft] = useState(initial.header.logoUrl.startsWith('data:') ? '' : initial.header.logoUrl)
  const [savedAs, setSavedAs] = useState<'draft' | 'published' | null>(null)
  const [pending, setPending] = useState<'draft' | 'published' | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    captureDraftSnapshot('header')
    let active = true
    hydrateSiteConfigFromStrapi().then((config) => {
      if (active) {
        setHeader(config.header)
        setLogoUrlDraft(config.header.logoUrl.startsWith('data:') ? '' : config.header.logoUrl)
        captureDraftSnapshot('header')
      }
    })
    return () => { active = false }
  }, [])

  function patch<K extends keyof HeaderSettings>(key: K, value: HeaderSettings[K]) {
    setHeader((prev) => ({ ...prev, [key]: value }))
  }

  async function save(status: 'draft' | 'published') {
    setPending(status)
    setError(null)
    try {
      const next = await saveSiteConfig({ header }, status)
      setHeader(next.header)
      setLogoUrlDraft(next.header.logoUrl.startsWith('data:') ? '' : next.header.logoUrl)
      if (status === 'draft') captureDraftSnapshot('header')
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
        action={<PublishActions scope="header" pending={Boolean(pending)} pendingStatus={pending} onSave={save} onReverted={(config) => {
          setHeader(config.header)
          setLogoUrlDraft(config.header.logoUrl.startsWith('data:') ? '' : config.header.logoUrl)
          setSavedAs(null)
        }} />}
      />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)]">
        <div className="space-y-4">
          <div className="admin-card grid gap-4 p-5 md:grid-cols-2">
            <ColorField label="Background" value={header.backgroundColor} onChange={(v) => patch('backgroundColor', v)} />
            <ColorField label="Text color" value={header.textColor} onChange={(v) => patch('textColor', v)} />
            <div className="md:col-span-2">
              <MediaUpload
                kind="image"
                label="Upload header logo"
                hint={`${LOGO_HINT}. Preview updates immediately — publish live to send it to the website.`}
                allowSvg
                maxBytes={2 * 1024 * 1024}
                recommendedBytes={500 * 1024}
                value={header.logoUrl.startsWith('data:') ? header.logoUrl : ''}
                onLoaded={(url, file) => {
                  setHeader((prev) => ({ ...prev, logoUrl: url, logoAlt: prev.logoAlt || file.name.replace(/\.[^.]+$/, '') }))
                  setLogoUrlDraft('')
                }}
                onClear={() => {
                  patch('logoUrl', '')
                  setLogoUrlDraft('')
                }}
                noun="logo"
              />
              <div className="mt-4 grid gap-3">
                <Field label="Logo URL" hint="Paste a full image link, then click Apply. This replaces an uploaded logo.">
                  <div className="flex min-w-0 flex-col gap-2 sm:flex-row">
                    <input
                      className="admin-input admin-input-url min-w-0 flex-1"
                      value={logoUrlDraft}
                      onChange={(e) => setLogoUrlDraft(e.target.value)}
                      placeholder="https://…"
                    />
                    <button
                      type="button"
                      className="btn-secondary shrink-0"
                      onClick={() => {
                        const next = normalizeLogoUrl(logoUrlDraft)
                        setLogoUrlDraft(next)
                        patch('logoUrl', next)
                      }}
                    >
                      Apply URL
                    </button>
                  </div>
                </Field>
                {header.logoUrl ? (
                  <button type="button" className="hp-danger w-fit" onClick={() => { patch('logoUrl', ''); setLogoUrlDraft('') }}>
                    Remove logo
                  </button>
                ) : null}
              </div>
            </div>
            <Field label="Logo alt text">
              <input className="admin-input" value={header.logoAlt} onChange={(e) => patch('logoAlt', e.target.value)} />
            </Field>
            <Field label="Logo size" hint="Height on the public header.">
              <div className="hp-size">
                <input className="hp-range" type="range" min={28} max={88} step={2} value={header.logoHeight ?? 48} onChange={(e) => patch('logoHeight', Number(e.target.value))} />
                <output>{header.logoHeight ?? 48}px</output>
              </div>
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
          </div>
          <SaveBanner savedAs={savedAs} error={error} />
        </div>
        <div className="admin-card overflow-hidden p-0">
          <div className="border-b border-[var(--color-border)] px-4 py-3 text-sm font-semibold text-slate-600">Header preview</div>
          <div className="site-header-preview" style={{ background: header.backgroundColor, color: header.textColor }}>
            {header.logoUrl ? (
              <img src={header.logoUrl} alt={header.logoAlt} className="max-w-[220px] object-contain" style={{ height: header.logoHeight ?? 48 }} />
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
  const initial = loadSiteConfig()
  const [footer, setFooter] = useState<FooterSettings>(initial.footer)
  const [logoUrlDraft, setLogoUrlDraft] = useState(initial.footer.logoUrl.startsWith('data:') ? '' : initial.footer.logoUrl)
  const [savedAs, setSavedAs] = useState<'draft' | 'published' | null>(null)
  const [pending, setPending] = useState<'draft' | 'published' | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    captureDraftSnapshot('footer')
    let active = true
    hydrateSiteConfigFromStrapi().then((config) => {
      if (active) {
        setFooter(config.footer)
        setLogoUrlDraft(config.footer.logoUrl.startsWith('data:') ? '' : config.footer.logoUrl)
        captureDraftSnapshot('footer')
      }
    })
    return () => { active = false }
  }, [])

  function patch<K extends keyof FooterSettings>(key: K, value: FooterSettings[K]) {
    setFooter((prev) => ({ ...prev, [key]: value }))
  }

  async function save(status: 'draft' | 'published') {
    setPending(status)
    setError(null)
    try {
      const next = await saveSiteConfig({ footer }, status)
      setFooter(next.footer)
      setLogoUrlDraft(next.footer.logoUrl.startsWith('data:') ? '' : next.footer.logoUrl)
      if (status === 'draft') captureDraftSnapshot('footer')
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
        action={<PublishActions scope="footer" pending={Boolean(pending)} pendingStatus={pending} onSave={save} onReverted={(config) => {
          setFooter(config.footer)
          setLogoUrlDraft(config.footer.logoUrl.startsWith('data:') ? '' : config.footer.logoUrl)
          setSavedAs(null)
        }} />}
      />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)]">
        <div className="space-y-4">
          <div className="admin-card grid gap-4 p-5 md:grid-cols-2">
            <ColorField label="Background" value={footer.backgroundColor} onChange={(v) => patch('backgroundColor', v)} />
            <ColorField label="Text color" value={footer.textColor} onChange={(v) => patch('textColor', v)} />
            <div className="md:col-span-2">
              <Field label="Copyright">
                <input className="admin-input" value={footer.copyright} onChange={(e) => patch('copyright', e.target.value)} />
              </Field>
            </div>
            <div className="md:col-span-2">
              <MediaUpload
                kind="image"
                label="Upload footer logo"
                hint={LOGO_HINT}
                allowSvg
                maxBytes={2 * 1024 * 1024}
                recommendedBytes={500 * 1024}
                value={footer.logoUrl.startsWith('data:') ? footer.logoUrl : ''}
                onLoaded={(url) => {
                  patch('logoUrl', url)
                  setLogoUrlDraft('')
                }}
                onClear={() => {
                  patch('logoUrl', '')
                  setLogoUrlDraft('')
                }}
                noun="logo"
              />
              <div className="mt-4 grid gap-3">
                <Field label="Logo URL" hint="Paste a full image link, then click Apply. This replaces an uploaded logo.">
                  <div className="flex min-w-0 flex-col gap-2 sm:flex-row">
                    <input
                      className="admin-input admin-input-url min-w-0 flex-1"
                      value={logoUrlDraft}
                      onChange={(e) => setLogoUrlDraft(e.target.value)}
                      placeholder="https://…"
                    />
                    <button
                      type="button"
                      className="btn-secondary shrink-0"
                      onClick={() => {
                        const next = normalizeLogoUrl(logoUrlDraft)
                        setLogoUrlDraft(next)
                        patch('logoUrl', next)
                      }}
                    >
                      Apply URL
                    </button>
                  </div>
                </Field>
                <Field label="Logo size">
                  <div className="hp-size">
                    <input className="hp-range" type="range" min={24} max={72} step={2} value={footer.logoHeight ?? 48} onChange={(e) => patch('logoHeight', Number(e.target.value))} />
                    <output>{footer.logoHeight ?? 48}px</output>
                  </div>
                </Field>
                {footer.logoUrl ? (
                  <button type="button" className="hp-danger w-fit" onClick={() => { patch('logoUrl', ''); setLogoUrlDraft('') }}>
                    Remove logo
                  </button>
                ) : null}
              </div>
            </div>
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
                <Field label="LinkedIn URL"><input className="admin-input" value={footer.linkedinUrl || ''} onChange={(e) => patch('linkedinUrl', e.target.value)} /></Field>
                <Field label="WhatsApp (number or wa.me link)" hint="Shows a chat button on the public site."><input className="admin-input" value={footer.whatsappUrl || ''} onChange={(e) => patch('whatsappUrl', e.target.value)} placeholder="+1…" /></Field>
              </>
            ) : null}
          </div>
          <SaveBanner savedAs={savedAs} error={error} />
        </div>
        <div className="admin-card overflow-hidden p-0">
          <div className="border-b border-[var(--color-border)] px-4 py-3 text-sm font-semibold text-slate-600">Footer preview</div>
          <div className="site-footer-preview" style={{ background: footer.backgroundColor, color: footer.textColor }}>
            {footer.logoUrl ? <img src={footer.logoUrl} alt="" className="mb-3 max-w-[180px] object-contain" style={{ height: footer.logoHeight ?? 48, maxHeight: footer.logoHeight ?? 48 }} /> : null}
            <p className="m-0 text-sm opacity-90">{footer.description}</p>
            <small className="mt-4 block opacity-90">{footer.copyright || 'Copyright will appear here'}</small>
          </div>
        </div>
      </div>
    </>
  )
}

export function SeoEditorPage() {
  const [seo, setSeo] = useState<SeoSettings>(loadSiteConfig().seo)
  const [savedAs, setSavedAs] = useState<'draft' | 'published' | null>(null)
  const [pending, setPending] = useState<'draft' | 'published' | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    captureDraftSnapshot('seo')
    let active = true
    hydrateSiteConfigFromStrapi().then((config) => {
      if (active) {
        setSeo(config.seo)
        captureDraftSnapshot('seo')
      }
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
      if (status === 'draft') captureDraftSnapshot('seo')
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
        action={<PublishActions scope="seo" pending={Boolean(pending)} pendingStatus={pending} onSave={save} onReverted={(config) => {
          setSeo(config.seo)
          setSavedAs(null)
        }} />}
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
