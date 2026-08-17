import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  as?: 'div' | 'article'
}

export function Card({ children, className, as: Tag = 'div' }: CardProps) {
  return (
    <Tag className={cn('rounded-xl border border-mist-dark bg-white/80 p-6 shadow-sm backdrop-blur-sm', className)}>
      {children}
    </Tag>
  )
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse rounded-md bg-mist-dark', className)} aria-hidden="true" />
}

export function SkeletonCard() {
  return (
    <Card>
      <Skeleton className="mb-4 h-6 w-2/3" />
      <Skeleton className="mb-2 h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
    </Card>
  )
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center" role="alert">
      <p className="mb-4 text-ink-muted">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-md bg-teal-deep px-4 py-2 text-sm font-semibold text-white hover:bg-teal-mid"
        >
          Try again
        </button>
      )}
    </div>
  )
}

export function SectionHeading({
  title,
  subtitle,
  align = 'center',
  className,
}: {
  title: string
  subtitle?: string
  align?: 'left' | 'center'
  className?: string
}) {
  return (
    <div className={cn(align === 'center' && 'text-center', 'mb-12', className)}>
      <h2 className="font-display text-3xl font-semibold text-teal-deep md:text-4xl">{title}</h2>
      {subtitle && <p className="mx-auto mt-4 max-w-3xl text-lg text-ink-muted">{subtitle}</p>}
    </div>
  )
}

export function PageHero({ title, subtitle, imageUrl }: { title: string; subtitle?: string; imageUrl?: string }) {
  if (imageUrl) {
    return (
      <section className="relative min-h-[42vh] overflow-hidden md:min-h-[52vh]">
        <img src={imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-teal-deep/70" />
        <div className="relative z-10 mx-auto flex min-h-[42vh] max-w-4xl flex-col items-center justify-center px-4 py-16 text-center text-white md:min-h-[52vh] md:py-24">
          <h1 className="font-display text-4xl font-bold md:text-5xl">{title}</h1>
          {subtitle && <p className="mt-4 text-lg text-white/90">{subtitle}</p>}
        </div>
      </section>
    )
  }
  return (
    <section className="bg-teal-gradient py-16 text-white md:py-24">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <h1 className="font-display text-4xl font-bold md:text-5xl">{title}</h1>
        {subtitle && <p className="mt-4 text-lg text-white/90">{subtitle}</p>}
      </div>
    </section>
  )
}
