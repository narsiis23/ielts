export type AppView = 'home' | 'practice' | 'results' | 'settings'

export type SpeechRate = 0.5 | 0.75 | 1 | 1.25 | 1.5

export type AnswerRecord = {
  word: string
  userAnswer: string
  correct: boolean
}

export type SessionStats = {
  total: number
  correct: number
  incorrect: number
  accuracy: number
}

export type UserSettings = {
  speechRate: SpeechRate
  voiceURI: string
  autoAdvance: boolean
  darkMode: boolean
}

export type FeedbackState = {
  correct: boolean
  userAnswer: string
  correctWord: string
} | null
