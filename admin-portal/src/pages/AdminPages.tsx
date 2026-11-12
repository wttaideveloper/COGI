import { useState, useEffect, useRef, type FormEvent, type ReactNode } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Controller, useForm } from 'react-hook-form'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { z } from 'zod'
import { IMAGE_HINT, MediaUpload } from '@/components/MediaUpload'
import MenuSwapper from '@/components/MenuSwapper'
import RichTextEditor from '@/components/RichTextEditor'
import { useAuth } from '@/contexts/AuthContext'
import { mockActivity, mockAudit, mockEnquiries, mockHomepage, mockMedia, mockNavigation, mockSettings, mockStats, mockTestimonials } from '@/data/mock'
import { mockFooterNavigation } from '@/data/siteSetup'
import { hydrateSiteConfigFromStrapi, captureDraftSnapshot, loadSiteConfig, notifyPublished, readFileAsDataUrl, saveSiteConfig } from '@/services/siteConfigStore'
import { demoSeed, loadDemoRows, publishDemoRow, loadDemoSettings } from '@/services/demoContent'
import { publishLocalContent } from '@/services/siteConfigStore'
import { loadLocalRecords, saveLocalRecords } from '@/services/localRecords'
import { apiCreate, apiDelete, apiGetOne, apiList, apiListAll, apiSingle, apiPublish, apiUpdate, apiUpdateSingle, getErrorMessage, getStrapiUrl, isDemoMode, isDemoModeAllowed, uploadMedia } from '@/services/strapi'
import { exportCsv } from '@/utils/csv'
import { fetchLeads, addSubscriber, removeSubscriber, type LeadSubscriber } from '@/services/leads'
import { COGI_LOGO } from '@/lib/brand'
import { getLiveUrl, getPreviewUrl } from '@/utils/preview'
import { RevertToLiveButton, UndoDraftButton } from '@/components/RevertButton'
import type { AuditRecord, BaseRecord, EnquiryRecord, EnquiryStatus, FormField, HomepageRecord, MediaFile, ModuleConfig, ModuleKey, SettingsRecord } from '@/types'

type AnyRecord = BaseRecord & Record<string, unknown>
const statusOptions = [{ label: 'Draft', value: 'draft' }, { label: 'Published', value: 'published' }]
const yesNo = [{ label: 'Yes', value: 'true' }, { label: 'No', value: 'false' }]


export const moduleConfigs: Record<string, ModuleConfig<AnyRecord>> = {
  pages: { key: 'pages', title: 'Custom pages', endpoint: '/pages', route: '/pages', singular: 'Page', description: 'Extra pages beyond the main site. Edit About, Donate, Contact, and other live wording under Site pages.', columns: [{ key: 'title', label: 'Title' }, { key: 'slug', label: 'URL' }, { key: 'status', label: 'Status' }, { key: 'updatedAt', label: 'Updated' }], fields: [{ name: 'title', label: 'Title', type: 'text', required: true }, { name: 'slug', label: 'Slug', type: 'text', required: true }, { name: 'status', label: 'Status', type: 'select', options: statusOptions }] },
  programs: { key: 'programs', title: 'Programs', endpoint: '/programs', route: '/programs', singular: 'Program', description: 'The training and ministry areas listed on the Programs page.', columns: [{ key: 'title', label: 'Title' }, { key: 'area', label: 'Area' }, { key: 'status', label: 'Status' }, { key: 'order', label: 'Order' }], fields: [{ name: 'title', label: 'Title', type: 'text', required: true }, { name: 'slug', label: 'Slug', type: 'text', required: true }, { name: 'summary', label: 'Summary', type: 'textarea' }, { name: 'description', label: 'Description', type: 'textarea' }, { name: 'area', label: 'Area', type: 'text' }, { name: 'status', label: 'Status', type: 'select', options: statusOptions }, { name: 'order', label: 'Order', type: 'number' }] },
  blog: { key: 'blog', title: 'Blog / News', endpoint: '/news-articles', route: '/blog', singular: 'Article', description: 'News and articles that appear in Resources → Blog.', columns: [{ key: 'title', label: 'Title' }, { key: 'category', label: 'Category' }, { key: 'author', label: 'Author' }, { key: 'status', label: 'Status' }], fields: [{ name: 'title', label: 'Title', type: 'text', required: true }, { name: 'slug', label: 'Slug', type: 'text', required: true }, { name: 'summary', label: 'Summary', type: 'textarea' }, { name: 'body', label: 'Body', type: 'richtext', required: true }, { name: 'imageUrl', label: 'Article photo', type: 'image' }, { name: 'author', label: 'Author', type: 'text' }, { name: 'category', label: 'Category', type: 'text' }, { name: 'status', label: 'Status', type: 'select', options: statusOptions }] },
  events: { key: 'events', title: 'Events', endpoint: '/events', route: '/events', singular: 'Event', description: 'Upcoming gatherings shown on the Events page and homepage.', columns: [{ key: 'title', label: 'Title' }, { key: 'startDate', label: 'Starts' }, { key: 'venue', label: 'Venue' }, { key: 'status', label: 'Status' }], fields: [{ name: 'title', label: 'Title', type: 'text', required: true }, { name: 'slug', label: 'Slug', type: 'text', required: true }, { name: 'summary', label: 'Summary', type: 'textarea' }, { name: 'description', label: 'Description', type: 'textarea' }, { name: 'startDate', label: 'Start date', type: 'date', required: true }, { name: 'endDate', label: 'End date', type: 'date' }, { name: 'venue', label: 'Venue', type: 'text' }, { name: 'category', label: 'Category', type: 'text' }, { name: 'status', label: 'Status', type: 'select', options: statusOptions }] },
  stories: { key: 'stories', title: 'Stories', endpoint: '/stories', route: '/stories', singular: 'Story', description: 'Video and written stories of transformation.', columns: [{ key: 'title', label: 'Title' }, { key: 'country', label: 'Country' }, { key: 'program', label: 'Program' }, { key: 'featured', label: 'Featured' }], fields: [{ name: 'title', label: 'Title', type: 'text', required: true }, { name: 'slug', label: 'Slug', type: 'text', required: true }, { name: 'summary', label: 'Quote / summary', type: 'textarea' }, { name: 'body', label: 'Story', type: 'richtext' }, { name: 'type', label: 'Type', type: 'select', options: ['written', 'video'].map((v) => ({ label: v, value: v })) }, { name: 'country', label: 'Country', type: 'text' }, { name: 'program', label: 'Program', type: 'text' }, { name: 'imageUrl', label: 'Photo', type: 'image' }, { name: 'videoUrl', label: 'Video URL', type: 'text' }, { name: 'featured', label: 'Featured', type: 'select', options: yesNo }, { name: 'status', label: 'Status', type: 'select', options: statusOptions }] },
  testimonials: { key: 'testimonials', title: 'Testimonials', endpoint: '/testimonials', route: '/testimonials', singular: 'Testimonial', description: 'Quotes from board members and the healthcare community.', columns: [{ key: 'author', label: 'Author' }, { key: 'country', label: 'Country' }, { key: 'program', label: 'Program' }, { key: 'featured', label: 'Featured' }], fields: [{ name: 'quote', label: 'Quote', type: 'textarea', required: true }, { name: 'author', label: 'Author', type: 'text', required: true }, { name: 'mediaType', label: 'Media type', type: 'select', options: ['written', 'video'].map((v) => ({ label: v, value: v })) }, { name: 'videoUrl', label: 'Video URL', type: 'text' }, { name: 'country', label: 'Country', type: 'text' }, { name: 'program', label: 'Program', type: 'text' }, { name: 'featured', label: 'Featured', type: 'select', options: yesNo }, { name: 'status', label: 'Status', type: 'select', options: statusOptions }] },
  team: { key: 'team', title: 'Team Members', endpoint: '/team-members', route: '/team', singular: 'Team member', description: 'Board and global team profiles shown on the public site.', columns: [{ key: 'name', label: 'Name' }, { key: 'title', label: 'Title' }, { key: 'role', label: 'Role' }, { key: 'status', label: 'Status' }, { key: 'publicVisibility', label: 'Visible' }], fields: [{ name: 'name', label: 'Name', type: 'text', required: true }, { name: 'title', label: 'Title', type: 'text' }, { name: 'role', label: 'Role', type: 'select', options: ['board', 'global-team', 'staff', 'advisor'].map((v) => ({ label: v, value: v })) }, { name: 'region', label: 'Region', type: 'text' }, { name: 'country', label: 'Country', type: 'text' }, { name: 'bio', label: 'Bio', type: 'textarea' }, { name: 'order', label: 'Order', type: 'number' }, { name: 'publicVisibility', label: 'Public visibility', type: 'select', options: yesNo }] },
  partners: { key: 'partners', title: 'Partners', endpoint: '/partners', route: '/partners', singular: 'Partner', description: 'Partner names, logos, and links on the Partners page.', columns: [{ key: 'name', label: 'Name' }, { key: 'region', label: 'Region' }, { key: 'url', label: 'URL' }, { key: 'status', label: 'Status' }], fields: [{ name: 'name', label: 'Name', type: 'text', required: true }, { name: 'description', label: 'Description', type: 'textarea' }, { name: 'url', label: 'URL', type: 'text' }, { name: 'region', label: 'Region', type: 'text' }, { name: 'order', label: 'Order', type: 'number' }, { name: 'status', label: 'Status', type: 'select', options: statusOptions }] },
  locations: { key: 'locations', title: 'Locations', endpoint: '/locations', route: '/locations', singular: 'Location', description: 'Country pins for the Where we serve map.', columns: [{ key: 'country', label: 'Country' }, { key: 'region', label: 'Region' }, { key: 'latitude', label: 'Lat' }, { key: 'longitude', label: 'Lng' }], fields: [{ name: 'country', label: 'Country', type: 'text', required: true }, { name: 'region', label: 'Region', type: 'text' }, { name: 'summary', label: 'Summary', type: 'textarea' }, { name: 'programs', label: 'Programs (comma-separated)', type: 'text' }, { name: 'latitude', label: 'Latitude', type: 'number' }, { name: 'longitude', label: 'Longitude', type: 'number' }, { name: 'status', label: 'Status', type: 'select', options: statusOptions }] },
}

function PageHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="mb-2 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h2 className="text-2xl font-extrabold text-[var(--color-primary)]">{title}</h2>
        {description && <p className="mt-1 max-w-3xl text-sm text-slate-600">{description}</p>}
      </div>
      {action}
    </div>
  )
}
function StatusBadge({ value }: { value: unknown }) {
  const text = String(value ?? '')
  const label = text === 'true' ? 'Yes' : text === 'false' ? 'No' : text.replace('_', ' ') || 'none'
  const color = text.includes('published') || text === 'resolved' || text === 'true' ? 'bg-emerald-50 text-emerald-700' : text === 'new' ? 'bg-blue-50 text-blue-700' : text === 'spam' ? 'bg-red-50 text-red-700' : text === 'false' ? 'bg-slate-100 text-slate-700' : 'bg-amber-50 text-amber-700'
  return <span className={`badge ${color}`}>{label}</span>
}
function ErrorNotice({ error }: { error: unknown }) { return error ? <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">Strapi request failed: {getErrorMessage(error)}. Showing local demo data so the UI remains usable.</div> : null }
function schemaFor(fields: FormField<AnyRecord>[]) { const shape: Record<string, z.ZodTypeAny> = {}; for (const f of fields) shape[String(f.name)] = f.required ? z.coerce.string().min(1, `${f.label} is required`) : z.any().optional(); return z.object(shape).passthrough() }
function normalizeForForm(record: AnyRecord | undefined, fields: FormField<AnyRecord>[]) {
  const value: Record<string, unknown> = {}
  const today = new Date().toISOString().slice(0, 10)
  for (const field of fields) {
    const name = String(field.name)
    if (name === 'sectionsText' && record?.sections) value[name] = JSON.stringify(record.sections, null, 2)
    else if (name === 'itemsText' && record?.items) value[name] = (record.items as Array<{ label: string; href: string }>).map((i) => `${i.label} | ${i.href}`).join('\n')
    else if (name === 'imageUrl') value[name] = mediaToUrl(record?.imageUrl) || mediaToUrl(record?.thumbnail) || mediaToUrl(record?.featuredImage) || ''
    else if (name === 'description' && record?.body != null) value[name] = record.body
    else if (record?.[name] != null && record[name] !== '') value[name] = record[name]
    else if (field.type === 'number') value[name] = 0
    else if (field.type === 'select') value[name] = field.options?.[0]?.value
    else if (field.type === 'date' && name === 'startDate' && !record) value[name] = today
    else value[name] = ''
  }
  return value
}
function formatDate(value: unknown): string {
  const text = String(value ?? '')
  if (!text) return ''
  const iso = /^(\d{4})-(\d{2})-(\d{2})/.exec(text)
  if (iso) return `${Number(iso[2])}/${Number(iso[3])}/${iso[1]}`
  const parsed = new Date(text)
  return Number.isNaN(parsed.getTime()) ? text : parsed.toLocaleDateString('en-US')
}
function cleanPayload(values: Record<string, unknown>) { const out: Record<string, unknown> = { ...values }; for (const [key, value] of Object.entries(out)) { if (value === 'true') out[key] = true; if (value === 'false') out[key] = false; if (key.endsWith('Text')) out[key] = value } return out }
const schemaFieldMap: Record<string, Record<string, string>> = {
  '/pages': { title: 'title', slug: 'slug', status: 'status', pageType: 'pageType', summary: 'summary', heroImageUrl: 'heroImageUrl', externalUrl: 'externalUrl', showInHeader: 'showInHeader', showInFooter: 'showInFooter', templateId: 'templateId', sections: 'sections', seo: 'seo' },
  '/programs': { title: 'title', slug: 'slug', summary: 'summary', description: 'body', area: 'area', order: 'order', featured: 'featured' },
  '/news-articles': { title: 'title', slug: 'slug', summary: 'summary', body: 'body', author: 'author', tags: 'tags', featured: 'featured' },
  '/events': { title: 'title', slug: 'slug', summary: 'summary', description: 'body', startDate: 'startDate', endDate: 'endDate', venue: 'venue', featured: 'featured' },
  '/stories': { title: 'title', slug: 'slug', summary: 'summary', body: 'body', country: 'country', featured: 'featured', type: 'type', program: 'program', videoUrl: 'videoUrl' },
  '/testimonials': { quote: 'quote', author: 'author', mediaType: 'mediaType', country: 'country', featured: 'featured', videoUrl: 'videoUrl' },
  '/team-members': { name: 'name', title: 'title', role: 'role', region: 'region', bio: 'bio', order: 'order', publicVisibility: 'publicVisibility' },
  '/partners': { name: 'name', description: 'description', url: 'url', region: 'region', order: 'order' },
  '/locations': { country: 'country', region: 'region', summary: 'summary', latitude: 'latitude', longitude: 'longitude' },
}
function slugifyTitle(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/^\/+|\/+$/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}
function toDateTime(value: unknown) {
  const text = String(value ?? '').trim()
  if (!text) return text
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return `${text}T12:00:00.000Z`
  return text
}
function toDecimal(value: unknown): number | undefined {
  if (value === '' || value == null) return undefined
  const n = typeof value === 'number' ? value : Number(value)
  return Number.isFinite(n) ? n : undefined
}
function mediaToUrl(value: unknown): string {
  if (!value) return ''
  if (typeof value === 'string') {
    if (!value) return ''
    if (value.startsWith('/uploads/')) return `${getStrapiUrl()}${value}`
    return value.startsWith('http') || value.startsWith('/') || value.startsWith('data:') ? value : `${getStrapiUrl()}${value}`
  }
  if (typeof value !== 'object') return ''
  const record = value as Record<string, unknown>
  if (typeof record.url === 'string') return mediaToUrl(record.url)
  if (record.data && typeof record.data === 'object') {
    const nested = record.data as Record<string, unknown>
    return mediaToUrl(nested.attributes || nested)
  }
  return ''
}
function dataUrlToUploadFile(dataUrl: string, name: string) {
  const [meta, encoded] = dataUrl.split(',')
  const mime = /data:(.*?);/.exec(meta)?.[1] || 'image/jpeg'
  const binary = atob(encoded || '')
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i)
  const ext = mime.includes('png') ? 'png' : mime.includes('webp') ? 'webp' : 'jpg'
  return new File([bytes], `${name || 'image'}.${ext}`, { type: mime })
}
function buildPayload(endpoint: string, values: Record<string, unknown>, _status: 'draft' | 'published') {
  const cleaned = cleanPayload(values)
  const map = schemaFieldMap[endpoint]
  const out: Record<string, unknown> = {}
  for (const [formKey, apiKey] of Object.entries(map)) {
    if (cleaned[formKey] === undefined) continue
    if (cleaned[formKey] === '' && (apiKey === 'startDate' || apiKey === 'endDate')) { out[apiKey] = null; continue }
    if (apiKey === 'latitude' || apiKey === 'longitude' || apiKey === 'order') {
      const n = toDecimal(cleaned[formKey])
      if (n !== undefined) out[apiKey] = n
      continue
    }
    out[apiKey] = apiKey === 'startDate' || apiKey === 'endDate' ? toDateTime(cleaned[formKey]) : cleaned[formKey]
  }
  return out
}
function locationPreviewUrl(country?: unknown) {
  const name = String(country || '').trim()
  return getPreviewUrl(name ? `/?location=${encodeURIComponent(name)}#map` : '/#map')
}
function recordPreviewUrl(moduleKey: ModuleKey, values: Record<string, unknown>, row?: AnyRecord) {
  if (moduleKey === 'locations') return locationPreviewUrl(values.country || row?.country)
  const path = String(values.slug || row?.slug || '')
  if (moduleKey === 'pages' && String(values.status || row?.status || '') === 'published') return getLiveUrl(path)
  return getPreviewUrl(path)
}
function createdDocumentId(created: unknown): string {
  if (!created || typeof created !== 'object') return ''
  const root = created as { data?: { documentId?: string; id?: string | number }; documentId?: string; id?: string | number }
  return String(root.data?.documentId || root.documentId || root.data?.id || root.id || '')
}

