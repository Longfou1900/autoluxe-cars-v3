import { useId } from 'react'
import type { ReactNode } from 'react'
import type { CarShape } from '../data/cars'

interface CarArtProps {
  color: string
  accent: string
  shape?: CarShape
  spinning?: boolean
  className?: string
  title?: string
}

interface Palette {
  color: string
  accent: string
}

interface WheelDef {
  x: number
  cy: number
  r: number
}

interface ShapeDef {
  body: string
  windows: string[]
  wheels: WheelDef[]
  archGap: number
  spokes: number
  spokeW: number
  nose: { x: number; y: number }
  details: (p: Palette) => ReactNode
}

const DARK = '#0a0b0f'
const LIGHT = '#fff7d6'
const TAIL = '#ff2d3d'

const SHAPES: Record<CarShape, ShapeDef> = {
  // Low, wide, mid-forward cabin, rear wing
  supercar: {
    body: 'M24 196 L24 166 C28 158 40 154 60 152 L138 146 L228 100 C244 90 262 86 284 86 L372 86 C400 88 422 100 448 120 L548 142 C576 148 592 160 594 176 L594 204 L24 204 Z',
    windows: ['M246 122 L272 100 C278 97 286 96 296 96 L362 96 C382 99 400 110 420 122 Z'],
    wheels: [
      { x: 142, cy: 190, r: 34 },
      { x: 486, cy: 190, r: 34 },
    ],
    archGap: 6,
    spokes: 10,
    spokeW: 3,
    nose: { x: 594, y: 164 },
    details: ({ accent }) => (
      <>
        {/* rear wing */}
        <rect x="46" y="144" width="5" height="14" fill={DARK} />
        <path d="M22 142 L100 132 L103 141 L26 152 Z" fill={DARK} />
        {/* side intake */}
        <path d="M318 142 L372 136 L390 172 L312 174 Z" fill={DARK} opacity="0.85" />
        <path d="M326 146 L368 141 M322 156 L378 150 M318 166 L384 160" stroke={accent} strokeOpacity="0.5" strokeWidth="1.5" />
        {/* door cut + mirror */}
        <path d="M246 124 L252 192" stroke="#000" strokeOpacity="0.35" strokeWidth="2" fill="none" />
        <path d="M410 122 L430 118 L430 126 L414 128 Z" fill={DARK} />
        {/* splitter + diffuser */}
        <path d="M546 202 L606 198 L606 207 L540 208 Z" fill={DARK} />
        <path d="M24 192 L84 190 L84 204 L24 204 Z" fill={DARK} opacity="0.8" />
        {/* lights */}
        <path d="M506 144 L566 154 L568 162 L498 152 Z" fill={LIGHT} />
        <path d="M512 156 L560 164" stroke={accent} strokeWidth="2" />
        <path d="M24 166 L66 160 L66 167 L24 175 Z" fill={TAIL} />
      </>
    ),
  },

  // Tall, boxy, roof rack, protective cladding
  suv: {
    body: 'M30 192 L30 116 C30 106 38 100 48 100 L62 100 L72 74 C74 68 80 66 86 66 L398 66 C406 66 412 68 416 72 L458 110 L560 116 C578 118 588 128 590 142 L590 192 Z',
    windows: [
      'M92 76 L240 76 L240 108 L88 108 Z',
      'M254 76 L396 76 L436 108 L254 108 Z',
    ],
    wheels: [
      { x: 150, cy: 182, r: 42 },
      { x: 478, cy: 182, r: 42 },
    ],
    archGap: 8,
    spokes: 6,
    spokeW: 7,
    nose: { x: 590, y: 130 },
    details: ({ accent }) => (
      <>
        {/* lower cladding */}
        <path d="M30 166 L590 166 L590 192 L30 192 Z" fill={DARK} opacity="0.55" />
        {/* roof rack */}
        <rect x="96" y="58" width="296" height="4" rx="2" fill="#1a1d26" />
        <rect x="120" y="60" width="4" height="8" fill="#1a1d26" />
        <rect x="360" y="60" width="4" height="8" fill="#1a1d26" />
        {/* fender flares */}
        <path d="M94 182 A56 56 0 0 1 206 182" stroke={DARK} strokeWidth="7" fill="none" />
        <path d="M422 182 A56 56 0 0 1 534 182" stroke={DARK} strokeWidth="7" fill="none" />
        {/* door cuts */}
        <path d="M246 76 L246 168 M416 112 L416 168" stroke="#000" strokeOpacity="0.35" strokeWidth="2" fill="none" />
        <rect x="224" y="124" width="14" height="4" rx="2" fill={DARK} />
        {/* front fascia */}
        <rect x="536" y="124" width="46" height="12" rx="6" fill={LIGHT} />
        <rect x="560" y="142" width="30" height="20" rx="3" fill={DARK} />
        <path d="M562 148 L588 148 M562 154 L588 154" stroke={accent} strokeOpacity="0.55" strokeWidth="1.5" />
        <path d="M548 186 L590 186 L590 194 L544 194 Z" fill="#2a2e3a" />
        <circle cx="545" cy="152" r="5" fill={LIGHT} opacity="0.85" />
        {/* tail lamp */}
        <rect x="30" y="122" width="10" height="26" rx="3" fill={TAIL} />
      </>
    ),
  },

  // Classic three-box executive sedan
  sedan: {
    body: 'M26 198 L26 154 C26 144 34 140 48 138 L108 134 C128 116 150 104 176 96 L222 78 C238 72 258 70 280 70 L350 70 C384 72 408 88 432 108 L470 126 L552 136 C574 142 588 154 590 170 L590 198 Z',
    windows: [
      'M200 112 L232 84 C240 80 252 79 264 79 L264 112 Z',
      'M278 79 L346 79 C372 82 392 96 410 112 L278 112 Z',
    ],
    wheels: [
      { x: 140, cy: 188, r: 36 },
      { x: 486, cy: 188, r: 36 },
    ],
    archGap: 6,
    spokes: 5,
    spokeW: 6,
    nose: { x: 590, y: 160 },
    details: ({ accent }) => (
      <>
        {/* chrome beltline + door cuts */}
        <path d="M60 138 L552 138" stroke="#fff" strokeOpacity="0.3" strokeWidth="2" fill="none" />
        <path d="M271 79 L271 170 M410 112 L408 170 M196 114 L194 170" stroke="#000" strokeOpacity="0.3" strokeWidth="2" fill="none" />
        <rect x="236" y="122" width="16" height="4" rx="2" fill={DARK} />
        <rect x="330" y="122" width="16" height="4" rx="2" fill={DARK} />
        {/* side skirt */}
        <path d="M150 184 L476 184 L476 192 L150 192 Z" fill={DARK} opacity="0.5" />
        {/* lights + grille */}
        <path d="M508 140 L566 148 L568 155 L502 148 Z" fill={LIGHT} />
        <path d="M572 158 L590 162 L590 178 L574 176 Z" fill={DARK} />
        <path d="M576 164 L590 167 M576 170 L590 172" stroke={accent} strokeOpacity="0.6" strokeWidth="1.5" />
        <path d="M26 148 L54 146 L54 158 L26 160 Z" fill={TAIL} />
      </>
    ),
  },

  // Smooth fastback electric hatch, light bars, aero wheels
  ev: {
    body: 'M28 198 L28 166 C30 156 50 148 96 142 L166 104 C194 84 232 74 282 72 L362 72 C412 74 442 92 472 118 L538 130 C568 136 584 150 586 168 L586 198 Z',
    windows: ['M186 114 L216 92 C236 82 262 79 292 79 L358 79 C392 82 416 98 442 118 Z'],
    wheels: [
      { x: 146, cy: 186, r: 38 },
      { x: 480, cy: 186, r: 38 },
    ],
    archGap: 6,
    spokes: 8,
    spokeW: 3,
    nose: { x: 586, y: 158 },
    details: ({ accent }) => (
      <>
        {/* panoramic roof glint */}
        <path d="M226 92 C246 85 270 83 296 83" stroke="#fff" strokeOpacity="0.5" strokeWidth="2" fill="none" />
        {/* flush door handles + cuts */}
        <path d="M262 118 L266 176 M376 120 L378 176" stroke="#000" strokeOpacity="0.3" strokeWidth="2" fill="none" />
        <rect x="236" y="128" width="16" height="3" rx="1.5" fill={accent} opacity="0.8" />
        {/* charge port */}
        <circle cx="112" cy="152" r="5" fill="#0a0b0f" stroke={accent} strokeWidth="1.5" />
        {/* signature light bars */}
        <path d="M524 138 L578 150" stroke={LIGHT} strokeWidth="6" strokeLinecap="round" />
        <path d="M28 162 L76 152" stroke={TAIL} strokeWidth="6" strokeLinecap="round" />
        {/* lower air blade */}
        <path d="M520 186 L586 186 L586 194 L516 194 Z" fill={DARK} opacity="0.7" />
      </>
    ),
  },
}

