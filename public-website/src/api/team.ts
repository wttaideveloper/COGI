import { fetchFromStrapi } from '@/services/strapi'
import { fallbackBoardMembers, fallbackGlobalTeam } from '@/data/fallback'
import type { TeamMember } from '@/types'

export async function getBoardMembers(): Promise<TeamMember[]> {
  const data = await fetchFromStrapi<{ data: TeamMember[] }>('/team-members', {
    'filters[role][$eq]': 'board',
    sort: 'order:asc',
  })
  if (data === null) return fallbackBoardMembers
  return data.data ?? []
}

export async function getGlobalTeam(): Promise<TeamMember[]> {
  const data = await fetchFromStrapi<{ data: TeamMember[] }>('/team-members', {
    'filters[role][$eq]': 'global-team',
    sort: 'order:asc',
  })
  if (data === null) return fallbackGlobalTeam
  return data.data ?? []
}
