import * as THREE from 'three'
import { toCreasedNormals } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import type { CarShape } from '../data/cars'

// Original, procedurally generated 3D cars. Units are roughly metres.
// Car length runs along +X (front), up is +Y, width is Z.

type Pt = [number, number]

interface WheelSpec {
  x: number
  r: number
  w: number
}

type WheelStyle = 'sport' | 'rugged' | 'classic' | 'aero'

interface Spec {
  width: number
  bottomY: number
  /** Outline of the lower body, rear -> front. First/last x are the bumpers. */
  body: Pt[]
  wheels: WheelSpec[]
  /** Greenhouse (cabin) base height and roof outline, rear -> front. */
  baseY: number
  roof: Pt[]
  cabinWidth: number
  windscreen: { from: Pt; to: Pt }
  rearGlass: { from: Pt; to: Pt }
  headY: number
  tailY: number
  doorCuts: number[]
  doorY: [number, number]
  wheelStyle: WheelStyle
}

const SPECS: Record<CarShape, Spec> = {
  supercar: {
    width: 1.98,
    bottomY: 0.16,
    body: [
      [-2.25, 0.42],
      [-2.24, 0.78],
      [-1.95, 0.9],
      [-1.4, 0.95],
      [-0.6, 0.93],
      [0.1, 0.89],
      [0.8, 0.88],
      [1.4, 0.88],
      [1.85, 0.68],
      [2.18, 0.47],
      [2.25, 0.34],
    ],
    wheels: [
      { x: -1.35, r: 0.36, w: 0.32 },
      { x: 1.4, r: 0.35, w: 0.3 },
    ],
    baseY: 0.84,
    roof: [
      [-1.1, 0.92],
      [-0.8, 1.04],
      [-0.45, 1.11],
      [0.0, 1.13],
      [0.45, 1.08],
      [0.85, 0.97],
      [1.15, 0.86],
    ],
    cabinWidth: 0.74,
    windscreen: { from: [1.13, 0.87], to: [0.58, 1.08] },
    rearGlass: { from: [-1.08, 0.93], to: [-0.65, 1.06] },
    headY: 0.56,
    tailY: 0.8,
    doorCuts: [0.05, 0.75],
    doorY: [0.55, 0.38],
    wheelStyle: 'sport',
  },
  suv: {
    width: 2.0,
    bottomY: 0.3,
    body: [
      [-2.45, 0.7],
      [-2.45, 1.26],
      [-2.0, 1.3],
      [-1.0, 1.32],
      [0.0, 1.32],
      [0.9, 1.28],
      [1.4, 1.22],
      [1.95, 1.1],
      [2.45, 0.98],
    ],
    wheels: [
      { x: -1.5, r: 0.43, w: 0.32 },
      { x: 1.5, r: 0.43, w: 0.32 },
    ],
    baseY: 1.22,
    roof: [
      [-2.25, 1.3],
      [-2.2, 1.72],
      [-2.0, 1.82],
      [-1.0, 1.84],
      [0.3, 1.84],
      [0.75, 1.78],
      [1.25, 1.3],
    ],
    cabinWidth: 0.86,
    windscreen: { from: [1.22, 1.31], to: [0.8, 1.76] },
    rearGlass: { from: [-2.24, 1.34], to: [-2.2, 1.7] },
    headY: 0.98,
    tailY: 1.05,
    doorCuts: [-0.55, 0.45, 1.2],
    doorY: [0.95, 0.72],
    wheelStyle: 'rugged',
  },
  sedan: {
    width: 1.9,
    bottomY: 0.2,
    body: [
      [-2.5, 0.55],
      [-2.5, 0.95],
      [-2.2, 1.01],
      [-1.5, 1.03],
      [-0.5, 1.0],
      [0.5, 0.97],
      [1.2, 0.97],
      [1.6, 0.96],
      [2.1, 0.76],
      [2.42, 0.6],
      [2.5, 0.5],
    ],
    wheels: [
      { x: -1.5, r: 0.37, w: 0.26 },
      { x: 1.45, r: 0.37, w: 0.26 },
    ],
    baseY: 0.97,
    roof: [
      [-1.4, 1.03],
      [-0.95, 1.28],
      [-0.35, 1.44],
      [0.45, 1.45],
      [0.95, 1.34],
      [1.4, 1.0],
    ],
    cabinWidth: 0.82,
    windscreen: { from: [1.38, 1.0], to: [0.85, 1.33] },
    rearGlass: { from: [-1.38, 1.04], to: [-0.85, 1.3] },
    headY: 0.58,
    tailY: 0.92,
    doorCuts: [-0.8, 0.1, 0.95],
    doorY: [0.62, 0.55],
    wheelStyle: 'classic',
  },
  ev: {
    width: 1.95,
    bottomY: 0.22,
    body: [
      [-2.35, 0.6],
      [-2.33, 0.98],
      [-1.9, 1.08],
      [-1.2, 1.14],
      [-0.4, 1.1],
      [0.5, 1.02],
      [1.2, 1.0],
      [1.6, 0.98],
      [2.0, 0.74],
      [2.3, 0.58],
      [2.35, 0.5],
    ],
    wheels: [
      { x: -1.4, r: 0.39, w: 0.27 },
      { x: 1.4, r: 0.38, w: 0.26 },
    ],
    baseY: 1.0,
    roof: [
      [-1.9, 1.1],
      [-1.2, 1.4],
      [-0.4, 1.53],
      [0.4, 1.49],
      [0.9, 1.31],
      [1.25, 1.02],
    ],
    cabinWidth: 0.84,
    windscreen: { from: [1.22, 1.03], to: [0.8, 1.32] },
    rearGlass: { from: [-1.88, 1.12], to: [-1.25, 1.38] },
    headY: 0.58,
    tailY: 0.96,
    doorCuts: [-0.7, 0.2, 0.95],
    doorY: [0.68, 0.58],
    wheelStyle: 'aero',
  },
}

