import { logServiceError } from './errorLogger'

// Import FlowSeriesPose type for per-pose metadata support
export interface FlowSeriesPose {
  poseId?: string
  sort_english_name: string
  secondary?: string
  alignment_cues?: string
}

// Import FlowSeriesSequence for proper typing
export interface FlowSeriesSequence {
  id?: string
  seriesName: string
  seriesPoses: Array<string | FlowSeriesPose>
  breath?: string
  duration?: string
  image?: string
  createdAt?: string
  updatedAt?: string
}

export type SequenceData = {
  id: number
  nameSequence: string
  sequencesSeries: FlowSeriesSequence[]
  description?: string
  durationSequence?: string
  image?: string
  created_by?: string
  createdAt?: string
  updatedAt?: string
}

export type CreateSequenceInput = {
  nameSequence: string
  sequencesSeries: Array<{
    id: number
    seriesName: string
    // Support both legacy string[] and new object format with alignment_cues
    seriesPoses: Array<string | FlowSeriesPose>
    breath?: string
    description?: string
    duration?: string
    image?: string
  }>
  description: string
  duration: string
  image: string
}

/**
 * Get all sequences
 */
export async function getAllSequences(): Promise<SequenceData[]> {
  try {
    // Add timestamp to ensure fresh data
    const timestamp = Date.now()
    const response = await fetch(`/api/sequences?t=${timestamp}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    })
    if (!response.ok) {
      throw new Error('Failed to fetch sequences')
    }
    return await response.json()
  } catch (error) {
    logServiceError(error, 'sequenceService', 'getAllSequences', {
      operation: 'fetch_all_sequences',
    })
    throw error
  }
}

/**
 * Get a single sequence by ID
 */
export async function getSingleSequence(id: string): Promise<SequenceData> {
  try {
    // Add timestamp to prevent caching
    const timestamp = Date.now()
    const response = await fetch(`/api/sequences/${id}?ts=${timestamp}`, {
      cache: 'no-store',
      next: { revalidate: 0 },
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
        Pragma: 'no-cache',
        Expires: '0',
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Sequence not found')
      }
      throw new Error('Failed to fetch sequence')
    }

    return await response.json()
  } catch (error) {
    logServiceError(error, 'sequenceService', 'getSingleSequence', { id })
    throw error
  }
}

/**
 * Create a new sequence
 */
export async function createSequence(
  input: CreateSequenceInput
): Promise<SequenceData> {
  try {
    const response = await fetch('/api/sequences/createSequence', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
      body: JSON.stringify(input),
    })

    if (!response.ok) {
      throw new Error('Failed to create sequence')
    }

    return await response.json()
  } catch (error) {
    logServiceError(error, 'sequenceService', 'createSequence', {
      operation: 'create_sequence',
      input,
    })
    throw error
  }
}

/**
 * Delete a sequence by ID
 */
export async function deleteSequence(
  id: string
): Promise<{ success: boolean }> {
  try {
    const response = await fetch(`/api/sequences/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to delete sequence')
    }

    return await response.json()
  } catch (error) {
    logServiceError(error, 'sequenceService', 'deleteSequence', { id })
    throw error
  }
}
