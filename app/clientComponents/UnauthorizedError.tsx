'use client'

import {
  Alert,
  AlertTitle,
  Button,
  Snackbar,
  Stack,
  type SxProps,
  type Theme,
} from '@mui/material'
import LockIcon from '@mui/icons-material/Lock'
import { useNavigationWithLoading } from '@app/hooks/useNavigationWithLoading'
import NAV_PATHS from '@app/utils/navigation/constants'
import { COLORS } from '../../styles/theme'

export interface UnauthorizedErrorProps {
  /**
   * Whether the error is currently shown
   */
  open: boolean

  /**
   * Callback to close the error message
   */
  onClose: () => void

  /**
   * Optional custom error message
   */
  message?: string

  /**
   * Optional action type to provide contextual guidance
   */
  actionType?: 'edit' | 'delete' | 'create' | 'view'

  /**
   * Whether content is PUBLIC or user-owned
   */
  contentType?: 'PUBLIC' | 'personal'

  /**
   * Auto-hide duration in milliseconds
   * @default 6000
   */
  autoHideDuration?: number

  /**
   * Optional additional styles
   */
  sx?: SxProps<Theme>
}

/**
 * UnauthorizedError Component
 *
 * Displays user-friendly error messages for 403 authorization failures.
 * Provides contextual guidance based on the type of action attempted.
 *
 * @example
 * ```tsx
 * const [showError, setShowError] = useState(false)
 *
 * try {
 *   await updatePose(poseId, data)
 * } catch (error) {
 *   if (error.status === 403) {
 *     setShowError(true)
 *   }
 * }
 *
 * <UnauthorizedError
 *   open={showError}
 *   onClose={() => setShowError(false)}
 *   actionType="edit"
 *   contentType="PUBLIC"
 * />
 * ```
 */
export default function UnauthorizedError({
  open,
  onClose,
  message,
  actionType = 'edit',
  contentType,
  autoHideDuration = 6000,
  sx,
}: UnauthorizedErrorProps) {
  const router = useNavigationWithLoading()

  // Generate contextual error message
  const getErrorMessage = () => {
    if (message) return message

    if (contentType === 'PUBLIC') {
      switch (actionType) {
        case 'edit':
          return 'PUBLIC content can only be edited by administrators.'
        case 'delete':
          return 'PUBLIC content can only be deleted by administrators.'
        case 'create':
          return 'You do not have permission to create PUBLIC content.'
        default:
          return 'You do not have permission to modify PUBLIC content.'
      }
    }

    if (contentType === 'personal') {
      return 'You can only modify your own content.'
    }

    // Generic message
    switch (actionType) {
      case 'edit':
        return 'You do not have permission to edit this content.'
      case 'delete':
        return 'You do not have permission to delete this content.'
      case 'create':
        return 'You do not have permission to create this content.'
      case 'view':
        return 'You do not have permission to view this content.'
      default:
        return 'You do not have permission to perform this action.'
    }
  }

  const getActionGuidance = () => {
    if (contentType === 'PUBLIC') {
      return 'To modify PUBLIC content, contact an administrator or create your own personal version.'
    }

    if (contentType === 'personal') {
      return 'Create your own content to customize your yoga practice.'
    }

    return 'Sign in with an authorized account or create your own content.'
  }

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      sx={{ mt: 8, ...sx }}
    >
      <Alert
        onClose={onClose}
        severity="error"
        variant="filled"
        icon={<LockIcon />}
        sx={{
          width: '100%',
          maxWidth: 500,
        }}
      >
        <AlertTitle sx={{ fontWeight: 600 }}>Authorization Required</AlertTitle>
        <Stack spacing={1.5}>
          <div>{getErrorMessage()}</div>
          <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>
            {getActionGuidance()}
          </div>
          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            <Button
              size="small"
              variant="outlined"
              sx={{
                color: 'white',
                borderColor: COLORS.overlayWhiteStrong,
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: COLORS.overlayWhiteSoft,
                },
              }}
              onClick={() => {
                onClose()
                router.push(NAV_PATHS.CREATE_ASANA)
              }}
            >
              Create Your Own
            </Button>
            <Button
              size="small"
              variant="outlined"
              sx={{
                color: 'white',
                borderColor: COLORS.overlayWhiteStrong,
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: COLORS.overlayWhiteSoft,
                },
              }}
              onClick={onClose}
            >
              Dismiss
            </Button>
          </Stack>
        </Stack>
      </Alert>
    </Snackbar>
  )
}
