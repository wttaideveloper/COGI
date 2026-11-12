import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { clsx } from 'clsx'
import { ButtonLink } from '@/components/ui/Button'
import { useSiteConfig } from '@/contexts/SiteConfigContext'
import type { PublicCustomPage, SiteNavItem } from '@/lib/siteConfig'
import { isLightColor } from '@/lib/utils'

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

const LABEL_HREF: Record<string, string> = {
  contact: '/contact',
  'contact us': '/contact',
  donate: '/donate',
  about: '/about',
  'about us': '/about',
  programs: '/programs',
  resources: '/resources',
  events: '/events',
  'get involved': '/get-involved',
  volunteer: '/get-involved',
  'join us': '/get-involved',
  privacy: '/privacy-policy',
  'privacy policy': '/privacy-policy',
}

const PATH_ALIASES: Record<string, string> = {
  '/contact-us': '/contact',
  '/privacy': '/privacy-policy',
  '/privacy-policy': '/privacy-policy',
  '/terms': '/terms-of-use',
  '/terms-of-use': '/terms-of-use',
  '/cookies': '/cookie-notice',
  '/cookie-notice': '/cookie-notice',
  '/accessibility': '/accessibility',
}

export function resolveNavHref(item: { href?: string; label: string }): string {
  const raw = (item.href || '').trim()
  let path = '/'
  if (raw.startsWith('http://') || raw.startsWith('https://') || raw.startsWith('mailto:')) return raw
  if (raw.startsWith('/')) path = raw
  else if (raw.startsWith('#')) return raw
  else if (raw) path = `/${raw.replace(/^\/+/, '')}`
  else path = LABEL_HREF[item.label.trim().toLowerCase()] || '/'
  return PATH_ALIASES[path.toLowerCase()] || path
}

function flattenHrefs(items: SiteNavItem[]): Set<string> {
  const hrefs = new Set<string>()
  for (const item of items) {
    hrefs.add(resolveNavHref(item))
    for (const child of item.children || []) hrefs.add(resolveNavHref(child))
  }
  return hrefs
}

export function mergeCustomPageNav(items: SiteNavItem[], pages: PublicCustomPage[] | undefined, where: 'header' | 'footer'): SiteNavItem[] {
  const extras = (pages || [])
    .filter((page) => page.status === 'published' && page.pageType !== 'link')
    .filter((page) => (where === 'header' ? page.showInHeader !== false : Boolean(page.showInFooter)))
    .map((page) => ({
      id: `custom-${page.slug}`,
      label: page.title,
      href: `/${String(page.slug || '').replace(/^\/+/, '')}`,
      visible: true,
    }))
  const existing = flattenHrefs(items)
  return [
    ...items,
    ...extras.filter((item) => item.href && item.href !== '/' && !existing.has(item.href)),
  ]
}

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  clsx(
    'rounded-md px-3 py-2 text-xs font-bold uppercase tracking-[0.18em]',
    isActive ? 'bg-mist-dark text-current' : 'text-current hover:bg-mist-dark',
  )

export function uniqueHeaderNav(items: SiteNavItem[], ctaHref: string): SiteNavItem[] {
  const canonical = (href: string) => href.replace(/\/+$/, '') || '/'
  const seen = new Set(['/', canonical(ctaHref)])
  const filter = (entries: SiteNavItem[]): SiteNavItem[] => entries.flatMap(item => {
    const href = canonical(resolveNavHref(item))
    if (item.visible === false || seen.has(href)) return []
    seen.add(href)
    return [{ ...item, children: item.children?.filter(child => child.visible !== false && canonical(resolveNavHref(child)) !== canonical(ctaHref)) }]
  })
  return [{ id: 'site-home', label: 'Home', href: '/' }, ...filter(items)]
}