interface Mats {
  paint: THREE.MeshPhysicalMaterial
  trim: THREE.MeshStandardMaterial
  glass: THREE.MeshPhysicalMaterial
  tire: THREE.MeshStandardMaterial
  metal: THREE.MeshStandardMaterial
  dark: THREE.MeshStandardMaterial
  head: THREE.MeshStandardMaterial
  tail: THREE.MeshStandardMaterial
  accent: THREE.MeshStandardMaterial
}

function makeMaterials(color: string, accent: string): Mats {
  return {
    paint: new THREE.MeshPhysicalMaterial({
      color,
      metalness: 0.65,
      roughness: 0.25,
      clearcoat: 1,
      clearcoatRoughness: 0.04,
    }),
    trim: new THREE.MeshStandardMaterial({ color: 0x0b0b10, roughness: 0.55, metalness: 0.3 }),
    glass: new THREE.MeshPhysicalMaterial({
      color: 0x16222f,
      metalness: 0.75,
      roughness: 0.08,
      clearcoat: 1,
      envMapIntensity: 1.4,
    }),
    tire: new THREE.MeshStandardMaterial({ color: 0x0a0a0c, roughness: 0.9, metalness: 0 }),
    metal: new THREE.MeshStandardMaterial({ color: 0xd9dde5, roughness: 0.22, metalness: 1 }),
    dark: new THREE.MeshStandardMaterial({ color: 0x050507, roughness: 0.7, metalness: 0.4 }),
    head: new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xfff1cf,
      emissiveIntensity: 2.4,
      roughness: 0.2,
    }),
    tail: new THREE.MeshStandardMaterial({
      color: 0x330005,
      emissive: 0xff1d33,
      emissiveIntensity: 2.2,
      roughness: 0.3,
    }),
    accent: new THREE.MeshStandardMaterial({
      color: accent,
      roughness: 0.35,
      metalness: 0.6,
      emissive: accent,
      emissiveIntensity: 0.25,
    }),
  }
}

