import { MediaPreview } from '@/components/ui/MediaPreview'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getStories } from '@/api/stories'
import { getPrograms } from '@/api/programs'
import { SEO } from '@/components/ui/SEO'
import { PageHero, Card } from '@/components/ui/Card'
import { useSiteConfig } from '@/contexts/SiteConfigContext'

export function StoriesPage() {
  const { data: stories } = useQuery({ queryKey: ['stories'], queryFn: getStories })
  const { data: programs } = useQuery({ queryKey: ['programs'], queryFn: getPrograms })
  const [countryFilter, setCountryFilter] = useState('')
  const [programFilter, setProgramFilter] = useState('')
  const { copy } = useSiteConfig()
  const page = copy.storiesPage

  const countries = [...new Set(stories?.map((s) => s.country) ?? [])]
  const filtered = stories?.filter((s) => {
    if (countryFilter && s.country !== countryFilter) return false
    if (programFilter && s.program !== programFilter) return false
    return true
  })

  return (
    <>
      <SEO title={page.heroTitle} path="/resources/stories" />
      <PageHero title={page.heroTitle} subtitle={page.heroSubtitle} imageUrl={page.imageUrl} />
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-8 flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm">
            Country:
            <select value={countryFilter} onChange={(e) => setCountryFilter(e.target.value)} className="rounded-md border border-mist-dark px-3 py-2">
              <option value="">All</option>
              {countries.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm">
            Program:
            <select value={programFilter} onChange={(e) => setProgramFilter(e.target.value)} className="rounded-md border border-mist-dark px-3 py-2">
              <option value="">All</option>
              {programs?.map((p) => <option key={p.id} value={p.title}>{p.title}</option>)}
            </select>
          </label>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {filtered?.map((story) => (
            <Card key={story.id} as="article" className="overflow-hidden p-0">
              {story.type === 'video' && story.videoUrl ? (
                <MediaPreview video src={story.videoUrl} poster={story.imageUrl} alt={story.title} className="relative h-56 w-full overflow-hidden bg-black" />
              ) : story.imageUrl ? (
                <MediaPreview src={story.imageUrl} alt={story.title} className="h-56 w-full object-cover" />
              ) : null}
              <div className="p-6">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-teal-deep/10 px-3 py-1 text-xs font-semibold text-teal-deep">{story.type}</span>
                <span className="text-xs text-ink-muted">{story.country} · {story.program}</span>
              </div>
              <h2 className="mt-3 font-display text-xl text-teal-deep">
                <Link to={`/resources/stories/${story.slug}`} className="hover:text-gold">{story.title}</Link>
              </h2>
              {story.summary ? (
                <blockquote className="mt-3 font-display text-lg italic text-teal-deep">“{story.summary}”</blockquote>
              ) : (
                <p className="mt-2 text-ink-muted">{story.summary}</p>
              )}
              <Link to={`/resources/stories/${story.slug}`} className="mt-4 inline-block text-sm font-semibold text-teal-mid hover:text-gold">
                {story.type === 'video' ? 'Watch story →' : 'Read story →'}
              </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </>
  )
}
