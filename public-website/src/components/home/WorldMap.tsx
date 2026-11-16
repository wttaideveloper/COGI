import { useEffect, useMemo, useRef, useState } from 'react'
import type { Location } from '@/types'
import { useSiteConfig } from '@/contexts/SiteConfigContext'
import { resolveMapPalette } from '@/lib/mapColors'

type Props = {
  locations: Location[]
  activeCountry: string | null
  onSelect: (country: string | null) => void
}

function NationPanel({
  selected,
  palette,
  onClear,
}: {
  selected: Location
  palette: ReturnType<typeof resolveMapPalette>
  onClear: () => void
}) {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-3 md:flex-row md:items-start md:gap-8">
      <div className="min-w-0 flex-1 text-center md:text-left">
        <p className="text-xs font-bold uppercase tracking-[0.28em]" style={{ color: palette.light ? palette.pinDeep : palette.pinLight }}>
          {selected.region}
        </p>
        <h3 className="mt-1 font-display text-[1.85rem] font-semibold leading-tight md:text-3xl" style={{ color: palette.ink }}>
          {selected.country}
        </h3>
        <p className="mt-2 text-sm leading-relaxed md:text-[0.95rem]" style={{ color: palette.muted }}>
          {selected.summary}
        </p>
      </div>
      <div className="flex flex-col items-center gap-3 md:min-w-[13rem] md:items-end md:pt-5">
        {selected.programs.length ? (
          <div className="flex flex-wrap justify-center gap-1.5 md:justify-end">
            {selected.programs.map((program) => (
              <span
                key={program}
                className="rounded-full px-2.5 py-1 text-xs font-semibold"
                style={{
                  background: `${palette.pin}1f`,
                  color: palette.light ? palette.pinDeep : palette.pinLight,
                  boxShadow: `inset 0 0 0 1px ${palette.pin}2e`,
                }}
              >
                {program}
              </span>
            ))}
          </div>
        ) : null}
        <button
          type="button"
          onClick={onClear}
          className="min-h-11 rounded-full px-3 text-xs font-semibold uppercase tracking-[0.16em] md:min-h-0 md:py-1"
          style={{ color: palette.muted }}
          aria-label={`Clear ${selected.country} selection`}
        >
          Close
        </button>
      </div>
    </div>
  )
}

const rad = Math.PI / 180
const initialView = { lat: 12, lng: 42 }

function surface(lat: number, lng: number) {
  const radius = Math.cos(lat * rad)
  return { x: radius * Math.sin(lng * rad), y: Math.sin(lat * rad), z: radius * Math.cos(lng * rad) }
}

