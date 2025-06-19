import { logServiceError } from './errorLogger'

export type SeriesData = {
  id: number
  seriesName: string
  seriesPostures: string[]
  breath?: string
  description?: string
  duration?: string
  image?: string
}

export type CreateSeriesInput = {
  seriesName: string
  seriesPostures: string[]
  breath: string
  description: string
  duration: string
  image: string
}

/**
 * Get all series
 */
export async function getAllSeries(): Promise<SeriesData[]> {
  try {
    const response = await fetch('/api/series', { cache: 'no-store' })
    if (!response.ok) {
      throw new Error('Failed to fetch series')
    }
    return await response.json()
  } catch (error) {
    logServiceError(error, 'seriesService', 'getAllSeries', {
      operation: 'fetch_all_series',
    })
    throw error
  }
}

/**
 * Create a new series
 */
export async function createSeries(
  input: CreateSeriesInput
): Promise<SeriesData> {
  try {
    const response = await fetch('/api/series/createSeries', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        cache: 'no-store',
      },
      body: JSON.stringify(input),
    })

    if (!response.ok) {
      throw new Error('Failed to create series')
    }

    return await response.json()
  } catch (error) {
    logServiceError(error, 'seriesService', 'createSeries', {
      operation: 'create_series',
      input,
    })
    throw error
  }
}
