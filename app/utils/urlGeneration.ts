/**
 * URL Generation Utilities for Soar Yoga Application
 * Handles dynamic URL generation based on content type with validation and fallbacks
 * Supports different environments (development, production) and edge cases
 */

import { ShareableContent } from '../../types/sharing'

// Environment detection utilities
export const detectEnvironment = (): 'development' | 'production' | 'test' => {
  if (typeof window === 'undefined') return 'test' // SSR/Testing

  try {
    const hostname = window.location.hostname

    if (
      hostname === 'localhost' ||
      hostname.startsWith('192.168.') ||
      hostname.startsWith('127.0.')
    ) {
      return 'development'
    }

    return 'production'
  } catch (error) {
    console.warn('Failed to detect environment from window.location:', error)
    return 'test' // Fallback to test environment when location access fails
  }
}

// Base URLs for different environments
const BASE_URLS = {
  development: 'http://localhost:3000',
  production: 'https://www.happyyoga.app',
  test: 'https://www.happyyoga.app',
} as const

// Content-specific URL paths
const CONTENT_PATHS = {
  asana: {
    development: '', // Use current page URL for development
    production: '', // Use current page URL for production
    test: '/asana', // Test fallback
  },
  flow: {
    development: '/flows/practiceSeries',
    production: '/flows/practiceSeries',
    test: '/flows/practiceSeries',
  },
  sequence: {
    development: '/flows/practiceSequences',
    production: '/flows/practiceSequences',
    test: '/flows/practiceSequences',
  },
} as const

/**
 * Validates if a URL is properly formed and accessible
 * @param url - The URL to validate
 * @returns boolean indicating if URL is valid
 */
export const validateUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url)

    // Check for required protocol
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return false
    }

    // Check for valid hostname - must not be empty, just a dot, or only whitespace
    if (
      !urlObj.hostname ||
      urlObj.hostname.length === 0 ||
      urlObj.hostname === '.' ||
      urlObj.hostname.trim() === ''
    ) {
      return false
    }

    // Check for malformed hostnames that are just dots or incomplete
    if (
      urlObj.hostname.match(/^\.+$/) ||
      (urlObj.hostname.endsWith('.') &&
        urlObj.hostname.indexOf('.') === urlObj.hostname.lastIndexOf('.'))
    ) {
      return false
    }

    // Additional validations for yoga app URLs
    if (
      urlObj.hostname.includes('happyyoga.app') ||
      urlObj.hostname.includes('localhost')
    ) {
      return true
    }

    // Allow other valid URLs but warn about external domains
    console.warn('External domain detected in URL validation:', urlObj.hostname)
    return true
  } catch (error) {
    console.error('URL validation failed:', error)
    return false
  }
}

/**
 * Gets the current page URL with proper fallbacks for different environments
 * @returns The current page URL or appropriate fallback
 */
export const getCurrentPageUrl = (): string => {
  // SSR/Testing environment fallback
  if (typeof window === 'undefined') {
    const env = detectEnvironment()
    return BASE_URLS[env]
  }

  try {
    return window.location.href
  } catch (error) {
    console.warn('Failed to get current page URL:', error)
    const env = detectEnvironment()
    return BASE_URLS[env]
  }
}

/**
 * Generates content-specific URLs based on content type and current environment
 * @param contentType - The type of yoga content being shared
 * @param contentData - Optional content data for dynamic URL generation
 * @returns The appropriate URL for the content type
 */
export const generateContentUrl = (
  contentType: ShareableContent['contentType'],
  contentData?: any
): string => {
  const environment = detectEnvironment()
  const baseUrl = BASE_URLS[environment]

  // Check if content type exists in CONTENT_PATHS
  if (!CONTENT_PATHS[contentType]) {
    console.warn(
      `Unknown content type: ${contentType}, falling back to base URL`
    )
    return baseUrl
  }

  const contentPath = CONTENT_PATHS[contentType][environment]

  try {
    switch (contentType) {
      case 'asana': {
        // For asanas, use current page URL to maintain context
        const currentUrl = getCurrentPageUrl()

        // If we have specific asana data, we could potentially generate a direct link
        if (contentData?.id && environment === 'production') {
          const asanaUrl = `${baseUrl}/asana/${contentData.id}`
          return validateUrl(asanaUrl) ? asanaUrl : currentUrl
        }

        return currentUrl
      }

      case 'flow': {
        // Series use the [id] route structure for direct navigation
        if (contentData?.id && environment === 'production') {
          const directSeriesUrl = `${baseUrl}/flows/series/${contentData.id}`
          return validateUrl(directSeriesUrl)
            ? directSeriesUrl
            : `${baseUrl}${contentPath}`
        }

        // Fallback to general series URL
        const seriesUrl = `${baseUrl}${contentPath}`
        return validateUrl(seriesUrl) ? seriesUrl : getCurrentPageUrl()
      }

      case 'sequence': {
        // Sequences use the [id] route structure for direct navigation
        if (contentData?.id && environment === 'production') {
          const directSequenceUrl = `${baseUrl}/sequences/${contentData.id}`
          return validateUrl(directSequenceUrl)
            ? directSequenceUrl
            : `${baseUrl}${contentPath}`
        }

        // Fallback to general sequences URL
        const sequenceUrl = `${baseUrl}${contentPath}`
        return validateUrl(sequenceUrl) ? sequenceUrl : getCurrentPageUrl()
      }

      default: {
        console.warn(`Unknown content type for URL generation: ${contentType}`)
        return getCurrentPageUrl()
      }
    }
  } catch (error) {
    console.error(
      `Error generating URL for content type ${contentType}:`,
      error
    )
    return getCurrentPageUrl()
  }
}

