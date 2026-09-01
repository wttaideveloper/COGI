import { useRef, useState, type ReactNode } from 'react'
import { readFileAsDataUrl } from '@/services/siteConfigStore'

export const IMAGE_MAX_BYTES = 8 * 1024 * 1024
export const IMAGE_HINT = 'JPG, PNG, or WebP · landscape · under 2 MB (max 8 MB)'
export const VIDEO_MAX_BYTES = 80 * 1024 * 1024
export const VIDEO_HINT = 'MP4 or WebM · under 50 MB (max 80 MB). Larger films should be a YouTube or Vimeo link.'
export const LOGO_HINT = 'PNG, SVG, or JPG · under 500 KB (max 2 MB)'

export function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

function shortFileName(name: string, max = 40) {
  if (!name || name.length <= max) return name
  const dot = name.lastIndexOf('.')
  const ext = dot > 0 ? name.slice(dot) : ''
  return `${name.slice(0, Math.max(12, max - ext.length - 1))}…${ext}`
}

export function validateMediaFile(
  file: File,
  kind: 'image' | 'video',
  options?: { allowSvg?: boolean; maxBytes?: number; recommendedBytes?: number },
): { error?: string; warning?: string } {
  if (kind === 'image') {
    const isSvg = file.type === 'image/svg+xml' || /\.svg$/i.test(file.name)
    const isImage = file.type.startsWith('image/') || (options?.allowSvg && isSvg)
    if (!isImage) {
      return { error: options?.allowSvg ? 'That file is not an image. Use JPG, PNG, WebP, or SVG.' : 'That file is not a photo. Use JPG, PNG, or WebP.' }
    }
    const max = options?.maxBytes ?? IMAGE_MAX_BYTES
    const recommended = options?.recommendedBytes ?? 2 * 1024 * 1024
    if (file.size > max) {
      return { error: `This file is ${formatFileSize(file.size)}. The limit is ${formatFileSize(max)}. Compress it and try again.` }
    }
    if (file.size > recommended) {
      return { warning: `This file is ${formatFileSize(file.size)}. Under ${formatFileSize(recommended)} loads faster for visitors.` }
    }
    return {}
  }
  const videoType = file.type.startsWith('video/') || /\.(mp4|webm|mov)$/i.test(file.name)
  if (!videoType) {
    return { error: 'That file is not a video. Use MP4 or WebM, or paste a YouTube / Vimeo link.' }
  }
  const max = options?.maxBytes ?? VIDEO_MAX_BYTES
  const recommended = options?.recommendedBytes ?? 50 * 1024 * 1024
  if (file.size > max) {
    return { error: `This video is ${formatFileSize(file.size)}. The limit is ${formatFileSize(max)}. Host larger videos on YouTube or Vimeo and paste the link.` }
  }
  if (file.size > recommended) {
    return { warning: `This video is ${formatFileSize(file.size)}. Under ${formatFileSize(recommended)} is more reliable.` }
  }
  return {}
}

type MediaUploadProps = {
  kind: 'image' | 'video'
  label: string
  value?: string
  hint?: string
  noun?: string
  allowSvg?: boolean
  maxBytes?: number
  recommendedBytes?: number
  onLoaded: (dataUrl: string, file: File) => void
  onClear?: () => void
  extra?: ReactNode
}

export function MediaUpload({
  kind,
  label,
  value,
  hint,
  noun,
  allowSvg,
  maxBytes,
  recommendedBytes,
  onLoaded,
  onClear,
  extra,
}: MediaUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState('')
  const [warning, setWarning] = useState('')
  const [meta, setMeta] = useState<{ name: string; size: number } | null>(null)
  const [dragOver, setDragOver] = useState(false)

  async function handleFile(file: File | undefined) {
    if (!file) return
    const result = validateMediaFile(file, kind, { allowSvg, maxBytes, recommendedBytes })
    if (result.error) {
      setError(result.error)
      setWarning('')
      setMeta({ name: file.name, size: file.size })
      return
    }
    setError('')
    setWarning(result.warning || '')
    setMeta({ name: file.name, size: file.size })
    const url = await readFileAsDataUrl(file)
    onLoaded(url, file)
  }

  const isImage = kind === 'image'
  const item = noun || (isImage ? 'photo' : 'video')
  const accept = isImage
    ? (allowSvg ? 'image/jpeg,image/png,image/webp,image/gif,image/svg+xml,.svg' : 'image/jpeg,image/png,image/webp,image/gif')
    : 'video/mp4,video/webm,video/quicktime'

  return (
    <div className="hp-upload">
      <div className="hp-upload-head">
        <span className="admin-label">{label}</span>
        <span className="hp-upload-limit">{hint || (isImage ? IMAGE_HINT : VIDEO_HINT)}</span>
      </div>
      <input
        ref={inputRef}
        className="sr-only"
        type="file"
        accept={accept}
        onChange={(e) => {
          handleFile(e.target.files?.[0])
          e.currentTarget.value = ''
        }}
      />
      <div
        className={dragOver ? 'hp-upload-drop hp-upload-drop-active' : 'hp-upload-drop'}
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            inputRef.current?.click()
          }
        }}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragOver(false)
          handleFile(e.dataTransfer.files?.[0])
        }}
      >
        {isImage && value ? (
          <img src={value} alt="" className="hp-upload-thumb" />
        ) : kind === 'video' && value?.startsWith('data:video') ? (
          <video src={value} className="hp-upload-thumb" controls muted onClick={(e) => e.stopPropagation()} />
        ) : (
          <p className="hp-upload-empty">Drop a {item} here, or click Upload {item}</p>
        )}
        <button type="button" className="btn-primary hp-upload-choose" onClick={(e) => { e.stopPropagation(); inputRef.current?.click() }}>
          {value ? `Replace ${item}` : `Upload ${item}`}
        </button>
      </div>
      {meta ? (
        <p className="hp-upload-meta" title={meta.name}>
          {shortFileName(meta.name)} · {formatFileSize(meta.size)}
        </p>
      ) : value && !value.startsWith('data:') ? (
        <p className="hp-upload-meta" title={value}>Using a link: {shortFileName(value, 48)}</p>
      ) : null}
      {error ? <p className="hp-upload-error" role="alert">{error}</p> : null}
      {warning && !error ? <p className="hp-upload-warn" role="status">{warning}</p> : null}
      {extra}
      {value && onClear ? (
        <button type="button" className="btn-secondary" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setMeta(null); setError(''); setWarning(''); onClear() }}>
          Remove {item}
        </button>
      ) : null}
    </div>
  )
}
