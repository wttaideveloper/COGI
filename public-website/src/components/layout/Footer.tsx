import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getGlobalSettings } from '@/api/globalSettings'
import { NewsletterForm } from '@/components/forms/NewsletterForm'
import { mergeCustomPageNav, resolveNavHref } from '@/components/layout/Header'
import { useSiteConfig } from '@/contexts/SiteConfigContext'

const legalLinks = [
  { to: '/privacy-policy', label: 'Privacy Policy' },
  { to: '/terms-of-use', label: 'Terms of Use' },
  { to: '/cookie-notice', label: 'Cookie Notice' },
  { to: '/accessibility', label: 'Accessibility' },
]

const socialIcons: Record<string, React.ReactNode> = {
  instagram: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  ),
  facebook: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),
  youtube: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
  linkedin: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  whatsapp: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.52 3.48A11.86 11.86 0 0012.06 0C5.5 0 .16 5.34.16 11.9c0 2.1.55 4.15 1.6 5.96L0 24l6.3-1.65a11.86 11.86 0 005.76 1.47h.01c6.56 0 11.9-5.34 11.9-11.9 0-3.18-1.24-6.17-3.45-8.44z" />
    </svg>
  ),
}

export function Footer() {
  const { footer, footerNav, customPages } = useSiteConfig()
  const { data: settings } = useQuery({
    queryKey: ['globalSettings'],
    queryFn: getGlobalSettings,
  })

  const fallbackExplore: typeof footerNav = [
    { id: '1', label: 'About Us', href: '/about' },
    { id: '2', label: 'Programs', href: '/programs' },
    { id: '3', label: 'Get Involved', href: '/get-involved' },
    { id: '4', label: 'Contact', href: '/contact' },
  ]
  const menuLinks = mergeCustomPageNav(
    (footerNav.length ? footerNav : fallbackExplore).filter((item) => item.visible !== false),
    customPages,
    'footer',
  )
  const social = [
    footer.facebookUrl ? { platform: 'facebook', url: footer.facebookUrl, label: 'Facebook' } : null,
    footer.instagramUrl ? { platform: 'instagram', url: footer.instagramUrl, label: 'Instagram' } : null,
    footer.youtubeUrl ? { platform: 'youtube', url: footer.youtubeUrl, label: 'YouTube' } : null,
    footer.linkedinUrl ? { platform: 'linkedin', url: footer.linkedinUrl, label: 'LinkedIn' } : null,
    footer.whatsappUrl ? { platform: 'whatsapp', url: footer.whatsappUrl.startsWith('http') ? footer.whatsappUrl : `https://wa.me/${footer.whatsappUrl.replace(/[^\d]/g, '')}`, label: 'WhatsApp' } : null,
  ].filter(Boolean) as Array<{ platform: string; url: string; label: string }>

  const socialLinks = social.length ? social : settings?.socialLinks || []

  return (
    <footer className="border-t border-mist-dark bg-white text-ink" style={{ backgroundColor: footer.backgroundColor || '#ffffff', color: footer.textColor || '#1A2332' }}>
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div>
          {footer.logoUrl ? (
            <img
              src={footer.logoUrl}
              alt="Companions of Grace International"
              className="site-footer-logo mb-3 max-w-[220px] object-contain"
              style={{ height: footer.logoHeight || 48, maxHeight: footer.logoHeight || 48 }}
            />
          ) : (
            <div>
              <h2 className="font-display text-2xl font-bold leading-tight">Companions of Grace</h2>
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.38em] opacity-80">International</p>
            </div>
          )}
          {footer.copyright ? (
            <p className="mt-3 text-sm leading-relaxed opacity-90">{footer.copyright}</p>
          ) : null}
          <p className="mt-3 text-sm opacity-80">{footer.description || settings?.tagline}</p>
          <p className="mt-4 text-sm">
            <a href={`mailto:${settings?.contactEmail}`} className="text-gold hover:underline">
              {settings?.contactEmail}
            </a>
          </p>
          {footer.showSocial !== false ? (
            <div className="mt-6 flex gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-teal-deep/10 p-2 text-teal-deep hover:bg-gold hover:text-white"
                  aria-label={link.label}
                >
                  {socialIcons[link.platform]}
                </a>
              ))}
            </div>
          ) : null}
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gold">Explore</h3>
          <ul className="space-y-2">
            {menuLinks.map((link) => (
              <li key={link.id || link.href}>
                <Link to={resolveNavHref(link)} className="text-sm opacity-80 hover:opacity-100">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gold">Legal</h3>
          <ul className="space-y-2">
            {legalLinks.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="text-sm opacity-80 hover:opacity-100">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gold">Newsletter</h3>
          <NewsletterForm />
        </div>
      </div>

      <div className="border-t border-mist-dark">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-center text-xs uppercase tracking-[0.16em] opacity-70 md:flex-row md:text-left">
          <p className="normal-case tracking-normal opacity-100">{footer.copyright || `© ${new Date().getFullYear()} Companions of Grace International. All rights reserved.`}</p>
          <p>
            <Link to="/about" className="hover:text-gold">About</Link>
            <span className="mx-2">|</span>
            <Link to="/donate" className="hover:text-gold">Ways to give</Link>
            <span className="mx-2">|</span>
            <Link to="/about" className="hover:text-gold">Vision & mission</Link>
            <span className="mx-2">|</span>
            <Link to="/contact" className="hover:text-gold">Contact</Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
