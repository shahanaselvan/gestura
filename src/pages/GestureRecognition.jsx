import { useEffect, useRef, useState } from 'react'
import { useTTS } from '../hooks/useTTS'

const MODEL_URL =
  'https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task'
const WASM_PATH = '/mediapipe-wasm'
const HOLD_MS = 900 // how long a gesture must be held before it counts
const MIN_SCORE = 0.6 // minimum model confidence
const IDLE_DEBUG = 'Waiting for hand…'

const GESTURES = {
  Thumb_Up: { emoji: '👍', label: 'Thumbs up', text: 'Yes' },
  Thumb_Down: { emoji: '👎', label: 'Thumbs down', text: 'No' },
  Open_Palm: { emoji: '✋', label: 'Open palm', text: 'Hello' },
  Closed_Fist: { emoji: '✊', label: 'Closed fist', text: 'Please wait' },
  Pointing_Up: { emoji: '☝️', label: 'Pointing up', text: 'I need help' },
  Victory: { emoji: '✌️', label: 'Victory sign', text: 'Thank you' },
  ILoveYou: { emoji: '🤟', label: 'I-love-you sign', text: 'I love you' },
}

const TIPS = [
  'Use good, even lighting on your hand.',
  'Keep one hand fully visible in the frame.',
  'Make clear, deliberate gestures.',
  'Hold each gesture steady for about a second.',
  'Lower your hand or change gesture between phrases.',
]

function cameraMessage(e) {
  switch (e?.name) {
    case 'NotAllowedError':
      return 'Camera access was blocked. Allow the camera in your browser settings and try again.'
    case 'NotFoundError':
      return 'No camera was found. Connect a camera and try again.'
    case 'NotReadableError':
      return 'The camera is being used by another app. Close it and try again.'
    default:
      return 'Could not start the camera.'
  }
}

