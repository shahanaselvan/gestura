import { useCallback, useEffect, useState } from 'react'

export function useTTS() {
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window
  const [speaking, setSpeaking] = useState(false)

  const speak = useCallback(
    (text) => {
      if (!supported || !text.trim()) return
      window.speechSynthesis.cancel() // stop anything already speaking
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'en-IN'
      utterance.rate = 0.95
      utterance.onstart = () => setSpeaking(true)
      utterance.onend = () => setSpeaking(false)
      utterance.onerror = () => setSpeaking(false)
      window.speechSynthesis.speak(utterance)
    },
    [supported]
  )

  const stop = useCallback(() => {
    if (supported) window.speechSynthesis.cancel()
    setSpeaking(false)
  }, [supported])

  // stop speaking if the user leaves the screen
  useEffect(() => () => supported && window.speechSynthesis.cancel(), [supported])

  return { speak, stop, speaking, supported }
}