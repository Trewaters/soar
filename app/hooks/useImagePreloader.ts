import { useState, useEffect, useCallback, useRef } from 'react'

interface UseImagePreloaderOptions {
  images: string[]
  currentIndex: number
  preloadCount?: number
}

interface UseImagePreloaderReturn {
  preloadedImages: Set<string>
  // eslint-disable-next-line no-unused-vars
  isImageLoaded: (url: string) => boolean
  // eslint-disable-next-line no-unused-vars
  preloadImage: (url: string) => Promise<void>
  // eslint-disable-next-line no-unused-vars
  getOptimizedSizes: (index: number) => string
  // eslint-disable-next-line no-unused-vars
  getLoadingPriority: (index: number) => 'high' | 'low' | 'auto'
}

/**
 * Custom hook for optimized image preloading in carousels
 * Preloads adjacent images and manages loading states efficiently
 */
export const useImagePreloader = ({
  images,
  currentIndex,
  preloadCount = 2,
}: UseImagePreloaderOptions): UseImagePreloaderReturn => {
  const [preloadedImages, setPreloadedImages] = useState<Set<string>>(new Set())
  const imageCache = useRef<{ [key: string]: HTMLImageElement }>({})
  const loadingPromises = useRef<{ [key: string]: Promise<void> }>({})

  const preloadImage = useCallback(
    (url: string): Promise<void> => {
      if (preloadedImages.has(url)) {
        return Promise.resolve()
      }

      if (loadingPromises.current[url] !== undefined) {
        return loadingPromises.current[url]
      }

      const promise = new Promise<void>((resolve, reject) => {
        if (imageCache.current[url]) {
          setPreloadedImages((prev) => new Set([...prev, url]))
          resolve()
          return
        }

        const img = new Image()
        img.onload = () => {
          imageCache.current[url] = img
          setPreloadedImages((prev) => new Set([...prev, url]))
          delete loadingPromises.current[url]
          resolve()
        }
        img.onerror = () => {
          delete loadingPromises.current[url]
          reject(new Error(`Failed to load image: ${url}`))
        }
        img.src = url
      })

      loadingPromises.current[url] = promise
      return promise
    },
    [preloadedImages]
  )

  const isImageLoaded = useCallback(
    (url: string): boolean => {
      return preloadedImages.has(url)
    },
    [preloadedImages]
  )

  const getOptimizedSizes = useCallback(
    (index: number): string => {
      const isVisible = index === currentIndex
      const isAdjacent = Math.abs(index - currentIndex) <= 1

      if (isVisible) {
        return '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
      } else if (isAdjacent) {
        return '(max-width: 768px) 50vw, 25vw'
      } else {
        return '200px'
      }
    },
    [currentIndex]
  )

  const getLoadingPriority = useCallback(
    (index: number): 'high' | 'low' | 'auto' => {
      if (index === currentIndex) return 'high'
      if (Math.abs(index - currentIndex) <= 1) return 'auto'
      return 'low'
    },
    [currentIndex]
  )

  // Preload adjacent images when currentIndex changes
  useEffect(() => {
    const imagesToPreload: string[] = []

    // Calculate which images to preload based on current index
    for (let i = -preloadCount; i <= preloadCount; i++) {
      const targetIndex = currentIndex + i
      if (
        targetIndex >= 0 &&
        targetIndex < images.length &&
        targetIndex !== currentIndex
      ) {
        imagesToPreload.push(images[targetIndex])
      }
    }

    // Preload images in background
    imagesToPreload.forEach((url) => {
      if (url && !preloadedImages.has(url)) {
        preloadImage(url).catch((error) => {
          console.warn('Failed to preload image:', error)
        })
      }
    })
  }, [currentIndex, images, preloadCount, preloadImage, preloadedImages])

  // Cleanup on unmount
  useEffect(() => {
    // capture the current loading promises so the cleanup uses a stable snapshot
    const currentPromises = Object.values(loadingPromises.current)

    return () => {
      currentPromises.forEach((promise) => {
        promise.catch(() => {
          // Ignore errors during cleanup
        })
      })
    }
  }, [])

  return {
    preloadedImages,
    isImageLoaded,
    preloadImage,
    getOptimizedSizes,
    getLoadingPriority,
  }
}

export default useImagePreloader