function bodyShape(spec: Spec): THREE.Shape {
  const s = new THREE.Shape()
  const rear = spec.body[0][0]
  const front = spec.body[spec.body.length - 1][0]
  s.moveTo(rear, spec.bottomY)
  const curve = new THREE.SplineCurve(spec.body.map(([x, y]) => new THREE.Vector2(x, y)))
  curve.getPoints(160).forEach((p) => s.lineTo(p.x, p.y))
  s.lineTo(front, spec.bottomY)
  for (const w of [...spec.wheels].sort((a, b) => b.x - a.x)) {
    const ra = w.r + 0.12
    const a = Math.asin((spec.bottomY - w.r) / ra)
    s.lineTo(w.x + ra * Math.cos(a), spec.bottomY)
    s.absarc(w.x, w.r, ra, a, Math.PI - a, false)
  }
  s.lineTo(rear, spec.bottomY)
  return s
}

function cabinShape(spec: Spec): THREE.Shape {
  const s = new THREE.Shape()
  const first = spec.roof[0]
  const last = spec.roof[spec.roof.length - 1]
  s.moveTo(first[0], spec.baseY)
  const curve = new THREE.SplineCurve(spec.roof.map(([x, y]) => new THREE.Vector2(x, y)))
  curve.getPoints(80).forEach((p) => s.lineTo(p.x, p.y))
  s.lineTo(last[0], spec.baseY)
  s.lineTo(first[0], spec.baseY)
  return s
}

function windowShape(spec: Spec): THREE.Shape {
  const xs = spec.roof.map((p) => p[0])
  const cx = (Math.min(...xs) + Math.max(...xs)) / 2
  const floor = spec.baseY + 0.07
  const pts = new THREE.SplineCurve(spec.roof.map(([x, y]) => new THREE.Vector2(x, y))).getPoints(80)
  const s = new THREE.Shape()
  const mapped = pts.map(
    (p) => new THREE.Vector2(cx + (p.x - cx) * 0.86, Math.max(floor, p.y - 0.09)),
  )
  s.moveTo(mapped[0].x, floor)
  mapped.forEach((p) => s.lineTo(p.x, p.y))
  s.lineTo(mapped[mapped.length - 1].x, floor)
  s.lineTo(mapped[0].x, floor)
  return s
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const smooth = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a))
  return t * t * (3 - 2 * t)
}

/** Width multiplier for the lower body: narrower nose/tail and a slight tumblehome. */
function bodyScale(spec: Spec, x: number, y: number): number {
  const rear = spec.body[0][0]
  const front = spec.body[spec.body.length - 1][0]
  const t = (x - rear) / (front - rear)
  const nose = smooth(0.88, 1.0, t) * 0.24
  const tail = (1 - smooth(0, 0.1, t)) * 0.1
  const top = clamp01((y - spec.bottomY - 0.35) / 0.9) * 0.1
  return 1 - nose - tail - top
}

/** Width multiplier for the cabin: the roof is narrower than the beltline. */
function cabinScale(spec: Spec, _x: number, y: number): number {
  return 1 - 0.2 * clamp01((y - spec.baseY) / 0.5)
}

function applyZ(g: THREE.BufferGeometry, fn: (x: number, y: number) => number): void {
  const pos = g.attributes.position
  for (let i = 0; i < pos.count; i++) {
    pos.setZ(i, pos.getZ(i) * fn(pos.getX(i), pos.getY(i)))
  }
  pos.needsUpdate = true
}

function extrude(
  shape: THREE.Shape,
  depth: number,
  bt: number,
  bs: number,
  zScale: (x: number, y: number) => number,
): THREE.BufferGeometry {
  const g = new THREE.ExtrudeGeometry(shape, {
    depth: Math.max(0.01, depth - 2 * bt),
    bevelEnabled: true,
    bevelThickness: bt,
    bevelSize: bs,
    bevelSegments: 8,
    curveSegments: 24,
  })
  g.translate(0, 0, -(depth - 2 * bt) / 2)
  applyZ(g, zScale)
  g.deleteAttribute('uv')
  g.deleteAttribute('normal')
  // smooth paint shading, but keep genuine creases
  return toCreasedNormals(g, 0.95)
}

