import { createEarthRenderer } from '@/lib/earthRenderer'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'
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
  const { copy } = useSiteConfig()
  const team = copy.globalTeam.members.filter(member => member.country === selected.country)
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-3 md:items-start md:gap-8">
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
        {team.length > 0 && <div className="mt-4"><h4 className="font-semibold">Team</h4><p className="mt-1 text-sm">{team.map(member => member.name).join(' · ')}</p></div>}
        <div className="mt-5"><h4 className="font-semibold">Partners</h4>{selected.partners?.length ? <ul className="mt-2 space-y-2 text-sm">{selected.partners.map(partner => <li key={partner}>{partner}</li>)}</ul> : <p className="mt-2 text-sm" style={{ color: palette.muted }}>Partner details coming soon.</p>}</div>
      </div>
      <div className="flex flex-col items-center gap-3 md:min-w-[13rem] md:items-end md:pt-5">
        <h4 className="font-semibold">Active programs</h4>
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
        ) : <p className="text-sm">Program details coming soon.</p>}
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
  const reduced = useReducedMotion()
  const [autoSpin, setAutoSpin] = useState(true)
  const [view, setView] = useState(initialView)
  const [land, setLand] = useState<Uint8ClampedArray | null>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const renderer = useRef<ReturnType<typeof createEarthRenderer>>(null)
  const drag = useRef<{ x: number; y: number; lat: number; lng: number } | null>(null)

  useEffect(() => {
    if (!autoSpin || reduced) return
    const timer = window.setInterval(() => {
      if (!drag.current) setView(current => ({ ...current, lng: (current.lng + 0.75) % 360 }))
    }, 50)
    return () => window.clearInterval(timer)
  }, [autoSpin, reduced])

  useEffect(() => {
    if (selected?.lat != null && selected.lng != null) setView({ lat: selected.lat, lng: selected.lng })
  }, [selected?.lat, selected?.lng])

  useEffect(() => {
    if (canvas.current) renderer.current = createEarthRenderer(canvas.current)
    const image = new Image()
    image.onload = () => {
      if (renderer.current) { renderer.current.setImage(image); return }
      const texture = document.createElement('canvas')
      texture.width = 2048
      texture.height = 1024
      const ctx = texture.getContext('2d')
      if (!ctx) return
      ctx.drawImage(image, 0, 0, 2048, 1024)
      const pixels = ctx.getImageData(0, 0, 2048, 1024).data
      setLand(pixels)
    }
    image.src = '/images/earth-blue-marble-hd.jpg'
    return () => { image.onload = null; renderer.current?.destroy(); renderer.current = null }
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
    if (renderer.current) { renderer.current.draw(view); return }
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
    if (!land) return
    // Inverse orthographic projection keeps coastlines solid as Earth rotates.
    const raster = document.createElement('canvas')
    raster.width = raster.height = 280
    const rasterContext = raster.getContext('2d')
    if (!rasterContext) return
    const frame = rasterContext.createImageData(280, 280)
    const a = view.lng * rad, b = view.lat * rad
    for (let py = 0; py < 280; py++) for (let px = 0; px < 280; px++) {
      const x = (px - 139.5) / 139, y = (139.5 - py) / 139
      const square = x * x + y * y
      if (square > 1) continue
      const z = Math.sqrt(1 - square)
      const worldY = Math.cos(b) * y + Math.sin(b) * z
      const forward = -Math.sin(b) * y + Math.cos(b) * z
      const worldX = Math.cos(a) * x + Math.sin(a) * forward
      const worldZ = -Math.sin(a) * x + Math.cos(a) * forward
      const lat = Math.asin(Math.max(-1, Math.min(1, worldY))) / rad
      const lng = Math.atan2(worldX, worldZ) / rad
      const tx = Math.min(2047, Math.max(0, Math.floor((lng + 180) / 360 * 2048)))
      const ty = Math.min(1023, Math.max(0, Math.floor((90 - lat) / 180 * 1024)))
      const pixel = (ty * 2048 + tx) * 4
      const color = [land[pixel], land[pixel + 1], land[pixel + 2]]
      const light = .6 + .55 * Math.max(0, -.3 * x + .3 * y + .85 * z)
      const index = (py * 280 + px) * 4
      frame.data[index] = color[0] * light
      frame.data[index + 1] = color[1] * light
      frame.data[index + 2] = color[2] * light
      frame.data[index + 3] = 255
    }
    rasterContext.putImageData(frame, 0, 0)
    ctx.drawImage(raster, 7, 7, 706, 706)
  }, [land, palette, project, view])

  return (
    <div className="globe-layout overflow-hidden rounded-2xl border border-mist-dark" style={{ background: palette.panel, color: palette.ink }}>
      <div className="globe-environment"><div className="earth-orb mx-auto my-6 relative aspect-square w-[min(85%,26rem)]">
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
        <button type="button" aria-pressed={autoSpin && !reduced} disabled={reduced} className="rounded-full border px-3 py-2 disabled:opacity-50" onClick={() => { setAutoSpin(value => !value) }}>{autoSpin && !reduced ? 'Pause rotation' : 'Auto spin'}</button>
        <button type="button" className="rounded-full border px-3 py-1" onClick={() => { onSelect(null); setView(initialView) }}>Reset view</button>
      </div>
      <p className="earth-credit px-4 pb-4 text-center text-xs"><a href="https://svs.gsfc.nasa.gov/12564/" target="_blank" rel="noopener noreferrer">Earth imagery: NASA/GSFC · Reto Stöckli</a></p>
      {selected && <div role="region" aria-label={`${selected.country} programs and partners`} className="globe-detail border-t px-5 py-5" style={{ borderColor: palette.border }}>
        <NationPanel selected={selected} palette={palette} onClear={() => onSelect(null)} />
      </div>}
    </div>
  )
}
