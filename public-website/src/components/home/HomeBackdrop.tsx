import { useReducedMotion } from '@/hooks/useReducedMotion'

const contours = Array.from({ length: 16 }, (_, i) =>
  `M -160 ${305 + i * 7} C 160 ${510 - i * 2}, 450 ${480 - i * 11}, 705 ${300 + i * 3} S 1110 ${90 + i * 12}, 1400 ${235 - i * 3}`
)

export function HomeBackdrop() {
  const reduced = useReducedMotion()
  return (
    <div className="hero-waves" aria-hidden="true">
      <svg viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice" focusable="false">
        <defs>
          <linearGradient id="hero-wave-ink" x1="0" x2="1" y1="0" y2=".15">
            <stop offset="0" stopColor="#5b8fb5" stopOpacity=".08" />
            <stop offset=".48" stopColor="#8bb6d1" stopOpacity=".7" />
            <stop offset=".76" stopColor="#c5dcea" stopOpacity="1" />
            <stop offset="1" stopColor="#5b8fb5" stopOpacity=".6" />
          </linearGradient>
          <linearGradient id="hero-wave-light" gradientUnits="userSpaceOnUse" x1="-310" x2="0">
            <stop stopColor="#84b5d4" stopOpacity="0" />
            <stop offset=".58" stopColor="#a5d8ed" stopOpacity=".65" />
            <stop offset=".78" stopColor="#deeff7" />
            <stop offset="1" stopColor="#84b5d4" stopOpacity="0" />
          </linearGradient>
          <mask id="hero-wave-glint" maskUnits="userSpaceOnUse" x="-160" y="0" width="1560" height="600">
            <rect className="hero-wave-light" x="-310" width="310" height="600" fill="url(#hero-wave-light)" />
          </mask>
          <linearGradient id="hero-comet-tail">
            <stop stopColor="#82bedd" stopOpacity="0" />
            <stop offset="1" stopColor="#cbeeff" stopOpacity=".92" />
          </linearGradient>
          <radialGradient id="hero-comet-glow">
            <stop stopColor="#c7edff" stopOpacity=".85" />
            <stop offset="1" stopColor="#83c3e6" stopOpacity="0" />
          </radialGradient>
        </defs>
        <g fill="none" stroke="url(#hero-wave-ink)" strokeWidth="2">
          <g className="hero-wave-far" opacity=".48">
            {contours.map(d => <path key={d} d={d} />)}
          </g>
          <g className="hero-wave-near">
            {contours.map(d => <path key={d} d={d} />)}
            {!reduced && [2, 8, 14].map((line, index) => (
              <g key={line} stroke="none">
                <animateMotion path={contours[line]} dur={(9 + index * 2) + 's'} begin={(-2 - index * 4) + 's'} rotate="auto" repeatCount="indefinite" />
                <path d="M-48 0 Q-18 -2 0 -1.5 L0 1.5 Q-18 2 -48 0Z" fill="url(#hero-comet-tail)" />
                <circle r="11" fill="url(#hero-comet-glow)" />
                <circle r="2.4" fill="#e1f4ff" />
              </g>
            ))}
            <g className="hero-wave-highlight" mask="url(#hero-wave-glint)" stroke="#c9e6f4" strokeWidth="2.4">
              {contours.map(d => <path key={d} d={d} />)}
            </g>
          </g>
        </g>
      </svg>
    </div>
  )
}
