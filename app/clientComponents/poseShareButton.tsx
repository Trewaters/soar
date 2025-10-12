import React, { useState, useCallback, useMemo } from 'react'
import {
  Box,
  IconButton,
  Typography,
  Alert,
  Snackbar,
  CircularProgress,
  Tooltip,
} from '@mui/material'
import IosShareIcon from '@mui/icons-material/IosShare'
import { useAsanaPose } from '@app/context/AsanaPoseContext'
import { FlowSeriesData, useFlowSeries } from '@app/context/AsanaSeriesContext'
import { SequenceData, useSequence } from '@app/context/SequenceContext'
import { ShareableContent, createShareStrategy } from '../../types/sharing'
import { AsanaPose } from 'types/asana'

// New discriminated union props interface
interface PoseShareButtonProps {
  content: ShareableContent
  showDetails?: boolean
  enableContextIntegration?: boolean
}

// Legacy props interface for backward compatibility
interface LegacyPoseShareButtonProps {
  poseData?: AsanaPose | null
  seriesData?: FlowSeriesData | null
  showDetails?: boolean
  enableContextIntegration?: boolean
}

// Combined props type to support both patterns during migration
type CombinedPoseShareButtonProps =
  | PoseShareButtonProps
  | LegacyPoseShareButtonProps

// Enhanced context validation and error handling interface
interface ContextValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  source: 'prop' | 'context' | 'hybrid'
  contextProviderStatus: ContextProviderStatus
}

// Interface for context provider dependency chain validation
interface ContextProviderStatus {
  asanaProvider: 'available' | 'unavailable' | 'error'
  seriesProvider: 'available' | 'unavailable' | 'error'
  sequenceProvider: 'available' | 'unavailable' | 'error'
  dependencyChainValid: boolean
  missingProviders: string[]
}

// Interface for session compatibility validation
interface SessionCompatibilityStatus {
  isSessionAware: boolean
  hasUserContext: boolean
  sessionState: 'authenticated' | 'unauthenticated' | 'loading' | 'unknown'
  warnings: string[]
}

// Type guard to check if props are using the new pattern
function isNewProps(
  props: CombinedPoseShareButtonProps
): props is PoseShareButtonProps {
  return 'content' in props
}

// Helper function to convert legacy props to new content format
function convertLegacyProps(
  props: LegacyPoseShareButtonProps
): ShareableContent | null {
  if (props.poseData) {
    return {
      contentType: 'asana',
      data: props.poseData,
    }
  }
  if (props.seriesData) {
    return {
      contentType: 'series',
      data: props.seriesData,
    }
  }
  return null
}

/**
 * A React functional component that renders a button for sharing yoga content using the strategy pattern.
 *
 * This component supports multiple content types (asana, series, sequence) through a discriminated union
 * pattern for type safety and extensibility. It automatically selects the appropriate sharing strategy
 * based on the content type provided.
 *
 * Features:
 * - Dynamic accessibility labels based on content type
 * - Enhanced error handling with content-specific messages
 * - Loading states and user feedback for sharing operations
 * - Consistent MUI styling across all content types
 * - Proper edge case handling for missing or invalid content
 *
 * @component
 * @param {CombinedPoseShareButtonProps} props - The properties for the component.
 * @param {ShareableContent} props.content - The yoga content to share (discriminated union).
 * @param {AsanaPose} [props.poseData] - Legacy: The data for a single asana pose (deprecated).
 * @param {FlowSeriesData} [props.seriesData] - Legacy: The data for a series of asana poses (deprecated).
 * @param {boolean} [props.showDetails=false] - Flag to indicate whether to show detailed information.
 *
 * @returns {JSX.Element} The rendered sharing component.
 *
 * @example
 * // New discriminated union usage (preferred):
 * <PoseShareButton
 *   content={{
 *     contentType: 'asana',
 *     data: asanaData
 *   }}
 *   showDetails={true}
 * />
 *
 * @example
 * // Legacy usage (deprecated but supported):
 * <PoseShareButton
 *   poseData={poseData}
 *   showDetails={true}
 * />
 */
