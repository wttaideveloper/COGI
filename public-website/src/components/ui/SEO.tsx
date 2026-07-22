import { Helmet } from 'react-helmet-async'

interface SEOProps {
  title?: string
  description?: string
  path?: string
}

const siteUrl = import.meta.env.VITE_PUBLIC_SITE_URL || 'https://coginternational.org'
const defaultTitle = 'Companions of Grace International'
const defaultDescription =
  'Equipping Healthcare Professionals for Kingdom Engagement — a global fellowship cultivating Communities of Grace.'

export function SEO({ title, description, path = '' }: SEOProps) {
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
