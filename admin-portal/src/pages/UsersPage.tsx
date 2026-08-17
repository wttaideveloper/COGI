import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import {
  USER_ROLES,
  applyUserDraft,
  countSuperAdmins,
  createUser,
  emailTaken,
  loadPasswords,
  loadUsers,
  removeUserPassword,
  saveUsers,
  setUserPassword,
  usernameTaken,
  type UserDraft,
  type UserRoleType,
} from '@/services/users'
import type { AdminUserRecord } from '@/types'

type Filter = 'all' | UserRoleType | 'blocked'

const emptyDraft = (): UserDraft => ({
  firstname: '',
  lastname: '',
  username: '',
  email: '',
  password: '',
  roleType: 'editor',
  blocked: false,
})

function initials(user: AdminUserRecord) {
  const first = user.firstname?.[0] || user.username[0] || '?'
  const last = user.lastname?.[0] || user.email[1] || ''
  return `${first}${last}`.toUpperCase()
}

function displayName(user: AdminUserRecord) {
  const name = [user.firstname, user.lastname].filter(Boolean).join(' ')
  return name || user.username
}

function roleClass(type?: string) {
  if (type === 'super-admin') return 'badge bg-emerald-50 text-emerald-800'
  if (type === 'viewer') return 'badge bg-slate-100 text-slate-700'
  return 'badge bg-amber-50 text-amber-800'
}

