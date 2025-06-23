/**
 * Storage Manager - Central interface for managing different storage providers
 * Allows easy switching between cloud storage solutions
 */

import type { StorageProvider } from './types'
import { vercelBlobProvider } from './providers/vercel-blob'
import { cloudflareImagesProvider } from './providers/cloudflare-images'

// Available storage providers
export const STORAGE_PROVIDERS = {
  'vercel-blob': vercelBlobProvider,
  'cloudflare-images': cloudflareImagesProvider,
} as const

export type StorageProviderName = keyof typeof STORAGE_PROVIDERS

// Configuration interface
export interface StorageConfig {
  /** Primary storage provider to use */
  primaryProvider: StorageProviderName
  /** Fallback provider if primary fails (optional) */
  fallbackProvider?: StorageProviderName
  /** Whether to enable automatic provider switching */
  autoSwitchOnFailure?: boolean
  /** Retry configuration */
  retries?: {
    maxAttempts: number
    delayMs: number
  }
}

// Default configuration
const DEFAULT_CONFIG: StorageConfig = {
  primaryProvider: 'vercel-blob', // Default to Vercel Blob
  autoSwitchOnFailure: true,
  retries: {
    maxAttempts: 2,
    delayMs: 1000,
  },
}

export class StorageManager {
  private config: StorageConfig
  private activeProvider: StorageProvider

  constructor(config: Partial<StorageConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
    this.activeProvider = STORAGE_PROVIDERS[this.config.primaryProvider]
  }

  /**
   * Get the currently active storage provider
   */
  getActiveProvider(): StorageProvider {
    return this.activeProvider
  }

  /**
   * Get a specific storage provider by name
   */
  getProvider(name: StorageProviderName): StorageProvider {
    return STORAGE_PROVIDERS[name]
  }

  /**
   * Switch to a different storage provider
   */
  switchProvider(name: StorageProviderName): void {
    this.activeProvider = STORAGE_PROVIDERS[name]
    this.config.primaryProvider = name
  }

  /**
   * Upload file with automatic fallback handling
   */
  async upload(
    fileName: string,
    file: File | Blob | Buffer,
    options: Parameters<StorageProvider['upload']>[2] = { access: 'public' }
  ) {
    let lastError: Error | null = null

    // Try primary provider
    try {
      return await this.activeProvider.upload(fileName, file, options)
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error))
      console.warn(
        `Primary provider (${this.activeProvider.name}) failed:`,
        error
      )
    }

    // Try fallback provider if configured and auto-switch is enabled
    if (
      this.config.fallbackProvider &&
      this.config.autoSwitchOnFailure &&
      this.config.fallbackProvider !== this.config.primaryProvider
    ) {
      try {
        const fallbackProvider = STORAGE_PROVIDERS[this.config.fallbackProvider]
        console.log(`Attempting fallback to ${fallbackProvider.name}...`)

        const result = await fallbackProvider.upload(fileName, file, options)

        // Switch to fallback provider for future uploads
        this.switchProvider(this.config.fallbackProvider)
        console.log(`Switched to fallback provider: ${fallbackProvider.name}`)

        return result
      } catch (fallbackError) {
        console.warn(`Fallback provider also failed:`, fallbackError)
      }
    }

    // If we get here, all providers failed
    throw lastError || new Error('All storage providers failed')
  }

  /**
   * Delete file from active provider
   */
  async delete(
    fileId: string,
    options: Parameters<StorageProvider['delete']>[1] = {}
  ) {
    return this.activeProvider.delete(fileId, options)
  }

  /**
   * List files from active provider
   */
  async list(options: Parameters<StorageProvider['list']>[0] = {}) {
    return this.activeProvider.list(options)
  }

  /**
   * Get file info from active provider
   */
  async getFileInfo(fileId: string) {
    if (this.activeProvider.getFileInfo) {
      return this.activeProvider.getFileInfo(fileId)
    }
    throw new Error(
      `Provider ${this.activeProvider.name} does not support getFileInfo`
    )
  }

  /**
   * Check configuration status of all providers
   */
  async getConfigurationStatus() {
    const status: Record<string, any> = {}

    for (const [name, provider] of Object.entries(STORAGE_PROVIDERS)) {
      status[name] = {
        ...provider.getConfigStatus(),
        isReady: await provider.isConfigured(),
      }
    }

    return {
      activeProvider: this.activeProvider.name,
      config: this.config,
      providers: status,
    }
  }

  /**
   * Automatically detect and configure the best available provider
   */
  async autoConfigureProvider(): Promise<StorageProviderName | null> {
    console.log('Auto-configuring storage provider...')

    // Check providers in order of preference
    const preferenceOrder: StorageProviderName[] = [
      'vercel-blob',
      'cloudflare-images',
    ]

    for (const providerName of preferenceOrder) {
      const provider = STORAGE_PROVIDERS[providerName]
      const isConfigured = await provider.isConfigured()

      if (isConfigured) {
        console.log(`✅ Auto-configured provider: ${providerName}`)
        this.switchProvider(providerName)
        return providerName
      } else {
        const status = provider.getConfigStatus()
        console.log(`❌ ${providerName} not configured:`, status.missingConfig)
      }
    }

    console.warn('⚠️  No storage providers are properly configured')
    return null
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<StorageConfig>): void {
    this.config = { ...this.config, ...config }

    // Switch provider if primary changed
    if (
      config.primaryProvider &&
      config.primaryProvider !== this.activeProvider.name
    ) {
      this.switchProvider(config.primaryProvider)
    }
  }

  /**
   * Get current configuration
   */
  getConfig(): StorageConfig {
    return { ...this.config }
  }
}

// Export singleton instance with environment-based configuration
const getDefaultProvider = (): StorageProviderName => {
  // Auto-detect based on environment variables
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    return 'vercel-blob'
  }
  if (process.env.CLOUDFLARE_ACCOUNT_ID && process.env.CLOUDFLARE_API_TOKEN) {
    return 'cloudflare-images'
  }

  // Default fallback
  return 'vercel-blob'
}

export const storageManager = new StorageManager({
  primaryProvider: getDefaultProvider(),
  fallbackProvider:
    getDefaultProvider() === 'vercel-blob'
      ? 'cloudflare-images'
      : 'vercel-blob',
  autoSwitchOnFailure: true,
})

// Initialize auto-configuration on import
storageManager.autoConfigureProvider().catch(console.error)
