import { useEffect, useRef, useState } from 'react'
import { useTTS } from '../hooks/useTTS'
import { getReply, SUGGESTIONS, WELCOME } from '../chatbotRules'

let nextId = 1
const makeMsg = (role, text) => ({ id: nextId++, role, text })

export default function Chatbot() {
  const { speak, stop, supported } = useTTS()
  const [messages, setMessages] = useState(() => [makeMsg('bot', WELCOME)])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const listRef = useRef(null)
  const timerRef = useRef(null)

  // keep the newest message in view
  useEffect(() => {
    const el = listRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, thinking])

  useEffect(() => () => clearTimeout(timerRef.current), [])

  const send = (raw) => {
    const text = raw.trim()
    if (!text || thinking) return
    setMessages((m) => [...m, makeMsg('user', text)])
    setInput('')
    setThinking(true)
    timerRef.current = setTimeout(() => {
      setMessages((m) => [...m, makeMsg('bot', getReply(text))])
      setThinking(false)
    }, 500)
  }

  const clearChat = () => {
    stop()
    clearTimeout(timerRef.current)
    setThinking(false)
    setMessages([makeMsg('bot', WELCOME)])
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="text-center">
        <span className="pill">
          <span className="h-2 w-2 rounded-full bg-accent" />
          Ask GESTURA anything
        </span>
        <h1 className="mt-4 text-4xl font-bold gradient-text md:text-5xl">GESTURA Assistant</h1>
        <p className="mx-auto mt-3 max-w-xl text-muted">
          Get quick answers about how to use speech to text, text to speech, gestures and
          quick phrases.
        </p>
      </div>

      <section className="card mt-8 overflow-hidden">
        <div className="flex items-center justify-between border-b border-brand-100 px-5 py-3">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-gradient font-bold text-white">
              G
            </span>
            <div className="leading-tight">
              <p className="font-semibold">GESTURA Assistant</p>
              <p className="text-xs text-muted">Answers about GESTURA features</p>
            </div>
          </div>
          <button onClick={clearChat} className="btn-outline px-4 py-1.5 text-sm">
            Clear chat
          </button>
        </div>

        <div
          ref={listRef}
          role="log"
          aria-live="polite"
          aria-label="Chat messages"
          className="h-[26rem] space-y-4 overflow-y-auto bg-brand-50/50 p-5"
        >
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className="max-w-[85%]">
                <div
                  className={`whitespace-pre-line rounded-2xl px-4 py-3 text-[1.05rem] leading-relaxed ${
                    m.role === 'user'
                      ? 'rounded-br-md bg-brand-gradient text-white'
                      : 'rounded-bl-md border border-brand-100 bg-white'
                  }`}
                >
                  {m.text}
                </div>
                {m.role === 'bot' && supported && (
                  <button
                    onClick={() => speak(m.text)}
                    className="mt-1 rounded-lg px-2 py-1 text-sm text-brand-600 hover:bg-brand-100"
                    aria-label="Read this reply aloud"
                  >
                    🔊 Listen
                  </button>
                )}
              </div>
            </div>
          ))}

          {thinking && (
            <div className="flex justify-start">
              <div className="rounded-2xl rounded-bl-md border border-brand-100 bg-white px-4 py-3 text-muted">
                Typing…
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-brand-100 p-4">
          <div className="mb-3 flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="rounded-full border border-brand-200 bg-white px-3 py-1.5 text-sm font-medium text-brand-600 transition hover:bg-brand-100"
              >
                {s}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              send(input)
            }}
            className="flex gap-3"
          >
            <label htmlFor="chat-input" className="sr-only">Type your question</label>
            <input
              id="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question..."
              autoComplete="off"
              className="flex-1 rounded-full border border-brand-200 bg-brand-50 px-5 py-3"
            />
            <button type="submit" disabled={!input.trim() || thinking} className="btn-gradient px-7 disabled:opacity-50">
              Send
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}