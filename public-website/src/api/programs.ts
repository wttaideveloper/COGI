import { fetchFromStrapi } from '@/services/strapi'
import { fallbackPrograms } from '@/data/fallback'
import type { Program, ProgramExperience } from '@/types'

type StrapiProgram = {
  id?: number | string
  documentId?: string
  title?: string
  slug?: string
  summary?: string
  body?: string
  area?: string
  order?: number
  experiences?: ProgramExperience[] | null
  highlights?: string[]
  audience?: string
}

function toProgram(raw: StrapiProgram): Program {
  const slug = raw.slug ?? ''
  const fallback = fallbackPrograms.find((p) => p.slug === slug)
  const area = raw.area ?? fallback?.area ?? ''
  return {
    id: String(raw.id ?? raw.documentId ?? slug),
    slug: slug || (fallback?.slug ?? ''),
    title: raw.title ?? fallback?.title ?? '',
    summary: raw.summary ?? fallback?.summary ?? '',
    description: (raw.body && raw.body.length > 0 ? raw.body.replace(/<[^>]*>/g, '') : '') || fallback?.description || raw.summary || '',
    area: area === 'content' || area === '' && fallback?.area ? fallback?.area ?? '' : area,
    experiences: Array.isArray(raw.experiences) ? raw.experiences : (fallback?.experiences ?? []),
    highlights: Array.isArray(raw.highlights) && raw.highlights.length ? raw.highlights : (fallback?.highlights ?? []),
    audience: raw.audience ?? fallback?.audience ?? '',
    order: raw.order ?? fallback?.order ?? 0,
  }
}

export async function getPrograms(): Promise<Program[]> {
  const data = await fetchFromStrapi<{ data: StrapiProgram[] }>('/programs', {
    sort: 'order:asc',
    populate: '*',
  })
  if (!data?.data?.length) return fallbackPrograms
  const rows = data.data.map(toProgram).filter((p) => p.title)
  return rows.length ? rows : fallbackPrograms
}

export async function getProgramBySlug(slug: string): Promise<Program | undefined> {
  const data = await fetchFromStrapi<{ data: StrapiProgram[] }>('/programs', {
    'filters[slug][$eq]': slug,
    populate: '*',
  })
  if (!data?.data?.[0]) return fallbackPrograms.find((p) => p.slug === slug)
  return toProgram(data.data[0])
}
