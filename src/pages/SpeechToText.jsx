import { useState } from 'react'
import { useSpeechRecognition } from '../hooks/useSpeechRecognition'

const LANGUAGES = [
  { code: 'en-IN', label: 'English (India)' },
  { code: 'en-US', label: 'English (US)' },
  { code: 'en-GB', label: 'English (UK)' },
  { code: 'ta-IN', label: 'Tamil (India)' },
  { code: 'hi-IN', label: 'Hindi (India)' },
  { code: 'te-IN', label: 'Telugu (India)' },
  { code: 'ml-IN', label: 'Malayalam (India)' },
]

const TIPS = [
  'Face the microphone and speak at a natural pace.',
  'Reduce background noise from fans, music, or crowds.',
  'Choose the language that matches the speaker’s accent.',
  'Use “Copy text” to share transcripts with other apps or save notes.',
]

export default function SpeechToText() {
  const { supported, listening, finalText, interim, error, start, stop, clear } =
    useSpeechRecognition()
  const [lang, setLang] = useState('en-IN')
  const [copied, setCopied] = useState(false)

  const langLabel = LANGUAGES.find((l) => l.code === lang)?.label

  let status = 'Ready. Choose a language and press “Start Listening”.'
  if (!supported) status = 'Speech recognition is not supported in this browser. Try Chrome or Edge.'
  else if (error) status = error
  else if (listening) status = 'Listening… speak now.'

  const copyText = async () => {
    if (!finalText) return
    try {
      await navigator.clipboard.writeText(finalText)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <span className="pill">
          <span className="h-2 w-2 rounded-full bg-accent" />
          Live captions for Deaf &amp; Mute conversations
        </span>
        <h1 className="mt-4 text-4xl font-bold md:text-5xl">Speech to Text in real time</h1>
        <p className="mt-4 max-w-lg text-lg text-muted">
          Turn live speech into readable captions instantly. Choose your language, start
          listening, and let GESTURA keep up with every word.
        </p>

        <p className="pill mt-5 bg-white shadow-soft" role="status">{status}</p>

        <section className="card mt-5 p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <label htmlFor="stt-lang" className="mb-2 block font-semibold">
                Language for transcription
              </label>
              <select
                id="stt-lang"
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                disabled={listening}
                className="rounded-full border border-brand-200 bg-brand-50 px-4 py-3 disabled:opacity-60"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>{l.label}</option>
                ))}
              </select>
              <p className="mt-2 max-w-60 text-sm text-muted">
                Language support depends on your browser’s speech recognition engine.
              </p>
            </div>

            <div className="text-right">
              <button
                onClick={() => (listening ? stop() : start(lang))}
                disabled={!supported}
                className="btn-gradient disabled:opacity-50"
              >
                {listening ? '■ Stop Listening' : '🎤 Start Listening'}
              </button>
              <p className="mt-2 text-sm text-muted">Works best in a quiet room.</p>
              <p className="pill mt-1 text-xs">Use Chrome / Edge for best results</p>
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            <button onClick={copyText} className="btn-outline px-4 py-2 text-sm">
              {copied ? 'Copied ✓' : 'Copy text'}
            </button>
            <button onClick={clear} className="btn-outline px-4 py-2 text-sm">
              Clear transcript
            </button>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-dashed border-brand-200 p-5">
          <h2 className="font-semibold">Best results with Speech to Text</h2>
          <p className="mt-1 text-sm text-muted">
            To help Deaf &amp; Mute users read conversations smoothly, you can:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-muted">
            {TIPS.map((t) => <li key={t}>{t}</li>)}
          </ul>
        </section>
      </div>

      <section className="card h-fit p-6">
        <h2 className="text-xl font-semibold">Live transcript</h2>
        <p className="text-sm text-muted">Language: {langLabel}</p>

        <div
          className="mt-4 min-h-52 rounded-2xl border border-brand-100 bg-brand-50/50 p-4 text-xl leading-relaxed"
          aria-live="polite"
        >
          {finalText || interim ? (
            <>
              <span>{finalText}</span>
              {interim && <span className="text-muted"> {interim}</span>}
            </>
          ) : (
            <span className="text-muted">
              Your transcript will appear here while someone speaks. Interim words will
              update in real time before they are confirmed.
            </span>
          )}
        </div>

        <div className="mt-4 flex justify-between gap-4 border-t border-brand-100 pt-4 text-sm text-muted">
          <span>{listening ? 'Microphone active.' : 'Microphone idle.'}</span>
          <span>Tip: keep the microphone close to the speaker for clearer captions.</span>
        </div>
      </section>
    </div>
  )
}