export function WorldMap({ locations, activeCountry, onSelect }: Props) {
  const { homepage } = useSiteConfig()
  const palette = useMemo(() => resolveMapPalette(homepage), [homepage])
  const selected = locations.find(loc => loc.country === activeCountry)
  const [view, setView] = useState(initialView)
  const [land, setLand] = useState<ReturnType<typeof surface>[]>([])
  const canvas = useRef<HTMLCanvasElement>(null)
  const drag = useRef<{ x: number; y: number; lat: number; lng: number } | null>(null)

  useEffect(() => {
    if (selected?.lat != null && selected.lng != null) setView({ lat: selected.lat, lng: selected.lng })
  }, [selected?.lat, selected?.lng])

  useEffect(() => {
    const image = new Image()
    image.onload = () => {
      const texture = document.createElement('canvas')
      texture.width = 720
      texture.height = 360
      const ctx = texture.getContext('2d')
      if (!ctx) return
      ctx.drawImage(image, 0, 0, 720, 360)
      const pixels = ctx.getImageData(0, 0, 720, 360).data
      const points = []
      for (let lat = -89; lat < 90; lat += 1.6) {
        const step = 1.6 / Math.cos(lat * rad)
        for (let lng = -180; lng < 180; lng += step) {
          const index = Math.floor((90 - lat) * 2) * 720 + Math.floor((lng + 180) * 2)
          if (pixels[index * 4 + 3] > 100) points.push(surface(lat, lng))
        }
      }
      setLand(points)
    }
    image.src = '/images/world-equirectangular.svg'
    return () => { image.onload = null }
  }, [])

  const project = useMemo(() => {
    const a = view.lng * rad, b = view.lat * rad
    const ca = Math.cos(a), sa = Math.sin(a), cb = Math.cos(b), sb = Math.sin(b)
    return (point: ReturnType<typeof surface>) => {
      const forward = sa * point.x + ca * point.z
      return { x: ca * point.x - sa * point.z, y: cb * point.y - sb * forward, z: sb * point.y + cb * forward }
    }
  }, [view])

  useEffect(() => {
    const ctx = canvas.current?.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, 720, 720)
    const ocean = ctx.createRadialGradient(240, 175, 18, 360, 360, 355)
    ocean.addColorStop(0, palette.oceanTop)
    ocean.addColorStop(.72, palette.ocean)
    ocean.addColorStop(1, palette.pinDeep)
    ctx.fillStyle = ocean
    ctx.beginPath()
    ctx.arc(360, 360, 353, 0, 2 * Math.PI)
    ctx.fill()
    ctx.fillStyle = palette.land
    ctx.beginPath()
    for (const point of land) {
      const { x, y, z } = project(point)
      if (z <= 0) continue
      const px = 360 + x * 353, py = 360 - y * 353, size = 1.3 + z * 2.5
      ctx.moveTo(px + size, py)
      ctx.arc(px, py, size, 0, Math.PI * 2)
    }
    ctx.fill()
  }, [land, palette, project])

  return (
    <div className="overflow-hidden rounded-2xl border border-mist-dark" style={{ background: palette.panel, color: palette.ink }}>
      <div className="globe-environment"><div className="orbital-backdrop" aria-hidden="true"><i /><i /><i /></div><div className="mx-auto my-3 relative aspect-square w-[min(72%,18rem)]">
        <canvas ref={canvas} width={720} height={720} aria-label="Rotatable world globe" tabIndex={0}
          className="h-full w-full cursor-grab touch-none rounded-full active:cursor-grabbing"
          onKeyDown={e => {
            if (e.key === 'Escape') { onSelect(null); return }
            if (!['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'].includes(e.key)) return
            e.preventDefault()
            setView(v => ({ lng: v.lng + (e.key === 'ArrowRight' ? 12 : e.key === 'ArrowLeft' ? -12 : 0),
              lat: Math.max(-90, Math.min(90, v.lat + (e.key === 'ArrowUp' ? 12 : e.key === 'ArrowDown' ? -12 : 0))) }))
          }}
          onPointerDown={e => {
            if (!e.isPrimary || e.button !== 0) return
            e.currentTarget.setPointerCapture(e.pointerId)
            drag.current = { x: e.clientX, y: e.clientY, ...view }
          }}
          onPointerMove={e => {
            if (!drag.current || !e.isPrimary) return
            const delta = 140 / e.currentTarget.clientWidth
            setView({ lng: drag.current.lng - (e.clientX - drag.current.x) * delta,
              lat: Math.max(-90, Math.min(90, drag.current.lat + (e.clientY - drag.current.y) * delta)) })
          }}
          onLostPointerCapture={() => { drag.current = null }}
        />
        {locations.map(loc => {
          if (loc.lat == null || loc.lng == null) return null
          const point = project(surface(loc.lat, loc.lng))
          if (point.z < .04) return null
          return <button key={loc.id} type="button" aria-label={loc.country} title={loc.country}
            aria-pressed={loc.country === activeCountry} onClick={() => onSelect(loc.country)}
            className="absolute grid h-6 w-6 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full"
            style={{ left: (50 + point.x * 49.03) + '%', top: (50 - point.y * 49.03) + '%' }}>
            <span className="h-3 w-3 rounded-full border-2 border-white shadow-md" style={{ background: loc.country === activeCountry ? palette.active : palette.pin }} />
          </button>
        })}
      </div>
      </div><div className="relative flex flex-wrap items-center justify-center gap-4 px-4 pb-5 text-sm">
        <span>Rotate by dragging or using arrow keys.</span>
        <button type="button" className="rounded-full border px-3 py-1" onClick={() => { onSelect(null); setView(initialView) }}>Reset view</button>
      </div>
      {selected && <div className="border-t px-5 py-5" style={{ borderColor: palette.border }}>
        <NationPanel selected={selected} palette={palette} onClear={() => onSelect(null)} />
      </div>}
    </div>
  )
}
