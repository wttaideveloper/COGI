import { postToStrapi } from '@/services/strapi'
import type { ContactFormData } from '@/types'

export async function submitContactForm(data: ContactFormData): Promise<{ success: boolean; message: string }> {
  try {
    await fetch('/__leads/enquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        phone: data.phone,
        type: data.type || 'contact',
        message: [data.subject, data.message].filter(Boolean).join('\n\n'),
      }),
    })
  } catch {
    // Inbox email is best-effort; Strapi remains the CMS record.
  }

  const result = await postToStrapi('/contact-enquiries', {
    name: data.name,
    email: data.email,
    phone: data.phone,
    type: 'contact',
    message: data.message || data.subject || 'Contact form',
    source: data.subject,
  })

  if (result) {
    return { success: true, message: 'Thank you! Your message has been sent. We will respond soon.' }
  }

  return { success: true, message: 'Thank you! Your message has been received.' }
}
