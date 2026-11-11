import { MediaPreview } from '@/components/ui/MediaPreview'
import { cn } from '@/lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  as?: 'div' | 'article'
}

export function Card({ children, className, as: Tag = 'div' }: CardProps) {
  return (
    <Tag className={cn('site-depth-card rounded-xl border border-mist-dark bg-white/80 shadow-sm backdrop-blur-sm', className?.includes('p-0') || className?.includes('!p-0') ? '' : 'p-6', className)}>
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
  return (
    <section className="page-intro border-b border-mist-dark bg-white py-16 text-teal-deep md:py-20">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <h1 id="page-heading" className="font-display text-4xl font-bold md:text-5xl">{title}</h1>
        {subtitle && <p className="mt-4 text-lg text-ink-muted">{subtitle}</p>}
        {imageUrl ? (
          <MediaPreview src={imageUrl} alt={title} className="mt-10 h-52 w-full rounded-xl object-cover md:h-64" />
        ) : null}
      </div>
    </section>
  )
}
