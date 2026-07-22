import { useLocation } from 'react-router-dom'
import { getLegalPage } from '@/api/search'
import { SEO } from '@/components/ui/SEO'
import { PageHero, ErrorState } from '@/components/ui/Card'

export function LegalPage() {
  const { pathname } = useLocation()
  const slug = pathname.replace(/^\//, '')
  const page = getLegalPage(slug)

  if (!page) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <ErrorState message="Page not found." />
      </div>
    )
  }

  return (
    <>
      <SEO title={page.title} path={`/${page.slug}`} />
      <PageHero title={page.title} subtitle={`Last updated ${page.lastUpdated}`} />
      <article
        className="mx-auto max-w-3xl px-4 py-16 leading-relaxed text-ink [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-xl [&_h2]:text-teal-deep [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-inside [&_ul]:list-disc"
        dangerouslySetInnerHTML={{ __html: page.content }}
      />
    </>
  )
}
