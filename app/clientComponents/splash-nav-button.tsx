'use client'

import { Box, Stack, Typography } from '@mui/material'
import StarIcon from '@mui/icons-material/Star'
import { ComponentProps } from 'react'
import { useSession } from 'next-auth/react'

interface SplashNavButtonProps extends ComponentProps<typeof Box> {
  title: string
  description: string
  /** Primary (color) image URL */
  image?: string
  /** Explicit B&W image URL (preferred for unauthenticated users) */
  bwImage?: string
  /** Explicit color image URL (overrides `image` when provided) */
  colorImage?: string
  premium?: boolean
  /** Optional override for authentication state (preferred when parent already knows it) */
  isAuthenticated?: boolean
}

/**
 * A navigation button component for splash screen interfaces.
 *
 * Renders a styled clickable box with a title and description text.
 * The button has a fixed size width x height (363x210px) with rounded corners, borders,
 * and hover effects including shadow highlights. Optionally displays a background image
 * with the description text overlaid on top. Premium features show a star icon.
 *
 * @param title - The main title text displayed at the bottom of the button
 * @param description - The descriptive text displayed at the top of the button, overlaying the image
 * @param image - Optional URL for background image that displays behind the description text
 * @param premium - Whether this is a premium feature that should display a star icon
 * @param props - Additional props including sx styling overrides and onClick handler
 * @returns A Material-UI Box component styled as a navigation button
 */
export default function SplashNavButton({
  title,
  description,
  image,
  bwImage,
  colorImage,
  premium = false,
  isAuthenticated: isAuthenticatedProp,
  ...props
}: SplashNavButtonProps) {
  // Determine auth state to toggle premium images. Prefer explicit prop
  // passed from parent when available (more reliable in some layouts).
  // Call the hook unconditionally to satisfy React rules.
  const { data: session, status } = useSession()
  const hasAuthCookie = () => {
    if (typeof window === 'undefined') return false
    const c = document.cookie || ''
    return /(__Secure-)?next-auth\.session-token=|next-auth\.session-token=/.test(
      c
    )
  }

  let isAuthenticated: boolean | undefined = undefined
  if (typeof isAuthenticatedProp !== 'undefined') {
    isAuthenticated = Boolean(isAuthenticatedProp)
  } else {
    isAuthenticated =
      status === 'authenticated' || Boolean(session) || hasAuthCookie()
  }

  // Select background image and filter behavior
  let bgUrl: string | undefined = undefined
  let useCssGrayscale = false

  const providedColor = colorImage || image
  const providedBw = bwImage

  if (premium) {
    if (isAuthenticated) {
      bgUrl = providedColor
    } else {
      if (providedBw) {
        bgUrl = providedBw
      } else if (providedColor) {
        // No explicit B&W variant provided — fall back to CSS grayscale over color image
        bgUrl = providedColor
        useCssGrayscale = true
      }
    }
  } else {
    bgUrl = image
  }

  // Avoid allowing callers to pass a backgroundImage via `sx` which can
  // conflict with our ::before background layer. Clone `props.sx` and
  // remove background-image/background properties so the component fully
  // controls sizing and clipping.
  const boxSx = { ...(props.sx || {}) } as any
  delete boxSx.backgroundImage
  delete boxSx.background

  return (
    <Stack
      sx={{
        borderRadius: '12px',
        border: '1px solid',
        borderColor: 'grey.300',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        position: 'relative',
        ':hover': {
          cursor: 'pointer',
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
        },
        transition: 'all 0.2s ease-in-out',
      }}
      onClick={props.onClick}
    >
      <Box
        sx={{
          ...boxSx,
          display: 'flex',
          height: '210px',
          width: '363px',
          borderTopLeftRadius: '12px',
          borderTopRightRadius: '12px',
          border: 'none',
          alignItems: 'flex-start',
          overflow: 'hidden',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          position: 'relative',
          // Background image rendered in a ::before layer so we can apply
          // grayscale to the image only without affecting the overlaid text.
          '&:before': bgUrl
            ? {
                content: "''",
                position: 'absolute',
                inset: 0,
                backgroundImage: `url(${bgUrl})`,
                // Use contain so the image scales to fit the button dimensions
                // without overflowing or being cropped unexpectedly.
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                filter: useCssGrayscale ? 'grayscale(100%)' : 'none',
                zIndex: 0,
                borderTopLeftRadius: '12px',
                borderTopRightRadius: '12px',
              }
            : undefined,
        }}
      >
        {/* Star icon for premium features (positioned relative to full image container) */}
        {premium && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 12,
              right: 12,
              backgroundColor: 'navSplash.dark',
              borderRadius: '50%',
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
              zIndex: 2,
            }}
          >
            <StarIcon
              sx={{
                color: 'warning.main',
                fontSize: 20,
              }}
            />
          </Box>
        )}

        <Box sx={{ position: 'relative', zIndex: 1, width: '100%' }}>
          <Typography
            variant="subtitle1"
            component={'h2'}
            sx={{
              color: 'navSplash.main',
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              borderRadius: '8px',
              padding: '6px 12px',
              marginTop: '12px',
              alignSelf: 'flex-start',
              fontWeight: 'bold',
              mt: 2,
              mx: 2,
              maxWidth: 'auto',
              zIndex: 2,
            }}
          >
            {description}
          </Typography>
        </Box>
      </Box>
      <Typography
        variant="h4"
        sx={{
          whiteSpace: 'normal',
          backgroundColor: 'navSplash.dark',
          color: 'primary.main',
          justifyContent: 'center',
          width: '100%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          textAlign: 'center',
          py: 1.5,
          borderBottomLeftRadius: '12px',
          borderBottomRightRadius: '12px',
          fontWeight: 'bold',
          fontSize: '28px',
        }}
      >
        {title}
      </Typography>
    </Stack>
  )
}