export default function GestureRecognition() {
  const { speak, supported: ttsSupported } = useTTS()

  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const visionRef = useRef(null)
  const recognizerRef = useRef(null)
  const streamRef = useRef(null)
  const rafRef = useRef(0)
  const mountedRef = useRef(true)
  const lastVideoTimeRef = useRef(-1)
  const holdRef = useRef({ name: null, since: 0 })
  const committedRef = useRef(null)
  const lastDebugRef = useRef(0)
  const speakOutRef = useRef(false)
  const speakFnRef = useRef(speak)

  const [status, setStatus] = useState('idle') // idle | loading | running | error
  const [error, setError] = useState('')
  const [items, setItems] = useState([])
  const [debug, setDebug] = useState(IDLE_DEBUG)
  const [speakOut, setSpeakOut] = useState(false)
  const [copied, setCopied] = useState(false)

  // the camera loop reads these through refs so it never uses stale values
  useEffect(() => { speakOutRef.current = speakOut }, [speakOut])
  useEffect(() => { speakFnRef.current = speak }, [speak])

  const stopCamera = () => {
    cancelAnimationFrame(rafRef.current)
    rafRef.current = 0
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    if (videoRef.current) videoRef.current.srcObject = null
    const canvas = canvasRef.current
    canvas?.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
    holdRef.current = { name: null, since: 0 }
    committedRef.current = null
    lastVideoTimeRef.current = -1
  }

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      stopCamera()
      recognizerRef.current?.close()
      recognizerRef.current = null
    }
  }, [])

  // Turn the model's per-frame guess into a stable, deliberate phrase:
  // the same gesture must be held for HOLD_MS, and it only counts once
  // until the hand changes gesture or leaves the frame.
  const handleGesture = (name, score, now) => {
    let text
    const known = GESTURES[name]

    if (!name) {
      holdRef.current = { name: null, since: 0 }
      committedRef.current = null
      text = IDLE_DEBUG
    } else if (!known || score < MIN_SCORE) {
      holdRef.current = { name: null, since: 0 }
      committedRef.current = null
      text = 'Hand detected, no known gesture.'
    } else {
      if (holdRef.current.name !== name) {
        holdRef.current = { name, since: now }
        committedRef.current = null
      }
      const held = now - holdRef.current.since
      if (held >= HOLD_MS && committedRef.current !== name) {
        committedRef.current = name
        setItems((prev) => [...prev, known.text])
        if (speakOutRef.current) speakFnRef.current(known.text)
      }
      const pct = Math.min(100, Math.round((held / HOLD_MS) * 100))
      const state = committedRef.current === name ? 'recognized ✓' : `holding ${pct}%`
      text = `${known.emoji} ${known.label} · ${Math.round(score * 100)}% · ${state}`
    }

    if (now - lastDebugRef.current > 120) {
      lastDebugRef.current = now
      setDebug(text)
    }
  }

  const fail = (message) => {
    stopCamera()
    setError(message)
    setStatus('error')
  }

  const start = async () => {
    if (status === 'loading' || status === 'running') return
    setError('')
    setStatus('loading')

    // 1. load the model (only the first time)
    try {
      if (!recognizerRef.current) {
        const vision = await import('@mediapipe/tasks-vision')
        visionRef.current = vision
        const fileset = await vision.FilesetResolver.forVisionTasks(WASM_PATH)
        const create = (delegate) =>
          vision.GestureRecognizer.createFromOptions(fileset, {
            baseOptions: { modelAssetPath: MODEL_URL, delegate },
            runningMode: 'VIDEO',
            numHands: 1,
          })
        try {
          recognizerRef.current = await create('GPU')
        } catch {
          recognizerRef.current = await create('CPU') // fallback if the GPU isn't usable
        }
      }
    } catch (e) {
      console.error(e)
      fail('Could not load the gesture model. Check your internet connection and try again.')
      return
    }

    // 2. open the camera
    let stream
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      })
    } catch (e) {
      fail(cameraMessage(e))
      return
    }
    if (!mountedRef.current) {
      stream.getTracks().forEach((t) => t.stop())
      return
    }

    streamRef.current = stream
    const video = videoRef.current
    video.srcObject = stream
    try {
      await video.play()
    } catch (e) {
      console.error(e)
      fail('Could not start the video.')
      return
    }
    setStatus('running')
    setDebug(IDLE_DEBUG)

    // 3. run recognition on every new video frame
    const { DrawingUtils, GestureRecognizer } = visionRef.current
    const tick = () => {
      const recognizer = recognizerRef.current
      const canvas = canvasRef.current
      if (!recognizer || !canvas || !streamRef.current) return

      if (video.readyState >= 2 && video.currentTime !== lastVideoTimeRef.current) {
        lastVideoTimeRef.current = video.currentTime
        const now = performance.now()
        const result = recognizer.recognizeForVideo(video, now)

        if (canvas.width !== video.videoWidth) {
          canvas.width = video.videoWidth
          canvas.height = video.videoHeight
        }
        const ctx = canvas.getContext('2d')
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        const hand = result.landmarks?.[0]
        if (hand) {
          const utils = new DrawingUtils(ctx)
          utils.drawConnectors(hand, GestureRecognizer.HAND_CONNECTIONS, { color: '#7c5cff', lineWidth: 4 })
          utils.drawLandmarks(hand, { color: '#f472d0', lineWidth: 1, radius: 4 })
          const top = result.gestures?.[0]?.[0]
          handleGesture(top?.categoryName ?? 'None', top?.score ?? 0, now)
        } else {
          handleGesture(null, 0, now)
        }
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
  }

  const stop = () => {
    stopCamera()
    setStatus('idle')
    setDebug(IDLE_DEBUG)
  }

  const copyText = async () => {
    if (!items.length) return
    try {
      await navigator.clipboard.writeText(items.join('\n'))
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
    }
  }

  let statusText = 'Ready. Press “Start Camera” to begin recognition.'
  if (status === 'loading') statusText = 'Loading the gesture model and camera… the first time can take a few seconds.'
  else if (status === 'running') statusText = 'Camera on. Show a gesture and hold it steady.'
  else if (status === 'error') statusText = error

  const badge = { idle: 'Camera idle.', loading: 'Starting…', running: 'Camera on', error: 'Camera error' }[status]

  return (
    <div>
      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <span className="pill">
            <span className="h-2 w-2 rounded-full bg-accent" />
            Real-time hand gesture recognition
          </span>
          <h1 className="mt-4 text-4xl font-bold md:text-5xl">Gesture Recognition</h1>
          <p className="mt-4 max-w-lg text-lg text-muted">
            Show a hand gesture to your camera and GESTURA turns it into text. This
            prototype recognizes a small set of gestures.
          </p>
          <p className="pill mt-5 bg-white shadow-soft" role="status">{statusText}</p>

          <section className="card mt-5 p-5">
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-brand-50">
              <video
                ref={videoRef}
                playsInline
                muted
                className="absolute inset-0 h-full w-full scale-x-[-1] object-contain"
              />
              <canvas
                ref={canvasRef}
                className="absolute inset-0 h-full w-full scale-x-[-1] object-contain"
              />
              {status !== 'running' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted">
                  <span className="text-5xl" aria-hidden="true">📷</span>
                  <span>{status === 'loading' ? 'Starting…' : 'Camera inactive'}</span>
                </div>
              )}
            </div>

            <button
              onClick={status === 'running' ? stop : start}
              disabled={status === 'loading'}
              className="btn-gradient mt-4 w-full disabled:opacity-60"
            >
              {status === 'running' ? '■ Stop Camera' : status === 'loading' ? 'Starting…' : '📷 Start Camera'}
            </button>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <button onClick={() => setItems([])} className="btn-outline px-4 py-2 text-sm">Clear</button>
              <button onClick={copyText} className="btn-outline px-4 py-2 text-sm">
                {copied ? 'Copied ✓' : 'Copy'}
              </button>
              <label className="ml-auto flex items-center gap-2 text-sm text-muted">
                <input
                  type="checkbox"
                  checked={speakOut}
                  onChange={(e) => setSpeakOut(e.target.checked)}
                  disabled={!ttsSupported}
                  className="h-4 w-4 accent-brand-500"
                />
                Speak recognized phrases
              </label>
            </div>
          </section>
        </div>

        <div>
          <section className="card p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Recognized Text</h2>
              <span className="text-sm text-muted">{badge}</span>
            </div>

            <div
              className="mt-4 min-h-64 rounded-2xl border border-brand-100 bg-brand-50/50 p-4"
              aria-live="polite"
            >
              {items.length ? (
                <ul className="space-y-2">
                  {items.map((t, i) => (
                    <li key={i} className="rounded-xl bg-white px-4 py-2 text-xl shadow-sm">{t}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted">Gestures will be converted to text here…</p>
              )}
            </div>

            <div className="mt-4 flex justify-between text-sm text-muted">
              <span>Hand gestures</span>
              <span>{items.length} gestures recognized</span>
            </div>
            <p className="mt-3 rounded-xl bg-brand-50 px-4 py-2 text-sm text-muted">
              <strong>Debug:</strong> {debug}
            </p>
          </section>

          <section className="mt-6 rounded-2xl border border-dashed border-brand-200 p-5">
            <h2 className="font-semibold">💡 Best Results</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-muted">
              {TIPS.map((t) => <li key={t}>{t}</li>)}
            </ul>
            <p className="mt-3 text-sm text-muted">
              Your video is processed in your browser and is not uploaded.
            </p>
          </section>
        </div>
      </div>

      <section className="card mt-10 p-6">
        <h2 className="text-xl font-semibold">Supported gestures</h2>
        <p className="mt-1 text-sm text-muted">
          GESTURA currently recognizes these gestures and turns each into a phrase.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          {Object.entries(GESTURES).map(([key, g]) => (
            <div key={key} className="rounded-2xl border border-brand-100 p-4 text-center">
              <div className="text-4xl" aria-hidden="true">{g.emoji}</div>
              <p className="mt-2 font-semibold">{g.text}</p>
              <p className="text-xs text-muted">{g.label}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}