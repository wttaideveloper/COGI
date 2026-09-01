export type LeadSubscriber = {
  id: string
  documentId?: string
  name: string
  email: string
  whatsapp?: string
  source: string
  consent: boolean
  createdAt: string
  subscriberMail?: 'sent' | 'queued' | 'failed'
  adminMail?: 'sent' | 'queued' | 'failed'
  mailError?: string
  strapiSaved?: boolean
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

export type LeadsState = {
  subscribers: LeadSubscriber[]
  notifications: LeadNotification[]
  mails: Array<{ id: string; to: string; subject: string; status: string; createdAt: string; error?: string }>
  enquiries: LeadEnquiry[]
  strapi?: { reachable: boolean }
}

const EMPTY: LeadsState = { subscribers: [], notifications: [], mails: [], enquiries: [], strapi: { reachable: false } }

export async function fetchLeads(): Promise<LeadsState> {
  try {
    const response = await fetch('/__leads', { cache: 'no-store' })
    if (!response.ok) return EMPTY
    const data = (await response.json()) as Partial<LeadsState>
    return {
      subscribers: Array.isArray(data.subscribers) ? data.subscribers : [],
      notifications: Array.isArray(data.notifications) ? data.notifications : [],
      mails: Array.isArray(data.mails) ? data.mails : [],
      enquiries: Array.isArray(data.enquiries) ? data.enquiries : [],
      strapi: data.strapi ?? { reachable: false },
    }
  } catch {
    return EMPTY
  }
}

export async function markNotificationsRead(ids?: string[]): Promise<void> {
  await fetch('/__leads/notifications/read', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ids ? { ids } : {}),
  })
}

export async function addSubscriber(input: { name: string; email: string; whatsapp?: string }): Promise<{ ok: boolean; message: string }> {
  try {
    const response = await fetch('/__leads/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...input, source: 'admin' }),
    })
    const text = await response.text()
    let body: { success?: boolean; message?: string } = {}
    try {
      body = text ? JSON.parse(text) as { success?: boolean; message?: string } : {}
    } catch {
      body = {}
    }
    if (body.success || response.ok) {
      return { ok: true, message: body.message || 'Subscriber added.' }
    }
    return { ok: false, message: body.message || 'Could not add that subscriber.' }
  } catch {
    return { ok: false, message: 'Could not add that subscriber. Try again in a moment.' }
  }
}

export async function removeSubscriber(id: string): Promise<boolean> {
  const response = await fetch('/__leads/subscribers/remove', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  })
  return response.ok
}