export function LoginPage() {
  const { isAuthenticated, login } = useAuth(); const navigate = useNavigate(); const form = useForm({ resolver: zodResolver(z.object({ identifier: z.string().email(), password: z.string().min(1) })), defaultValues: isDemoModeAllowed() ? { identifier: 'admin@cogi.local', password: 'admin123' } : { identifier: '', password: '' } });
  const mutation = useMutation({ mutationFn: login, onSuccess: () => navigate('/dashboard') })
  if (isAuthenticated) return <Navigate to="/dashboard" replace />
  return (
    <AuthShell
      title="Sign in"
      subtitle="Update pages, photos, and the homepage in one place."
      hint={isDemoModeAllowed() ? 'Demo login: admin@cogi.local / admin123' : undefined}
    >
      <form className="space-y-4" onSubmit={form.handleSubmit((v) => mutation.mutate(v))}>
        <Field label="Email" error={form.formState.errors.identifier?.message}>
          <input className="admin-input" {...form.register('identifier')} autoComplete="username" />
        </Field>
        <Field label="Password" error={form.formState.errors.password?.message}>
          <input className="admin-input" type="password" {...form.register('password')} autoComplete="current-password" />
        </Field>
        {mutation.error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{getErrorMessage(mutation.error)}</p>}
        <button className="btn-primary w-full" disabled={mutation.isPending}>{mutation.isPending ? 'Signing in…' : 'Sign in'}</button>
        <div className="flex justify-between text-sm">
          <Link className="font-semibold text-[var(--color-accent)]" to="/forgot-password">Forgot password?</Link>
        </div>
      </form>
    </AuthShell>
  )
}
export function ForgotPasswordPage() { const form = useForm({ resolver: zodResolver(z.object({ email: z.string().email() })), defaultValues: { email: '' } }); const [sent, setSent] = useStateMessage(); return <AuthShell title="Forgot password" subtitle="Request a reset email from Strapi."><form className="space-y-4" onSubmit={form.handleSubmit(() => setSent('If Strapi is available, a reset email was requested.'))}><Field label="Email" error={form.formState.errors.email?.message}><input className="admin-input" {...form.register('email')} /></Field><button className="btn-primary w-full">Send reset link</button>{sent && <p className="text-sm text-emerald-700">{sent}</p>}<Link className="text-sm font-semibold text-[var(--color-primary)]" to="/login">Back to login</Link></form></AuthShell> }
export function ResetPasswordPage() { const form = useForm({ resolver: zodResolver(z.object({ code: z.string().min(1), password: z.string().min(6), passwordConfirmation: z.string().min(6) })), defaultValues: { code: '', password: '', passwordConfirmation: '' } }); const [sent, setSent] = useStateMessage(); return <AuthShell title="Reset password" subtitle="Paste the reset code from your email."><form className="space-y-4" onSubmit={form.handleSubmit(() => setSent('Password reset submitted.'))}>{['code','password','passwordConfirmation'].map((name) => <Field key={name} label={name} error={(form.formState.errors as Record<string, { message?: string }>)[name]?.message}><input className="admin-input" type={name.includes('password') ? 'password' : 'text'} {...form.register(name as 'code')} /></Field>)}<button className="btn-primary w-full">Reset password</button>{sent && <p className="text-sm text-emerald-700">{sent}</p>}</form></AuthShell> }
function AuthShell({ title, subtitle, hint, children }: { title: string; subtitle: string; hint?: string; children: ReactNode }) {
  return (
    <div className="admin-login-screen">
      <div className="admin-login-card admin-login-card-solo">
        <div className="admin-login-card-head">
          <div className="admin-login-icon" aria-hidden="true">
            <img src={COGI_LOGO} alt="COGI" width={44} height={44} />
          </div>
          <div>
            <p className="admin-login-kicker">Companions of Grace</p>
            <h2>{title}</h2>
            <p>{subtitle}</p>
          </div>
        </div>
        {children}
        {hint ? (
          <p className="admin-login-hint">
            <strong>Need a password?</strong>
            {hint}
          </p>
        ) : null}
      </div>
    </div>
  )
}
function useStateMessage(): [string, (message: string) => void] { return useState('') }
function Field({ label, error, children }: { label: string; error?: unknown; children: ReactNode }) { return <label className="block"><span className="admin-label">{label}</span>{children}{error ? <span className="admin-help">{String(error)}</span> : null}</label> }

