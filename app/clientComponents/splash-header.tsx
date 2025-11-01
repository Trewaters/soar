import { Box, Stack, Typography } from '@mui/material'
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
 * SplashHeader component renders a header with an image and a title.
 *
 * @component
 * @param {SplashHeaderProps} props - The properties for the SplashHeader component.
 * @param {string} props.title - The title text to be displayed.
 * @param {string} props.src - The source URL of the image.
 * @param {string} props.alt - The alt text for the image.
 * @param {number | object} [props.height=355] - The height of the image. Can be a number or responsive object with breakpoint values.
 * @param {number | object} [props.width=384] - The width of the image. Can be a number or responsive object with breakpoint values.
 * @param {React.CSSProperties} [props.style] - Additional styles for the image.
 * @param {number | object} [props.spacing=2] - The spacing between image and title sections. Can be a number or responsive object with breakpoint values.
 * @param {boolean} [props.showIcon=true] - Whether to show the decorative icon next to the title.
 * @param {string} [props.iconSrc="/icons/designImages/leaf-orange.png"] - The source URL of the decorative icon.
 * @param {string} [props.iconAlt=""] - The alt text for the decorative icon. Empty by default for decorative images.
 * @param {number | `${number}`} [props.iconSize=24] - The size of the decorative icon in pixels.
 *
 * @returns {JSX.Element} The rendered SplashHeader component.
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
  iconSize = 21,
}: SplashHeaderProps) {
  // Extract base dimensions for Next.js Image component
  const baseHeight =
    typeof height === 'number'
      ? height
      : height.md || height.sm || height.xs || 355

  const baseWidth =
    typeof width === 'number' ? width : width.md || width.sm || width.xs || 384

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
    <Stack spacing={spacing} data-testid="splash-header">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          // Apply responsive sizing to the container
          width: getResponsiveDimensions(width),
          height: getResponsiveDimensions(height),
          '& img': {
            width: '100% !important',
            height: '100% !important',
            objectFit: 'contain',
          },
        }}
      >
        <Image
          src={src}
          alt={alt}
          height={baseHeight}
          width={baseWidth}
          style={{
            display: 'flex',
            alignSelf: 'center',
            ...style,
          }}
        />
      </Box>
      <Box
        sx={{
          width: '100%',
          maxWidth: '100vw',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 0.5, // Smaller gap to keep icon close to text
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
          sx={{
            // Layout and visual styling only - typography styles come from theme variant
            color: 'primary.main',
            backgroundColor: 'navSplash.light',
            px: { xs: 1, sm: 2 },
            py: 1,
            borderRadius: '8px',
            maxWidth: showIcon ? 'calc(100vw - 32px)' : '100vw', // Account for icon width + gap
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
            hyphens: 'auto',
            textAlign: 'center',
            lineHeight: 1.2,
            // More aggressive responsive fontSize scaling - prioritizes fitting on screen
            fontSize: {
              xs: 'clamp(0.75rem, 4vw, 1rem)', // Much more conservative scaling for xs
              sm: 'clamp(0.875rem, 5vw, 1.5rem)', // More conservative for sm
              md: 'clamp(1rem, 6vw, 2rem)', // More conservative for md
              lg: 'clamp(1.125rem, 7vw, 2.5rem)', // More conservative for lg
            },
          }}
        >
          {title}
        </Typography>
      </Box>
    </Stack>
  )
}
