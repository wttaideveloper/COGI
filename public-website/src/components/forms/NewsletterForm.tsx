import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { submitNewsletter } from '@/api/newsletter'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  whatsapp: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    setStatus(null)
    const result = await submitNewsletter(data)
    setStatus({ ok: result.success, text: result.message })
    if (result.success) reset()
  }

  const inputClass = (hasError: boolean) =>
    cn(
      'w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold',
      compact ? 'bg-white/10 border-white/20 text-white placeholder:text-white/50' : 'border-mist-dark text-ink',
      hasError && 'border-red-400',
    )

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3" noValidate>
      <div>
        <label htmlFor="newsletter-name" className={cn('mb-1 block text-sm font-medium', compact ? 'text-white/90' : 'text-teal-deep')}>
          Name
        </label>
        <input id="newsletter-name" className={inputClass(!!errors.name)} {...register('name')} autoComplete="name" />
        {errors.name && <p className="mt-1 text-xs text-red-600" role="alert">{errors.name.message}</p>}
      </div>
      <div>
        <label htmlFor="newsletter-email" className={cn('mb-1 block text-sm font-medium', compact ? 'text-white/90' : 'text-teal-deep')}>
          Email
        </label>
        <input id="newsletter-email" type="email" className={inputClass(!!errors.email)} {...register('email')} autoComplete="email" />
        {errors.email && <p className="mt-1 text-xs text-red-600" role="alert">{errors.email.message}</p>}
      </div>
      <div>
        <label htmlFor="newsletter-whatsapp" className={cn('mb-1 block text-sm font-medium', compact ? 'text-white/90' : 'text-teal-deep')}>
          WhatsApp (optional)
        </label>
        <input id="newsletter-whatsapp" type="tel" className={inputClass(false)} {...register('whatsapp')} autoComplete="tel" />
      </div>
      {status ? (
        <p className={cn('text-sm font-semibold', status.ok ? 'text-emerald-700' : 'text-red-700')} role="status">
          {status.text}
        </p>
      ) : null}
      <Button type="submit" variant={compact ? 'primary' : 'secondary'} size="sm" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Subscribing…' : 'Subscribe'}
      </Button>
    </form>
  )
}
