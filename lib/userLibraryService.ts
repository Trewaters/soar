import { SeriesData } from './seriesService'
import { SequenceData } from './sequenceService'
import { logServiceError } from './errorLogger'
import { AsanaPose } from 'types/asana'

// Types for user-specific data
export interface UserAsanaData extends AsanaPose {
  created_on: Date
  updated_on: Date
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
 * For admin users, returns all asanas regardless of creator
 */
export async function getUserCreatedAsanas(
  userEmail: string,
  isAdmin: boolean = false
): Promise<UserAsanaData[]> {
  try {
    const timestamp = Date.now()
    // Admins get all content, regular users get only their own
    const url = isAdmin
      ? `/api/poses?showAll=true&t=${timestamp}`
      : `/api/poses?createdBy=${encodeURIComponent(userEmail)}&t=${timestamp}`

    const response = await fetch(url, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch user asanas')
    }

    return await response.json()
  } catch (error) {
    logServiceError(error, 'userLibraryService', 'getUserCreatedAsanas', {
      operation: 'fetch_user_asanas',
      userEmail,
      isAdmin,
    })
    throw error
  }
}

/**
 * Get all series created by a specific user
 * For admin users, returns all series regardless of creator
 */
export async function getUserCreatedSeries(
  userEmail: string,
  isAdmin: boolean = false
): Promise<UserSeriesData[]> {
  try {
    const timestamp = Date.now()
    // Admins get all content, regular users get only their own
    const url = isAdmin
      ? `/api/series?showAll=true&t=${timestamp}`
      : `/api/series?createdBy=${encodeURIComponent(userEmail)}&t=${timestamp}`

    const response = await fetch(url, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch user series')
    }

    return await response.json()
  } catch (error) {
    logServiceError(error, 'userLibraryService', 'getUserCreatedSeries', {
      operation: 'fetch_user_series',
      userEmail,
      isAdmin,
    })
    throw error
  }
}

/**
 * Get all sequences created by a specific user
 * For admin users, returns all sequences regardless of creator
 */
export async function getUserCreatedSequences(
  userEmail: string,
  isAdmin: boolean = false
): Promise<UserSequenceData[]> {
  try {
    const timestamp = Date.now()
    // Admins get all content, regular users get only their own
    const url = isAdmin
      ? `/api/sequences?showAll=true&t=${timestamp}`
      : `/api/sequences?createdBy=${encodeURIComponent(userEmail)}&t=${timestamp}`

    const response = await fetch(url, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch user sequences')
    }

    return await response.json()
  } catch (error) {
    logServiceError(error, 'userLibraryService', 'getUserCreatedSequences', {
      operation: 'fetch_user_sequences',
      userEmail,
      isAdmin,
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
