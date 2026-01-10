/**
 * Storage Manager - Interface for Vercel Blob storage
 */

import type { StorageProvider } from './types'
import { vercelBlobProvider } from './providers/vercel-blob'

// Available storage providers
export const STORAGE_PROVIDERS = {
  'vercel-blob': vercelBlobProvider,
} as const

export type StorageProviderName = keyof typeof STORAGE_PROVIDERS

// Configuration interface
export interface StorageConfig {
  /** Primary storage provider to use */
  primaryProvider: StorageProviderName
  /** Retry configuration */
  retries?: {
    maxAttempts: number
    delayMs: number
  }
}

// Default configuration
const DEFAULT_CONFIG: StorageConfig = {
  primaryProvider: 'vercel-blob', // Only Vercel Blob supported
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
   * Upload file with Vercel Blob storage
   */
  async upload(
    fileName: string,
    file: File | Blob | Buffer,
    options: Parameters<StorageProvider['upload']>[2] = { access: 'public' }
  ) {
    try {
      return await this.activeProvider.upload(fileName, file, options)
    } catch (error) {
      const lastError =
        error instanceof Error ? error : new Error(String(error))
      console.error(`Vercel Blob upload failed for ${fileName}:`, error)
      throw lastError
    }
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
   * Automatically detect and configure Vercel Blob provider
   */
  async autoConfigureProvider(): Promise<StorageProviderName | null> {
    const provider = STORAGE_PROVIDERS['vercel-blob']
    const isConfigured = await provider.isConfigured()

    if (isConfigured) {
      this.switchProvider('vercel-blob')
      return 'vercel-blob'
    } else {
      const status = provider.getConfigStatus()
      console.log('❌ Vercel Blob not configured:', status.missingConfig)
    }

    console.warn('⚠️  Vercel Blob storage provider not properly configured')
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

// Export singleton instance with Vercel Blob configuration
const getDefaultProvider = (): StorageProviderName => {
  // Always use Vercel Blob
  return 'vercel-blob'
}

export const storageManager = new StorageManager({
  primaryProvider: getDefaultProvider(),
})

// Initialize auto-configuration on import
storageManager.autoConfigureProvider().catch(console.error)
