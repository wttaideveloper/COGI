import type { ReactNode } from 'react'

export type MapColors = {
  mapOceanColor: string
  mapLandColor: string
  mapPinColor: string
  mapActiveColor: string
}

export const MAP_COLOR_PRESETS: Array<{ name: string; hint: string } & MapColors> = [
  {
    name: 'Dark ocean',
    hint: 'Navy map, blue pins',
    mapOceanColor: '#0B1016',
    mapLandColor: '#3A4A5C',
    mapPinColor: '#5BA8E0',
    mapActiveColor: '#2E7CB5',
  },
  {
    name: 'Light paper',
    hint: 'White map, slate pins',
    mapOceanColor: '#FFFFFF',
    mapLandColor: '#D7E4EE',
    mapPinColor: '#5B8FB5',
    mapActiveColor: '#4A7FA3',
  },
  {
    name: 'Soft teal',
    hint: 'Mist ocean, gold selected',
    mapOceanColor: '#F4F8F6',
    mapLandColor: '#C5D8D0',
    mapPinColor: '#3D7EAD',
    mapActiveColor: '#C4A574',
  },
]

const PREVIEW_PINS = [
  { left: '22%', top: '38%' },
  { left: '56%', top: '52%' },
  { left: '68%', top: '42%' },
  { left: '82%', top: '68%' },
]

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="hp-field">
      <span className="hp-field-head">
        <span className="admin-label">{label}</span>
      </span>
      {children}
    </label>
  )
}

function safeHex(value: string | undefined, fallback: string) {
  const v = (value || '').trim()
  return /^#[0-9a-fA-F]{6}$/.test(v) ? v : fallback
}

export function MapColorFields({
  colors,
  onChange,
}: {
  colors: MapColors
  onChange: (next: MapColors) => void
}) {
  const ocean = safeHex(colors.mapOceanColor, '#0B1016')
  const land = safeHex(colors.mapLandColor, '#3A4A5C')
  const pin = safeHex(colors.mapPinColor, '#5BA8E0')
  const active = safeHex(colors.mapActiveColor, '#2E7CB5')
  const mapMask = `${import.meta.env.BASE_URL}images/world-equirectangular.svg`
  const mask = {
    WebkitMaskImage: `url(${mapMask})`,
    maskImage: `url(${mapMask})`,
    WebkitMaskSize: 'contain',
    maskSize: 'contain',
    WebkitMaskRepeat: 'no-repeat',
    maskRepeat: 'no-repeat',
    WebkitMaskPosition: 'center',
    maskPosition: 'center',
  } as const

  function patch(key: keyof MapColors, value: string) {
    onChange({ ...colors, [key]: value })
  }

  return (
    <div className="hp-map-colors">
      <div className="hp-map-preview" style={{ background: ocean }}>
        <div className="hp-map-land" style={{ background: land, ...mask }} />
        {PREVIEW_PINS.map((spot, i) => (
          <span
            key={i}
            className={i === 1 ? 'hp-map-pin hp-map-pin-on' : 'hp-map-pin'}
            style={{ left: spot.left, top: spot.top, background: i === 1 ? active : pin }}
          />
        ))}
      </div>
      <p className="hp-hint">These colors update the public homepage map after you publish live.</p>
      <div className="hp-map-presets" role="group" aria-label="Map color presets">
        {MAP_COLOR_PRESETS.map((preset) => {
          const on =
            ocean.toLowerCase() === preset.mapOceanColor.toLowerCase() &&
            land.toLowerCase() === preset.mapLandColor.toLowerCase() &&
            pin.toLowerCase() === preset.mapPinColor.toLowerCase() &&
            active.toLowerCase() === preset.mapActiveColor.toLowerCase()
          return (
            <button
              key={preset.name}
              type="button"
              className={on ? 'hp-map-preset hp-map-preset-on' : 'hp-map-preset'}
              onClick={() =>
                onChange({
                  mapOceanColor: preset.mapOceanColor,
                  mapLandColor: preset.mapLandColor,
                  mapPinColor: preset.mapPinColor,
                  mapActiveColor: preset.mapActiveColor,
                })
              }
            >
              <span className="hp-map-preset-swatches" aria-hidden="true">
                <i style={{ background: preset.mapOceanColor }} />
                <i style={{ background: preset.mapLandColor }} />
                <i style={{ background: preset.mapPinColor }} />
                <i style={{ background: preset.mapActiveColor }} />
              </span>
              <strong>{preset.name}</strong>
              <span>{preset.hint}</span>
            </button>
          )
        })}
      </div>
      <div className="hp-grid-2">
        <Field label="Ocean color">
          <div className="hp-color">
            <input type="color" value={ocean} onChange={(e) => patch('mapOceanColor', e.target.value)} />
            <input className="admin-input" value={colors.mapOceanColor || ocean} onChange={(e) => patch('mapOceanColor', e.target.value)} />
          </div>
        </Field>
        <Field label="Land color">
          <div className="hp-color">
            <input type="color" value={land} onChange={(e) => patch('mapLandColor', e.target.value)} />
            <input className="admin-input" value={colors.mapLandColor || land} onChange={(e) => patch('mapLandColor', e.target.value)} />
          </div>
        </Field>
        <Field label="Pin color">
          <div className="hp-color">
            <input type="color" value={pin} onChange={(e) => patch('mapPinColor', e.target.value)} />
            <input className="admin-input" value={colors.mapPinColor || pin} onChange={(e) => patch('mapPinColor', e.target.value)} />
          </div>
        </Field>
        <Field label="Selected pin color">
          <div className="hp-color">
            <input type="color" value={active} onChange={(e) => patch('mapActiveColor', e.target.value)} />
            <input className="admin-input" value={colors.mapActiveColor || active} onChange={(e) => patch('mapActiveColor', e.target.value)} />
          </div>
        </Field>
      </div>
    </div>
  )
}
