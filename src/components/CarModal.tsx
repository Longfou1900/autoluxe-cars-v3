import { lazy, Suspense, useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { formatPrice } from '../data/cars'
import type { Car } from '../data/cars'

// three.js is large, so the 3D viewer is only downloaded when a car is opened.
const CarViewer3D = lazy(() => import('./CarViewer3D'))

interface CarModalProps {
  car: Car
  onClose: () => void
}

export default function CarModal({ car, onClose }: CarModalProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [view, setView] = useState<'3d' | 'photo'>('3d')

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (name.trim() && email.includes('@')) setSent(true)
  }

  return (
    <div className="overlay" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={`${car.name} details`}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>

        <div className="modal-art modal-3d">
          {view === 'photo' && car.image ? (
            <img className="modal-photo-img" src={car.image} alt={`${car.brand} ${car.name}`} />
          ) : (
            <Suspense fallback={<div className="viewer-loading">Loading 3D view…</div>}>
              <CarViewer3D car={car} />
            </Suspense>
          )}
          {car.image && (
            <div className="view-toggle" role="group" aria-label="Choose view">
              <button
                type="button"
                className={view === '3d' ? 'on' : ''}
                aria-pressed={view === '3d'}
                onClick={() => setView('3d')}
              >
                3D
              </button>
              <button
                type="button"
                className={view === 'photo' ? 'on' : ''}
                aria-pressed={view === 'photo'}
                onClick={() => setView('photo')}
              >
                Photo
              </button>
            </div>
          )}
        </div>

        <div className="modal-body">
          <div className="modal-info">
          <p className="card-brand">
            {car.brand} · {car.year} · {car.category}
          </p>
          <h2>{car.name}</h2>
          <p className="muted">{car.description}</p>

          <dl className="spec-grid">
            <div>
              <dt>Power</dt>
              <dd>{car.power} hp</dd>
            </div>
            <div>
              <dt>0–100 km/h</dt>
              <dd>{car.acceleration}s</dd>
            </div>
            <div>
              <dt>Top speed</dt>
              <dd>{car.topSpeed} km/h</dd>
            </div>
            <div>
              <dt>Engine</dt>
              <dd>{car.engine}</dd>
            </div>
            <div>
              <dt>Drivetrain</dt>
              <dd>{car.drivetrain}</dd>
            </div>
            <div>
              <dt>Seats</dt>
              <dd>{car.seats}</dd>
            </div>
            <div>
              <dt>Price</dt>
              <dd>{formatPrice(car.price)}</dd>
            </div>
          </dl>

          </div>

          <div className="modal-form">
          {sent ? (
            <p className="success" role="status">
              Thank you, {name}! We will contact you at {email} to schedule your test drive.
            </p>
          ) : (
            <form className="form" onSubmit={submit}>
              <label>
                Full name
                <input value={name} onChange={(e) => setName(e.target.value)} required />
              </label>
              <label>
                Email
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>
              <button type="submit" className="btn">
                Request test drive
              </button>
            </form>
          )}
          </div>
        </div>
      </div>
    </div>
  )
}
