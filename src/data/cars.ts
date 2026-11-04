export type Category = 'Sport' | 'SUV' | 'Sedan' | 'Electric'
export type CarShape = 'supercar' | 'suv' | 'sedan' | 'ev'
export type Drivetrain = 'RWD' | 'FWD' | 'AWD' | '4x4'

export interface Car {
  id: string
  name: string
  brand: string
  category: Category
  year: number
  price: number
  power: number // hp
  topSpeed: number // km/h
  acceleration: number // 0-100 km/h in seconds
  engine: string
  drivetrain: Drivetrain
  seats: number
  color: string
  accent: string
  description: string
  /** Optional real photo/render, e.g. '/cars/my-car.jpg' (file lives in public/). Falls back to the SVG drawing. */
  image?: string
  /** Optional 3D model, e.g. '/models/my-car.glb' (file lives in public/). Replaces the built-in 3D car. */
  model?: string
}

export const CATEGORIES: Array<'All' | Category> = ['All', 'Sport', 'SUV', 'Sedan', 'Electric']

export function shapeFor(category: Category): CarShape {
  switch (category) {
    case 'Sport':
      return 'supercar'
    case 'SUV':
      return 'suv'
    case 'Sedan':
      return 'sedan'
    case 'Electric':
      return 'ev'
  }
}

export const cars: Car[] = [
  {
    id: 'vx-gt',
    name: 'VX GT Turbo',
    brand: 'Voltaro',
    category: 'Sport',
    year: 2026,
    price: 148900,
    power: 640,
    topSpeed: 330,
    acceleration: 3.1,
    engine: '4.0L twin-turbo V8',
    drivetrain: 'RWD',
    seats: 2,
    color: '#8e2de2',
    accent: '#ff4fd8',
    description: 'Twin-turbo V8 with carbon-ceramic brakes and active aero. Built to be felt.',
    image: '/images/hero-car.png',
  },
  {
    id: 'aeris-s',
    name: 'Aeris S Coupe',
    brand: 'Lunara',
    category: 'Sport',
    year: 2026,
    price: 119500,
    power: 510,
    topSpeed: 305,
    acceleration: 3.8,
    engine: '3.0L turbo V6',
    drivetrain: 'RWD',
    seats: 2,
    color: '#f5b301',
    accent: '#ffe27a',
    description: 'A lightweight coupe with razor-sharp steering and a launch-control system.',
  },
  {
    id: 'titan-x',
    name: 'Titan X Executive',
    brand: 'Norvik',
    category: 'SUV',
    year: 2026,
    price: 92400,
    power: 420,
    topSpeed: 250,
    acceleration: 5.2,
    engine: '3.0L turbo inline-6 mild hybrid',
    drivetrain: 'AWD',
    seats: 7,
    color: '#1f6feb',
    accent: '#79c0ff',
    description: 'Seven seats, air suspension and a quiet cabin for long client trips.',
  },
  {
    id: 'ridge-4',
    name: 'Ridge 4x4 Pro',
    brand: 'Norvik',
    category: 'SUV',
    year: 2025,
    price: 68900,
    power: 330,
    topSpeed: 220,
    acceleration: 6.4,
    engine: '2.0L turbo with low-range gearbox',
    drivetrain: '4x4',
    seats: 5,
    color: '#2ea043',
    accent: '#7ee787',
    description: 'Go-anywhere capability with fleet-friendly running costs and 5-year cover.',
  },
  {
    id: 'sovereign',
    name: 'Sovereign L',
    brand: 'Aurelian',
    category: 'Sedan',
    year: 2026,
    price: 104000,
    power: 450,
    topSpeed: 260,
    acceleration: 4.6,
    engine: '4.0L V8 hybrid',
    drivetrain: 'AWD',
    seats: 5,
    color: '#8b949e',
    accent: '#d0d7de',
    description: 'The flagship chauffeur sedan: massaging rear seats and a 21-speaker studio.',
  },
  {
    id: 'metro-e',
    name: 'Metro E Business',
    brand: 'Aurelian',
    category: 'Sedan',
    year: 2025,
    price: 54900,
    power: 245,
    topSpeed: 230,
    acceleration: 6.9,
    engine: '2.0L turbo hybrid',
    drivetrain: 'FWD',
    seats: 5,
    color: '#a371f7',
    accent: '#d2a8ff',
    description: 'Efficient, refined and ready for daily company use with a generous trunk.',
  },
  {
    id: 'pulse-ev',
    name: 'Pulse EV Performance',
    brand: 'Voltaro',
    category: 'Electric',
    year: 2026,
    price: 87900,
    power: 560,
    topSpeed: 250,
    acceleration: 3.5,
    engine: 'Dual-motor electric, 95 kWh',
    drivetrain: 'AWD',
    seats: 5,
    color: '#0ea5a4',
    accent: '#5eead4',
    description: 'Dual-motor electric with 600 km range and 18-minute fast charging.',
  },
  {
    id: 'nova-ev',
    name: 'Nova EV Fleet',
    brand: 'Lunara',
    category: 'Electric',
    year: 2026,
    price: 47900,
    power: 285,
    topSpeed: 200,
    acceleration: 6.1,
    engine: 'Single-motor electric, 62 kWh',
    drivetrain: 'FWD',
    seats: 5,
    color: '#f0f6fc',
    accent: '#8b949e',
    description: 'The smart choice for company fleets: low tax, low cost, zero tailpipe emissions.',
  },
]

export function formatPrice(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}
