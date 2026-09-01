import { useEffect, useMemo, useState, type ReactNode, type SVGProps } from 'react'
import clsx from 'clsx'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { COGI_LOGO } from '@/lib/brand'
import NotificationsBell from '@/components/NotificationsBell'
import { getPreviewUrl } from '@/utils/preview'
import { isDemoMode } from '@/services/strapi'

type NavItem = { label: string; to: string; hint: string }

function Icon({ children, ...props }: SVGProps<SVGSVGElement> & { children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="1em" height="1em" aria-hidden="true" {...props}>
      {children}
    </svg>
  )
}
function IconMenu(props: SVGProps<SVGSVGElement>) {
  return <Icon {...props}><path d="M4 6h16M4 12h16M4 18h16" /></Icon>
}
function IconSearch(props: SVGProps<SVGSVGElement>) {
  return <Icon {...props}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></Icon>
}
function IconX(props: SVGProps<SVGSVGElement>) {
  return <Icon {...props}><path d="M18 6 6 18M6 6l12 12" /></Icon>
}
function IconChevronLeft(props: SVGProps<SVGSVGElement>) {
  return <Icon {...props}><path d="m15 18-6-6 6-6" /></Icon>
}
function IconChevronRight(props: SVGProps<SVGSVGElement>) {
  return <Icon {...props}><path d="m9 18 6-6-6-6" /></Icon>
}
function IconExternal(props: SVGProps<SVGSVGElement>) {
  return <Icon {...props}><path d="M15 3h6v6" /><path d="M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /></Icon>
}
function IconLogout(props: SVGProps<SVGSVGElement>) {
  return <Icon {...props}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="M16 17l5-5-5-5" /><path d="M21 12H9" /></Icon>
}
function IconDashboard(props: SVGProps<SVGSVGElement>) {
  return <Icon {...props}><rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" /><rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" /></Icon>
}

const groups: Array<{ label: string; items: NavItem[] }> = [
  {
    label: 'Start here',
    items: [{ label: 'Dashboard', to: '/dashboard', hint: 'A quick look at the site' }],
  },
  {
    label: 'Look of the site',
    items: [
      { label: 'Colors & fonts', to: '/theme', hint: 'Match the public website' },
      { label: 'Search & sharing', to: '/seo', hint: 'How the site appears in Google' },
      { label: 'Top menu bar', to: '/header', hint: 'Logo, links, Donate button' },
      { label: 'Footer', to: '/footer', hint: 'Bottom of every page' },
      { label: 'Menus', to: '/navigation', hint: 'What appears in header & footer' },
    ],
  },
  {
    label: 'Website content',
    items: [
      { label: 'Homepage', to: '/homepage', hint: 'Welcome banner and homepage blocks' },
      { label: 'Site pages', to: '/website-copy', hint: 'About, Donate, Contact, and more' },
      { label: 'Custom pages', to: '/pages', hint: 'Extra pages that are not in the main site' },
      { label: 'Photos & files', to: '/media', hint: 'Upload images and videos' },
      { label: 'Programs', to: '/programs', hint: 'Training and ministry areas' },
      { label: 'Blog', to: '/blog', hint: 'News and articles' },
      { label: 'Events', to: '/events', hint: 'Upcoming gatherings' },
      { label: 'Stories', to: '/stories', hint: 'Stories of transformation' },
      { label: 'Testimonials', to: '/testimonials', hint: 'Quotes from the community' },
      { label: 'Team', to: '/team', hint: 'Board and global team' },
      { label: 'Partners', to: '/partners', hint: 'Organizations we walk with' },
      { label: 'Locations', to: '/locations', hint: 'Countries on the map' },
    ],
  },
  {
    label: 'Inbox',
    items: [
      { label: 'Messages', to: '/enquiries', hint: 'Contact and join forms' },
      { label: 'Newsletter', to: '/newsletter', hint: 'People who signed up' },
    ],
  },
  {
    label: 'Admin',
    items: [
      { label: 'Settings', to: '/settings', hint: 'Organization details' },
      { label: 'People', to: '/users', hint: 'Who can log in' },
      { label: 'Activity log', to: '/audit', hint: 'What changed, and when' },
      { label: 'My account', to: '/profile', hint: 'Password and name' },
    ],
  },
]