export default function UsersPage() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState<AdminUserRecord[]>(() => loadUsers())
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [editing, setEditing] = useState<AdminUserRecord | 'new' | null>(null)
  const [draft, setDraft] = useState<UserDraft>(emptyDraft())
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!editing) return
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setEditing(null)
        setError('')
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [editing])

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return users.filter((user) => {
      const matchesFilter =
        filter === 'all' ||
        (filter === 'blocked' ? user.blocked : user.role?.type === filter)
      if (!matchesFilter) return false
      if (!q) return true
      return [user.username, user.email, user.firstname, user.lastname, user.role?.name]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(q)
    })
  }, [users, query, filter])

  function persist(next: AdminUserRecord[]) {
    setUsers(next)
    saveUsers(next)
  }

  function flash(next: string) {
    setMessage(next)
    window.setTimeout(() => setMessage(''), 2800)
  }

  function openCreate() {
    setError('')
    setDraft(emptyDraft())
    setEditing('new')
  }

  function openEdit(user: AdminUserRecord) {
    setError('')
    setDraft({
      firstname: user.firstname || '',
      lastname: user.lastname || '',
      username: user.username,
      email: user.email,
      password: '',
      roleType: (user.role?.type as UserRoleType) || 'editor',
      blocked: user.blocked,
    })
    setEditing(user)
  }

  function closeModal() {
    setEditing(null)
    setError('')
  }

  function saveDraft() {
    if (!draft.firstname.trim() || !draft.lastname.trim()) {
      setError('First and last name are required.')
      return
    }
    if (!draft.email.trim() || !draft.email.includes('@')) {
      setError('Enter a valid email address.')
      return
    }
    const exceptId = editing === 'new' || !editing ? undefined : editing.id
    if (emailTaken(users, draft.email, exceptId)) {
      setError('That email is already in use.')
      return
    }
    const username = draft.username.trim() || draft.email.split('@')[0]
    if (usernameTaken(users, username, exceptId)) {
      setError('That username is already in use.')
      return
    }
    if (editing === 'new' && (!draft.password || draft.password.length < 6)) {
      setError('Password must be at least 6 characters.')
      return
    }

    if (editing === 'new') {
      const created = createUser({ ...draft, username })
      if (draft.password) setUserPassword(created.email, draft.password)
      persist([created, ...users])
      flash('User added. They can sign in with the email and password you set.')
      closeModal()
      return
    }

    if (editing) {
      const next = applyUserDraft(editing, { ...draft, username })
      if (next.blocked && next.role?.type === 'super-admin' && countSuperAdmins(users) <= 1) {
        setError('Keep at least one active Super Admin.')
        return
      }
      if (editing.email !== next.email) {
        const previous = loadPasswords()[editing.email.toLowerCase()]
        removeUserPassword(editing.email)
        if (previous && !(draft.password && draft.password.length >= 6)) setUserPassword(next.email, previous)
      }
      if (draft.password && draft.password.length >= 6) setUserPassword(next.email, draft.password)
      persist(users.map((user) => (user.id === editing.id ? next : user)))
      flash('User updated.')
      closeModal()
    }
  }

  function toggleBlocked(user: AdminUserRecord) {
    if (user.id === currentUser?.id) {
      flash('You cannot block your own account.')
      return
    }
    if (!user.blocked && user.role?.type === 'super-admin' && countSuperAdmins(users) <= 1) {
      flash('Keep at least one active Super Admin.')
      return
    }
    persist(users.map((item) => (item.id === user.id ? { ...item, blocked: !item.blocked } : item)))
    flash(user.blocked ? `${displayName(user)} is active again.` : `${displayName(user)} is blocked.`)
  }

  function removeUser(user: AdminUserRecord) {
    if (user.id === currentUser?.id) {
      flash('You cannot delete your own account.')
      return
    }
    if (user.role?.type === 'super-admin' && countSuperAdmins(users) <= 1) {
      flash('Keep at least one Super Admin.')
      return
    }
    if (!window.confirm(`Delete ${displayName(user)}? They will no longer be able to sign in.`)) return
    removeUserPassword(user.email)
    persist(users.filter((item) => item.id !== user.id))
    flash('User deleted.')
  }

  const filters: Array<{ id: Filter; label: string }> = [
    { id: 'all', label: 'All' },
    { id: 'super-admin', label: 'Super Admin' },
    { id: 'editor', label: 'Editor' },
    { id: 'viewer', label: 'Viewer' },
    { id: 'blocked', label: 'Blocked' },
  ]

  return (
    <>
      <div className="mb-2 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-[var(--color-primary)]">Users & roles</h2>
          <p className="mt-1 max-w-3xl text-sm text-slate-600">
            Invite people who should manage the COGI website. Super Admins can add users; Editors publish content; Viewers can look but not change.
          </p>
        </div>
        <button type="button" className="btn-primary" onClick={openCreate}>
          Add user
        </button>
      </div>

      {message ? <p className="admin-flash">{message}</p> : null}

      <div className="admin-toolbar">
        <input
          className="admin-input admin-toolbar-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, email, or username…"
          aria-label="Search users"
        />
        <p className="admin-toolbar-count">
          {visible.length} {visible.length === 1 ? 'user' : 'users'}
        </p>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {filters.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`admin-section-tab${filter === item.id ? ' admin-section-tab-active' : ''}`}
            onClick={() => setFilter(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="admin-card p-10 text-center">
          <h3 className="text-lg font-bold">No users match</h3>
          <p className="mt-2 text-sm text-slate-600">Try a different search, or add a new user.</p>
        </div>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Person</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="user-cell">
                      <span className="user-avatar" aria-hidden="true">{initials(user)}</span>
                      <div>
                        <div className="font-semibold">{displayName(user)}</div>
                        <div className="text-xs text-slate-500">@{user.username}</div>
                      </div>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td><span className={roleClass(user.role?.type)}>{user.role?.name || 'Editor'}</span></td>
                  <td>
                    <span className={`badge ${user.blocked ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>
                      {user.blocked ? 'Blocked' : 'Active'}
                    </span>
                  </td>
                  <td>
                    <div className="flex flex-wrap gap-2">
                      <button type="button" className="btn-secondary px-3 py-1" onClick={() => openEdit(user)}>Edit</button>
                      <button type="button" className="btn-secondary px-3 py-1" onClick={() => toggleBlocked(user)}>
                        {user.blocked ? 'Unblock' : 'Block'}
                      </button>
                      <button type="button" className="btn-danger px-3 py-1" onClick={() => removeUser(user)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing ? (
        <div className="admin-modal-backdrop" role="presentation" onClick={closeModal}>
          <div className="admin-modal" role="dialog" aria-labelledby="user-modal-title" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h3 id="user-modal-title" className="text-xl font-extrabold text-[var(--color-primary)]">
                  {editing === 'new' ? 'Add user' : `Edit ${displayName(editing)}`}
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  {editing === 'new' ? 'They can sign in to the admin portal with this email and password.' : 'Update their name, role, or access.'}
                </p>
              </div>
              <button type="button" className="admin-icon-btn admin-modal-close" onClick={closeModal} aria-label="Close">
                ×
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="admin-label">First name</span>
                <input className="admin-input" value={draft.firstname} onChange={(e) => setDraft({ ...draft, firstname: e.target.value })} />
              </label>
              <label className="block">
                <span className="admin-label">Last name</span>
                <input className="admin-input" value={draft.lastname} onChange={(e) => setDraft({ ...draft, lastname: e.target.value })} />
              </label>
              <label className="block">
                <span className="admin-label">Username</span>
                <input className="admin-input" value={draft.username} placeholder="Optional — defaults from email" onChange={(e) => setDraft({ ...draft, username: e.target.value })} />
              </label>
              <label className="block">
                <span className="admin-label">Email</span>
                <input className="admin-input" type="email" value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} />
              </label>
              {editing === 'new' ? (
                <label className="block sm:col-span-2">
                  <span className="admin-label">Password</span>
                  <input className="admin-input" type="password" value={draft.password} onChange={(e) => setDraft({ ...draft, password: e.target.value })} placeholder="At least 6 characters" />
                </label>
              ) : (
                <label className="block sm:col-span-2">
                  <span className="admin-label">New password</span>
                  <input className="admin-input" type="password" value={draft.password} onChange={(e) => setDraft({ ...draft, password: e.target.value })} placeholder="Leave blank to keep the current password" />
                </label>
              )}
              <label className="block sm:col-span-2">
                <span className="admin-label">Role</span>
                <select className="admin-input" value={draft.roleType} onChange={(e) => setDraft({ ...draft, roleType: e.target.value as UserRoleType })}>
                  {USER_ROLES.map((role) => (
                    <option key={role.type} value={role.type}>
                      {role.name} — {role.description}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex items-center gap-2 text-sm font-semibold sm:col-span-2">
                <input type="checkbox" checked={draft.blocked} onChange={(e) => setDraft({ ...draft, blocked: e.target.checked })} />
                Block this account (cannot sign in)
              </label>
            </div>

            {error ? <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}

            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <button type="button" className="btn-secondary" onClick={closeModal}>Cancel</button>
              <button type="button" className="btn-primary" onClick={saveDraft}>
                {editing === 'new' ? 'Add user' : 'Save changes'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
