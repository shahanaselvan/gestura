import { useEffect, useState } from 'react'
import { useTTS } from '../hooks/useTTS'

const STORAGE_KEY = 'gestura.quickPhrases'

const DEFAULT_PHRASES = {
  Greetings: [
    'Hello, how are you?',
    'Nice to meet you',
    'Good morning',
    'Good afternoon',
    'Good evening',
    'Goodbye, see you later',
  ],
  Emergency: [
    'I need help',
    'Please call an ambulance',
    'Please call the police',
    'I cannot hear. Please type or write.',
    'I need a doctor',
    'Please call my family',
  ],
  'Daily Life': [
    'Thank you',
    'Please',
    'Excuse me',
    'I need water',
    'Where is the restroom?',
    'I am hungry',
  ],
  Questions: [
    'What time is it?',
    'Can you write that down?',
    'Can you repeat that, please?',
    'Where is the nearest bus stop?',
    'How much does this cost?',
    'Do you understand sign language?',
  ],
}

const CONVERSATIONS = [
  {
    icon: '🍽️',
    title: 'Restaurant Ordering',
    phrases: [
      'A table for two, please',
      'Can I see the menu?',
      'I would like to order this one',
      'Does this contain nuts?',
      'Could we have some water?',
      'The bill, please',
    ],
  },
  {
    icon: '🏥',
    title: "Doctor's Visit",
    phrases: [
      'I have an appointment',
      'I have pain here',
      'It started two days ago',
      'Can you write down the instructions?',
      'Can you explain the medicine, please?',
      'Thank you, doctor',
    ],
  },
  {
    icon: '🛒',
    title: 'Shopping',
    phrases: [
      'How much is this?',
      'Do you have this in another size?',
      'Can I pay by card?',
      'Can I pay with UPI?',
      'Can I get a bag, please?',
      'Thank you',
    ],
  },
]

function loadPhrases() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    const valid =
      saved && Object.keys(DEFAULT_PHRASES).every((k) => Array.isArray(saved[k]))
    if (valid) return saved
  } catch {
    // ignore: fall back to defaults
  }
  return DEFAULT_PHRASES
}

const iconBtn =
  'rounded-lg p-2 text-muted transition hover:bg-brand-100 hover:text-brand-600'

