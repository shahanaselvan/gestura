import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTTS } from '../hooks/useTTS'
import { useGuides } from '../GuideContext'
import GuideAvatar from '../components/GuideAvatar'
import { CHARACTERS, TOUR } from '../guides'
import {
  SKIN_TONES,
  HAIR_COLORS,
  HAIR_STYLES,
  SHIRT_COLORS,
  PANTS_COLORS,
  EXPRESSIONS,
  POSES,
} from '../customGuide'

const MODES = [
  { id: 'open', label: 'Show guides', desc: 'Guides appear on every page with tips.' },
  { id: 'min', label: 'Minimized', desc: 'Guides stay as a small icon you can tap.' },
  { id: 'off', label: 'Off', desc: 'Hide the guides completely.' },
]

function Swatches({ label, options, value, onChange }) {
  return (
    <div>
      <p className="mb-2 font-semibold">{label}</p>
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={label}>
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={value === o.value}
            aria-label={o.label}
            title={o.label}
            onClick={() => onChange(o.value)}
            style={{ backgroundColor: o.value }}
            className={`h-9 w-9 rounded-full border-2 transition ${
              value === o.value ? 'border-brand-600 ring-2 ring-brand-200' : 'border-white shadow-soft'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

function Choices({ label, options, value, onChange }) {
  return (
    <div>
      <p className="mb-2 font-semibold">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            aria-pressed={value === o.id}
            onClick={() => onChange(o.id)}
            className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
              value === o.id
                ? 'border-brand-500 bg-brand-500 text-white'
                : 'border-brand-200 bg-white text-muted hover:bg-brand-100'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function VoiceControls({ guide, onChange }) {
  const { voices, speak, stop, supported } = useTTS()
  const sorted = [...voices].sort((a, b) => a.name.localeCompare(b.name))

  const test = () =>
    speak(guide.intro, { voiceURI: guide.voiceURI, rate: guide.rate, pitch: guide.pitch })

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Voice settings</h3>
      {!supported && (
        <p className="text-sm text-muted">
          Text-to-speech isn’t supported in this browser. Try Chrome or Edge.
        </p>
      )}

      <div>
        <label htmlFor="guide-voice" className="mb-2 block font-semibold">Voice</label>
        <select
          id="guide-voice"
          value={guide.voiceURI}
          onChange={(e) => onChange({ voiceURI: e.target.value })}
          className="w-full rounded-full border border-brand-200 bg-brand-50 px-4 py-3"
        >
          <option value="">Default voice</option>
          {sorted.map((v) => (
            <option key={v.voiceURI} value={v.voiceURI}>{v.name} ({v.lang})</option>
          ))}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="guide-pitch" className="font-semibold">
            Pitch {Number(guide.pitch).toFixed(1)}
          </label>
          <input
            id="guide-pitch"
            type="range"
            min="0.5"
            max="1.8"
            step="0.1"
            value={guide.pitch}
            onChange={(e) => onChange({ pitch: Number(e.target.value) })}
            className="mt-2 w-full accent-brand-500"
          />
        </div>
        <div>
          <label htmlFor="guide-rate" className="font-semibold">
            Speed {Number(guide.rate).toFixed(2)}x
          </label>
          <input
            id="guide-rate"
            type="range"
            min="0.6"
            max="1.4"
            step="0.05"
            value={guide.rate}
            onChange={(e) => onChange({ rate: Number(e.target.value) })}
            className="mt-2 w-full accent-brand-500"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button onClick={test} disabled={!supported} className="btn-gradient px-5 py-2 text-sm disabled:opacity-50">
          ▶ Test voice
        </button>
        <button onClick={stop} className="btn-outline px-5 py-2 text-sm">■ Stop</button>
      </div>
    </div>
  )
}

export default function Guides() {
  const navigate = useNavigate()
  const { speak, supported } = useTTS()
  const { settings, setMode, setWho, setOverride, resetGuide, setCustom, resetCustom, getGuide } =
    useGuides()
  const [editing, setEditing] = useState('custom')
  const editorRef = useRef(null)

  const guides = [...CHARACTERS.map((c) => getGuide(c.id)), getGuide('custom')]
  const editGuide = getGuide(editing)
  const isCustom = editing === 'custom'
  const profile = settings.custom

  const hear = (g) => speak(g.intro, { voiceURI: g.voiceURI, rate: g.rate, pitch: g.pitch })
  const customize = (id) => {
    setEditing(id)
    editorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  const changeVoice = (patch) => (isCustom ? setCustom(patch) : setOverride(editing, patch))

  const whoOptions = [
    { id: 'auto', label: 'Automatic', desc: 'Each page has its own guide.' },
    ...guides.map((g) => ({ id: g.id, label: g.name, desc: g.role })),
  ]

  return (
    <div className="mx-auto max-w-6xl">
      <div className="text-center">
        <span className="pill">
          <span className="h-2 w-2 rounded-full bg-accent" />
          Friendly help on every page
        </span>
        <h1 className="mt-4 text-4xl font-bold gradient-text md:text-5xl">Meet your guides</h1>
        <p className="mx-auto mt-3 max-w-xl text-muted">
          Guides show you around GESTURA with short tips. Pick your favourite, change their
          name and voice, or create a guide of your own.
        </p>
        <button
          onClick={() => navigate(TOUR[0], { state: { tour: true } })}
          className="btn-gradient mt-6"
        >
          Take the tour
        </button>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {guides.map((g) => (
          <section key={g.id} className="card flex flex-col items-center p-6 text-center">
            <div className="flex h-48 items-end justify-center">
              <GuideAvatar guide={g} variant="body" className="h-44 w-auto" />
            </div>
            <h2 className="mt-3 text-xl font-semibold">{g.name}</h2>
            <p className="text-sm text-brand-600">{g.role}</p>
            <p className="mt-3 flex-1 text-sm text-muted">{g.intro}</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {supported && (
                <button onClick={() => hear(g)} className="btn-outline px-4 py-2 text-sm">
                  🔊 Hear
                </button>
              )}
              <button onClick={() => customize(g.id)} className="btn-outline px-4 py-2 text-sm">
                ✏️ Customize
              </button>
            </div>
          </section>
        ))}
      </div>

      <fieldset className="card mt-10 p-6">
        <legend className="px-2 text-lg font-semibold">Who should guide me?</legend>
        <div className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {whoOptions.map((o) => (
            <label
              key={o.id}
              className={`cursor-pointer rounded-2xl border p-4 transition ${
                settings.who === o.id ? 'border-brand-500 bg-brand-100' : 'border-brand-200 hover:bg-brand-50'
              }`}
            >
              <input
                type="radio"
                name="who"
                value={o.id}
                checked={settings.who === o.id}
                onChange={() => setWho(o.id)}
                className="mr-2 accent-brand-500"
              />
              <span className="font-semibold">{o.label}</span>
              <p className="mt-1 text-sm text-muted">{o.desc}</p>
            </label>
          ))}
        </div>
      </fieldset>

      <section ref={editorRef} className="card mt-10 scroll-mt-24 p-6">
        <h2 className="text-2xl font-bold">Customize your guides</h2>

        <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Choose a guide to customize">
          {guides.map((g) => (
            <button
              key={g.id}
              onClick={() => setEditing(g.id)}
              aria-pressed={editing === g.id}
              className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
                editing === g.id
                  ? 'border-brand-500 bg-brand-500 text-white'
                  : 'border-brand-200 bg-white text-muted hover:bg-brand-100'
              }`}
            >
              {g.name}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-8 md:grid-cols-[14rem_1fr]">
          <div className="flex flex-col items-center gap-4 rounded-2xl bg-brand-50 p-4">
            <GuideAvatar guide={editGuide} variant="body" className="h-64 w-auto" />
            <GuideAvatar guide={editGuide} variant="head" className="w-16" />
          </div>

          <div className="space-y-6">
            <div>
              <label htmlFor="guide-name" className="mb-2 block font-semibold">Name</label>
              <input
                id="guide-name"
                maxLength={20}
                value={isCustom ? profile.name : settings.overrides[editing]?.name ?? ''}
                placeholder={isCustom ? 'Give your guide a name' : CHARACTERS.find((c) => c.id === editing)?.name}
                onChange={(e) =>
                  isCustom ? setCustom({ name: e.target.value }) : setOverride(editing, { name: e.target.value })
                }
                className="w-full max-w-sm rounded-full border border-brand-200 bg-brand-50 px-4 py-3"
              />
            </div>

            {isCustom ? (
              <>
                <Swatches label="Skin tone" options={SKIN_TONES} value={profile.skin} onChange={(v) => setCustom({ skin: v })} />
                <Swatches label="Hair color" options={HAIR_COLORS} value={profile.hair} onChange={(v) => setCustom({ hair: v })} />
                <Choices label="Hair style" options={HAIR_STYLES} value={profile.hairStyle} onChange={(v) => setCustom({ hairStyle: v })} />
                <Swatches label="Shirt" options={SHIRT_COLORS} value={profile.shirt} onChange={(v) => setCustom({ shirt: v })} />
                <Swatches label="Pants" options={PANTS_COLORS} value={profile.pants} onChange={(v) => setCustom({ pants: v })} />
                <Choices label="Expression" options={EXPRESSIONS} value={profile.expression} onChange={(v) => setCustom({ expression: v })} />
                <Choices label="Pose" options={POSES} value={profile.pose} onChange={(v) => setCustom({ pose: v })} />
              </>
            ) : (
              <p className="rounded-xl bg-brand-50 p-4 text-sm text-muted">
                {editGuide.name}’s artwork is fixed, but you can change the name and voice. To
                design how a guide looks, pick <strong>{getGuide('custom').name}</strong> above
                and customize skin, hair and clothes.
              </p>
            )}

            <VoiceControls guide={editGuide} onChange={changeVoice} />

            <button
              onClick={() => (isCustom ? resetCustom() : resetGuide(editing))}
              className="btn-outline px-5 py-2 text-sm"
            >
              Reset {editGuide.name}
            </button>
          </div>
        </div>
      </section>

      <fieldset className="card mt-10 p-6">
        <legend className="px-2 text-lg font-semibold">Guide display</legend>
        <div className="mt-2 grid gap-3 md:grid-cols-3">
          {MODES.map((m) => (
            <label
              key={m.id}
              className={`cursor-pointer rounded-2xl border p-4 transition ${
                settings.mode === m.id ? 'border-brand-500 bg-brand-100' : 'border-brand-200 hover:bg-brand-50'
              }`}
            >
              <input
                type="radio"
                name="guide-mode"
                value={m.id}
                checked={settings.mode === m.id}
                onChange={() => setMode(m.id)}
                className="mr-2 accent-brand-500"
              />
              <span className="font-semibold">{m.label}</span>
              <p className="mt-1 text-sm text-muted">{m.desc}</p>
            </label>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted">Your choices are saved in this browser.</p>
      </fieldset>
    </div>
  )
}