/**
 * Enhanced URL generation with validation and fallback options
 * @param contentType - The type of yoga content
 * @param contentData - The content data for dynamic URL generation
 * @param fallbackUrl - Optional fallback URL if generation fails
 * @returns Validated URL with appropriate fallbacks
 */
export const generateUrlWithFallbacks = (
  contentType: ShareableContent['contentType'],
  contentData?: any,
  fallbackUrl?: string
): string => {
  try {
    // Primary URL generation
    const primaryUrl = generateContentUrl(contentType, contentData)

    if (validateUrl(primaryUrl)) {
      return primaryUrl
    }

    // First fallback: provided fallback URL
    if (fallbackUrl && validateUrl(fallbackUrl)) {
      console.warn(`Using fallback URL for ${contentType}:`, fallbackUrl)
      return fallbackUrl
    }

    // Second fallback: current page URL
    const currentUrl = getCurrentPageUrl()
    if (validateUrl(currentUrl)) {
      console.warn(
        `Using current page URL as fallback for ${contentType}:`,
        currentUrl
      )
      return currentUrl
    }

    // Final fallback: environment-appropriate base URL
    const environment = detectEnvironment()
    const baseUrl = BASE_URLS[environment]
    console.warn(
      `Using base URL as final fallback for ${contentType}:`,
      baseUrl
    )
    return baseUrl
  } catch (error) {
    console.error(
      `All URL generation methods failed for ${contentType}:`,
      error
    )
    // Ultimate fallback
    return BASE_URLS.production
  }
}

/**
 * Validates URLs work correctly across different environments
 * @param url - The URL to test
 * @param environment - The target environment
 * @returns Promise resolving to boolean indicating if URL is accessible
 */
export const testUrlAccessibility = async (
  url: string,
  environment: 'development' | 'production' | 'test' = 'production'
): Promise<boolean> => {
  // Basic validation first
  if (!validateUrl(url)) {
    return false
  }

  // For development and test environments, skip network checks
  if (environment === 'development' || environment === 'test') {
    return true
  }

  // For production, we could implement a lightweight accessibility check
  // This is optional and depends on requirements for URL validation
  try {
    // Note: This would require CORS handling and might not be practical in browser environment
    // For now, we rely on URL structure validation
    return true
  } catch (error) {
    console.warn('URL accessibility test failed:', error)
    return false
  }
}

/**
 * Utility to clean and normalize URLs for consistent formatting
 * @param url - The URL to normalize
 * @returns Normalized URL string
 */
export const normalizeUrl = (url: string): string => {
  try {
    const urlObj = new URL(url)

    // Remove trailing slashes except for root
    if (urlObj.pathname !== '/' && urlObj.pathname.endsWith('/')) {
      urlObj.pathname = urlObj.pathname.slice(0, -1)
    }

    // Ensure HTTPS for production URLs
    if (
      urlObj.hostname.includes('happyyoga.app') &&
      urlObj.protocol === 'http:'
    ) {
      urlObj.protocol = 'https:'
    }

    return urlObj.toString()
  } catch (error) {
    console.warn('URL normalization failed, returning original:', error)
    return url
  }
}

/**
 * Gets environment-appropriate URLs for debugging and development
 * @returns Object containing URLs for current environment
 */
export const getEnvironmentUrls = () => {
  const environment = detectEnvironment()

  return {
    environment,
    baseUrl: BASE_URLS[environment],
    asanaUrl: generateContentUrl('asana'),
    seriesUrl: generateContentUrl('flow'),
    sequenceUrl: generateContentUrl('sequence'),
    currentPageUrl: getCurrentPageUrl(),
  }
}
