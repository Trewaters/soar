import * as marky from 'marky'

/**
 * Utility functions for working with the marky timer library
 */

export interface TimerEntry {
  entryType: string
  startTime: number
  duration: number
  name: string
}

/**
 * Start a named timer mark
 * @param name - The name of the timer to start
 */
export function startTimer(name: string): void {
  try {
    marky.mark(name)
  } catch (error) {
    console.warn(`Failed to start timer "${name}":`, error)
  }
}

/**
 * Stop a named timer and return the duration
 * @param name - The name of the timer to stop
 * @returns TimerEntry with duration information, or null if failed
 */
export function stopTimer(name: string): TimerEntry | null {
  try {
    return marky.stop(name)
  } catch (error) {
    console.warn(`Failed to stop timer "${name}":`, error)
    return null
  }
}

/**
 * Clear all timer entries
 */
export function clearAllTimers(): void {
  try {
    marky.clear()
  } catch (error) {
    console.warn('Failed to clear timers:', error)
  }
}

/**
 * Get all timer entries
 * @returns Array of all timer entries
 */
export function getAllTimerEntries(): TimerEntry[] {
  try {
    return marky.getEntries()
  } catch (error) {
    console.warn('Failed to get timer entries:', error)
    return []
  }
}

/**
 * Format time duration in seconds to HH:MM:SS or MM:SS format
 * @param totalSeconds - Total time in seconds
 * @returns Formatted time string
 */
export function formatDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = Math.floor(totalSeconds % 60)

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  } else {
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }
}

/**
 * Convert milliseconds to seconds
 * @param ms - Milliseconds
 * @returns Seconds as a number
 */
export function msToSeconds(ms: number): number {
  return Math.floor(ms / 1000)
}
