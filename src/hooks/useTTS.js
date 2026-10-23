import { useCallback, useEffect, useState } from 'react'

export function useTTS() {
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window
  const [voices, setVoices] = useState([])
  const [speaking, setSpeaking] = useState(false)

  useEffect(() => {
    if (!supported) return
    const load = () => setVoices(window.speechSynthesis.getVoices())
    load()
    window.speechSynthesis.addEventListener('voiceschanged', load)
    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', load)
      window.speechSynthesis.cancel()
    }
  }, [supported])

  const speak = useCallback(
    (text, { voiceURI, rate = 1, volume = 1, pitch = 1 } = {}) => {
      if (!supported || !text.trim()) return
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      const voice = voices.find((v) => v.voiceURI === voiceURI)
      if (voice) {
        utterance.voice = voice
        utterance.lang = voice.lang
        utterance.pitch = pitch
      }
      utterance.pitch = pitch
      utterance.rate = rate
      utterance.volume = volume
      utterance.onstart = () => setSpeaking(true)
      utterance.onend = () => setSpeaking(false)
      utterance.onerror = () => setSpeaking(false)
      window.speechSynthesis.speak(utterance)
    },
    [supported, voices]
  )

  const stop = useCallback(() => {
    if (supported) window.speechSynthesis.cancel()
    setSpeaking(false)
  }, [supported])

  return { voices, speak, stop, speaking, supported }
}