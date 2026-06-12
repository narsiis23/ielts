import { useEffect, useRef } from 'react'
import { useSettings } from '../context/SettingsContext'
import { useSpeech } from '../hooks/useSpeech'
import type { FeedbackState, SessionStats } from '../types'

type PracticeViewProps = {
  currentIndex: number
  totalWords: number
  currentWord: string
  stats: SessionStats
  progress: number
  feedback: FeedbackState
  pendingAnswer: string
  isLocked: boolean
  onPendingAnswerChange: (value: string) => void
  onSubmit: (answer: string) => void
  onAdvance: () => void
  onSkip: () => void
  onPrevious: () => void
  onJumpToIndex?: (index: number) => void
  onFinish?: () => void
  onExit: () => void
}

export function PracticeView({
  currentIndex,
  totalWords,
  currentWord,
  stats,
  progress,
  feedback,
  pendingAnswer,
  isLocked,
  onPendingAnswerChange,
  onSubmit,
  onAdvance,
  onSkip,
  onPrevious,
  onJumpToIndex,
  onFinish,
  onExit,
}: PracticeViewProps) {
  const { settings } = useSettings()
  const { speak, isSpeaking, isSupported } = useSpeech(settings.speechRate, settings.voiceURI)
  const inputRef = useRef<HTMLInputElement>(null)
  const advanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const displayIndex = currentIndex + 1
  const liveCorrect = stats.correct
  const liveIncorrect = stats.incorrect

  useEffect(() => {
    if (currentWord && !isLocked) {
      const timer = setTimeout(() => speak(currentWord), 350)
      return () => clearTimeout(timer)
    }
  }, [currentIndex, currentWord, isLocked, speak])

  useEffect(() => {
    if (!isLocked) {
      inputRef.current?.focus()
    }
  }, [currentIndex, isLocked])

  useEffect(() => {
    if (feedback && settings.autoAdvance) {
      const delay = feedback.correct ? 800 : 6500
      advanceTimerRef.current = setTimeout(() => {
        onAdvance()
      }, delay)
    }
    return () => {
      if (advanceTimerRef.current) clearTimeout(advanceTimerRef.current)
    }
  }, [feedback, settings.autoAdvance, onAdvance])

  const handleSubmit = () => {
    if (!pendingAnswer.trim() || isLocked) return
    onSubmit(pendingAnswer)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLocked && pendingAnswer.trim()) {
      e.preventDefault()
      handleSubmit()
    }
  }

  if (!isSupported) {
    return (
      <div className="card p-8 text-center">
        <p className="text-lg font-bold text-red-500">
          Speech synthesis is not available in your browser.
        </p>
        <p className="mt-2 text-slate-500">Please try Chrome, Edge, or Safari.</p>
        <button type="button" className="btn-secondary mt-6" onClick={onExit}>
          Go back
        </button>
      </div>
    )
  }

  return (
    <section className="flex flex-col gap-5 animate-fade-in" aria-label="Spelling practice">
      {/* Top: Progress + Score */}
      <div className="card p-5">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-lg font-extrabold" aria-live="polite">
            Word {displayIndex} of {totalWords}
          </span>
          <div className="flex gap-4 text-sm font-bold">
            <span className="text-[#58cc02]">✓ {liveCorrect}</span>
            <span className="text-red-500">✗ {liveIncorrect}</span>
          </div>
        </div>
        <div
          className="h-3.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700"
          role="progressbar"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Session progress"
          onClick={(e) => {
            if (!onJumpToIndex || isLocked) return
            const rect = (e.target as HTMLElement).getBoundingClientRect()
            const clickX = (e as React.MouseEvent).clientX - rect.left
            const pct = Math.max(0, Math.min(1, clickX / rect.width))
            const targetIndex = Math.floor(pct * Math.max(0, totalWords - 1))
            onJumpToIndex(targetIndex)
          }}
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#58cc02] to-[#89e219] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-2 flex items-center justify-center gap-3">
          <input
            aria-label="Seek word"
            type="range"
            min={0}
            max={Math.max(0, totalWords - 1)}
            value={currentIndex}
            onChange={(e) => {
              if (!onJumpToIndex) return
              const v = Number((e.target as HTMLInputElement).value)
              onJumpToIndex(v)
            }}
            className="w-2/3"
            disabled={isLocked}
          />
          <span className="text-sm font-semibold">{displayIndex}/{totalWords}</span>
        </div>
      </div>

      {/* Center: Controls + Input */}
      <div className="card flex min-h-[380px] flex-col items-center justify-center gap-6 p-6 sm:p-10">
        <p className="text-center text-lg font-bold text-slate-500 dark:text-slate-400">
          {isSpeaking ? '🔊 Listen carefully…' : 'Type the word you heard'}
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            className="btn-secondary min-w-[100px] flex-col !normal-case !tracking-normal"
            onClick={() => speak(currentWord)}
            disabled={isLocked || !currentWord}
            aria-label="Repeat word"
          >
            <span className="text-2xl">🔁</span>
            <span className="text-xs font-bold text-slate-500">Repeat</span>
          </button>

          <button
            type="button"
            className="btn-secondary min-w-[100px] flex-col !normal-case !tracking-normal"
            onClick={onPrevious}
            disabled={currentIndex === 0 || isLocked}
            aria-label="Previous word"
          >
            <span className="text-2xl">⏮</span>
            <span className="text-xs font-bold text-slate-500">Previous</span>
          </button>

          <button
            type="button"
            className="btn-secondary min-w-[100px] flex-col !normal-case !tracking-normal"
            onClick={() => speak(currentWord)}
            disabled={isLocked || !currentWord}
            aria-label="Play word"
          >
            <span className="text-2xl">{isSpeaking ? '🔊' : '▶️'}</span>
            <span className="text-xs font-bold text-slate-500">Play</span>
          </button>

          <button
            type="button"
            className="btn-secondary min-w-[100px] flex-col !normal-case !tracking-normal"
            onClick={onSkip}
            disabled={isLocked}
            aria-label="Skip word"
          >
            <span className="text-2xl">⏭</span>
            <span className="text-xs font-bold text-slate-500">Skip</span>
          </button>

          <button
            type="button"
            className="btn-secondary min-w-[100px] flex-col !normal-case !tracking-normal text-red-600 border-red-200 hover:bg-red-50"
            onClick={() => onFinish && onFinish()}
            disabled={isLocked}
            aria-label="Finish session"
          >
            <span className="text-2xl">🏁</span>
            <span className="text-xs font-bold text-slate-500">Finish</span>
          </button>
        </div>

        <div className="w-full max-w-md">
          <label htmlFor="spelling-field" className="mb-2 block text-center text-sm font-bold text-slate-500">
            Type the word you heard
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              ref={inputRef}
              id="spelling-field"
              type="text"
              className="input-field text-center text-xl"
              value={pendingAnswer}
              onChange={(e) => onPendingAnswerChange(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLocked}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              aria-label="Your spelling"
            />
            <button
              type="button"
              className="btn-primary shrink-0 sm:min-w-[140px]"
              onClick={handleSubmit}
              disabled={isLocked || !pendingAnswer.trim()}
            >
              Submit
            </button>
          </div>
        </div>
      </div>

      {/* Bottom: Feedback */}
      {feedback && (
        <div
          className={`card animate-slide-up p-6 text-center ${
            feedback.correct
              ? 'border-[#58cc02] bg-green-50 dark:bg-green-950/30'
              : 'border-red-400 bg-red-50 dark:bg-red-950/30'
          }`}
          role="status"
          aria-live="polite"
        >
          {feedback.correct ? (
            <p className="text-2xl font-extrabold text-[#58cc02]">Correct ✓</p>
          ) : (
            <div>
              <p className="text-2xl font-extrabold text-red-500">Incorrect ✗</p>
              <p className="mt-2 text-lg font-semibold text-slate-600 dark:text-slate-300">
                Correct answer: <span className="font-extrabold text-[#58cc02] transition-colors duration-500 ease-out bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded">{feedback.correctWord}</span>
              </p>
              {feedback.userAnswer && feedback.userAnswer !== '(skipped)' && (
                <p className="mt-1 text-sm text-slate-500">
                  You typed: {feedback.userAnswer}
                </p>
              )}
            </div>
          )}

          {!settings.autoAdvance && (
            <button type="button" className="btn-secondary mt-4" onClick={onAdvance}>
              Next word →
            </button>
          )}

          {settings.autoAdvance && (
            <p className="mt-3 text-sm font-semibold text-slate-400">Moving to next word…</p>
          )}
        </div>
      )}

      <button
        type="button"
        className="text-center text-sm font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
        onClick={onExit}
      >
        ← End session
      </button>
    </section>
  )
}