export default function QuickPhrases() {
  const { speak, supported } = useTTS()
  const [tab, setTab] = useState('phrases')
  const [category, setCategory] = useState('Greetings')
  const [phrases, setPhrases] = useState(loadPhrases)
  const [newPhrase, setNewPhrase] = useState('')
  const [editing, setEditing] = useState(null) // { index, value }
  const [flow, setFlow] = useState(null) // title of the open conversation
  const [rate, setRate] = useState(1)
  const [volume, setVolume] = useState(1)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(phrases))
    } catch {
      // storage may be unavailable; the page still works
    }
  }, [phrases])

  const say = (text) => speak(text, { rate, volume })
  const list = phrases[category] ?? []
  const openFlow = CONVERSATIONS.find((c) => c.title === flow)

  const addPhrase = () => {
    const text = newPhrase.trim()
    if (!text) return
    setPhrases((p) => ({ ...p, [category]: [...p[category], text] }))
    setNewPhrase('')
  }

  const deletePhrase = (index) =>
    setPhrases((p) => ({ ...p, [category]: p[category].filter((_, i) => i !== index) }))

  const saveEdit = () => {
    const text = editing.value.trim()
    if (text) {
      setPhrases((p) => ({
        ...p,
        [category]: p[category].map((t, i) => (i === editing.index ? text : t)),
      }))
    }
    setEditing(null)
  }

  const resetPhrases = () => {
    if (window.confirm('Reset all phrases to the defaults? Your added phrases will be removed.')) {
      setPhrases(DEFAULT_PHRASES)
      setEditing(null)
    }
  }

  const tabClass = (id) =>
    `flex-1 border-b-2 px-4 py-3 text-center font-semibold transition ${
      tab === id
        ? 'border-brand-500 text-brand-600'
        : 'border-transparent text-muted hover:text-brand-600'
    }`

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-4xl font-bold gradient-text">Quick Phrases</h1>
      <p className="mt-2 text-muted">Access common phrases for quick and efficient communication.</p>

      {!supported && (
        <p className="mt-4 rounded-xl bg-white p-3 text-sm text-muted">
          Text-to-speech isn’t supported in this browser. Try Chrome or Edge to hear phrases spoken.
        </p>
      )}

      <section className="card mt-6 overflow-hidden">
        <div role="tablist" className="flex border-b border-brand-100">
          <button role="tab" aria-selected={tab === 'phrases'} className={tabClass('phrases')} onClick={() => setTab('phrases')}>
            Quick Phrases
          </button>
          <button role="tab" aria-selected={tab === 'customize'} className={tabClass('customize')} onClick={() => setTab('customize')}>
            Customize
          </button>
        </div>

        {tab === 'phrases' ? (
          <div className="p-5">
            <div className="flex flex-wrap gap-2">
              {Object.keys(phrases).map((c) => (
                <button
                  key={c}
                  onClick={() => { setCategory(c); setEditing(null) }}
                  aria-pressed={category === c}
                  className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
                    category === c
                      ? 'border-brand-500 bg-brand-500 text-white'
                      : 'border-brand-200 bg-white text-muted hover:bg-brand-100'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            <div className="mt-4 flex gap-3">
              <label htmlFor="new-phrase" className="sr-only">Add a new phrase</label>
              <input
                id="new-phrase"
                value={newPhrase}
                onChange={(e) => setNewPhrase(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addPhrase()}
                placeholder="Add a new phrase..."
                className="flex-1 rounded-full border border-brand-200 bg-brand-50 px-4 py-2.5"
              />
              <button onClick={addPhrase} className="btn-gradient px-6 py-2.5">Add</button>
            </div>

            <ul className="mt-4 space-y-2">
              {list.length === 0 && (
                <li className="rounded-xl bg-brand-50 px-4 py-6 text-center text-muted">
                  No phrases here yet. Add one above.
                </li>
              )}
              {list.map((phrase, i) => (
                <li key={`${phrase}-${i}`} className="flex items-center justify-between gap-3 rounded-xl bg-brand-50 px-4 py-2.5">
                  {editing?.index === i ? (
                    <>
                      <input
                        autoFocus
                        value={editing.value}
                        onChange={(e) => setEditing({ index: i, value: e.target.value })}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveEdit()
                          if (e.key === 'Escape') setEditing(null)
                        }}
                        aria-label="Edit phrase"
                        className="flex-1 rounded-lg border border-brand-200 bg-white px-3 py-1.5"
                      />
                      <div className="flex gap-1">
                        <button onClick={saveEdit} className={iconBtn}>Save</button>
                        <button onClick={() => setEditing(null)} className={iconBtn}>Cancel</button>
                      </div>
                    </>
                  ) : (
                    <>
                      <span>{phrase}</span>
                      <div className="flex shrink-0 gap-1">
                        <button className={iconBtn} aria-label={`Edit: ${phrase}`} onClick={() => setEditing({ index: i, value: phrase })}>✏️</button>
                        <button className={iconBtn} aria-label={`Delete: ${phrase}`} onClick={() => deletePhrase(i)}>🗑️</button>
                        <button className={iconBtn} aria-label={`Speak: ${phrase}`} onClick={() => say(phrase)}>▶</button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="space-y-6 p-5">
            <div>
              <label htmlFor="qp-rate" className="font-semibold">Speaking speed {rate}x</label>
              <input id="qp-rate" type="range" min="0.5" max="2" step="0.1" value={rate}
                onChange={(e) => setRate(Number(e.target.value))} className="mt-2 w-full accent-brand-500" />
            </div>
            <div>
              <label htmlFor="qp-volume" className="font-semibold">Volume {Math.round(volume * 100)}%</label>
              <input id="qp-volume" type="range" min="0" max="1" step="0.05" value={volume}
                onChange={(e) => setVolume(Number(e.target.value))} className="mt-2 w-full accent-brand-500" />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button className="btn-outline" onClick={() => say('This is how your phrases will sound')}>
                ▶ Test voice
              </button>
              <button className="btn-outline" onClick={resetPhrases}>Reset phrases to defaults</button>
            </div>
            <p className="text-sm text-muted">
              Your phrases are saved in this browser only, so they stay on this device.
            </p>
          </div>
        )}
      </section>

      <h2 className="mt-12 text-3xl font-bold gradient-text">Common Conversations</h2>
      <p className="mt-2 text-muted">Quick access to pre-built conversation flows for common scenarios.</p>

      <div className="mt-5 grid gap-4 sm:grid-cols-3">
        {CONVERSATIONS.map((c) => (
          <button
            key={c.title}
            onClick={() => setFlow(flow === c.title ? null : c.title)}
            aria-expanded={flow === c.title}
            className={`card flex flex-col items-center gap-3 p-6 font-semibold transition hover:-translate-y-1 ${
              flow === c.title ? 'ring-2 ring-brand-500' : ''
            }`}
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-2xl" aria-hidden="true">
              {c.icon}
            </span>
            {c.title}
          </button>
        ))}
      </div>

      {openFlow && (
        <section className="card mt-5 p-5" aria-label={openFlow.title}>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{openFlow.title}</h3>
            <button onClick={() => setFlow(null)} className={iconBtn} aria-label="Close conversation">✕</button>
          </div>
          <ul className="mt-3 space-y-2">
            {openFlow.phrases.map((p) => (
              <li key={p} className="flex items-center justify-between gap-3 rounded-xl bg-brand-50 px-4 py-2.5">
                <span>{p}</span>
                <button className={iconBtn} aria-label={`Speak: ${p}`} onClick={() => say(p)}>▶</button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}