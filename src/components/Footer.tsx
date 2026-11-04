const FEATURES = [
  {
    title: 'Certified quality',
    text: '150-point inspection and full service history on every vehicle.',
  },
  {
    title: 'Fleet pricing',
    text: 'Volume discounts and flexible leasing for companies of any size.',
  },
  {
    title: '48-hour delivery',
    text: 'Registered, insured and delivered straight to your office.',
  },
  {
    title: '5-year cover',
    text: 'Warranty and roadside assistance included as standard.',
  },
]

export default function Footer() {
  return (
    <>
      <section className="section" id="why">
        <div className="section-head">
          <p className="eyebrow">Why AutoLuxe</p>
          <h2>Built for businesses that move fast</h2>
        </div>
        <div className="features">
          {FEATURES.map((f) => (
            <div className="feature" key={f.title}>
              <h3>{f.title}</h3>
              <p className="muted">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="footer" id="contact">
        <div>
          <strong>AutoLuxe</strong>
          <p className="muted">Premium company cars · Phnom Penh</p>
        </div>
        <p className="muted">© {new Date().getFullYear()} AutoLuxe. All rights reserved.</p>
      </footer>
    </>
  )
}
