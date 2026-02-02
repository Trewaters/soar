'use client'
import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Paper,
  Chip,
  Stack,
  Divider,
  Tooltip,
} from '@mui/material'
import { useSession } from 'next-auth/react'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import WbSunnyIcon from '@mui/icons-material/WbSunny'
import WbTwilightIcon from '@mui/icons-material/WbTwilight'
import NightsStayIcon from '@mui/icons-material/NightsStay'
import LoadingSkeleton from '@app/clientComponents/LoadingSkeleton'
import {
  getAsanaWeeklyActivity,
  type WeeklyActivityData as AsanaWeeklyActivityData,
} from '@lib/asanaActivityClientService'
import {
  getSeriesWeeklyActivity,
  type WeeklySeriesActivityData,
} from '@lib/seriesActivityClientService'
import {
  getSequenceWeeklyActivity,
  type WeeklySequenceActivityData,
} from '@lib/sequenceActivityClientService'

// Unified activity data type
type WeeklyActivityData =
  | AsanaWeeklyActivityData
  | WeeklySeriesActivityData
  | WeeklySequenceActivityData

interface WeeklyActivityViewerProps {
  entityId: string
  entityName: string // Used for prop interface, may be used for future enhancements
  entityType: 'asana' | 'series' | 'sequence'
  variant?: 'compact' | 'detailed'
  refreshTrigger?: number
}

/**
 * WeeklyActivityViewer
 *
 * Client-side React component that displays a weekly activity summary and activity list
 * for a given entity (asana, series, or sequence). Fetches weekly activity data for the
 * signed-in user and renders either a compact summary card or a detailed tracker view.
 *
 * Behavior / Side effects:
 * - Uses the current session (useSession) to determine the signed-in user id.
 * - On mount and whenever session.user.id, entityId, entityType, or refreshTrigger changes,
 *   triggers a fetch via one of:
 *     - getAsanaWeeklyActivity(userId, entityId)
 *     - getSeriesWeeklyActivity(userId, entityId)
 *     - getSequenceWeeklyActivity(userId, entityId)
 *   and populates local state: weeklyData, loading, error.
 * - Handles network and fetch errors by setting `error` and logging to console.
 *
 * Props (WeeklyActivityViewerProps):
 * @param entityId - Unique identifier of the entity to load activity for (required).
 * @param entityName - The entity display name (passed as _entityName to avoid unused-var warnings).
 * @param entityType - One of 'asana' | 'series' | 'sequence'. Determines which fetch routine and label text to use.
 * @param variant - 'compact' | 'detailed' (default: 'compact'). Controls rendering style:
 *                   - 'compact': a small card with activity count, last-performed tooltip and streak chip.
 *                   - 'detailed': full tracker with weekly count, streak label, last performed, and a
 *                     list of sessions with date/time, time-of-day icon, and difficulty/completion chip.
 * @param refreshTrigger - Numeric trigger to force refetch when changed (default: 0).
 *
 * Rendering / UI states:
 * - Loading: renders a LoadingSkeleton with size depending on variant.
 * - Error: renders a centered error Box with the error message.
 * - Not authenticated: renders a Paper prompting the user to sign in and explaining benefits.
 * - Authenticated: always renders the tracker UI even if there are zero activities. Uses:
 *     - weeklyData.count -> activityCount
 *     - weeklyData.activities -> activities array (may be empty)
 *
 * Utility behaviors / formatting:
 * - formatLastPerformed(activities) -> human-friendly last-performed label:
 *     - "Never", "Today", "Yesterday", "N days ago" (for <= 7 days), otherwise uses toLocaleDateString.
 * - getStreakColor(count) -> maps count to chip color tokens: >=5 => 'success', >=3 => 'warning', >=1 => 'info', else 'default'.
 * - getStreakLabel(count) -> maps count to short label: >=7 => 'Amazing!', >=5 => 'Great!', >=3 => 'Good', >=1 => 'Started', else 'None'.
 * - getDifficultyColor(difficulty, completionStatus) ->
 *     - If completionStatus === 'complete' and difficulty provided:
 *         'easy' -> 'success', 'average'/'medium' -> 'info', 'difficult'/'hard' -> 'error', default -> 'success'
 *     - Otherwise falls back to completionStatus mapping: 'complete' -> 'success', 'partial' -> 'warning', else 'default'.
 * - getEntityTypeLabel, getCompactTitle, getDetailedTitle, getActivityListLabel provide localized labels for each entityType.
 * - getTimeOfDayIcon(datePerformed) -> returns an icon based on local hour:
 *     - Morning (05:00–11:59): WbTwilightIcon (warning.main)
 *     - Day (12:00–19:59): WbSunnyIcon (warning.light)
 *     - Night (20:00–04:59): NightsStayIcon (info.main)
 *
 * List rendering:
 * - For detailed view, each session entry shows:
 *     - Formatted date (weekday, month short, day) and time in 'en-US' format (hour:min).
 *     - Time-of-day icon (see above).
 *     - A Chip showing difficulty or completionStatus with color determined by getDifficultyColor
 *       and white label text.
 * - Rows alternate backgroundColor between 'grey.50' and 'background.paper' for visual grouping.
 *
 * Notes / Accessibility:
 * - Tooltips are used to expose last-performed details in compact mode and on count chips.
 * - All dates/times are formatted using the browser locale for display; explicit 'en-US' formatting
 *   is used for the date/time strings in the activity list.
 *
 * Returns:
 * - JSX.Element: the appropriate skeleton, error, login prompt, compact card, or detailed tracker UI.
 */
