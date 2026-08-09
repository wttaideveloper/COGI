import { Helmet } from 'react-helmet-async'
import { useSiteConfig } from '@/contexts/SiteConfigContext'

interface SEOProps {
  title?: string
  description?: string
  path?: string
}

const fallbackSiteUrl = import.meta.env.VITE_PUBLIC_SITE_URL || 'https://coginternational.org'
const fallbackTitle = 'Companions of Grace International'
const fallbackDescription =
  'Equipping Healthcare Professionals for Kingdom Engagement — a global fellowship cultivating Communities of Grace.'

export function SEO({ title, description, path = '' }: SEOProps) {
  const site = useSiteConfig()
  const siteUrl = site.seo.siteUrl || fallbackSiteUrl
  const defaultTitle = site.seo.metaTitle || fallbackTitle
  const defaultDescription = site.seo.metaDescription || fallbackDescription
  const pageTitle = title ? `${title} | ${defaultTitle}` : defaultTitle
  const pageDescription = description || defaultDescription
  const canonical = `${siteUrl}${path}`

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      <link rel="canonical" href={canonical} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content="website" />
    </Helmet>
  )
}
