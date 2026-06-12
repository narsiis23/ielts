import { useMemo, useRef, useState } from 'react'
import { parseWords, readTextFile } from '../utils/wordParser'
import { loadRecentLists, saveRecentList } from '../utils/storage'

type WordInputProps = {
  onStart: (words: string[], rawText: string) => void
}

export function WordInput({ onStart }: WordInputProps) {
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)
  const recentLists = useMemo(() => loadRecentLists(), [])
  const [loadingMonday, setLoadingMonday] = useState(false)

  const words = useMemo(() => parseWords(text), [text])
  const wordCount = words.length

  const handleStart = () => {
    if (wordCount === 0) {
      setError('Please enter at least one word.')
      return
    }
    setError('')
    saveRecentList(text)
    onStart(words, text)
  }

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith('.txt')) {
      setError('Please upload a .txt file.')
      return
    }

    try {
      const content = await readTextFile(file)
      setText(content)
      setError('')
    } catch {
      setError('Could not read the file. Please try again.')
    }

    e.target.value = ''
  }

  const loadRecent = (list: string) => {
    setText(list)
    setError('')
  }

  return (
    <section className="card animate-fade-in p-6 sm:p-8" aria-labelledby="word-input-heading">
      <h2 id="word-input-heading" className="mb-2 text-2xl font-extrabold">
        Add your words
      </h2>
      <p className="mb-5 text-slate-500 dark:text-slate-400">
        Paste words separated by commas, spaces, or new lines. Words are stored exactly as you
        enter them — no dictionary checks.
      </p>

      <textarea
        className="input-field min-h-[220px] resize-y font-mono text-base"
        value={text}
        onChange={(e) => {
          setText(e.target.value)
          setError('')
        }}
        placeholder={'apple,orange banana\n\ngrape     pear\nwatermelon'}
        rows={10}
        aria-label="Word list"
        spellCheck={false}
        autoCorrect="off"
        autoCapitalize="off"
      />

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <input
            ref={fileRef}
            type="file"
            accept=".txt"
            className="sr-only"
            id="file-upload"
            onChange={handleFile}
          />
          <label htmlFor="file-upload" className="btn-secondary cursor-pointer text-sm">
            📁 Upload .txt
          </label>
          <button
            id="mondayBtn"
            type="button"
            className="btn-secondary text-sm"
            onClick={async () => {
              setLoadingMonday(true)
              setError('')
              try {
                const res = await fetch('/monday.txt')
                if (!res.ok) throw new Error('Could not load monday.txt')
                const content = await res.text()
                const words = parseWords(content)
                if (words.length === 0) throw new Error('No words found in monday.txt')
                saveRecentList(content)
                onStart(words, content)
              } catch (err: any) {
                setError(err?.message || 'Failed to load Monday list')
              } finally {
                setLoadingMonday(false)
              }
            }}
            disabled={loadingMonday}
          >
            {loadingMonday ? 'Loading…' : 'Monday'}
          </button>
        </div>

        <p
          className="text-lg font-extrabold text-[#58cc02]"
          aria-live="polite"
          aria-atomic="true"
        >
          {wordCount > 0 ? `Detected ${wordCount} word${wordCount !== 1 ? 's' : ''}` : 'No words yet'}
        </p>
      </div>

      {recentLists.length > 0 && (
        <div className="mt-5">
          <p className="mb-2 text-sm font-bold text-slate-500 dark:text-slate-400">
            Recent lists
          </p>
          <div className="flex flex-wrap gap-2">
            {recentLists.map((list, i) => (
              <button
                key={i}
                type="button"
                onClick={() => loadRecent(list)}
                className="max-w-[200px] truncate rounded-lg border-2 border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition-colors hover:border-sky-400 dark:border-slate-600 dark:text-slate-300"
                title={list}
              >
                {parseWords(list).length} words — {list.slice(0, 30)}
                {list.length > 30 ? '…' : ''}
              </button>
            ))}
          </div>
        </div>
      )}

      {error && (
        <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 font-bold text-red-600 dark:bg-red-950/50 dark:text-red-400" role="alert">
          {error}
        </p>
      )}

      <button
        type="button"
        className="btn-primary mt-6 w-full"
        onClick={handleStart}
        disabled={wordCount === 0}
      >
        Start Practice
      </button>
    </section>
  )
}
