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

interface ImageCarouselProps {
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
  const { preloadedImages, getOptimizedSizes, getLoadingPriority } =
    useImagePreloader({
      images: imageUrls,
      currentIndex: activeIndex,
      preloadCount: 1, // Preload 1 image on each side
    })

  // Handle index changes and notify parent component
  const handleIndexChange = useCallback(
    (newIndex: number) => {
      if (totalImages === 0) {
        setActiveIndex(0)
        return
      }

      // Clamp the index to valid range
      const clampedIndex = Math.max(0, Math.min(newIndex, totalImages - 1))
      setActiveIndex(clampedIndex)
      onIndexChange?.(clampedIndex)
    },
    [totalImages, onIndexChange]
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
      return
    }

    if (currentIndex !== activeIndex && currentIndex >= 0) {
      // Clamp the external index to valid range
      const clampedIndex = Math.max(0, Math.min(currentIndex, totalImages - 1))
      setActiveIndex(clampedIndex)
    }
  }, [currentIndex, activeIndex, totalImages])

  // Handle image loading
  const handleImageLoad = () => {
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
      <Fade in={!isLoading} timeout={300}>
        <Card
          sx={{
            height: '100%',
            width: '100%',
            position: 'relative',
            boxShadow: 'none',
            borderRadius: 1,
            backgroundColor: 'grey.50', // Subtle background for contained images
          }}
        >
          {isLoading && (
            <Skeleton
              variant="rectangular"
              width="100%"
              height="100%"
              animation="wave"
            />
          )}

          <CardMedia
            component="div"
            sx={{
              height: '100%',
              position: 'relative',
              overflow: 'hidden',
              backgroundColor: 'grey.100', // Background for the image area when using contain
            }}
          >
            <Image
              src={currentImage?.url || ''}
              alt={
                currentImage?.altText ||
                currentImage?.poseName ||
                `Yoga pose ${safeActiveIndex + 1}`
              }
              fill
              style={{
                objectFit: 'contain',
                transition: 'opacity 0.3s ease-in-out',
              }}
              sizes={getOptimizedSizes(safeActiveIndex)}
              onLoad={handleImageLoad}
              onError={() => setIsLoading(false)}
              priority={getLoadingPriority(safeActiveIndex) === 'high'}
              loading={
                getLoadingPriority(safeActiveIndex) === 'high'
                  ? 'eager'
                  : 'lazy'
              }
              quality={getLoadingPriority(safeActiveIndex) === 'high' ? 90 : 75}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkrHB0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            />
          </CardMedia>
        </Card>
      </Fade>

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
