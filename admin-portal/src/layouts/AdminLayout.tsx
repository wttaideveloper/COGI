import { useMemo, useState, type ReactNode, type SVGProps } from 'react'
import clsx from 'clsx'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
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
    label: 'Overview',
    items: [{ label: 'Dashboard', to: '/dashboard', hint: 'Stats & quick actions' }],
  },
  {
    label: 'Site setup',
    items: [
      { label: 'Theme & Branding', to: '/theme', hint: 'Colors & fonts' },
      { label: 'SEO & Social', to: '/seo', hint: 'Search & share metadata' },
      { label: 'Header', to: '/header', hint: 'Logo & navigation bar' },
      { label: 'Footer', to: '/footer', hint: 'Footer content & colors' },
      { label: 'Pages & Menus', to: '/navigation', hint: 'Drag header & footer links' },
      { label: 'Website Copy', to: '/website-copy', hint: 'All page headlines & photos' },
    ],
  },
  {
    label: 'Content',
    items: [
      { label: 'Homepage', to: '/homepage', hint: 'Hero, mission, sections' },
      { label: 'Pages', to: '/pages', hint: 'Create & edit pages' },
      { label: 'Media', to: '/media', hint: 'Images & files' },
      { label: 'Programs', to: '/programs', hint: 'Ministry pathways' },
      { label: 'Blog', to: '/blog', hint: 'News & articles' },
      { label: 'Events', to: '/events', hint: 'Calendar listings' },
      { label: 'Stories', to: '/stories', hint: 'Transformation stories' },
      { label: 'Testimonials', to: '/testimonials', hint: 'Quotes & video' },
      { label: 'Team', to: '/team', hint: 'Board & global team' },
      { label: 'Partners', to: '/partners', hint: 'Partner logos' },
      { label: 'Locations', to: '/locations', hint: 'Where we serve' },
    ],
  },
  {
    label: 'Engagement',
    items: [
      { label: 'Enquiries', to: '/enquiries', hint: 'Contact & join forms' },
      { label: 'Newsletter', to: '/newsletter', hint: 'Subscribers & export' },
    ],
  },
  {
    label: 'System',
    items: [
      { label: 'Settings', to: '/settings', hint: 'Org identity & maintenance' },
      { label: 'Users', to: '/users', hint: 'Roles & accounts' },
      { label: 'Audit', to: '/audit', hint: 'Admin activity log' },
      { label: 'Profile', to: '/profile', hint: 'Password & account' },
    ],
  },
]

function pageTitle(pathname: string) {
  const all = groups.flatMap((g) => g.items)
  const match = all.find((item) => pathname === item.to || pathname.startsWith(`${item.to}/`))
  return match?.label || 'CMS Administration'
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
              <img src="/cogi-admin-logo.svg" alt="" className="admin-brand-logo" width={40} height={40} />
              <div>
                <p className="admin-sidebar-eyebrow">COGI</p>
                <h2>Admin Portal</h2>
              </div>
            </NavLink>
          ) : (
            <NavLink to="/dashboard" className="admin-sidebar-mark" aria-label="Dashboard">
              <img src="/cogi-admin-logo.svg" alt="" width={32} height={32} />
            </NavLink>
          )}
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
              placeholder="Search sections..."
              aria-label="Search admin sections"
            />
            {search ? (
              <button type="button" className="admin-icon-btn" onClick={() => setSearch('')} aria-label="Clear search">
                <IconX />
              </button>
            ) : null}
          </div>
        ) : null}

        {isDemoMode() && !collapsed ? (
          <div className="admin-demo-pill">Demo mode · mock data</div>
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
          {!collapsed ? <span>Preview website</span> : null}
        </a>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar-left">
            <button type="button" className="admin-icon-btn admin-mobile-menu" onClick={() => setMobileOpen(true)} aria-label="Open menu">
              <IconMenu />
            </button>
            <div className="admin-topbar-title-block">
              <p className="admin-breadcrumb">COGI CMS / {title}</p>
              <h1>{title}</h1>
              <p className="admin-topbar-sub">
                Signed in as <strong>{user?.firstname || user?.username || user?.email}</strong>
                <span className="admin-role-chip">{user?.role?.name || 'Administrator'}</span>
              </p>
            </div>
          </div>

          <div className="admin-topbar-toolbar">
            <a className="admin-ghost-btn" href={getPreviewUrl('/')} target="_blank" rel="noreferrer">
              <IconExternal />
              <span>Open site</span>
            </a>
            <span className="admin-topbar-sep" aria-hidden="true" />
            <button type="button" className="admin-ghost-btn admin-logout-btn" onClick={handleLogout}>
              <IconLogout />
              <span>Logout</span>
            </button>
          </div>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>

        <footer className="admin-footer">
          <div className="admin-footer-inner">
            <div className="admin-footer-brand">
              <img src="/cogi-admin-logo.svg" alt="" width={24} height={24} />
              <span>Companions of Grace International</span>
            </div>
            <p>Admin Portal · Content management for coginternational.org</p>
          </div>
        </footer>
      </div>
    </div>
  )
}
