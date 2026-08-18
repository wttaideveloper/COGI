import { useMemo, useRef, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { mockMedia } from '@/data/mock'
import { getErrorMessage, getStrapiUrl, isDemoMode, uploadMedia } from '@/services/strapi'
import { readFileAsDataUrl } from '@/services/siteConfigStore'
import { IMAGE_HINT, formatFileSize, validateMediaFile } from '@/components/MediaUpload'
import type { MediaFile } from '@/types'

const STORAGE_KEY = 'cogi_media_library_doc1'

function loadLocalMedia(): MediaFile[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return [...mockMedia]
    const parsed = JSON.parse(raw) as MediaFile[]
    return Array.isArray(parsed) && parsed.length ? parsed : [...mockMedia]
  } catch {
    return [...mockMedia]
  }
}

function persistLocalMedia(files: MediaFile[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(files))
}

function absoluteUrl(url: string) {
  if (!url) return ''
  if (url.startsWith('http') || url.startsWith('blob:') || url.startsWith('data:')) return url
  return `${getStrapiUrl()}${url}`
}

export default function MediaLibraryPage() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [files, setFiles] = useState<MediaFile[]>(() => loadLocalMedia())
  const [altDefault, setAltDefault] = useState('')
  const [selectedCount, setSelectedCount] = useState(0)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [draftAlts, setDraftAlts] = useState<Record<string, string>>({})

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return files
    return files.filter(
      (file) =>
        file.name.toLowerCase().includes(q) ||
        (file.alternativeText || '').toLowerCase().includes(q),
    )
  }, [files, search])

  function flash(next: string) {
    setMessage(next)
    window.setTimeout(() => setMessage(''), 2500)
  }

  function updateFiles(updater: (prev: MediaFile[]) => MediaFile[]) {
    setFiles((prev) => {
      const next = updater(prev)
      persistLocalMedia(next)
      return next
    })
  }

  const upload = useMutation({
    mutationFn: async (payload: { list: File[]; alt: string }) => {
      const uploaded: MediaFile[] = []
      for (const [index, file] of payload.list.entries()) {
        const alt = payload.alt || file.name.replace(/\.[^.]+$/, '')
        try {
          if (!isDemoMode()) {
            const remote = await uploadMedia(file, alt)
            uploaded.push({
              ...remote,
              url: absoluteUrl(remote.url),
              alternativeText: remote.alternativeText || alt,
            })
            continue
          }
        } catch {
          // Fall back to local data URL so uploads always work in the admin UI.
        }
        const dataUrl = await readFileAsDataUrl(file)
        uploaded.push({
          id: `local-${Date.now()}-${index}-${file.name}`,
          name: file.name,
          url: dataUrl,
          mime: file.type || 'image/*',
          size: file.size,
          alternativeText: alt,
          createdAt: new Date().toISOString(),
        })
      }
      return uploaded
    },
    onSuccess: (uploaded) => {
      updateFiles((prev) => [...uploaded, ...prev])
      setAltDefault('')
      setSelectedCount(0)
      if (fileInputRef.current) fileInputRef.current.value = ''
      setError('')
      flash(`Uploaded ${uploaded.length} image${uploaded.length === 1 ? '' : 's'}.`)
    },
    onError: (err) => setError(getErrorMessage(err)),
  })

  function onPickFiles(list: FileList | null) {
    const files = list ? Array.from(list).filter((f) => f.size > 0) : []
    setSelectedCount(files.length)
    const firstBad = files.map((file) => ({ file, check: validateMediaFile(file, 'image', { allowSvg: true }) })).find((row) => row.check.error)
    if (firstBad?.check.error) {
      setError(`${firstBad.file.name}: ${firstBad.check.error}`)
      return
    }
    const firstWarn = files.map((file) => ({ file, check: validateMediaFile(file, 'image', { allowSvg: true }) })).find((row) => row.check.warning)
    setError('')
    if (firstWarn?.check.warning) {
      setMessage(`${firstWarn.file.name}: ${firstWarn.check.warning}`)
    }
  }

  function onUpload(e: React.FormEvent) {
    e.preventDefault()
    const list = fileInputRef.current?.files ? Array.from(fileInputRef.current.files).filter((f) => f.size > 0) : []
    if (!list.length) {
      setError('Choose one or more image files first.')
      return
    }
    const blocked = list.find((file) => validateMediaFile(file, 'image', { allowSvg: true }).error)
    if (blocked) {
      const check = validateMediaFile(blocked, 'image', { allowSvg: true })
      setError(`${blocked.name}: ${check.error}`)
      return
    }
    setError('')
    upload.mutate({ list, alt: altDefault.trim() })
  }

  async function copyUrl(file: MediaFile) {
    const url = absoluteUrl(file.url)
    try {
      await navigator.clipboard.writeText(url)
      flash(`Copied URL for ${file.name}`)
    } catch {
      window.prompt('Copy this URL:', url)
    }
  }

  function saveAlt(file: MediaFile) {
    const nextAlt = (draftAlts[file.id] ?? file.alternativeText ?? '').trim()
    updateFiles((prev) =>
      prev.map((row) => (row.id === file.id ? { ...row, alternativeText: nextAlt || row.name } : row)),
    )
    flash(`Alt text saved for ${file.name}`)
  }

  function removeFile(file: MediaFile) {
    if (!window.confirm(`Delete “${file.name}”?`)) return
    updateFiles((prev) => prev.filter((row) => row.id !== file.id))
    flash(`Deleted ${file.name}`)
  }

  return (
    <>
      <div className="mb-2 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-[var(--color-primary)]">Media Library</h2>
          <p className="mt-1 max-w-3xl text-sm text-slate-600">
            Upload images, edit alt text, copy URLs for header/hero use, and delete unused files.
          </p>
        </div>
      </div>

      {message ? <p className="mb-4 text-sm font-semibold text-emerald-700">{message}</p> : null}
      {error ? <p className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}

      <form className="admin-card mb-6 grid gap-4 p-5 md:grid-cols-[1.4fr_1fr_auto]" onSubmit={onUpload}>
        <label className="block">
          <span className="admin-label">Images (multi-select)</span>
          <button
            type="button"
            className="btn-primary mt-1"
            onClick={() => fileInputRef.current?.click()}
          >
            Choose photos
          </button>
          <input
            ref={fileInputRef}
            className="sr-only"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml,.svg"
            multiple
            onChange={(e) => onPickFiles(e.target.files)}
          />
          <span className="mt-2 block text-xs text-slate-500">
            {IMAGE_HINT.replace('landscape · ', '')}. SVG is also allowed here.
          </span>
          <span className="mt-1 block text-xs font-semibold text-slate-600">
            {selectedCount ? `${selectedCount} file${selectedCount === 1 ? '' : 's'} selected` : 'No file chosen yet'}
          </span>
        </label>
        <label className="block">
          <span className="admin-label">Default alt text</span>
          <input
            className="admin-input"
            value={altDefault}
            onChange={(e) => setAltDefault(e.target.value)}
            placeholder="Describe the image"
          />
        </label>
        <button className="btn-primary self-end" type="submit" disabled={upload.isPending}>
          {upload.isPending ? 'Uploading…' : 'Upload images'}
        </button>
      </form>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-600">{visible.length} of {files.length} images</p>
        <input
          className="admin-input max-w-xs"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or alt text"
        />
      </div>

      {!visible.length ? (
        <div className="admin-card p-10 text-center">
          <h3 className="text-lg font-bold">No media yet</h3>
          <p className="mt-2 text-sm text-slate-600">Upload images above to build your library.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((file) => {
            const src = absoluteUrl(file.url)
            const altValue = draftAlts[file.id] ?? file.alternativeText ?? ''
            return (
              <div className="admin-card overflow-hidden" key={file.id}>
                <div className="aspect-video bg-slate-100">
                  <img className="h-full w-full object-cover" src={src} alt={file.alternativeText || file.name} />
                </div>
                <div className="space-y-2 p-4">
                  <div className="truncate font-semibold" title={file.name}>{file.name}</div>
                  <p className="text-xs text-slate-500">{file.mime || 'image'} · {formatFileSize(file.size || 0)}</p>
                  <label className="block">
                    <span className="admin-label">Alt text</span>
                    <input
                      className="admin-input"
                      value={altValue}
                      onChange={(e) => setDraftAlts((prev) => ({ ...prev, [file.id]: e.target.value }))}
                      aria-label={`Alt text for ${file.name}`}
                    />
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button className="btn-secondary px-3 py-1" type="button" onClick={() => saveAlt(file)}>
                      Save alt
                    </button>
                    <button className="btn-secondary px-3 py-1" type="button" onClick={() => copyUrl(file)}>
                      Copy URL
                    </button>
                    <button className="btn-danger px-3 py-1" type="button" onClick={() => removeFile(file)}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}
