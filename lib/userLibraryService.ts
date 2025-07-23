import { FullAsanaData } from '@app/context/AsanaPostureContext'
import { SeriesData } from './seriesService'
import { SequenceData } from './sequenceService'
import { logServiceError } from './errorLogger'

// Types for user-specific data
export interface UserAsanaData extends FullAsanaData {
  created_on: string
  updated_on: string
  created_by: string
}

export interface UserSeriesData extends SeriesData {
  createdAt: string
  updatedAt: string
  createdBy?: string
}

export interface UserSequenceData extends SequenceData {
  createdAt: string
  updatedAt: string
  createdBy?: string
}

/**
 * Get all asanas created by a specific user
 */
export async function getUserCreatedAsanas(
  userEmail: string
): Promise<UserAsanaData[]> {
  try {
    const timestamp = Date.now()
    const response = await fetch(
      `/api/poses?createdBy=${encodeURIComponent(userEmail)}&t=${timestamp}`,
      {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch user asanas')
    }

    return await response.json()
  } catch (error) {
    logServiceError(error, 'userLibraryService', 'getUserCreatedAsanas', {
      operation: 'fetch_user_asanas',
      userEmail,
    })
    throw error
  }
}

/**
 * Get all series created by a specific user
 */
export async function getUserCreatedSeries(
  userEmail: string
): Promise<UserSeriesData[]> {
  try {
    const timestamp = Date.now()
    const response = await fetch(
      `/api/series?createdBy=${encodeURIComponent(userEmail)}&t=${timestamp}`,
      {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch user series')
    }

    return await response.json()
  } catch (error) {
    logServiceError(error, 'userLibraryService', 'getUserCreatedSeries', {
      operation: 'fetch_user_series',
      userEmail,
    })
    throw error
  }
}

/**
 * Get all sequences created by a specific user
 */
export async function getUserCreatedSequences(
  userEmail: string
): Promise<UserSequenceData[]> {
  try {
    const timestamp = Date.now()
    const response = await fetch(
      `/api/sequences?createdBy=${encodeURIComponent(userEmail)}&t=${timestamp}`,
      {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch user sequences')
    }

    return await response.json()
  } catch (error) {
    logServiceError(error, 'userLibraryService', 'getUserCreatedSequences', {
      operation: 'fetch_user_sequences',
      userEmail,
    })
    throw error
  }
}

/**
 * Delete a user's asana
 */
export async function deleteUserAsana(asanaId: string): Promise<void> {
  try {
    const response = await fetch(`/api/poses/${asanaId}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error('Failed to delete asana')
    }
  } catch (error) {
    logServiceError(error, 'userLibraryService', 'deleteUserAsana', {
      operation: 'delete_user_asana',
      asanaId,
    })
    throw error
  }
}

/**
 * Delete a user's series
 */
export async function deleteUserSeries(seriesId: string): Promise<void> {
  try {
    const response = await fetch(`/api/series/${seriesId}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error('Failed to delete series')
    }
  } catch (error) {
    logServiceError(error, 'userLibraryService', 'deleteUserSeries', {
      operation: 'delete_user_series',
      seriesId,
    })
    throw error
  }
}

/**
 * Delete a user's sequence
 */
export async function deleteUserSequence(sequenceId: string): Promise<void> {
  try {
    const response = await fetch(`/api/sequences/${sequenceId}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error('Failed to delete sequence')
    }
  } catch (error) {
    logServiceError(error, 'userLibraryService', 'deleteUserSequence', {
      operation: 'delete_user_sequence',
      sequenceId,
    })
    throw error
  }
}
