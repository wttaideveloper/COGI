import { clearJwt, getJwt, setDemoMode, setJwt, strapiAuthClient } from './strapi'
import type { AuthUser, ChangePasswordPayload, LoginPayload } from '@/types'

const USER_KEY = 'cogi_admin_user'
export const DEMO_EMAIL = 'admin@cogi.local'
export const DEMO_PASSWORD = 'admin123'
export const demoUser: AuthUser = { id: 1, username: 'admin', email: DEMO_EMAIL, firstname: 'COGI', lastname: 'Admin', role: { id: 1, name: 'Super Admin', type: 'super-admin' } }

export function getStoredUser(): AuthUser | null { const raw = localStorage.getItem(USER_KEY); if (!raw) return null; try { return JSON.parse(raw) as AuthUser } catch { return null } }
export function storeUser(user: AuthUser): void { localStorage.setItem(USER_KEY, JSON.stringify(user)) }
export function hasToken(): boolean { return Boolean(getJwt()) }
export async function login(payload: LoginPayload): Promise<AuthUser> {
  try {
    const { data } = await strapiAuthClient.post('/api/auth/local', payload)
    setJwt(data.jwt)
    setDemoMode(false)
    storeUser(data.user)
    return data.user
  } catch (error) {
    if (payload.identifier.toLowerCase() === DEMO_EMAIL && payload.password === DEMO_PASSWORD) {
      setJwt('mock-jwt-cogi-admin')
      setDemoMode(true)
      storeUser(demoUser)
      return demoUser
    }
    throw error
  }
}
export function logout(): void { clearJwt(); setDemoMode(false); localStorage.removeItem(USER_KEY) }
export async function forgotPassword(email: string): Promise<void> { await strapiAuthClient.post('/api/auth/forgot-password', { email }) }
export async function resetPassword(code: string, password: string, passwordConfirmation: string): Promise<void> { await strapiAuthClient.post('/api/auth/reset-password', { code, password, passwordConfirmation }) }
export async function changePassword(payload: ChangePasswordPayload): Promise<void> { await strapiAuthClient.post('/api/auth/change-password', payload, { headers: { Authorization: `Bearer ${getJwt()}` } }) }
