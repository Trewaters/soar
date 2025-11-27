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

export default function WeeklyActivityViewer({
  entityId,
  entityName: _entityName, // eslint-disable-line @typescript-eslint/no-unused-vars
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

  // Only show when there's activity data for the current week
  // If there's no activity this week, don't render anything (user can still use ActivityTracker)
  if (!weeklyData || weeklyData.count === 0) {
    return null
  }

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
            <Tooltip title={`${weeklyData.count} times this week`}>
              <Chip
                icon={<CheckCircleIcon />}
                label={weeklyData.count}
                color={getStreakColor(weeklyData.count)}
                size="small"
                variant="outlined"
              />
            </Tooltip>
            {weeklyData.count > 0 && (
              <Tooltip
                title={`Last performed: ${formatLastPerformed(weeklyData.activities)}`}
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
          <Typography variant="h6" fontWeight="bold">
            {getDetailedTitle()}
          </Typography>
        </Stack>

        <Divider />

        {/* Main Stats */}
        <Stack direction="row" spacing={3} alignItems="center">
          <Box textAlign="center">
            <Typography variant="h3" color="primary.main" fontWeight="bold">
              {weeklyData.count}
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
                label={getStreakLabel(weeklyData.count)}
                color={getStreakColor(weeklyData.count)}
                size="small"
              />
            </Stack>

            {weeklyData.count > 0 && (
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography variant="body2" color="text.secondary">
                  Last performed:
                </Typography>
                <Typography variant="body2" fontWeight="medium">
                  {formatLastPerformed(weeklyData.activities)}
                </Typography>
              </Stack>
            )}
          </Stack>
        </Stack>

        {/* Activity List - Show all activities */}
        {weeklyData.activities.length > 0 && (
          <>
            <Divider />
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {getActivityListLabel()} ({weeklyData.activities.length}{' '}
                sessions):
              </Typography>
              <Stack spacing={1}>
                {weeklyData.activities.map((activity, index) => (
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
