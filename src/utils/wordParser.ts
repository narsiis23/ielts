/**
 * Parses raw text into words. Splits on commas, spaces, tabs, and newlines.
 * Trims whitespace, ignores empty entries. Does NOT validate spelling.
 * Preserves words exactly as entered (source of truth).
 */
export function parseWords(input: string): string[] {
  if (!input.trim()) return []

  return input
    .split(/[\s,\t\n]+/)
    .map((word) => word.trim())
    .filter((word) => word.length > 0)
}

export async function readTextFile(file: File): Promise<string> {
  return file.text()
}
