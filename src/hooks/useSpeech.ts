import { useCallback, useEffect, useRef, useState } from 'react'
import type { SpeechRate } from '../types'

export function useSpeech(rate: SpeechRate, voiceURI: string) {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isSupported, setIsSupported] = useState(true)
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    if (!window.speechSynthesis) {
      setIsSupported(false)
      return
    }

    const loadVoices = () => {
      const available = window.speechSynthesis.getVoices()
      if (available.length > 0) setVoices(available)
    }

    loadVoices()
    window.speechSynthesis.addEventListener('voiceschanged', loadVoices)
    return () => window.speechSynthesis.removeEventListener('voiceschanged', loadVoices)
  }, [])

  const speak = useCallback(
    (text: string) => {
      if (!window.speechSynthesis || !text) return

      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = rate
      utterance.lang = 'en-US'

      if (voiceURI) {
        const voice = voices.find((v) => v.voiceURI === voiceURI)
        if (voice) utterance.voice = voice
      }

      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)

      utteranceRef.current = utterance
      window.speechSynthesis.speak(utterance)
    },
    [rate, voiceURI, voices],
  )

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel()
    setIsSpeaking(false)
  }, [])

  useEffect(() => () => stop(), [stop])

  return { speak, stop, isSpeaking, isSupported, voices }
}
