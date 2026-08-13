import { useState, useEffect, type ReactNode } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Controller, useForm } from 'react-hook-form'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { z } from 'zod'
import MenuSwapper from '@/components/MenuSwapper'
import RichTextEditor from '@/components/RichTextEditor'
import { useAuth } from '@/contexts/AuthContext'
import { mockActivity, mockAudit, mockBlog, mockEnquiries, mockEvents, mockHomepage, mockLocations, mockMedia, mockNavigation, mockPages, mockPartners, mockPrograms, mockSettings, mockStats, mockStories, mockSubscribers, mockTeam, mockTestimonials, mockUsers } from '@/data/mock'
import { mockFooterNavigation } from '@/data/siteSetup'
import { hydrateSiteConfigFromStrapi, loadSiteConfig, notifyPublished, readFileAsDataUrl, saveSiteConfig } from '@/services/siteConfigStore'
import { apiCreate, apiDelete, apiList, apiListAll, apiSingle, apiPublish, apiUnpublish, apiUpdate, apiUpdateSingle, getErrorMessage, getStrapiUrl, isDemoMode, uploadMedia } from '@/services/strapi'
import { exportCsv } from '@/utils/csv'
import { getPreviewUrl } from '@/utils/preview'
import type { AuditRecord, BaseRecord, FormField, HomepageRecord, MediaFile, ModuleConfig, ModuleKey, SettingsRecord } from '@/types'

type AnyRecord = BaseRecord & Record<string, unknown>
const statusOptions = [{ label: 'Draft', value: 'draft' }, { label: 'Published', value: 'published' }]
const yesNo = [{ label: 'Yes', value: 'true' }, { label: 'No', value: 'false' }]

const moduleData: Record<string, AnyRecord[]> = {
  pages: mockPages as unknown as AnyRecord[], programs: mockPrograms as unknown as AnyRecord[], blog: mockBlog as unknown as AnyRecord[], events: mockEvents as unknown as AnyRecord[], stories: mockStories as unknown as AnyRecord[], testimonials: mockTestimonials as unknown as AnyRecord[], team: mockTeam as unknown as AnyRecord[], partners: mockPartners as unknown as AnyRecord[], locations: mockLocations as unknown as AnyRecord[],
}

