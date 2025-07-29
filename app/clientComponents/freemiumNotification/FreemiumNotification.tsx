'use client'
import React, { useCallback } from 'react'
import {
  Snackbar,
  Alert,
  Button,
  Box,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'
import type { FreemiumNotificationProps } from './types'

/**
 * FreemiumNotification Component
 *
 * A mobile-first notification system for freemium features in the Soar yoga application.
 * Provides accessible, responsive notifications when users attempt to access protected features.
 *
 * Features:
 * - Mobile-first responsive design
 * - WCAG 2.1 Level AA accessibility compliance
 * - Auto-dismiss with manual override
 * - Call-to-action button integration
 * - MUI theming integration
 */
const FreemiumNotification: React.FC<FreemiumNotificationProps> = ({
  featureType,
  userAuthState,
  isOpen,
  onClose,
  onCtaClick,
  duration = 5000,
  position = { vertical: 'bottom', horizontal: 'center' },
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  // Generate notification content based on feature type and user state
  const getNotificationContent = useCallback(() => {
    const featureNames = {
      createAsana: 'custom asanas',
      createFlow: 'custom flows',
      createSeries: 'custom series',
      createSequence: 'custom sequences',
    }

    const featureName = featureNames[featureType] || 'this feature'

    if (userAuthState === 'unauthenticated') {
      return {
        title: 'Login Required',
        message: `Please log in to create ${featureName}`,
        ctaText: 'Log In',
        severity: 'info' as const,
      }
    }

    // All authenticated users have access (no payment system implemented yet)
    return {
      title: 'Feature Available',
      message: `You can create ${featureName}`,
      ctaText: 'Continue',
      severity: 'success' as const,
    }
  }, [featureType, userAuthState])

  const notificationContent = getNotificationContent()

  // Handle CTA button click
  const handleCtaClick = useCallback(() => {
    if (onCtaClick) {
      onCtaClick()
    }
    onClose()
  }, [onCtaClick, onClose])

  // Handle manual dismiss
  const handleClose = useCallback(
    (event?: React.SyntheticEvent | Event, reason?: string) => {
      if (reason === 'clickaway') {
        return
      }
      onClose()
    },
    [onClose]
  )

  // Handle keyboard events
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        event.stopPropagation()
        onClose()
      }
    },
    [onClose]
  )

  // Responsive positioning
  const snackbarPosition = {
    vertical: isMobile ? 'bottom' : position.vertical,
    horizontal: isMobile ? 'center' : position.horizontal,
  } as const

  return (
    <Snackbar
      open={isOpen}
      autoHideDuration={duration}
      onClose={handleClose}
      anchorOrigin={snackbarPosition}
      onKeyDown={handleKeyDown}
      data-testid="freemium-notification-snackbar"
      sx={{
        zIndex: theme.zIndex.snackbar + 1,
        '& .MuiSnackbarContent-root': {
          minWidth: isMobile ? '300px' : '400px',
          maxWidth: isMobile ? '90vw' : '500px',
        },
        // Position adjustments for mobile navigation
        bottom: isMobile ? { xs: 80, sm: 24 } : undefined,
      }}
      aria-live="polite"
      aria-describedby="freemium-notification-content"
    >
      <Alert
        onClose={handleClose}
        severity={notificationContent.severity}
        variant="filled"
        data-testid="freemium-notification-alert"
        sx={{
          width: '100%',
          '& .MuiAlert-message': {
            width: '100%',
            fontSize: isMobile ? '0.875rem' : '1rem',
            lineHeight: 1.4,
          },
          '& .MuiAlert-action': {
            alignItems: 'flex-start',
            paddingTop: 0,
          },
        }}
        action={
          <Box
            sx={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              gap: 1,
              alignItems: 'flex-end',
            }}
          >
            {notificationContent.ctaText && onCtaClick && (
              <Button
                color="inherit"
                size={isMobile ? 'small' : 'medium'}
                variant="outlined"
                onClick={handleCtaClick}
                sx={{
                  minWidth: isMobile ? '80px' : '100px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  color: 'inherit',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  },
                  // Ensure proper touch targets on mobile
                  minHeight: isMobile ? '44px' : '36px',
                }}
                aria-label={`${notificationContent.ctaText} for ${featureType}`}
              >
                {notificationContent.ctaText}
              </Button>
            )}
            <IconButton
              size={isMobile ? 'small' : 'medium'}
              aria-label="Close notification"
              color="inherit"
              onClick={handleClose}
              sx={{
                minWidth: isMobile ? '44px' : '40px',
                minHeight: isMobile ? '44px' : '40px',
              }}
            >
              <CloseIcon fontSize={isMobile ? 'small' : 'medium'} />
            </IconButton>
          </Box>
        }
      >
        <Box
          id="freemium-notification-content"
          data-testid="freemium-notification-content"
        >
          <Typography
            variant={isMobile ? 'subtitle2' : 'subtitle1'}
            component="div"
            sx={{
              fontWeight: 600,
              mb: 0.5,
            }}
          >
            {notificationContent.title}
          </Typography>
          <Typography
            variant={isMobile ? 'body2' : 'body1'}
            component="div"
            sx={{
              opacity: 0.9,
            }}
          >
            {notificationContent.message}
          </Typography>
        </Box>
      </Alert>
    </Snackbar>
  )
}

export default FreemiumNotification
