import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'

const strapi = vi.hoisted(() => ({
  apiUpdateSingle: vi.fn(),
  apiPublishSingle: vi.fn(),
  uploadMedia: vi.fn(),
}))

vi.mock('@/services/strapi', () => ({
  apiUpdateSingle: strapi.apiUpdateSingle,
  apiPublishSingle: strapi.apiPublishSingle,
  apiSingle: vi.fn(),
  uploadMedia: strapi.uploadMedia,
  getStrapiUrl: () => 'https://cogi.example',
  getJwt: () => 'real-jwt',
  isDemoMode: () => false,
}))

import { saveSiteConfig } from './siteConfigStore'

function memoryStorage(): Storage {
  const map = new Map<string, string>()
  return {
    get length() { return map.size },
    clear: () => map.clear(),
    getItem: (key) => map.get(key) ?? null,
    key: (index) => [...map.keys()][index] ?? null,
    removeItem: (key) => { map.delete(key) },
    setItem: (key, value) => { map.set(key, String(value)) },
  }
}

const PNG = 'data:image/png;base64,iVBORw0KGgo='
let fetchMock: ReturnType<typeof vi.fn>

beforeEach(() => {
  vi.stubGlobal('localStorage', memoryStorage())
  fetchMock = vi.fn().mockResolvedValue({ ok: true })
  vi.stubGlobal('fetch', fetchMock)
  strapi.apiUpdateSingle.mockReset().mockResolvedValue({})
  strapi.apiPublishSingle.mockReset().mockResolvedValue({})
  strapi.uploadMedia.mockReset().mockResolvedValue({ url: '/uploads/logo_abc.png' })
})
afterEach(() => { vi.unstubAllGlobals() })

describe('publishing site config', () => {
  it('uploads a new logo, saves it to Strapi, publishes, then refreshes the public cache', async () => {
    const header = { ...(await saveSiteConfig({}, 'draft')).header, logoUrl: PNG }
    const saved = await saveSiteConfig({ header }, 'published')

    expect(strapi.uploadMedia).toHaveBeenCalledTimes(1)
    expect(saved.header.logoUrl).toBe('https://cogi.example/uploads/logo_abc.png')
    const [endpoint, body, status] = strapi.apiUpdateSingle.mock.calls.at(-1)!
    expect(endpoint).toBe('/site-config')
    expect(body.payload.header.logoUrl).toBe('https://cogi.example/uploads/logo_abc.png')
    expect(status).toBe('draft')
    expect(strapi.apiPublishSingle).toHaveBeenCalledWith('/site-config')

    const [url, init] = fetchMock.mock.calls.at(-1)!
    expect(url).toBe('/__site-config')
    expect(init.headers.Authorization).toBe('Bearer real-jwt')
  })

  it('rejects instead of reporting success when Strapi refuses the publish', async () => {
    strapi.apiPublishSingle.mockRejectedValue(new Error('Forbidden'))
    await expect(saveSiteConfig({}, 'published')).rejects.toThrow('Forbidden')
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('does not hide a failed logo upload', async () => {
    strapi.uploadMedia.mockRejectedValue(new Error('Upload failed'))
    const header = { ...(await saveSiteConfig({}, 'draft')).header, logoUrl: PNG }
    await expect(saveSiteConfig({ header }, 'published')).rejects.toThrow('Upload failed')
    expect(strapi.apiPublishSingle).not.toHaveBeenCalled()
  })

  it('still succeeds when only the public cache write fails', async () => {
    fetchMock.mockRejectedValue(new Error('offline'))
    await expect(saveSiteConfig({}, 'published')).resolves.toBeDefined()
    expect(strapi.apiPublishSingle).toHaveBeenCalled()
  })
})
