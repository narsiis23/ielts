import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { SpeechRate, UserSettings } from '../types'
import { loadSettings, saveSettings } from '../utils/storage'

type SettingsContextValue = {
  settings: UserSettings
  setSpeechRate: (rate: SpeechRate) => void
  setVoiceURI: (uri: string) => void
  setAutoAdvance: (value: boolean) => void
  setDarkMode: (value: boolean) => void
  toggleDarkMode: () => void
}

const SettingsContext = createContext<SettingsContextValue | null>(null)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<UserSettings>(() => {
    const hasStored = !!localStorage.getItem('misspeled-settings')
    const loaded = loadSettings()
    if (!hasStored) {
      return { ...loaded, darkMode: true }
    }
    return loaded
  })

  useEffect(() => {
    saveSettings(settings)
    document.documentElement.setAttribute('data-theme', settings.darkMode ? 'dark' : 'light')
  }, [settings])

  const update = useCallback((patch: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }))
  }, [])

  const value = useMemo(
    () => ({
      settings,
      setSpeechRate: (speechRate: SpeechRate) => update({ speechRate }),
      setVoiceURI: (voiceURI: string) => update({ voiceURI }),
      setAutoAdvance: (autoAdvance: boolean) => update({ autoAdvance }),
      setDarkMode: (darkMode: boolean) => update({ darkMode }),
      toggleDarkMode: () => update({ darkMode: !settings.darkMode }),
    }),
    [settings, update],
  )

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}

export function useSettings() {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider')
  return ctx
}
