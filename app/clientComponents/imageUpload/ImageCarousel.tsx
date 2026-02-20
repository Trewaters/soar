/* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars */
'use client'
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import {
  Box,
  IconButton,
  Card,
  CardMedia,
  Typography,
  Fade,
  Skeleton,
} from '@mui/material'
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material'
import Image from 'next/image'
import { PoseImageData } from '../../../types/images'
import { useImagePreloader } from '../../hooks/useImagePreloader'

export interface ImageCarouselProps {
  images: PoseImageData[]
  currentIndex?: number
  onIndexChange?: (newIndex: number) => void
  autoPlay?: boolean
  autoPlayInterval?: number
  showArrows?: boolean
  height?: number | string
  className?: string
  'aria-label'?: string
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images = [],
  currentIndex = 0,
  onIndexChange,
  autoPlay = false,
  autoPlayInterval = 5000,
  showArrows = true,
  height = 400,
  className,
  'aria-label': ariaLabel = 'Image carousel for yoga pose',
}) => {
  const [activeIndex, setActiveIndex] = useState(currentIndex)
  const [isLoading, setIsLoading] = useState(true)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [failedImageIds, setFailedImageIds] = useState<Set<string>>(new Set())

  // Memoize sorted images to avoid re-sorting on every render
  const sortedImages = useMemo(
    () => [...images].sort((a, b) => a.displayOrder - b.displayOrder),
    [images]
  )

  const totalImages = sortedImages.length

  // Use optimized image preloader hook
  const imageUrls = useMemo(
    () => sortedImages.map((img) => img.url),
    [sortedImages]
  )
  const { getOptimizedSizes, getLoadingPriority } = useImagePreloader({
    images: imageUrls,
    currentIndex: activeIndex,
    preloadCount: 1, // Preload 1 image on each side
  })

  // Handle index changes and notify parent component
  const handleIndexChange = useCallback(
    (newIndex: number) => {
      if (totalImages === 0) {
        setActiveIndex(0)
        setIsLoading(false)
        return
      }

      // Clamp the index to valid range
      const clampedIndex = Math.max(0, Math.min(newIndex, totalImages - 1))
      if (clampedIndex !== activeIndex) {
        setActiveIndex(clampedIndex)
        setIsLoading(true) // Trigger loading state for new image
        onIndexChange?.(clampedIndex)
      }
    },
    [totalImages, onIndexChange, activeIndex]
  )

  // Navigate to previous image
  const goToPrevious = useCallback(() => {
    const newIndex = activeIndex === 0 ? totalImages - 1 : activeIndex - 1
    handleIndexChange(newIndex)
  }, [activeIndex, totalImages, handleIndexChange])

  // Navigate to next image
  const goToNext = useCallback(() => {
    const newIndex = activeIndex === totalImages - 1 ? 0 : activeIndex + 1
    handleIndexChange(newIndex)
  }, [activeIndex, totalImages, handleIndexChange])

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault()
          goToPrevious()
          break
        case 'ArrowRight':
          event.preventDefault()
          goToNext()
          break
        case 'Home':
          event.preventDefault()
          handleIndexChange(0)
          break
        case 'End':
          event.preventDefault()
          handleIndexChange(totalImages - 1)
          break
      }
    },
    [goToPrevious, goToNext, handleIndexChange, totalImages]
  )

  // Touch gesture handling for mobile
  const handleTouchStart = (event: React.TouchEvent) => {
    setTouchStart(event.targetTouches[0].clientX)
  }

  const handleTouchMove = () => {
    // We don't need to track the move position anymore
    // The final position is captured in handleTouchEnd
  }

  const handleTouchEnd = (event: React.TouchEvent) => {
    if (!touchStart) return

    // Get the final touch position from the touchEnd event
    const finalTouchEnd = event.changedTouches[0].clientX
    const distance = touchStart - finalTouchEnd
    const isSwipeLeft = distance > 50
    const isSwipeRight = distance < -50

    if (isSwipeLeft) {
      goToNext()
    } else if (isSwipeRight) {
      goToPrevious()
    }
  }

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay || totalImages <= 1 || isPaused) return

    const interval = setInterval(() => {
      goToNext()
    }, autoPlayInterval)

    return () => clearInterval(interval)
  }, [autoPlay, autoPlayInterval, goToNext, totalImages, isPaused])

  // Sync with external currentIndex prop
  useEffect(() => {
    if (totalImages === 0) {
      setActiveIndex(0)
      setIsLoading(false)
      return
    }

    // Always clamp the current index to the valid range if images changed or prop changed
    const clampedIndex = Math.max(0, Math.min(currentIndex, totalImages - 1))

    if (clampedIndex !== activeIndex) {
      setActiveIndex(clampedIndex)
      setIsLoading(true) // Trigger loading state for new image
    }
  }, [currentIndex, activeIndex, totalImages])

  // Handle image loading
  const handleImageLoad = () => {
    setIsLoading(false)
  }

  // Handle image load error - track failed image IDs
  const handleImageError = (imageId: string) => {
    setFailedImageIds((prev) => new Set([...prev, imageId]))
    setIsLoading(false)
  }

  // Handle hover for auto-play pause
  const handleMouseEnter = () => {
    setIsPaused(true)
  }

  const handleMouseLeave = () => {
    setIsPaused(false)
  }

  // Don't render if no images
  if (totalImages === 0) {
    return (
      <Box
        sx={{
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'grey.100',
          borderRadius: 1,
        }}
        className={className}
      >
        <Typography variant="body2" color="text.secondary">
          No images available
        </Typography>
      </Box>
    )
  }

  // Safely get current image with bounds checking
  const currentImage = sortedImages[activeIndex] || null
  const safeActiveIndex = Math.max(0, Math.min(activeIndex, totalImages - 1))

  // Check if current image failed to load
  const isCurrentImageFailed =
    currentImage?.id && failedImageIds.has(currentImage.id)

  // Don't render image if currentImage is null (out of bounds)
  if (!currentImage) {
    return (
      <Box
        sx={{
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'grey.100',
          borderRadius: 1,
        }}
        className={className}
      >
        <Typography variant="body2" color="text.secondary">
          Image not available
        </Typography>
      </Box>
    )
  }

  // Validate image URL before rendering
  const isValidUrl =
    currentImage?.url &&
    typeof currentImage.url === 'string' &&
    (currentImage.url.startsWith('http://') ||
      currentImage.url.startsWith('https://') ||
      currentImage.url.startsWith('/') ||
      currentImage.url.startsWith('data:'))

  if (!isValidUrl) {
    console.error('Invalid image URL in ImageCarousel:', {
      url: currentImage?.url,
      poseId: currentImage?.poseId,
      poseName: currentImage?.poseName,
      imageId: currentImage?.id,
    })
    return (
      <Box
        sx={{
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'grey.100',
          borderRadius: 1,
        }}
        className={className}
      >
        <Typography variant="body2" color="error">
          Invalid image URL
        </Typography>
      </Box>
    )
  }

  return (
    <Box
      className={className}
      sx={{
        position: 'relative',
        width: '100%',
        height,
        overflow: 'hidden',
        borderRadius: 1,
        backgroundColor: 'background.paper',
      }}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      tabIndex={0}
      role="img"
      aria-label={`${ariaLabel}. Image ${safeActiveIndex + 1} of ${totalImages}. ${currentImage?.altText || currentImage?.poseName || 'Yoga pose'}`}
      aria-live="polite"
    >
      {/* Main Image Display */}
      <Box
        sx={{
          height: '100%',
          width: '100%',
          position: 'relative',
          borderRadius: 1,
          backgroundColor: 'grey.50',
        }}
      >
        {/* Show error state when image fails to load */}
        {isCurrentImageFailed ? (
          <Box
            sx={{
              height: '100%',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'grey.100',
              borderRadius: 1,
              p: 3,
              textAlign: 'center',
            }}
          >
            <Box
              sx={{
                fontSize: '48px',
                mb: 2,
                opacity: 0.5,
              }}
            >
              🖼️
            </Box>
            <Typography variant="subtitle1" color="error" sx={{ mb: 1 }}>
              Image could not be loaded
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              The image file for &quot;
              {currentImage?.poseName || currentImage?.altText || 'this pose'}
              &quot; is no longer available.
            </Typography>
            {totalImages > 1 && (
              <Typography variant="caption" color="text.secondary">
                Showing image {safeActiveIndex + 1} of {totalImages}
              </Typography>
            )}
          </Box>
        ) : (
          <Fade in={!isLoading} timeout={300} key={safeActiveIndex}>
            <Card
              sx={{
                height: '100%',
                width: '100%',
                position: 'relative',
                boxShadow: 'none',
                borderRadius: 1,
                backgroundColor: 'transparent',
              }}
            >
              <CardMedia
                component="div"
                sx={{
                  height: '100%',
                  position: 'relative',
                  overflow: 'hidden',
                  backgroundColor: 'grey.100',
                }}
              >
                <Image
                  src={currentImage.url}
                  key={currentImage.id || currentImage.url}
                  alt={
                    currentImage?.altText ||
                    currentImage?.poseName ||
                    `Yoga pose ${safeActiveIndex + 1}`
                  }
                  fill
                  style={{
                    objectFit: 'contain',
                  }}
                  sizes={getOptimizedSizes(safeActiveIndex)}
                  onLoad={handleImageLoad}
                  onError={() => {
                    const imageId = currentImage?.id || currentImage?.url || ''
                    console.error('Image failed to load in ImageCarousel:', {
                      url: currentImage?.url,
                      poseId: currentImage?.poseId,
                      poseName: currentImage?.poseName,
                      imageId: currentImage?.id,
                    })
                    handleImageError(imageId)
                  }}
                  priority={getLoadingPriority(safeActiveIndex) === 'high'}
                  loading={
                    getLoadingPriority(safeActiveIndex) === 'high'
                      ? 'eager'
                      : 'lazy'
                  }
                  quality={
                    getLoadingPriority(safeActiveIndex) === 'high' ? 90 : 75
                  }
                  placeholder="empty"
                />
              </CardMedia>
            </Card>
          </Fade>
        )}
        {!isCurrentImageFailed && isLoading && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 1,
            }}
          >
            <Skeleton
              variant="rectangular"
              width="100%"
              height="100%"
              animation="wave"
            />
          </Box>
        )}
      </Box>

      {/* Navigation Arrows */}
      {showArrows && totalImages > 1 && (
        <>
          {/* Previous Arrow */}
          <IconButton
            onClick={goToPrevious}
            disabled={totalImages <= 1}
            sx={{
              position: 'absolute',
              left: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
              },
              '&:disabled': {
                display: 'none',
              },
              minWidth: 44,
              minHeight: 44,
              zIndex: 2,
            }}
            aria-label="Previous image"
          >
            <ChevronLeftIcon />
          </IconButton>

          {/* Next Arrow */}
          <IconButton
            onClick={goToNext}
            disabled={totalImages <= 1}
            sx={{
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
              },
              '&:disabled': {
                display: 'none',
              },
              minWidth: 44,
              minHeight: 44,
              zIndex: 2,
            }}
            aria-label="Next image"
          >
            <ChevronRightIcon />
          </IconButton>
        </>
      )}

      {/* Image Counter */}
      {totalImages > 1 && (
        <Box
          sx={{
            position: 'absolute',
            bottom: 8,
            right: 8,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            color: 'white',
            px: 1,
            py: 0.5,
            borderRadius: 1,
            typography: 'caption',
            minWidth: 'auto',
            zIndex: 2,
          }}
          aria-hidden="true"
        >
          {safeActiveIndex + 1} / {totalImages}
        </Box>
      )}

      {/* Loading indicator for subsequent images */}
      {isLoading && (
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 3,
          }}
        >
          <Skeleton variant="circular" width={40} height={40} />
        </Box>
      )}
    </Box>
  )
}

export default ImageCarousel
