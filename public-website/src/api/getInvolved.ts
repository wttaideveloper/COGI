import { postToStrapi } from '@/services/strapi'
import type { GetInvolvedFormData } from '@/types'

export async function submitGetInvolved(data: GetInvolvedFormData): Promise<{ success: boolean; message: string }> {
  const result = await postToStrapi('/contact-enquiries', {
    name: data.name,
    email: data.email,
    phone: data.phone,
    type: `get-involved-${data.pathway}`,
    message: data.message ?? '',
    programInterest: data.programInterest,
    submittedAt: new Date().toISOString(),
  })

  if (result) {
    return { success: true, message: 'Thank you for joining the movement! Our team will be in touch shortly.' }
  }

  await new Promise((r) => setTimeout(r, 800))
  console.info('[Demo] Get involved form:', data)
  return { success: true, message: 'Thank you for your interest! (Demo mode — Strapi unavailable)' }
}
