import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { changePassword as changePasswordRequest, getStoredUser, hasToken, login as loginRequest, logout as logoutRequest } from '@/services/auth'
import type { AuthUser, ChangePasswordPayload, LoginPayload } from '@/types'

interface AuthContextValue { user: AuthUser | null; isAuthenticated: boolean; login: (payload: LoginPayload) => Promise<void>; logout: () => void; changePassword: (payload: ChangePasswordPayload) => Promise<void> }
const AuthContext = createContext<AuthContextValue | null>(null)
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => (hasToken() ? getStoredUser() : null))
  const login = useCallback(async (payload: LoginPayload) => setUser(await loginRequest(payload)), [])
  const logout = useCallback(() => { logoutRequest(); setUser(null) }, [])
  useEffect(() => {
    const onExpired = () => { logoutRequest(); setUser(null) }
    window.addEventListener('cogi:auth-expired', onExpired)
    return () => window.removeEventListener('cogi:auth-expired', onExpired)
  }, [])
  const value = useMemo(() => ({ user, isAuthenticated: Boolean(user), login, logout, changePassword: changePasswordRequest }), [user, login, logout])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
export function useAuth(): AuthContextValue { const ctx = useContext(AuthContext); if (!ctx) throw new Error('useAuth must be used within AuthProvider'); return ctx }
