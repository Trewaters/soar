/* eslint-disable no-unused-vars */
/**
 * Common interfaces for storage providers
 * Allows easy switching between cloud storage solutions
 */

export interface StorageUploadResult {
  /** Public URL to access the uploaded file */
  url: string
  /** Unique identifier for the uploaded file (provider-specific) */
  id: string
  /** File name as stored in the provider */
  fileName: string
  /** File size in bytes */
  size: number
  /** Provider-specific metadata */
  metadata?: Record<string, any>
}

export interface StorageUploadOptions {
  /** Whether the file should be publicly accessible */
  access: 'public' | 'private'
  /** Add random suffix to filename to prevent collisions */
  addRandomSuffix?: boolean
  /** Allow overwriting existing files with same name */
  allowOverwrite?: boolean
  /** Custom cache control max age in seconds */
  cacheControlMaxAge?: number
  /** Custom folder/prefix for organization */
  folder?: string
}

export interface StorageDeleteOptions {
  /** Force delete even if file doesn't exist */
  force?: boolean
}

export interface StorageListOptions {
  /** Maximum number of files to return */
  limit?: number
  /** Cursor for pagination */
  cursor?: string
  /** Filter by prefix/folder */
  prefix?: string
}

export interface StorageListResult {
  /** Array of file information */
  files: Array<{
    url: string
    id: string
    fileName: string
    size: number
    uploadedAt: Date
    metadata?: Record<string, any>
  }>
  /** Cursor for next page (if available) */
  nextCursor?: string
  /** Whether there are more files available */
  hasMore: boolean
  /** Total count (if available) */
  totalCount?: number
}

export interface StorageProvider {
  /** Provider name for identification */
  readonly name: string
  /** Provider version/identifier */
  readonly version: string

  /**
   * Upload a file to storage
   * @param fileName - Name for the file
   * @param file - File data (File, Blob, or Buffer)
   * @param options - Upload configuration
   * @returns Promise with upload result
   */
  upload(
    fileName: string,
    file: File | Blob | Buffer,
    options?: StorageUploadOptions
  ): Promise<StorageUploadResult>

  /**
   * Delete a file from storage
   * @param fileId - File identifier or URL
   * @param options - Delete configuration
   * @returns Promise that resolves when deleted
   */
  delete(fileId: string, options?: StorageDeleteOptions): Promise<void>

  /**
   * List files in storage
   * @param options - List configuration
   * @returns Promise with list result
   */
  list(options?: StorageListOptions): Promise<StorageListResult>

  /**
   * Get file metadata/info
   * @param fileId - File identifier or URL
   * @returns Promise with file info
   */
  getFileInfo?(fileId: string): Promise<{
    url: string
    id: string
    fileName: string
    size: number
    uploadedAt: Date
    metadata?: Record<string, any>
  }>

  /**
   * Check if provider is properly configured
   * @returns Promise<boolean> indicating readiness
   */
  isConfigured(): Promise<boolean>

  /**
   * Get provider configuration status
   * @returns Configuration info for debugging
   */
  getConfigStatus(): {
    configured: boolean
    missingConfig?: string[]
    provider: string
  }
}

export interface StorageError extends Error {
  /** Error code from the storage provider */
  code?: string | number
  /** HTTP status code if applicable */
  status?: number
  /** Whether this error allows fallback to local storage */
  canFallbackToLocal?: boolean
  /** Additional error details */
  details?: string
  /** Original provider error */
  originalError?: any
}

export class StorageProviderError extends Error implements StorageError {
  code?: string | number
  status?: number
  canFallbackToLocal?: boolean
  details?: string
  originalError?: any

  constructor(
    message: string,
    options: {
      code?: string | number
      status?: number
      canFallbackToLocal?: boolean
      details?: string
      originalError?: any
    } = {}
  ) {
    super(message)
    this.name = 'StorageProviderError'
    this.code = options.code
    this.status = options.status
    this.canFallbackToLocal = options.canFallbackToLocal
    this.details = options.details
    this.originalError = options.originalError
  }
}
