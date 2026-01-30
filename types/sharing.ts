import { FlowSeriesData } from '@context/AsanaSeriesContext'
import { SequenceData } from '@context/SequenceContext'
import { generateUrlWithFallbacks } from '../app/utils/urlGeneration'
import { AsanaPose } from './asana'

/**
 * Discriminated union for different types of shareable yoga content
 * Uses 'contentType' as the discriminator for type safety
 */
export type ShareableContent =
  | {
      contentType: 'asana'
      data: AsanaPose
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
 * Share strategy for individual asana poses/asanas
 * Implements exact format specification from PRD with mandatory format:
 * "The asana pose [Asana Pose sort name] was shared with you. Below is the description:
 * Practice with Uvuyoga! https://www.happyyoga.app/navigator/flows/practiceSeries (www.happyyoga.app)"
 */
export class AsanaShareStrategy implements ShareStrategy {
  generateShareConfig(data: AsanaPose): ShareConfig {
    const poseName = data.sort_english_name

    // According to PRD, asana sharing must always use the production URL
    const shareUrl = 'https://www.happyyoga.app/navigator/flows/practiceSeries'

    // Implement exact PRD format specification
    const shareText = `The asana pose ${poseName} was shared with you. Below is the description:

Practice with Uvuyoga!

${shareUrl}

(www.happyyoga.app)`

    return {
      title: `The asana pose "${poseName}" was shared with you. Below is the description:`,
      text: shareText,
      url: shareUrl,
      shareType: 'asana',
    }
  }
}

/**
 * Share strategy for yoga series (collections of related asanas)
 * Implements exact format specification from PRD with mandatory format:
 * "Sharing a video of the yoga series "[Series Name]"
 * Below are the poses in this series: * [Pose 1], * [Pose 2], etc.
 * Practice with Uvuyoga! https://www.happyyoga.app/navigator/flows/practiceSeries (www.happyyoga.app)"
 */
export class SeriesShareStrategy implements ShareStrategy {
  generateShareConfig(data: FlowSeriesData): ShareConfig {
    const seriesName = data.seriesName

    // Format poses with exactly the required format: "* [Pose Name],"
    const posesText = data.seriesPoses
      .map((pose, index) => {
        // Support both string entries and object-shaped entries
        let cleanPose = ''
        if (typeof pose === 'string') {
          cleanPose = pose.replace(/;/g, '').trim()
        } else {
          cleanPose = (
            (pose as any).sort_english_name ||
            String((pose as any).poseId || '')
          ).trim()
        }
        return index === data.seriesPoses.length - 1
          ? `* ${cleanPose}`
          : `* ${cleanPose},`
      })
      .join('\n')

    // Prefer the practiceSeries route with an `id` query param because
    // that's the canonical public landing page for shared flows in the app.
    // Use `generateUrlWithFallbacks` with a fallback to the practiceSeries
    // id URL to ensure we include the series id when possible.
    const fallbackPracticeUrl = `https://www.happyyoga.app/navigator/flows/practiceSeries?id=${data.id}`
    // Prefer a stable, shareable production link that includes the series id so
    // recipients land on the exact flow. If an id is available, use the
    // production practiceSeries?id=... URL; otherwise fall back to the
    // generated URL with fallbacks.
    const shareUrl = data?.id
      ? fallbackPracticeUrl
      : generateUrlWithFallbacks('series', data, fallbackPracticeUrl)

    // Implement exact PRD format specification
    const shareText = `Sharing a video of
the yoga series
"${seriesName}"

Below are the poses in this series:

${posesText}

Practice with Uvuyoga!

${shareUrl}

(www.happyyoga.app)`

    return {
      title: `Sharing a video of the yoga series "${seriesName}"`,
      text: shareText,
      url: shareUrl,
      shareType: 'series',
    }
  }
}

/**
 * Share strategy for yoga sequences (ordered flows with multiple series)
 * Combines sequence information with included series data
 * Uses sequence-specific URL or falls back to current context
 */
export class SequenceShareStrategy implements ShareStrategy {
  generateShareConfig(data: SequenceData, url?: string): ShareConfig {
    const sequenceName = data.nameSequence
    const seriesNames = data.sequencesSeries
      .map((series) => series.seriesName)
      .join(', ')

    // Prefer the public practiceSequences landing page with a query param
    // that points to the exact sequence so recipients land on the same
    // practice page the sender expects. Use generateUrlWithFallbacks as
    // a fallback when an id isn't available or the environment requires it.
    const fallbackPracticeUrl = `https://www.happyyoga.app/navigator/flows/practiceSequences?sequenceId=${data.id}`
    const shareUrl = data?.id
      ? fallbackPracticeUrl
      : generateUrlWithFallbacks('sequence', data, url || fallbackPracticeUrl)

    const shareText = `The yoga sequence "${sequenceName}" was shared with you.\n\nDescription: ${data.description || 'A custom yoga sequence'}\n\nSeries included: ${seriesNames}\n\nDuration: ${data.durationSequence || 'Varies'}\n\nPractice with Uvuyoga!\n\n${shareUrl}\n\n(www.happyyoga.app)`

    return {
      title: `The yoga sequence "${sequenceName}" was shared with you.`,
      text: shareText,
      url: shareUrl,
      shareType: 'sequence',
    }
  }
}
