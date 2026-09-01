import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getStoryBySlug } from '@/api/stories'
import { SEO } from '@/components/ui/SEO'
import { PageHero, Card, ErrorState, Skeleton } from '@/components/ui/Card'
import { VideoPlayer } from '@/components/ui/VideoPlayer'
import { ShareButtons } from '@/components/ui/ShareButtons'

export function StoryDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: story, isLoading, isError } = useQuery({
    queryKey: ['story', slug],
    queryFn: () => getStoryBySlug(slug!),
    enabled: Boolean(slug),
  })

  if (isLoading) return <div className="mx-auto max-w-3xl px-4 py-16"><Skeleton className="h-64" /></div>
  if (isError || !story) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <ErrorState message="Story not found." />
        <Link to="/resources/stories" className="mt-4 inline-block text-teal-deep">← Back to stories</Link>
      </div>
    )
  }

  return (
    <>
      <SEO title={story.title} description={story.summary} path={`/resources/stories/${story.slug}`} />
      <PageHero title={story.title} subtitle={`${story.country} · ${story.program}`} imageUrl={story.imageUrl} />
      <div className="mx-auto max-w-3xl px-4 py-16">
        <Link to="/resources/stories" className="mb-8 inline-block text-sm font-semibold text-teal-deep hover:text-gold">← Back to stories</Link>
        {story.type === 'video' && story.videoUrl ? (
          <VideoPlayer src={story.videoUrl} poster={story.imageUrl} title={story.title} className="relative mb-8 aspect-video w-full overflow-hidden bg-black" />
        ) : story.imageUrl ? (
          <img src={story.imageUrl} alt="" className="mb-8 h-72 w-full rounded-xl object-cover" />
        ) : null}
        <Card>
          {story.summary ? (
            <blockquote className="font-display text-2xl italic leading-relaxed text-teal-deep">“{story.summary}”</blockquote>
          ) : null}
          {story.content && story.content !== story.summary ? (
            story.content.includes('<') ? (
              <div className="mt-6 leading-relaxed text-ink [&_p]:mb-4" dangerouslySetInnerHTML={{ __html: story.content }} />
            ) : (
              <p className="mt-6 text-lg leading-relaxed text-ink">{story.content}</p>
            )
          ) : null}
        </Card>
        <ShareButtons title={story.title} path={`/resources/stories/${story.slug}`} className="mt-8" />
      </div>
    </>
  )
}
