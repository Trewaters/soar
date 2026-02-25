/**
 * Utility functions for working with timers
 */

export interface TimerEntry {
  entryType: string
  startTime: number
  duration: number
  name: string
}

/**
 * These timer utility functions are maintained for compatibility
 * but the actual timer functionality now uses react-use-precision-timer
 * in the components and context.
 */

/**
 * Legacy function - maintained for compatibility
 * @param name - The name of the timer to start
 */
export function startTimer(name: string): void {
  // Intentionally no-op: actual timer functionality uses react-use-precision-timer
}

/**
 * Legacy function - maintained for compatibility
 * @param name - The name of the timer to stop
 * @returns TimerEntry with duration information, or null if failed
 */
export function stopTimer(name: string): TimerEntry | null {
  return {
    entryType: 'measure',
    startTime: Date.now(),
    duration: 0,
    name,
  }
}

/**
 * Legacy function - maintained for compatibility
 */
export function clearAllTimers(): void {
  // Intentionally no-op: actual timer functionality uses react-use-precision-timer
}

/**
 * Legacy function - maintained for compatibility
 * @returns Array of all timer entries
 */
export function getAllTimerEntries(): TimerEntry[] {
  return []
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
