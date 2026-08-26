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

export type LeadNotification = {
  id: string
  type: 'newsletter'
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
  strapi?: { reachable: boolean }
}

const EMPTY: LeadsState = { subscribers: [], notifications: [], mails: [], strapi: { reachable: false } }

export async function fetchLeads(): Promise<LeadsState> {
  try {
    const response = await fetch('/__leads', { cache: 'no-store' })
    if (!response.ok) return EMPTY
    const data = (await response.json()) as Partial<LeadsState>
    return {
      subscribers: Array.isArray(data.subscribers) ? data.subscribers : [],
      notifications: Array.isArray(data.notifications) ? data.notifications : [],
      mails: Array.isArray(data.mails) ? data.mails : [],
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

export async function removeSubscriber(id: string): Promise<boolean> {
  const response = await fetch('/__leads/subscribers/remove', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  })
  return response.ok
}
