import { useSiteConfig } from '@/contexts/SiteConfigContext'
import { cn } from '@/lib/utils'

export function ShareButtons({ title, path, className }: { title: string; path: string; className?: string }) {
  const site = useSiteConfig()
  const url = `${(site.seo.siteUrl || 'https://coginternational.org').replace(/\/$/, '')}${path}`
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)
  const links = [
    { label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` },
    { label: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}` },
    { label: 'X', href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}` },
    { label: 'WhatsApp', href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}` },
  ]

  return (
    <div className={cn('flex flex-wrap items-center gap-3', className)}>
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-ink-muted">Share</p>
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-mist-dark px-3 py-1 text-xs font-semibold text-teal-deep hover:border-gold hover:text-gold"
        >
          {link.label}
        </a>
      ))}
    </div>
  )
}
