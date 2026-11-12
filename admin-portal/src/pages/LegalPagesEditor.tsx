import { useEffect, useState } from 'react'
import { fallbackLegalPages } from '../../../shared/fallback'
import RichTextEditor from '@/components/RichTextEditor'
import { hydrateSiteConfigFromStrapi, loadSiteConfig, saveSiteConfig } from '@/services/siteConfigStore'

export default function LegalPagesEditor() {
  const [pages, setPages] = useState(() => loadSiteConfig().legalPages || fallbackLegalPages)
  const [index, setIndex] = useState(0)
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  useEffect(() => {
    let active = true
    void hydrateSiteConfigFromStrapi().then(config => { if (active) setPages(config.legalPages || fallbackLegalPages) })
    return () => { active = false }
  }, [])
  const page = pages[index]
  function patch(values: Partial<typeof page>) { setPages(rows => rows.map((row, i) => i === index ? { ...row, ...values } : row)) }
  async function save(status: 'draft' | 'published') {
    setBusy(true)
    try { await saveSiteConfig({ legalPages: pages }, status); setMessage(status === 'published' ? 'Published to the website.' : 'Draft saved.') }
    catch (error) { setMessage(error instanceof Error ? error.message : 'Could not save.') }
    finally { setBusy(false) }
  }
  return <div className="space-y-5">
    <h2 className="text-2xl font-bold">Legal pages</h2>
    <div className="flex flex-wrap gap-2">{pages.map((row, i) => <button key={row.slug} className={i === index ? 'btn-primary' : 'btn-secondary'} onClick={() => setIndex(i)}>{row.title}</button>)}</div>
    {page ? <div className="admin-card space-y-4 p-5">
      <label className="block">Title<input className="admin-input" value={page.title} onChange={e => patch({ title: e.target.value })} /></label>
      <label className="block">Last updated<input className="admin-input" value={page.lastUpdated} onChange={e => patch({ lastUpdated: e.target.value })} /></label>
      <RichTextEditor value={page.content} onChange={content => patch({ content })} />
      <div className="flex gap-3"><button disabled={busy} className="btn-secondary" onClick={() => void save('draft')}>Save draft</button><button disabled={busy} className="btn-primary" onClick={() => void save('published')}>Publish live</button></div>
      <p role="status">{message}</p>
    </div> : null}
  </div>
}
