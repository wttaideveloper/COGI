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
    const text = await response.text()
    let body: SubscribeResponse | null = null
    try {
      body = text ? JSON.parse(text) as SubscribeResponse : null
    } catch {
      body = null
    }
    if (body?.success || body?.message) {
      return {
        success: body.success !== false && response.ok,
        message: body.message || (response.ok ? 'Thank you for subscribing.' : 'We could not complete your subscription. Please try again in a moment.'),
      }
    }
    if (!response.ok) {
      return { success: false, message: 'Newsletter signup is not available right now. Please email info@coginternational.org.' }
    }
    return { success: true, message: 'Thank you for subscribing.' }
  } catch {
    return { success: false, message: 'We could not complete your subscription. Please try again in a moment.' }
  }
}
