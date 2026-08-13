import axios, { type InternalAxiosRequestConfig } from 'axios'
import type { MediaFile } from '@/types'

const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337'
const TOKEN_KEY = 'cogi_admin_jwt'

export const strapiClient = axios.create({ baseURL: `${STRAPI_URL}/api`, headers: { 'Content-Type': 'application/json' }, timeout: 12000 })
export const strapiAuthClient = axios.create({ baseURL: STRAPI_URL, headers: { 'Content-Type': 'application/json' }, timeout: 12000 })

strapiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getJwt()
  if (token && !isDemoMode()) config.headers.Authorization = `Bearer ${token}`
  return config
})

strapiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      clearJwt()
      localStorage.removeItem('cogi_admin_user')
      window.dispatchEvent(new Event('cogi:auth-expired'))
    }
    return Promise.reject(error)
  },
)

export function getJwt(): string | null { return localStorage.getItem(TOKEN_KEY) }
export function setJwt(token: string): void { localStorage.setItem(TOKEN_KEY, token) }
export function clearJwt(): void { localStorage.removeItem(TOKEN_KEY) }
export function isDemoMode(): boolean { return localStorage.getItem('cogi_demo_mode') === 'true' }
export function setDemoMode(enabled: boolean): void { if (enabled) { localStorage.setItem('cogi_demo_mode', 'true') } else { localStorage.removeItem('cogi_demo_mode') } }
export function getStrapiUrl(): string { return STRAPI_URL }
export function getErrorMessage(error: unknown): string { return axios.isAxiosError(error) ? (error.response?.data?.error?.message || error.message) : error instanceof Error ? error.message : 'Unexpected error' }

export function unwrapItem<T extends object>(item: unknown): T {
  if (!item || typeof item !== 'object') return item as T
  const obj = item as Record<string, unknown>
  const withStatus = (attrs: Record<string, unknown>) => {
    if (attrs.status === undefined && attrs.publishedAt !== undefined) attrs.status = attrs.publishedAt ? 'published' : 'draft'
    return attrs
  }
  if (obj.attributes && typeof obj.attributes === 'object') return { id: String(obj.id ?? obj.documentId ?? ''), documentId: obj.documentId, ...withStatus({ ...(obj.attributes as Record<string, unknown>) }) } as unknown as T
  return { ...withStatus({ ...obj }), id: String(obj.id ?? obj.documentId ?? '') } as unknown as T
}
export function unwrapList<T extends object>(response: unknown): T[] { const data = (response as { data?: unknown })?.data; return Array.isArray(data) ? data.map((item) => unwrapItem<T>(item)) : [] }
export async function apiList<T extends object>(endpoint: string, params: Record<string, unknown> = { populate: '*' }): Promise<T[]> { const { data } = await strapiClient.get(endpoint, { params }); return unwrapList<T>(data) }
export async function apiListAll<T extends object & { id: string; documentId?: string }>(endpoint: string, params: Record<string, unknown> = { populate: '*' }): Promise<T[]> {
  const [drafts, published] = await Promise.all([
    strapiClient.get(endpoint, { params: { ...params, status: 'draft' } }),
    strapiClient.get(endpoint, { params: { ...params, status: 'published' } }),
  ])
  const rows = [...unwrapList<T>((drafts as { data: unknown }).data), ...unwrapList<T>((published as { data: unknown }).data)]
  const byDoc = new Map<string, T>()
  for (const row of rows) {
    const key = row.documentId || row.id
    if (!key) continue
    const existing = byDoc.get(key)
    if (!existing || String((row as Record<string, unknown>).status) === 'published') byDoc.set(key, row)
  }
  return Array.from(byDoc.values())
}
export async function apiCreate<T>(endpoint: string, body: T, status?: 'draft' | 'published'): Promise<unknown> { const { data } = await strapiClient.post(endpoint, { data: body }, { params: status ? { status } : undefined }); return data }
export async function apiUpdate<T>(endpoint: string, id: string, body: T, status?: 'draft' | 'published'): Promise<unknown> { const { data } = await strapiClient.put(`${endpoint}/${id}`, { data: body }, { params: status ? { status } : undefined }); return data }
export async function apiPublish(endpoint: string, id: string): Promise<unknown> { const { data } = await strapiClient.post(`${endpoint}/${id}/actions/publish`); return data }
export async function apiUnpublish(endpoint: string, id: string): Promise<unknown> { const { data } = await strapiClient.post(`${endpoint}/${id}/actions/unpublish`); return data }
export async function apiPublishSingle(endpoint: string): Promise<unknown> { const { data } = await strapiClient.post(`${endpoint}/actions/publish`); return data }
export async function apiUnpublishSingle(endpoint: string): Promise<unknown> { const { data } = await strapiClient.post(`${endpoint}/actions/unpublish`); return data }
export async function apiDelete(endpoint: string, id: string): Promise<void> { await strapiClient.delete(`${endpoint}/${id}`) }
export async function apiSingle<T extends object>(endpoint: string, params: Record<string, unknown> = { populate: '*' }): Promise<T> { const { data } = await strapiClient.get(endpoint, { params }); return unwrapItem<T>((data as { data: unknown }).data) }
export async function apiUpdateSingle<T>(endpoint: string, body: T, status?: 'draft' | 'published'): Promise<unknown> {
  try {
    const { data } = await strapiClient.put(endpoint, { data: body }, { params: status ? { status } : undefined })
    return data
  } catch (error) {
    if (axios.isAxiosError(error) && (error.response?.status === 404 || error.response?.status === 405)) {
      const { data } = await strapiClient.post(endpoint, { data: body }, { params: status ? { status } : undefined })
      return data
    }
    throw error
  }
}
export async function uploadMedia(file: File, alternativeText?: string): Promise<MediaFile> {
  const form = new FormData()
  form.append('files', file)
  if (alternativeText) form.append('fileInfo', JSON.stringify({ alternativeText }))
  const { data } = await axios.post(`${STRAPI_URL}/api/upload`, form, {
    headers: getJwt() && !isDemoMode() ? { Authorization: `Bearer ${getJwt()}` } : undefined,
  })
  const uploaded = Array.isArray(data) ? data[0] : data
  return {
    id: String(uploaded.id ?? uploaded.documentId ?? Date.now()),
    documentId: uploaded.documentId,
    name: uploaded.name ?? file.name,
    url: uploaded.url ?? '',
    mime: uploaded.mime ?? file.type,
    size: uploaded.size ?? file.size,
    alternativeText: uploaded.alternativeText ?? alternativeText,
    createdAt: uploaded.createdAt,
  }
}
