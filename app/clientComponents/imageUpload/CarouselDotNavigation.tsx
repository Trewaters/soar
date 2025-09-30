'use client'
import React from 'react'
import { Box, IconButton, Tooltip, useTheme } from '@mui/material'
import { PoseImageData } from '../../../types/images'

interface CarouselDotNavigationProps {
  images: PoseImageData[]
  activeIndex: number
  onIndexChange: (index: number) => void
  showLabels?: boolean
  size?: 'small' | 'medium' | 'large'
  color?: 'primary' | 'secondary' | 'default'
  className?: string
  'aria-label'?: string
}

export const CarouselDotNavigation: React.FC<CarouselDotNavigationProps> = ({
  images = [],
  activeIndex = 0,
  onIndexChange,
  showLabels = false,
  size = 'medium',
  color = 'primary',
  className,
  'aria-label': ariaLabel = 'Image navigation dots',
}) => {
  const theme = useTheme()

  const sortedImages = [...images].sort(
    (a, b) => a.displayOrder - b.displayOrder
  )
  const totalImages = sortedImages.length

  // Don't render if there's only one or no images
  if (totalImages <= 1) {
    return null
  }

  // Calculate dot size based on size prop
  const getDotSize = () => {
    switch (size) {
      case 'small':
        return 8
      case 'large':
        return 16
      default:
        return 12
    }
  }

  const dotSize = getDotSize()
  const dotSpacing = size === 'small' ? 4 : size === 'large' ? 8 : 6

  // Get color based on theme and prop
  const getColor = (isActive: boolean) => {
    const colorMap = {
      primary: theme.palette.primary.main,
      secondary: theme.palette.secondary.main,
      default: theme.palette.grey[600],
    }

    if (isActive) {
      return colorMap[color]
    }

    return theme.palette.grey[300]
  }

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault()
        onIndexChange(index)
        break
      case 'ArrowLeft':
        event.preventDefault()
        if (index > 0) {
          onIndexChange(index - 1)
        }
        break
      case 'ArrowRight':
        event.preventDefault()
        if (index < totalImages - 1) {
          onIndexChange(index + 1)
        }
        break
      case 'Home':
        event.preventDefault()
        onIndexChange(0)
        break
      case 'End':
        event.preventDefault()
        onIndexChange(totalImages - 1)
        break
    }
  }

  // Generate tooltip text for accessibility
  const getTooltipText = (index: number) => {
    const image = sortedImages[index]
    const baseText = `Image ${index + 1} of ${totalImages}`

    if (showLabels && (image.altText || image.postureName)) {
      return `${baseText}: ${image.altText || image.postureName}`
    }

    return baseText
  }

  return (
    <Box
      className={className}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: `${dotSpacing}px`,
        py: 1,
      }}
      role="tablist"
      aria-label={ariaLabel}
    >
      {sortedImages.map((image, index) => {
        const isActive = index === activeIndex
        const tooltipText = getTooltipText(index)

        return (
          <Tooltip
            key={`${image.id}-${index}`}
            title={tooltipText}
            placement="top"
            arrow
          >
            <IconButton
              onClick={() => onIndexChange(index)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              sx={{
                width: dotSize * 2,
                height: dotSize * 2,
                minWidth: dotSize * 2,
                minHeight: dotSize * 2,
                padding: 0,
                margin: 0,
                '&:hover': {
                  backgroundColor: 'transparent',
                },
                '&:focus': {
                  outline: `2px solid ${theme.palette.primary.main}`,
                  outlineOffset: '2px',
                },
              }}
              role="tab"
              aria-selected={isActive}
              aria-controls={`carousel-panel-${index}`}
              aria-label={`Go to ${tooltipText}`}
              tabIndex={0}
            >
              <Box
                sx={{
                  width: dotSize,
                  height: dotSize,
                  borderRadius: '50%',
                  backgroundColor: getColor(isActive),
                  transition: 'all 0.2s ease-in-out',
                  transform: isActive ? 'scale(1.2)' : 'scale(1)',
                  boxShadow: isActive ? `0 2px 4px rgba(0, 0, 0, 0.2)` : 'none',
                  border: isActive
                    ? `2px solid ${theme.palette.background.paper}`
                    : '2px solid transparent',
                }}
              />
            </IconButton>
          </Tooltip>
        )
      })}

      {/* Screen reader only text for current position */}
      <Box
        component="span"
        sx={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: 0,
        }}
        aria-live="polite"
        aria-atomic="true"
      >
        Currently viewing image {activeIndex + 1} of {totalImages}
        {sortedImages[activeIndex] &&
          (sortedImages[activeIndex].altText ||
            sortedImages[activeIndex].postureName) &&
          `: ${sortedImages[activeIndex].altText || sortedImages[activeIndex].postureName}`}
      </Box>
    </Box>
  )
}

export default CarouselDotNavigation
