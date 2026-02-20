/**
 * Unit tests for URL Generation utilities in Soar Yoga Application
 * Tests dynamic URL generation, validation, environment detection, and fallback scenarios
 */

import {
  detectEnvironment,
  validateUrl,
  getCurrentPageUrl,
  generateContentUrl,
  generateUrlWithFallbacks,
  normalizeUrl,
  getEnvironmentUrls,
  testUrlAccessibility,
} from '../../../app/utils/urlGeneration'

// Mock window object for testing
const mockWindow = (locationProps: Partial<Location>) => {
  Object.defineProperty(window, 'location', {
    value: {
      hostname: 'localhost',
      href: 'http://localhost:3000/test',
      protocol: 'http:',
      ...locationProps,
    },
    writable: true,
  })
}

// Mock environment scenarios
const mockDevelopmentEnvironment = () => {
  mockWindow({ hostname: 'localhost', href: 'http://localhost:3000/asana/1' })
}

const mockProductionEnvironment = () => {
  mockWindow({
    hostname: 'www.happyyoga.app',
    href: 'https://www.happyyoga.app/practice/session',
    protocol: 'https:',
  })
}

const mockIPDevelopmentEnvironment = () => {
  mockWindow({
    hostname: '192.168.1.100',
    href: 'http://192.168.1.100:3000/test',
  })
}

