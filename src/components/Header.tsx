import type { AppView } from '../types'
import { useSettings } from '../context/SettingsContext'

type HeaderProps = {
  view: AppView
  onNavigate: (view: AppView) => void
}

const NAV_ITEMS: { id: AppView; label: string; icon: string }[] = [
  { id: 'home', label: 'Practice', icon: '🎧' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
]

export function Header({ view, onNavigate }: HeaderProps) {
  const { toggleDarkMode, settings } = useSettings()

  return (
    <header className="flex items-center justify-between border-b-2 border-slate-200 py-4 dark:border-slate-700">
      <div className="flex items-center gap-3">
        <span className="text-3xl" aria-hidden="true">
          🎧
        </span>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#58cc02]">Misspeled</h1>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            Listen · Type · Master
          </p>
        </div>
      </div>

      <nav className="flex items-center gap-2" aria-label="Main navigation">
        {view !== 'practice' &&
          view !== 'results' &&
          NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`rounded-xl px-3 py-2 text-sm font-bold transition-colors ${
                view === item.id
                  ? 'bg-[#58cc02]/15 text-[#58cc02]'
                  : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
              aria-current={view === item.id ? 'page' : undefined}
            >
              {item.icon} {item.label}
            </button>
          ))}

        <button
          type="button"
          onClick={toggleDarkMode}
          className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-slate-200 text-xl transition-transform hover:scale-105 dark:border-slate-600"
          aria-label={settings.darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {settings.darkMode ? '☀️' : '🌙'}
        </button>
      </nav>
    </header>
  )
}
