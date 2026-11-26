import { PhotoHero } from '@/components/layout/PhotoHero'
import { MediaPreview } from '@/components/ui/MediaPreview'
import { Link } from 'react-router-dom'
import { SEO } from '@/components/ui/SEO'
import { Card } from '@/components/ui/Card'
import { useSiteConfig } from '@/contexts/SiteConfigContext'
import { useQuery } from '@tanstack/react-query'
import { getStories } from '@/api/stories'
import { getBlogPosts } from '@/api/blog'
import { stripHtml } from '@/data/siteCopy'

function resourceHref(title: string, href?: string) {
  const raw = (href || '').trim()
  let next = raw
  if (raw.startsWith('http://') || raw.startsWith('https://')) return raw
  if (raw.startsWith('/')) next = raw
  else if (raw) next = `/${raw.replace(/^\/+/, '')}`
  const normalized = next.replace(/\/+$/, '') || '/'
  if (!next || normalized === '/resources') {
    const key = title.toLowerCase()
    if (key.includes('stor')) return '/resources/stories'
    if (key.includes('testimonial')) return '/resources/testimonials'
    if (key.includes('blog') || key.includes('news')) return '/resources/blog'
    return '/resources/stories'
  }
  return next
}

export function ResourcesPage() {
  const { copy } = useSiteConfig()
  const page = copy.resources
  const stories = useQuery({ queryKey: ['stories'], queryFn: getStories })
  const blogs = useQuery({ queryKey: ['blog'], queryFn: getBlogPosts })
  const written = (stories.data || []).filter(story => story.type === 'written')
  const videos = (stories.data || []).filter(story => story.type === 'video' && story.videoUrl)
  const contributors = copy.globalTeam.members.filter(member => stripHtml(member.contribution).trim())

  return (
    <>
      <SEO title={page.heroTitle} description={page.heroSubtitle} path="/resources" />
      <PhotoHero title={page.heroTitle} subtitle={page.heroSubtitle} imageUrl={page.imageUrl || page.cards[0]?.imageUrl} />
      <div className="about-body mx-auto max-w-6xl grid gap-6 md:grid-cols-3 md:items-stretch">
        {page.cards.map((r) => (
          <div key={r.href || r.title} className="flex min-h-full">
            <Card className="flex h-full w-full min-h-[22rem] flex-col overflow-hidden !p-0 transition-shadow hover:border-gold/50 hover:shadow-md">
              {r.imageUrl ? <MediaPreview src={r.imageUrl} alt={r.title} className="h-52 w-full shrink-0 object-cover" /> : <div className="h-40 w-full shrink-0 bg-mist" />}
              <Link to={resourceHref(r.title, r.href)} className="flex flex-1 flex-col p-6">
                <h2 className="font-display text-xl text-teal-deep">{r.title}</h2>
                <p className="mt-3 flex-1 text-ink-muted">{r.body}</p>
                <span className="mt-auto pt-4 inline-block text-sm font-semibold text-teal-mid">{r.cta || page.exploreLabel} →</span>
              </Link>
            </Card>
          </div>
        ))}
      </div>
      <div className="mx-auto max-w-6xl space-y-16 px-5 pb-16">
        <nav aria-label="Resource categories" className="flex flex-wrap gap-4 border-y border-mist-dark py-5 font-semibold text-teal-deep">
          <a href="#written-stories">Written stories</a><a href="#resource-videos">Videos</a><a href="#resource-blogs">Blogs</a><Link to="/about/global-team">Meet the global team →</Link>
        </nav>
        <section id="written-stories" className="scroll-mt-28">
          <h2 className="font-display text-3xl text-teal-deep">Written stories</h2>
          <p className="mt-3 text-ink-muted">Reflections and experiences shared by our community.</p>
          {stories.isLoading ? <p role="status">Loading stories…</p> : stories.isError ? <p>Stories could not be loaded. Please try again.</p> : !written.length ? <p className="mt-6">New written stories will appear here when published.</p> : (
            <div className="mt-6 grid gap-6 md:grid-cols-2">{written.map(story => <Card key={story.id} as="article">
              <h3 className="font-display text-2xl text-teal-deep"><Link to={`/resources/stories/${story.slug}`}>{story.title}</Link></h3>
              <p className="mt-2 text-sm text-accent-ink">{[story.country, story.program].filter(Boolean).join(' · ')}</p>
              <p className="mt-3 text-ink-muted">{story.summary}</p>
              <Link to={`/resources/stories/${story.slug}`} className="mt-4 inline-block font-semibold text-teal-deep">Read story →</Link>
            </Card>)}</div>
          )}
        </section>
        <section id="resource-videos" className="scroll-mt-28">
          <h2 className="font-display text-3xl text-teal-deep">Videos</h2>
          {page.kogVideoUrl && <article className="mt-6">
            <h3 className="mb-4 font-display text-2xl text-teal-deep">Discover the Kingdom of God</h3>
            <MediaPreview video src={page.kogVideoUrl} poster={page.kogPosterUrl} alt="Kingdom of God video" className="aspect-video w-full overflow-hidden rounded-xl bg-black" />
          </article>}
          <div className="mt-6 grid gap-6 md:grid-cols-2">{videos.map(story => <article key={story.id}>
            <MediaPreview video src={story.videoUrl!} poster={story.imageUrl} alt={story.title} className="aspect-video w-full overflow-hidden rounded-xl bg-black" />
            <h3 className="mt-4 font-display text-2xl text-teal-deep">{story.title}</h3>
            <p className="mt-2 text-ink-muted">{story.summary}</p>
          </article>)}</div>
          {!stories.isLoading && !stories.isError && !videos.length && !page.kogVideoUrl && <p>Videos will appear here when published.</p>}
        </section>
        <section id="resource-blogs" className="scroll-mt-28">
          <div className="flex flex-wrap items-center justify-between gap-4"><h2 className="font-display text-3xl text-teal-deep">Blogs and reflections</h2><Link to="/resources/blog" className="font-semibold text-teal-deep underline">Browse and search all articles</Link></div>
          <div className="mt-6 grid gap-6 md:grid-cols-2">{[...(blogs.data || [])].sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt)).map(post => <Card key={post.id} as="article">
            <p className="text-sm text-accent-ink">{post.author}</p>
            <h3 className="mt-2 font-display text-2xl text-teal-deep"><Link to={`/resources/blog/${post.slug}`}>{post.title}</Link></h3>
            <p className="mt-3 text-ink-muted">{post.summary}</p>
            <Link to={`/resources/blog/${post.slug}`} className="mt-4 inline-block font-semibold text-teal-deep">Read article →</Link>
          </Card>)}</div>
          {blogs.isLoading ? <p role="status">Loading articles…</p> : blogs.isError ? <p>Articles could not be loaded. Please try again.</p> : !blogs.data?.length ? <p>Articles will appear here when published.</p> : null}
        </section>
        {contributors.length > 0 && <section id="team-contributions" className="scroll-mt-28">
          <h2 className="font-display text-3xl text-teal-deep">Contributions from our team</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">{contributors.map(member => <Card key={member.id} as="article">
            {member.imageUrl && <img src={member.imageUrl} alt={member.name} loading="lazy" className="mb-4 h-20 w-20 rounded-full object-cover" />}
            <h3 className="font-display text-2xl text-teal-deep">{member.name}</h3>
            <p className="mt-1 text-sm text-accent-ink">{[member.title, member.country].filter(Boolean).join(' · ')}</p>
            <p className="mt-4 whitespace-pre-line text-ink-muted">{stripHtml(member.contribution)}</p>
          </Card>)}</div>
        </section>}
      </div>
    </>
  )
}
