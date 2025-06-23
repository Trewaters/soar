/**
 * Cloudflare Images Storage Provider
 * Implements the StorageProvider interface for Cloudflare Images
 */

import type {
  StorageProvider,
  StorageUploadResult,
  StorageUploadOptions,
  StorageDeleteOptions,
  StorageListOptions,
  StorageListResult,
} from '../types'
import { StorageProviderError } from '../types'

export class CloudflareImagesProvider implements StorageProvider {
  readonly name = 'cloudflare-images'
  readonly version = '1.0.0'

  private get accountId() {
    return process.env.CLOUDFLARE_ACCOUNT_ID
  }

  private get apiToken() {
    return process.env.CLOUDFLARE_API_TOKEN
  }

  private get baseUrl() {
    return `https://api.cloudflare.com/client/v4/accounts/${this.accountId}/images/v1`
  }

  async upload(
    fileName: string,
    file: File | Blob | Buffer,
    options: StorageUploadOptions = { access: 'public' }
  ): Promise<StorageUploadResult> {
    try {
      const formData = new FormData()

      // Convert Buffer to Blob if needed
      let fileToUpload: File | Blob
      if (Buffer.isBuffer(file)) {
        fileToUpload = new Blob([new Uint8Array(file)])
      } else {
        fileToUpload = file
      }

      // Add file with proper name
      const finalFileName = options.addRandomSuffix
        ? this.addRandomSuffix(fileName)
        : fileName

      formData.append('file', fileToUpload, finalFileName)

      // Add metadata if provided
      if (options.folder) {
        formData.append('metadata', JSON.stringify({ folder: options.folder }))
      }

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiToken}`,
        },
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Cloudflare API Error: ${JSON.stringify(errorData)}`)
      }

      const data = await response.json()
      const result = data.result

      return {
        url: result.variants[0] || result.url, // Use first variant or fallback to original
        id: result.id,
        fileName: finalFileName,
        size:
          file instanceof File
            ? file.size
            : file instanceof Blob
              ? file.size
              : Buffer.isBuffer(file)
                ? file.length
                : 0,
        metadata: {
          cloudflareId: result.id,
          variants: result.variants,
          originalUrl: result.url,
        },
      }
    } catch (error: any) {
      const isPermissionError =
        error.message?.includes('5403') ||
        error.message?.includes('Permission denied')

      throw new StorageProviderError('Cloudflare Images upload failed', {
        code: error.code || (isPermissionError ? 5403 : 'UPLOAD_FAILED'),
        status: error.status,
        canFallbackToLocal: true,
        details: isPermissionError
          ? 'Cloudflare API token needs "Account:Cloudflare Images:Edit" permission.'
          : 'Upload to Cloudflare Images failed. You can save this image locally instead.',
        originalError: error,
      })
    }
  }

  async delete(
    fileId: string,
    options: StorageDeleteOptions = {}
  ): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${fileId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${this.apiToken}`,
        },
      })

      if (!response.ok && !options.force) {
        const errorData = await response.json()
        throw new Error(`Cloudflare API Error: ${JSON.stringify(errorData)}`)
      }
    } catch (error: any) {
      if (!options.force) {
        throw new StorageProviderError('Cloudflare Images delete failed', {
          code: error.code,
          status: error.status,
          details: `Failed to delete file: ${fileId}`,
          originalError: error,
        })
      }
    }
  }

  async list(options: StorageListOptions = {}): Promise<StorageListResult> {
    try {
      const params = new URLSearchParams()

      if (options.limit) params.append('per_page', options.limit.toString())
      if (options.cursor) params.append('continuation_token', options.cursor)

      const response = await fetch(`${this.baseUrl}?${params}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.apiToken}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Cloudflare API Error: ${JSON.stringify(errorData)}`)
      }

      const data = await response.json()
      const images = data.result.images || []

      return {
        files: images
          .filter((img: any) => {
            // Filter by prefix if specified
            if (options.prefix) {
              return (
                img.filename?.startsWith(options.prefix) ||
                img.id?.startsWith(options.prefix)
              )
            }
            return true
          })
          .map((img: any) => ({
            url: img.variants?.[0] || img.url,
            id: img.id,
            fileName: img.filename || img.id,
            size: 0, // Cloudflare doesn't provide size in list API
            uploadedAt: new Date(img.uploaded),
            metadata: {
              cloudflareId: img.id,
              variants: img.variants,
              originalUrl: img.url,
            },
          })),
        nextCursor: data.result.continuation_token,
        hasMore: !!data.result.continuation_token,
      }
    } catch (error: any) {
      throw new StorageProviderError('Cloudflare Images list failed', {
        code: error.code,
        status: error.status,
        details: 'Failed to list files from Cloudflare Images',
        originalError: error,
      })
    }
  }

  async getFileInfo(fileId: string) {
    try {
      const response = await fetch(`${this.baseUrl}/${fileId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.apiToken}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`Cloudflare API Error: ${JSON.stringify(errorData)}`)
      }

      const data = await response.json()
      const img = data.result

      return {
        url: img.variants?.[0] || img.url,
        id: img.id,
        fileName: img.filename || img.id,
        size: 0, // Cloudflare doesn't provide size
        uploadedAt: new Date(img.uploaded),
        metadata: {
          cloudflareId: img.id,
          variants: img.variants,
          originalUrl: img.url,
        },
      }
    } catch (error: any) {
      throw new StorageProviderError('Cloudflare Images file info failed', {
        code: error.code,
        status: error.status,
        details: `Failed to get file info for: ${fileId}`,
        originalError: error,
      })
    }
  }

  async isConfigured(): Promise<boolean> {
    try {
      // Test configuration by attempting to list images
      await this.list({ limit: 1 })
      return true
    } catch (error) {
      return false
    }
  }

  getConfigStatus() {
    const hasAccountId = !!this.accountId
    const hasApiToken = !!this.apiToken
    const missingConfig = []

    if (!hasAccountId) missingConfig.push('CLOUDFLARE_ACCOUNT_ID')
    if (!hasApiToken) missingConfig.push('CLOUDFLARE_API_TOKEN')

    return {
      configured: hasAccountId && hasApiToken,
      missingConfig,
      provider: this.name,
    }
  }

  private addRandomSuffix(fileName: string): string {
    const lastDotIndex = fileName.lastIndexOf('.')
    const name =
      lastDotIndex > 0 ? fileName.substring(0, lastDotIndex) : fileName
    const extension = lastDotIndex > 0 ? fileName.substring(lastDotIndex) : ''
    const randomSuffix = Math.random().toString(36).substring(2, 15)

    return `${name}-${randomSuffix}${extension}`
  }
}

// Export singleton instance
export const cloudflareImagesProvider = new CloudflareImagesProvider()
