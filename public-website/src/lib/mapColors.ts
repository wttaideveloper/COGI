export const DEFAULT_MAP_COLORS = {
  ocean: '#0B1016',
  land: '#3A4A5C',
  pin: '#5BA8E0',
  active: '#2E7CB5',
}

export function hexColor(value: string | undefined, fallback: string) {
  const v = (value || '').trim()
  if (/^#[0-9a-fA-F]{6}$/.test(v)) return v.toUpperCase()
  if (/^#[0-9a-fA-F]{3}$/.test(v)) {
    return `#${v[1]}${v[1]}${v[2]}${v[2]}${v[3]}${v[3]}`.toUpperCase()
  }
  return fallback
}

function parseHex(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

export function mixHex(a: string, b: string, t: number) {
  const [ar, ag, ab] = parseHex(a)
  const [br, bg, bb] = parseHex(b)
  const r = Math.round(ar + (br - ar) * t)
  const g = Math.round(ag + (bg - ag) * t)
  const bl = Math.round(ab + (bb - ab) * t)
  return `#${[r, g, bl].map((x) => x.toString(16).padStart(2, '0')).join('')}`
}

export function isLightColor(hex: string) {
  const [r, g, b] = parseHex(hex)
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.62
}

export function resolveMapPalette(homepage?: {
  mapOceanColor?: string
  mapLandColor?: string
  mapPinColor?: string
  mapActiveColor?: string
}) {
  const ocean = hexColor(homepage?.mapOceanColor, DEFAULT_MAP_COLORS.ocean)
  const land = hexColor(homepage?.mapLandColor, DEFAULT_MAP_COLORS.land)
  const pin = hexColor(homepage?.mapPinColor, DEFAULT_MAP_COLORS.pin)
  const active = hexColor(homepage?.mapActiveColor, DEFAULT_MAP_COLORS.active)
  const light = isLightColor(ocean)
  return {
    ocean,
    land,
    pin,
    active,
    oceanTop: mixHex(ocean, light ? '#FFFFFF' : '#2A3544', light ? 0.08 : 0.28),
    landLight: mixHex(land, '#FFFFFF', 0.32),
    pinLight: mixHex(pin, '#FFFFFF', 0.38),
    pinDeep: mixHex(pin, '#000000', 0.22),
    ink: light ? '#1F2937' : '#FFFFFF',
    muted: light ? 'rgba(31,41,55,0.68)' : 'rgba(255,255,255,0.72)',
    panel: mixHex(ocean, light ? '#F3F6F9' : '#000000', light ? 0.14 : 0.18),
    border: light ? 'rgba(15,23,42,0.10)' : 'rgba(255,255,255,0.10)',
    grid: light ? `${pin}24` : `${pin}38`,
    light,
  }
}
