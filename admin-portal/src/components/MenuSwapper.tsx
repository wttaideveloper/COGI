import { useState } from 'react'
import type { NavItem } from '@/types'

type Props = {
  items: NavItem[]
  onChange: (items: NavItem[]) => void
  title?: string
}

function GripIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="9" cy="6" r="1.5" />
      <circle cx="15" cy="6" r="1.5" />
      <circle cx="9" cy="12" r="1.5" />
      <circle cx="15" cy="12" r="1.5" />
      <circle cx="9" cy="18" r="1.5" />
      <circle cx="15" cy="18" r="1.5" />
    </svg>
  )
}

export default function MenuSwapper({ items, onChange, title = 'Menu items' }: Props) {
  const [draftLabel, setDraftLabel] = useState('')
  const [draftHref, setDraftHref] = useState('')
  const [dragId, setDragId] = useState<string | null>(null)
  const [overId, setOverId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)

  function reorder(fromId: string, toId: string) {
    if (fromId === toId) return
    const next = [...items]
    const fromIndex = next.findIndex((item) => item.id === fromId)
    const toIndex = next.findIndex((item) => item.id === toId)
    if (fromIndex < 0 || toIndex < 0) return
    const [row] = next.splice(fromIndex, 1)
    next.splice(toIndex, 0, row)
    onChange(next)
  }

  function update(id: string, patch: Partial<NavItem>) {
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)))
  }

  function remove(id: string) {
    onChange(items.filter((item) => item.id !== id))
  }

  function addItem() {
    if (!draftLabel.trim() || !draftHref.trim()) return
    onChange([
      ...items,
      {
        id: `nav-${Date.now()}`,
        label: draftLabel.trim(),
        href: draftHref.trim(),
        visible: true,
        children: [],
      },
    ])
    setDraftLabel('')
    setDraftHref('')
  }

  function addChild(parentId: string) {
    onChange(
      items.map((item) =>
        item.id === parentId
          ? {
              ...item,
              children: [
                ...(item.children || []),
                { id: `nav-child-${Date.now()}`, label: 'New submenu', href: '/', visible: true },
              ],
            }
          : item,
      ),
    )
    setEditingId(parentId)
  }

  function updateChild(parentId: string, childId: string, patch: Partial<NavItem>) {
    onChange(
      items.map((item) =>
        item.id === parentId
          ? {
              ...item,
              children: (item.children || []).map((child) => (child.id === childId ? { ...child, ...patch } : child)),
            }
          : item,
      ),
    )
  }

  function removeChild(parentId: string, childId: string) {
    onChange(
      items.map((item) =>
        item.id === parentId
          ? { ...item, children: (item.children || []).filter((child) => child.id !== childId) }
          : item,
      ),
    )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3 text-sm text-slate-600">
        Drag the grip handle to reorder {title.toLowerCase()}. Toggle visibility, edit links, and add submenu items.
      </div>

      <div className="space-y-2">
        {items.map((item) => {
          const visible = item.visible !== false
          const isEditing = editingId === item.id
          return (
            <div key={item.id} className="space-y-2">
              <div
                className={`menu-row${overId === item.id ? ' menu-row-over' : ''}${!visible ? ' menu-row-hidden' : ''}`}
                draggable
                onDragStart={(e) => {
                  setDragId(item.id)
                  e.dataTransfer.effectAllowed = 'move'
                  e.dataTransfer.setData('text/plain', item.id)
                }}
                onDragOver={(e) => {
                  e.preventDefault()
                  setOverId(item.id)
                }}
                onDragLeave={() => setOverId((current) => (current === item.id ? null : current))}
                onDrop={(e) => {
                  e.preventDefault()
                  const fromId = e.dataTransfer.getData('text/plain') || dragId
                  if (fromId) reorder(fromId, item.id)
                  setDragId(null)
                  setOverId(null)
                }}
                onDragEnd={() => {
                  setDragId(null)
                  setOverId(null)
                }}
              >
                <button type="button" className="menu-drag" aria-label="Drag to reorder" title="Drag to reorder">
                  <GripIcon />
                </button>
                <div className="menu-row-main">
                  <span className="menu-row-title">{item.label || 'Untitled'}</span>
                  <span className={`menu-visibility-pill ${visible ? 'visible' : 'hidden'}`}>{visible ? 'Visible' : 'Hidden'}</span>
                  {(item.children?.length || 0) > 0 ? (
                    <span className="menu-subcount">{item.children!.length} submenu</span>
                  ) : null}
                </div>
                <div className="menu-row-controls">
                  <button type="button" className="admin-ghost-btn" onClick={() => addChild(item.id)}>
                    + Submenu
                  </button>
                  <button type="button" className="admin-ghost-btn" onClick={() => setEditingId(isEditing ? null : item.id)}>
                    {isEditing ? 'Done' : 'Edit'}
                  </button>
                  <button type="button" className="admin-ghost-btn text-red-700" onClick={() => remove(item.id)}>
                    Remove
                  </button>
                  <label className="menu-show-toggle">
                    <span>Show</span>
                    <input type="checkbox" checked={visible} onChange={(e) => update(item.id, { visible: e.target.checked })} />
                  </label>
                </div>
              </div>

              {isEditing ? (
                <div className="menu-inline-edit">
                  <label className="block">
                    <span className="admin-label">Menu name</span>
                    <input className="admin-input" value={item.label} onChange={(e) => update(item.id, { label: e.target.value })} />
                  </label>
                  <label className="block">
                    <span className="admin-label">URL / path</span>
                    <input className="admin-input" value={item.href} onChange={(e) => update(item.id, { href: e.target.value })} />
                  </label>
                  {(item.children || []).map((child) => (
                    <div key={child.id} className="menu-child-edit">
                      <input className="admin-input" value={child.label} onChange={(e) => updateChild(item.id, child.id, { label: e.target.value })} placeholder="Submenu label" />
                      <input className="admin-input" value={child.href} onChange={(e) => updateChild(item.id, child.id, { href: e.target.value })} placeholder="/path" />
                      <button type="button" className="btn-danger px-3 py-1" onClick={() => removeChild(item.id, child.id)}>
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          )
        })}
      </div>

      <div className="admin-card grid gap-3 p-4 md:grid-cols-[1fr_1fr_auto]">
        <label className="block">
          <span className="admin-label">New label</span>
          <input className="admin-input" value={draftLabel} onChange={(e) => setDraftLabel(e.target.value)} placeholder="Get Involved" />
        </label>
        <label className="block">
          <span className="admin-label">New URL</span>
          <input className="admin-input" value={draftHref} onChange={(e) => setDraftHref(e.target.value)} placeholder="/get-involved" />
        </label>
        <button type="button" className="btn-primary self-end" onClick={addItem}>
          Add menu item
        </button>
      </div>
    </div>
  )
}
