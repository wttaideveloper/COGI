import axios from 'axios'
import { authenticateLocalUser, setUserPassword } from './users'
import { MOCK_JWT, clearJwt, getJwt, getStrapiUrl, isDemoMode, isDemoModeAllowed, setDemoMode, setJwt, strapiAuthClient } from './strapi'
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
    const unreachable = axios.isAxiosError(error) && !error.response
    // Practice mode is only an explicit, build-time opt-in and only when the server cannot be reached at all.
    // A rejected login (wrong password, blocked user) must never fall through to local credentials.
    if (unreachable && isDemoModeAllowed()) {
      const local = authenticateLocalUser(payload.identifier, payload.password)
      if (local) {
        setJwt(MOCK_JWT)
        setDemoMode(true)
        storeUser(local)
        return local
      }
    }
    if (unreachable) throw new Error(`Cannot reach the COGI server at ${getStrapiUrl()}. Check your connection or contact the site administrator.`)
    throw error
  }
}
export function logout(): void { clearJwt(); setDemoMode(false); localStorage.removeItem(USER_KEY) }
export async function forgotPassword(email: string): Promise<void> { await strapiAuthClient.post('/api/auth/forgot-password', { email }) }
export async function resetPassword(code: string, password: string, passwordConfirmation: string): Promise<void> { await strapiAuthClient.post('/api/auth/reset-password', { code, password, passwordConfirmation }) }
export async function changePassword(payload: ChangePasswordPayload): Promise<void> {
  if (isDemoMode()) {
    const user = getStoredUser()
    if (!user) throw new Error('Not signed in')
    const current = authenticateLocalUser(user.email, payload.currentPassword)
    if (!current) throw new Error('Current password is incorrect')
    if (payload.password !== payload.passwordConfirmation) throw new Error('Passwords do not match')
    setUserPassword(user.email, payload.password)
    return
  }
  await strapiAuthClient.post('/api/auth/change-password', payload, { headers: { Authorization: `Bearer ${getJwt()}` } })
}
