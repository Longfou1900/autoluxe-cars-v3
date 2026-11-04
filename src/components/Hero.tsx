const STREAKS = [
  { top: '18%', delay: '0s', width: '38%', duration: '1.6s' },
  { top: '26%', delay: '0.4s', width: '26%', duration: '1.3s' },
  { top: '34%', delay: '0.9s', width: '44%', duration: '1.8s' },
  { top: '46%', delay: '0.2s', width: '30%', duration: '1.4s' },
  { top: '58%', delay: '0.7s', width: '40%', duration: '1.7s' },
  { top: '66%', delay: '1.1s', width: '24%', duration: '1.2s' },
  { top: '74%', delay: '0.5s', width: '36%', duration: '1.5s' },
  { top: '82%', delay: '1.3s', width: '28%', duration: '1.9s' },
]

const STATS = [
  { value: '640', label: 'Horsepower' },
  { value: '3.1s', label: '0 – 100 km/h' },
  { value: '330', label: 'Top speed km/h' },
]

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="hero-glow" aria-hidden="true" />
      <div className="streaks" aria-hidden="true">
        {STREAKS.map((s, i) => (
          <span
            key={i}
            className="streak"
            style={{
              top: s.top,
              width: s.width,
              animationDelay: s.delay,
              animationDuration: s.duration,
            }}
          />
        ))}
      </div>

      <div className="hero-copy">
        <p className="eyebrow">Company cars · 2027 collection Khmer</p>
        <h1>
          Arrive <span className="gradient-text">Unforgettably.</span>
        </h1>
        <p className="lead">
          Hand-picked premium company cars with full service history, fleet pricing and
          delivery in 48 hours. Feel the difference on your first test drive.
        </p>
        <div className="hero-actions">
          <a className="btn" href="#showroom">
            Explore the showroom
          </a>
          <a className="btn btn-ghost" href="#why">
            Why AutoLuxe
          </a>
        </div>
        <dl className="stats">
          {STATS.map((s) => (
            <div key={s.label}>
              <dt>{s.label}</dt>
              <dd>{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="hero-car">
        <div className="hero-frame">
          <img
            src="/images/hero-car.png"
            alt="Voltaro VX GT Turbo in chrome violet, driving at sunset"
            width={647}
            height={360}
          />
          <span className="hero-tag">Voltaro VX GT Turbo · 2026</span>
        </div>
        <div className="road" aria-hidden="true" />
      </div>
    </section>
  )
}
