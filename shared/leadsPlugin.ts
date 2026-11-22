import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DATA_PATH = path.resolve(rootDir, 'data/leads.json')

function loadEnvFile(filePath: string) {
  if (!fs.existsSync(filePath)) return
  for (const line of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq < 1) continue
    const key = trimmed.slice(0, eq).trim()
    let value = trimmed.slice(eq + 1).trim()
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    if (!process.env[key]) process.env[key] = value
  }
}

function hydrateEnv() {
  for (const dir of [rootDir, path.join(rootDir, 'public-website'), path.join(rootDir, 'admin-portal'), path.join(rootDir, 'strapi-backend')]) {
    loadEnvFile(path.join(dir, '.env'))
    loadEnvFile(path.join(dir, '.env.local'))
  }
}

export type LeadSubscriber = {
  id: string
  documentId?: string
  name: string
  email: string
  whatsapp?: string
  source: string
  consent: boolean
  createdAt: string
  subscriberMail: 'sent' | 'queued' | 'failed'
  adminMail: 'sent' | 'queued' | 'failed'
  mailError?: string
  strapiSaved: boolean
}

export type LeadEnquiry = {
  id: string
  name: string
  email: string
  phone?: string
  type: string
  pathway?: string
  roleArea?: string
  programInterest?: string
  message: string
  status: 'new' | 'in_progress' | 'resolved' | 'spam'
  notes?: string
  createdAt: string
  adminMail?: 'sent' | 'queued' | 'failed'
}

export type LeadNotification = {
  id: string
  type: 'newsletter' | 'enquiry'
  title: string
  body: string
  href: string
  createdAt: string
  read: boolean
}

export type LeadMail = {
  id: string
  to: string
  subject: string
  text: string
  createdAt: string
  status: 'sent' | 'queued' | 'failed'
  error?: string
}

type LeadsFile = {
  subscribers: LeadSubscriber[]
  notifications: LeadNotification[]
  mails: LeadMail[]
  enquiries: LeadEnquiry[]
}

type StrapiEntry = {
  id?: number | string
  documentId?: string
  name?: string
  email?: string
  whatsapp?: string
  source?: string
  consent?: boolean
  subscribedAt?: string
  createdAt?: string
}

let cachedJwt: { token: string; expiresAt: number } | null = null

function emptyLeads(): LeadsFile {
  return { subscribers: [], notifications: [], mails: [], enquiries: [] }
}

function readLeads(): LeadsFile {
  try {
    if (!fs.existsSync(DATA_PATH)) return emptyLeads()
    const parsed = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8')) as Partial<LeadsFile>
    return {
      subscribers: Array.isArray(parsed.subscribers)
        ? parsed.subscribers.map((row) => ({ ...row, strapiSaved: Boolean(row.strapiSaved || row.documentId) }))
        : [],
      notifications: Array.isArray(parsed.notifications) ? parsed.notifications : [],
      mails: Array.isArray(parsed.mails) ? parsed.mails : [],
      enquiries: Array.isArray(parsed.enquiries) ? parsed.enquiries : [],
    }
  } catch {
    return emptyLeads()
  }
}

function writeLeads(data: LeadsFile) {
  fs.mkdirSync(path.dirname(DATA_PATH), { recursive: true })
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf8')
}

function cors(res: { setHeader: (k: string, v: string) => void }) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}

function json(res: { statusCode: number; setHeader: (k: string, v: string) => void; end: (s: string) => void }, status: number, body: unknown) {
  cors(res)
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(body))
}

function readBody(req: { on: (e: string, cb: (chunk?: unknown) => void) => void }): Promise<string> {
  return new Promise((resolve) => {
    let body = ''
    req.on('data', (chunk) => { body += String(chunk) })
    req.on('end', () => resolve(body))
  })
}

function strapiBase() {
  return (process.env.STRAPI_URL || process.env.VITE_STRAPI_URL || 'http://localhost:1337').replace(/\/$/, '')
}

