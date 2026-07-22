import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { submitContactForm } from '@/api/contact'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, 'Please provide at least 10 characters'),
  type: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export function ContactForm({ defaultType }: { defaultType?: string }) {
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { type: defaultType },
  })

  const onSubmit = async (data: FormData) => {
    setStatus(null)
    try {
      const result = await submitContactForm(data)
      setStatus({ type: 'success', message: result.message })
      reset()
    } catch {
      setStatus({ type: 'error', message: 'Something went wrong. Please try again.' })
    }
  }

  const fieldClass = (hasError: boolean) =>
    cn(
      'w-full rounded-md border px-4 py-3 text-ink focus:outline-none focus:ring-2 focus:ring-gold',
      hasError ? 'border-red-400' : 'border-mist-dark',
    )

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="mb-1 block text-sm font-medium text-ink">
            Name <span className="text-red-500">*</span>
          </label>
          <input id="contact-name" className={fieldClass(!!errors.name)} {...register('name')} />
          {errors.name && <p className="mt-1 text-sm text-red-600" role="alert">{errors.name.message}</p>}
        </div>
        <div>
          <label htmlFor="contact-email" className="mb-1 block text-sm font-medium text-ink">
            Email <span className="text-red-500">*</span>
          </label>
          <input id="contact-email" type="email" className={fieldClass(!!errors.email)} {...register('email')} />
          {errors.email && <p className="mt-1 text-sm text-red-600" role="alert">{errors.email.message}</p>}
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="contact-phone" className="mb-1 block text-sm font-medium text-ink">Phone</label>
          <input id="contact-phone" type="tel" className={fieldClass(false)} {...register('phone')} />
        </div>
        <div>
          <label htmlFor="contact-subject" className="mb-1 block text-sm font-medium text-ink">Subject</label>
          <input id="contact-subject" className={fieldClass(false)} {...register('subject')} />
        </div>
      </div>
      <div>
        <label htmlFor="contact-message" className="mb-1 block text-sm font-medium text-ink">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="contact-message"
          rows={5}
          className={fieldClass(!!errors.message)}
          {...register('message')}
        />
        {errors.message && <p className="mt-1 text-sm text-red-600" role="alert">{errors.message.message}</p>}
      </div>
      {status && (
        <p className={cn('rounded-md p-3 text-sm', status.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800')} role="status">
          {status.message}
        </p>
      )}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Sending…' : 'Send Message'}
      </Button>
    </form>
  )
}
