'use client'

import React, { useCallback, useMemo, useState } from 'react'
import {
  Box,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  CircularProgress,
  Typography,
  TextField,
  Button,
} from '@mui/material'
import IosShareIcon from '@mui/icons-material/IosShare'
import { ShareableContent, createShareStrategy } from '../../types/sharing'
import {
  resolveSeriesCanonical,
  resolveSequenceCanonical,
} from '@app/utils/shareIdResolver'

/* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars */
export type ShareAssetProps = {
  content: ShareableContent
  variant?: 'icon' | 'button' | 'compact'
  showDetails?: boolean
  onShareComplete?: (_result: {
    success: boolean
    method: 'native' | 'clipboard' | 'error'
    error?: string
  }) => void
  allowCustomText?: boolean
  /** Optional default message shown in the input when `allowCustomText` is enabled */
  defaultMessage?: string
  /** Optional custom color for the icon/button */
  color?: string
  /** Optional additional sx styles */
  sx?: any
  /** Optional size for the icon button */
  size?: 'small' | 'medium' | 'large'
}
/* eslint-enable no-unused-vars, @typescript-eslint/no-unused-vars */

export default function ShareAsset({
  content,
  variant = 'icon',
  showDetails = false,
  onShareComplete,
  allowCustomText = false,
  defaultMessage = '',
  color,
  sx,
  size = 'small',
}: ShareAssetProps) {
  const [isSharing, setIsSharing] = useState(false)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snack, setSnack] = useState<{ severity: any; message: string } | null>(
    null
  )
  const [customText, setCustomText] = useState<string>(defaultMessage || '')

  const validateContent = useCallback((c: ShareableContent) => {
    if (!c) return false
    switch (c.contentType) {
      case 'asana':
        return Boolean(
          (c.data as any).sort_english_name ||
            (c.data as any).english_names?.length
        )
      case 'series':
        return Boolean(
          (c.data as any).seriesName && (c.data as any).seriesPoses?.length
        )
      case 'sequence':
        return Boolean((c.data as any).nameSequence)
      default:
        return false
    }
  }, [])

  const shareConfig = useMemo(() => {
    try {
      if (!validateContent(content)) return null
      const strat = createShareStrategy(content.contentType)
      return strat.generateShareConfig(content.data as any)
    } catch (e) {
      return null
    }
  }, [content, validateContent])

  const detectWebShareSupport = useCallback(() => {
    try {
      return (
        typeof navigator !== 'undefined' &&
        typeof (navigator as any).share === 'function'
      )
    } catch {
      return false
    }
  }, [])

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      if (navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(text)
          return true
        } catch (e) {
          // fall through to legacy copy method
        }
      }
      if (
        document.queryCommandSupported &&
        document.queryCommandSupported('copy')
      ) {
        const ta = document.createElement('textarea')
        ta.value = text
        ta.style.position = 'fixed'
        ta.style.left = '-9999px'
        document.body.appendChild(ta)
        ta.focus()
        ta.select()
        const ok = document.execCommand('copy')
        document.body.removeChild(ta)
        return ok
      }
      return false
    } catch (e) {
      return false
    }
  }, [])

  const shareWithNativeAPI = useCallback(async (shareData: any) => {
    try {
      await (navigator as any).share(shareData)
      return { success: true }
    } catch (err: any) {
      const m = err?.message || String(err)
      if (m.includes('Abort') || m.includes('cancel'))
        return { success: false, error: 'cancelled' }
      return { success: false, error: m }
    }
  }, [])

  const handleSnackbar = useCallback((severity: any, message: string) => {
    setSnack({ severity, message })
    setSnackbarOpen(true)
  }, [])

  const handleShare = useCallback(async () => {
    if (!validateContent(content)) {
      handleSnackbar('error', 'No shareable content available')
      onShareComplete?.({
        success: false,
        method: 'error',
        error: 'no-content',
      })
      return
    }

    setIsSharing(true)
    try {
      // Resolve canonical ids for series/sequence to ensure share URL includes
      // the public canonical id rather than a pagination or transient id.
      let dataToShare: any = content.data
      try {
        if (content.contentType === 'series') {
          dataToShare = await resolveSeriesCanonical(content.data)
        } else if (content.contentType === 'sequence') {
          dataToShare = await resolveSequenceCanonical(content.data)
        }
      } catch (e) {
        // resolver failed; continue with original data
        dataToShare = content.data
      }

      const strat = createShareStrategy(content.contentType)
      const shareConfigResolved = strat.generateShareConfig(dataToShare as any)

      // Prefer user-supplied custom text when available
      const effectiveText =
        customText && customText.trim() !== ''
          ? customText
          : shareConfigResolved.text

      const shareData = {
        title: shareConfigResolved.title,
        text: effectiveText,
        url: shareConfigResolved.url,
      }

      if (detectWebShareSupport()) {
        let canShare = true
        if ('canShare' in navigator) {
          try {
            const maybeCanShare = (navigator as any).canShare
            if (typeof maybeCanShare === 'function') {
              if ((shareData as any).files) {
                canShare = maybeCanShare.call(navigator, shareData)
              } else {
                canShare = true
              }
            }
          } catch (e) {
            canShare = true
          }
        }

        if (canShare) {
          const res = await shareWithNativeAPI(shareData)
          if (res.success) {
            handleSnackbar('success', 'Shared successfully')
            onShareComplete?.({ success: true, method: 'native' })
            setIsSharing(false)
            return
          }
          if (res.error === 'cancelled') {
            setIsSharing(false)
            onShareComplete?.({
              success: false,
              method: 'native',
              error: 'cancelled',
            })
            return
          }
        }
      }

      const payload = `${shareConfigResolved.title}\n${effectiveText}\n${shareConfigResolved.url}`
      const ok = await copyToClipboard(payload)
      if (ok) {
        handleSnackbar('info', 'Link copied to clipboard')
        onShareComplete?.({ success: true, method: 'clipboard' })
      } else {
        handleSnackbar(
          'warning',
          'Unable to copy automatically. Please copy manually.'
        )
        onShareComplete?.({
          success: false,
          method: 'error',
          error: 'clipboard-failed',
        })
      }
    } catch (e: any) {
      handleSnackbar('error', `Share failed: ${e?.message || String(e)}`)
      onShareComplete?.({ success: false, method: 'error', error: e?.message })
    } finally {
      setIsSharing(false)
    }
  }, [
    copyToClipboard,
    detectWebShareSupport,
    handleSnackbar,
    onShareComplete,
    shareWithNativeAPI,
    content,
    customText,
    validateContent,
  ])

  const handleClose = useCallback(() => setSnackbarOpen(false), [])

  const label = useMemo(() => {
    switch (content?.contentType) {
      case 'asana':
        return 'Share this pose'
      case 'series':
        return 'Share this series'
      case 'sequence':
        return 'Share this sequence'
      default:
        return 'Share'
    }
  }, [content])

  const buttonText = useMemo(() => {
    if (
      variant === 'button' &&
      defaultMessage &&
      defaultMessage.trim() !== ''
    ) {
      return defaultMessage
    }
    return label
  }, [variant, defaultMessage, label])

  return (
    <Box>
      {showDetails && (
        <Box sx={{ mb: 1 }}>
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            {shareConfig?.title}
          </Typography>
        </Box>
      )}

      {allowCustomText && (
        <Box sx={{ mb: 1 }}>
          <TextField
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="Add a message (optional)"
            size="small"
            fullWidth
            inputProps={{ 'aria-label': `${label} message` }}
          />
        </Box>
      )}

      {variant === 'icon' && (
        <Box
          component="span"
          sx={{ display: 'inline-flex', alignItems: 'center' }}
        >
          <Tooltip
            title={
              defaultMessage && defaultMessage.trim() !== ''
                ? defaultMessage
                : label
            }
            placement="top"
          >
            <IconButton
              onClick={handleShare}
              disabled={isSharing}
              aria-label={label}
              size={size}
              sx={{
                color: color || 'inherit',
                ...sx,
              }}
            >
              {isSharing ? (
                <CircularProgress
                  size={size === 'small' ? 20 : 24}
                  color="inherit"
                />
              ) : (
                <IosShareIcon />
              )}
            </IconButton>
          </Tooltip>

          {defaultMessage && defaultMessage.trim() !== '' && (
            <Typography
              variant="body2"
              sx={{
                ml: 1,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                maxWidth: 240,
              }}
            >
              {defaultMessage}
            </Typography>
          )}
        </Box>
      )}

      {variant === 'button' && (
        <Button
          variant="contained"
          onClick={handleShare}
          disabled={isSharing}
          startIcon={
            isSharing ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              <IosShareIcon />
            )
          }
          aria-label={label}
          size="small"
          sx={{
            backgroundColor: color || 'primary.main',
            '&:hover': {
              backgroundColor: color || 'primary.dark',
            },
            ...sx,
          }}
        >
          {isSharing ? 'Sharing...' : buttonText}
        </Button>
      )}

      {variant === 'compact' && (
        <Tooltip
          title={
            defaultMessage && defaultMessage.trim() !== ''
              ? defaultMessage
              : label
          }
          placement="top"
        >
          <IconButton
            onClick={handleShare}
            disabled={isSharing}
            aria-label={label}
            size={size}
            sx={{
              color: color || 'inherit',
              ...sx,
            }}
          >
            {isSharing ? (
              <CircularProgress
                size={size === 'small' ? 16 : 20}
                color="inherit"
              />
            ) : (
              <IosShareIcon />
            )}
          </IconButton>
        </Tooltip>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleClose}
          severity={snack?.severity || 'info'}
          sx={{ width: '100%' }}
        >
          {snack?.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}
