/**
 * Local Storage Service for managing offline images
 * Handles storing, retrieving, and managing images in browser storage
 * when API is unavailable
 */

interface LocalImageData {
  id: string
  dataUrl: string // Base64 encoded image data
  fileName: string
  fileSize: number
  altText?: string
  uploadedAt: string
  userId: string
}

interface LocalStorageInfo {
  used: number
  available: number
  quota: number
}

export class LocalImageStorage {
  private readonly DB_NAME = 'YogaAppImages'
  private readonly DB_VERSION = 1
  private readonly STORE_NAME = 'images'
  private db: IDBDatabase | null = null

  /**
   * Initialize IndexedDB for image storage
   */
  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          const store = db.createObjectStore(this.STORE_NAME, { keyPath: 'id' })
          store.createIndex('userId', 'userId', { unique: false })
          store.createIndex('uploadedAt', 'uploadedAt', { unique: false })
        }
      }
    })
  }

  /**
   * Store an image locally
   */
  async storeImage(
    file: File,
    userId: string,
    altText?: string
  ): Promise<LocalImageData> {
    if (!this.db) await this.init()

    const id = `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const dataUrl = await this.fileToDataUrl(file)

    const imageData: LocalImageData = {
      id,
      dataUrl,
      fileName: file.name,
      fileSize: file.size,
      altText,
      uploadedAt: new Date().toISOString(),
      userId,
    }

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'))
        return
      }

      const transaction = this.db.transaction([this.STORE_NAME], 'readwrite')
      const store = transaction.objectStore(this.STORE_NAME)
      const request = store.add(imageData)

      request.onsuccess = () => resolve(imageData)
      request.onerror = () => reject(request.error)
    })
  }

  /**
   * Retrieve a specific image by ID
   */
  async getImage(id: string): Promise<LocalImageData | null> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'))
        return
      }

      const transaction = this.db.transaction([this.STORE_NAME], 'readonly')
      const store = transaction.objectStore(this.STORE_NAME)
      const request = store.get(id)

      request.onsuccess = () => resolve(request.result || null)
      request.onerror = () => reject(request.error)
    })
  }

  /**
   * Get all images for a user
   */
  async getUserImages(userId: string): Promise<LocalImageData[]> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'))
        return
      }

      const transaction = this.db.transaction([this.STORE_NAME], 'readonly')
      const store = transaction.objectStore(this.STORE_NAME)
      const index = store.index('userId')
      const request = index.getAll(userId)

      request.onsuccess = () => {
        const images = request.result.sort(
          (a, b) =>
            new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
        )
        resolve(images)
      }
      request.onerror = () => reject(request.error)
    })
  }

  /**
   * Delete an image from local storage
   */
  async deleteImage(id: string): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'))
        return
      }

      const transaction = this.db.transaction([this.STORE_NAME], 'readwrite')
      const store = transaction.objectStore(this.STORE_NAME)
      const request = store.delete(id)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  /**
   * Get storage usage information
   */
  async getStorageInfo(): Promise<LocalStorageInfo> {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate()
      return {
        used: estimate.usage || 0,
        quota: estimate.quota || 0,
        available: (estimate.quota || 0) - (estimate.usage || 0),
      }
    }

    // Fallback for browsers without storage API
    return {
      used: 0,
      quota: 0,
      available: 0,
    }
  }

  /**
   * Check if there's enough space for an image
   */
  async hasSpaceFor(fileSize: number): Promise<boolean> {
    const info = await this.getStorageInfo()
    if (info.quota === 0) return true // Unknown quota, assume available

    // Reserve 10MB buffer
    const buffer = 10 * 1024 * 1024
    return info.available > fileSize + buffer
  }

  /**
   * Convert File to data URL
   */
  private fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = () => reject(reader.error)
      reader.readAsDataURL(file)
    })
  }

  /**
   * Clear all local images (for cleanup)
   */
  async clearAllImages(): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      if (!this.db) {
        reject(new Error('Database not initialized'))
        return
      }

      const transaction = this.db.transaction([this.STORE_NAME], 'readwrite')
      const store = transaction.objectStore(this.STORE_NAME)
      const request = store.clear()

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  /**
   * Try to sync local images to cloud when API becomes available
   */
  async syncToCloud(userId: string): Promise<{
    synced: number
    failed: string[]
  }> {
    const localImages = await this.getUserImages(userId)
    const results = { synced: 0, failed: [] as string[] }

    for (const localImage of localImages) {
      try {
        // Convert data URL back to File
        const response = await fetch(localImage.dataUrl)
        const blob = await response.blob()
        const file = new File([blob], localImage.fileName, { type: blob.type })

        // Try to upload to cloud
        const formData = new FormData()
        formData.append('file', file)
        formData.append('userId', userId)
        if (localImage.altText) {
          formData.append('altText', localImage.altText)
        }
        formData.append('localStorageId', localImage.id)

        const uploadResponse = await fetch('/api/images/upload', {
          method: 'POST',
          body: formData,
        })

        if (uploadResponse.ok) {
          // Successfully synced, remove from local storage
          await this.deleteImage(localImage.id)
          results.synced++
        } else {
          results.failed.push(localImage.id)
        }
      } catch (error) {
        console.error('Failed to sync image:', localImage.id, error)
        results.failed.push(localImage.id)
      }
    }

    return results
  }
}

// Export singleton instance
export const localImageStorage = new LocalImageStorage()

// Helper functions for React components
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export const isLocalImageId = (id: string): boolean => {
  return id.startsWith('local_')
}

export type { LocalImageData, LocalStorageInfo }
