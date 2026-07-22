import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getStories } from '@/api/stories'
import { getPrograms } from '@/api/programs'
import { SEO } from '@/components/ui/SEO'
import { PageHero, Card } from '@/components/ui/Card'

export function StoriesPage() {
  const { data: stories } = useQuery({ queryKey: ['stories'], queryFn: getStories })
  const { data: programs } = useQuery({ queryKey: ['programs'], queryFn: getPrograms })
  const [countryFilter, setCountryFilter] = useState('')
  const [programFilter, setProgramFilter] = useState('')

  const countries = [...new Set(stories?.map((s) => s.country) ?? [])]
  const filtered = stories?.filter((s) => {
    if (countryFilter && s.country !== countryFilter) return false
    if (programFilter && s.program !== programFilter) return false
    return true
  })

  return (
    <>
      <SEO title="Stories of Transformation" path="/resources/stories" />
      <PageHero title="Stories of Transformation" subtitle="Watch and read how God is at work through healthcare professionals" />
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
            <Card key={story.id} as="article">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-teal-deep/10 px-3 py-1 text-xs font-semibold text-teal-deep">{story.type}</span>
                <span className="text-xs text-ink-muted">{story.country} · {story.program}</span>
              </div>
              <h2 className="mt-3 font-display text-xl text-teal-deep">{story.title}</h2>
              <p className="mt-2 text-ink-muted">{story.summary}</p>
              {story.content && <p className="mt-4 text-sm leading-relaxed text-ink-muted">{story.content}</p>}
              {story.type === 'video' && story.videoUrl && (
                <div className="mt-4 aspect-video overflow-hidden rounded-lg">
                  <iframe src={story.videoUrl} title={story.title} className="h-full w-full" allowFullScreen />
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </>
  )
}
