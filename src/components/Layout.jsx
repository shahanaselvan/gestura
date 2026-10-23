import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import GuideWidget from './GuideWidget'
import { GuideProvider } from '../GuideContext'

export default function Layout() {
  const { pathname } = useLocation()

  return (
    <GuideProvider>
      <div className="min-h-screen">
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 py-10">
          <Outlet />
        </main>
        <GuideWidget key={pathname} />
      </div>
    </GuideProvider>
  )
}