function glassPlane(
  from: Pt,
  to: Pt,
  width: number,
  offset: number,
  facing: 'front' | 'rear',
  mat: THREE.Material,
): THREE.Mesh {
  const dx = to[0] - from[0]
  const dy = to[1] - from[1]
  const len = Math.hypot(dx, dy)
  let nx = -dy / len
  let ny = dx / len
  if (facing === 'front' ? nx < 0 : nx > 0) {
    nx = -nx
    ny = -ny
  }
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(len, 0.025, width), mat)
  mesh.position.set((from[0] + to[0]) / 2 + nx * offset, (from[1] + to[1]) / 2 + ny * offset, 0)
  mesh.rotation.z = Math.atan2(dy, dx)
  return mesh
}

function box(
  w: number,
  h: number,
  d: number,
  mat: THREE.Material,
  x: number,
  y: number,
  z: number,
): THREE.Mesh {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat)
  m.position.set(x, y, z)
  return m
}

function makeWheel(spec: WheelSpec, style: WheelStyle, mats: Mats): THREE.Group {
  const g = new THREE.Group()
  const spin = new THREE.Group()
  spin.name = 'spin'
  g.add(spin)

  const tireGeo = new THREE.CylinderGeometry(spec.r, spec.r, spec.w, 56)
  tireGeo.rotateX(Math.PI / 2)
  spin.add(new THREE.Mesh(tireGeo, mats.tire))

  const rimR = spec.r * 0.68
  const barrelGeo = new THREE.CylinderGeometry(rimR, rimR, spec.w * 0.92, 48, 1, true)
  barrelGeo.rotateX(Math.PI / 2)
  spin.add(new THREE.Mesh(barrelGeo, mats.metal))

  const discGeo = new THREE.CylinderGeometry(rimR * 0.94, rimR * 0.94, 0.03, 48)
  discGeo.rotateX(Math.PI / 2)
  spin.add(new THREE.Mesh(discGeo, mats.dark))

  const lipGeo = new THREE.TorusGeometry(rimR, 0.014, 10, 56)
  for (const s of [-1, 1]) {
    const lip = new THREE.Mesh(lipGeo, mats.metal)
    lip.position.z = (s * spec.w * 0.92) / 2
    spin.add(lip)
  }

  const count = style === 'rugged' ? 6 : style === 'classic' ? 5 : style === 'sport' ? 10 : 0
  const thick = style === 'rugged' ? 0.07 : style === 'classic' ? 0.05 : 0.03
  for (const s of [-1, 1]) {
    const zFace = s * (spec.w * 0.46 - 0.04)
    if (style === 'aero') {
      const faceGeo = new THREE.CylinderGeometry(rimR * 0.97, rimR * 0.97, 0.02, 48)
      faceGeo.rotateX(Math.PI / 2)
      const face = new THREE.Mesh(faceGeo, mats.metal)
      face.position.z = zFace
      spin.add(face)
      const ringGeo = new THREE.TorusGeometry(rimR * 0.62, 0.012, 8, 48)
      const ring = new THREE.Mesh(ringGeo, mats.dark)
      ring.position.z = zFace + s * 0.012
      spin.add(ring)
    }
    for (let i = 0; i < count; i++) {
      const geo = new THREE.BoxGeometry(rimR * 0.95, thick, 0.03)
      geo.translate(rimR * 0.475, 0, 0)
      const sp = new THREE.Mesh(geo, mats.metal)
      sp.rotation.z = (i / count) * Math.PI * 2
      sp.position.z = zFace
      spin.add(sp)
    }
    const hubGeo = new THREE.CylinderGeometry(rimR * 0.17, rimR * 0.17, 0.05, 24)
    hubGeo.rotateX(Math.PI / 2)
    const hub = new THREE.Mesh(hubGeo, mats.accent)
    hub.position.z = zFace + s * 0.02
    spin.add(hub)
  }

  // Brake caliper stays still while the wheel spins
  const caliper = box(rimR * 0.34, rimR * 0.5, 0.07, mats.accent, rimR * 0.48, rimR * 0.5, 0)
  caliper.rotation.z = -0.5
  g.add(caliper)

  return g
}