function mailSettings() {
  return {
    host: process.env.SMTP_HOST?.trim() || '',
    port: Number(process.env.SMTP_PORT || 587),
    user: process.env.SMTP_USER?.trim() || '',
    pass: process.env.SMTP_PASS?.trim() || '',
    secure: process.env.SMTP_SECURE === 'true',
    from: process.env.MAIL_FROM?.trim() || 'Companions of Grace <info@coginternational.org>',
    admin: process.env.ADMIN_NOTIFY_EMAIL?.trim() || 'info@coginternational.org',
  }
}

async function deliverMail(to: string, subject: string, text: string, html: string): Promise<{ status: 'sent' | 'queued' | 'failed'; error?: string }> {
  const smtp = mailSettings()
  if (!smtp.host || !smtp.user || !smtp.pass) {
    return { status: 'queued', error: 'SMTP is not configured. The message is saved in the admin outbox.' }
  }
  try {
    // @ts-ignore - nodemailer is an optional server dependency (installed in strapi-backend); vite builds ignore it
    const nodemailer: any = await import('nodemailer')
    const transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.secure || smtp.port === 465,
      auth: { user: smtp.user, pass: smtp.pass },
    })
    await transporter.sendMail({ from: smtp.from, to, subject, text, html })
    return { status: 'sent' }
  } catch (error) {
    return { status: 'failed', error: error instanceof Error ? error.message : String(error) }
  }
}

function subscriberEmail(name: string) {
  const subject = 'You are subscribed to Companions of Grace'
  const text = `Hello ${name},\n\nThank you for subscribing to Companions of Grace International. We will send stories, events, and ways to get involved.\n\nIf you did not request this, you can ignore this email.\n\nGrace and peace,\nCompanions of Grace International\ninfo@coginternational.org`
  const html = `<div style="font-family:Georgia,serif;line-height:1.6;color:#1A2332"><p>Hello ${escapeHtml(name)},</p><p>Thank you for subscribing to <strong>Companions of Grace International</strong>. We will send stories, events, and ways to get involved.</p><p>Grace and peace,<br/>Companions of Grace International<br/><a href="mailto:info@coginternational.org">info@coginternational.org</a></p></div>`
  return { subject, text, html }
}

function adminEmail(sub: LeadSubscriber) {
  const subject = `New newsletter subscriber: ${sub.name}`
  const text = `A new person subscribed on the COGI website.\n\nName: ${sub.name}\nEmail: ${sub.email}\nWhatsApp: ${sub.whatsapp || '—'}\nSource: ${sub.source}\nTime: ${sub.createdAt}\n\nOpen the admin Newsletter list to export or follow up.`
  const html = `<div style="font-family:Georgia,serif;line-height:1.6;color:#1A2332"><p>A new person subscribed on the COGI website.</p><ul><li><strong>Name:</strong> ${escapeHtml(sub.name)}</li><li><strong>Email:</strong> ${escapeHtml(sub.email)}</li><li><strong>WhatsApp:</strong> ${escapeHtml(sub.whatsapp || '—')}</li><li><strong>Source:</strong> ${escapeHtml(sub.source)}</li></ul></div>`
  return { subject, text, html }
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch] || ch))
}

function unwrapStrapi(json: unknown): StrapiEntry | null {
  if (!json || typeof json !== 'object') return null
  const root = json as { data?: StrapiEntry | StrapiEntry[] }
  const data = Array.isArray(root.data) ? root.data[0] : root.data
  if (data && typeof data === 'object') return data
  return json as StrapiEntry
}

async function strapiJwt(): Promise<string | null> {
  if (cachedJwt && cachedJwt.expiresAt > Date.now()) return cachedJwt.token
  const identifier = process.env.STRAPI_ADMIN_EMAIL?.trim() || 'admin@cogi.local'
  const password = process.env.STRAPI_ADMIN_PASSWORD?.trim() || 'admin123'
  try {
    const response = await fetch(`${strapiBase()}/api/auth/local`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
      signal: AbortSignal.timeout(8000),
    })
    if (!response.ok) return null
    const body = (await response.json()) as { jwt?: string }
    if (!body.jwt) return null
    cachedJwt = { token: body.jwt, expiresAt: Date.now() + 50 * 60 * 1000 }
    return body.jwt
  } catch {
    cachedJwt = null
    return null
  }
}

