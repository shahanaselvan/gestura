import { Link } from 'react-router-dom'

const FEATURES = [
  { icon: '🗣️', title: 'Speech to Text', to: '/speech-to-text',
    desc: 'Convert spoken words into easy-to-read captions in real time, with clear formatting.' },
  { icon: '🔊', title: 'Text to Speech', to: '/text-to-speech',
    desc: 'Type your message and let GESTURA speak for you using natural voices.' },
  { icon: '✋', title: 'Gesture Recognition', to: '/gesture-recognition',
    desc: 'AI interprets your hand movements and translates them into clear output.' },
  { icon: '💬', title: 'Quick Phrases', to: '/quick-phrases',
    desc: 'Tap ready-made phrases for greetings, emergencies and daily life, or add your own.' },
]

export default function Home() {
  return (
    <>
      <section className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <span className="pill">
            <span className="h-2 w-2 rounded-full bg-accent" />
            Empowering Deaf &amp; Mute communication
          </span>
          <h1 className="mt-5 text-5xl font-extrabold leading-tight md:text-6xl">
            Bridging the <span className="gradient-text">Communication Gap</span>
          </h1>
          <p className="mt-5 max-w-lg text-lg text-muted">
            GESTURA supports Deaf &amp; Mute users with AI-powered tools that turn signs,
            gestures, and text into clear speech—so you can be understood anywhere, anytime.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/gesture-recognition" className="btn-gradient">Get Started</Link>
            <a href="#features" className="btn-outline">Learn More</a>
          </div>
          <p className="mt-5 text-sm text-muted">
            Designed for <strong className="text-brand-600">sign-first</strong> communication
            with options for text, speech, and visual avatars.
          </p>
        </div>

        <div className="relative">
          <div className="card p-6">
            <div className="mb-3 flex justify-between text-sm">
              <span className="text-muted">Real-time interpreter</span>
              <span className="font-medium text-brand-600">Live · Secure</span>
            </div>
            <div className="flex h-64 items-center justify-center rounded-2xl bg-soft-gradient p-6 text-center">
              <p className="max-w-xs text-lg">
                Camera &amp; gesture area — your signs become clear speech or text.
              </p>
            </div>
          </div>
          <div className="card mt-4 w-full p-4 lg:absolute lg:-bottom-8 lg:-right-4 lg:mt-0 lg:w-72">
            <p className="font-semibold text-brand-600">Live Session Preview</p>
            <p className="mt-1 text-sm text-muted">
              Raise your hand to start. GESTURA detects your motion and begins interpreting.
            </p>
            <p className="pill mt-3 text-xs">Smooth, natural conversations</p>
          </div>
        </div>
      </section>

      <section id="features" className="mt-28 scroll-mt-24 text-center">
        <p className="text-sm uppercase tracking-widest text-brand-600">Comprehensive features</p>
        <h2 className="mt-2 text-3xl font-bold">Everything you need to be heard and understood</h2>
        <p className="mx-auto mt-3 max-w-2xl text-muted">
          GESTURA brings together powerful tools so that you can choose how you want to
          communicate: sign, text, or voice—your way.
        </p>

        <div className="mt-10 grid gap-5 text-left sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <Link key={f.title} to={f.to} className="card p-6 transition hover:-translate-y-1">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-100 text-2xl" aria-hidden="true">
                {f.icon}
              </span>
              <h3 className="mt-4 font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted">{f.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}