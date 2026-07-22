import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getBlogPosts } from '@/api/blog'
import { SEO } from '@/components/ui/SEO'
import { PageHero, Card, Skeleton } from '@/components/ui/Card'
import { formatDate } from '@/lib/utils'

export function BlogPage() {
  const { data: posts, isLoading } = useQuery({ queryKey: ['blog'], queryFn: getBlogPosts })

  return (
    <>
      <SEO title="Blog" description="Articles from Companions of Grace International" path="/resources/blog" />
      <PageHero title="Blog" subtitle="Insights on missional healthcare, programs, and partnerships" />
      <div className="mx-auto max-w-4xl px-4 py-16">
        {isLoading ? (
          <div className="space-y-6">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-32" />)}</div>
        ) : (
          <div className="space-y-8">
            {posts?.map((post) => (
              <Card key={post.id} as="article">
                <span className="text-xs font-semibold uppercase tracking-wide text-gold">{post.category}</span>
                <h2 className="mt-2 font-display text-2xl text-teal-deep">
                  <Link to={`/resources/blog/${post.slug}`} className="hover:text-gold">{post.title}</Link>
                </h2>
                <p className="mt-1 text-sm text-ink-muted">{formatDate(post.publishedAt)} · {post.author}</p>
                <p className="mt-3 text-ink-muted">{post.summary}</p>
                <Link to={`/resources/blog/${post.slug}`} className="mt-4 inline-block text-sm font-semibold text-teal-mid hover:text-gold">Read article →</Link>
              </Card>
            ))}
          </div>
        )}
        <p className="mt-12 text-center text-sm text-ink-muted">~50 articles from the legacy site are planned for migration.</p>
      </div>
    </>
  )
}
