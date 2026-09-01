import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchLeads, markNotificationsRead, type LeadNotification } from '@/services/leads'

function timeLabel(value: string) {
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value
  return parsed.toLocaleString()
}

export default function NotificationsBell() {
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<LeadNotification[]>([])
  const rootRef = useRef<HTMLDivElement>(null)
  const unread = items.filter((item) => !item.read).length

  async function refresh() {
    const data = await fetchLeads()
    setItems(data.notifications)
  }

  useEffect(() => {
    void refresh()
    const timer = window.setInterval(() => { void refresh() }, 4000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  async function markAllRead() {
    await markNotificationsRead()
    setItems((prev) => prev.map((item) => ({ ...item, read: true })))
  }

  return (
    <div className="admin-notify" ref={rootRef}>
      <button
        type="button"
        className="admin-icon-btn"
        aria-label={unread ? `${unread} new notifications` : 'Notifications'}
        onClick={() => setOpen((value) => !value)}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18" aria-hidden="true">
          <path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10 21a2 2 0 0 0 4 0" />
        </svg>
        {unread ? <span className="admin-notify-badge">{unread > 9 ? '9+' : unread}</span> : null}
      </button>
      {open ? (
        <div className="admin-notify-panel">
          <div className="admin-notify-head">
            <strong>Notifications</strong>
            {unread ? (
              <button type="button" className="admin-notify-clear" onClick={() => { void markAllRead() }}>
                Mark all read
              </button>
            ) : null}
          </div>
          {items.length === 0 ? (
            <p className="admin-notify-empty">No new notices yet.</p>
          ) : (
            <ul>
              {items.slice(0, 12).map((item) => (
                <li key={item.id} className={item.read ? '' : 'unread'}>
                  <Link to={item.href} onClick={() => setOpen(false)}>
                    <span>{item.title}</span>
                    <small>{item.body}</small>
                    <small>{timeLabel(item.createdAt)}</small>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <Link className="admin-notify-foot" to="/enquiries" onClick={() => setOpen(false)}>
            Open inbox
          </Link>
        </div>
      ) : null}
    </div>
  )
}
