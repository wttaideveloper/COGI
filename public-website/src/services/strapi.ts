import axios from 'axios'

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337'

export const strapiClient = axios.create({
  baseURL: `${STRAPI_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
  },
  timeout: 8000,
})

export function isStrapiAvailable(): boolean {
  return true
}

export async function fetchFromStrapi<T>(endpoint: string, params?: Record<string, unknown>): Promise<T | null> {
  try {
    const { data } = await strapiClient.get<T>(endpoint, {
      params: { ...params },
      headers: { 'Cache-Control': 'no-cache' },
    })
    return data
  } catch {
    return null
  }
}

export async function postToStrapi<T>(endpoint: string, body: unknown): Promise<T | null> {
  if (!isStrapiAvailable()) return null
  try {
    const { data } = await strapiClient.post<T>(endpoint, { data: body })
    return data
  } catch {
    return null
  }
}
