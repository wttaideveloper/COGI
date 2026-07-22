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

export function getJwt(): string | null { return localStorage.getItem(TOKEN_KEY) }
export function setJwt(token: string): void { localStorage.setItem(TOKEN_KEY, token) }
export function clearJwt(): void { localStorage.removeItem(TOKEN_KEY) }
export function isDemoMode(): boolean { return localStorage.getItem('cogi_demo_mode') === 'true' }
export function setDemoMode(enabled: boolean): void { enabled ? localStorage.setItem('cogi_demo_mode', 'true') : localStorage.removeItem('cogi_demo_mode') }
export function getStrapiUrl(): string { return STRAPI_URL }
export function getErrorMessage(error: unknown): string { return axios.isAxiosError(error) ? (error.response?.data?.error?.message || error.message) : error instanceof Error ? error.message : 'Unexpected error' }

export function unwrapItem<T extends object>(item: unknown): T {
  if (!item || typeof item !== 'object') return item as T
  const obj = item as Record<string, unknown>
  if (obj.attributes && typeof obj.attributes === 'object') return { id: String(obj.id ?? obj.documentId ?? ''), documentId: obj.documentId, ...(obj.attributes as Record<string, unknown>) } as unknown as T
  return { ...obj, id: String(obj.id ?? obj.documentId ?? '') } as unknown as T
}
export function unwrapList<T extends object>(response: unknown): T[] { const data = (response as { data?: unknown })?.data; return Array.isArray(data) ? data.map((item) => unwrapItem<T>(item)) : [] }
export async function apiList<T extends object>(endpoint: string, params: Record<string, unknown> = { populate: 'deep' }): Promise<T[]> { const { data } = await strapiClient.get(endpoint, { params }); return unwrapList<T>(data) }
export async function apiCreate<T>(endpoint: string, body: T): Promise<unknown> { const { data } = await strapiClient.post(endpoint, { data: body }); return data }
export async function apiUpdate<T>(endpoint: string, id: string, body: T): Promise<unknown> { const { data } = await strapiClient.put(`${endpoint}/${id}`, { data: body }); return data }
export async function apiDelete(endpoint: string, id: string): Promise<void> { await strapiClient.delete(`${endpoint}/${id}`) }
export async function apiSingle<T extends object>(endpoint: string): Promise<T> { const { data } = await strapiClient.get(endpoint, { params: { populate: 'deep' } }); return unwrapItem<T>((data as { data: unknown }).data) }
export async function apiUpdateSingle<T>(endpoint: string, body: T): Promise<unknown> { const { data } = await strapiClient.put(endpoint, { data: body }); return data }
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
