type Snapshot = { content?: Record<string, Record<string, unknown>[]>; globalSettings?: Record<string, unknown> }
let pending: Promise<Snapshot | null> | undefined
let loadedAt = 0

export async function readPublishedContent(endpoint: string, params?: Record<string, unknown>) {
  // Local practice publishing shares the public configuration file across both dev servers.
  if (!import.meta.env.DEV) return undefined
  if (!pending || Date.now() - loadedAt > 1000) {
    loadedAt = Date.now()
    pending = fetch('/site-config.json', { cache: 'no-store' }).then(r => r.ok ? r.json() as Promise<Snapshot> : null).catch(() => null)
  }
  const snapshot = await pending
  if (endpoint === '/global-setting' && snapshot?.globalSettings) return { data: snapshot.globalSettings }
  const source = snapshot?.content?.[endpoint]
  if (!Array.isArray(source)) return undefined
  let rows = source.filter(row => row.status !== 'draft')
  for (const [key, value] of Object.entries(params || {})) {
    const match = /^filters\[(\w+)\]\[\$eq\]$/.exec(key)
    if (match) rows = rows.filter(row => String(row[match[1]]) === String(value))
  }
  const sort = String(params?.sort || '').split(':')
  if (sort[0]) rows = [...rows].sort((a, b) => String(a[sort[0]] ?? '').localeCompare(String(b[sort[0]] ?? ''), undefined, { numeric: true }) * (sort[1] === 'desc' ? -1 : 1))
  return { data: rows }
}
