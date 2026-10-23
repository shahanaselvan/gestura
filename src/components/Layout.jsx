import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import GuideWidget from './GuideWidget'
import { loadGuideMode, saveGuideMode } from '../guides'

export default function Layout() {
  const { pathname } = useLocation()
  const [guideMode, setGuideModeState] = useState(loadGuideMode)

  const setGuideMode = (mode) => {
    setGuideModeState(mode)
    saveGuideMode(mode)
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10">
        <Outlet context={{ guideMode, setGuideMode }} />
      </main>
      <GuideWidget key={pathname} mode={guideMode} setMode={setGuideMode} />
    </div>
  )
}