export default function WeeklyActivityViewer({
  entityId,
  entityName: _entityName, // eslint-disable-line no-unused-vars, @typescript-eslint/no-unused-vars
  entityType,
  variant = 'compact',
  refreshTrigger = 0,
}: WeeklyActivityViewerProps) {
  const { data: session } = useSession()
  const [weeklyData, setWeeklyData] = useState<WeeklyActivityData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWeeklyData = async () => {
      if (!session?.user?.id || !entityId) return

      setLoading(true)
      setError(null)

      try {
        let data: WeeklyActivityData

        switch (entityType) {
          case 'asana':
            data = await getAsanaWeeklyActivity(session.user.id, entityId)
            break
          case 'series':
            data = await getSeriesWeeklyActivity(session.user.id, entityId)
            break
          case 'sequence':
            data = await getSequenceWeeklyActivity(session.user.id, entityId)
            break
          default:
            throw new Error(`Unknown entity type: ${entityType}`)
        }

        setWeeklyData(data)
      } catch (e: any) {
        console.error(`Error fetching weekly ${entityType} activity data:`, e)
        setError(e.message || 'Network error while fetching activity data')
      } finally {
        setLoading(false)
      }
    }

    fetchWeeklyData()
  }, [session?.user?.id, entityId, entityType, refreshTrigger])

  const formatLastPerformed = (
    activities: WeeklyActivityData['activities']
  ) => {
    if (!activities || activities.length === 0) return 'Never'

    const sortedActivities = activities.sort(
      (a, b) =>
        new Date(b.datePerformed).getTime() -
        new Date(a.datePerformed).getTime()
    )
    const lastActivity = sortedActivities[0]
    const lastDate = new Date(lastActivity.datePerformed)
    const now = new Date()
    const diffInDays = Math.floor(
      (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
    )

    if (diffInDays === 0) return 'Today'
    if (diffInDays === 1) return 'Yesterday'
    if (diffInDays <= 7) return `${diffInDays} days ago`
    return lastDate.toLocaleDateString()
  }

  const getStreakColor = (count: number) => {
    if (count >= 5) return 'success'
    if (count >= 3) return 'warning'
    if (count >= 1) return 'info'
    return 'default'
  }

  const getStreakLabel = (count: number) => {
    if (count >= 7) return 'Amazing!'
    if (count >= 5) return 'Great!'
    if (count >= 3) return 'Good'
    if (count >= 1) return 'Started'
    return 'None'
  }

  const getDifficultyColor = (
    difficulty?: string,
    completionStatus?: string
  ) => {
    // Only apply difficulty-based coloring for 'complete' status
    if (completionStatus === 'complete' && difficulty) {
      switch (difficulty.toLowerCase()) {
        case 'easy':
          return 'success' // Green with white text
        case 'average':
        case 'medium':
          return 'info' // Blue with white text
        case 'difficult':
        case 'hard':
          return 'error' // Red with white text
        default:
          return 'success'
      }
    }
    // Fallback to original completion status coloring
    return completionStatus === 'complete'
      ? 'success'
      : completionStatus === 'partial'
        ? 'warning'
        : 'default'
  }

  const getEntityTypeLabel = () => {
    switch (entityType) {
      case 'asana':
        return 'Asana'
      case 'series':
        return 'Flow'
      case 'sequence':
        return 'Sequence'
      default:
        return ''
    }
  }

  const getCompactTitle = () => {
    const typeLabel = getEntityTypeLabel()
    return entityType === 'asana'
      ? 'Weekly Activity'
      : `Weekly ${typeLabel} Activity`
  }

  const getDetailedTitle = () => {
    const typeLabel = getEntityTypeLabel()
    return entityType === 'asana'
      ? 'Weekly Activity Tracker'
      : `Weekly ${typeLabel} Activity Tracker`
  }

  const getActivityListLabel = () => {
    switch (entityType) {
      case 'asana':
        return 'All Activity This Week'
      case 'series':
        return 'All Flow Practice This Week'
      case 'sequence':
        return 'All Activity This Week'
      default:
        return 'All Activity This Week'
    }
  }

  const getTimeOfDayIcon = (datePerformed: string) => {
    const date = new Date(datePerformed)
    const hour = date.getHours()

    if (hour >= 5 && hour < 12) {
      // Morning: 5 AM to 11:59 AM
      return <WbTwilightIcon fontSize="small" sx={{ color: 'warning.main' }} />
    } else if (hour >= 20 || hour < 5) {
      // Night: 8 PM to 4:59 AM
      return <NightsStayIcon fontSize="small" sx={{ color: 'info.main' }} />
    } else {
      // Day: 12 PM to 7:59 PM
      return <WbSunnyIcon fontSize="small" sx={{ color: 'warning.light' }} />
    }
  }

  if (loading) {
    return (
      <LoadingSkeleton
        type="card"
        lines={3}
        height={variant === 'compact' ? 60 : 120}
        sx={{
          minHeight: variant === 'compact' ? '60px' : '120px',
        }}
      />
    )
  }

  if (error) {
    return (
      <Box
        sx={{
          p: 2,
          textAlign: 'center',
          backgroundColor: 'error.light',
          borderRadius: 1,
        }}
      >
        <Typography variant="body2" color="error">
          {error}
        </Typography>
      </Box>
    )
  }

  // Show login prompt if user is not authenticated
  if (!session?.user?.id) {
    return (
      <Paper
        elevation={2}
        sx={{
          p: 3,
          textAlign: 'center',
          backgroundColor: 'background.paper',
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="h6" gutterBottom color="text.secondary">
          Track Your Practice
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Log in to track your yoga practice and see your weekly activity
          progress.
        </Typography>
        <Typography
          variant="caption"
          color="primary"
          sx={{ fontStyle: 'italic' }}
        >
          Sign in to start building your practice streak!
        </Typography>
      </Paper>
    )
  }

  // Always show the tracker, even if there's no activity data
  const activityCount = weeklyData?.count || 0
  const activities = weeklyData?.activities || []

  if (variant === 'compact') {
    return (
      <Paper
        elevation={2}
        sx={{
          p: 2,
          borderRadius: 2,
          backgroundColor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <TrendingUpIcon color="primary" fontSize="small" />
            <Typography variant="subtitle2" fontWeight="bold">
              {getCompactTitle()}
            </Typography>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={1}>
            <Tooltip title={`${activityCount} times this week`}>
              <Chip
                icon={<CheckCircleIcon />}
                label={activityCount}
                color={getStreakColor(activityCount)}
                size="small"
                variant="outlined"
              />
            </Tooltip>
            {activityCount > 0 && (
              <Tooltip
                title={`Last performed: ${formatLastPerformed(activities)}`}
              >
                <CalendarTodayIcon
                  fontSize="small"
                  color="action"
                  sx={{ cursor: 'help' }}
                />
              </Tooltip>
            )}
          </Stack>
        </Stack>
      </Paper>
    )
  }

  // Detailed variant
  return (
    <Paper
      elevation={3}
      sx={{
        p: { xs: 2, sm: 3 },
        borderRadius: 2,
        backgroundColor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
        width: '100%',
        maxWidth: { xs: 'none', sm: '600px' },
        '@media (max-width: 384px)': {
          width: '100%',
          maxWidth: 'none',
          p: 1.5,
        },
      }}
    >
      <Stack spacing={3}>
        {/* Header */}
        <Stack direction="row" alignItems="center" spacing={2}>
          <TrendingUpIcon color="primary" fontSize="medium" />
          <Typography variant="subtitle2" fontWeight="bold">
            {getDetailedTitle()}
          </Typography>
        </Stack>

        <Divider />

        {/* Main Stats */}
        <Stack direction="row" spacing={3} alignItems="center">
          <Box textAlign="center">
            <Typography variant="h3" color="primary.main" fontWeight="bold">
              {activityCount}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This Week
            </Typography>
          </Box>

          <Divider orientation="vertical" flexItem />

          <Stack spacing={2} flex={1}>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="body2" color="text.secondary">
                Weekly Streak:
              </Typography>
              <Chip
                label={getStreakLabel(activityCount)}
                color={getStreakColor(activityCount)}
                size="small"
              />
            </Stack>

            {activityCount > 0 && (
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography variant="body2" color="text.secondary">
                  Last performed:
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {formatLastPerformed(activities)}
                </Typography>
              </Stack>
            )}
          </Stack>
        </Stack>

        {/* Activity List - Show all activities */}
        {activities.length > 0 && (
          <>
            <Divider />
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {getActivityListLabel()} ({activities.length} sessions):
              </Typography>
              <Stack spacing={1}>
                {activities.map((activity, index) => (
                  <Box
                    key={activity.id}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      p: 1.5,
                      backgroundColor:
                        index % 2 === 0 ? 'grey.50' : 'background.paper',
                      borderRadius: 1,
                      border: '1px solid',
                      borderColor: 'divider',
                    }}
                  >
                    <Stack spacing={0.5}>
                      <Typography variant="body2" fontWeight="medium">
                        {new Date(activity.datePerformed).toLocaleDateString(
                          'en-US',
                          {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                          }
                        )}
                      </Typography>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <Typography variant="caption" color="text.secondary">
                          {new Date(activity.datePerformed).toLocaleTimeString(
                            'en-US',
                            {
                              hour: 'numeric',
                              minute: '2-digit',
                            }
                          )}
                        </Typography>
                        {getTimeOfDayIcon(activity.datePerformed)}
                      </Stack>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip
                        label={activity.difficulty || activity.completionStatus}
                        size="small"
                        variant="filled"
                        color={getDifficultyColor(
                          activity.difficulty,
                          activity.completionStatus
                        )}
                        sx={{
                          fontWeight: 700,
                          textTransform: 'capitalize',
                          '& .MuiChip-label': {
                            color: 'white',
                          },
                        }}
                      />
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </Box>
          </>
        )}
      </Stack>
    </Paper>
  )
}
