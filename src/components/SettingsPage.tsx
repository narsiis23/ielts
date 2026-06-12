import { useSpeech } from '../hooks/useSpeech'
import { useSettings } from '../context/SettingsContext'
import type { SpeechRate } from '../types'

const SPEECH_RATES: SpeechRate[] = [0.5, 0.75, 1, 1.25, 1.5]

export function SettingsPage() {
  const {
    settings,
    setSpeechRate,
    setVoiceURI,
    setAutoAdvance,
    setDarkMode,
  } = useSettings()

  const { voices, isSupported } = useSpeech(settings.speechRate, settings.voiceURI)

  const englishVoices = voices.filter(
    (v) => v.lang.startsWith('en'),
  )

  return (
    <section className="card animate-fade-in p-6 sm:p-8" aria-labelledby="settings-heading">
      <h2 id="settings-heading" className="mb-6 text-2xl font-extrabold">
        Settings
      </h2>

      {!isSupported && (
        <p className="mb-6 rounded-xl bg-amber-50 px-4 py-3 font-semibold text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
          Speech synthesis is not available in this browser.
        </p>
      )}

      <div className="flex flex-col gap-8">
        {/* Speech Speed */}
        <fieldset>
          <legend className="mb-3 text-lg font-bold">Speech speed</legend>
          <div className="flex flex-wrap gap-2">
            {SPEECH_RATES.map((rate) => (
              <button
                key={rate}
                type="button"
                onClick={() => setSpeechRate(rate)}
                className={`min-w-[64px] rounded-xl px-4 py-3 text-base font-bold transition-all ${
                  settings.speechRate === rate
                    ? 'bg-[#58cc02] text-white shadow-[0_3px_0_#46a302]'
                    : 'border-2 border-slate-200 bg-slate-50 text-slate-600 hover:border-sky-400 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-300'
                }`}
                aria-pressed={settings.speechRate === rate}
              >
                {rate}×
              </button>
            ))}
          </div>
        </fieldset>

        {/* Voice Selection */}
        <div>
          <label htmlFor="voice-select" className="mb-3 block text-lg font-bold">
            Voice
          </label>
          <select
            id="voice-select"
            className="input-field"
            value={settings.voiceURI}
            onChange={(e) => setVoiceURI(e.target.value)}
            disabled={!isSupported || englishVoices.length === 0}
          >
            <option value="">System default</option>
            {englishVoices.map((voice) => (
              <option key={voice.voiceURI} value={voice.voiceURI}>
                {voice.name} ({voice.lang})
              </option>
            ))}
          </select>
          {englishVoices.length === 0 && isSupported && (
            <p className="mt-2 text-sm text-slate-500">
              Loading voices… try refreshing if none appear.
            </p>
          )}
        </div>

        {/* Auto Advance */}
        <fieldset>
          <legend className="mb-3 text-lg font-bold">After each answer</legend>
          <div className="flex flex-col gap-3">
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-slate-200 p-4 transition-colors hover:border-sky-400 dark:border-slate-600">
              <input
                type="radio"
                name="advance-mode"
                checked={settings.autoAdvance}
                onChange={() => setAutoAdvance(true)}
                className="h-5 w-5 accent-[#58cc02]"
              />
              <div>
                <span className="font-bold">Auto advance</span>
                <p className="text-sm text-slate-500">Show result, then move on after 1 second</p>
              </div>
            </label>
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-slate-200 p-4 transition-colors hover:border-sky-400 dark:border-slate-600">
              <input
                type="radio"
                name="advance-mode"
                checked={!settings.autoAdvance}
                onChange={() => setAutoAdvance(false)}
                className="h-5 w-5 accent-[#58cc02]"
              />
              <div>
                <span className="font-bold">Manual advance</span>
                <p className="text-sm text-slate-500">Click "Next word" to continue</p>
              </div>
            </label>
          </div>
        </fieldset>

        {/* Dark Mode */}
        <div className="flex items-center justify-between rounded-xl border-2 border-slate-200 p-4 dark:border-slate-600">
          <div>
            <p className="font-bold">Dark mode</p>
            <p className="text-sm text-slate-500">Toggle light / dark theme</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={settings.darkMode}
            onClick={() => setDarkMode(!settings.darkMode)}
            className={`relative h-8 w-14 rounded-full transition-colors ${
              settings.darkMode ? 'bg-[#58cc02]' : 'bg-slate-300'
            }`}
          >
            <span
              className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-transform ${
                settings.darkMode ? 'left-7' : 'left-1'
              }`}
            />
          </button>
        </div>
      </div>
    </section>
  )
}
