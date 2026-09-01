import { fetchFromStrapi } from '@/services/strapi'
import { fallbackBoardMembers, fallbackGlobalTeam } from '@/data/fallback'
import type { TeamMember } from '@/types'

function orFallback(data: { data?: TeamMember[] } | null, fallback: TeamMember[]): TeamMember[] {
  if (!data?.data?.length) return fallback
  return data.data
}

export async function getBoardMembers(): Promise<TeamMember[]> {
  const data = await fetchFromStrapi<{ data: TeamMember[] }>('/team-members', {
    'filters[role][$eq]': 'board',
    sort: 'order:asc',
  })
  return orFallback(data, fallbackBoardMembers)
}

export async function getGlobalTeam(): Promise<TeamMember[]> {
  const data = await fetchFromStrapi<{ data: TeamMember[] }>('/team-members', {
    'filters[role][$eq]': 'global-team',
    sort: 'order:asc',
  })
  if (data?.data?.length) return data.data
  const alt = await fetchFromStrapi<{ data: TeamMember[] }>('/team-members', {
    'filters[role][$eq]': 'global',
    sort: 'order:asc',
  })
  return orFallback(alt, fallbackGlobalTeam)
}
