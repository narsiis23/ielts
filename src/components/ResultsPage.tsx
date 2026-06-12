import type { AnswerRecord, SessionStats } from '../types'

type ResultsPageProps = {
  stats: SessionStats
  mistakes: AnswerRecord[]
  onRetryMistakes: () => void
  onNewSession: () => void
}

export function ResultsPage({
  stats,
  mistakes,
  onRetryMistakes,
  onNewSession,
}: ResultsPageProps) {
  return (
    <section className="card animate-fade-in p-6 sm:p-8" aria-labelledby="results-heading">
      <h2 id="results-heading" className="mb-6 text-center text-3xl font-extrabold">
        Session Complete! 🎉
      </h2>

      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Total Words', value: stats.total },
          { label: 'Correct', value: stats.correct, color: 'text-[#58cc02]' },
          { label: 'Incorrect', value: stats.incorrect, color: 'text-red-500' },
          { label: 'Accuracy', value: `${stats.accuracy}%`, color: 'text-sky-500' },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-xl border-2 border-slate-200 p-4 text-center dark:border-slate-600"
          >
            <p className={`text-2xl font-extrabold sm:text-3xl ${item.color ?? ''}`}>
              {item.value}
            </p>
            <p className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-500">
              {item.label}
            </p>
          </div>
        ))}
      </div>

      {mistakes.length > 0 ? (
        <div className="mb-6 overflow-x-auto rounded-xl border-2 border-slate-200 dark:border-slate-600">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Mistakes review</caption>
            <thead>
              <tr className="border-b-2 border-slate-200 bg-slate-50 dark:border-slate-600 dark:bg-slate-900">
                <th scope="col" className="px-4 py-3 font-extrabold uppercase tracking-wide text-slate-500">
                  Correct Word
                </th>
                <th scope="col" className="px-4 py-3 font-extrabold uppercase tracking-wide text-slate-500">
                  User Typed
                </th>
              </tr>
            </thead>
            <tbody>
              {mistakes.map((m, i) => (
                <tr
                  key={`${m.word}-${i}`}
                  className="border-b border-slate-100 dark:border-slate-700"
                >
                  <td className="px-4 py-3 font-bold text-[#58cc02]">{m.word}</td>
                  <td className="px-4 py-3 font-bold text-red-500">
                    {m.userAnswer || '(skipped)'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mb-6 text-center text-xl font-bold text-[#58cc02]">
          Perfect score — no mistakes! 🏆
        </p>
      )}

      <div className="flex flex-col gap-3">
        {mistakes.length > 0 && (
          <button type="button" className="btn-primary w-full" onClick={onRetryMistakes}>
            Practice Mistakes Only
          </button>
        )}
        <button type="button" className="btn-secondary w-full" onClick={onNewSession}>
          New Word List
        </button>
      </div>
    </section>
  )
}
