import { useState } from 'react'

type Props = {
  src: string
  initiallyPlaying?: boolean
  poster?: string
  title: string
  className?: string
}

function toPlayback(src: string): { kind: 'embed' | 'file'; url: string } {
  const youtube = src.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{6,})/)
  if (youtube?.[1]) {
    return { kind: 'embed', url: `https://www.youtube-nocookie.com/embed/${youtube[1]}?autoplay=1&rel=0` }
  }
  const vimeo = src.match(/vimeo\.com\/(?:video\/)?(\d+)/)
  if (vimeo) return { kind: 'embed', url: `https://player.vimeo.com/video/${vimeo[1]}?autoplay=1` }
  return { kind: 'file', url: src }
}

export function VideoPlayer({ src, poster, title, className, initiallyPlaying = false }: Props) {
  const [playing, setPlaying] = useState(initiallyPlaying)
  const playback = toPlayback(src)

  if (playing) {
    if (playback.kind === 'embed') {
      return (
        <div className={className || 'relative aspect-video overflow-hidden bg-black'}>
          <iframe
            src={playback.url}
            title={title}
            className="absolute inset-0 h-full w-full"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        </div>
      )
    }
    return (
      <div className={className || 'relative aspect-video overflow-hidden bg-black'}>
        <video src={playback.url} poster={poster} className="absolute inset-0 h-full w-full object-contain" controls autoPlay playsInline />
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      className={`${className || 'relative aspect-video overflow-hidden bg-black'} group w-full text-left`}
      aria-label={`Play ${title}`}
    >
      {poster ? <img src={poster} alt="" className="absolute inset-0 h-full w-full object-cover" /> : null}
      <span className="absolute inset-0 bg-black/35 transition-colors group-hover:bg-black/45" />
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-gold text-white shadow-lg transition-transform group-hover:scale-105">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
        </span>
      </span>
    </button>
  )
}
