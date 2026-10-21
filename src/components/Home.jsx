export default function Home({ onSelect }) {
  const cards = [
    {
      id: 'signer',
      emoji: '🤟',
      title: 'Signer Mode',
      desc: 'For deaf and mute users. Show gestures to the camera and Gestura turns them into text and speech.',
    },
    {
      id: 'hearing',
      emoji: '🎙️',
      title: 'Hearing Mode',
      desc: 'For hearing users. Speak or type, and Gestura shows large live captions.',
    },
  ]

  return (
    <main className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center px-4 py-10">
      <h1 className="text-5xl font-bold mb-2">Gestura</h1>
      <p className="text-slate-300 text-lg mb-10 text-center max-w-xl">
        An AI-assisted platform for inclusive communication. Choose how you want to use it.
      </p>

      <div className="grid gap-6 md:grid-cols-2 w-full max-w-3xl">
        {cards.map((c) => (
          <button
            key={c.id}
            onClick={() => onSelect(c.id)}
            className="text-left rounded-2xl bg-slate-800 border-2 border-slate-600 p-8
                       hover:border-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-400
                       transition"
          >
            <div className="text-5xl mb-4" aria-hidden="true">{c.emoji}</div>
            <h2 className="text-2xl font-semibold mb-2">{c.title}</h2>
            <p className="text-slate-300">{c.desc}</p>
          </button>
        ))}
      </div>
    </main>
  )
}