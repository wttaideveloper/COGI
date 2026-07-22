import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { searchSite } from '@/api/search'
import { SEO } from '@/components/ui/SEO'
import { PageHero, Card } from '@/components/ui/Card'

export function SearchPage() {
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState(params.get('q') ?? '')
  const [results, setResults] = useState<Awaited<ReturnType<typeof searchSite>>>([])
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSearched(true)
    setParams(query ? { q: query } : {})
    const data = await searchSite(query)
    setResults(data)
    setLoading(false)
  }

  return (
    <>
      <SEO title="Search" path="/search" />
      <PageHero title="Search" subtitle="Find programs, articles, events, and pages" />
      <div className="mx-auto max-w-3xl px-4 py-16">
        <form onSubmit={handleSearch} className="flex gap-3" role="search">
          <label htmlFor="search-input" className="sr-only">Search</label>
          <input
            id="search-input"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the site…"
            className="flex-1 rounded-md border border-mist-dark px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold"
          />
          <button type="submit" className="rounded-md bg-teal-deep px-6 py-3 font-semibold text-white hover:bg-teal-mid" disabled={loading}>
            {loading ? 'Searching…' : 'Search'}
          </button>
        </form>

        <div className="mt-8 space-y-4" aria-live="polite">
          {searched && results.length === 0 && !loading && (
            <p className="text-ink-muted">No results found for &ldquo;{query}&rdquo;.</p>
          )}
          {results.map((result) => (
            <Card key={`${result.type}-${result.id}`}>
              <span className="text-xs font-semibold uppercase tracking-wide text-gold">{result.type}</span>
              <h2 className="mt-1 font-display text-xl text-teal-deep">
                <Link to={result.url} className="hover:text-gold">{result.title}</Link>
              </h2>
              <p className="mt-2 text-sm text-ink-muted">{result.summary}</p>
            </Card>
          ))}
        </div>
      </div>
    </>
  )
}
