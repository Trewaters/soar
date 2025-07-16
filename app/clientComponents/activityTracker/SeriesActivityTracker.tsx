'use client'

import React, { useState, useEffect } from 'react'
import {
  Box,
  Paper,
  Stack,
  Typography,
  Chip,
  Tooltip,
  Divider,
} from '@mui/material'
import { useSession } from 'next-auth/react'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import { getSeriesWeeklyActivity } from '@lib/seriesActivityClientService'
import LoadingSkeleton from '@app/clientComponents/LoadingSkeleton'

interface SeriesActivityTrackerProps {
  seriesId: string
  seriesName: string
  variant?: 'compact' | 'detailed'
  refreshTrigger?: number
}

interface WeeklySeriesActivityData {
  count: number
  activities: Array<{
    id: string
    datePerformed: string
    duration: number
    completionStatus: string
    difficulty?: string
  }>
  dateRange: {
    start: string
    end: string
  }
}

export default function SeriesActivityTracker({
  seriesId,
  variant = 'compact',
  refreshTrigger = 0,
}: SeriesActivityTrackerProps) {
  const { data: session } = useSession()
  const [weeklyData, setWeeklyData] = useState<WeeklySeriesActivityData | null>(
    null
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWeeklyData = async () => {
      if (!session?.user?.id || !seriesId) return

      setLoading(true)
      setError(null)

      try {
        const data = await getSeriesWeeklyActivity(
          session.user.id,
          seriesId.toString()
        )
        setWeeklyData(data)
      } catch (e: any) {
        console.error('Error fetching weekly series activity data:', e)
        setError(e.message || 'Network error while fetching activity data')
      } finally {
        setLoading(false)
      }
    }

    fetchWeeklyData()
  }, [session?.user?.id, seriesId, refreshTrigger])

  const formatLastPerformed = (
    activities: WeeklySeriesActivityData['activities']
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
    if (completionStatus === 'complete' && difficulty) {
      switch (difficulty.toLowerCase()) {
        case 'easy':
          return 'success'
        case 'average':
          return 'info'
        case 'difficult':
          return 'error'
        default:
          return 'success'
      }
    }
    return completionStatus === 'complete'
      ? 'success'
      : completionStatus === 'partial'
        ? 'warning'
        : 'default'
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
              Weekly Series Activity
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
        <Stack direction="row" alignItems="center" spacing={2}>
          <TrendingUpIcon color="primary" fontSize="medium" />
          <Typography variant="h6" fontWeight="bold">
            Weekly Series Activity Tracker
          </Typography>
        </Stack>

        <Divider />

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

        {weeklyData.activities.length > 0 && (
          <>
            <Divider />
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Series Practice This Week ({weeklyData.activities.length}{' '}
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
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip
                        label={activity.completionStatus}
                        size="small"
                        variant="outlined"
                        color={getDifficultyColor(
                          activity.difficulty,
                          activity.completionStatus
                        )}
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
