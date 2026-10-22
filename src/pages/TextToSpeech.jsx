import { useMemo, useState } from 'react'
import { useTTS } from '../hooks/useTTS'

const BENEFITS = [
  { title: 'Multiple languages', desc: 'Use the language filter to quickly find a voice that matches your listener.' },
  { title: 'Natural voices', desc: 'Choose from the voices available on your device and browser.' },
  { title: 'Adjustable settings', desc: 'Fine-tune speaking speed and volume so conversations feel natural.' },
]

export default function TextToSpeech() {
  const { voices, speak, stop, speaking, supported } = useTTS()
  const [text, setText] = useState('')
  const [voiceURI, setVoiceURI] = useState('')
  const [lang, setLang] = useState('all')
  const [rate, setRate] = useState(1)
  const [volume, setVolume] = useState(0.8)

  const languages = useMemo(() => [...new Set(voices.map((v) => v.lang))].sort(), [voices])
  const filtered = lang === 'all' ? voices : voices.filter((v) => v.lang === lang)
  const selected = filtered.some((v) => v.voiceURI === voiceURI)
    ? voiceURI
    : filtered[0]?.voiceURI ?? ''

  let status = 'Ready. Type a message and press “Speak”.'
  if (!supported) status = 'Text-to-speech is not supported in this browser. Try Chrome or Edge.'
  else if (speaking) status = 'Speaking…'

  const selectClass =
    'w-full rounded-full border border-brand-200 bg-brand-50 px-4 py-3 text-ink'

  return (
    <div className="mx-auto max-w-5xl">
      <div className="text-center">
        <h1 className="text-4xl font-bold gradient-text md:text-5xl">Text to natural-sounding speech</h1>
        <p className="mx-auto mt-3 max-w-xl text-muted">
          Type what you want to say and let GESTURA speak for you. Choose your language,
          voice, speed, and volume for real-time playback.
        </p>
      </div>

      <section className="card mt-8 p-6 md:p-8">
        <label htmlFor="tts-text" className="font-semibold">Enter text to be spoken</label>
        <textarea
          id="tts-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={5}
          placeholder="Type your message here..."
          className="mt-2 w-full rounded-2xl border border-brand-200 bg-brand-50 p-4 text-lg"
        />

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="tts-voice" className="mb-2 block font-semibold">Voice</label>
            <select id="tts-voice" className={selectClass} value={selected} onChange={(e) => setVoiceURI(e.target.value)}>
              {filtered.map((v) => (
                <option key={v.voiceURI} value={v.voiceURI}>{v.name} ({v.lang})</option>
              ))}
            </select>
            <p className="pill mt-2 text-sm">
              {voices.length ? 'Voices loaded. Choose the one that sounds best.' : 'Loading voices…'}
            </p>
          </div>

          <div>
            <label htmlFor="tts-lang" className="mb-2 block font-semibold">Language</label>
            <select id="tts-lang" className={selectClass} value={lang} onChange={(e) => setLang(e.target.value)}>
              <option value="all">Show all available voices</option>
              {languages.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
            <p className="mt-2 text-sm text-muted">
              Filtering here helps you quickly find voices that match your listener’s language.
            </p>
          </div>

          <div>
            <label htmlFor="tts-rate" className="font-semibold">Speed {rate}x</label>
            <input id="tts-rate" type="range" min="0.5" max="2" step="0.1" value={rate}
              onChange={(e) => setRate(Number(e.target.value))} className="mt-2 w-full accent-brand-500" />
          </div>

          <div>
            <label htmlFor="tts-volume" className="font-semibold">Volume {Math.round(volume * 100)}%</label>
            <input id="tts-volume" type="range" min="0" max="1" step="0.05" value={volume}
              onChange={(e) => setVolume(Number(e.target.value))} className="mt-2 w-full accent-brand-500" />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            onClick={() => speak(text, { voiceURI: selected, rate, volume })}
            disabled={!supported || !text.trim()}
            className="btn-gradient min-w-48 flex-1 disabled:opacity-50"
          >
            ▶ Speak
          </button>
          <button onClick={stop} className="btn-outline">■ Stop</button>
          <button onClick={() => { stop(); setText('') }} className="px-3 py-2 font-semibold text-brand-600">
            Clear text
          </button>
          <span className="text-sm text-muted" role="status">{status}</span>
        </div>
      </section>

      <section className="card mt-8 p-6">
        <h2 className="text-xl font-semibold">Why use GESTURA Text to Speech?</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {BENEFITS.map((b) => (
            <div key={b.title} className="rounded-2xl border border-brand-100 p-4">
              <h3 className="font-semibold">{b.title}</h3>
              <p className="mt-1 text-sm text-muted">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}