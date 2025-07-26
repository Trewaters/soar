/* eslint-disable @typescript-eslint/no-unused-vars */
/* This file contains interface definitions where parameter names are required for documentation
   but flagged as unused by eslint. The parameters are properly used in implementing classes. */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { FullAsanaData } from '@context/AsanaPostureContext'
import { FlowSeriesData } from '@context/AsanaSeriesContext'
import { SequenceData } from '@context/SequenceContext'

/**
 * Discriminated union for different types of shareable yoga content
 * Uses 'contentType' as the discriminator for type safety
 */
export type ShareableContent =
  | {
      contentType: 'asana'
      data: FullAsanaData
    }
  | {
      contentType: 'series'
      data: FlowSeriesData
    }
  | {
      contentType: 'sequence'
      data: SequenceData
    }

/**
 * Standardized configuration for share data structure
 * Used across all sharing strategies for consistent formatting
 */
export interface ShareConfig {
  /** The title/subject line for the shared content */
  title: string
  /** The main text content including descriptions and practice information */
  text: string
  /** The URL where the content can be accessed or practiced */
  url: string
  /** The type of content being shared for analytics and customization */
  shareType: 'asana' | 'series' | 'sequence'
}

/**
 * Strategy interface for handling different content types
 * Implements the Strategy pattern for extensible sharing functionality
 */
export interface ShareStrategy {
  /**
   * Generates the share configuration for the specific content type
   * @param data - The yoga content data to be shared
   * @param url - The current page URL for context (optional)
   * @returns ShareConfig object with formatted sharing data
   */
  generateShareConfig(data: any, url?: string): ShareConfig
}

/**
 * Factory function for creating appropriate share strategy based on content type
 * @param contentType - The type of content being shared
 * @returns The appropriate ShareStrategy implementation
 */
export function createShareStrategy(
  contentType: ShareableContent['contentType']
): ShareStrategy {
  switch (contentType) {
    case 'asana':
      return new AsanaShareStrategy()
    case 'series':
      return new SeriesShareStrategy()
    case 'sequence':
      return new SequenceShareStrategy()
    default:
      throw new Error(`Unsupported content type: ${contentType}`)
  }
}

/**
 * Share strategy for individual yoga postures/asanas
 * Formats asana data with Sanskrit names, descriptions, and benefits
 */
export class AsanaShareStrategy implements ShareStrategy {
  generateShareConfig(data: FullAsanaData, url?: string): ShareConfig {
    const postureName = data.sort_english_name
    const sanskritName = data.sanskrit_names || ''

    return {
      title: `The yoga posture "${postureName}" was shared with you. Below is the description:`,
      text: `${data.description}\n\n${sanskritName ? `Sanskrit: ${sanskritName}\n` : ''}${data.benefits ? `Benefits: ${data.benefits}\n` : ''}\nPractice with us at Uvuyoga!`,
      url: url || (typeof window !== 'undefined' ? window.location.href : ''),
      shareType: 'asana',
    }
  }
}

/**
 * Share strategy for yoga series (collections of related asanas)
 * Implements exact format specification from PRD with video header and specific URL
 */
export class SeriesShareStrategy implements ShareStrategy {
  generateShareConfig(data: FlowSeriesData): ShareConfig {
    const seriesName = data.seriesName
    const posturesText = data.seriesPostures
      .map((posture) => `• ${posture.replace(';', ',')}`)
      .join('\n')

    return {
      title: `Sharing a video of the yoga series\n\nThe yoga series "${seriesName}" was shared with you. Below are the postures:`,
      text: `${posturesText}\n\nPractice with Uvuyoga!`,
      url: 'https://www.happyyoga.app/navigator/flows/practiceSeries',
      shareType: 'series',
    }
  }
}

/**
 * Share strategy for yoga sequences (ordered flows with multiple series)
 * Combines sequence information with included series data
 */
export class SequenceShareStrategy implements ShareStrategy {
  generateShareConfig(data: SequenceData, url?: string): ShareConfig {
    const sequenceName = data.nameSequence
    const seriesNames = data.sequencesSeries
      .map((series) => series.seriesName)
      .join(', ')

    return {
      title: `The yoga sequence "${sequenceName}" was shared with you. Below is the flow:`,
      text: `Description: ${data.description || 'A custom yoga sequence'}\n\nSeries included: ${seriesNames}\n\nDuration: ${data.duration || 'Varies'}\n\nPractice with us at Uvuyoga!`,
      url: url || (typeof window !== 'undefined' ? window.location.href : ''),
      shareType: 'sequence',
    }
  }
}
