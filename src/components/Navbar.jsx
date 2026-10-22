import { useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { NAV_ITEMS } from '../navItems'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const current = NAV_ITEMS.find((i) => i.path === pathname)
  const subtitle = !current || pathname === '/' ? 'Deaf & Mute Experience' : current.label

  const linkClass = ({ isActive }) =>
    `whitespace-nowrap transition ${
      isActive ? 'text-brand-600 font-semibold' : 'text-muted hover:text-brand-600'
    }`

  return (
    <header className="sticky top-0 z-50 border-b border-brand-100 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-gradient font-bold text-white shadow-soft">
            G
          </span>
          <span className="leading-tight">
            <span className="block font-bold tracking-wide">GESTURA</span>
            <span className="block text-sm text-muted">{subtitle}</span>
          </span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-5 text-[0.95rem] xl:flex">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.path} to={item.path} end={item.path === '/'} className={linkClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button
          className="rounded-lg border border-brand-200 px-3 py-2 text-brand-600 xl:hidden"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label="Toggle menu"
        >
          {open ? '✕' : '☰'}
        </button>
      </div>

      {open && (
        <nav aria-label="Mobile" className="flex flex-col border-t border-brand-100 bg-white px-4 py-2 xl:hidden">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              onClick={() => setOpen(false)}
              className={(s) => `py-2 ${linkClass(s)}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  )
}