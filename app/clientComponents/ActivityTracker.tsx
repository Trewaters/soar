'use client'
import React, { useState, useEffect } from 'react'
import { useSession, signIn } from 'next-auth/react'
import {
  Button,
  Stack,
  Chip,
  Typography,
  FormControlLabel,
  Checkbox,
  Box,
  Paper,
} from '@mui/material'
import type { ActivityTrackerProps, EntityType } from './ActivityTracker.types'

/**
 * Get default title based on entity type
 */
const getDefaultTitle = (entityType: EntityType): string => {
  switch (entityType) {
    case 'asana':
      return 'Track Your Practice'
    case 'flow':
      return 'Track Your Practice'
    case 'sequence':
      return 'Track Your Sequence Practice'
    default:
      return 'Track Your Practice'
  }
}

/**
 * Get default button label based on entity type
 */
const getDefaultButtonLabel = (entityType: EntityType): string => {
  switch (entityType) {
    case 'asana':
      return 'Track this pose'
    case 'flow':
      return 'Track Flow Practice'
    case 'sequence':
      return 'Track Sequence Practice'
    default:
      return 'Track Practice'
  }
}

export default function ActivityTracker({
  entityId,
  entityName,
  entityType,
  checkActivity,
  createActivity,
  deleteActivity,
  variant = 'card',
  title,
  showSuccessMessage,
  buttonLabel,
  onActivityToggle,
  onActivityRefresh,
  additionalActivityData = {},
}: ActivityTrackerProps) {
  const { data: session } = useSession()

  // State management
  const [checked, setChecked] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(
    null
  )
  const [easyChipVariant, setEasyChipVariant] = useState<'filled' | 'outlined'>(
    'outlined'
  )
  const [averageChipVariant, setAverageChipVariant] = useState<
    'filled' | 'outlined'
  >('outlined')
  const [difficultChipVariant, setDifficultChipVariant] = useState<
    'filled' | 'outlined'
  >('outlined')

  // Determine defaults based on variant and entityType
  const displayTitle = title || getDefaultTitle(entityType)
  const displayButtonLabel = buttonLabel || getDefaultButtonLabel(entityType)
  const displayShowSuccessMessage =
    showSuccessMessage !== undefined ? showSuccessMessage : variant === 'card'

  // Check existing activity on mount and automatically at midnight
  useEffect(() => {
    // Listen for service worker invalidation messages and refresh local state
    const swMessageHandler = (ev: any) => {
      const data = ev?.data || (ev && ev.detail) || null
      if (!data) return
      try {
        if (data.command === 'INVALIDATE_URLS' && Array.isArray(data.urls)) {
          const matches = data.urls.filter((u: string) =>
            u.includes('/api/asanaActivity')
          )
          if (matches.length === 0) return
          // If any invalidated URL mentions our entityId, re-run the check
          const matchedForThisEntity = matches.some((u: string) =>
            u.includes(entityId)
          )
          if (matchedForThisEntity) {
            console.debug(
              '[ActivityTracker] SW invalidation for entity detected',
              { entityId, urls: matches }
            )
            // Re-check activity and update UI
            ;(async () => {
              try {
                if (!session?.user?.id) return
                const res = await checkActivity(session.user.id, entityId)
                console.debug(
                  '[ActivityTracker] post-invalidation check result',
                  { exists: !!res?.exists }
                )
                setChecked(res.exists)
                if (res.exists && res.activity?.difficulty) {
                  setSelectedDifficulty(res.activity.difficulty)
                }
              } catch (e) {
                console.warn(
                  '[ActivityTracker] post-invalidation recheck failed',
                  e
                )
              }
            })()
          }
        }
      } catch (e) {
        // ignore
      }
    }

    try {
      if (
        navigator &&
        navigator.serviceWorker &&
        navigator.serviceWorker.addEventListener
      ) {
        navigator.serviceWorker.addEventListener('message', swMessageHandler)
      }
      window.addEventListener('message', swMessageHandler)
      // Also listen for our rebroadcasted custom event from ServiceWorkerRegister
      window.addEventListener(
        'soar:sw-invalidate',
        swMessageHandler as EventListener
      )
    } catch (e) {
      console.warn('[ActivityTracker] failed to attach SW message listener', e)
    }
    const checkExistingActivity = async () => {
      if (!session?.user?.id || !entityId) return

      try {
        const result = await checkActivity(session.user.id, entityId)
        setChecked(result.exists)

        // Set difficulty state based on existing activity
        if (result.exists && result.activity?.difficulty) {
          setSelectedDifficulty(result.activity.difficulty)
          // Set the appropriate chip variant
          if (result.activity.difficulty === 'easy') {
            setEasyChipVariant('filled')
            setAverageChipVariant('outlined')
            setDifficultChipVariant('outlined')
          } else if (result.activity.difficulty === 'average') {
            setEasyChipVariant('outlined')
            setAverageChipVariant('filled')
            setDifficultChipVariant('outlined')
          } else if (result.activity.difficulty === 'difficult') {
            setEasyChipVariant('outlined')
            setAverageChipVariant('outlined')
            setDifficultChipVariant('filled')
          }
        } else {
          // Reset difficulty state if no activity or no difficulty stored
          setSelectedDifficulty(null)
          setEasyChipVariant('outlined')
          setAverageChipVariant('outlined')
          setDifficultChipVariant('outlined')
        }
      } catch (err) {
        console.error('Error checking existing activity:', err)
        // Don't show error to user for this check, just default to unchecked
      }
    }

    // Initial check on mount
    checkExistingActivity()

    // Set up a minute-based interval to detect local midnight.
    // This avoids long-running single-shot timers while still refreshing once per day.
    let lastCheckedDate = new Date().getDate()
    const intervalId = window.setInterval(() => {
      const nowCheck = new Date()
      if (nowCheck.getDate() !== lastCheckedDate) {
        lastCheckedDate = nowCheck.getDate()
        checkExistingActivity()
      }
    }, 60 * 1000)

    // Cleanup timer + listeners on unmount
    return () => {
      clearInterval(intervalId)
      try {
        if (
          navigator &&
          navigator.serviceWorker &&
          navigator.serviceWorker.removeEventListener
        ) {
          navigator.serviceWorker.removeEventListener(
            'message',
            swMessageHandler
          )
        }
        window.removeEventListener('message', swMessageHandler)
        window.removeEventListener(
          'soar:sw-invalidate',
          swMessageHandler as EventListener
        )
      } catch (e) {
        // ignore
      }
    }
  }, [session?.user?.id, entityId, checkActivity])

  /**
   * Handle difficulty selection (for card variant with simpler API)
   */
  const handleDifficultySelect = (
    difficulty: 'easy' | 'average' | 'difficult'
  ) => {
    setSelectedDifficulty(difficulty)
    setEasyChipVariant(difficulty === 'easy' ? 'filled' : 'outlined')
    setAverageChipVariant(difficulty === 'average' ? 'filled' : 'outlined')
    setDifficultChipVariant(difficulty === 'difficult' ? 'filled' : 'outlined')
  }

  /**
   * Handle Easy chip click (for inline variant with toggle behavior)
   */
  const handleEasyChipClick = async () => {
    const newVariant = easyChipVariant === 'outlined' ? 'filled' : 'outlined'
    setEasyChipVariant(newVariant)

    if (newVariant === 'filled') {
      setSelectedDifficulty('easy')
      // Reset other chips
      setAverageChipVariant('outlined')
      setDifficultChipVariant('outlined')
      // For chips variant, save the activity
      if (variant === 'chips') {
        await updateActivityState(true, 'easy')
      }
    } else {
      setSelectedDifficulty(null)
    }
  }

  /**
   * Handle Average chip click (for inline variant with toggle behavior)
   */
  const handleAverageChipClick = async () => {
    const newVariant = averageChipVariant === 'outlined' ? 'filled' : 'outlined'
    setAverageChipVariant(newVariant)

    if (newVariant === 'filled') {
      setSelectedDifficulty('average')
      // Reset other chips
      setEasyChipVariant('outlined')
      setDifficultChipVariant('outlined')
      // For chips variant, save the activity
      if (variant === 'chips') {
        await updateActivityState(true, 'average')
      }
    } else {
      setSelectedDifficulty(null)
    }
  }

  /**
   * Handle Difficult chip click (for inline variant with toggle behavior)
   */
  const handleDifficultChipClick = async () => {
    const newVariant =
      difficultChipVariant === 'outlined' ? 'filled' : 'outlined'
    setDifficultChipVariant(newVariant)

    if (newVariant === 'filled') {
      setSelectedDifficulty('difficult')
      // Reset other chips
      setEasyChipVariant('outlined')
      setAverageChipVariant('outlined')
      // For chips variant, save the activity
      if (variant === 'chips') {
        await updateActivityState(true, 'difficult')
      }
    } else {
      setSelectedDifficulty(null)
    }
  }

  /**
   * Clears the selected difficulty and resets chip UI variants to their default 'outlined' state.
   *
   * This asynchronous handler performs local UI state resets (clears the selected difficulty and
   * sets the easy/average/difficult chip variants to 'outlined'). If the component is using the
   * 'chips' variant, it also awaits updateActivityState(false) to mark the activity as not active.
   *
   * @async
   * @returns {Promise<void>} Resolves when local state updates are applied and any remote activity state update (if triggered) completes.
   * @throws {Error} May reject if updateActivityState(false) fails.
   */
  const handleClearChips = async () => {
    setSelectedDifficulty(null)
    setEasyChipVariant('outlined')
    setAverageChipVariant('outlined')
    setDifficultChipVariant('outlined')
    // Delete the activity when clearing in chips variant
    if (variant === 'chips') {
      await updateActivityState(false)
    }
  }

  /**
   * Update activity state (create or delete)
   */
  const updateActivityState = async (
    isChecked: boolean,
    difficulty?: string | null
  ) => {
    const wasChecked = checked
    setChecked(isChecked)

    if (!session?.user?.id) {
      const errorMessage = 'Please log in to track your activity'
      setError(errorMessage)
      setChecked(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      if (isChecked) {
        // If we're marking as checked, and it was already checked (replacement for today),
        // we must delete the old one first to ensure only one activity per day is tracked.
        if (wasChecked) {
          console.debug(
            '[ActivityTracker] replacing existing activity for today'
          )
          await deleteActivity(session.user.id, entityId)
        }

        // Create new activity
        // Use dynamic naming for all entity types: asanaId/asanaName, seriesId/seriesName, sequenceId/sequenceName
        const activityData: any = {
          userId: session.user.id,
          difficulty: difficulty ?? (selectedDifficulty || undefined),
          completionStatus: 'complete',
          datePerformed: new Date(),
          ...additionalActivityData,
        }

        // Add dynamic entity fields for all types (unified approach)
        activityData[`${entityType}Id`] = entityId
        activityData[`${entityType}Name`] = entityName

        console.debug('[ActivityTracker] creating activity', { activityData })
        await createActivity(activityData)
        console.debug('[ActivityTracker] createActivity resolved')

        // Optimistic UI already set `checked` above. Run an authoritative
        // check in the background to confirm server-side persistence and
        // populate difficulty from the authoritative source. Retry a couple
        // times if the first check doesn't show the new activity (race/timing).
        ;(async () => {
          try {
            const userId = session?.user?.id
            if (!userId) return
            console.debug(
              '[ActivityTracker] running post-create authoritative check'
            )
            const res = await checkActivity(userId, entityId)
            console.debug(
              '[ActivityTracker] post-create authoritative check result',
              { exists: !!res?.exists }
            )
            if (res?.exists) {
              setChecked(true)
              if (res.activity?.difficulty)
                setSelectedDifficulty(res.activity.difficulty)
            } else {
              // invalidation or background sync for eventual consistency.
              const additionalChecks = 2
              for (let i = 0; i < additionalChecks; i++) {
                const r2 = await checkActivity(userId, entityId)
                console.debug(
                  '[ActivityTracker] post-create immediate retry check',
                  {
                    attempt: i + 1,
                    exists: !!r2?.exists,
                  }
                )
                if (r2?.exists) {
                  setChecked(true)
                  if (r2.activity?.difficulty)
                    setSelectedDifficulty(r2.activity.difficulty)
                  break
                }
              }
            }
          } catch (e) {
            console.warn(
              '[ActivityTracker] post-create authoritative check failed',
              e
            )
          }
        })()

        // Trigger callbacks
        onActivityToggle?.(true)
        onActivityRefresh?.()
      } else {
        // Delete existing activity
        await deleteActivity(session.user.id, entityId)

        // Reset difficulty selection when activity is removed
        setSelectedDifficulty(null)
        setEasyChipVariant('outlined')
        setAverageChipVariant('outlined')
        setDifficultChipVariant('outlined')

        // Run a background check to confirm deletion and log if it still exists
        ;(async () => {
          try {
            const userId = session?.user?.id
            if (!userId) return
            console.debug(
              '[ActivityTracker] running post-delete authoritative check'
            )
            const res = await checkActivity(userId, entityId)
            console.debug(
              '[ActivityTracker] post-delete authoritative check result',
              { exists: !!res?.exists }
            )
            if (res?.exists) {
              // If still exists, log a warning — revalidation or SW path may be lagging
              console.warn(
                '[ActivityTracker] activity still exists after delete; may need revalidation',
                { entityId }
              )
            }
          } catch (e) {
            console.warn(
              '[ActivityTracker] post-delete authoritative check failed',
              e
            )
          }
        })()

        // Trigger callbacks
        onActivityToggle?.(false)
        onActivityRefresh?.()
      }
    } catch (e: any) {
      console.error('[ActivityTracker] updateActivityState error', e)
      setError(e.message || 'Failed to update activity')
      setChecked(!isChecked) // Revert checkbox state on error
    } finally {
      setLoading(false)
    }
  }

  /**
   * Handle button toggle
   */
  const handleButtonToggle = async () => {
    await updateActivityState(!checked)
  }

  /**
   * Handle checkbox change
   */
  const handleCheckboxChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const isChecked = event.target.checked
    await updateActivityState(isChecked)
  }

  // Show login prompt for unauthenticated users
  if (!session?.user?.id) {
    return (
      <Paper
        elevation={variant === 'card' ? 2 : 0}
        sx={{
          p: variant === 'card' ? 3 : 2,
          textAlign: 'center',
          backgroundColor:
            variant === 'card' ? 'background.paper' : 'transparent',
          borderRadius: variant === 'card' ? 2 : 1,
          border: variant === 'card' ? '1px solid' : 'none',
          borderColor: 'divider',
        }}
      >
        <Stack alignItems="center" spacing={1}>
          <Typography variant="body2" color="text.secondary">
            Log in to track your practice and build your streak
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => signIn()}
            sx={{ textTransform: 'none' }}
          >
            Login
          </Button>
        </Stack>
      </Paper>
    )
  }

  // Determine which click handler to use based on variant
  const getChipClickHandler = (
    difficulty: 'easy' | 'average' | 'difficult'
  ) => {
    if (variant === 'inline' || variant === 'chips') {
      // Inline and chips variants use toggle behavior
      switch (difficulty) {
        case 'easy':
          return handleEasyChipClick
        case 'average':
          return handleAverageChipClick
        case 'difficult':
          return handleDifficultChipClick
      }
    } else {
      // Card variant uses select behavior
      return () => handleDifficultySelect(difficulty)
    }
  }

  // Determine button label based on state
  let buttonText = displayButtonLabel
  if (loading) {
    buttonText = 'Saving...'
  } else if (checked) {
    buttonText = 'Tracked in Activity'
  }

  /**
   * Render difficulty chips section
   */
  const renderDifficultyChips = () => (
    <Box
      textAlign={'center'}
      display="flex"
      flexDirection={variant === 'chips' ? 'row' : 'column'}
      alignItems="center"
    >
      <Typography variant="subtitle1" color="text.secondary" sx={{ mr: 4 }}>
        {variant === 'card'
          ? `How was this ${entityType === 'sequence' ? 'sequence' : 'practice'} for you?`
          : variant === 'chips'
            ? 'Track Activity: '
            : 'Difficulty (sets activity tracker difficulty)'}
      </Typography>
      <Stack direction="row" spacing={1} justifyContent="center">
        <Chip
          label="Easy"
          variant={easyChipVariant}
          color="success"
          onClick={getChipClickHandler('easy')}
          disabled={loading}
          size="medium"
          sx={{
            cursor: 'pointer',
            fontWeight: easyChipVariant === 'filled' ? 700 : 400,
            '& .MuiChip-label': {
              color: easyChipVariant === 'filled' ? 'white' : 'inherit',
            },
          }}
        />
        <Chip
          label="Average"
          variant={averageChipVariant}
          color="info"
          onClick={getChipClickHandler('average')}
          disabled={loading}
          size="medium"
          sx={{
            cursor: 'pointer',
            fontWeight: averageChipVariant === 'filled' ? 700 : 400,
            '& .MuiChip-label': {
              color: averageChipVariant === 'filled' ? 'white' : 'inherit',
            },
          }}
        />
        <Chip
          label="Difficult"
          variant={difficultChipVariant}
          color="error"
          onClick={getChipClickHandler('difficult')}
          disabled={loading}
          size="medium"
          sx={{
            cursor: 'pointer',
            fontWeight: difficultChipVariant === 'filled' ? 700 : 400,
            '& .MuiChip-label': {
              color: difficultChipVariant === 'filled' ? 'white' : 'inherit',
            },
          }}
        />
      </Stack>
    </Box>
  )

  /**
   * Render activity toggle controls
   */
  const renderActivityControls = () => (
    <Stack
      direction="row"
      spacing={2}
      alignItems="center"
      justifyContent="center"
    >
      <Button
        variant={checked ? 'contained' : 'outlined'}
        color={checked ? 'success' : 'primary'}
        onClick={handleButtonToggle}
        disabled={loading}
        sx={{ minWidth: '200px', textTransform: 'none' }}
      >
        {buttonText}
      </Button>

      <FormControlLabel
        control={
          <Checkbox
            checked={checked}
            onChange={handleCheckboxChange}
            disabled={loading}
          />
        }
        label=""
        sx={{ m: 0 }}
      />
    </Stack>
  )

  /**
   * Render error message
   */
  const renderError = () => {
    if (!error) return null

    return (
      <Typography variant="body2" color="error" textAlign="center">
        {error}
      </Typography>
    )
  }

  /**
   * Render success message
   */
  const renderSuccessMessage = () => {
    if (!displayShowSuccessMessage || !checked) return null

    return (
      <Typography variant="caption" color="success.main" textAlign="center">
        Great job! This {entityType} practice has been added to your activity
        tracker.
      </Typography>
    )
  }

  /**
   * Render inline variant
   */
  if (variant === 'inline') {
    return (
      <Stack spacing={2}>
        {renderDifficultyChips()}
        {renderActivityControls()}
        {renderError()}
      </Stack>
    )
  }

  /**
   * Render chips variant - only shows difficulty chips and a clear button
   */
  if (variant === 'chips') {
    return (
      <Stack
        spacing={2}
        direction="column"
        alignItems="center"
        justifyContent="space-between"
      >
        {renderDifficultyChips()}
        {selectedDifficulty && (
          <Button
            variant="contained"
            color="secondary"
            onClick={handleClearChips}
            disabled={loading}
            fullWidth
            size="small"
            sx={{ textTransform: 'none' }}
          >
            Clear activity
          </Button>
        )}
        {renderError()}
      </Stack>
    )
  }

  /**
   * Render card variant
   */
  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        backgroundColor: 'background.paper',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Stack spacing={2}>
        {displayTitle && (
          <Typography variant="h6" textAlign="center" fontWeight="bold">
            {displayTitle}
          </Typography>
        )}

        {renderDifficultyChips()}
        {renderActivityControls()}
        {renderError()}
        {renderSuccessMessage()}
      </Stack>
    </Paper>
  )
}