export function DashboardPage() {
  const chart = [{ name: 'Pages', value: mockStats.pages }, { name: 'Articles', value: mockStats.articles }, { name: 'Events', value: mockStats.upcomingEvents }, { name: 'Enquiries', value: mockStats.enquiries }]
  return (
    <>
      <PageHeader
        title="Dashboard"
        description="A simple snapshot of pages, events, and messages. Use the menu on the left to edit the website."
        action={
          <div className="flex flex-wrap gap-2">
            <Link className="btn-primary" to="/pages/new">Add a page</Link>
            <a className="btn-secondary" href={getPreviewUrl('/')} target="_blank" rel="noreferrer">View the website</a>
          </div>
        }
      />
      <div className="dash-stats">
        {[{ label: 'Pages', value: mockStats.pages }, { label: 'Published', value: mockStats.pagesPublished }, { label: 'Drafts', value: mockStats.pagesDraft }, { label: 'Articles', value: mockStats.articles }, { label: 'Upcoming events', value: mockStats.upcomingEvents }, { label: 'Newsletter', value: mockStats.newsletterSubscribers }].map((s) => (
          <div key={s.label} className="admin-card dash-stat">
            <div className="text-sm font-semibold text-slate-500">{s.label}</div>
            <div className="mt-2 text-3xl font-extrabold text-[var(--color-primary)]">{s.value}</div>
          </div>
        ))}
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <div className="admin-card flex flex-col p-5">
          <h3 className="mb-4 font-bold">Content mix</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chart}><CartesianGrid strokeDasharray="3 3" stroke="#e8eef3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="value" fill="#5B8FB5" radius={[8, 8, 0, 0]} /></BarChart>
          </ResponsiveContainer>
        </div>
        <div className="admin-card flex flex-col p-5">
          <h3 className="mb-4 font-bold">Engagement trend</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={[{ name: 'Apr', value: 120 }, { name: 'May', value: 220 }, { name: 'Jun', value: 310 }, { name: 'Jul', value: 420 }]}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8eef3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Line type="monotone" dataKey="value" stroke="#5B8FB5" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="mt-6 grid items-stretch gap-6 xl:grid-cols-2">
        <div className="admin-card p-5">
          <h3 className="mb-4 font-bold">Recent activity</h3>
          <div className="divide-y divide-slate-100">
            {mockActivity.map((item) => (
              <div key={item.id} className="py-3">
                <div className="font-semibold">{item.action} <span className="text-[var(--color-accent)]">{item.resource}</span></div>
                <div className="text-sm text-slate-500">{item.actor} - {new Date(item.createdAt).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="admin-card p-5">
          <h3 className="mb-4 font-bold">Quick actions</h3>
          <div className="grid gap-2 sm:grid-cols-2">
            <Link className="btn-secondary justify-start" to="/homepage">Edit homepage</Link>
            <Link className="btn-secondary justify-start" to="/website-copy">Edit site pages</Link>
            <Link className="btn-secondary justify-start" to="/pages/new">Create a custom page</Link>
            <Link className="btn-secondary justify-start" to="/theme">Theme & branding</Link>
            <Link className="btn-secondary justify-start" to="/header">Header editor</Link>
            <Link className="btn-secondary justify-start" to="/footer">Footer editor</Link>
            <Link className="btn-secondary justify-start" to="/navigation">Pages & menus</Link>
            <Link className="btn-secondary justify-start" to="/media">Upload images</Link>
          </div>
        </div>
      </div>
    </>
  )
}

export function HomepagePage() {
  const query = useQuery({ queryKey: ['homepage'], queryFn: () => apiSingle<HomepageRecord>('/homepage'), enabled: !isDemoMode() })
  const stored = loadSiteConfig().homepage
  const data = query.data ?? { ...mockHomepage, ...stored }
  const form = useForm<HomepageRecord>({ values: data })
  const [synced, setSynced] = useState(false)
  const mutation = useMutation({
    mutationFn: async (values: HomepageRecord) => {
      await saveSiteConfig({
        homepage: {
          heroHeadline: values.heroHeadline,
          heroIntro: values.heroIntro,
          heroImageUrl: values.heroImageUrl,
          heroImageAlt: values.heroImageAlt,
          primaryCtaLabel: values.primaryCtaLabel,
          primaryCtaHref: values.primaryCtaHref,
          missionTitle: values.missionTitle,
          missionStatement: values.missionStatement,
          missionScripture: values.missionScripture ?? '',
        },
      })
      if (!isDemoMode()) await apiUpdateSingle('/homepage', values)
      return values
    },
    onSuccess: () => {
      setSynced(true)
      window.setTimeout(() => setSynced(false), 3000)
    },
  })
  const upload = useMutation({
    mutationFn: async (file: File) => {
      try {
        if (!isDemoMode()) {
          const uploaded = await uploadMedia(file, form.getValues('heroImageAlt') || file.name)
          const url = uploaded.url?.startsWith('http') ? uploaded.url : `${getStrapiUrl()}${uploaded.url}`
          form.setValue('heroImageUrl', url)
          return url
        }
      } catch {
        // Fall through to local data URL so the public site can still update.
      }
      const url = await readFileAsDataUrl(file)
      form.setValue('heroImageUrl', url)
      form.setValue('heroImageAlt', file.name)
      return url
    },
  })
  const sections = form.watch('sections') || []
  const heroImageUrl = form.watch('heroImageUrl')

  return (
    <>
      <PageHeader title="Homepage Manager" description="Edit hero image, copy, and CTAs. Save to update the public homepage." action={<a className="btn-secondary" href={getPreviewUrl('/')} target="_blank" rel="noreferrer">Preview</a>} />
      <ErrorNotice error={query.error} />
      {synced ? <p className="mb-4 text-sm font-semibold text-emerald-700">Homepage saved — refresh the public site to see hero changes.</p> : null}
      <form className="grid gap-6 xl:grid-cols-[1fr_360px]" onSubmit={form.handleSubmit((v) => mutation.mutate(v))}>
        <div className="space-y-6">
          <div className="admin-card p-5">
            <h3 className="mb-4 font-bold">Hero content</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Headline"><input className="admin-input" {...form.register('heroHeadline')} /></Field>
              <Field label="Primary CTA label"><input className="admin-input" {...form.register('primaryCtaLabel')} /></Field>
              <Field label="Primary CTA href"><input className="admin-input" {...form.register('primaryCtaHref')} /></Field>
              <Field label="Hero image alt text"><input className="admin-input" {...form.register('heroImageAlt')} /></Field>
              <div className="md:col-span-2"><Field label="Intro"><textarea className="admin-input min-h-28" {...form.register('heroIntro')} /></Field></div>
              <div className="md:col-span-2"><Field label="Hero image URL"><input className="admin-input" {...form.register('heroImageUrl')} placeholder="https://... or upload below" /></Field></div>
              <div className="md:col-span-2">
                <Field label="Upload hero image">
                  <input
                    className="admin-input"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) upload.mutate(file)
                    }}
                  />
                </Field>
                {upload.isPending ? <p className="mt-2 text-sm text-slate-500">Uploading…</p> : null}
              </div>
            </div>
            {heroImageUrl ? (
              <div className="mt-4 overflow-hidden rounded-xl border border-[var(--color-border)]">
                <img src={heroImageUrl} alt={form.watch('heroImageAlt') || 'Hero preview'} className="max-h-72 w-full object-cover" />
              </div>
            ) : (
              <div className="mt-4 rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-mist)] p-8 text-center text-sm text-slate-500">
                No hero image yet — paste a URL or upload a file.
              </div>
            )}
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
          <button className="btn-primary mt-5 w-full" disabled={mutation.isPending}>Save homepage</button>
          {mutation.isSuccess ? <p className="mt-3 text-sm text-emerald-700">Homepage saved.</p> : null}
        </div>
      </form>
    </>
  )
}

