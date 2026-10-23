import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTTS } from '../hooks/useTTS'
import { useGuides } from '../GuideContext'
import GuideAvatar from './GuideAvatar'
import { TOUR } from '../guides'

export default function GuideWidget() {
  const { pathname, state } = useLocation()
  const navigate = useNavigate()
  const { speak, stop, supported } = useTTS()
  const { settings, setMode, guideForPath } = useGuides()
  const [tip, setTip] = useState(0)

  const current = guideForPath(pathname)
  if (!current || settings.mode === 'off') return null
  const { guide, tips } = current

  const touring = Boolean(state?.tour)
  const tourIndex = TOUR.indexOf(pathname)
  const nextStop = TOUR[tourIndex + 1]

  const minimize = () => {
    stop()
    setMode('min')
  }
  const startTour = () => navigate(TOUR[0], { state: { tour: true } })
  const goNext = () =>
    nextStop ? navigate(nextStop, { state: { tour: true } }) : navigate('/')
  const endTour = () => navigate(pathname, { replace: true, state: null })
  const listen = () =>
    speak(tips[tip], { voiceURI: guide.voiceURI, rate: guide.rate, pitch: guide.pitch })

  if (settings.mode === 'min') {
    return (
      <button
        onClick={() => setMode('open')}
        aria-label={`Show ${guide.name}, your guide`}
        className="fixed bottom-4 right-4 z-40 rounded-full transition hover:scale-105"
      >
        <GuideAvatar guide={guide} variant="head" className="w-16" />
      </button>
    )
  }

  return (
    <div
      className={`fixed bottom-4 right-4 z-40 flex items-end gap-2 ${touring ? 'guide-walk-in' : ''}`}
    >
      <section aria-label={`${guide.name}, your guide`} className="card w-64 p-4 sm:w-80">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-semibold text-brand-600">
            {guide.name} <span className="font-normal text-muted">· {guide.role}</span>
          </p>
          <button
            onClick={minimize}
            aria-label="Minimize guide"
            className="rounded-lg px-2 text-muted hover:bg-brand-100 hover:text-brand-600"
          >
            —
          </button>
        </div>

        <p className="mt-2" aria-live="polite">{tips[tip]}</p>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {tips.length > 1 && (
            <button
              onClick={() => setTip((t) => (t + 1) % tips.length)}
              className="btn-outline px-3 py-1 text-sm"
            >
              Next tip ({tip + 1}/{tips.length})
            </button>
          )}
          {supported && (
            <button onClick={listen} className="btn-outline px-3 py-1 text-sm">
              🔊 Listen
            </button>
          )}
        </div>

        {pathname === '/' && !touring && (
          <button onClick={startTour} className="btn-gradient mt-3 w-full px-4 py-2 text-sm">
            Show me around
          </button>
        )}

        {touring && tourIndex !== -1 && (
          <div className="mt-3 flex items-center justify-between gap-2 border-t border-brand-100 pt-3">
            <span className="text-xs text-muted">
              Stop {tourIndex + 1} of {TOUR.length}
            </span>
            <div className="flex items-center gap-3">
              <button onClick={endTour} className="text-sm text-muted hover:text-brand-600">
                End tour
              </button>
              <button onClick={goNext} className="btn-gradient px-4 py-1.5 text-sm">
                {nextStop ? 'Next stop →' : 'Finish'}
              </button>
            </div>
          </div>
        )}
      </section>

      <GuideAvatar guide={guide} variant="head" className="w-12 shrink-0 md:hidden guide-bob" />
      <GuideAvatar guide={guide} variant="body" className="hidden w-20 shrink-0 md:block guide-bob" />
    </div>
  )
}