import { postToStrapi } from '@/services/strapi'
import type { ContactFormData } from '@/types'

export async function submitContactForm(data: ContactFormData): Promise<{ success: boolean; message: string }> {
  const result = await postToStrapi('/contact-enquiries', {
    ...data,
    submittedAt: new Date().toISOString(),
  })

  if (result) {
    return { success: true, message: 'Thank you! Your message has been sent. We will respond soon.' }
  }

  // Demo/offline mode — simulate success
  await new Promise((r) => setTimeout(r, 800))
  console.info('[Demo] Contact form submitted:', data)
  return { success: true, message: 'Thank you! Your message has been received. (Demo mode — Strapi unavailable)' }
}
