import { MediaPreview } from '@/components/ui/MediaPreview'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getBlogPosts } from '@/api/blog'
import { SEO } from '@/components/ui/SEO'
import { PageHero, Card, Skeleton } from '@/components/ui/Card'
import { formatDate } from '@/lib/utils'
import { useSiteConfig } from '@/contexts/SiteConfigContext'

export function BlogPage() {
  const { data: posts, isLoading } = useQuery({ queryKey: ['blog'], queryFn: getBlogPosts })
  const { copy } = useSiteConfig()
  const page = copy.blog
  const [category, setCategory] = useState('')
  const categories = [...new Set((posts || []).map((post) => post.category).filter(Boolean))]
  const visible = posts?.filter((post) => !category || post.category === category)

  return (
    <>
      <SEO title={page.heroTitle} description={page.heroSubtitle} path="/resources/blog" />
      <PageHero title={page.heroTitle} subtitle={page.heroSubtitle} imageUrl={page.imageUrl} />
      <div className="mx-auto max-w-4xl px-4 py-16">
        {categories.length ? (
          <label className="mb-8 flex items-center gap-2 text-sm">
            Category:
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-md border border-mist-dark px-3 py-2">
              <option value="">All</option>
              {categories.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
        ) : null}
        {isLoading ? (
          <div className="space-y-6">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-32" />)}</div>
        ) : (
          <div className="space-y-8">
            {visible?.map((post) => (
              <Card key={post.id} as="article" className="overflow-hidden !p-0">
                {post.imageUrl ? <MediaPreview src={post.imageUrl} alt={post.imageAlt || ''} className="h-56 w-full object-cover" /> : null}
                <div className="p-6">
                <span className="text-xs font-semibold uppercase tracking-wide text-gold">{post.category}</span>
                <h2 className="mt-2 font-display text-2xl text-teal-deep">
                  <Link to={`/resources/blog/${post.slug}`} className="hover:text-gold">{post.title}</Link>
                </h2>
                <p className="mt-1 text-sm text-ink-muted">{formatDate(post.publishedAt)} · {post.author}</p>
                <p className="mt-3 text-ink-muted">{post.summary}</p>
                <Link to={`/resources/blog/${post.slug}`} className="mt-4 inline-block text-sm font-semibold text-teal-mid hover:text-gold">Read article →</Link>
                </div>
              </Card>
            ))}
          </div>
        )}
        {page.migrationNote ? (
          <p className="mt-12 text-center text-sm text-ink-muted">{page.migrationNote}</p>
        ) : null}
      </div>
    </>
  )
}
