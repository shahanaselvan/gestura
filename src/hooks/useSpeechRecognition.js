import { useCallback, useEffect, useRef, useState } from 'react'

const ERROR_MESSAGES = {
  'not-allowed': 'Microphone access was blocked. Allow the microphone in your browser and try again.',
  'service-not-allowed': 'Microphone access was blocked. Allow the microphone in your browser and try again.',
  'no-speech': 'No speech was heard. Try again and speak closer to the microphone.',
  'audio-capture': 'No microphone was found. Check that one is connected.',
  network: 'Speech recognition needs an internet connection.',
}

export function useSpeechRecognition() {
  const SR =
    typeof window !== 'undefined'
      ? window.SpeechRecognition || window.webkitSpeechRecognition
      : null
  const supported = Boolean(SR)

  const recRef = useRef(null)
  const [listening, setListening] = useState(false)
  const [finalText, setFinalText] = useState('')
  const [interim, setInterim] = useState('')
  const [error, setError] = useState('')

  const start = useCallback(
    (lang) => {
      if (!SR || recRef.current) return
      const rec = new SR()
      rec.lang = lang
      rec.continuous = true
      rec.interimResults = true

      rec.onstart = () => {
        setListening(true)
        setError('')
      }

      rec.onresult = (event) => {
        let interimText = ''
        let finalChunk = ''
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const piece = event.results[i][0].transcript
          if (event.results[i].isFinal) finalChunk += piece
          else interimText += piece
        }
        if (finalChunk) {
          setFinalText((prev) => (prev ? prev + ' ' : '') + finalChunk.trim())
        }
        setInterim(interimText)
      }

      rec.onerror = (event) => {
        setError(ERROR_MESSAGES[event.error] || `Speech recognition error: ${event.error}`)
      }

      rec.onend = () => {
        setListening(false)
        setInterim('')
        recRef.current = null
      }

      recRef.current = rec
      rec.start()
    },
    [SR]
  )

  const stop = useCallback(() => recRef.current?.stop(), [])

  const clear = useCallback(() => {
    setFinalText('')
    setInterim('')
    setError('')
  }, [])

  // stop the microphone if the user leaves the page
  useEffect(() => () => recRef.current?.abort(), [])

  return { supported, listening, finalText, interim, error, start, stop, clear }
}