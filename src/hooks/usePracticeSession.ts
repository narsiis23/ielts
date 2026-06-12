import { useCallback, useMemo, useState } from 'react'
import type { AnswerRecord, FeedbackState, SessionStats } from '../types'
import { calcAccuracy, isCorrectAnswer } from '../utils/validation'

export function usePracticeSession() {
  const [words, setWords] = useState<string[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<AnswerRecord[]>([])
  const [feedback, setFeedback] = useState<FeedbackState>(null)
  const [pendingAnswer, setPendingAnswer] = useState('')
  const [isLocked, setIsLocked] = useState(false)

  const currentWord = words[currentIndex] ?? ''
  const isFinished = words.length > 0 && currentIndex >= words.length
  const hasStarted = words.length > 0 && currentIndex < words.length

  const stats: SessionStats = useMemo(() => {
    const correct = answers.filter((a) => a.correct).length
    const total = answers.length
    return {
      total: words.length,
      correct,
      incorrect: total - correct,
      accuracy: calcAccuracy(correct, total),
    }
  }, [answers, words.length])

  const finalStats: SessionStats = useMemo(() => {
    const correct = answers.filter((a) => a.correct).length
    const total = words.length
    return {
      total,
      correct,
      incorrect: total - correct,
      accuracy: calcAccuracy(correct, total),
    }
  }, [answers, words.length])

  const mistakes = useMemo(() => answers.filter((a) => !a.correct), [answers])

  const progress = words.length > 0 ? (currentIndex / words.length) * 100 : 0

  const startSession = useCallback((wordList: string[]) => {
    setWords(wordList)
    setCurrentIndex(0)
    setAnswers([])
    setFeedback(null)
    setPendingAnswer('')
    setIsLocked(false)
  }, [])

  const advanceToNext = useCallback(() => {
    setFeedback(null)
    setPendingAnswer('')
    setIsLocked(false)
    setCurrentIndex((prev) => prev + 1)
  }, [])

  const jumpToIndex = useCallback((index: number) => {
    setFeedback(null)
    setPendingAnswer('')
    setIsLocked(false)
    setCurrentIndex(() => Math.max(0, Math.min(index, Math.max(0, words.length - 1))))
  }, [words.length])

  const goToPrevious = useCallback(() => {
    if (currentIndex <= 0 || isLocked) return
    setFeedback(null)
    setPendingAnswer('')
    setIsLocked(false)
    setCurrentIndex((prev) => prev - 1)
    setAnswers((prev) => prev.slice(0, -1))
  }, [currentIndex, isLocked])

  const submitAnswer = useCallback(
    (userAnswer: string) => {
      if (!currentWord || isLocked || isFinished) return

      const correct = isCorrectAnswer(userAnswer, currentWord)
      const record: AnswerRecord = { word: currentWord, userAnswer, correct }

      setFeedback({ correct, userAnswer, correctWord: currentWord })
      setAnswers((prev) => [...prev, record])
      setIsLocked(true)
    },
    [currentWord, isLocked, isFinished],
  )

  const skipWord = useCallback(() => {
    if (!currentWord || isLocked || isFinished) return

    const record: AnswerRecord = {
      word: currentWord,
      userAnswer: '',
      correct: false,
    }

    setFeedback({ correct: false, userAnswer: '(skipped)', correctWord: currentWord })
    setAnswers((prev) => [...prev, record])
    setIsLocked(true)
  }, [currentWord, isLocked, isFinished])

  const retryMistakes = useCallback(() => {
    const mistakeWords = mistakes.map((m) => m.word)
    if (mistakeWords.length === 0) return
    startSession(mistakeWords)
  }, [mistakes, startSession])

  const reset = useCallback(() => {
    setWords([])
    setCurrentIndex(0)
    setAnswers([])
    setFeedback(null)
    setPendingAnswer('')
    setIsLocked(false)
  }, [])

  const finishSession = useCallback(() => {
    if (words.length === 0) return
    if (currentIndex >= words.length) return

    const remaining = words.slice(currentIndex)
    if (remaining.length > 0) {
      const skippedRecords = remaining.map((w) => ({ word: w, userAnswer: '', correct: false }))
      setAnswers((prev) => [...prev, ...skippedRecords])
    }

    setFeedback(null)
    setPendingAnswer('')
    setIsLocked(false)
    setCurrentIndex(words.length)
  }, [words, currentIndex])

  return {
    words,
    currentIndex,
    currentWord,
    answers,
    feedback,
    pendingAnswer,
    setPendingAnswer,
    isLocked,
    isFinished,
    hasStarted,
    stats,
    finalStats,
    mistakes,
    progress,
    startSession,
    jumpToIndex,
    submitAnswer,
    advanceToNext,
    goToPrevious,
    skipWord,
    retryMistakes,
    reset,
    finishSession,
  }
}