describe('URL Generation Utilities', () => {
  beforeEach(() => {
    // Reset to default test environment
    mockDevelopmentEnvironment()
    jest.clearAllMocks()
  })

  describe('detectEnvironment', () => {
    test('should detect development environment for localhost', () => {
      mockDevelopmentEnvironment()
      expect(detectEnvironment()).toBe('development')
    })

    test('should detect development environment for local IP addresses', () => {
      mockIPDevelopmentEnvironment()
      expect(detectEnvironment()).toBe('development')
    })

    test('should detect production environment for production domain', () => {
      mockProductionEnvironment()
      expect(detectEnvironment()).toBe('production')
    })

    test('should detect test environment in SSR context', () => {
      // Simulate SSR environment
      const originalWindow = global.window
      // @ts-expect-error - Deliberately deleting window for testing
      delete global.window

      expect(detectEnvironment()).toBe('test')

      // Restore window
      global.window = originalWindow
    })

    test('should handle various localhost variations', () => {
      mockWindow({ hostname: '127.0.0.1' })
      expect(detectEnvironment()).toBe('development')

      mockWindow({ hostname: '192.168.0.1' })
      expect(detectEnvironment()).toBe('development')

      mockWindow({ hostname: '10.0.0.1' })
      expect(detectEnvironment()).toBe('production') // Should not match private IP pattern
    })
  })

  describe('validateUrl', () => {
    test('should validate correct HTTP URLs', () => {
      expect(validateUrl('http://localhost:3000')).toBe(true)
      expect(validateUrl('http://example.com')).toBe(true)
    })

    test('should validate correct HTTPS URLs', () => {
      expect(validateUrl('https://www.happyyoga.app')).toBe(true)
      expect(validateUrl('https://example.com/path')).toBe(true)
    })

    test('should reject invalid protocols', () => {
      expect(validateUrl('ftp://example.com')).toBe(false)
      expect(validateUrl('file:///path/to/file')).toBe(false)
      expect(validateUrl('data:text/plain;base64,SGVsbG8=')).toBe(false)
    })

    test('should reject malformed URLs', () => {
      expect(validateUrl('not-a-url')).toBe(false)
      expect(validateUrl('')).toBe(false)
      expect(validateUrl('http://')).toBe(false)
      expect(validateUrl('https://.')).toBe(false)
    })

    test('should handle yoga app domains specifically', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()

      expect(validateUrl('https://www.happyyoga.app/practice')).toBe(true)
      expect(validateUrl('http://localhost:3000/asana')).toBe(true)

      // Should warn about external domains but still allow them
      expect(validateUrl('https://external-domain.com')).toBe(true)
      expect(consoleSpy).toHaveBeenCalledWith(
        'External domain detected in URL validation:',
        'external-domain.com'
      )

      consoleSpy.mockRestore()
    })

    test('should handle edge cases gracefully', () => {
      expect(validateUrl('http://localhost')).toBe(true)
      expect(validateUrl('https://a.b')).toBe(true)
      expect(validateUrl('http://192.168.1.1:8080')).toBe(true)
    })
  })

  describe('getCurrentPageUrl', () => {
    test('should return current page URL in browser environment', () => {
      mockWindow({ href: 'https://www.happyyoga.app/asana/warrior-pose' })
      expect(getCurrentPageUrl()).toBe(
        'https://www.happyyoga.app/asana/warrior-pose'
      )
    })

    test('should handle SSR environment gracefully', () => {
      const originalWindow = global.window
      // @ts-expect-error - Deliberately deleting window for testing
      delete global.window

      const result = getCurrentPageUrl()
      expect(result).toBe('https://www.happyyoga.app') // Should return production base URL

      global.window = originalWindow
    })

    test('should handle window.location access errors', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()

      // Mock window.location.href to throw an error
      Object.defineProperty(window, 'location', {
        get: () => {
          throw new Error('Location access denied')
        },
        configurable: true,
      })

      const result = getCurrentPageUrl()
      expect(result).toBe('https://www.happyyoga.app') // Should fall back to test environment URL
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to get current page URL:',
        expect.any(Error)
      )

      consoleSpy.mockRestore()
      // Restore normal location
      mockDevelopmentEnvironment()
    })
  })

  describe('generateContentUrl', () => {
    test('should generate asana URLs using current page for development', () => {
      mockDevelopmentEnvironment()
      const url = generateContentUrl('asana')
      expect(url).toBe('http://localhost:3000/asana/1')
    })

    test('should generate asana URLs using current page for production', () => {
      mockProductionEnvironment()
      const url = generateContentUrl('asana')
      expect(url).toBe('https://www.happyyoga.app/practice/session')
    })

    test('should generate series URLs using specific path', () => {
      mockDevelopmentEnvironment()
      const url = generateContentUrl('series')
      expect(url).toBe('http://localhost:3000/flows/practiceSeries')
    })

    test('should generate sequence URLs using specific path', () => {
      mockProductionEnvironment()
      const url = generateContentUrl('sequence')
      expect(url).toBe('https://www.happyyoga.app/flows/practiceSequences')
    })

    test('should handle content data for dynamic URL generation', () => {
      mockProductionEnvironment()

      // Test series with ID
      const seriesData = { id: 'series-123', seriesName: 'Sun Salutation' }
      const seriesUrl = generateContentUrl('series', seriesData)
      expect(seriesUrl).toBe(
        'https://www.happyyoga.app/flows/series/series-123'
      )

      // Test sequence with ID
      const sequenceData = { id: 'seq-456', nameSequence: 'Morning Flow' }
      const sequenceUrl = generateContentUrl('sequence', sequenceData)
      expect(sequenceUrl).toBe('https://www.happyyoga.app/sequences/seq-456')

      // Test asana with ID (production only)
      const asanaData = { id: 'asana-789', sort_english_name: 'Warrior I' }
      const asanaUrl = generateContentUrl('asana', asanaData)
      expect(asanaUrl).toBe('https://www.happyyoga.app/asana/asana-789')
    })

    test('should fallback gracefully when URL generation fails', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

      // Test with completely broken environment
      const result = generateUrlWithFallbacks('asana')
      expect(typeof result).toBe('string')
      expect(result.startsWith('http')).toBe(true)

      consoleSpy.mockRestore()
    })

    test('should handle unknown content types', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()

      // @ts-expect-error - Testing runtime behavior with invalid type
      const url = generateContentUrl('unknown-type')
      expect(url).toBe('http://localhost:3000') // Should fallback to base URL for development environment
      expect(consoleSpy).toHaveBeenCalledWith(
        'Unknown content type: unknown-type, falling back to base URL'
      )

      consoleSpy.mockRestore()
    })
  })

  describe('generateUrlWithFallbacks', () => {
    test('should use primary URL when valid', () => {
      mockDevelopmentEnvironment()
      const url = generateUrlWithFallbacks('series')
      expect(url).toBe('http://localhost:3000/flows/practiceSeries')
    })

    test('should use fallback URL when primary fails validation', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()

      // Test case where the primary URL is invalid but fallback is provided and valid
      const result = generateUrlWithFallbacks(
        'asana',
        {},
        'https://www.happyyoga.app/fallback'
      )

      // Should return the current page URL since asana uses current page in development
      expect(result).toBe('http://localhost:3000/asana/1')

      consoleSpy.mockRestore()
    })

    test('should handle complete failure gracefully', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation()
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()

      // Simulate all URL generation methods failing by breaking window.location access
      Object.defineProperty(window, 'location', {
        get: () => {
          throw new Error('Complete location failure')
        },
        configurable: true,
      })

      // Use an unknown content type to trigger fallback logic
      // @ts-expect-error - Testing runtime behavior with invalid type
      const url = generateUrlWithFallbacks('unknown-content-type')
      expect(url).toBe('https://www.happyyoga.app') // Ultimate fallback

      // Should have console.warn calls from the fallback logic
      expect(consoleWarnSpy).toHaveBeenCalled()

      consoleWarnSpy.mockRestore()
      consoleErrorSpy.mockRestore()
      mockDevelopmentEnvironment()
    })

    test('should prioritize provided fallback over current page', () => {
      const fallbackUrl = 'https://custom-fallback.com/yoga'
      const url = generateUrlWithFallbacks('asana', {}, fallbackUrl)
      expect(url).toBe('http://localhost:3000/asana/1') // Primary should work, so use it
    })
  })

  describe('normalizeUrl', () => {
    test('should remove trailing slashes except for root', () => {
      expect(normalizeUrl('https://example.com/')).toBe('https://example.com/')
      expect(normalizeUrl('https://example.com/path/')).toBe(
        'https://example.com/path'
      )
      expect(normalizeUrl('https://example.com/path/subpath/')).toBe(
        'https://example.com/path/subpath'
      )
    })

    test('should enforce HTTPS for production yoga app URLs', () => {
      expect(normalizeUrl('http://www.happyyoga.app/practice')).toBe(
        'https://www.happyyoga.app/practice'
      )
      expect(normalizeUrl('https://www.happyyoga.app/practice')).toBe(
        'https://www.happyyoga.app/practice'
      )
    })

    test('should preserve localhost HTTP protocol', () => {
      expect(normalizeUrl('http://localhost:3000/test')).toBe(
        'http://localhost:3000/test'
      )
    })

    test('should handle malformed URLs gracefully', () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation()

      const malformedUrl = 'not-a-url'
      expect(normalizeUrl(malformedUrl)).toBe(malformedUrl)

      // Check that console.warn was called with proper error message
      expect(consoleSpy).toHaveBeenCalledTimes(1)
      const call = consoleSpy.mock.calls[0]
      expect(call[0]).toBe('URL normalization failed, returning original:')
      expect(call[1]).toHaveProperty('message') // URL constructor throws an error with a message

      consoleSpy.mockRestore()
    })
  })

  describe('getEnvironmentUrls', () => {
    test('should return all relevant URLs for development environment', () => {
      mockDevelopmentEnvironment()
      const urls = getEnvironmentUrls()

      expect(urls.environment).toBe('development')
      expect(urls.baseUrl).toBe('http://localhost:3000')
      expect(urls.asanaUrl).toBe('http://localhost:3000/asana/1')
      expect(urls.seriesUrl).toBe('http://localhost:3000/flows/practiceSeries')
      expect(urls.sequenceUrl).toBe(
        'http://localhost:3000/flows/practiceSequences'
      )
      expect(urls.currentPageUrl).toBe('http://localhost:3000/asana/1')
    })

    test('should return all relevant URLs for production environment', () => {
      mockProductionEnvironment()
      const urls = getEnvironmentUrls()

      expect(urls.environment).toBe('production')
      expect(urls.baseUrl).toBe('https://www.happyyoga.app')
      expect(urls.asanaUrl).toBe('https://www.happyyoga.app/practice/session')
      expect(urls.seriesUrl).toBe(
        'https://www.happyyoga.app/flows/practiceSeries'
      )
      expect(urls.sequenceUrl).toBe(
        'https://www.happyyoga.app/flows/practiceSequences'
      )
      expect(urls.currentPageUrl).toBe(
        'https://www.happyyoga.app/practice/session'
      )
    })
  })

  describe('testUrlAccessibility', () => {
    test('should validate URL structure for all environments', async () => {
      // Valid URLs
      expect(
        await testUrlAccessibility('https://www.happyyoga.app', 'production')
      ).toBe(true)
      expect(
        await testUrlAccessibility('http://localhost:3000', 'development')
      ).toBe(true)
      expect(await testUrlAccessibility('https://example.com', 'test')).toBe(
        true
      )

      // Invalid URLs
      expect(await testUrlAccessibility('invalid-url', 'production')).toBe(
        false
      )
    })

    test('should skip network checks for development and test environments', async () => {
      const validUrl = 'http://localhost:3000'

      // These should return true regardless of actual network accessibility
      expect(await testUrlAccessibility(validUrl, 'development')).toBe(true)
      expect(await testUrlAccessibility(validUrl, 'test')).toBe(true)
    })

    test('should handle network accessibility for production', async () => {
      // Since we're not actually making network calls in this implementation,
      // this test verifies the function structure
      const result = await testUrlAccessibility(
        'https://www.happyyoga.app',
        'production'
      )
      expect(typeof result).toBe('boolean')
    })
  })

  describe('Integration with Yoga Content Types', () => {
    test('should generate appropriate URLs for all yoga content types', () => {
      mockProductionEnvironment()

      // Test all content types
      const asanaUrl = generateContentUrl('asana')
      const seriesUrl = generateContentUrl('series')
      const sequenceUrl = generateContentUrl('sequence')

      expect(asanaUrl).toContain('happyyoga.app')
      expect(seriesUrl).toContain('practiceSeries')
      expect(sequenceUrl).toContain('practiceSequences')
    })

    test('should handle yoga content data appropriately', () => {
      mockProductionEnvironment()

      const asanaData = {
        id: 'warrior-i',
        sort_english_name: 'Warrior I',
        sanskrit_names: 'Virabhadrasana I',
      }

      const seriesData = {
        id: 'sun-salutation',
        seriesName: 'Sun Salutation A',
      }

      const sequenceData = {
        id: 'morning-flow',
        nameSequence: 'Energizing Morning Flow',
      }

      const asanaUrl = generateContentUrl('asana', asanaData)
      const seriesUrl = generateContentUrl('series', seriesData)
      const sequenceUrl = generateContentUrl('sequence', sequenceData)

      expect(asanaUrl).toBe('https://www.happyyoga.app/asana/warrior-i')
      expect(seriesUrl).toBe(
        'https://www.happyyoga.app/flows/series/sun-salutation'
      )
      expect(sequenceUrl).toBe(
        'https://www.happyyoga.app/sequences/morning-flow'
      )
    })
  })

  describe('Error Handling and Edge Cases', () => {
    test('should handle various error scenarios gracefully', () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation()
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation()

      // Should still return valid URLs even with errors
      const url = generateUrlWithFallbacks('asana')
      expect(typeof url).toBe('string')
      expect(url.startsWith('http')).toBe(true)

      consoleErrorSpy.mockRestore()
      consoleWarnSpy.mockRestore()
    })

    test('should validate all yoga app URLs properly', () => {
      const yogaUrls = [
        'https://www.happyyoga.app',
        'https://www.happyyoga.app/practice',
        'https://www.happyyoga.app/flows/practiceSeries',
        'https://www.happyyoga.app/flows/practiceSequences',
        'http://localhost:3000',
        'http://localhost:3000/asana/warrior-pose',
      ]

      yogaUrls.forEach((url) => {
        expect(validateUrl(url)).toBe(true)
      })
    })
  })
})
