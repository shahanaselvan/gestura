import { Link, useNavigate, useOutletContext } from 'react-router-dom'
import { useTTS } from '../hooks/useTTS'
import GuideAvatar from '../components/GuideAvatar'
import { CHARACTERS, PAGE_GUIDES, TOUR } from '../guides'
import { NAV_ITEMS } from '../navItems'

const MODES = [
  { id: 'open', label: 'Show guides', desc: 'Guides appear on every page with tips.' },
  { id: 'min', label: 'Minimized', desc: 'Guides stay as a small icon you can tap.' },
  { id: 'off', label: 'Off', desc: 'Hide the guides completely.' },
]

export default function Guides() {
  const { guideMode, setGuideMode } = useOutletContext()
  const { speak, supported } = useTTS()
  const navigate = useNavigate()

  const pagesFor = (id) =>
    Object.entries(PAGE_GUIDES)
      .filter(([, p]) => p.guide === id)
      .map(([path]) => NAV_ITEMS.find((n) => n.path === path))
      .filter(Boolean)

  return (
    <div className="mx-auto max-w-5xl">
      <div className="text-center">
        <span className="pill">
          <span className="h-2 w-2 rounded-full bg-accent" />
          Friendly help on every page
        </span>
        <h1 className="mt-4 text-4xl font-bold gradient-text md:text-5xl">Meet your guides</h1>
        <p className="mx-auto mt-3 max-w-xl text-muted">
          Three friendly guides show you around GESTURA with short tips, so every feature
          is easy to find and use.
        </p>
        <button onClick={() => navigate(TOUR[0], { state: { tour: true } })} className="btn-gradient mt-6">
          Take the tour
        </button>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {CHARACTERS.map((c) => (
          <section key={c.id} className="card flex flex-col items-center p-6 text-center">
            <GuideAvatar guide={c} variant="body" className="w-24" />
            <h2 className="mt-3 text-xl font-semibold">{c.name}</h2>
            <p className="text-sm text-brand-600">{c.role}</p>
            <p className="mt-3 text-muted">{c.intro}</p>

            <p className="mt-4 text-sm font-semibold">Looks after:</p>
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              {pagesFor(c.id).map((p) => (
                <Link
                  key={p.path}
                  to={p.path}
                  className="rounded-full border border-brand-200 px-3 py-1 text-sm text-brand-600 hover:bg-brand-100"
                >
                  {p.label}
                </Link>
              ))}
            </div>

            {supported && (
              <button
                onClick={() => speak(c.intro, { rate: 0.95, pitch: c.pitch })}
                className="btn-outline mt-5 px-4 py-2 text-sm"
              >
                🔊 Hear {c.name}
              </button>
            )}
          </section>
        ))}
      </div>

      <fieldset className="card mt-10 p-6">
        <legend className="px-2 text-lg font-semibold">Guide settings</legend>
        <div className="mt-2 grid gap-3 md:grid-cols-3">
          {MODES.map((m) => (
            <label
              key={m.id}
              className={`cursor-pointer rounded-2xl border p-4 transition ${
                guideMode === m.id ? 'border-brand-500 bg-brand-100' : 'border-brand-200 hover:bg-brand-50'
              }`}
            >
              <input
                type="radio"
                name="guide-mode"
                value={m.id}
                checked={guideMode === m.id}
                onChange={() => setGuideMode(m.id)}
                className="mr-2 accent-brand-500"
              />
              <span className="font-semibold">{m.label}</span>
              <p className="mt-1 text-sm text-muted">{m.desc}</p>
            </label>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted">Your choice is saved in this browser.</p>
      </fieldset>
    </div>
  )
}