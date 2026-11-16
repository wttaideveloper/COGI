import { MediaPreview } from '@/components/ui/MediaPreview'
import { Link, useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { SEO } from '@/components/ui/SEO'
import { PageHero, SectionHeading } from '@/components/ui/Card'
import { ButtonLink } from '@/components/ui/Button'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { getPageBySlug, type PublicPage, type PublicPageSection } from '@/api/pages'
import { useSiteConfig } from '@/contexts/SiteConfigContext'

function parseSections(value: unknown): PublicPageSection[] {
  if (Array.isArray(value)) return value as PublicPageSection[]
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value) as unknown
      return Array.isArray(parsed) ? (parsed as PublicPageSection[]) : []
    } catch {
      return []
    }
  }
  if (value && typeof value === 'object' && Array.isArray((value as { value?: unknown }).value)) {
    return (value as { value: PublicPageSection[] }).value
  }
  return []
}

function renderSection(section: PublicPageSection, index: number) {
  switch (section.type) {
    case 'banner':
      return section.imageUrl ? (
        <section key={section.id} className="relative min-h-[45vh] overflow-hidden bg-white">
          <img src={section.imageUrl} alt={section.title} className="absolute inset-0 h-full w-full object-cover opacity-20" />
          <div className="relative z-10 mx-auto flex min-h-[45vh] max-w-4xl items-center justify-center px-4 py-20 text-center">
            {section.title ? <h2 className="font-display text-3xl font-bold text-teal-deep md:text-4xl">{section.title}</h2> : null}
          </div>
        </section>
      ) : null
    case 'heading':
      return (
        <section key={section.id} className="py-16">
          <div className="mx-auto max-w-4xl px-4">
            <SectionHeading title={section.title} subtitle={section.content || undefined} align="left" />
          </div>
        </section>
      )
    case 'quote':
      return (
        <section key={section.id} className="bg-mist-gradient py-16">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <blockquote className="font-display text-2xl italic leading-relaxed text-teal-deep md:text-3xl">
              {section.content}
            </blockquote>
            {section.title ? <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-accent-ink">{section.title}</p> : null}
          </div>
        </section>
      )
    case 'split':
      return (
        <section key={section.id} className="py-16">
          <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 md:grid-cols-2">
            <div>
              <h2 className="font-display text-2xl font-semibold text-teal-deep md:text-3xl">{section.title}</h2>
              <p className="mt-4 whitespace-pre-line text-lg leading-relaxed text-ink-muted">{section.content}</p>
            </div>
            {section.imageUrl ? <MediaPreview src={section.imageUrl} alt={section.title} className="aspect-video w-full rounded-xl object-cover shadow-md" /> : null}
          </div>
        </section>
      )
    case 'columns': {
      const [left, right] = (section.content || '').split(/['|']+/).map((s) => s.trim()).filter(Boolean)
      return (
        <section key={section.id} className="bg-mist-gradient py-16">
          <div className="mx-auto max-w-6xl px-4">
            <SectionHeading title={section.title} />
            <div className="grid gap-8 md:grid-cols-2">
              <div className="whitespace-pre-line rounded-xl border border-mist-dark bg-white/80 p-6 shadow-sm">{left || section.content}</div>
              {right ? <div className="whitespace-pre-line rounded-xl border border-mist-dark bg-white/80 p-6 shadow-sm">{right}</div> : null}
            </div>
          </div>
        </section>
      )
    }
    case 'cta':
      return (
        <section key={section.id} className="py-16">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <h2 className="font-display text-3xl text-teal-deep">{section.title}</h2>
            {section.content ? <p className="mt-4 text-lg text-ink-muted">{section.content}</p> : null}
            {section.buttonHref ? (
              <ButtonLink to={section.buttonHref} size="lg" className="mt-8">
                {section.buttonLabel || 'Learn More'}
              </ButtonLink>
            ) : null}
          </div>
        </section>
      )
    case 'image':
      return (
        <section key={section.id} className="py-16">
          <div className="mx-auto max-w-4xl px-4">
            {section.imageUrl ? <MediaPreview src={section.imageUrl} alt={section.title} className="w-full rounded-xl object-cover shadow-md" /> : null}
            {section.title ? <h2 className="mt-6 font-display text-2xl text-teal-deep">{section.title}</h2> : null}
            {section.content ? <p className="mt-2 text-ink-muted">{section.content}</p> : null}
          </div>
        </section>
      )
    case 'text':
    default:
      return (
        <section key={section.id} className={index === 0 ? 'py-16' : 'pb-16'}>
          <div className="mx-auto max-w-4xl px-4">
            {section.title ? <h2 className="font-display text-2xl font-semibold text-teal-deep md:text-3xl">{section.title}</h2> : null}
            <p className="mt-4 whitespace-pre-line text-lg leading-relaxed text-ink-muted">{section.content}</p>
          </div>
        </section>
      )
  }
}

function normalizeSlug(value?: string) {
  return String(value || '').replace(/^\/+/, '').replace(/\/+$/, '')
}

export function CustomPage() {
  const { pathname } = useLocation()
  const slug = normalizeSlug(pathname)
  const { customPages } = useSiteConfig()
  const { data: remote, isLoading } = useQuery({
    queryKey: ['page', slug],
    queryFn: () => getPageBySlug(slug || ''),
    enabled: Boolean(slug),
  })

  const fromConfig = (customPages || []).find((page) => normalizeSlug(page.slug) === slug && page.status === 'published')
  const page: PublicPage | null = remote || (fromConfig ? {
    id: fromConfig.id,
    title: fromConfig.title,
    slug: fromConfig.slug,
    status: fromConfig.status || 'published',
    summary: fromConfig.summary,
    heroImageUrl: fromConfig.heroImageUrl,
    externalUrl: fromConfig.externalUrl,
    seo: fromConfig.seo,
    sections: parseSections(fromConfig.sections),
  } : null)

  if (isLoading && !fromConfig) {
    return (
      <div className="mx-auto max-w-4xl space-y-8 px-4 py-16">
        <div className="h-10 w-2/3 animate-pulse rounded-md bg-mist-dark" />
        <div className="h-48 animate-pulse rounded-md bg-mist-dark" />
      </div>
    )
  }

  if (!page) {
    return (
      <NotFoundPage />
    )
  }

  const sections = parseSections(page.sections)

  return (
    <>
      <SEO title={page.seo?.metaTitle || page.title} description={page.seo?.metaDescription || page.summary} />
      <PageHero title={page.title || 'Page'} subtitle={page.summary} imageUrl={page.heroImageUrl} />
      <main>
        {sections.map((section, i) => renderSection(section, i))}
        {!sections.length ? (
          <div className="mx-auto max-w-4xl px-4 py-16">
            {page.summary ? <p className="text-lg leading-relaxed text-ink-muted">{page.summary}</p> : (
              <p className="text-ink-muted">This page is published. Add sections in Admin → Create page to show more content here.</p>
            )}
            <Link to="/" className="mt-8 inline-block text-teal-deep hover:text-accent-ink">← Back home</Link>
          </div>
        ) : null}
      </main>
    </>
  )
}
