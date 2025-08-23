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
    <Stack spacing={spacing}>
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
      <Stack
        direction={'row'}
        gap={1}
        alignItems={'center'}
        justifyContent={'center'}
      >
        {showIcon && (
          <Image
            src={iconSrc}
            height={iconSize}
            width={iconSize}
            alt={iconAlt}
          />
        )}
        <Typography
          variant="splashTitle"
          sx={{
            // Layout and visual styling only - typography styles come from theme variant
            color: 'primary.main',
            backgroundColor: 'navSplash.light',
            px: { xs: 0, sm: 2 },
            py: 1,
            borderRadius: '8px',
            width: '100%',
            maxWidth: '100vw',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
            hyphens: 'auto',
            textAlign: 'center',
            // Responsive fontSize override - MUI theme variants don't support responsive typography
            // All other typography properties (textTransform, whiteSpace, textAlign, etc.) come from theme
            fontSize: {
              xs: 'clamp(0.75rem, 7.5vw, 1.2rem)', // 0.75/1/1.2/1.4 base, 7.5vw for xs
              sm: 'clamp(1rem, 10vw, 2.5rem)', // as you want
              md: 'clamp(1.2rem, 12vw, 3rem)', // 1.2/1.4 ratio to sm, 12vw for md
              lg: 'clamp(1.4rem, 14vw, 3.5rem)', // 1.4/1.7 ratio to sm, 14vw for lg
            },
          }}
        >
          {title}
        </Typography>
      </Stack>
    </Stack>
  )
}
