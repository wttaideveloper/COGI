export function getPreviewUrl(pathOrSlug = '', token = 'draft'): string {
  const base = import.meta.env.VITE_PUBLIC_SITE_URL || 'http://localhost:5173'
  const path = pathOrSlug.startsWith('/') ? pathOrSlug : `/${pathOrSlug}`
  const url = new URL(path, base)
  url.searchParams.set('preview', token)
  return url.toString()
}
