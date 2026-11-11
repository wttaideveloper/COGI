import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { VideoPlayer } from '@/components/ui/VideoPlayer'

type Props = {
  src: string
  alt: string
  className: string
  video?: boolean
  poster?: string
  overlay?: boolean
}

export function MediaPreview({ src, alt, className, video, poster, overlay }: Props) {
  const dialog = useRef<HTMLDialogElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const photoStage = useRef<HTMLButtonElement>(null)
  const photoMotion = useRef<Animation | null>(null)
  const animatePhoto = useCallback((out: boolean) => {
    const stage = photoStage.current
    const thumb = trigger.current?.getBoundingClientRect()
    if (!stage || !thumb || matchMedia('(prefers-reduced-motion: reduce)').matches) return 0
    const current = { transform: getComputedStyle(stage).transform, clipPath: getComputedStyle(stage).clipPath }
    photoMotion.current?.cancel()
    const full = stage.getBoundingClientRect()
    if (!full.width || !full.height || !thumb.width || !thumb.height) return 0
    const scale = Math.max(thumb.width / full.width, thumb.height / full.height)
    const x = thumb.left + thumb.width / 2 - full.left - full.width / 2
    const y = thumb.top + thumb.height / 2 - full.top - full.height / 2
    const cropX = Math.max(0, (1 - thumb.width / (full.width * scale)) * 50)
    const cropY = Math.max(0, (1 - thumb.height / (full.height * scale)) * 50)
    const small = { transform: `translate(${x}px, ${y}px) scale(${scale})`, clipPath: `inset(${cropY}% ${cropX}% round 8px)` }
    const large = { transform: 'translate(0, 0) scale(1)', clipPath: 'inset(0% 0% round 8px)' }
    const duration = out ? 260 : 420
    photoMotion.current = stage.animate(out ? [current, small] : [small, large], {
      duration, easing: 'cubic-bezier(.22,.75,.2,1)', fill: out ? 'forwards' : 'none',
    })
    return duration
  }, [])
  const hoverOpened = useRef(false)
  const [expandedPhoto, setExpandedPhoto] = useState(false)
  const [open, setOpen] = useState(false)
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const [playImmediately, setPlayImmediately] = useState(false)
  const exitTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const [closing, setClosing] = useState(false)
  const dismiss = useCallback(() => {
    if (!dialog.current?.open || exitTimer.current !== undefined) return
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      dialog.current.close()
      return
    }
    const duration = animatePhoto(true) || 180
    setClosing(true)
    exitTimer.current = setTimeout(() => {
      exitTimer.current = undefined
      dialog.current?.close()
    }, duration)
  }, [animatePhoto])
  useLayoutEffect(() => {
    if (open) animatePhoto(false)
    return () => photoMotion.current?.cancel()
  }, [open, animatePhoto])
  const cancelHover = () => clearTimeout(hoverTimer.current)
  useEffect(() => () => { clearTimeout(hoverTimer.current); clearTimeout(exitTimer.current) }, [])
  const show = (play: boolean) => {
    cancelHover()
    if (dialog.current?.open || document.querySelector('dialog[open]')) return
    hoverOpened.current = !play
    setExpandedPhoto(!video && play)
    setPlayImmediately(play)
    dialog.current?.showModal()
    setOpen(true)
  }
  useEffect(() => {
    if (!open || !hoverOpened.current) return
    const close = dismiss
    const track = (event: PointerEvent) => {
      const source = trigger.current?.getBoundingClientRect()
      if (source && event.clientX >= source.left && event.clientX <= source.right &&
          event.clientY >= source.top && event.clientY <= source.bottom) return
      const target = event.target
      if (target instanceof Element && dialog.current?.contains(target) && target !== dialog.current) return
      close()
    }
    document.addEventListener('pointermove', track)
    document.documentElement.addEventListener('pointerleave', close)
    window.addEventListener('blur', close)
    return () => {
      document.removeEventListener('pointermove', track)
      document.documentElement.removeEventListener('pointerleave', close)
      window.removeEventListener('blur', close)
    }
  }, [open, expandedPhoto, dismiss])
  const label = alt || (video ? 'Video' : 'Photograph')
  return (
    <>
      <button ref={trigger} type="button" aria-label={`${video ? 'Watch' : 'Enlarge'} ${label}`}
        className={`home-media ${className} ${overlay ? 'home-media-overlay' : ''}`}
        onPointerEnter={event => {
          if (!video && event.pointerType === 'mouse' && matchMedia('(hover: hover)').matches) {
            cancelHover()
            hoverTimer.current = setTimeout(() => show(false), 420)
          }
        }}
        onPointerLeave={cancelHover}
        onPointerDown={cancelHover}
        onClick={() => show(true)}>
        {!overlay && (video ? poster : src) && <img src={video ? poster : src} alt="" className="h-full w-full object-cover" />}
        <span aria-hidden="true" className="home-media-icon">{video ? '▶' : '⤢'}</span>
      </button>
      <dialog ref={dialog} aria-label={label} className={video ? "home-viewer video-viewer" : "home-viewer photo-viewer"} data-expanded={expandedPhoto} data-closing={closing}
        onCancel={event => { event.preventDefault(); dismiss() }}
        onClose={() => { setOpen(false); setClosing(false) }} onClick={e => { if (e.target === e.currentTarget) dismiss() }}>
        {open && <>
          <button autoFocus type="button" aria-label="Close viewer" className="home-viewer-close" onClick={dismiss}>×</button>
          {video ? <VideoPlayer initiallyPlaying={playImmediately} src={src} title={label} poster={poster} className="relative aspect-video w-full" />
            : <button ref={photoStage} type="button" className="photo-stage" aria-label={expandedPhoto ? 'Close enlarged photo' : 'Enlarge photo'}
                onClick={() => {
                  if (expandedPhoto) { dismiss(); return }
                  hoverOpened.current = false
                  setExpandedPhoto(true)
                }}>
                <img src={src} alt={label} />
              </button>}
        </>}
      </dialog>
    </>
  )
}
