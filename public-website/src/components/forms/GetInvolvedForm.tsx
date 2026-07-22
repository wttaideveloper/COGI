import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { submitGetInvolved } from '@/api/getInvolved'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email required'),
  phone: z.string().optional(),
  pathway: z.enum(['pray', 'participate', 'partner']),
  programInterest: z.string().optional(),
  message: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export function GetInvolvedForm({ defaultPathway }: { defaultPathway?: FormData['pathway'] }) {
  const [status, setStatus] = useState<string | null>(null)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { pathway: defaultPathway ?? 'participate' },
  })

  const onSubmit = async (data: FormData) => {
    setStatus(null)
    const result = await submitGetInvolved(data)
    setStatus(result.message)
    if (result.success) reset({ pathway: data.pathway })
  }

  const fieldClass = (hasError: boolean) =>
    cn(
      'w-full rounded-md border px-4 py-3 text-ink focus:outline-none focus:ring-2 focus:ring-gold',
      hasError ? 'border-red-400' : 'border-mist-dark',
    )

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <fieldset>
        <legend className="mb-3 text-sm font-medium text-ink">How would you like to engage? <span className="text-red-500">*</span></legend>
        <div className="flex flex-wrap gap-4">
          {(['pray', 'participate', 'partner'] as const).map((value) => (
            <label key={value} className="flex items-center gap-2 cursor-pointer">
              <input type="radio" value={value} {...register('pathway')} className="accent-teal-deep" />
              <span className="capitalize text-sm">{value}</span>
            </label>
          ))}
        </div>
        {errors.pathway && <p className="mt-1 text-sm text-red-600" role="alert">{errors.pathway.message}</p>}
      </fieldset>

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
          <label htmlFor="gi-phone" className="mb-1 block text-sm font-medium text-ink">Phone</label>
          <input id="gi-phone" type="tel" className={fieldClass(false)} {...register('phone')} />
        </div>
        <div>
          <label htmlFor="gi-program" className="mb-1 block text-sm font-medium text-ink">Program Interest</label>
          <select id="gi-program" className={fieldClass(false)} {...register('programInterest')}>
            <option value="">Select a program</option>
            <option value="kingdom-of-god">Kingdom of God</option>
            <option value="missional-training">Missional Training</option>
            <option value="care-for-the-caregiver">Care for the Caregiver</option>
            <option value="missional-church-healthcare">Missional Church & Healthcare</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="gi-message" className="mb-1 block text-sm font-medium text-ink">Message</label>
        <textarea id="gi-message" rows={4} className={fieldClass(false)} {...register('message')} />
      </div>

      {status && <p className="rounded-md bg-green-50 p-3 text-sm text-green-800" role="status">{status}</p>}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting…' : 'Join the Movement'}
      </Button>
    </form>
  )
}
