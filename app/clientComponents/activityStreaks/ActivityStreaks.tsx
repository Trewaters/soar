'use client'
import React, { useState, useEffect } from 'react'
import { Box, Typography, Paper, Stack, Chip, Tooltip } from '@mui/material'
import { useSession } from 'next-auth/react'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import WhatshotIcon from '@mui/icons-material/Whatshot'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import LoadingSkeleton from '@app/clientComponents/LoadingSkeleton'

// Extensible streak type system
export type StreakType = 'login' | 'asana' | 'meditation' | 'breathwork'

export interface StreakData {
  type: StreakType
  currentStreak: number
  longestStreak: number
  lastActivityDate: string | null
  isActiveToday: boolean
  displayName: string
  icon: React.ReactNode
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'error'
}

interface ActivityStreaksProps {
  variant?: 'compact' | 'detailed'
  streakTypes?: StreakType[]
}

export default function ActivityStreaks({
  variant = 'compact',
  streakTypes = ['login'],
}: ActivityStreaksProps) {
  const { data: session, status } = useSession()
  const [streakData, setStreakData] = useState<StreakData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasInitialized, setHasInitialized] = useState(false)

  const getStreakIcon = (type: StreakType): React.ReactNode => {
    switch (type) {
      case 'login':
        return <CalendarTodayIcon fontSize="small" />
      case 'asana':
        return <TrendingUpIcon fontSize="small" />
      case 'meditation':
        return <WhatshotIcon fontSize="small" />
      case 'breathwork':
        return <WhatshotIcon fontSize="small" />
      default:
        return <TrendingUpIcon fontSize="small" />
    }
  }

  const getStreakColor = (
    type: StreakType
  ): 'primary' | 'secondary' | 'success' | 'warning' | 'error' => {
    switch (type) {
      case 'login':
        return 'primary'
      case 'asana':
        return 'success'
      case 'meditation':
        return 'secondary'
      case 'breathwork':
        return 'warning'
      default:
        return 'primary'
    }
  }

  const getStreakDisplayName = (type: StreakType): string => {
    switch (type) {
      case 'login':
        return 'Login Streak'
      case 'asana':
        return 'Asana Practice'
      case 'meditation':
        return 'Meditation'
      case 'breathwork':
        return 'Breathwork'
      default:
        return 'Activity'
    }
  }

  useEffect(() => {
    const fetchStreakData = async () => {
      // Prevent multiple simultaneous calls and ensure we have a session
      if (
        !session?.user?.id ||
        status !== 'authenticated' ||
        loading ||
        hasInitialized
      ) {
        console.log('ActivityStreaks: Skipping fetch due to conditions:', {
          hasUserId: !!session?.user?.id,
          status,
          loading,
          hasInitialized,
          timestamp: new Date().toISOString(),
        })
        return
      }

      console.log('ActivityStreaks: Starting fetchStreakData for user:', {
        userId: session.user.id,
        email: session.user.email,
        streakTypes,
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        baseUrl: window.location.origin,
      })

      setLoading(true)
      setError(null)
      setHasInitialized(true)

      try {
        const fetchedStreaks: StreakData[] = []
        let hasNetworkError = false

        // Record activity and fetch login streak data
        if (streakTypes.includes('login')) {
          try {
            const apiUrl = `/api/user/recordActivity`
            console.log(
              'ActivityStreaks: Making API call to record activity:',
              {
                url: apiUrl,
                method: 'POST',
                timestamp: new Date().toISOString(),
              }
            )

            const response = await fetch(apiUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                userId: session.user.id,
                activityType: 'view_streaks',
              }),
            })

            console.log('ActivityStreaks: API response received:', {
              status: response.status,
              statusText: response.statusText,
              ok: response.ok,
              headers: Object.fromEntries(response.headers.entries()),
              url: response.url,
              timestamp: new Date().toISOString(),
              requestId: response.headers.get('X-Request-ID'),
            })

            if (response.ok) {
              const activityResponse = await response.json()
              const loginData = activityResponse.streakData

              console.log(
                'ActivityStreaks: Successfully recorded activity and got streak data:',
                {
                  loginRecorded: activityResponse.loginRecorded,
                  loginData,
                  timestamp: new Date().toISOString(),
                }
              )

              fetchedStreaks.push({
                type: 'login',
                currentStreak: loginData.currentStreak,
                longestStreak: loginData.longestStreak,
                lastActivityDate: loginData.lastLoginDate,
                isActiveToday: loginData.isActiveToday,
                displayName: getStreakDisplayName('login'),
                icon: getStreakIcon('login'),
                color: getStreakColor('login'),
              })
            } else if (response.status >= 500) {
              // Server error - consider this a network error
              hasNetworkError = true

              let errorDetails = null
              try {
                errorDetails = await response.json()
              } catch (parseError) {
                console.error(
                  'ActivityStreaks: Failed to parse error response:',
                  parseError
                )
              }

              console.error('ActivityStreaks: Server error response:', {
                status: response.status,
                statusText: response.statusText,
                errorDetails,
                url: response.url,
                userId: session.user.id,
                environment: process.env.NODE_ENV,
                timestamp: new Date().toISOString(),
                requestId: response.headers.get('X-Request-ID'),
                environmentHeader: response.headers.get('X-Environment'),
                responseTimestamp: response.headers.get('X-Timestamp'),
              })
            } else {
              // Client error (4xx) - show fallback data
              let errorDetails = null
              try {
                errorDetails = await response.json()
              } catch (parseError) {
                console.error(
                  'ActivityStreaks: Failed to parse error response:',
                  parseError
                )
              }

              console.warn('ActivityStreaks: Client error response:', {
                status: response.status,
                statusText: response.statusText,
                errorDetails,
                url: response.url,
                userId: session.user.id,
                timestamp: new Date().toISOString(),
              })

              fetchedStreaks.push({
                type: 'login',
                currentStreak: 0,
                longestStreak: 0,
                lastActivityDate: null,
                isActiveToday: false,
                displayName: getStreakDisplayName('login'),
                icon: getStreakIcon('login'),
                color: getStreakColor('login'),
              })
            }
          } catch (e) {
            hasNetworkError = true
            console.error('ActivityStreaks: Network error or fetch failure:', {
              error: e,
              errorMessage: e instanceof Error ? e.message : String(e),
              errorStack: e instanceof Error ? e.stack : undefined,
              userId: session.user.id,
              environment: process.env.NODE_ENV,
              timestamp: new Date().toISOString(),
              userAgent: navigator.userAgent,
              connectionType: (navigator as any).connection?.effectiveType,
              onlineStatus: navigator.onLine,
            })
          }
        }

        // If we have a network error and no data, show error state
        if (hasNetworkError && fetchedStreaks.length === 0) {
          const errorMsg = 'Failed to load streak data'
          console.error(
            'ActivityStreaks: Throwing error due to network failure:',
            {
              hasNetworkError,
              fetchedStreaksLength: fetchedStreaks.length,
              userId: session.user.id,
              timestamp: new Date().toISOString(),
            }
          )
          throw new Error(errorMsg)
        }

        // If we have network errors but some data, add fallback for failed calls
        if (
          hasNetworkError &&
          streakTypes.includes('login') &&
          fetchedStreaks.length === 0
        ) {
          console.warn(
            'ActivityStreaks: Adding fallback data due to network error:',
            {
              hasNetworkError,
              streakTypes,
              fetchedStreaksLength: fetchedStreaks.length,
              timestamp: new Date().toISOString(),
            }
          )

          fetchedStreaks.push({
            type: 'login',
            currentStreak: 0,
            longestStreak: 0,
            lastActivityDate: null,
            isActiveToday: false,
            displayName: getStreakDisplayName('login'),
            icon: getStreakIcon('login'),
            color: getStreakColor('login'),
          })
        }

        // TODO: Add other streak types here as they are implemented
        // Example for future asana streaks:
        // if (streakTypes.includes('asana')) {
        //   const asanaResponse = await fetch(`/api/user/asanaStreak?userId=${session.user.id}`)
        //   if (asanaResponse.ok) {
        //     const asanaData = await asanaResponse.json()
        //     fetchedStreaks.push({
        //       type: 'asana',
        //       currentStreak: asanaData.currentStreak,
        //       longestStreak: asanaData.longestStreak,
        //       lastActivityDate: asanaData.lastActivityDate,
        //       isActiveToday: asanaData.isActiveToday,
        //       displayName: getStreakDisplayName('asana'),
        //       icon: getStreakIcon('asana'),
        //       color: getStreakColor('asana'),
        //     })
        //   }
        // }

        console.log('ActivityStreaks: Successfully fetched streak data:', {
          fetchedStreaksCount: fetchedStreaks.length,
          streakTypes: fetchedStreaks.map((s) => s.type),
          userId: session.user.id,
          timestamp: new Date().toISOString(),
        })

        setStreakData(fetchedStreaks)
      } catch (e: any) {
        console.error('ActivityStreaks: Error in fetchStreakData:', {
          error: e,
          errorMessage: e instanceof Error ? e.message : String(e),
          errorStack: e instanceof Error ? e.stack : undefined,
          userId: session?.user?.id,
          streakTypes,
          environment: process.env.NODE_ENV,
          timestamp: new Date().toISOString(),
          sessionStatus: status,
          hasSession: !!session,
        })
        setError('Failed to load streak data')
      } finally {
        setLoading(false)
        console.log('ActivityStreaks: Fetch process completed:', {
          userId: session?.user?.id,
          timestamp: new Date().toISOString(),
        })
      }
    }

    fetchStreakData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.id, status])

  // Reset initialization when user changes
  useEffect(() => {
    setHasInitialized(false)
  }, [session?.user?.id])

  const getStreakMessage = (streak: StreakData): string => {
    if (streak.currentStreak === 0) {
      return `Start your ${streak.displayName.toLowerCase()} streak!`
    }
    if (streak.currentStreak === 1) {
      return `Great start! Keep it going.`
    }
    if (streak.currentStreak < 7) {
      return `You're building momentum!`
    }
    if (streak.currentStreak < 30) {
      return `Excellent consistency!`
    }
    return `Amazing dedication!`
  }

  const formatLastActivity = (lastActivityDate: string | null): string => {
    if (!lastActivityDate) return 'Never'

    const lastDate = new Date(lastActivityDate)
    const now = new Date()

    // Use UTC for consistent date calculations across timezones
    const lastDateUTC = new Date(
      lastDate.getUTCFullYear(),
      lastDate.getUTCMonth(),
      lastDate.getUTCDate()
    )
    const nowUTC = new Date(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate()
    )

    const diffInDays = Math.floor(
      (nowUTC.getTime() - lastDateUTC.getTime()) / (1000 * 60 * 60 * 24)
    )

    if (diffInDays === 0) return 'Today'
    if (diffInDays === 1) return 'Yesterday'
    return `${diffInDays} days ago`
  }

  if (status === 'loading' || loading) {
    return (
      <LoadingSkeleton
        type="card"
        lines={2}
        height={80}
        sx={{ p: 2, borderRadius: 2 }}
      />
    )
  }

  if (status === 'unauthenticated' || !session) {
    return (
      <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Sign in to view your activity streaks
        </Typography>
      </Paper>
    )
  }

  if (error) {
    return (
      <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
        <Typography variant="body2" color="error" role="alert">
          {error}
        </Typography>
      </Paper>
    )
  }

  if (streakData.length === 0) {
    return (
      <Paper elevation={2} sx={{ p: 2, borderRadius: 2 }}>
        <Typography variant="body2" color="text.secondary">
          No streak data available
        </Typography>
      </Paper>
    )
  }

  if (variant === 'compact') {
    // Show only the primary streak (first one) in compact mode
    const primaryStreak = streakData[0]
    if (!primaryStreak) return null

    return (
      <Stack
        direction="column"
        alignItems="center"
        justifyContent="center"
        spacing={2}
        sx={{ p: 2 }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography
            variant="h3"
            fontWeight="bold"
            sx={{ color: 'success.main', textAlign: 'center' }}
          >
            Login Streak
          </Typography>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={2}>
          <Typography variant="h4" fontWeight="bold" color="primary.main">
            {primaryStreak.currentStreak}
          </Typography>
          <Typography
            variant="h4"
            color="primary.main"
            textTransform={'uppercase'}
          >
            day{primaryStreak.currentStreak !== 1 ? 's' : ''}
          </Typography>
        </Stack>
      </Stack>
    )
  }

  // Detailed variant showing all streaks
  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        borderRadius: 2,
        backgroundColor: 'background.paper',
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Stack spacing={3}>
        {/* Header */}
        <Stack direction="row" alignItems="center" spacing={2}>
          <TrendingUpIcon color="primary" fontSize="medium" />
          <Typography variant="h6" fontWeight="bold">
            Activity Streaks
          </Typography>
        </Stack>

        {/* Streak Cards */}
        <Stack spacing={2}>
          {streakData.map((streak) => (
            <Box
              key={streak.type}
              sx={{
                p: 2,
                backgroundColor: 'grey.50',
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'grey.200',
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                spacing={2}
              >
                <Stack direction="row" alignItems="center" spacing={2}>
                  {streak.icon}
                  <Stack>
                    <Typography variant="subtitle1" fontWeight="medium">
                      {streak.displayName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {getStreakMessage(streak)}
                    </Typography>
                  </Stack>
                </Stack>

                <Stack alignItems="center" spacing={1}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography
                      variant="h4"
                      fontWeight="bold"
                      color={`${streak.color}.main`}
                    >
                      {streak.currentStreak}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      days
                    </Typography>
                    {streak.isActiveToday && (
                      <Tooltip title="Active today">
                        <Box component="span">
                          <WhatshotIcon color="success" fontSize="small" />
                        </Box>
                      </Tooltip>
                    )}
                  </Stack>

                  <Stack direction="row" spacing={2}>
                    <Chip
                      label={`Best: ${streak.longestStreak}`}
                      size="small"
                      variant="outlined"
                      color={streak.color}
                    />
                    {(streak.currentStreak > 0 || streak.lastActivityDate) && (
                      <Chip
                        label={`Last: ${formatLastActivity(streak.lastActivityDate)}`}
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Stack>
                </Stack>
              </Stack>
            </Box>
          ))}
        </Stack>

        {/* Encouragement message for new users */}
        {streakData.every((streak) => streak.currentStreak === 0) && (
          <Box
            sx={{
              p: 2,
              backgroundColor: 'info.light',
              borderRadius: 1,
              textAlign: 'center',
            }}
          >
            <Typography variant="body2" color="info.dark">
              🌱 Start building your daily habits! Consistency is the key to
              growth.
            </Typography>
          </Box>
        )}
      </Stack>
    </Paper>
  )
}