function pageTitle(pathname: string) {
  const all = groups.flatMap((g) => g.items)
  const match = all.find((item) => pathname === item.to || pathname.startsWith(`${item.to}/`))
  return match?.label || 'Admin'
}

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [search, setSearch] = useState('')

  const filteredGroups = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return groups
    return groups
      .map((group) => ({
        ...group,
        items: group.items.filter(
          (item) =>
            item.label.toLowerCase().includes(q) ||
            item.hint.toLowerCase().includes(q) ||
            group.label.toLowerCase().includes(q),
        ),
      }))
      .filter((group) => group.items.length > 0)
  }, [search])

  const title = pageTitle(location.pathname)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1024px)')
    const sync = () => {
      if (mq.matches) {
        setCollapsed(false)
      } else {
        setMobileOpen(false)
      }
    }
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className={clsx('admin-shell', collapsed && 'admin-shell-collapsed')}>
      {mobileOpen ? (
        <button type="button" className="admin-sidebar-backdrop" aria-label="Close menu" onClick={() => setMobileOpen(false)} />
      ) : null}

      <aside className={clsx('admin-sidebar', mobileOpen && 'admin-sidebar-mobile-open', collapsed && 'admin-sidebar-collapsed')}>
        <div className="admin-sidebar-brand">
          {!collapsed ? (
            <NavLink to="/dashboard" className="admin-brand-link" onClick={() => setMobileOpen(false)}>
              <img src={COGI_LOGO} alt="COGI" className="admin-brand-logo" width={48} height={48} />
              <div>
                <p className="admin-sidebar-eyebrow">COGI</p>
                <h2>Website admin</h2>
              </div>
            </NavLink>
          ) : (
            <NavLink to="/dashboard" className="admin-sidebar-mark" aria-label="Dashboard">
              <img src={COGI_LOGO} alt="COGI" width={36} height={36} />
            </NavLink>
          )}
          <button type="button" className="admin-icon-btn admin-sidebar-close" onClick={() => setMobileOpen(false)} aria-label="Close menu">
            <IconX />
          </button>
          <button type="button" className="admin-icon-btn admin-sidebar-collapse" onClick={() => setCollapsed((v) => !v)} aria-label="Toggle sidebar">
            {collapsed ? <IconChevronRight /> : <IconChevronLeft />}
          </button>
        </div>

        {!collapsed ? (
          <div className="admin-sidebar-search">
            <IconSearch />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Find a section…"
              aria-label="Search admin sections"
            />
            <button
              type="button"
              className="admin-icon-btn"
              onClick={() => setSearch('')}
              aria-label="Clear search"
              disabled={!search}
              style={{ visibility: search ? 'visible' : 'hidden' }}
            >
              <IconX />
            </button>
          </div>
        ) : null}

        {isDemoMode() && !collapsed ? (
          <div className="admin-demo-pill">Practice mode — nothing is sent to a live server</div>
        ) : null}

        <nav className="admin-sidebar-nav">
          {filteredGroups.map((group) => (
            <div key={group.label} className="admin-sidebar-group">
              {!collapsed ? <p className="admin-sidebar-group-label">{group.label}</p> : null}
              {group.items.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  title={collapsed ? item.label : undefined}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) => clsx('admin-nav-item', isActive && 'admin-nav-item-active')}
                >
                  {item.to === '/dashboard' ? <IconDashboard className="admin-nav-icon" /> : <span className="admin-nav-dot" aria-hidden="true" />}
                  {!collapsed ? (
                    <span className="admin-nav-copy">
                      <span className="admin-nav-label">{item.label}</span>
                      <span className="admin-nav-hint">{item.hint}</span>
                    </span>
                  ) : null}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <a className="admin-preview-btn" href={getPreviewUrl('/')} target="_blank" rel="noreferrer">
          <IconExternal />
          {!collapsed ? <span>View the website</span> : null}
        </a>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button type="button" className="admin-icon-btn admin-mobile-menu" onClick={() => setMobileOpen(true)} aria-label="Open menu">
              <IconMenu />
            </button>
            {collapsed ? (
              <button type="button" className="admin-icon-btn" onClick={() => setCollapsed(false)} aria-label="Expand sidebar">
                <IconChevronRight />
              </button>
            ) : null}
            <div className="admin-topbar-title-block">
              <p className="admin-breadcrumb">Admin</p>
              <h1>{title}</h1>
            </div>
          </div>

          <div className="admin-topbar-toolbar">
            <a className="admin-ghost-btn" href={getPreviewUrl('/')} target="_blank" rel="noreferrer">
              <IconExternal />
              <span>View site</span>
            </a>
            <NotificationsBell />
            <span className="admin-topbar-sep" aria-hidden="true" />
            <span className="admin-role-chip">{user?.firstname || user?.username || 'Admin'}</span>
            <button type="button" className="admin-ghost-btn admin-logout-btn" onClick={handleLogout}>
              <IconLogout />
              <span>Log out</span>
            </button>
          </div>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>

        <footer className="admin-footer">
          <div className="admin-footer-inner">
            <div className="admin-footer-brand">
              <img src={COGI_LOGO} alt="" width={28} height={28} />
              <span>Companions of Grace International</span>
            </div>
            <p>Admin for the Companions of Grace website</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
