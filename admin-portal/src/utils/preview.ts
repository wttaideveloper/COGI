export function getPreviewUrl(pathOrSlug = '', token = 'draft'): string {
  const base = import.meta.env.VITE_PUBLIC_SITE_URL || 'http://localhost:5173'
  const trimmed = pathOrSlug.trim()
  const path = !trimmed || trimmed.startsWith('/') || trimmed.startsWith('?') || trimmed.startsWith('#')
    ? (trimmed || '/')
    : `/${trimmed}`
  const url = new URL(path, base.endsWith('/') ? base : `${base}/`)
  if (token) url.searchParams.set('preview', token)
  return url.toString()
}

export function getLiveUrl(pathOrSlug = ''): string {
  return getPreviewUrl(pathOrSlug, '')
}
