import { mockUsers } from '@/data/mock'
import type { AdminUserRecord, AuthUser } from '@/types'

const STORAGE_KEY = 'cogi_admin_users'
const PASSWORD_KEY = 'cogi_admin_user_passwords'

export const USER_ROLES = [
  { id: 1, name: 'Super Admin', type: 'super-admin', description: 'Full access, including users and settings' },
  { id: 2, name: 'Editor', type: 'editor', description: 'Create, edit, and publish website content' },
  { id: 3, name: 'Viewer', type: 'viewer', description: 'View content without making changes' },
] as const

export type UserRoleType = (typeof USER_ROLES)[number]['type']

export type UserDraft = {
  firstname: string
  lastname: string
  username: string
  email: string
  password?: string
  roleType: UserRoleType
  blocked: boolean
}

type PasswordMap = Record<string, string>

const defaultPasswords: PasswordMap = {
  'admin@cogi.local': 'admin123',
  'editor@cogi.local': 'editor123',
}

export function loadUsers(): AdminUserRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return structuredClone(mockUsers)
    const parsed = JSON.parse(raw) as AdminUserRecord[]
    return Array.isArray(parsed) && parsed.length ? parsed : structuredClone(mockUsers)
  } catch {
    return structuredClone(mockUsers)
  }
}

export function saveUsers(users: AdminUserRecord[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
}

export function loadPasswords(): PasswordMap {
  try {
    const raw = localStorage.getItem(PASSWORD_KEY)
    if (!raw) return { ...defaultPasswords }
    const parsed = JSON.parse(raw) as PasswordMap
    return parsed && typeof parsed === 'object' ? { ...defaultPasswords, ...parsed } : { ...defaultPasswords }
  } catch {
    return { ...defaultPasswords }
  }
}

export function savePasswords(passwords: PasswordMap): void {
  localStorage.setItem(PASSWORD_KEY, JSON.stringify(passwords))
}

export function setUserPassword(email: string, password: string): void {
  const passwords = loadPasswords()
  passwords[email.trim().toLowerCase()] = password
  savePasswords(passwords)
}

export function removeUserPassword(email: string): void {
  const passwords = loadPasswords()
  delete passwords[email.trim().toLowerCase()]
  savePasswords(passwords)
}

export function authenticateLocalUser(identifier: string, password: string): AuthUser | null {
  const email = identifier.trim().toLowerCase()
  const user = loadUsers().find((item) => item.email.toLowerCase() === email || item.username.toLowerCase() === email)
  if (!user || user.blocked) return null
  const stored = loadPasswords()[user.email.toLowerCase()]
  if (!stored || stored !== password) return null
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    firstname: user.firstname,
    lastname: user.lastname,
    role: user.role,
  }
}

export function roleFromType(type: UserRoleType) {
  return USER_ROLES.find((role) => role.type === type) ?? USER_ROLES[1]
}

export function createUser(draft: UserDraft): AdminUserRecord {
  const role = roleFromType(draft.roleType)
  const username = draft.username.trim() || draft.email.split('@')[0]
  return {
    id: Date.now(),
    username,
    email: draft.email.trim().toLowerCase(),
    firstname: draft.firstname.trim(),
    lastname: draft.lastname.trim(),
    blocked: draft.blocked,
    role: { id: role.id, name: role.name, type: role.type },
  }
}

export function applyUserDraft(user: AdminUserRecord, draft: UserDraft): AdminUserRecord {
  const role = roleFromType(draft.roleType)
  return {
    ...user,
    username: draft.username.trim() || user.username,
    email: draft.email.trim().toLowerCase(),
    firstname: draft.firstname.trim(),
    lastname: draft.lastname.trim(),
    blocked: draft.blocked,
    role: { id: role.id, name: role.name, type: role.type },
  }
}

export function countSuperAdmins(users: AdminUserRecord[]): number {
  return users.filter((user) => user.role?.type === 'super-admin' && !user.blocked).length
}

export function emailTaken(users: AdminUserRecord[], email: string, exceptId?: number): boolean {
  const value = email.trim().toLowerCase()
  return users.some((user) => user.email.toLowerCase() === value && user.id !== exceptId)
}

export function usernameTaken(users: AdminUserRecord[], username: string, exceptId?: number): boolean {
  const value = username.trim().toLowerCase()
  return users.some((user) => user.username.toLowerCase() === value && user.id !== exceptId)
}
