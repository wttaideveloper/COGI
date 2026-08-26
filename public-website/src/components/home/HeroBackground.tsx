import { useState } from 'react'
import { HeroSlider, type HeroSlide } from './HeroSlider'

function youtubeId(src: string) {
  return src.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{6,})/)?.[1] || null
}

function vimeoId(src: string) {
  return src.match(/vimeo\.com\/(?:video\/)?(\d+)/)?.[1] || null
}

type Props = {
  mode: 'video' | 'images'
  videoUrl?: string
  poster?: string
  slides: HeroSlide[]
  intervalMs?: number
  reduced?: boolean
}

export function HeroBackground({ mode, videoUrl, poster, slides, intervalMs, reduced }: Props) {
  const [muted, setMuted] = useState(true)
  const useVideo = mode === 'video' && Boolean(videoUrl) && !reduced
  const yt = videoUrl ? youtubeId(videoUrl) : null
  const vimeo = videoUrl ? vimeoId(videoUrl) : null

  if (!useVideo) {
    const videoPoster = mode === 'video' && Boolean(videoUrl)
    return (
      <HeroSlider
        slides={slides.length ? slides : poster ? [{ id: 'poster', imageUrl: poster, alt: '' }] : []}
        intervalMs={reduced || videoPoster ? 0 : intervalMs}
        showControls={!videoPoster}
      />
    )
  }

  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      {yt ? (
        <iframe
          title="Homepage hero video"
          className="pointer-events-none absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2"
          src={`https://www.youtube-nocookie.com/embed/${yt}?autoplay=1&mute=1&controls=0&loop=1&playlist=${yt}&playsinline=1&rel=0&modestbranding=1`}
          allow="autoplay; encrypted-media"
        />
      ) : vimeo ? (
        <iframe
          title="Homepage hero video"
          className="pointer-events-none absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-[177.78vh] min-w-full -translate-x-1/2 -translate-y-1/2"
          src={`https://player.vimeo.com/video/${vimeo}?background=1&autoplay=1&muted=1&loop=1`}
          allow="autoplay; fullscreen"
        />
      ) : (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={videoUrl}
          poster={poster}
          autoPlay
          muted={muted}
          loop
          playsInline
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/15" />
      {!yt && !vimeo ? (
        <button
          type="button"
          className="absolute bottom-6 right-6 z-20 rounded-full bg-black/45 px-3 py-2 text-xs font-bold uppercase tracking-[0.16em] text-white backdrop-blur-sm hover:bg-black/65"
          onClick={() => setMuted((value) => !value)}
          aria-label={muted ? 'Unmute hero video' : 'Mute hero video'}
        >
          {muted ? 'Sound off' : 'Sound on'}
        </button>
      ) : null}
    </div>
  )
}
