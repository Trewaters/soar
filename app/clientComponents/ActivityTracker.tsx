'use client'
/**
 * Unified Activity Tracker Component
 *
 * Consolidates activity tracking for asanas, series, and sequences into a single
 * reusable component. Supports both inline and card variants with configurable
 * difficulty selection and activity persistence.
 *
 * @example Asana (Inline Variant)
 * ```tsx
 * <ActivityTracker
 *   entityId={pose.id.toString()}
 *   entityName={pose.sort_english_name}
 *   entityType="asana"
 *   variant="inline"
 *   checkActivity={checkActivityExists}
 *   createActivity={createAsanaActivity}
 *   deleteActivity={deleteAsanaActivity}
 *   onActivityRefresh={() => setActivityRefreshTrigger(prev => prev + 1)}
 *   additionalActivityData={{ sort_english_name: pose.sort_english_name, duration: 0 }}
 * />
 * ```
 *
 * @example Series (Card Variant)
 * ```tsx
 * <ActivityTracker
 *   entityId={series.id}
 *   entityName={series.name}
 *   entityType="series"
 *   variant="card"
 *   checkActivity={checkSeriesActivityExists}
 *   createActivity={createSeriesActivity}
 *   deleteActivity={deleteSeriesActivity}
 *   title="Track Your Practice"
 *   buttonLabel="Track Series Practice"
 *   showSuccessMessage={true}
 * />
 * ```
 */
import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
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
    case 'series':
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
      return 'Mark for Activity Tracker'
    case 'series':
      return 'Track Series Practice'
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
        console.debug('[ActivityTracker] checkExistingActivity', {
          userId: session.user.id,
          entityId,
        })
        const result = await checkActivity(session.user.id, entityId)
        console.debug('[ActivityTracker] checkExistingActivity result', {
          exists: !!result?.exists,
        })
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

    // Set up automatic refresh at local midnight
    const scheduleNextMidnightRefresh = () => {
      const now = new Date()
      const nextMidnight = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
        0,
        0,
        0,
        0
      )
      const msUntilMidnight = nextMidnight.getTime() - now.getTime()

      return setTimeout(() => {
        checkExistingActivity()
        // Schedule next refresh for the following midnight
        scheduleNextMidnightRefresh()
      }, msUntilMidnight)
    }

    const midnightTimer = scheduleNextMidnightRefresh()

    // Cleanup timer + listeners on unmount
    return () => {
      clearTimeout(midnightTimer)
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
  const handleEasyChipClick = () => {
    const newVariant = easyChipVariant === 'outlined' ? 'filled' : 'outlined'
    setEasyChipVariant(newVariant)

    if (newVariant === 'filled') {
      setSelectedDifficulty('easy')
      // Reset other chips
      setAverageChipVariant('outlined')
      setDifficultChipVariant('outlined')
    } else {
      setSelectedDifficulty(null)
    }
  }

  /**
   * Handle Average chip click (for inline variant with toggle behavior)
   */
  const handleAverageChipClick = () => {
    const newVariant = averageChipVariant === 'outlined' ? 'filled' : 'outlined'
    setAverageChipVariant(newVariant)

    if (newVariant === 'filled') {
      setSelectedDifficulty('average')
      // Reset other chips
      setEasyChipVariant('outlined')
      setDifficultChipVariant('outlined')
    } else {
      setSelectedDifficulty(null)
    }
  }

  /**
   * Handle Difficult chip click (for inline variant with toggle behavior)
   */
  const handleDifficultChipClick = () => {
    const newVariant =
      difficultChipVariant === 'outlined' ? 'filled' : 'outlined'
    setDifficultChipVariant(newVariant)

    if (newVariant === 'filled') {
      setSelectedDifficulty('difficult')
      // Reset other chips
      setEasyChipVariant('outlined')
      setAverageChipVariant('outlined')
    } else {
      setSelectedDifficulty(null)
    }
  }

  /**
   * Update activity state (create or delete)
   */
  const updateActivityState = async (isChecked: boolean) => {
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
        // Create new activity
        // Use dynamic naming for all entity types: asanaId/asanaName, seriesId/seriesName, sequenceId/sequenceName
        const activityData: any = {
          userId: session.user.id,
          difficulty: selectedDifficulty || undefined,
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
              // Retry strategy: short backoff retries to account for propagation delays
              const retries = [500, 1500]
              for (const ms of retries) {
                await new Promise((r) => setTimeout(r, ms))
                const r2 = await checkActivity(userId, entityId)
                console.debug('[ActivityTracker] post-create retry check', {
                  ms,
                  exists: !!r2?.exists,
                })
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
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Log in to track your practice and build your streak
        </Typography>
      </Paper>
    )
  }

  // Determine which click handler to use based on variant
  const getChipClickHandler = (
    difficulty: 'easy' | 'average' | 'difficult'
  ) => {
    if (variant === 'inline') {
      // Inline variant uses toggle behavior
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
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        {variant === 'card'
          ? `How was this ${entityType === 'sequence' ? 'sequence' : 'practice'} for you?`
          : 'Difficulty (sets activity tracker difficulty)'}
      </Typography>
      <Stack
        direction="row"
        spacing={1}
        justifyContent={variant === 'card' ? 'center' : 'flex-start'}
      >
        <Chip
          label="Easy"
          variant={easyChipVariant}
          color="success"
          onClick={getChipClickHandler('easy')}
          size="small"
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
          size="small"
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
          size="small"
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
      justifyContent={variant === 'card' ? 'center' : 'flex-start'}
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
