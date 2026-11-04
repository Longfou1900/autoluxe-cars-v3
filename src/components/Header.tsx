export default function Header() {
  return (
    <header className="header">
      <a className="brand" href="#top" aria-label="AutoLuxe home">
        <span className="brand-mark" aria-hidden="true">
          A
        </span>
        <span>
          Auto<strong>Luxe</strong>
        </span>
      </a>
      <nav className="nav" aria-label="Main navigation">
        <a href="#showroom">Showroom</a>
        <a href="#why">Why us</a>
        <a href="#contact">Contact</a>
      </nav>
      <a className="btn btn-small" href="#showroom">
        Book a test drive
      </a>
    </header>
  )
}
