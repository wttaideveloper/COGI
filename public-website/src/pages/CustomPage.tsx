import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { SEO } from '@/components/ui/SEO'
import { PageHero, SectionHeading } from '@/components/ui/Card'
import { ButtonLink } from '@/components/ui/Button'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { getPageBySlug, type PublicPageSection } from '@/api/pages'

function renderSection(section: PublicPageSection, index: number) {
  switch (section.type) {
    case 'banner':
      return section.imageUrl ? (
        <section key={section.id} className="relative min-h-[45vh] overflow-hidden">
          <img src={section.imageUrl} alt={section.title} className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-teal-deep/50" />
          <div className="relative z-10 mx-auto flex min-h-[45vh] max-w-4xl items-center justify-center px-4 py-20 text-center">
            {section.title ? <h2 className="font-display text-3xl font-bold text-white md:text-4xl">{section.title}</h2> : null}
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
            {section.title ? <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-gold">{section.title}</p> : null}
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
            {section.imageUrl ? <img src={section.imageUrl} alt={section.title} className="aspect-video w-full rounded-xl object-cover shadow-md" /> : null}
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
            {section.imageUrl ? <img src={section.imageUrl} alt={section.title} className="w-full rounded-xl object-cover shadow-md" /> : null}
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

export function CustomPage() {
  const { slug } = useParams()
  const { data: page, isLoading } = useQuery({
    queryKey: ['page', slug],
    queryFn: () => getPageBySlug(slug || ''),
    enabled: Boolean(slug),
  })

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl space-y-8 px-4 py-16">
        <div className="h-10 w-2/3 animate-pulse rounded-md bg-mist-dark" />
        <div className="h-48 animate-pulse rounded-md bg-mist-dark" />
      </div>
    )
  }

  if (!page || !page.sections?.length) return <NotFoundPage />

  return (
    <>
      <SEO title={page.seo?.metaTitle || page.title} description={page.seo?.metaDescription || page.summary} />
      <PageHero title={page.title} subtitle={page.summary} />
      <main>{page.sections.map((section, i) => renderSection(section, i))}</main>
    </>
  )
}