export const moduleConfigs: Record<string, ModuleConfig<AnyRecord>> = {
  pages: { key: 'pages', title: 'Pages', endpoint: '/pages', route: '/pages', singular: 'Page', description: 'Create SEO-ready pages from templates with sections, menu placement, and SEO options.', columns: [{ key: 'title', label: 'Title' }, { key: 'slug', label: 'Slug' }, { key: 'status', label: 'Status' }, { key: 'updatedAt', label: 'Updated' }], fields: [{ name: 'title', label: 'Title', type: 'text', required: true }, { name: 'slug', label: 'Slug', type: 'text', required: true }, { name: 'status', label: 'Status', type: 'select', options: statusOptions }] },
  programs: { key: 'programs', title: 'Programs', endpoint: '/programs', route: '/programs', singular: 'Program', description: 'CRUD for ministry programs and portfolio areas.', columns: [{ key: 'title', label: 'Title' }, { key: 'area', label: 'Area' }, { key: 'status', label: 'Status' }, { key: 'order', label: 'Order' }], fields: [{ name: 'title', label: 'Title', type: 'text', required: true }, { name: 'slug', label: 'Slug', type: 'text', required: true }, { name: 'summary', label: 'Summary', type: 'textarea' }, { name: 'description', label: 'Description', type: 'textarea' }, { name: 'area', label: 'Area', type: 'text' }, { name: 'status', label: 'Status', type: 'select', options: statusOptions }, { name: 'order', label: 'Order', type: 'number' }] },
  blog: { key: 'blog', title: 'Blog / News', endpoint: '/news-articles', route: '/blog', singular: 'Article', description: 'Publish news and resource articles with TipTap rich text.', columns: [{ key: 'title', label: 'Title' }, { key: 'category', label: 'Category' }, { key: 'author', label: 'Author' }, { key: 'status', label: 'Status' }], fields: [{ name: 'title', label: 'Title', type: 'text', required: true }, { name: 'slug', label: 'Slug', type: 'text', required: true }, { name: 'summary', label: 'Summary', type: 'textarea' }, { name: 'body', label: 'Body', type: 'richtext' }, { name: 'author', label: 'Author', type: 'text' }, { name: 'category', label: 'Category', type: 'text' }, { name: 'status', label: 'Status', type: 'select', options: statusOptions }] },
  events: { key: 'events', title: 'Events', endpoint: '/events', route: '/events', singular: 'Event', description: 'Manage event calendar listings and details.', columns: [{ key: 'title', label: 'Title' }, { key: 'startDate', label: 'Starts' }, { key: 'venue', label: 'Venue' }, { key: 'status', label: 'Status' }], fields: [{ name: 'title', label: 'Title', type: 'text', required: true }, { name: 'slug', label: 'Slug', type: 'text', required: true }, { name: 'summary', label: 'Summary', type: 'textarea' }, { name: 'description', label: 'Description', type: 'textarea' }, { name: 'startDate', label: 'Start date', type: 'date' }, { name: 'endDate', label: 'End date', type: 'date' }, { name: 'venue', label: 'Venue', type: 'text' }, { name: 'category', label: 'Category', type: 'text' }, { name: 'status', label: 'Status', type: 'select', options: statusOptions }] },
  stories: { key: 'stories', title: 'Stories', endpoint: '/stories', route: '/stories', singular: 'Story', description: 'Stories of transformation, including video and written entries.', columns: [{ key: 'title', label: 'Title' }, { key: 'country', label: 'Country' }, { key: 'program', label: 'Program' }, { key: 'featured', label: 'Featured' }], fields: [{ name: 'title', label: 'Title', type: 'text', required: true }, { name: 'slug', label: 'Slug', type: 'text', required: true }, { name: 'summary', label: 'Summary', type: 'textarea' }, { name: 'type', label: 'Type', type: 'select', options: ['written', 'video'].map((v) => ({ label: v, value: v })) }, { name: 'country', label: 'Country', type: 'text' }, { name: 'program', label: 'Program', type: 'text' }, { name: 'featured', label: 'Featured', type: 'select', options: yesNo }, { name: 'status', label: 'Status', type: 'select', options: statusOptions }] },
  testimonials: { key: 'testimonials', title: 'Testimonials', endpoint: '/testimonials', route: '/testimonials', singular: 'Testimonial', description: 'Written and video testimonials with filters.', columns: [{ key: 'author', label: 'Author' }, { key: 'country', label: 'Country' }, { key: 'program', label: 'Program' }, { key: 'featured', label: 'Featured' }], fields: [{ name: 'quote', label: 'Quote', type: 'textarea', required: true }, { name: 'author', label: 'Author', type: 'text', required: true }, { name: 'mediaType', label: 'Media type', type: 'select', options: ['written', 'video'].map((v) => ({ label: v, value: v })) }, { name: 'country', label: 'Country', type: 'text' }, { name: 'program', label: 'Program', type: 'text' }, { name: 'featured', label: 'Featured', type: 'select', options: yesNo }, { name: 'status', label: 'Status', type: 'select', options: statusOptions }] },
  team: { key: 'team', title: 'Team Members', endpoint: '/team-members', route: '/team', singular: 'Team member', description: 'Board and global team profiles.', columns: [{ key: 'name', label: 'Name' }, { key: 'title', label: 'Title' }, { key: 'role', label: 'Role' }, { key: 'status', label: 'Status' }, { key: 'publicVisibility', label: 'Visible' }], fields: [{ name: 'name', label: 'Name', type: 'text', required: true }, { name: 'title', label: 'Title', type: 'text' }, { name: 'role', label: 'Role', type: 'select', options: ['board', 'global-team', 'staff', 'advisor'].map((v) => ({ label: v, value: v })) }, { name: 'region', label: 'Region', type: 'text' }, { name: 'country', label: 'Country', type: 'text' }, { name: 'bio', label: 'Bio', type: 'textarea' }, { name: 'order', label: 'Order', type: 'number' }, { name: 'publicVisibility', label: 'Public visibility', type: 'select', options: yesNo }] },
  partners: { key: 'partners', title: 'Partners', endpoint: '/partners', route: '/partners', singular: 'Partner', description: 'Partner logos, links, regions, and ordering.', columns: [{ key: 'name', label: 'Name' }, { key: 'region', label: 'Region' }, { key: 'url', label: 'URL' }, { key: 'status', label: 'Status' }], fields: [{ name: 'name', label: 'Name', type: 'text', required: true }, { name: 'description', label: 'Description', type: 'textarea' }, { name: 'url', label: 'URL', type: 'text' }, { name: 'region', label: 'Region', type: 'text' }, { name: 'order', label: 'Order', type: 'number' }, { name: 'status', label: 'Status', type: 'select', options: statusOptions }] },
  locations: { key: 'locations', title: 'Locations', endpoint: '/locations', route: '/locations', singular: 'Location', description: 'Country and region data for map and ministry footprint.', columns: [{ key: 'country', label: 'Country' }, { key: 'region', label: 'Region' }, { key: 'latitude', label: 'Lat' }, { key: 'longitude', label: 'Lng' }], fields: [{ name: 'country', label: 'Country', type: 'text', required: true }, { name: 'region', label: 'Region', type: 'text' }, { name: 'summary', label: 'Summary', type: 'textarea' }, { name: 'latitude', label: 'Latitude', type: 'number' }, { name: 'longitude', label: 'Longitude', type: 'number' }, { name: 'status', label: 'Status', type: 'select', options: statusOptions }] },
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
function StatusBadge({ value }: { value: unknown }) { const text = String(value ?? ''); const color = text.includes('published') || text === 'resolved' || text === 'true' ? 'bg-emerald-50 text-emerald-700' : text === 'new' ? 'bg-blue-50 text-blue-700' : text === 'spam' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'; return <span className={`badge ${color}`}>{text || 'none'}</span> }
function ErrorNotice({ error }: { error: unknown }) { return error ? <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">Strapi request failed: {getErrorMessage(error)}. Showing local demo data so the UI remains usable.</div> : null }
function schemaFor(fields: FormField<AnyRecord>[]) { const shape: Record<string, z.ZodTypeAny> = {}; for (const f of fields) shape[String(f.name)] = f.required ? z.coerce.string().min(1, `${f.label} is required`) : z.any().optional(); return z.object(shape).passthrough() }
function normalizeForForm(record: AnyRecord | undefined, fields: FormField<AnyRecord>[]) { const value: Record<string, unknown> = {}; for (const field of fields) { const name = String(field.name); if (name === 'sectionsText' && record?.sections) value[name] = JSON.stringify(record.sections, null, 2); else if (name === 'itemsText' && record?.items) value[name] = (record.items as Array<{ label: string; href: string }>).map((i) => `${i.label} | ${i.href}`).join('\n'); else value[name] = record?.[name] ?? (field.type === 'number' ? 0 : field.type === 'select' ? field.options?.[0]?.value : '') } return value }
function formatDate(value: unknown): string { const text = String(value ?? ''); if (!text) return ''; const parsed = new Date(text); return Number.isNaN(parsed.getTime()) ? text : parsed.toISOString().slice(0, 10) }
function cleanPayload(values: Record<string, unknown>) { const out: Record<string, unknown> = { ...values }; for (const [key, value] of Object.entries(out)) { if (value === 'true') out[key] = true; if (value === 'false') out[key] = false; if (key.endsWith('Text')) out[key] = value } return out }
const schemaFieldMap: Record<string, Record<string, string>> = {
  '/pages': { title: 'title', slug: 'slug', status: 'status', pageType: 'pageType', summary: 'summary', heroImageUrl: 'heroImageUrl', externalUrl: 'externalUrl', showInHeader: 'showInHeader', showInFooter: 'showInFooter', templateId: 'templateId', sections: 'sections', seo: 'seo' },
  '/programs': { title: 'title', slug: 'slug', summary: 'summary', description: 'body', area: 'area', order: 'order', featured: 'featured' },
  '/news-articles': { title: 'title', slug: 'slug', summary: 'summary', body: 'body', author: 'author', tags: 'tags', featured: 'featured' },
  '/events': { title: 'title', slug: 'slug', summary: 'summary', description: 'body', startDate: 'startDate', endDate: 'endDate', venue: 'venue', featured: 'featured' },
  '/stories': { title: 'title', slug: 'slug', summary: 'summary', country: 'country', featured: 'featured' },
  '/testimonials': { quote: 'quote', author: 'author', mediaType: 'mediaType', country: 'country', featured: 'featured' },
  '/team-members': { name: 'name', title: 'title', role: 'role', region: 'region', bio: 'bio', order: 'order', publicVisibility: 'publicVisibility' },
  '/partners': { name: 'name', description: 'description', url: 'url', region: 'region', order: 'order' },
  '/locations': { country: 'country', region: 'region', summary: 'summary', latitude: 'latitude', longitude: 'longitude' },
}
function buildPayload(endpoint: string, values: Record<string, unknown>, status: 'draft' | 'published') {
  const cleaned = cleanPayload(values)
  const map = schemaFieldMap[endpoint]
  const out: Record<string, unknown> = {}
  for (const [formKey, apiKey] of Object.entries(map)) {
    if (cleaned[formKey] !== undefined) out[apiKey] = cleaned[formKey]
  }
  if (!map.status) out.publishedAt = status === 'published' ? new Date().toISOString() : null
  else out.status = status
  return out
}

export function LoginPage() {
  const { isAuthenticated, login } = useAuth(); const navigate = useNavigate(); const form = useForm({ resolver: zodResolver(z.object({ identifier: z.string().email(), password: z.string().min(1) })), defaultValues: { identifier: 'admin@cogi.local', password: 'admin123' } });
  const mutation = useMutation({ mutationFn: login, onSuccess: () => navigate('/dashboard') })
  if (isAuthenticated) return <Navigate to="/dashboard" replace />
  return <AuthShell title="Welcome back" subtitle="Sign in to manage the COGI CMS. Demo credentials work offline."><form className="space-y-4" onSubmit={form.handleSubmit((v) => mutation.mutate(v))}><Field label="Email" error={form.formState.errors.identifier?.message}><input className="admin-input" {...form.register('identifier')} /></Field><Field label="Password" error={form.formState.errors.password?.message}><input className="admin-input" type="password" {...form.register('password')} /></Field>{mutation.error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{getErrorMessage(mutation.error)}</p>}<button className="btn-primary w-full" disabled={mutation.isPending}>Login</button><div className="flex justify-between text-sm"><Link className="font-semibold text-[var(--color-primary)]" to="/forgot-password">Forgot password?</Link><span className="text-slate-500">admin@cogi.local / admin123</span></div></form></AuthShell>
}
export function ForgotPasswordPage() { const form = useForm({ resolver: zodResolver(z.object({ email: z.string().email() })), defaultValues: { email: '' } }); const [sent, setSent] = useStateMessage(); return <AuthShell title="Forgot password" subtitle="Request a reset email from Strapi."><form className="space-y-4" onSubmit={form.handleSubmit(() => setSent('If Strapi is available, a reset email was requested.'))}><Field label="Email" error={form.formState.errors.email?.message}><input className="admin-input" {...form.register('email')} /></Field><button className="btn-primary w-full">Send reset link</button>{sent && <p className="text-sm text-emerald-700">{sent}</p>}<Link className="text-sm font-semibold text-[var(--color-primary)]" to="/login">Back to login</Link></form></AuthShell> }
export function ResetPasswordPage() { const form = useForm({ resolver: zodResolver(z.object({ code: z.string().min(1), password: z.string().min(6), passwordConfirmation: z.string().min(6) })), defaultValues: { code: '', password: '', passwordConfirmation: '' } }); const [sent, setSent] = useStateMessage(); return <AuthShell title="Reset password" subtitle="Paste the reset code from your email."><form className="space-y-4" onSubmit={form.handleSubmit(() => setSent('Password reset submitted.'))}>{['code','password','passwordConfirmation'].map((name) => <Field key={name} label={name} error={(form.formState.errors as Record<string, { message?: string }>)[name]?.message}><input className="admin-input" type={name.includes('password') ? 'password' : 'text'} {...form.register(name as 'code')} /></Field>)}<button className="btn-primary w-full">Reset password</button>{sent && <p className="text-sm text-emerald-700">{sent}</p>}</form></AuthShell> }
function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <div className="admin-login-screen">
      <div className="admin-login-card admin-login-card-solo">
        <div className="admin-login-card-head">
          <div className="admin-login-icon" aria-hidden="true">
            <img src="/cogi-admin-logo.svg" alt="" width={32} height={32} />
          </div>
          <div>
            <p className="admin-login-kicker">COGI Admin</p>
            <h2>{title}</h2>
            <p>{subtitle}</p>
          </div>
        </div>
        {children}
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
        description="At-a-glance CMS health, engagement, and publishing activity."
        action={
          <div className="flex flex-wrap gap-2">
            <Link className="btn-primary" to="/pages/new">Create page</Link>
            <a className="btn-secondary" href={getPreviewUrl('/')} target="_blank" rel="noreferrer">Preview site</a>
          </div>
        }
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        {[{ label: 'Pages', value: mockStats.pages }, { label: 'Published', value: mockStats.pagesPublished }, { label: 'Drafts', value: mockStats.pagesDraft }, { label: 'Articles', value: mockStats.articles }, { label: 'Upcoming Events', value: mockStats.upcomingEvents }, { label: 'Newsletter', value: mockStats.newsletterSubscribers }].map((s) => (
          <div key={s.label} className="admin-card p-5">
            <div className="text-sm font-semibold text-slate-500">{s.label}</div>
            <div className="mt-2 text-3xl font-extrabold text-[var(--color-primary)]">{s.value}</div>
          </div>
        ))}
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <div className="admin-card p-5">
          <h3 className="mb-4 font-bold">Content mix</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chart}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="value" fill="#1B4D3E" radius={[8, 8, 0, 0]} /></BarChart>
          </ResponsiveContainer>
        </div>
        <div className="admin-card p-5">
          <h3 className="mb-4 font-bold">Engagement trend</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={[{ name: 'Apr', value: 120 }, { name: 'May', value: 220 }, { name: 'Jun', value: 310 }, { name: 'Jul', value: 420 }]}>
              <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Line type="monotone" dataKey="value" stroke="#5B8A72" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <div className="admin-card p-5 xl:col-span-2">
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
          <div className="grid gap-2">
            <Link className="btn-secondary justify-start" to="/pages/new">Create page</Link>
            <Link className="btn-secondary justify-start" to="/homepage">Edit homepage hero</Link>
            <Link className="btn-secondary justify-start" to="/theme">Theme & branding</Link>
            <Link className="btn-secondary justify-start" to="/header">Header editor</Link>
            <Link className="btn-secondary justify-start" to="/footer">Footer editor</Link>
            <Link className="btn-secondary justify-start" to="/navigation">Pages & menus (drag)</Link>
            <Link className="btn-secondary justify-start" to="/media">Upload images</Link>
          </div>
          <div className="mt-5">
            <ResponsiveContainer width="100%" height={150}>
              <PieChart>
                <Pie data={chart} dataKey="value" innerRadius={38} outerRadius={60}>
                  {chart.map((_, i) => <Cell key={i} fill={['#1B4D3E', '#5B8A72', '#C4A574', '#A8C4B5'][i]} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
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
  const [tab, setTab] = useState<'header' | 'footer'>('header')
  const [headerMenu, setHeaderMenu] = useState(mockNavigation[0])
  const [footerMenu, setFooterMenu] = useState(mockFooterNavigation)
  const [headerItems, setHeaderItems] = useState(mockNavigation[0].items)
  const [footerItems, setFooterItems] = useState(mockFooterNavigation.items)
  const [savedAs, setSavedAs] = useState<'draft' | 'published' | null>(null)
  const [pending, setPending] = useState<'draft' | 'published' | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => {
    hydrateSiteConfigFromStrapi().then((config) => {
      setHeaderItems(config.headerNav)
      setFooterItems(config.footerNav)
    })
  }, [])

  const items = tab === 'header' ? headerItems : footerItems
  const setItems = tab === 'header' ? setHeaderItems : setFooterItems
  const menu = tab === 'header' ? headerMenu : footerMenu
  const setMenu = tab === 'header' ? setHeaderMenu : setFooterMenu

  async function saveMenu(status: 'draft' | 'published') {
    if (tab === 'header') setHeaderMenu({ ...headerMenu, items: headerItems })
    else setFooterMenu({ ...footerMenu, items: footerItems })
    setPending(status)
    setSaveError(null)
    try {
      await saveSiteConfig({ headerNav: headerItems, footerNav: footerItems }, status)
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
  return <GenericContentInner moduleKey={moduleKey} config={config} />
}

function GenericContentInner({ moduleKey, config }: { moduleKey: ModuleKey; config: ModuleConfig<AnyRecord> }) {
  const params = useParams(); const navigate = useNavigate(); const qc = useQueryClient(); const isEditing = Boolean(params.id); const localRows = moduleData[moduleKey] || []
  const query = useQuery({ queryKey: [moduleKey], queryFn: () => apiListAll<AnyRecord>(config.endpoint), enabled: !isDemoMode() })
  const rows = isDemoMode() || query.isError ? localRows : (query.data ?? [])
  const current = params.id === 'new' ? undefined : rows.find((row) => row.id === params.id || row.documentId === params.id)
  const dateFieldKeys = new Set(config.fields.filter((f) => f.type === 'date').map((f) => String(f.name)))
  const form = useForm<Record<string, unknown>>({ resolver: zodResolver(schemaFor(config.fields)), values: normalizeForForm(current, config.fields) })
  const [savedAs, setSavedAs] = useState<'draft' | 'published' | null>(null)
  const hasStatusField = config.fields.some((field) => String(field.name) === 'status')
  const save = useMutation({
    mutationFn: async ({ values, status }: { values: Record<string, unknown>; status: 'draft' | 'published' }) => {
      const payload = buildPayload(config.endpoint, values, status)
      if (isDemoMode()) {
        localStorage.setItem(`cogi_${moduleKey}_${String(payload.slug || params.id || Date.now())}`, JSON.stringify(payload))
        return payload
      }
      const id = current?.documentId || current?.id || String(params.id)
      if (params.id === 'new') {
        const created = await apiCreate<Record<string, unknown>>(config.endpoint, payload, 'draft')
        const createdId = (created as { data?: { documentId?: string } })?.data?.documentId
        if (createdId && status === 'published') await apiPublish(config.endpoint, createdId)
        return created
      }
      await apiUpdate<Record<string, unknown>>(config.endpoint, id, payload, 'draft')
      if (status === 'published') await apiPublish(config.endpoint, id)
      else await apiUnpublish(config.endpoint, id)
      return {}
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: [moduleKey] })
      setSavedAs(variables.status)
      if (hasStatusField) form.setValue('status', variables.status)
      if (variables.status === 'published') notifyPublished()
      window.setTimeout(() => {
        setSavedAs(null)
        if (variables.status === 'published') navigate(config.route)
      }, variables.status === 'published' ? 900 : 1600)
    },
  })
  const remove = useMutation({ mutationFn: (id: string) => isDemoMode() ? Promise.resolve() : apiDelete(config.endpoint, id), onSuccess: () => qc.invalidateQueries({ queryKey: [moduleKey] }) })
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
            <a className="btn-secondary" href={getPreviewUrl(String(form.watch('slug') || ''))} target="_blank" rel="noreferrer">Preview</a>
          </div>
        </form>
      </>
    )
  }
  return <><PageHeader title={config.title} description={config.description} action={<Link className="btn-primary" to={`${config.route}/new`}>Create {config.singular}</Link>} /><ErrorNotice error={query.error} />{rows.length === 0 ? <EmptyState label={config.title} /> : <div className="table-wrap"><table className="data-table"><thead><tr>{config.columns.map((c) => <th key={String(c.key)}>{c.label}</th>)}<th>Actions</th></tr></thead><tbody>{rows.map((row) => <tr key={row.id}>{config.columns.map((col) => <td key={String(col.key)}>{String(col.key).toLowerCase().includes('status') || typeof row[col.key] === 'boolean' ? <StatusBadge value={row[col.key]} /> : String(col.key).toLowerCase().includes('updated') || String(col.key).toLowerCase().includes('created') || dateFieldKeys.has(String(col.key)) ? formatDate(row[col.key]) : String(row[col.key] ?? '')}</td>)}<td><div className="flex gap-2"><Link className="btn-secondary px-3 py-1" to={`${config.route}/${row.documentId || row.id}`}>Edit</Link><button className="btn-danger px-3 py-1" onClick={() => remove.mutate(String(row.documentId || row.id))}>Delete</button></div></td></tr>)}</tbody></table></div>}</>
}
function FormControl({ field, form }: { field: FormField<AnyRecord>; form: ReturnType<typeof useForm<Record<string, unknown>>> }) { const name = String(field.name); const error = form.formState.errors[name]?.message; return <Field label={field.label} error={error}>{field.type === 'textarea' ? <textarea className="admin-input min-h-28" {...form.register(name)} /> : field.type === 'select' ? <select className="admin-input" {...form.register(name)}>{field.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select> : field.type === 'richtext' ? <Controller control={form.control} name={name} render={({ field }) => <RichTextEditor value={String(field.value || '')} onChange={field.onChange} />} /> : <input className="admin-input" type={field.type} {...form.register(name, field.type === 'number' ? { valueAsNumber: true } : undefined)} />}</Field> }
function EmptyState({ label }: { label: string }) { return <div className="admin-card p-10 text-center"><h3 className="text-lg font-bold">No {label.toLowerCase()} yet</h3><p className="mt-2 text-sm text-slate-600">Create the first record, or check Strapi permissions and API availability.</p></div> }

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

export function EnquiriesPage() { const [filter, setFilter] = ReactUseState('all'); const rows = mockEnquiries.filter((e) => filter === 'all' || e.status === filter); return <><PageHeader title="Enquiries" description="Filter, triage, add notes, update status, and export submissions." action={<button className="btn-secondary" onClick={() => exportCsv(mockEnquiries as unknown as Record<string, unknown>[], [{ key: 'name', label: 'Name' }, { key: 'email', label: 'Email' }, { key: 'type', label: 'Type' }, { key: 'status', label: 'Status' }], 'cogi-enquiries.csv')}>Export CSV</button>} /><div className="mb-4 max-w-xs"><select className="admin-input" value={filter} onChange={(e) => setFilter(e.target.value)}><option value="all">All statuses</option>{['new','in_progress','resolved','spam'].map((s) => <option key={s} value={s}>{s}</option>)}</select></div><div className="grid gap-4">{rows.map((e) => <div key={e.id} className="admin-card p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="font-bold">{e.name} <span className="text-sm font-medium text-slate-500">{e.email}</span></h3><p className="mt-2 text-sm text-slate-700">{e.message}</p></div><StatusBadge value={e.status} /></div><div className="mt-4 grid gap-3 md:grid-cols-2"><select className="admin-input" defaultValue={e.status}>{['new','in_progress','resolved','spam'].map((s) => <option key={s} value={s}>{s}</option>)}</select><input className="admin-input" defaultValue={e.notes} placeholder="Internal notes" /></div></div>)}</div></> }
export function NewsletterPage() { return <><PageHeader title="Newsletter Subscribers" description="Subscriber list with CSV export." action={<button className="btn-secondary" onClick={() => exportCsv(mockSubscribers as unknown as Record<string, unknown>[], [{ key: 'name', label: 'Name' }, { key: 'email', label: 'Email' }, { key: 'whatsapp', label: 'WhatsApp' }, { key: 'source', label: 'Source' }], 'cogi-newsletter.csv')}>Export CSV</button>} /><SimpleTable rows={mockSubscribers as unknown as AnyRecord[]} columns={[{ key: 'name', label: 'Name' }, { key: 'email', label: 'Email' }, { key: 'whatsapp', label: 'WhatsApp' }, { key: 'source', label: 'Source' }, { key: 'createdAt', label: 'Created' }]} /></> }
export function SettingsPage() {
  const query = useQuery({ queryKey: ['global-setting'], queryFn: () => apiSingle<SettingsRecord>('/global-setting'), enabled: !isDemoMode() })
  const form = useForm<SettingsRecord>({ values: query.data ?? mockSettings })
  const [savedAs, setSavedAs] = useState<'draft' | 'published' | null>(null)
  const mutation = useMutation({
    mutationFn: async (values: SettingsRecord) => {
      if (isDemoMode()) {
        localStorage.setItem('cogi_settings', JSON.stringify(values))
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
  return (
    <>
      <PageHeader title="Global Settings" description="Organization identity and contact details. Publish live to save in Strapi and update the public site." />
      <form className="admin-card max-w-5xl space-y-4 p-5" onSubmit={form.handleSubmit((v) => mutation.mutate(v))}>
        {(['organizationName','tagline','mission','vision','primaryEmail','primaryPhone','address'] as const).map((name) => (
          <Field key={name} label={name}><input className="admin-input" {...form.register(name)} /></Field>
        ))}
        <label className="flex items-center gap-2 text-sm font-semibold"><input type="checkbox" {...form.register('maintenanceMode')} /> Maintenance mode</label>
        {mutation.error ? <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{getErrorMessage(mutation.error)}</p> : null}
        {savedAs === 'published' ? <p className="text-sm font-semibold text-emerald-700">Published live — saved in Strapi.</p> : null}
        <button className="btn-primary" disabled={mutation.isPending}>{mutation.isPending ? 'Publishing…' : 'Publish live'}</button>
      </form>
    </>
  )
}
export function UsersPage() { return <><PageHeader title="Users & Roles" description="Read-only Strapi users and role display." /><SimpleTable rows={mockUsers as unknown as AnyRecord[]} columns={[{ key: 'username', label: 'Username' }, { key: 'email', label: 'Email' }, { key: 'blocked', label: 'Blocked' }]} /></> }
export function AuditPage() { const [type, setType] = ReactUseState('all'); const rows = (mockAudit as AuditRecord[]).filter((a) => type === 'all' || a.resourceType === type); return <><PageHeader title="Audit Log" description="Filterable record of admin activity." /><div className="mb-4 max-w-xs"><select className="admin-input" value={type} onChange={(e) => setType(e.target.value)}><option value="all">All resources</option>{Array.from(new Set(mockAudit.map((a) => a.resourceType))).map((s) => <option key={s}>{s}</option>)}</select></div><SimpleTable rows={rows as unknown as AnyRecord[]} columns={[{ key: 'actor', label: 'Actor' }, { key: 'action', label: 'Action' }, { key: 'resourceType', label: 'Resource' }, { key: 'ip', label: 'IP' }, { key: 'createdAt', label: 'Created' }]} /></> }
export function ProfilePage() { const { user, changePassword } = useAuth(); const form = useForm({ resolver: zodResolver(z.object({ currentPassword: z.string().min(1), password: z.string().min(6), passwordConfirmation: z.string().min(6) })), defaultValues: { currentPassword: '', password: '', passwordConfirmation: '' } }); const mutation = useMutation({ mutationFn: changePassword }); return <><PageHeader title="Profile" description="View profile details and change password." /><div className="grid gap-6 lg:grid-cols-2"><div className="admin-card p-5"><h3 className="font-bold">Account</h3><dl className="mt-4 space-y-3 text-sm"><div><dt className="font-semibold text-slate-500">Name</dt><dd>{user?.firstname} {user?.lastname}</dd></div><div><dt className="font-semibold text-slate-500">Email</dt><dd>{user?.email}</dd></div><div><dt className="font-semibold text-slate-500">Role</dt><dd>{user?.role?.name}</dd></div></dl></div><form className="admin-card space-y-4 p-5" onSubmit={form.handleSubmit((v) => mutation.mutate(v))}><h3 className="font-bold">Change password</h3>{(['currentPassword','password','passwordConfirmation'] as const).map((name) => <Field key={name} label={name} error={form.formState.errors[name]?.message}><input className="admin-input" type="password" {...form.register(name)} /></Field>)}<button className="btn-primary">Update password</button>{mutation.error && <p className="text-sm text-red-700">{getErrorMessage(mutation.error)}</p>}</form></div></> }
function SimpleTable({ rows, columns }: { rows: AnyRecord[]; columns: Array<{ key: keyof AnyRecord; label: string }> }) { return <div className="table-wrap"><table className="data-table"><thead><tr>{columns.map((c) => <th key={String(c.key)}>{c.label}</th>)}</tr></thead><tbody>{rows.map((row) => <tr key={String(row.id)}>{columns.map((c) => <td key={String(c.key)}>{typeof row[c.key] === 'boolean' ? <StatusBadge value={row[c.key]} /> : String(c.key).toLowerCase().includes('created') || String(c.key).toLowerCase().includes('updated') || String(c.key).toLowerCase().includes('date') ? formatDate(row[c.key]) : String(row[c.key] ?? '')}</td>)}</tr>)}</tbody></table></div> }
function ReactUseState(initial: string): [string, (value: string) => void] { return useState(initial) }
