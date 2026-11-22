import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'

const strapi = vi.hoisted(() => ({
  apiUpdateSingle: vi.fn(),
  apiPublishSingle: vi.fn(),
  uploadMedia: vi.fn(),
  apiSingle: vi.fn(),
  isDemoMode: vi.fn(() => false),
}))

vi.mock('@/services/strapi', () => ({
  apiUpdateSingle: strapi.apiUpdateSingle,
  apiPublishSingle: strapi.apiPublishSingle,
  apiSingle: strapi.apiSingle,
  uploadMedia: strapi.uploadMedia,
  getStrapiUrl: () => 'https://cogi.example',
  getJwt: () => 'real-jwt',
  isDemoMode: strapi.isDemoMode,
}))

import { saveSiteConfig, hydrateSiteConfigFromStrapi, defaultSiteConfig, resolvePublishedSiteConfig, publishLocalContent } from './siteConfigStore'

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
  strapi.apiSingle.mockReset().mockResolvedValue(null)
  strapi.isDemoMode.mockReset().mockReturnValue(false)
})

describe('website and admin synchronization', () => {
  it('hydrates practice mode from the actual public site, not demo defaults', async () => {
    strapi.isDemoMode.mockReturnValue(true)
    const live = defaultSiteConfig()
    live.homepage.heroHeadline = 'Current website headline'
    live.updatedAt = '2026-11-12T10:00:00Z'
    fetchMock.mockResolvedValue({ ok: true, json: async () => live })
    expect((await hydrateSiteConfigFromStrapi()).homepage.heroHeadline).toBe('Current website headline')
  })

  it('uses the newest published source consistently', async () => {
    const old = { ...defaultSiteConfig(), updatedAt: '2026-11-10T10:00:00Z' }
    const current = { ...defaultSiteConfig(), updatedAt: '2026-11-12T10:00:00Z', headerNav: [] }
    strapi.apiSingle.mockResolvedValue({ payload: old })
    fetchMock.mockResolvedValue({ ok: true, json: async () => current })
    expect((await resolvePublishedSiteConfig())?.headerNav).toEqual([])
  })

  it('does not claim a successful practice publish when the shared file rejects it', async () => {
    strapi.isDemoMode.mockReturnValue(true)
    fetchMock.mockResolvedValue({ ok: false })
    await expect(saveSiteConfig({}, 'published')).rejects.toThrow('Could not publish')
  })

  it('publishes collection changes without leaking a pending homepage draft', async () => {
    strapi.isDemoMode.mockReturnValue(true)
    const live = defaultSiteConfig()
    live.homepage.heroHeadline = 'Live headline'
    fetchMock.mockImplementation(async (_url, init) => init?.method === 'POST' ? { ok: true } : { ok: true, json: async () => live })
    await saveSiteConfig({ homepage: { ...live.homepage, heroHeadline: 'Private draft' } }, 'draft')
    await publishLocalContent({ content: { '/programs': [] } })
    const sent = JSON.parse(fetchMock.mock.calls.find(call => call[1]?.method === 'POST')![1].body)
    expect(sent.homepage.heroHeadline).toBe('Live headline')
    expect(sent.content['/programs']).toEqual([])
  })
})
afterEach(() => { vi.unstubAllGlobals() })

describe('publishing site config', () => {
  it('reports a failed database draft save instead of claiming it was saved', async () => {
    strapi.apiUpdateSingle.mockRejectedValue(new Error('Database unavailable'))
    await expect(saveSiteConfig({}, 'draft')).rejects.toThrow('Database unavailable')
    expect(strapi.apiPublishSingle).not.toHaveBeenCalled()
  })
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
