import { useMemo, useState } from 'react'
import CarCard from './CarCard'
import { CATEGORIES, cars } from '../data/cars'
import type { Car, Category } from '../data/cars'

type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'power'

interface CatalogProps {
  onSelect: (car: Car) => void
}

export default function Catalog({ onSelect }: CatalogProps) {
  const [category, setCategory] = useState<'All' | Category>('All')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortKey>('featured')

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    const list = cars.filter(
      (c) =>
        (category === 'All' || c.category === category) &&
        (q === '' || `${c.brand} ${c.name}`.toLowerCase().includes(q)),
    )
    const sorted = [...list]
    if (sort === 'price-asc') sorted.sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') sorted.sort((a, b) => b.price - a.price)
    if (sort === 'power') sorted.sort((a, b) => b.power - a.power)
    return sorted
  }, [category, query, sort])

  return (
    <section className="section" id="showroom">
      <div className="section-head">
        <p className="eyebrow">Showroom</p>
        <h2>Find your next company car</h2>
      </div>

      <div className="toolbar">
        <div className="chips" role="group" aria-label="Filter by category">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              className={`chip${category === c ? ' chip-active' : ''}`}
              aria-pressed={category === c}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="controls">
          <input
            type="search"
            placeholder="Search brand or model"
            aria-label="Search cars"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select
            aria-label="Sort cars"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="power">Most powerful</option>
          </select>
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="empty" role="status">
          No cars match your search. Try another category or keyword.
        </p>
      ) : (
        <div className="grid">
          {visible.map((car) => (
            <CarCard key={car.id} car={car} onSelect={onSelect} />
          ))}
        </div>
      )}
    </section>
  )
}
