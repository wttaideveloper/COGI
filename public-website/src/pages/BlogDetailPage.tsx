import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getBlogPostBySlug } from '@/api/blog'
import { SEO } from '@/components/ui/SEO'
import { PageHero, Skeleton, ErrorState } from '@/components/ui/Card'
import { formatDate } from '@/lib/utils'
import { ShareButtons } from '@/components/ui/ShareButtons'

export function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: post, isLoading, isError } = useQuery({
    queryKey: ['blog', slug],
    queryFn: () => getBlogPostBySlug(slug!),
    enabled: !!slug,
  })

  if (isLoading) return <div className="mx-auto max-w-3xl px-4 py-16"><Skeleton className="h-96" /></div>
  if (isError || !post) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <ErrorState message="Article not found." />
        <Link to="/resources/blog" className="mt-4 inline-block text-teal-deep">← Back to Blog</Link>
      </div>
    )
  }

  return (
    <>
      <SEO title={post.title} description={post.summary} path={`/resources/blog/${post.slug}`} />
      <PageHero title={post.title} subtitle={`${formatDate(post.publishedAt)} · ${post.author}`} imageUrl={post.imageUrl} />
      <article className="mx-auto max-w-3xl px-4 py-16 prose prose-teal">
        <div className="leading-relaxed text-ink [&_p]:mb-4 [&_strong]:text-teal-deep" dangerouslySetInnerHTML={{ __html: post.content }} />
        <ShareButtons title={post.title} path={`/resources/blog/${post.slug}`} className="mt-10" />
        <Link to="/resources/blog" className="mt-8 inline-block text-teal-deep hover:text-accent-ink">← Back to Blog</Link>
      </article>
    </>
  )
}
