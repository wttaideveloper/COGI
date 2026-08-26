import type { NewsletterFormData } from '@/types'

type SubscribeResponse = { success: boolean; message: string }

export async function submitNewsletter(data: NewsletterFormData): Promise<SubscribeResponse> {
  try {
    const response = await fetch('/__leads/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        whatsapp: data.whatsapp,
        source: typeof window !== 'undefined' ? window.location.pathname : 'website',
      }),
    })
    const body = (await response.json()) as SubscribeResponse
    if (body?.message) return body
    return { success: false, message: 'We could not complete your subscription. Please try again in a moment.' }
  } catch {
    return { success: false, message: 'We could not complete your subscription. Please try again in a moment.' }
  }
}
