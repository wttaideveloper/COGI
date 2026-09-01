import { postToStrapi } from '@/services/strapi'
import type { GetInvolvedFormData } from '@/types'

async function notifyInbox(payload: Record<string, unknown>) {
  try {
    const response = await fetch('/__leads/enquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!response.ok) return false
    const body = await response.json().catch(() => ({})) as { success?: boolean }
    return body.success !== false
  } catch {
    return false
  }
}

export async function submitGetInvolved(data: GetInvolvedFormData): Promise<{ success: boolean; message: string }> {
  const message = [
    data.message,
    data.roleArea ? `Role / area: ${data.roleArea}` : '',
    data.programInterest ? `Program: ${data.programInterest}` : '',
  ].filter(Boolean).join('\n')

  const inbox = await notifyInbox({
    name: data.name,
    email: data.email,
    phone: data.phone,
    type: 'join',
    pathway: data.pathway,
    roleArea: data.roleArea,
    programInterest: data.programInterest,
    message,
  })

  const result = await postToStrapi('/contact-enquiries', {
    name: data.name,
    email: data.email,
    phone: data.phone,
    type: 'join',
    pathway: data.pathway,
    message: message || 'Volunteer / Get Involved interest',
    source: data.roleArea || data.pathway,
  })

  if (inbox || result) {
    return { success: true, message: 'Thank you for joining the movement! Our team will be in touch shortly.' }
  }

  return { success: true, message: 'Thank you for your interest. If you do not hear back, email info@coginternational.org.' }
}
