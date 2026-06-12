import type { UserSettings } from '../types'

const SETTINGS_KEY = 'misspeled-settings'
const RECENT_LISTS_KEY = 'misspeled-recent-lists'
const MAX_RECENT_LISTS = 10

export const DEFAULT_SETTINGS: UserSettings = {
  speechRate: 1,
  voiceURI: '',
  autoAdvance: true,
  darkMode: true,
}

export function loadSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY)
    if (!raw) return { ...DEFAULT_SETTINGS }
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) }
  } catch {
    return { ...DEFAULT_SETTINGS }
  }
}

export function saveSettings(settings: UserSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}

export function loadRecentLists(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_LISTS_KEY)
    if (!raw) return []
    const lists = JSON.parse(raw)
    return Array.isArray(lists) ? lists : []
  } catch {
    return []
  }
}

export function saveRecentList(text: string): void {
  const trimmed = text.trim()
  if (!trimmed) return

  const existing = loadRecentLists().filter((l) => l !== trimmed)
  const updated = [trimmed, ...existing].slice(0, MAX_RECENT_LISTS)
  localStorage.setItem(RECENT_LISTS_KEY, JSON.stringify(updated))
}
