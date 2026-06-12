import { useCallback, useEffect, useState } from 'react'
import { Header } from './components/Header'
import { PracticeView } from './components/PracticeView'
import { ResultsPage } from './components/ResultsPage'
import { SettingsPage } from './components/SettingsPage'
import { WordInput } from './components/WordInput'
import { SettingsProvider } from './context/SettingsContext'
import { usePracticeSession } from './hooks/usePracticeSession'
import type { AppView } from './types'

function AppContent() {
  const [view, setView] = useState<AppView>('home')
  const session = usePracticeSession()

  useEffect(() => {
    if (session.isFinished && view === 'practice') {
      setView('results')
    }
  }, [session.isFinished, view])

  const handleStart = useCallback(
    (words: string[]) => {
      session.startSession(words)
      setView('practice')
    },
    [session],
  )

  const handleRetryMistakes = useCallback(() => {
    session.retryMistakes()
    setView('practice')
  }, [session])

  const handleNewSession = useCallback(() => {
    session.reset()
    setView('home')
  }, [session])

  const handleExitPractice = useCallback(() => {
    session.reset()
    setView('home')
  }, [session])

  return (
    <div className="mx-auto flex min-h-dvh max-w-2xl flex-col px-5">
      <Header view={view} onNavigate={setView} />

      <main className="flex flex-1 flex-col py-6 pb-10">
        {view === 'home' && <WordInput onStart={handleStart} />}

        {view === 'practice' && session.hasStarted && (
          <PracticeView
            currentIndex={session.currentIndex}
            totalWords={session.words.length}
            currentWord={session.currentWord}
            stats={session.stats}
            progress={session.progress}
            feedback={session.feedback}
            pendingAnswer={session.pendingAnswer}
            isLocked={session.isLocked}
            onPendingAnswerChange={session.setPendingAnswer}
            onSubmit={session.submitAnswer}
            onAdvance={session.advanceToNext}
            onSkip={session.skipWord}
            onPrevious={session.goToPrevious}
            onFinish={session.finishSession}
            onJumpToIndex={session.jumpToIndex}
            onExit={handleExitPractice}
          />
        )}

        {view === 'results' && (
          <ResultsPage
            stats={session.finalStats}
            mistakes={session.mistakes}
            onRetryMistakes={handleRetryMistakes}
            onNewSession={handleNewSession}
          />
        )}

        {view === 'settings' && <SettingsPage />}
      </main>

      <footer className="py-4 text-center text-xs font-semibold text-slate-400">
        Misspeled — your words are the answer key
      </footer>
    </div>
  )
}

export default function App() {
  return (
    <SettingsProvider>
      <AppContent />
    </SettingsProvider>
  )
}