const PoseShareButton: React.FC<CombinedPoseShareButtonProps> = (props) => {
  const { showDetails = false, enableContextIntegration = true } = props

  // Context Integration with safe access patterns
  // React hooks must be called unconditionally - always call hooks, conditionally use results

  // Always call hooks unconditionally to comply with React rules
  const asanaContextRaw = useAsanaPose()
  const seriesContextRaw = useFlowSeries()
  const sequenceContextRaw = useSequence()

  // Safe context access with memoization - only use if integration enabled
  const asanaContext = useMemo(() => {
    return enableContextIntegration && asanaContextRaw ? asanaContextRaw : null
  }, [asanaContextRaw, enableContextIntegration])

  const seriesContext = useMemo(() => {
    return enableContextIntegration && seriesContextRaw
      ? seriesContextRaw
      : null
  }, [seriesContextRaw, enableContextIntegration])

  const sequenceContext = useMemo(() => {
    return enableContextIntegration && sequenceContextRaw
      ? sequenceContextRaw
      : null
  }, [sequenceContextRaw, enableContextIntegration])

  // State management for UI feedback and loading states
  const [isSharing, setIsSharing] = useState(false)
  const [shareStatus, setShareStatus] = useState<{
    type: 'success' | 'error' | 'info' | 'warning' | null
    message: string
  }>({ type: null, message: '' })
  const [snackbarOpen, setSnackbarOpen] = useState(false)

  // Enhanced context validation function with provider dependency chain validation
  const validateContextData = useCallback(
    (content: ShareableContent | null): ContextValidationResult => {
      // Check context provider dependency chain status
      const contextProviderStatus: ContextProviderStatus = {
        asanaProvider: asanaContextRaw ? 'available' : 'unavailable',
        seriesProvider: seriesContextRaw ? 'available' : 'unavailable',
        sequenceProvider: sequenceContextRaw ? 'available' : 'unavailable',
        dependencyChainValid: false,
        missingProviders: [],
      }

      // Validate provider dependency chain according to Soar architecture
      if (!asanaContextRaw)
        contextProviderStatus.missingProviders.push('AsanaPoseProvider')
      if (!seriesContextRaw)
        contextProviderStatus.missingProviders.push('FlowSeriesProvider')
      if (!sequenceContextRaw)
        contextProviderStatus.missingProviders.push('SequenceProvider')

      // Provider chain is valid if all providers are available (following Soar's context hierarchy)
      contextProviderStatus.dependencyChainValid =
        contextProviderStatus.asanaProvider === 'available' &&
        contextProviderStatus.seriesProvider === 'available' &&
        contextProviderStatus.sequenceProvider === 'available'

      const result: ContextValidationResult = {
        isValid: true,
        errors: [],
        warnings: [],
        source: 'prop',
        contextProviderStatus,
      }

      if (!content || !enableContextIntegration) {
        result.source = 'prop'
        // Add warning if provider chain is broken but context integration is disabled
        if (
          !contextProviderStatus.dependencyChainValid &&
          enableContextIntegration === false
        ) {
          result.warnings.push(
            'Context integration disabled with incomplete provider chain. Some context features may not work properly.'
          )
        }
        return result
      }

      // Add warnings for missing providers
      if (contextProviderStatus.missingProviders.length > 0) {
        result.warnings.push(
          `Missing context providers: ${contextProviderStatus.missingProviders.join(', ')}. Context fallback may be limited.`
        )
      }

      try {
        switch (content.contentType) {
          case 'asana': {
            const asanaData = content.data as AsanaPose
            const contextAsana = asanaContext?.state?.poses

            if (contextAsana && contextAsana.id) {
              result.source = 'hybrid'

              // Validate data consistency between prop and context
              if (asanaData.id !== contextAsana.id) {
                result.warnings.push(
                  'Asana data mismatch between props and context. Using props data.'
                )
              }

              // Check for missing critical data
              if (
                !asanaData.sort_english_name &&
                !contextAsana.sort_english_name
              ) {
                result.errors.push(
                  'Missing asana name in both props and context'
                )
                result.isValid = false
              }
            }
            break
          }

          case 'series': {
            const seriesData = content.data as FlowSeriesData
            const contextSeries = seriesContext?.state?.flowSeries

            if (contextSeries && contextSeries.seriesName) {
              result.source = 'hybrid'

              // Validate data consistency
              if (seriesData.seriesName !== contextSeries.seriesName) {
                result.warnings.push(
                  'Series data mismatch between props and context. Using props data.'
                )
              }

              // Check for missing critical data
              if (
                !seriesData.seriesPoses?.length &&
                !contextSeries.seriesPoses?.length
              ) {
                result.errors.push(
                  'Series has no poses in both props and context'
                )
                result.isValid = false
              }
            }
            break
          }

          case 'sequence': {
            const sequenceData = content.data as SequenceData
            const contextSequence = sequenceContext?.state?.sequences

            if (contextSequence && contextSequence.nameSequence) {
              result.source = 'hybrid'

              // Validate data consistency
              if (sequenceData.nameSequence !== contextSequence.nameSequence) {
                result.warnings.push(
                  'Sequence data mismatch between props and context. Using props data.'
                )
              }

              // Check for missing critical data
              if (
                !sequenceData.sequencesSeries?.length &&
                !contextSequence.sequencesSeries?.length
              ) {
                result.errors.push(
                  'Sequence has no series in both props and context'
                )
                result.isValid = false
              }
            }
            break
          }

          default:
            result.errors.push(
              `Unknown content type: ${(content as any).contentType}`
            )
            result.isValid = false
        }
      } catch (error) {
        result.errors.push(
          `Context validation error: ${(error as Error).message}`
        )
        result.isValid = false
      }

      return result
    },
    [
      asanaContext,
      seriesContext,
      sequenceContext,
      enableContextIntegration,
      asanaContextRaw,
      seriesContextRaw,
      sequenceContextRaw,
    ]
  )

  // Simple validation function (not a hook to avoid circular dependencies)
  const validateContentData = (content: ShareableContent | null): boolean => {
    if (!content) return false

    switch (content.contentType) {
      case 'asana': {
        const asanaData = content.data as AsanaPose
        return !!(
          asanaData.sort_english_name || asanaData.english_names?.length
        )
      }

      case 'series': {
        const seriesData = content.data as FlowSeriesData
        return !!(seriesData.seriesName && seriesData.seriesPoses?.length)
      }

      case 'sequence': {
        const sequenceData = content.data as SequenceData
        return !!(
          sequenceData.nameSequence && sequenceData.sequencesSeries?.length
        )
      }

      default:
        return false
    }
  }

  // Determine content based on props pattern with validation-based context fallback
  const content: ShareableContent | null = React.useMemo(() => {
    const propContent = isNewProps(props)
      ? props.content
      : convertLegacyProps(props)

    // If context integration is disabled, use props regardless of validation
    if (!enableContextIntegration) {
      return propContent
    }

    // If props provide content, validate it first
    if (propContent) {
      // Check if props content is valid
      const isPropsValid = validateContentData(propContent)

      if (isPropsValid) {
        return propContent
      }

      // Props validation failed, try context fallback
      console.warn(
        'Props validation failed, attempting context fallback for:',
        propContent.contentType
      )
    }

    // Fallback to context data when no props content is available OR props validation fails
    try {
      // Try AsanaPoseContext first (for asana content type or general fallback)
      if (asanaContext?.state?.poses) {
        const contextAsana = asanaContext.state.poses
        if (
          contextAsana &&
          contextAsana.id &&
          (contextAsana.sort_english_name || contextAsana.english_names?.length)
        ) {
          const contextContent = {
            contentType: 'asana' as const,
            data: contextAsana as AsanaPose,
          }
          // Validate context data before using it
          if (validateContentData(contextContent)) {
            return contextContent
          }
        }
      }

      // Try AsanaSeriesContext
      if (seriesContext?.state?.flowSeries) {
        const contextSeries = seriesContext.state.flowSeries
        if (
          contextSeries &&
          contextSeries.seriesName &&
          contextSeries.seriesPoses?.length
        ) {
          const contextContent = {
            contentType: 'series' as const,
            data: contextSeries,
          }
          // Validate context data before using it
          if (validateContentData(contextContent)) {
            return contextContent
          }
        }
      }

      // Try SequenceContext
      if (sequenceContext?.state?.sequences) {
        const contextSequence = sequenceContext.state.sequences
        if (
          contextSequence &&
          contextSequence.nameSequence &&
          contextSequence.sequencesSeries?.length
        ) {
          const contextContent = {
            contentType: 'sequence' as const,
            data: contextSequence,
          }
          // Validate context data before using it
          if (validateContentData(contextContent)) {
            return contextContent
          }
        }
      }
    } catch (error) {
      if (enableContextIntegration) {
        console.warn('Error accessing context data for sharing:', error)
      }
    }

    // If both props and context failed validation or are unavailable, return props (even if invalid)
    // This allows the validation error to be shown to the user
    return propContent
  }, [
    props,
    asanaContext,
    seriesContext,
    sequenceContext,
    enableContextIntegration,
  ])

  // Session management compatibility validation for NextAuth integration
  const validateSessionCompatibility =
    useCallback((): SessionCompatibilityStatus => {
      const status: SessionCompatibilityStatus = {
        isSessionAware: false,
        hasUserContext: false,
        sessionState: 'unknown',
        warnings: [],
      }

      try {
        // Check if component is running in session-aware environment
        // Note: In a real implementation, you'd check for NextAuth session here
        // For now, we check if contexts are properly initialized which indicates session flow
        status.isSessionAware = Boolean(
          asanaContextRaw || seriesContextRaw || sequenceContextRaw
        )

        // Check if user context is available (would need UserContext import for full implementation)
        status.hasUserContext = false // Placeholder - in real app would check useUser() or similar

        // Determine session state based on context availability
        if (asanaContextRaw && seriesContextRaw && sequenceContextRaw) {
          status.sessionState = 'authenticated'
        } else if (
          !asanaContextRaw &&
          !seriesContextRaw &&
          !sequenceContextRaw
        ) {
          status.sessionState = 'unauthenticated'
        } else {
          status.sessionState = 'loading'
          status.warnings.push(
            'Partial context availability detected - session may be loading'
          )
        }

        // Add session-related warnings
        if (!status.isSessionAware && enableContextIntegration) {
          status.warnings.push(
            'Context integration enabled but session awareness not detected. Some user-specific features may not work.'
          )
        }

        if (
          status.sessionState === 'unauthenticated' &&
          enableContextIntegration
        ) {
          status.warnings.push(
            'Context integration enabled but user appears unauthenticated. Context data may be limited.'
          )
        }
      } catch (error) {
        status.warnings.push(
          `Session compatibility check failed: ${(error as Error).message}`
        )
      }

      return status
    }, [
      asanaContextRaw,
      seriesContextRaw,
      sequenceContextRaw,
      enableContextIntegration,
    ])

  // Session compatibility status
  const sessionCompatibility = useMemo(() => {
    return validateSessionCompatibility()
  }, [validateSessionCompatibility])

  // Enhanced content validation with context integration
  const contextValidation = React.useMemo(() => {
    return validateContextData(content)
  }, [content, validateContextData])

  // Content validation functions for use in other hooks
  const validateContent = useCallback(
    (content: ShareableContent | null): boolean => {
      return validateContentData(content)
    },
    []
  )

  // Effect to handle context validation warnings and errors
  React.useEffect(() => {
    if (!enableContextIntegration || !content) return

    // Log context validation warnings to console for development
    if (contextValidation.warnings.length > 0) {
      console.warn(
        'PoseShareButton context warnings:',
        contextValidation.warnings
      )
    }

    // Log session compatibility warnings to console for development
    if (sessionCompatibility.warnings.length > 0) {
      console.warn(
        'PoseShareButton session compatibility warnings:',
        sessionCompatibility.warnings
      )
    }

    // Handle context validation errors
    if (!contextValidation.isValid && contextValidation.errors.length > 0) {
      setShareStatus({
        type: 'error',
        message: `Data validation failed: ${contextValidation.errors.join(', ')}`,
      })
      setSnackbarOpen(true)
    }

    // Handle provider dependency chain warnings
    if (!contextValidation.contextProviderStatus.dependencyChainValid) {
      console.warn(
        'PoseShareButton provider chain incomplete:',
        contextValidation.contextProviderStatus.missingProviders
      )
    }

    // Handle session state warnings for better debugging
    if (sessionCompatibility.sessionState === 'loading') {
      console.warn(
        'PoseShareButton session state loading - context data may be incomplete'
      )
    }
  }, [
    contextValidation,
    sessionCompatibility,
    enableContextIntegration,
    content,
  ])

  // Enhanced error messaging based on content type
  const getContentSpecificErrorMessage = useCallback(
    (contentType: string, error: string): string => {
      const baseMessage = `Unable to share ${contentType}:`

      if (error.includes('AbortError')) {
        return `Sharing of ${contentType} was cancelled.`
      }

      if (error.includes('NotSupported')) {
        return `Your browser doesn't support sharing ${contentType}. Content has been copied to clipboard instead.`
      }

      if (error.includes('permission')) {
        return `Permission denied to share ${contentType}. Please check your browser settings.`
      }

      if (error.includes('network')) {
        return `Network error while sharing ${contentType}. Please check your connection and try again.`
      }

      return `${baseMessage} ${error}. Please try again.`
    },
    []
  )

  // Generate share configuration using strategy pattern with enhanced error handling
  const shareConfig = React.useMemo(() => {
    if (!content) return null

    if (!validateContent(content)) {
      console.warn('Invalid content detected:', content)
      setShareStatus({
        type: 'error',
        message: `Invalid ${content?.contentType || 'content'} data: Missing required fields`,
      })
      return null
    }

    try {
      const strategy = createShareStrategy(content.contentType)
      return strategy.generateShareConfig(content.data)
    } catch (error) {
      const errorMessage = `Error creating share strategy for ${content.contentType}: ${error}`
      console.error(errorMessage)
      setShareStatus({
        type: 'error',
        message: getContentSpecificErrorMessage(
          content.contentType,
          errorMessage
        ),
      })
      return null
    }
  }, [content, validateContent, getContentSpecificErrorMessage])

  // Helper function to get content type for accessibility
  const getContentTypeLabel = useCallback((): string => {
    if (!content) return 'content'

    switch (content.contentType) {
      case 'asana':
        return 'pose'
      case 'series':
        return 'series'
      case 'sequence':
        return 'sequence'
      default:
        return 'content'
    }
  }, [content])

  // Enhanced Web Share API feature detection
  const detectWebShareSupport = useCallback(() => {
    if (!navigator.share) return false

    // Check if the browser properly supports Web Share API
    try {
      // Some browsers have navigator.share but it's not fully functional
      return typeof navigator.share === 'function' && 'canShare' in navigator
        ? navigator.canShare({ title: 'test' })
        : true
    } catch {
      return false
    }
  }, [])

  // Enhanced clipboard copying with better cross-browser support
  const copyToClipboard = useCallback(
    async (text: string): Promise<boolean> => {
      try {
        // Modern clipboard API (preferred)
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(text)
          return true
        }

        // Fallback for older browsers or non-secure contexts
        if (
          document.queryCommandSupported &&
          document.queryCommandSupported('copy')
        ) {
          const textArea = document.createElement('textarea')
          textArea.value = text
          textArea.style.position = 'fixed'
          textArea.style.left = '-999999px'
          textArea.style.top = '-999999px'
          textArea.setAttribute('readonly', '')
          textArea.setAttribute('aria-hidden', 'true')
          document.body.appendChild(textArea)

          textArea.focus()
          textArea.select()

          const successful = document.execCommand('copy')
          document.body.removeChild(textArea)

          return successful
        }

        return false
      } catch (error) {
        console.warn('Clipboard copy failed:', error)
        return false
      }
    },
    []
  )

  // Enhanced Web Share API call with timeout and retry logic
  const shareWithNativeAPI = useCallback(
    async (shareData: {
      title: string
      text: string
      url: string
    }): Promise<{ success: boolean; error?: string }> => {
      try {
        // Create a timeout promise to handle unresponsive share dialogs
        const sharePromise = navigator.share(shareData)
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('Share timeout')), 10000) // 10 second timeout
        })

        await Promise.race([sharePromise, timeoutPromise])
        return { success: true }
      } catch (error) {
        const errorMessage = (error as Error).message || 'Unknown error'

        // Handle specific error types
        if (
          errorMessage.includes('AbortError') ||
          errorMessage.includes('cancelled')
        ) {
          // User cancelled - this is not an error
          return { success: false, error: 'cancelled' }
        }

        if (errorMessage.includes('timeout')) {
          return {
            success: false,
            error: 'Share dialog timed out. Please try again.',
          }
        }

        if (errorMessage.includes('NotAllowedError')) {
          return {
            success: false,
            error:
              'Sharing not allowed. Please check your browser permissions.',
          }
        }

        if (errorMessage.includes('NotSupportedError')) {
          return {
            success: false,
            error: 'This content type is not supported for sharing.',
          }
        }

        return { success: false, error: errorMessage }
      }
    },
    []
  )

  const handleShare = useCallback(async () => {
    if (!shareConfig || !content) {
      const errorMsg = !content
        ? 'No content available to share'
        : 'Share configuration is not available'

      setShareStatus({
        type: 'error',
        message: errorMsg,
      })
      setSnackbarOpen(true)
      return
    }

    const contentTypeLabel = getContentTypeLabel()
    setIsSharing(true)

    try {
      const shareData = {
        title: shareConfig.title,
        text: shareConfig.text,
        url: shareConfig.url,
      }

      // Enhanced Web Share API detection and usage
      if (detectWebShareSupport()) {
        // Check if the content can be shared (if canShare is available)
        const canShare =
          'canShare' in navigator ? navigator.canShare(shareData) : true

        if (canShare) {
          const shareResult = await shareWithNativeAPI(shareData)

          if (shareResult.success) {
            setShareStatus({
              type: 'success',
              message: `${contentTypeLabel.charAt(0).toUpperCase() + contentTypeLabel.slice(1)} shared successfully!`,
            })
            setSnackbarOpen(true)
            return
          } else if (shareResult.error === 'cancelled') {
            // User cancelled - don't show error
            console.log('User cancelled sharing')
            return
          } else {
            // Fall through to clipboard backup
            console.warn('Native sharing failed:', shareResult.error)
            throw new Error(shareResult.error || 'Native sharing failed')
          }
        }
      }

      // Enhanced clipboard fallback with better user feedback
      const shareText = `${shareConfig.title}\n${shareConfig.text}\n${shareConfig.url}`
      const clipboardSuccess = await copyToClipboard(shareText)

      if (clipboardSuccess) {
        setShareStatus({
          type: 'info',
          message: `${contentTypeLabel.charAt(0).toUpperCase() + contentTypeLabel.slice(1)} copied to clipboard! You can now paste it anywhere to share.`,
        })
      } else {
        // Ultimate fallback - show share text for manual copying
        setShareStatus({
          type: 'warning',
          message: `Unable to copy automatically. Please copy this text manually: ${shareText.substring(0, 100)}...`,
        })
      }
      setSnackbarOpen(true)
    } catch (error) {
      const errorMessage = (error as Error).message || 'Unknown error'

      // Enhanced error handling with recovery options
      const specificError = getContentSpecificErrorMessage(
        content.contentType,
        errorMessage
      )
      console.error('Error sharing content:', error)

      // Try clipboard as recovery option if native sharing fails
      if (
        !errorMessage.includes('clipboard') &&
        !errorMessage.includes('copy')
      ) {
        try {
          const shareText = `${shareConfig.title}\n${shareConfig.text}\n${shareConfig.url}`
          const clipboardSuccess = await copyToClipboard(shareText)

          if (clipboardSuccess) {
            setShareStatus({
              type: 'info',
              message: `Sharing failed, but ${contentTypeLabel} was copied to clipboard as backup.`,
            })
          } else {
            setShareStatus({
              type: 'error',
              message: specificError,
            })
          }
        } catch {
          setShareStatus({
            type: 'error',
            message: specificError,
          })
        }
      } else {
        setShareStatus({
          type: 'error',
          message: specificError,
        })
      }
      setSnackbarOpen(true)
    } finally {
      setIsSharing(false)
    }
  }, [
    shareConfig,
    content,
    getContentSpecificErrorMessage,
    getContentTypeLabel,
    detectWebShareSupport,
    shareWithNativeAPI,
    copyToClipboard,
  ])

  // Close snackbar handler
  const handleSnackbarClose = useCallback(() => {
    setSnackbarOpen(false)
  }, [])

  // Helper function to get display title
  const getDisplayTitle = (): string => {
    if (!content) return 'Unknown Content'

    switch (content.contentType) {
      case 'asana':
        return (content.data as AsanaPose).sort_english_name || 'Asana'
      case 'series':
        return (content.data as FlowSeriesData).seriesName || 'Series'
      case 'sequence':
        return (content.data as SequenceData).nameSequence || 'Sequence'
      default:
        return 'Content'
    }
  }

  // Helper function to get display description
  const getDisplayDescription = (): string => {
    if (!content) return 'No description available'

    switch (content.contentType) {
      case 'asana':
        return (
          (content.data as AsanaPose).description || 'No description available'
        )
      case 'series':
        return (
          (content.data as FlowSeriesData).description ||
          'No description available'
        )
      case 'sequence':
        return (
          (content.data as SequenceData).description ||
          'No description available'
        )
      default:
        return 'No description available'
    }
  }

  return (
    <Box>
      {content && shareConfig ? (
        <>
          {showDetails && (
            <Box sx={{ mb: 2 }}>
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: '1.25rem', sm: '1.5rem' },
                  fontWeight: 600,
                  mb: 1,
                }}
              >
                {getDisplayTitle()}
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  lineHeight: 1.6,
                }}
              >
                {getDisplayDescription()}
              </Typography>
            </Box>
          )}

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Typography
              variant="body1"
              sx={{
                color: 'text.primary',
                fontWeight: 500,
              }}
            >
              Share: {getDisplayTitle()}
            </Typography>
            <Tooltip
              title={`Share this ${getContentTypeLabel()}`}
              placement="top"
            >
              <IconButton
                disableRipple
                disabled={isSharing}
                sx={{
                  color: 'primary.contrastText',
                  position: 'relative',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  },
                  '&.Mui-disabled': {
                    color: 'rgba(255, 255, 255, 0.5)',
                  },
                }}
                onClick={handleShare}
                aria-label={`Share this ${getContentTypeLabel()}`}
                aria-describedby={shareStatus.type ? 'share-status' : undefined}
              >
                {isSharing ? (
                  <CircularProgress
                    size={24}
                    sx={{ color: 'inherit' }}
                    aria-label="Sharing in progress"
                  />
                ) : (
                  <IosShareIcon />
                )}
              </IconButton>
            </Tooltip>
          </Box>
        </>
      ) : (
        <Box sx={{ p: 2 }}>
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              fontStyle: 'italic',
              textAlign: 'center',
            }}
            role="alert"
            aria-live="polite"
          >
            {content === null || !shareConfig
              ? 'No data available to share.'
              : 'Content is loading...'}
          </Typography>
        </Box>
      )}

      {/* Enhanced Snackbar for user feedback */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{
          zIndex: (theme) => theme.zIndex.snackbar + 1,
          '& .MuiSnackbarContent-root': {
            minWidth: '300px',
          },
        }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={shareStatus.type || 'info'}
          variant="filled"
          sx={{
            width: '100%',
            '& .MuiAlert-message': {
              fontSize: '0.9rem',
              lineHeight: 1.4,
            },
          }}
          id="share-status"
          role="status"
          aria-live="polite"
        >
          {shareStatus.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default PoseShareButton
