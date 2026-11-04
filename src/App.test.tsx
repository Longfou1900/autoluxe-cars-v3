import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'
import { cars, formatPrice } from './data/cars'

// jsdom has no WebGL, so the real three.js viewer is replaced by a stub in tests.
vi.mock('./components/CarViewer3D', async () => {
  const { createElement } = await import('react')
  return { default: () => createElement('div', { 'data-testid': 'viewer-3d' }) }
})

describe('AutoLuxe app', () => {
  it('renders the hero headline and brand', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/arrive/i)
    expect(screen.getByLabelText('AutoLuxe home')).toBeInTheDocument()
  })

  it('shows every car in the catalog by default', () => {
    render(<App />)
    expect(screen.getAllByRole('article')).toHaveLength(cars.length)
  })

  it('filters the catalog by category', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'Electric' }))
    const expected = cars.filter((c) => c.category === 'Electric').length
    expect(screen.getAllByRole('article')).toHaveLength(expected)
  })

  it('searches by model name and shows an empty state when nothing matches', async () => {
    const user = userEvent.setup()
    render(<App />)
    const search = screen.getByLabelText('Search cars')

    await user.type(search, 'titan')
    expect(screen.getAllByRole('article')).toHaveLength(1)

    await user.clear(search)
    await user.type(search, 'zzzz')
    expect(screen.getByRole('status')).toHaveTextContent(/no cars match/i)
  })

  it('sorts by price from low to high', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.selectOptions(screen.getByLabelText('Sort cars'), 'price-asc')
    const first = screen.getAllByRole('article')[0]
    const cheapest = [...cars].sort((a, b) => a.price - b.price)[0]
    expect(within(first).getByText(formatPrice(cheapest.price))).toBeInTheDocument()
  })

  it('opens the details modal, submits a test-drive request and closes with Escape', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: /view details for vx gt turbo/i }))
    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeInTheDocument()
    expect(await within(dialog).findByTestId('viewer-3d')).toBeInTheDocument()
    expect(within(dialog).getByText('4.0L twin-turbo V8')).toBeInTheDocument()
    expect(within(dialog).getByText('RWD')).toBeInTheDocument()

    await user.type(within(dialog).getByLabelText('Full name'), 'Sokha')
    await user.type(within(dialog).getByLabelText('Email'), 'sokha@example.com')
    await user.click(within(dialog).getByRole('button', { name: /request test drive/i }))
    expect(within(dialog).getByRole('status')).toHaveTextContent(/thank you, sokha/i)

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