export function Header() {
  const { header, headerNav, customPages } = useSiteConfig()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openId, setOpenId] = useState<string | null>(null)
  const toggle = useRef<HTMLButtonElement>(null)
  const configuredItems = mergeCustomPageNav(
    (headerNav.length ? headerNav : fallbackNav).filter((item) => item.visible !== false),
    customPages,
    'header',
  )
  const ctaHref = resolveNavHref({ href: header.ctaLink || '/donate', label: header.ctaText || 'Donate' })
  const items = uniqueHeaderNav(configuredItems, ctaHref)
  const { pathname, key } = useLocation()
  useEffect(() => { setMobileOpen(false); setOpenId(null) }, [key])
  useEffect(() => {
    if (!mobileOpen) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setMobileOpen(false); toggle.current?.focus() }
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [mobileOpen])
  const sticky = pathname === '/' || header.sticky !== false
  const light = isLightColor(header.backgroundColor || '#FFFFFF')

  return (
    <header
      className={clsx('z-40 border-b', light ? 'border-mist-dark shadow-sm' : 'border-white/15', sticky ? 'sticky top-0' : 'relative')}
      style={{ backgroundColor: header.backgroundColor || '#FFFFFF', color: header.textColor || '#1F2937' }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:gap-4 sm:py-4">
        <Link to="/" className="flex min-w-0 items-center gap-3" aria-label="Companions of Grace International — Home">
          {header.logoUrl ? (
            <img
              src={header.logoUrl}
              alt={header.logoAlt || 'Companions of Grace International'}
              className="site-header-logo max-w-[min(220px,60vw)] object-contain sm:max-w-[240px] lg:max-w-[280px]"
              style={{ height: header.logoHeight || 48, maxHeight: header.logoHeight || 48 }}
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
            const href = resolveNavHref(item)
            const children = (item.children || []).filter((child) => child.visible !== false)
            if (children.length) {
              const open = openId === item.id
              return (
                <div
                  key={item.id}
                  className="relative flex items-center"
                  onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpenId(null) }}
                  onKeyDown={event => {
                    if (event.key === 'Escape') { setOpenId(null); event.currentTarget.querySelector('button')?.focus() }
                  }}
                  onMouseEnter={() => setOpenId(item.id)}
                  onMouseLeave={() => setOpenId(null)}
                >
                  <NavLink
                    to={href}
                    className="flex items-center gap-1 rounded-md px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-current"
                    onClick={() => setOpenId(null)}
                  >
                    {item.label}
                  </NavLink>
                  <button type="button" className="nav-disclosure p-1" aria-label={`Show ${item.label} links`} aria-expanded={open} onClick={() => setOpenId(open ? null : item.id)}>
                    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                      <path d="M3 5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" fill="none" />
                    </svg>
                  </button>
                  {open ? (
                    <ul className="absolute left-0 top-full min-w-[200px] rounded-lg border border-mist-dark bg-white py-2 shadow-lg">
                      {children.map((child) => (
                        <li key={child.id}>
                          <NavLink
                            to={resolveNavHref(child)}
                            className="block px-4 py-2 text-sm text-ink hover:bg-mist"
                            onClick={() => setOpenId(null)}
                          >
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
              <NavLink key={item.id} to={href} className={navLinkClass}>
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
            to={ctaHref}
            size="sm"
            className="rounded-sm uppercase tracking-[0.2em]"
          >
            {header.ctaText || 'Donate'}
          </ButtonLink>
        </nav>

        <button
          type="button"
          className="shrink-0 rounded-md p-2 text-current lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          ref={toggle}
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
                <NavLink to={resolveNavHref(item)} className={navLinkClass} onClick={() => setMobileOpen(false)}>
                  {item.label}
                </NavLink>
                {(item.children || []).filter((c) => c.visible !== false).map((child) => (
                  <NavLink key={child.id} to={resolveNavHref(child)} className={navLinkClass} onClick={() => setMobileOpen(false)}>
                    {child.label}
                  </NavLink>
                ))}
              </li>
            ))}
            <li><NavLink to="/search" className={navLinkClass}>Search</NavLink></li>
            <li className="pt-2">
              <ButtonLink
                to={ctaHref}
                className="w-full"
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
