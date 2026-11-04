import { useRef } from 'react'
import type { MouseEvent } from 'react'
import CarArt from './CarArt'
import { formatPrice, shapeFor } from '../data/cars'
import type { Car } from '../data/cars'

interface CarCardProps {
  car: Car
  onSelect: (car: Car) => void
}

export default function CarCard({ car, onSelect }: CarCardProps) {
  const ref = useRef<HTMLElement>(null)

  const handleMove = (e: MouseEvent<HTMLElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    el.style.setProperty('--ry', `${x * 10}deg`)
    el.style.setProperty('--rx', `${-y * 8}deg`)
  }

  const reset = () => {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--ry', '0deg')
    el.style.setProperty('--rx', '0deg')
  }

  return (
    <article
      ref={ref}
      className="card"
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ ['--car-color' as string]: car.color }}
    >
      <span className="badge">{car.category}</span>
      <span className="badge badge-3d">360° 3D</span>
      <div className={`card-art${car.image ? ' card-photo' : ''}`}>
        {car.image ? (
          <img src={car.image} alt={`${car.brand} ${car.name}`} loading="lazy" />
        ) : (
          <CarArt
            color={car.color}
            accent={car.accent}
            shape={shapeFor(car.category)}
            title={`${car.brand} ${car.name}`}
          />
        )}
      </div>
      <div className="card-body">
        <p className="card-brand">
          {car.brand} · {car.year}
        </p>
        <h3>{car.name}</h3>
        <ul className="specs" aria-label="Key specifications">
          <li>
            <strong>{car.power}</strong> hp
          </li>
          <li>
            <strong>{car.acceleration}s</strong> 0–100
          </li>
          <li>
            <strong>{car.topSpeed}</strong> km/h
          </li>
        </ul>
        <div className="card-foot">
          <span className="price">{formatPrice(car.price)}</span>
          <button
            type="button"
            className="btn btn-small"
            onClick={() => onSelect(car)}
            aria-label={`View details for ${car.name}`}
          >
            View in 3D
          </button>
        </div>
      </div>
    </article>
  )
}
