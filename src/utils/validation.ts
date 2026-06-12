/**
 * Compares user input against the stored word exactly.
 * Case-insensitive, trims leading/trailing spaces only.
 * Never uses dictionary or autocorrect.
 */
export function isCorrectAnswer(userInput: string, storedWord: string): boolean {
  return userInput.trim().toLowerCase() === storedWord.trim().toLowerCase()
}

export function calcAccuracy(correct: number, total: number): number {
  if (total === 0) return 0
  return Math.round((correct / total) * 100)
}
