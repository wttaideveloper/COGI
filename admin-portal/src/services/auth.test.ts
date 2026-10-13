import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AxiosError } from 'axios'

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

const networkError = () => new AxiosError('Network Error', 'ERR_NETWORK')
const rejectedLogin = () => new AxiosError('Request failed', 'ERR_BAD_REQUEST', undefined, undefined, { status: 400, statusText: 'Bad Request', headers: {}, config: {} as never, data: { error: { message: 'Invalid identifier or password' } } })

async function load() {
  vi.resetModules()
  const strapi = await import('./strapi')
  const auth = await import('./auth')
  return { strapi, auth }
}

beforeEach(() => { vi.stubGlobal('localStorage', memoryStorage()) })
afterEach(() => { vi.unstubAllGlobals(); vi.unstubAllEnvs() })

describe('login in a production build (demo mode not enabled)', () => {
  it('stores the Strapi JWT and does not enter demo mode', async () => {
    const { strapi, auth } = await load()
    vi.spyOn(strapi.strapiAuthClient, 'post').mockResolvedValue({ data: { jwt: 'real-jwt', user: { id: 7, email: 'a@b.c' } } })
    await auth.login({ identifier: 'a@b.c', password: 'pw' })
    expect(strapi.getJwt()).toBe('real-jwt')
    expect(strapi.isDemoMode()).toBe(false)
  })

  it('does not fall back to the built-in demo credentials when the server is unreachable', async () => {
    const { strapi, auth } = await load()
    vi.spyOn(strapi.strapiAuthClient, 'post').mockRejectedValue(networkError())
    await expect(auth.login({ identifier: 'admin@cogi.local', password: 'admin123' })).rejects.toThrow(/Cannot reach the COGI server/)
    expect(strapi.getJwt()).toBeNull()
    expect(strapi.isDemoMode()).toBe(false)
  })

  it('does not fall back to demo credentials when Strapi rejects the login', async () => {
    const { strapi, auth } = await load()
    const err = rejectedLogin()
    vi.spyOn(strapi.strapiAuthClient, 'post').mockRejectedValue(err)
    await expect(auth.login({ identifier: 'admin@cogi.local', password: 'admin123' })).rejects.toBe(err)
    expect(strapi.getJwt()).toBeNull()
  })

  it('ignores a stale demo flag and mock session left in the browser', async () => {
    localStorage.setItem('cogi_demo_mode', 'true')
    localStorage.setItem('cogi_admin_jwt', 'mock-jwt-cogi-admin')
    localStorage.setItem('cogi_admin_user', '{"id":1}')
    const { strapi, auth } = await load()
    expect(strapi.isDemoMode()).toBe(false)
    expect(strapi.getJwt()).toBeNull()
    expect(auth.hasToken()).toBe(false)
    expect(auth.getStoredUser()).toBeNull()
  })

  it('sends the real JWT on API requests', async () => {
    localStorage.setItem('cogi_demo_mode', 'true')
    localStorage.setItem('cogi_admin_jwt', 'real-jwt')
    const { strapi } = await load()
    const handler = (strapi.strapiClient.interceptors.request as unknown as { handlers: Array<{ fulfilled: (c: { headers: Record<string, string> }) => { headers: Record<string, string> } }> }).handlers[0]
    expect(handler.fulfilled({ headers: {} }).headers.Authorization).toBe('Bearer real-jwt')
  })
})

describe('login when demo mode is explicitly enabled at build time', () => {
  it('falls back to local demo credentials only when the server is unreachable', async () => {
    vi.stubEnv('VITE_ENABLE_DEMO_MODE', 'true')
    const { strapi, auth } = await load()
    vi.spyOn(strapi.strapiAuthClient, 'post').mockRejectedValue(networkError())
    await auth.login({ identifier: 'admin@cogi.local', password: 'admin123' })
    expect(strapi.isDemoMode()).toBe(true)
  })

  it('still surfaces a rejected login instead of entering demo mode', async () => {
    vi.stubEnv('VITE_ENABLE_DEMO_MODE', 'true')
    const { strapi, auth } = await load()
    const err = rejectedLogin()
    vi.spyOn(strapi.strapiAuthClient, 'post').mockRejectedValue(err)
    await expect(auth.login({ identifier: 'admin@cogi.local', password: 'admin123' })).rejects.toBe(err)
    expect(strapi.isDemoMode()).toBe(false)
  })
})
