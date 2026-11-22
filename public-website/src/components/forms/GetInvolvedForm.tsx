import { useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { submitGetInvolved } from '@/api/getInvolved'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

const ROLE_AREAS = ['Medical', 'Dental', 'Nursing', 'Logistics', 'Administration', 'Prayer support', 'Other'] as const

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().optional(),
  profession: z.string().min(2, 'Profession or course is required'),
  organization: z.string().optional(),
  country: z.string().min(2, 'Country is required'),
  preferredContact: z.enum(['email', 'whatsapp']),
  pathway: z.enum(['pray', 'participate', 'partner']),
  roleArea: z.string().optional(),
  programInterest: z.string().optional(),
  message: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.preferredContact === 'whatsapp' && !data.phone?.trim()) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Enter a WhatsApp number for WhatsApp replies', path: ['phone'] })
  }
  if (data.pathway !== 'pray' && !data.roleArea) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Select a role / area', path: ['roleArea'] })
  }
})

type FormData = z.infer<typeof schema>

export function GetInvolvedForm({ defaultPathway, submitLabel = 'Join the Movement' }: { defaultPathway?: FormData['pathway']; submitLabel?: string }) {
  const [params] = useSearchParams()
  const [status, setStatus] = useState<{ ok: boolean; text: string } | null>(null)
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { pathway: defaultPathway ?? 'participate', preferredContact: 'email', programInterest: params.get('program') || '' },
  })
  const pathway = watch('pathway')

  const onSubmit = async (data: FormData) => {
    setStatus(null)
    const result = await submitGetInvolved(data)
    setStatus({ ok: result.success, text: result.message })
    if (result.success) reset({ pathway: data.pathway, preferredContact: 'email' })
  }

  const fieldClass = (hasError: boolean) =>
    cn(
      'w-full rounded-md border px-4 py-3 text-ink focus:outline-none focus:ring-2 focus:ring-gold',
      hasError ? 'border-red-400' : 'border-mist-dark',
    )

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div>
        <label htmlFor="gi-pathway" className="mb-2 block text-sm font-medium">How would you like to engage?</label>
        <select id="gi-pathway" {...register('pathway')} className={fieldClass(!!errors.pathway)}>
          <option value="pray">Pray with our global community</option>
          <option value="participate">Participate in programs or volunteer</option>
          <option value="partner">Partner as a church or organization</option>
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="gi-name" className="mb-1 block text-sm font-medium text-ink">Name <span className="text-red-500">*</span></label>
          <input id="gi-name" className={fieldClass(!!errors.name)} {...register('name')} />
          {errors.name && <p className="mt-1 text-sm text-red-600" role="alert">{errors.name.message}</p>}
        </div>
        <div>
          <label htmlFor="gi-email" className="mb-1 block text-sm font-medium text-ink">Email <span className="text-red-500">*</span></label>
          <input id="gi-email" type="email" className={fieldClass(!!errors.email)} {...register('email')} />
          {errors.email && <p className="mt-1 text-sm text-red-600" role="alert">{errors.email.message}</p>}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="gi-phone" className="mb-1 block text-sm font-medium text-ink">WhatsApp number (optional)</label>
          <input id="gi-phone" type="tel" className={fieldClass(!!errors.phone)} {...register('phone')} />
          {errors.phone && <p role="alert" className="text-sm text-red-600">{errors.phone.message}</p>}
        </div>
        <div>
          <label htmlFor="gi-role" className="mb-1 block text-sm font-medium text-ink">Role / area preference {pathway !== 'pray' ? <span className="text-red-500">*</span> : null}</label>
          <select id="gi-role" className={fieldClass(!!errors.roleArea)} {...register('roleArea')}>
            <option value="">{pathway === 'pray' ? 'Prayer support (optional)' : 'Select an area'}</option>
            {ROLE_AREAS.map((role) => <option key={role} value={role}>{role}</option>)}
          </select>
          {errors.roleArea && <p className="mt-1 text-sm text-red-600" role="alert">{errors.roleArea.message}</p>}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div><label htmlFor="gi-profession" className="mb-1 block text-sm font-medium">Profession / course *</label><input id="gi-profession" {...register('profession')} className={fieldClass(!!errors.profession)} />{errors.profession && <p role="alert" className="text-sm text-red-600">{errors.profession.message}</p>}</div>
        <div><label htmlFor="gi-country" className="mb-1 block text-sm font-medium">Country *</label><input id="gi-country" {...register('country')} className={fieldClass(!!errors.country)} />{errors.country && <p role="alert" className="text-sm text-red-600">{errors.country.message}</p>}</div>
        <div><label htmlFor="gi-organization" className="mb-1 block text-sm font-medium">Organization / church (optional)</label><input id="gi-organization" {...register('organization')} className={fieldClass(false)} /></div>
        <div><label htmlFor="gi-contact" className="mb-1 block text-sm font-medium">Preferred means of communication</label><select id="gi-contact" {...register('preferredContact')} className={fieldClass(false)}><option value="email">Email</option><option value="whatsapp">WhatsApp</option></select></div>
      </div>
      <div>
        <label htmlFor="gi-program" className="mb-1 block text-sm font-medium text-ink">Program interest</label>
        <select id="gi-program" className={fieldClass(false)} {...register('programInterest')}>
          <option value="">Select a program</option>
          <option value="kingdom-of-god">Kingdom of God</option>
          <option value="missional-training">Missional Training</option>
          <option value="care-for-the-caregiver">Care for the Caregiver</option>
          <option value="missional-church-healthcare">Missional Church & Healthcare</option>
        </select>
      </div>

      <div>
        <label htmlFor="gi-message" className="mb-1 block text-sm font-medium text-ink">Message</label>
        <textarea id="gi-message" rows={4} className={fieldClass(false)} {...register('message')} />
      </div>

      {status && (
        <p className={`rounded-md p-3 text-sm ${status.ok ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`} role="status">
          {status.text}
        </p>
      )}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting…' : submitLabel}
      </Button>
    </form>
  )
}