export function NavigationPage() {
  const stored = loadSiteConfig()
  const [tab, setTab] = useState<'header' | 'footer'>('header')
  const [headerMenu, setHeaderMenu] = useState(mockNavigation[0])
  const [footerMenu, setFooterMenu] = useState(mockFooterNavigation)
  const [headerItems, setHeaderItems] = useState(stored.headerNav)
  const [footerItems, setFooterItems] = useState(stored.footerNav)
  const [savedAs, setSavedAs] = useState<'draft' | 'published' | null>(null)
  const [pending, setPending] = useState<'draft' | 'published' | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => {
    captureDraftSnapshot('menus')
    hydrateSiteConfigFromStrapi().then((config) => {
      setHeaderItems(config.headerNav)
      setFooterItems(config.footerNav)
      captureDraftSnapshot('menus')
    })
  }, [])

  const items = tab === 'header' ? headerItems : footerItems
  const setItems = tab === 'header' ? setHeaderItems : setFooterItems
  const menu = tab === 'header' ? headerMenu : footerMenu
  const setMenu = tab === 'header' ? setHeaderMenu : setFooterMenu

  function scrollToLatestMenu() {
    window.requestAnimationFrame(() => {
      const rows = document.querySelectorAll('[data-menu-id]')
      rows[rows.length - 1]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    })
  }

  async function saveMenu(status: 'draft' | 'published') {
    if (tab === 'header') setHeaderMenu({ ...headerMenu, items: headerItems })
    else setFooterMenu({ ...footerMenu, items: footerItems })
    setPending(status)
    setSaveError(null)
    try {
      await saveSiteConfig({ headerNav: headerItems, footerNav: footerItems }, status)
      if (status === 'draft') {
        captureDraftSnapshot('menus')
        scrollToLatestMenu()
      }
      setSavedAs(status)
      window.setTimeout(() => setSavedAs(null), 4000)
    } catch (err) {
      setSaveError(`Could not ${status === 'published' ? 'publish' : 'save'} to Strapi: ${getErrorMessage(err)}`)
    } finally {
      setPending(null)
    }
  }

  return (
    <>
      <PageHeader
        title="Pages & menus"
        description="Drag to reorder. Save as draft in Strapi, then Publish live to update the public menus immediately."
        action={
          <div className="flex flex-wrap gap-2">
            <button type="button" className="btn-secondary" disabled={Boolean(pending)} onClick={() => saveMenu('draft')}>
              {pending === 'draft' ? 'Saving draft…' : 'Save as draft'}
            </button>
            <button type="button" className="btn-primary" disabled={Boolean(pending)} onClick={() => saveMenu('published')}>
              {pending === 'published' ? 'Publishing…' : 'Publish live'}
            </button>
            <UndoDraftButton
              scope="menus"
              disabled={Boolean(pending)}
              onRestored={(config) => {
                setHeaderItems(config.headerNav)
                setFooterItems(config.footerNav)
                setSavedAs(null)
              }}
            />
            <RevertToLiveButton
              scope="menus"
              disabled={Boolean(pending)}
              onReverted={(config) => {
                setHeaderItems(config.headerNav)
                setFooterItems(config.footerNav)
                setSavedAs(null)
              }}
            />
          </div>
        }
      />
      <div className="mb-4 flex flex-wrap gap-2">
        {([
          { id: 'header' as const, label: 'Header menu' },
          { id: 'footer' as const, label: 'Footer menu' },
        ]).map((item) => (
          <button
            key={item.id}
            type="button"
            className={`admin-section-tab${tab === item.id ? ' admin-section-tab-active' : ''}`}
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="mb-4 grid gap-4 md:grid-cols-2">
        <Field label="Menu name">
          <input className="admin-input" value={menu.name} onChange={(e) => setMenu({ ...menu, name: e.target.value })} />
        </Field>
        <Field label="Location">
          <input className="admin-input" value={menu.location} readOnly />
        </Field>
      </div>
      <MenuSwapper items={items} onChange={setItems} title={`${tab} menu`} />
      {saveError ? <p className="mt-4 text-sm font-semibold text-red-700">{saveError}</p> : null}
      {savedAs === 'draft' ? <p className="mt-4 text-sm font-semibold text-amber-700">Draft saved in Strapi — not live until you Publish.</p> : null}
      {savedAs === 'published' ? <p className="mt-4 text-sm font-semibold text-emerald-700">Published live — public menus update immediately.</p> : null}
      <div className="admin-card mt-6 p-4">
        <h3 className="mb-3 font-bold">Live {tab} preview</h3>
        <div className="flex flex-wrap gap-2">
          {items.filter((item) => item.visible !== false).map((item) => (
            <span key={item.id} className="rounded-full bg-[var(--color-mist)] px-3 py-1.5 text-sm font-semibold text-[var(--color-primary)]">
              {item.label}
            </span>
          ))}
        </div>
      </div>
    </>
  )
}

export function GenericContentPage({ moduleKey }: { moduleKey: ModuleKey }) {
  const config = moduleConfigs[moduleKey]
  if (!config) return <Navigate to="/dashboard" replace />
  return <GenericContentInner key={moduleKey} moduleKey={moduleKey} config={config} />
}

function GenericContentInner({ moduleKey, config }: { moduleKey: ModuleKey; config: ModuleConfig<AnyRecord> }) {
  const params = useParams(); const navigate = useNavigate(); const qc = useQueryClient(); const isEditing = Boolean(params.id)
  const [localRows, setLocalRows] = useState(() => loadLocalRecords(moduleKey, demoSeed(moduleKey)))
  useEffect(() => {
    let active = true
    if (isDemoMode()) void loadDemoRows(moduleKey, config.endpoint).then(rows => { if (active) setLocalRows(rows) })
    return () => { active = false }
  }, [moduleKey, config.endpoint])
  const [search, setSearch] = useState('')
  const query = useQuery({ queryKey: [moduleKey], queryFn: () => apiListAll<AnyRecord>(config.endpoint), enabled: !isDemoMode() })
  const rows = isDemoMode() ? localRows : (query.data ?? [])
  const current = params.id === 'new' ? undefined : rows.find((row) => row.id === params.id || row.documentId === params.id)
  const dateFieldKeys = new Set(config.fields.filter((f) => f.type === 'date').map((f) => String(f.name)))
  const form = useForm<Record<string, unknown>>({ resolver: zodResolver(schemaFor(config.fields)), values: normalizeForForm(current, config.fields) })
  const titleWatch = form.watch('title')
  useEffect(() => {
    if (params.id !== 'new') return
    if (!config.fields.some((field) => String(field.name) === 'slug')) return
    const next = slugifyTitle(String(titleWatch || ''))
    if (next && String(form.getValues('slug') || '') !== next) form.setValue('slug', next)
  }, [titleWatch, params.id, config.fields, form])
  const draftSnap = useRef<Record<string, unknown> | null>(null)
  useEffect(() => {
    draftSnap.current = form.getValues()
  }, [params.id, current?.id])
  const [savedAs, setSavedAs] = useState<'draft' | 'published' | null>(null)
  const hasStatusField = config.fields.some((field) => String(field.name) === 'status')
  const visible = rows.filter((row) => {
    const q = search.trim().toLowerCase()
    if (!q) return true
    return config.columns.some((col) => String(row[col.key] ?? '').toLowerCase().includes(q))
  })
  const save = useMutation({
    mutationFn: async ({ values, status }: { values: Record<string, unknown>; status: 'draft' | 'published' }) => {
      const payload = buildPayload(config.endpoint, values, status)
      if (!payload.slug && values.title) payload.slug = slugifyTitle(String(values.title))
      if (!payload.slug && config.fields.some((field) => String(field.name) === 'slug')) payload.slug = `${config.singular.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`
      if (config.endpoint === '/events' && !payload.startDate) payload.startDate = toDateTime(new Date().toISOString().slice(0, 10))
      if (config.endpoint === '/news-articles' && !payload.body) payload.body = String(values.summary || values.title || 'Article')
      if (config.endpoint === '/stories') {
        const program = payload.program
        if (typeof program === 'string' && !/^\d+$/.test(program)) delete payload.program
        if (!payload.body) payload.body = String(values.summary || values.title || 'Story')
      }
      const imageValue = String(values.imageUrl || '')
      if (imageValue.startsWith('data:') && !isDemoMode()) {
        if (config.endpoint === '/news-articles') {
          const uploaded = await uploadMedia(dataUrlToUploadFile(imageValue, String(payload.slug || 'article')), String(values.title || 'Article photo'))
          const mediaId = Number(uploaded.id)
          payload.featuredImage = Number.isFinite(mediaId) ? mediaId : uploaded.id
        }
        if (config.endpoint === '/stories') {
          const uploaded = await uploadMedia(dataUrlToUploadFile(imageValue, String(payload.slug || 'story')), String(values.title || 'Story photo'))
          const mediaId = Number(uploaded.id)
          payload.thumbnail = Number.isFinite(mediaId) ? mediaId : uploaded.id
        }
      }
      const saveLocal = async () => {
        const id = String(current?.id || current?.documentId || Date.now())
        const record = {
          ...current,
          ...cleanPayload(values),
          ...payload,
          id,
          documentId: id,
          status,
          updatedAt: new Date().toISOString().slice(0, 10),
        } as AnyRecord
        if (status === 'published') await publishDemoRow(moduleKey, config.endpoint, record)
        const next = current ? localRows.map(row => row.id === current.id ? record : row) : [record, ...localRows]
        saveLocalRecords(moduleKey, next)
        setLocalRows(next)
        return record
      }
      if (isDemoMode()) {
        return saveLocal()
      }
      const id = current?.documentId || current?.id || String(params.id)
      try {
        if (params.id === 'new') {
          const created = await apiCreate<Record<string, unknown>>(config.endpoint, payload, 'draft')
          const createdId = createdDocumentId(created)
          if (createdId && status === 'published') await apiPublish(config.endpoint, createdId)
          return { id: createdId, documentId: createdId }
        }
        await apiUpdate<Record<string, unknown>>(config.endpoint, id, payload, 'draft')
        if (status === 'published') await apiPublish(config.endpoint, id)
        return {}
      } catch (error) {
        throw error
      }
    },
    onSuccess: (data, variables) => {
      qc.invalidateQueries({ queryKey: [moduleKey] })
      setSavedAs(variables.status)
      if (variables.status === 'draft') draftSnap.current = { ...form.getValues(), ...variables.values }
      if (hasStatusField) form.setValue('status', variables.status)
      if (variables.status === 'published') notifyPublished()
      const createdId = data && typeof data === 'object' && 'id' in data ? String((data as AnyRecord).id) : ''
      window.setTimeout(() => {
        setSavedAs(null)
        if (params.id === 'new' && createdId) navigate(`${config.route}/${createdId}`)
        else if (variables.status === 'published') navigate(config.route)
      }, variables.status === 'published' ? 900 : 1200)
    },
  })
  const remove = useMutation({
    mutationFn: async (id: string) => {
      if (isDemoMode()) {
        await publishDemoRow(moduleKey, config.endpoint, null, id)
        const next = localRows.filter(row => String(row.documentId || row.id) !== id)
        saveLocalRecords(moduleKey, next)
        setLocalRows(next)
        return
      }
      await apiDelete(config.endpoint, id)
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: [moduleKey] }),
  })
  if (isEditing) {
    return (
      <>
        <PageHeader title={`${params.id === 'new' ? 'Create' : 'Edit'} ${config.singular}`} description={config.description} action={<Link className="btn-secondary" to={config.route}>Back to list</Link>} />
        {savedAs === 'draft' ? <p className="mb-4 text-sm font-semibold text-amber-700">Draft saved — not live yet.</p> : null}
        {savedAs === 'published' ? <p className="mb-4 text-sm font-semibold text-emerald-700">Published live — the public website updates immediately.</p> : null}
        <form
          className="admin-card max-w-4xl space-y-4 p-5"
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit((v) => save.mutate({ values: v, status: 'draft' }))()
          }}
        >
          {config.fields.map((field) => <FormControl key={String(field.name)} field={field} form={form} />)}
          {save.error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{getErrorMessage(save.error)}</p>}
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-slate-600">
            Use <strong>Save as draft</strong> while editing, then <strong>Publish live</strong> when ready.
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="btn-secondary"
              disabled={save.isPending}
              onClick={() => form.handleSubmit((v) => save.mutate({ values: v, status: 'draft' }))()}
            >
              {save.isPending && save.variables?.status === 'draft' ? 'Saving draft…' : 'Save as draft'}
            </button>
            <button
              type="button"
              className="btn-primary"
              disabled={save.isPending}
              onClick={() => form.handleSubmit((v) => save.mutate({ values: v, status: 'published' }))()}
            >
              {save.isPending && save.variables?.status === 'published' ? 'Publishing…' : 'Publish live'}
            </button>
            <button
              type="button"
              className="btn-secondary"
              disabled={save.isPending}
              onClick={() => {
                if (!draftSnap.current) {
                  window.alert('Nothing to undo.')
                  return
                }
                if (!window.confirm('Undo unsaved edits on this screen and restore the last saved draft?')) return
                form.reset(draftSnap.current)
                setSavedAs(null)
              }}
            >
              Undo draft
            </button>
            <button
              type="button"
              className="btn-secondary"
              disabled={save.isPending || params.id === 'new'}
              onClick={() => {
                if (!window.confirm('Revert this record to the last published version? Draft edits will be discarded.')) return
                const id = String(params.id)
                if (isDemoMode()) {
                  window.alert('No published Strapi version is available in practice mode.')
                  return
                }
                void apiGetOne<AnyRecord>(config.endpoint, id, { populate: '*', status: 'published' })
                  .then((published) => {
                    form.reset(published)
                    setSavedAs(null)
                  })
                  .catch(() => window.alert('No published version of this record yet. Publish once first.'))
              }}
            >
              Revert to live
            </button>
            <a className="btn-secondary" href={recordPreviewUrl(moduleKey, form.watch(), current)} target="_blank" rel="noreferrer">Preview</a>
          </div>
        </form>
      </>
    )
  }
  return (
    <>
      <PageHeader title={config.title} description={config.description} action={<Link className="btn-primary" to={`${config.route}/new`}>Create {config.singular}</Link>} />
      {moduleKey === 'pages' ? (
        <div className="mb-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-accent-soft)] px-4 py-3 text-sm text-[var(--color-primary)]">
          About, Donate, Contact, and the other main pages are edited in <Link className="font-bold underline" to="/website-copy">Site pages</Link>. Use this list only for extra pages.
        </div>
      ) : null}
      <ErrorNotice error={query.error} />
      <div className="admin-toolbar">
        <input
          className="admin-input admin-toolbar-search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`Search ${config.title.toLowerCase()}…`}
          aria-label={`Search ${config.title}`}
        />
        <p className="admin-toolbar-count">{visible.length} {visible.length === 1 ? config.singular.toLowerCase() : 'records'}</p>
      </div>
      {query.isError && !isDemoMode() ? (
        <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700" role="alert">Could not load {config.title.toLowerCase()} from the server: {getErrorMessage(query.error)}. Nothing is being shown from local data.</div>
      ) : null}
      {query.isLoading && !isDemoMode() && !query.data ? (
        <div className="admin-card p-10 text-center text-sm text-slate-600">Loading custom pages…</div>
      ) : rows.length === 0 ? (
        <EmptyState label={config.title} action={<Link className="btn-primary" to={`${config.route}/new`}>Create {config.singular}</Link>} />
      ) : visible.length === 0 ? (
        <div className="admin-card p-10 text-center">
          <h3 className="text-lg font-bold">No matches</h3>
          <p className="mt-2 text-sm text-slate-600">Try a different search.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>{config.columns.map((c) => <th key={String(c.key)}>{c.label}</th>)}<th>Actions</th></tr>
            </thead>
            <tbody>
              {visible.map((row) => (
                <tr key={row.id}>
                  {config.columns.map((col) => (
                    <td key={String(col.key)} className={String(col.key) === 'slug' ? 'data-table-url' : undefined} title={String(col.key) === 'slug' ? String(row[col.key] ?? '') : undefined}>
                      {String(col.key).toLowerCase().includes('status') || typeof row[col.key] === 'boolean'
                        ? <StatusBadge value={row[col.key]} />
                        : String(col.key).toLowerCase().includes('updated') || String(col.key).toLowerCase().includes('created') || dateFieldKeys.has(String(col.key))
                          ? formatDate(row[col.key])
                          : String(row[col.key] ?? '')}
                    </td>
                  ))}
                  <td>
                    <div className="flex gap-2">
                      <Link className="btn-secondary px-3 py-1" to={`${config.route}/${row.documentId || row.id}`}>Edit</Link>
                      {moduleKey === 'locations' || row.slug ? (
                        <a className="btn-secondary px-3 py-1" href={recordPreviewUrl(moduleKey, row, row)} target="_blank" rel="noreferrer">View</a>
                      ) : null}
                      <button
                        className="btn-danger px-3 py-1"
                        onClick={() => {
                          if (!window.confirm(`Delete this ${config.singular.toLowerCase()}?`)) return
                          remove.mutate(String(row.documentId || row.id))
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
function FormControl({ field, form }: { field: FormField<AnyRecord>; form: ReturnType<typeof useForm<Record<string, unknown>>> }) {
  const name = String(field.name)
  const error = form.formState.errors[name]?.message
  if (field.type === 'image') {
    return (
      <div>
        <MediaUpload
          kind="image"
          label={field.label}
          value={String(form.watch(name) || '')}
          hint={IMAGE_HINT}
          noun="photo"
          onLoaded={(dataUrl) => form.setValue(name, dataUrl, { shouldDirty: true })}
          onClear={() => form.setValue(name, '', { shouldDirty: true })}
        />
        {error ? <span className="admin-help">{String(error)}</span> : null}
      </div>
    )
  }
  return (
    <Field label={field.label} error={error}>
      {field.type === 'textarea' ? (
        <textarea className="admin-input min-h-28" {...form.register(name)} />
      ) : field.type === 'select' ? (
        <select className="admin-input" {...form.register(name)}>{field.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>
      ) : field.type === 'richtext' ? (
        <Controller control={form.control} name={name} render={({ field }) => <RichTextEditor value={String(field.value || '')} onChange={field.onChange} />} />
      ) : (
        <input className="admin-input" type={field.type} {...form.register(name, field.type === 'number' ? { valueAsNumber: true } : undefined)} />
      )}
    </Field>
  )
}
function EmptyState({ label, action }: { label: string; action?: ReactNode }) { return <div className="admin-card p-10 text-center"><h3 className="text-lg font-bold">No {label.toLowerCase()} yet</h3><p className="mt-2 text-sm text-slate-600">Create the first record to get started.</p>{action ? <div className="mt-4 flex justify-center">{action}</div> : null}</div> }

export function MediaPage() {
  const queryClient = useQueryClient()
  const [localFiles, setLocalFiles] = useState<MediaFile[]>(mockMedia)
  const query = useQuery({ queryKey: ['media'], queryFn: () => apiList<MediaFile>('/upload/files', {}), enabled: !isDemoMode() })
  const files = !isDemoMode() && query.data?.length ? query.data : localFiles
  const mutation = useMutation({
    mutationFn: async (payload: { files: FileList; alt: string }) => {
      const uploaded: MediaFile[] = []
      for (const file of Array.from(payload.files)) {
        if (isDemoMode()) {
          uploaded.push({
            id: `local-${Date.now()}-${file.name}`,
            name: file.name,
            url: URL.createObjectURL(file),
            mime: file.type || 'image/*',
            size: file.size,
            alternativeText: payload.alt || file.name,
            createdAt: new Date().toISOString(),
          })
        } else {
          uploaded.push(await uploadMedia(file, payload.alt || file.name))
        }
      }
      return uploaded
    },
    onSuccess: (uploaded) => {
      if (isDemoMode()) setLocalFiles((prev) => [...uploaded, ...prev])
      else queryClient.invalidateQueries({ queryKey: ['media'] })
    },
  })

  return (
    <>
      <PageHeader title="Media Library" description="Upload one or many images, preview, set alt text, copy URLs, and delete." />
      <ErrorNotice error={query.error} />
      <form
        className="admin-card mb-6 grid gap-4 p-5 md:grid-cols-[1.4fr_1fr_auto]"
        onSubmit={(e) => {
          e.preventDefault()
          const form = new FormData(e.currentTarget)
          const list = form.getAll('files').filter((f): f is File => f instanceof File && f.size > 0)
          if (!list.length) return
          const dt = new DataTransfer()
          list.forEach((f) => dt.items.add(f))
          mutation.mutate({ files: dt.files, alt: String(form.get('alt') || '') })
          e.currentTarget.reset()
        }}
      >
        <Field label="Images (multi-select)">
          <input className="admin-input" type="file" name="files" accept="image/*" multiple />
        </Field>
        <Field label="Default alt text">
          <input className="admin-input" name="alt" placeholder="Describe the image" />
        </Field>
        <button className="btn-primary self-end" disabled={mutation.isPending}>
          {mutation.isPending ? 'Uploading…' : 'Upload images'}
        </button>
      </form>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {files.map((file) => (
          <div className="admin-card overflow-hidden" key={file.id}>
            <div className="aspect-video bg-slate-100">
              <img className="h-full w-full object-cover" src={file.url.startsWith('http') || file.url.startsWith('blob:') ? file.url : `${getStrapiUrl()}${file.url}`} alt={file.alternativeText || file.name} />
            </div>
            <div className="space-y-2 p-4">
              <div className="font-semibold">{file.name}</div>
              <input className="admin-input" defaultValue={file.alternativeText} aria-label="Alt text" />
              <div className="flex gap-2">
                <button className="btn-secondary px-3 py-1" type="button" onClick={() => navigator.clipboard.writeText(file.url)}>Copy URL</button>
                <button
                  className="btn-danger px-3 py-1"
                  type="button"
                  onClick={() => {
                    if (isDemoMode()) setLocalFiles((prev) => prev.filter((f) => f.id !== file.id))
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export function EnquiriesPage() {
  const [rows, setRows] = useState(() => loadLocalRecords('enquiries', mockEnquiries))
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [message, setMessage] = useState('')
  useEffect(() => {
    let active = true
    async function refresh() {
      const data = await fetchLeads()
      if (!active) return
      if (data.enquiries.length) {
        const mapped = data.enquiries.map((item) => ({
          id: item.id,
          name: item.name,
          email: item.email,
          type: item.roleArea ? `${item.type} · ${item.roleArea}` : item.type,
          message: item.message,
          status: item.status,
          notes: item.notes,
          createdAt: item.createdAt,
        }))
        setRows(mapped as typeof rows)
      }
    }
    void refresh()
    const timer = window.setInterval(() => { void refresh() }, 4000)
    return () => {
      active = false
      window.clearInterval(timer)
    }
  }, [])
  const visible = rows.filter((item) => {
    if (filter !== 'all' && item.status !== filter) return false
    const q = search.trim().toLowerCase()
    if (!q) return true
    return [item.name, item.email, item.type, item.message, item.notes].join(' ').toLowerCase().includes(q)
  })
  function update(id: string, patch: Partial<EnquiryRecord>) {
    setRows((prev) => {
      const next = prev.map((item) => (item.id === id ? { ...item, ...patch } : item))
      saveLocalRecords('enquiries', next)
      return next
    })
    setMessage('Enquiry updated.')
    window.setTimeout(() => setMessage(''), 2000)
  }
  return (
    <>
      <PageHeader
        title="Enquiries"
        description="Contact, volunteer, and get-involved messages. New forms land here and email the team when SMTP is configured."
        action={<button className="btn-secondary" onClick={() => exportCsv(visible as unknown as Record<string, unknown>[], [{ key: 'name', label: 'Name' }, { key: 'email', label: 'Email' }, { key: 'type', label: 'Type' }, { key: 'status', label: 'Status' }], 'cogi-enquiries.csv')}>Export CSV</button>}
      />
      {message ? <p className="admin-flash">{message}</p> : null}
      <div className="admin-toolbar">
        <input className="admin-input admin-toolbar-search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, email, or message…" aria-label="Search enquiries" />
        <select className="admin-input max-w-xs" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All statuses</option>
          {['new', 'in_progress', 'resolved', 'spam'].map((status) => <option key={status} value={status}>{status.replace('_', ' ')}</option>)}
        </select>
        <p className="admin-toolbar-count">{visible.length} {visible.length === 1 ? 'enquiry' : 'enquiries'}</p>
      </div>
      {visible.length === 0 ? (
        <EmptyState label="enquiries" />
      ) : (
        <div className="grid gap-4">
          {visible.map((item) => (
            <div key={item.id} className="admin-card p-5">
              <div className="enquiry-card-head">
                <div>
                  <h3 className="font-bold">{item.name} <span className="text-sm font-medium text-slate-500">{item.email}</span></h3>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">{item.type.replace('-', ' ')} · {formatDate(item.createdAt)}</p>
                  <p className="mt-2 text-sm text-slate-700">{item.message}</p>
                </div>
                <StatusBadge value={item.status} />
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <select className="admin-input" value={item.status} onChange={(e) => update(item.id, { status: e.target.value as EnquiryStatus })}>
                  {['new', 'in_progress', 'resolved', 'spam'].map((status) => <option key={status} value={status}>{status.replace('_', ' ')}</option>)}
                </select>
                <input className="admin-input" value={item.notes || ''} placeholder="Internal notes" onChange={(e) => update(item.id, { notes: e.target.value })} />
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
export function NewsletterPage() {
  const [search, setSearch] = useState('')
  const [subscribers, setSubscribers] = useState<LeadSubscriber[]>([])
  const [mailNote, setMailNote] = useState('')
  const [strapiReachable, setStrapiReachable] = useState<boolean | null>(null)
  const [removingId, setRemovingId] = useState('')
  const [addName, setAddName] = useState('')
  const [addEmail, setAddEmail] = useState('')
  const [addWhatsapp, setAddWhatsapp] = useState('')
  const [addNote, setAddNote] = useState<{ ok: boolean; text: string } | null>(null)
  const [adding, setAdding] = useState(false)
  async function load() {
    const data = await fetchLeads()
    setSubscribers(data.subscribers)
    const queued = data.mails.some((item) => item.status === 'queued')
    setMailNote(queued ? 'Confirmation and admin emails are saved. Add SMTP settings in .env to send them to real inboxes.' : '')
    setStrapiReachable(Boolean(data.strapi?.reachable))
  }
  useEffect(() => {
    let active = true
    async function refresh() {
      if (!active) return
      await load()
    }
    void refresh()
    const timer = window.setInterval(() => { void refresh() }, 4000)
    return () => {
      active = false
      window.clearInterval(timer)
    }
  }, [])
  const rows = subscribers.filter((item) => {
    const q = search.trim().toLowerCase()
    if (!q) return true
    return [item.name, item.email, item.whatsapp, item.source].join(' ').toLowerCase().includes(q)
  })
  async function onRemove(row: LeadSubscriber) {
    if (!window.confirm(`Remove ${row.email} from the newsletter list?`)) return
    setRemovingId(row.id)
    const ok = await removeSubscriber(row.id)
    if (ok) setSubscribers((prev) => prev.filter((item) => item.id !== row.id))
    setRemovingId('')
    await load()
  }
  async function onAdd(e: FormEvent) {
    e.preventDefault()
    setAdding(true)
    setAddNote(null)
    const result = await addSubscriber({ name: addName, email: addEmail, whatsapp: addWhatsapp })
    setAddNote({ ok: result.ok, text: result.message })
    if (result.ok) {
      setAddName('')
      setAddEmail('')
      setAddWhatsapp('')
      await load()
    }
    setAdding(false)
  }
  return (
    <>
      <PageHeader
        title="Newsletter subscribers"
        description="People who signed up on the public website, plus anyone you add here. The public footer Subscribe form writes to this list even when Strapi is offline."
        action={<button className="btn-secondary" onClick={() => exportCsv(rows as unknown as Array<Record<string, unknown>>, [{ key: 'name', label: 'Name' }, { key: 'email', label: 'Email' }, { key: 'whatsapp', label: 'WhatsApp' }, { key: 'source', label: 'Source' }, { key: 'subscriberMail', label: 'Confirmation email' }], 'cogi-newsletter.csv')}>Export CSV</button>}
      />
      {strapiReachable === true ? <p className="hp-flash hp-flash-ok">New signups are saved in Strapi and in this list.</p> : null}
      {strapiReachable === false ? (
        <p className="hp-flash hp-flash-warn">
          Strapi is offline, so this list is the local copy. You can still add subscribers below, and visitors can still subscribe on the website. Records sync to Strapi when it is running again.
        </p>
      ) : null}
      {mailNote ? <p className="hp-flash hp-flash-warn">{mailNote}</p> : null}

      <form className="admin-card mb-4 grid gap-3 p-5 md:grid-cols-[1fr_1fr_1fr_auto]" onSubmit={(e) => void onAdd(e)}>
        <label className="block">
          <span className="admin-label">Name</span>
          <input className="admin-input" value={addName} onChange={(e) => setAddName(e.target.value)} placeholder="Full name" required minLength={2} />
        </label>
        <label className="block">
          <span className="admin-label">Email</span>
          <input className="admin-input" type="email" value={addEmail} onChange={(e) => setAddEmail(e.target.value)} placeholder="name@example.com" required />
        </label>
        <label className="block">
          <span className="admin-label">WhatsApp (optional)</span>
          <input className="admin-input" value={addWhatsapp} onChange={(e) => setAddWhatsapp(e.target.value)} placeholder="+1…" />
        </label>
        <button type="submit" className="btn-primary self-end" disabled={adding}>{adding ? 'Adding…' : 'Add subscriber'}</button>
        {addNote ? <p className={`md:col-span-4 text-sm font-semibold ${addNote.ok ? 'text-emerald-700' : 'text-red-700'}`}>{addNote.text}</p> : null}
      </form>
      <div className="admin-toolbar">
        <input className="admin-input admin-toolbar-search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search subscribers…" aria-label="Search subscribers" />
        <p className="admin-toolbar-count">{rows.length} {rows.length === 1 ? 'subscriber' : 'subscribers'}</p>
      </div>
      {rows.length === 0 ? (
        <EmptyState label="subscribers" />
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>WhatsApp</th>
                <th>Source</th>
                <th>Confirmation</th>
                <th>Strapi</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td>{row.name}</td>
                  <td>{row.email}</td>
                  <td>{row.whatsapp || '—'}</td>
                  <td>{row.source}</td>
                  <td>{row.subscriberMail || '—'}</td>
                  <td>{row.strapiSaved ? 'Saved' : 'Local only'}</td>
                  <td>{formatDate(row.createdAt)}</td>
                  <td>
                    <button
                      type="button"
                      className="btn-danger px-3 py-1"
                      disabled={removingId === row.id}
                      onClick={() => void onRemove(row)}
                    >
                      {removingId === row.id ? 'Removing…' : 'Remove'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
export function SettingsPage() {
  const query = useQuery({ queryKey: ['global-setting'], queryFn: async () => {
    const raw = isDemoMode() ? await loadDemoSettings() : await apiSingle<SettingsRecord & { phone?: string }>('/global-setting')
    return { ...mockSettings, ...raw, primaryPhone: raw.primaryPhone ?? raw.phone ?? '' } as SettingsRecord
  } })
  const form = useForm<SettingsRecord>({ values: query.data ?? mockSettings })
  const [savedAs, setSavedAs] = useState<'draft' | 'published' | null>(null)
  const mutation = useMutation({
    mutationFn: async (values: SettingsRecord) => {
      if (isDemoMode()) {
        await publishLocalContent({ globalSettings: { ...values, phone: values.primaryPhone } })
        return values
      }
      await apiUpdateSingle('/global-setting', {
        organizationName: values.organizationName,
        tagline: values.tagline,
        mission: values.mission,
        vision: values.vision,
        primaryEmail: values.primaryEmail,
        phone: values.primaryPhone,
        address: values.address,
        maintenanceMode: values.maintenanceMode,
      })
      notifyPublished()
      return values
    },
    onSuccess: () => {
      setSavedAs('published')
      window.setTimeout(() => setSavedAs(null), 4000)
    },
  })
  const labels: Record<string, string> = {
    organizationName: 'Organization name',
    tagline: 'Tagline',
    mission: 'Mission',
    vision: 'Vision',
    primaryEmail: 'Primary email',
    primaryPhone: 'Phone',
    address: 'Address',
  }
  return (
    <>
      <PageHeader title="Global settings" description="Organization identity and contact details shown across the public site." />
      <form className="admin-card max-w-5xl space-y-4 p-5" onSubmit={form.handleSubmit((v) => mutation.mutate(v))}>
        {(['organizationName', 'tagline', 'mission', 'vision', 'primaryEmail', 'primaryPhone', 'address'] as const).map((name) => (
          <Field key={name} label={labels[name]}>
            {name === 'mission' || name === 'vision' ? <textarea className="admin-input min-h-24" {...form.register(name)} /> : <input className="admin-input" {...form.register(name)} />}
          </Field>
        ))}
        <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" {...form.register('maintenanceMode')} /> Maintenance mode</label>
        {mutation.error ? <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{getErrorMessage(mutation.error)}</p> : null}
        {savedAs === 'published' ? <p className="text-sm font-semibold text-emerald-700">Saved.</p> : null}
        <button className="btn-primary" disabled={mutation.isPending}>{mutation.isPending ? 'Saving…' : 'Save settings'}</button>
      </form>
    </>
  )
}
export function AuditPage() {
  const [type, setType] = useState('all')
  const [search, setSearch] = useState('')
  const rows = (mockAudit as AuditRecord[]).filter((item) => {
    if (type !== 'all' && item.resourceType !== type) return false
    const q = search.trim().toLowerCase()
    if (!q) return true
    return [item.actor, item.action, item.resourceType, item.ip].join(' ').toLowerCase().includes(q)
  })
  return (
    <>
      <PageHeader title="Audit log" description="A record of sign-ins and publishing activity." />
      <div className="admin-toolbar">
        <input className="admin-input admin-toolbar-search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search activity…" aria-label="Search audit log" />
        <select className="admin-input max-w-xs" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="all">All resources</option>
          {Array.from(new Set(mockAudit.map((item) => item.resourceType))).map((item) => <option key={item}>{item}</option>)}
        </select>
        <p className="admin-toolbar-count">{rows.length} {rows.length === 1 ? 'event' : 'events'}</p>
      </div>
      <SimpleTable rows={rows as unknown as AnyRecord[]} columns={[{ key: 'actor', label: 'Actor' }, { key: 'action', label: 'Action' }, { key: 'resourceType', label: 'Resource' }, { key: 'ip', label: 'IP' }, { key: 'createdAt', label: 'Created' }]} />
    </>
  )
}
export function ProfilePage() {
  const { user, changePassword } = useAuth()
  const form = useForm({
    resolver: zodResolver(z.object({
      currentPassword: z.string().min(1, 'Current password is required'),
      password: z.string().min(6, 'New password must be at least 6 characters'),
      passwordConfirmation: z.string().min(6, 'Confirm your new password'),
    }).refine((values) => values.password === values.passwordConfirmation, { message: 'Passwords do not match', path: ['passwordConfirmation'] })),
    defaultValues: { currentPassword: '', password: '', passwordConfirmation: '' },
  })
  const mutation = useMutation({ mutationFn: changePassword })
  return (
    <>
      <PageHeader title="Profile" description="Your account details and password." />
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="admin-card p-5">
          <h3 className="font-bold">Account</h3>
          <dl className="mt-4 space-y-3 text-sm">
            <div><dt className="font-semibold text-slate-500">Name</dt><dd>{user?.firstname} {user?.lastname}</dd></div>
            <div><dt className="font-semibold text-slate-500">Email</dt><dd>{user?.email}</dd></div>
            <div><dt className="font-semibold text-slate-500">Role</dt><dd>{user?.role?.name}</dd></div>
          </dl>
        </div>
        <form className="admin-card space-y-4 p-5" onSubmit={form.handleSubmit((values) => mutation.mutate(values))}>
          <h3 className="font-bold">Change password</h3>
          <Field label="Current password" error={form.formState.errors.currentPassword?.message}><input className="admin-input" type="password" {...form.register('currentPassword')} /></Field>
          <Field label="New password" error={form.formState.errors.password?.message}><input className="admin-input" type="password" {...form.register('password')} /></Field>
          <Field label="Confirm new password" error={form.formState.errors.passwordConfirmation?.message}><input className="admin-input" type="password" {...form.register('passwordConfirmation')} /></Field>
          <button className="btn-primary">Update password</button>
          {mutation.isSuccess ? <p className="text-sm text-emerald-700">Password updated.</p> : null}
          {mutation.error && <p className="text-sm text-red-700">{getErrorMessage(mutation.error)}</p>}
        </form>
      </div>
    </>
  )
}
function SimpleTable({ rows, columns }: { rows: AnyRecord[]; columns: Array<{ key: keyof AnyRecord; label: string }> }) { return <div className="table-wrap"><table className="data-table"><thead><tr>{columns.map((c) => <th key={String(c.key)}>{c.label}</th>)}</tr></thead><tbody>{rows.map((row) => <tr key={String(row.id)}>{columns.map((c) => <td key={String(c.key)}>{typeof row[c.key] === 'boolean' ? <StatusBadge value={row[c.key]} /> : String(c.key).toLowerCase().includes('created') || String(c.key).toLowerCase().includes('updated') || String(c.key).toLowerCase().includes('date') ? formatDate(row[c.key]) : String(row[c.key] ?? '')}</td>)}</tr>)}</tbody></table></div> }
