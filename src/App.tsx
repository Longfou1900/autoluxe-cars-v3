import { useCallback, useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import Catalog from './components/Catalog'
import CarModal from './components/CarModal'
import Footer from './components/Footer'
import type { Car } from './data/cars'

export default function App() {
  const [selected, setSelected] = useState<Car | null>(null)
  const close = useCallback(() => setSelected(null), [])

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Catalog onSelect={setSelected} />
      </main>
      <Footer />
      {selected && <CarModal car={selected} onClose={close} />}
    </>
  )
}
