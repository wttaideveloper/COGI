import { postToStrapi } from '@/services/strapi'
import type { NewsletterFormData } from '@/types'

export async function submitNewsletter(data: NewsletterFormData): Promise<{ success: boolean; message: string }> {
  const result = await postToStrapi('/newsletter-subscribers', {
    ...data,
    source: 'website',
    consent: true,
    subscribedAt: new Date().toISOString(),
  })

  if (result) {
    return { success: true, message: 'Welcome to the COGI community! Check your inbox for a confirmation.' }
  }

  await new Promise((r) => setTimeout(r, 600))
  console.info('[Demo] Newsletter signup:', data)
  return { success: true, message: 'Thank you for subscribing! (Demo mode — Strapi unavailable)' }
}
