import { fetchFromStrapi } from '@/services/strapi'
import { fallbackBoardMembers, fallbackGlobalTeam } from '@/data/fallback'
import type { TeamMember } from '@/types'

export async function getBoardMembers(): Promise<TeamMember[]> {
  const data = await fetchFromStrapi<{ data: TeamMember[] }>('/team-members', {
    'filters[role][$eq]': 'board',
    sort: 'order:asc',
  })
  return data?.data ?? fallbackBoardMembers
}

export async function getGlobalTeam(): Promise<TeamMember[]> {
  const data = await fetchFromStrapi<{ data: TeamMember[] }>('/team-members', {
    'filters[role][$eq]': 'global',
    sort: 'order:asc',
  })
  return data?.data ?? fallbackGlobalTeam
}