function Wheel({
  def,
  spokes,
  spokeW,
  accent,
  spin,
  rimId,
}: {
  def: WheelDef
  spokes: number
  spokeW: number
  accent: string
  spin: boolean
  rimId: string
}) {
  const rim = def.r * 0.76
  const angles = Array.from({ length: spokes }, (_, i) => (360 / spokes) * i)
  return (
    <g transform={`translate(${def.x} ${def.cy})`}>
      <circle r={def.r} fill="#0b0c10" />
      <circle r={rim} fill={`url(#${rimId})`} />
      <g className={spin ? 'wheel-spin' : undefined}>
        {angles.map((deg) => (
          <rect
            key={deg}
            x={-spokeW / 2}
            y={-rim * 0.92}
            width={spokeW}
            height={rim * 0.92}
            rx={spokeW / 2}
            fill="#0b0c10"
            opacity="0.78"
            transform={`rotate(${deg})`}
          />
        ))}
      </g>
      <circle r={rim * 0.22} fill={accent} />
    </g>
  )
}

export default function CarArt({
  color,
  accent,
  shape = 'sedan',
  spinning = false,
  className,
  title = 'Car illustration',
}: CarArtProps) {
  const uid = useId().replace(/:/g, '')
  const def = SHAPES[shape]

  return (
    <svg
      className={className}
      viewBox="0 0 660 250"
      role="img"
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={`body-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={accent} />
          <stop offset="0.38" stopColor={color} />
          <stop offset="1" stopColor={color} />
        </linearGradient>
        <linearGradient id={`shade-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.28" />
          <stop offset="0.5" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id={`glass-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#9fd3ff" stopOpacity="0.85" />
          <stop offset="1" stopColor="#0b1020" stopOpacity="0.95" />
        </linearGradient>
        <radialGradient id={`rim-${uid}`} cx="0.4" cy="0.35" r="0.8">
          <stop offset="0" stopColor="#f2f4f8" />
          <stop offset="1" stopColor="#5b6270" />
        </radialGradient>
        <radialGradient id={`beam-${uid}`} cx="0" cy="0.5" r="1">
          <stop offset="0" stopColor={LIGHT} stopOpacity="0.9" />
          <stop offset="1" stopColor={LIGHT} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ground shadow */}
      <ellipse cx="310" cy="226" rx="285" ry="12" fill="#000" opacity="0.45" />

      {/* headlight beam */}
      <path
        d={`M${def.nose.x - 6} ${def.nose.y - 8} L${def.nose.x + 62} ${def.nose.y - 38} L${def.nose.x + 62} ${def.nose.y + 26} L${def.nose.x - 6} ${def.nose.y + 4} Z`}
        fill={`url(#beam-${uid})`}
      />

      {/* body */}
      <path d={def.body} fill={`url(#body-${uid})`} />
      <path d={def.body} fill={`url(#shade-${uid})`} />

      {/* glass */}
      {def.windows.map((d) => (
        <path key={d} d={d} fill={`url(#glass-${uid})`} />
      ))}

      {/* shape-specific details */}
      {def.details({ color, accent })}

      {/* wheel arches */}
      {def.wheels.map((w) => (
        <circle key={`arch-${w.x}`} cx={w.x} cy={w.cy} r={w.r + def.archGap} fill="#07080c" />
      ))}

      {/* wheels */}
      {def.wheels.map((w) => (
        <Wheel
          key={`wheel-${w.x}`}
          def={w}
          spokes={def.spokes}
          spokeW={def.spokeW}
          accent={accent}
          spin={spinning}
          rimId={`rim-${uid}`}
        />
      ))}
    </svg>
  )
}
