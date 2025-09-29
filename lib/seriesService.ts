import { Series } from '@app/navigator/flows/editSeries/EditSeriesDialog'

export async function updateSeries(id: string, input: Series): Promise<Series> {
  try {
    const response = await fetch(`/api/series/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
      body: JSON.stringify(input),
    })
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        `Failed to update series: ${errorData.error || response.statusText}`
      )
    }
    return await response.json()
  } catch (error) {
    logServiceError(error, 'seriesService', 'updateSeries', { id, input })
    throw error
  }
}

export async function deleteSeries(id: string): Promise<{ success: boolean }> {
  try {
    const response = await fetch(`/api/series/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
      },
    })
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        `Failed to delete series: ${errorData.error || response.statusText}`
      )
    }
    return await response.json()
  } catch (error) {
    logServiceError(error, 'seriesService', 'deleteSeries', { id })
    throw error
  }
}
import { logServiceError } from './errorLogger'

export type SeriesData = {
  id?: string
  seriesName: string
  seriesPostures: string[]
  breath?: string
  description?: string
  duration?: string
  image?: string
  createdAt?: string
  updatedAt?: string
  createdBy?: string // Add this field for ownership tracking
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
    // Add timestamp to prevent caching and use no-store
    const timestamp = Date.now()
    const response = await fetch(`/api/series?ts=${timestamp}`, {
      cache: 'no-store',
      next: { revalidate: 0 },
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
        Pragma: 'no-cache',
        Expires: '0',
      },
    })
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
 * Get a single series by ID
 */
export async function getSingleSeries(id: string): Promise<SeriesData> {
  try {
    const response = await fetch(`/api/series/${id}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Series not found')
      }
      throw new Error('Failed to fetch series')
    }

    return await response.json()
  } catch (error) {
    logServiceError(error, 'seriesService', 'getSingleSeries', { id })
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
