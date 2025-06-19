import { logServiceError } from './errorLogger'

export type SequenceData = {
  id: number
  nameSequence: string
  sequencesSeries: Array<{
    id: number
    seriesName: string
    seriesPostures: string[]
    breath?: string
    description?: string
    duration?: string
    image?: string
  }>
  description?: string
  duration?: string
  image?: string
  breath_direction?: string
  createdAt?: string
  updatedAt?: string
}

export type CreateSequenceInput = {
  nameSequence: string
  sequencesSeries: Array<{
    id: number
    seriesName: string
    seriesPostures: string[]
    breath?: string
    description?: string
    duration?: string
    image?: string
  }>
  description: string
  duration: string
  image: string
  breath_direction: string
}

/**
 * Get all sequences
 */
export async function getAllSequences(): Promise<SequenceData[]> {
  try {
    const response = await fetch('/api/sequences', { cache: 'no-store' })
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
        cache: 'no-store',
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