function addDetails(root: THREE.Group, shape: CarShape, spec: Spec, mats: Mats): void {
  const W = spec.width
  const front = spec.body[spec.body.length - 1][0]
  const rear = spec.body[0][0]
  const sideZ = (x: number, y: number) => (W / 2) * bodyScale(spec, x, y)

  // door shut-lines on both sides
  for (const s of [-1, 1]) {
    for (const x of spec.doorCuts) {
      root.add(box(0.014, spec.doorY[1], 0.012, mats.dark, x, spec.doorY[0], s * (sideZ(x, spec.doorY[0]) + 0.004)))
    }
    // door handle + mirror
    root.add(
      box(0.16, 0.025, 0.02, mats.dark, spec.doorCuts[spec.doorCuts.length - 2] + 0.25, spec.doorY[0] + spec.doorY[1] / 2 - 0.06, s * (sideZ(spec.doorCuts[spec.doorCuts.length - 2] + 0.25, spec.doorY[0]) + 0.012)),
    )
    const mirror = box(0.16, 0.1, 0.14, mats.paint, spec.windscreen.from[0] - 0.08, spec.baseY + 0.08, s * (W * spec.cabinWidth * 0.5 + 0.08))
    root.add(mirror)
  }

  if (shape === 'ev') {
    // full-width light bars
    root.add(box(0.05, 0.05, 2 * sideZ(front - 0.08, spec.headY) * 0.84, mats.head, front + 0.09, spec.headY, 0))
    root.add(box(0.05, 0.05, 2 * sideZ(rear + 0.08, spec.tailY) * 0.9, mats.tail, rear - 0.09, spec.tailY, 0))
    root.add(box(0.08, 0.14, 2 * sideZ(front - 0.08, spec.bottomY + 0.2) * 0.6, mats.dark, front + 0.09, spec.bottomY + 0.2, 0))
  } else {
    // headlights
    for (const s of [-1, 1]) {
      const hl = box(0.2, shape === 'suv' ? 0.14 : 0.07, shape === 'supercar' ? 0.44 : 0.4, mats.head, front - 0.03, spec.headY, s * sideZ(front - 0.1, spec.headY) * 0.7)
      hl.rotation.y = s * 0.12
      root.add(hl)
    }
    root.add(box(0.05, 0.07, W * 0.8, mats.tail, rear - 0.04, spec.tailY, 0))
  }

  if (shape === 'supercar') {
    // front splitter, diffuser, side intakes, rear wing
    root.add(box(0.3, 0.03, W * 0.8, mats.dark, front + 0.05, spec.bottomY + 0.02, 0))
    root.add(box(0.6, 0.22, W * 0.6, mats.dark, rear + 0.2, spec.bottomY + 0.1, 0))
    root.add(box(0.09, 0.2, W * 0.52, mats.dark, front + 0.02, 0.4, 0))
    for (const s of [-1, 1]) {
      root.add(box(0.8, 0.2, 0.03, mats.dark, -0.55, 0.68, s * (sideZ(-0.55, 0.68) + 0.01)))
      root.add(box(0.04, 0.18, 0.04, mats.trim, rear + 0.35, 0.97, s * 0.5))
    }
    const wing = box(0.42, 0.045, W * 0.92, mats.trim, rear + 0.2, 1.1, 0)
    wing.rotation.z = 0.08
    root.add(wing)
    root.add(box(0.44, 0.012, W * 0.92, mats.accent, rear + 0.2, 1.13, 0))
  }

  if (shape === 'suv') {
    // roof rails, skid plate, black lower cladding, rear spare wheel
    for (const s of [-1, 1]) {
      root.add(box(2.7, 0.04, 0.05, mats.trim, -0.55, 1.89, s * 0.72))
      root.add(box(0.05, 0.1, 0.05, mats.trim, -1.7, 1.85, s * 0.72))
      root.add(box(0.05, 0.1, 0.05, mats.trim, 0.4, 1.85, s * 0.72))
    }
    root.add(box(0.07, 0.04, 1.4, mats.trim, -0.9, 1.89, 0))
    root.add(box(0.07, 0.04, 1.4, mats.trim, 0.1, 1.89, 0))
    root.add(box(0.28, 0.05, W * 0.55, mats.metal, front + 0.0, spec.bottomY + 0.04, 0))
    root.add(box(0.12, 0.26, W * 0.5, mats.dark, front + 0.02, 0.8, 0))
    const spareGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.22, 40)
    spareGeo.rotateZ(Math.PI / 2)
    const spare = new THREE.Mesh(spareGeo, mats.tire)
    spare.position.set(rear - 0.14, 1.0, 0)
    root.add(spare)
    const hubGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.24, 32)
    hubGeo.rotateZ(Math.PI / 2)
    const hub = new THREE.Mesh(hubGeo, mats.metal)
    hub.position.set(rear - 0.15, 1.0, 0)
    root.add(hub)
  }

  if (shape === 'sedan') {
    // chrome belt trim and grille
    for (const s of [-1, 1]) {
      root.add(box(3.2, 0.022, 0.014, mats.metal, -0.3, 0.99, s * (sideZ(-0.3, 0.99) + 0.008)))
    }
    root.add(box(0.07, 0.16, W * 0.5, mats.dark, front + 0.015, 0.55, 0))
    root.add(box(0.075, 0.025, W * 0.5, mats.metal, front + 0.02, 0.62, 0))
    root.add(box(0.4, 0.04, W * 0.9, mats.dark, front + 0.06, spec.bottomY + 0.02, 0))
  }
}

