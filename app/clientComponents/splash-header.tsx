import { Box, Typography } from '@mui/material'
import Image from 'next/image'
import React from 'react'

interface SplashHeaderProps {
  title: string
  src: string
  alt: string
  height?: number | { xs?: number; sm?: number; md?: number; lg?: number }
  width?: number | { xs?: number; sm?: number; md?: number; lg?: number }
  style?: React.CSSProperties
  // Spacing props
  spacing?: number | { xs?: number; sm?: number; md?: number; lg?: number }
  // Decorative icon props
  showIcon?: boolean
  iconSrc?: string
  iconAlt?: string
  iconSize?: number | `${number}`
}

/**
 * A splash header component that displays an image with an optional title and decorative icon.
 *
 * @component
 * @example
 * ```tsx
 * <SplashHeader
 *   src="/images/yoga.png"
 *   alt="Yoga poses"
 *   title="Welcome to Yoga"
 *   height={400}
 *   width={500}
 * />
 * ```
 *
 * @param {SplashHeaderProps} props - The component props
 * @param {string} props.title - The title text to display below the image
 * @param {string} props.src - The source URL of the main splash image
 * @param {string} props.alt - The alt text for the main splash image
 * @param {number | ResponsiveDimensions} [props.height=355] - Height of the image container in pixels. Can be a number or object with breakpoint values (xs, sm, md, lg)
 * @param {number | ResponsiveDimensions} [props.width=384] - Width of the image container in pixels. Can be a number or object with breakpoint values (xs, sm, md, lg)
 * @param {React.CSSProperties} [props.style] - Additional inline styles for the image
 * @param {number} [props.spacing=2] - Spacing between the image and title in theme spacing units
 * @param {boolean} [props.showIcon=true] - Whether to display the decorative icon next to the title
 * @param {string} [props.iconSrc='/icons/designImages/leaf-orange.png'] - The source URL of the decorative icon
 * @param {string} [props.iconAlt=''] - The alt text for the decorative icon
 * @param {number} [props.iconSize=18] - Size of the decorative icon in pixels
 *
 * @returns {JSX.Element} A splash header with image, optional icon, and title
 */
export default function SplashHeader({
  title,
  src,
  alt,
  height = 355,
  width = 384,
  style,
  spacing = 2,
  showIcon = true,
  iconSrc = '/icons/designImages/leaf-orange.png',
  iconAlt = '',
  iconSize = 18,
}: SplashHeaderProps) {
  // Create responsive sizing for the container
  const getResponsiveDimensions = (
    dimension: number | { xs?: number; sm?: number; md?: number; lg?: number }
  ) => {
    if (typeof dimension === 'number') {
      return dimension
    }
    return {
      xs: dimension.xs,
      sm: dimension.sm,
      md: dimension.md,
      lg: dimension.lg,
    }
  }

  return (
    <Box
      data-testid="splash-header"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        width: getResponsiveDimensions(width),
        maxWidth: '100%', // Prevent overflow on small screens
        height: getResponsiveDimensions(height),
        margin: '0 auto',
        overflow: 'hidden',
        borderRadius: '12px', // Consistency with other components
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 384px"
        style={{
          objectFit: 'contain', // Changed from cover to prevent distortion/cropping of illustrations
          ...style,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: '66%', // Positioned just below center (50%)
          left: 0,
          transform: 'translateY(-50%)',
          width: '100%',
          maxWidth: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 0.5, // Smaller gap to keep icon close to text
          zIndex: 1,
        }}
      >
        {showIcon && (
          <Image
            src={iconSrc}
            height={iconSize}
            width={iconSize}
            alt={iconAlt}
            style={{ flexShrink: 0 }}
          />
        )}
        <Typography
          variant="splashTitle"
          component="span"
          sx={{
            color: 'primary.main',
            backgroundColor: 'navSplash.light',
            px: { xs: 1, sm: 2 },
            py: 1,
            borderRadius: '8px',
            maxWidth: showIcon ? 'calc(100% - 48px)' : '100%', // Adjusted for absolute positioning context
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
            hyphens: 'auto',
            boxShadow: 2, // Added a little shadow to lift it from background
          }}
        >
          {title}
        </Typography>
      </Box>
    </Box>
  )
}
