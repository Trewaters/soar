/**
 * Vercel Blob Storage Provider
 * Implements the StorageProvider interface for Vercel Blob
 */

import { put, del, list } from '@vercel/blob'
import type {
  StorageProvider,
  StorageUploadResult,
  StorageUploadOptions,
  StorageDeleteOptions,
  StorageListOptions,
  StorageListResult,
} from '../types'
import { StorageProviderError } from '../types'

export class VercelBlobProvider implements StorageProvider {
  readonly name = 'vercel-blob'
  readonly version = '1.0.0'

  async upload(
    fileName: string,
    file: File | Blob | Buffer,
    options: StorageUploadOptions = { access: 'public' }
  ): Promise<StorageUploadResult> {
    try {
      // Construct full file path with folder if specified
      const fullFileName = options.folder
        ? `${options.folder}/${fileName}`
        : fileName

      const blob = await put(fullFileName, file, {
        access: 'public', // Vercel Blob only supports public access
        addRandomSuffix: options.addRandomSuffix ?? true,
        ...(options.cacheControlMaxAge && {
          cacheControlMaxAge: options.cacheControlMaxAge,
        }),
      })

      return {
        url: blob.url,
        id: blob.pathname, // Vercel Blob uses pathname as identifier
        fileName: blob.pathname.split('/').pop() || fileName,
        size:
          file instanceof File
            ? file.size
            : file instanceof Blob
              ? file.size
              : Buffer.isBuffer(file)
                ? file.length
                : 0,
        metadata: {
          pathname: blob.pathname,
          downloadUrl: blob.downloadUrl,
        },
      }
    } catch (error: any) {
      throw new StorageProviderError('Vercel Blob upload failed', {
        code: error.code,
        status: error.status,
        canFallbackToLocal: true,
        details:
          'Upload to Vercel Blob failed. You can save this image locally instead.',
        originalError: error,
      })
    }
  }

  async delete(
    fileId: string,
    options: StorageDeleteOptions = {}
  ): Promise<void> {
    try {
      // fileId can be either the full URL or just the pathname
      const urlToDelete = fileId.startsWith('http') ? fileId : fileId
      await del(urlToDelete)
    } catch (error: any) {
      if (!options.force) {
        throw new StorageProviderError('Vercel Blob delete failed', {
          code: error.code,
          status: error.status,
          details: `Failed to delete file: ${fileId}`,
          originalError: error,
        })
      }
      // If force=true, ignore errors (file might not exist)
    }
  }

  async list(options: StorageListOptions = {}): Promise<StorageListResult> {
    try {
      const result = await list({
        limit: options.limit,
        cursor: options.cursor,
        prefix: options.prefix,
      })

      return {
        files: result.blobs.map((blob) => ({
          url: blob.url,
          id: blob.pathname,
          fileName: blob.pathname.split('/').pop() || blob.pathname,
          size: blob.size,
          uploadedAt: blob.uploadedAt,
          metadata: {
            pathname: blob.pathname,
            downloadUrl: blob.downloadUrl,
          },
        })),
        nextCursor: result.cursor,
        hasMore: result.hasMore,
      }
    } catch (error: any) {
      throw new StorageProviderError('Vercel Blob list failed', {
        code: error.code,
        status: error.status,
        details: 'Failed to list files from Vercel Blob',
        originalError: error,
      })
    }
  }

  async getFileInfo(fileId: string) {
    // Vercel Blob doesn't have a direct "get info" API
    // We can try to list with the specific prefix
    try {
      const result = await this.list({ prefix: fileId, limit: 1 })
      const file = result.files.find((f) => f.id === fileId || f.url === fileId)

      if (!file) {
        throw new Error('File not found')
      }

      return file
    } catch (error: any) {
      throw new StorageProviderError('Vercel Blob file info failed', {
        code: error.code,
        status: error.status,
        details: `Failed to get file info for: ${fileId}`,
        originalError: error,
      })
    }
  }

  async isConfigured(): Promise<boolean> {
    try {
      // Test configuration by attempting a simple list operation
      await this.list({ limit: 1 })
      return true
    } catch (error) {
      return false
    }
  }

  getConfigStatus() {
    const hasToken = !!process.env.BLOB_READ_WRITE_TOKEN

    return {
      configured: hasToken,
      missingConfig: hasToken ? [] : ['BLOB_READ_WRITE_TOKEN'],
      provider: this.name,
    }
  }
}

// Export singleton instance
export const vercelBlobProvider = new VercelBlobProvider()