export interface BuiltCar {
  group: THREE.Group
  wheels: THREE.Object3D[]
}

export function buildCar(shape: CarShape, color: string, accent: string): BuiltCar {
  const spec = SPECS[shape]
  const mats = makeMaterials(color, accent)
  const root = new THREE.Group()

  // lower body
  const body = new THREE.Mesh(
    extrude(bodyShape(spec), spec.width, 0.16, 0.1, (x, y) => bodyScale(spec, x, y)),
    mats.paint,
  )
  root.add(body)

  // wheel wells: dark drums so you cannot see through the arches
  for (const w of spec.wheels) {
    const drumGeo = new THREE.CylinderGeometry(w.r + 0.1, w.r + 0.1, spec.width - 0.1, 40)
    drumGeo.rotateX(Math.PI / 2)
    const drum = new THREE.Mesh(drumGeo, mats.dark)
    drum.position.set(w.x, w.r, 0)
    root.add(drum)
  }

  // cabin: paint-coloured greenhouse with glass inset
  const cabinW = spec.width * spec.cabinWidth
  const cabin = new THREE.Mesh(
    extrude(cabinShape(spec), cabinW, 0.12, 0.07, (x, y) => cabinScale(spec, x, y)),
    mats.paint,
  )
  root.add(cabin)
  const flat = cabinW - 0.24
  const winGeo = new THREE.ExtrudeGeometry(windowShape(spec), {
    depth: cabinW + 0.03,
    bevelEnabled: false,
    curveSegments: 24,
  })
  winGeo.translate(0, 0, -(cabinW + 0.03) / 2)
  applyZ(winGeo, (x, y) => cabinScale(spec, x, y))
  root.add(new THREE.Mesh(winGeo, mats.glass))
  root.add(glassPlane(spec.windscreen.from, spec.windscreen.to, flat - 0.2, 0.075, 'front', mats.glass))
  root.add(glassPlane(spec.rearGlass.from, spec.rearGlass.to, flat - 0.2, 0.075, 'rear', mats.glass))

  addDetails(root, shape, spec, mats)

  // wheels
  const wheels: THREE.Object3D[] = []
  for (const w of spec.wheels) {
    for (const s of [-1, 1]) {
      const wheel = makeWheel(w, spec.wheelStyle, mats)
      wheel.position.set(w.x, w.r, s * (spec.width / 2 - w.w / 2 - 0.03))
      if (s === 1) wheel.rotation.y = Math.PI
      root.add(wheel)
      const spin = wheel.getObjectByName('spin')
      if (spin) wheels.push(spin)
    }
  }

  root.traverse((o) => {
    if (o instanceof THREE.Mesh) {
      o.castShadow = true
      o.receiveShadow = true
    }
  })

  return { group: root, wheels }
}

export const CAR_LENGTH = 4.8