async function createInStrapi(input: { name: string; email: string; whatsapp?: string; source: string }) {
  try {
    const response = await fetch(`${strapiBase()}/api/newsletter-subscribers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        data: {
          name: input.name,
          email: input.email,
          whatsapp: input.whatsapp || '',
          source: input.source,
          consent: true,
          subscribedAt: new Date().toISOString(),
        },
      }),
      signal: AbortSignal.timeout(10000),
    })
    const raw = (await response.json().catch(() => ({}))) as { data?: StrapiEntry; meta?: { already?: boolean }; error?: unknown }
    const entry = unwrapStrapi(raw)
    if (response.ok || raw?.meta?.already) {
      return {
        ok: true as const,
        already: Boolean(raw?.meta?.already),
        documentId: String(entry?.documentId || ''),
      }
    }
    const message = JSON.stringify(raw?.error || raw)
    if (response.status === 400 && /unique|already exists|email/i.test(message)) {
      return { ok: true as const, already: true, documentId: String(entry?.documentId || '') }
    }
    return { ok: false as const, error: message }
  } catch (error) {
    return { ok: false as const, error: error instanceof Error ? error.message : String(error) }
  }
}

async function listFromStrapi(): Promise<{ reachable: boolean; entries: StrapiEntry[] }> {
  const jwt = await strapiJwt()
  if (!jwt) {
    try {
      const ping = await fetch(`${strapiBase()}/api/newsletter-subscribers`, { signal: AbortSignal.timeout(4000) })
      return { reachable: ping.status < 500, entries: [] }
    } catch {
      return { reachable: false, entries: [] }
    }
  }
  try {
    const response = await fetch(`${strapiBase()}/api/newsletter-subscribers?pagination[pageSize]=100&sort=createdAt:desc`, {
      headers: { Authorization: `Bearer ${jwt}` },
      signal: AbortSignal.timeout(10000),
    })
    if (!response.ok) return { reachable: true, entries: [] }
    const raw = (await response.json()) as { data?: StrapiEntry[] }
    return { reachable: true, entries: Array.isArray(raw.data) ? raw.data : [] }
  } catch {
    return { reachable: false, entries: [] }
  }
}

async function deleteFromStrapi(subscriber: LeadSubscriber) {
  const jwt = await strapiJwt()
  if (!jwt) return false
  let documentId = subscriber.documentId
  if (!documentId) {
    const listed = await listFromStrapi()
    documentId = listed.entries.find((row) => String(row.email || '').toLowerCase() === subscriber.email)?.documentId
  }
  if (!documentId) return false
  try {
    const response = await fetch(`${strapiBase()}/api/newsletter-subscribers/${documentId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${jwt}` },
      signal: AbortSignal.timeout(10000),
    })
    return response.ok || response.status === 404
  } catch {
    return false
  }
}

function fromStrapiEntry(entry: StrapiEntry): LeadSubscriber {
  const email = String(entry.email || '').trim().toLowerCase()
  const documentId = String(entry.documentId || '')
  return {
    id: documentId ? `strapi-${documentId}` : `sub-${email}`,
    documentId: documentId || undefined,
    name: String(entry.name || 'Subscriber'),
    email,
    whatsapp: entry.whatsapp ? String(entry.whatsapp) : undefined,
    source: String(entry.source || 'strapi'),
    consent: entry.consent !== false,
    createdAt: String(entry.subscribedAt || entry.createdAt || new Date().toISOString()),
    subscriberMail: 'queued',
    adminMail: 'queued',
    strapiSaved: true,
  }
}

async function mergedLeads() {
  const data = readLeads()
  const remote = await listFromStrapi()
  let changed = false
  for (const entry of remote.entries) {
    const email = String(entry.email || '').trim().toLowerCase()
    if (!email) continue
    const existing = data.subscribers.find((row) => row.email === email)
    if (existing) {
      if (!existing.documentId && entry.documentId) {
        existing.documentId = entry.documentId
        existing.strapiSaved = true
        changed = true
      }
      continue
    }
    data.subscribers.push(fromStrapiEntry(entry))
    changed = true
  }
  if (remote.reachable) {
    for (const row of data.subscribers) {
      if (row.strapiSaved && row.documentId) continue
      const saved = await createInStrapi({
        name: row.name,
        email: row.email,
        whatsapp: row.whatsapp,
        source: row.source,
      })
      if (saved.ok) {
        row.strapiSaved = true
        row.documentId = saved.documentId || row.documentId
        changed = true
      }
    }
  }
  data.subscribers.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))
  if (changed) writeLeads(data)
  return { ...data, strapi: { reachable: remote.reachable } }
}

async function addSubscriber(input: { name?: string; email?: string; whatsapp?: string; source?: string }) {
  const name = String(input.name || '').trim()
  const email = String(input.email || '').trim().toLowerCase()
  const whatsapp = String(input.whatsapp || '').trim()
  const source = String(input.source || 'website').trim() || 'website'
  if (name.length < 2) return { ok: false as const, status: 400, body: { success: false, message: 'Please enter your name.' } }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false as const, status: 400, body: { success: false, message: 'Please enter a valid email address.' } }

  const data = readLeads()
  const existing = data.subscribers.find((row) => row.email === email)
  if (existing) {
    if (!existing.strapiSaved) {
      const saved = await createInStrapi({ name: existing.name, email, whatsapp: existing.whatsapp, source: existing.source })
      if (saved.ok) {
        existing.strapiSaved = true
        existing.documentId = saved.documentId || existing.documentId
        writeLeads(data)
      }
    }
    return {
      ok: true as const,
      status: 200,
      body: {
        success: true,
        already: true,
        message: source === 'admin' ? 'That email is already on the list.' : 'You are already subscribed. Thank you.',
      },
    }
  }

  const strapiSave = await createInStrapi({ name, email, whatsapp, source })
  const createdAt = new Date().toISOString()
  const subscriber: LeadSubscriber = {
    id: strapiSave.ok && strapiSave.documentId ? `strapi-${strapiSave.documentId}` : `sub-${Date.now()}`,
    documentId: strapiSave.ok ? strapiSave.documentId || undefined : undefined,
    name,
    email,
    whatsapp: whatsapp || undefined,
    source,
    consent: true,
    createdAt,
    subscriberMail: 'queued',
    adminMail: 'queued',
    strapiSaved: strapiSave.ok,
  }

  const confirm = subscriberEmail(name)
  const alert = adminEmail(subscriber)
  const confirmResult = await deliverMail(email, confirm.subject, confirm.text, confirm.html)
  const adminResult = await deliverMail(mailSettings().admin, alert.subject, alert.text, alert.html)
  subscriber.subscriberMail = confirmResult.status
  subscriber.adminMail = adminResult.status
  subscriber.mailError = confirmResult.error || adminResult.error
  if (!strapiSave.ok) {
    subscriber.mailError = [subscriber.mailError, `Strapi: ${strapiSave.error}`].filter(Boolean).join(' · ')
  }

  data.subscribers.unshift(subscriber)
  data.notifications.unshift({
    id: `note-${Date.now()}`,
    type: 'newsletter',
    title: `${name} subscribed`,
    body: `${email}${whatsapp ? ` · ${whatsapp}` : ''}`,
    href: '/newsletter',
    createdAt,
    read: false,
  })
  data.mails.unshift(
    { id: `mail-${Date.now()}-sub`, to: email, subject: confirm.subject, text: confirm.text, createdAt, status: confirmResult.status, error: confirmResult.error },
    { id: `mail-${Date.now()}-admin`, to: mailSettings().admin, subject: alert.subject, text: alert.text, createdAt, status: adminResult.status, error: adminResult.error },
  )
  data.notifications = data.notifications.slice(0, 50)
  data.mails = data.mails.slice(0, 100)
  writeLeads(data)

  const mailed = confirmResult.status === 'sent'
  const adminAdded = source === 'admin'
  return {
    ok: true as const,
    status: 201,
    body: {
      success: true,
      strapiSaved: subscriber.strapiSaved,
      mailed,
      message: adminAdded
        ? (subscriber.strapiSaved
          ? 'Subscriber added to this list.'
          : 'Subscriber added here. They will sync to Strapi when it is running.')
        : mailed
          ? 'Thank you for subscribing. Please check your inbox for a confirmation email.'
          : 'Thank you for subscribing. You are on the list, and a confirmation email has been queued.',
    },
  }
}

function enquiryEmail(row: LeadEnquiry) {
  const subject = row.type === 'join' && row.pathway ? `${row.pathway.charAt(0).toUpperCase() + row.pathway.slice(1)} — ${row.name}` : `New ${row.type} from ${row.name}`
  const text = `A new form submission arrived on the COGI website.\n\nName: ${row.name}\nEmail: ${row.email}\nPhone: ${row.phone || '—'}\nType: ${row.type}\nPathway: ${row.pathway || '—'}\nRole: ${row.roleArea || '—'}\nProgram: ${row.programInterest || '—'}\n\n${row.message}\n\nOpen Admin → Inbox → Messages to follow up.`
  const html = `<div style="font-family:Georgia,serif;line-height:1.6;color:#1A2332"><p>A new form submission arrived on the COGI website.</p><ul><li><strong>Name:</strong> ${escapeHtml(row.name)}</li><li><strong>Email:</strong> ${escapeHtml(row.email)}</li><li><strong>Phone:</strong> ${escapeHtml(row.phone || '—')}</li><li><strong>Type:</strong> ${escapeHtml(row.type)}</li><li><strong>Pathway:</strong> ${escapeHtml(row.pathway || '—')}</li><li><strong>Role:</strong> ${escapeHtml(row.roleArea || '—')}</li><li><strong>Program:</strong> ${escapeHtml(row.programInterest || '—')}</li></ul><p>${escapeHtml(row.message)}</p></div>`
  return { subject, text, html }
}

async function addEnquiry(input: {
  name?: string
  email?: string
  phone?: string
  type?: string
  pathway?: string
  roleArea?: string
  programInterest?: string
  message?: string
}) {
  const name = String(input.name || '').trim()
  const email = String(input.email || '').trim().toLowerCase()
  const message = String(input.message || '').trim()
  if (name.length < 2) return { ok: false as const, status: 400, body: { success: false, message: 'Please enter your name.' } }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false as const, status: 400, body: { success: false, message: 'Please enter a valid email address.' } }

  const createdAt = new Date().toISOString()
  const enquiry: LeadEnquiry = {
    id: `enq-${Date.now()}`,
    name,
    email,
    phone: String(input.phone || '').trim() || undefined,
    type: String(input.type || 'join').trim() || 'join',
    pathway: String(input.pathway || '').trim() || undefined,
    roleArea: String(input.roleArea || '').trim() || undefined,
    programInterest: String(input.programInterest || '').trim() || undefined,
    message: message || [input.pathway, input.roleArea, input.programInterest].filter(Boolean).join(' · ') || 'No message provided.',
    status: 'new',
    createdAt,
    adminMail: 'queued',
  }
  const alert = enquiryEmail(enquiry)
  const mail = await deliverMail(mailSettings().admin, alert.subject, alert.text, alert.html)
  enquiry.adminMail = mail.status

  const data = readLeads()
  data.enquiries = data.enquiries || []
  data.enquiries.unshift(enquiry)
  data.notifications.unshift({
    id: `note-${Date.now()}`,
    type: 'enquiry',
    title: `${name} sent a ${enquiry.type} form`,
    body: `${email}${enquiry.roleArea ? ` · ${enquiry.roleArea}` : ''}`,
    href: '/enquiries',
    createdAt,
    read: false,
  })
  data.mails.unshift({
    id: `mail-${Date.now()}-enq`,
    to: mailSettings().admin,
    subject: alert.subject,
    text: alert.text,
    createdAt,
    status: mail.status,
    error: mail.error,
  })
  data.notifications = data.notifications.slice(0, 50)
  data.mails = data.mails.slice(0, 100)
  data.enquiries = data.enquiries.slice(0, 200)
  writeLeads(data)

  return {
    ok: true as const,
    status: 201,
    body: {
      success: true,
      mailed: mail.status === 'sent',
      message: 'Thank you. Our team will be in touch shortly.',
    },
  }
}

async function removeSubscriber(input: { id?: string; email?: string }) {
  const data = readLeads()
  const id = String(input.id || '').trim()
  const email = String(input.email || '').trim().toLowerCase()
  const index = data.subscribers.findIndex((row) => (id && row.id === id) || (email && row.email === email))
  if (index < 0) return { ok: false as const, status: 404, body: { success: false, message: 'Subscriber not found.' } }
  const [removed] = data.subscribers.splice(index, 1)
  await deleteFromStrapi(removed)
  writeLeads(data)
  return { ok: true as const, status: 200, body: { success: true } }
}

function attach(server: { middlewares: { use: (fn: (req: { method?: string; url?: string; on: (e: string, cb: (chunk?: unknown) => void) => void }, res: { statusCode: number; setHeader: (k: string, v: string) => void; end: (s?: string) => void }, next: () => void) => void) => void } }) {
  server.middlewares.use((req, res, next) => {
    const url = (req.url || '').split('?')[0]
    if (!url.startsWith('/__leads')) {
      next()
      return
    }

    if (req.method === 'OPTIONS') {
      cors(res)
      res.statusCode = 204
      res.end()
      return
    }

    if (req.method === 'GET' && (url === '/__leads' || url === '/__leads/')) {
      void mergedLeads()
        .then((data) => json(res, 200, data))
        .catch(() => json(res, 200, { ...readLeads(), strapi: { reachable: false } }))
      return
    }

    if (req.method === 'POST' && url === '/__leads/enquiry') {
      void readBody(req).then(async (raw) => {
        try {
          const parsed = JSON.parse(raw || '{}') as Record<string, string>
          const result = await addEnquiry(parsed)
          json(res, result.status, result.body)
        } catch (error) {
          json(res, 400, { success: false, message: error instanceof Error ? error.message : 'Could not send that message.' })
        }
      })
      return
    }

    if (req.method === 'POST' && url === '/__leads/subscribe') {
      void readBody(req).then(async (raw) => {
        try {
          const parsed = JSON.parse(raw || '{}') as { name?: string; email?: string; whatsapp?: string; source?: string }
          const result = await addSubscriber(parsed)
          json(res, result.status, result.body)
        } catch (error) {
          json(res, 400, { success: false, message: error instanceof Error ? error.message : 'Could not subscribe.' })
        }
      })
      return
    }

    if ((req.method === 'DELETE' && (url === '/__leads/subscribers' || url === '/__leads/subscribers/')) || (req.method === 'POST' && url === '/__leads/subscribers/remove')) {
      void readBody(req).then(async (raw) => {
        try {
          const parsed = JSON.parse(raw || '{}') as { id?: string; email?: string }
          const result = await removeSubscriber(parsed)
          json(res, result.status, result.body)
        } catch (error) {
          json(res, 400, { success: false, message: error instanceof Error ? error.message : 'Could not remove subscriber.' })
        }
      })
      return
    }

    if (req.method === 'POST' && url === '/__leads/notifications/read') {
      void readBody(req).then((raw) => {
        try {
          const parsed = JSON.parse(raw || '{}') as { ids?: string[] }
          const data = readLeads()
          const ids = Array.isArray(parsed.ids) ? parsed.ids : null
          data.notifications = data.notifications.map((item) => (
            !ids || ids.includes(item.id) ? { ...item, read: true } : item
          ))
          writeLeads(data)
          json(res, 200, { ok: true })
        } catch (error) {
          json(res, 400, { error: String(error) })
        }
      })
      return
    }

    next()
  })
}

export function leadsPlugin() {
  hydrateEnv()
  return {
    name: 'cogi-leads',
    configureServer(server: { middlewares: { use: (fn: unknown) => void } }) {
      attach(server as Parameters<typeof attach>[0])
    },
    configurePreviewServer(server: { middlewares: { use: (fn: unknown) => void } }) {
      attach(server as Parameters<typeof attach>[0])
    },
  }
}
