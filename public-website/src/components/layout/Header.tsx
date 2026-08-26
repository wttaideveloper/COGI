import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { clsx } from 'clsx'
import { ButtonLink } from '@/components/ui/Button'
import { useSiteConfig } from '@/contexts/SiteConfigContext'
import type { SiteNavItem } from '@/lib/siteConfig'

const fallbackNav: SiteNavItem[] = [
  {
    id: 'about',
    label: 'About',
    href: '/about',
    children: [
      { id: 'a1', label: 'Vision & Mission', href: '/about' },
      { id: 'a2', label: 'Our Story', href: '/about/our-story' },
      { id: 'a3', label: 'Board Members', href: '/about/board' },
      { id: 'a4', label: 'Global Team', href: '/about/global-team' },
      { id: 'a5', label: 'Our Beliefs', href: '/about/beliefs' },
      { id: 'a6', label: 'Our Partners', href: '/about/partners' },
    ],
  },
  { id: 'programs', label: 'Programs', href: '/programs' },
  { id: 'resources', label: 'Resources', href: '/resources' },
  { id: 'events', label: 'Events', href: '/events' },
  { id: 'involved', label: 'Get Involved', href: '/get-involved' },
  { id: 'contact', label: 'Contact', href: '/contact' },
]

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  clsx(
    'rounded-md px-3 py-2 text-xs font-bold uppercase tracking-[0.18em]',
    isActive ? 'text-current' : 'text-current',
  )

export function Header() {
  const { header, headerNav } = useSiteConfig()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openId, setOpenId] = useState<string | null>(null)
  const items = (headerNav.length ? headerNav : fallbackNav).filter((item) => item.visible !== false)
  const sticky = header.sticky !== false

  return (
    <header
      className={clsx('z-40 border-b border-white/15', sticky ? 'sticky top-0' : 'relative')}
      style={{ backgroundColor: header.backgroundColor || '#2B6CB0', color: header.textColor || '#ffffff' }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
        <Link to="/" className="flex min-w-0 items-center gap-3" aria-label="Companions of Grace International — Home">
          {header.logoUrl ? (
            <img
              src={header.logoUrl}
              alt={header.logoAlt || 'Companions of Grace International'}
              className="max-w-[240px] object-contain"
              style={{ height: header.logoHeight || 48 }}
            />
          ) : (
            <span className="flex flex-col text-current">
              <span className="font-display text-xl font-bold leading-tight md:text-2xl">Companions of Grace</span>
              <span className="text-[0.65rem] font-semibold uppercase tracking-[0.38em] opacity-80">International</span>
            </span>
          )}
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {items.map((item) => {
            const children = (item.children || []).filter((child) => child.visible !== false)
            if (children.length) {
              const open = openId === item.id
              return (
                <div
                  key={item.id}
                  className="relative"
                  onMouseEnter={() => setOpenId(item.id)}
                  onMouseLeave={() => setOpenId(null)}
                >
                  <button
                    type="button"
                    className="flex items-center gap-1 rounded-md px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-current"
                    aria-expanded={open}
                    aria-haspopup="true"
                  >
                    {item.label}
                    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                      <path d="M3 5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" fill="none" />
                    </svg>
                  </button>
                  {open ? (
                    <ul className="absolute left-0 top-full min-w-[200px] rounded-lg border border-mist-dark bg-white py-2 shadow-lg" role="menu">
                      {children.map((child) => (
                        <li key={child.id} role="none">
                          <NavLink to={child.href} className="block px-4 py-2 text-sm text-ink" role="menuitem">
                            {child.label}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              )
            }
            return (
              <NavLink key={item.id} to={item.href} className={navLinkClass}>
                {item.label}
              </NavLink>
            )
          })}

          <Link to="/search" className="rounded-md p-2 text-current" aria-label="Search site">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="2" />
              <path d="M14 14l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </Link>

          <ButtonLink
            to={header.ctaLink || '/donate'}
            size="sm"
            className="rounded-sm bg-white uppercase tracking-[0.2em] hover:bg-white/90"
            style={{ color: header.backgroundColor || '#2B6CB0', backgroundColor: '#ffffff' }}
          >
            {header.ctaText || 'Donate'}
          </ButtonLink>
        </nav>

        <button
          type="button"
          className="rounded-md p-2 text-current lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileOpen ? (
            <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          )}
        </button>
      </div>

      {mobileOpen ? (
        <nav id="mobile-menu" className="border-t border-current/10 bg-inherit px-4 py-4 lg:hidden" aria-label="Mobile navigation">
          <ul className="space-y-1">
            {items.map((item) => (
              <li key={item.id}>
                <NavLink to={item.href} className={navLinkClass} onClick={() => setMobileOpen(false)}>
                  {item.label}
                </NavLink>
                {(item.children || []).filter((c) => c.visible !== false).map((child) => (
                  <NavLink key={child.id} to={child.href} className={navLinkClass} onClick={() => setMobileOpen(false)}>
                    {child.label}
                  </NavLink>
                ))}
              </li>
            ))}
            <li className="pt-2">
              <ButtonLink
                to={header.ctaLink || '/donate'}
                className="w-full bg-white hover:bg-white/90"
                style={{ color: header.backgroundColor || '#2B6CB0', backgroundColor: '#ffffff' }}
                onClick={() => setMobileOpen(false)}
              >
                {header.ctaText || 'Donate'}
              </ButtonLink>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  )
}
