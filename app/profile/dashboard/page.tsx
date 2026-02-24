'use client'
import React, { useEffect, useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
  LinearProgress,
  Divider,
  useTheme,
  CircularProgress,
  Alert,
  Container,
  Chip,
} from '@mui/material'
import Grid2 from '@mui/material/Grid2'
import Image from 'next/image'
import PracticeHistoryChart from '@clientComponents/PracticeHistoryChart'
import ProfileNavMenu from '@app/profile/ProfileNavMenu'
import { useSession } from 'next-auth/react'
import { UseUser } from '@context/UserContext'

interface StatCardProps {
  title: string
  value: string
  icon?: React.ReactNode
  color?: string
  helperText?: string
}

interface DashboardData {
  loginStreak: number
  longestLoginStreak: number
  activityStreak: number
  activityStreakAtRisk: boolean
  longestStreak: number
  practiceHistory: Array<{ month: string; days: number }>
  mostCommonAsanas: Array<{ name: string; count: number }>
  mostCommonSeries: Array<{ name: string; count: number }>
  mostCommonSequences: Array<{ name: string; count: number }>
  nextGoal: {
    text: string
    current: number
    target: number
    progress: number
    tiersAchieved: number
    tierName?: string
    ultimateGoalsCompleted: number
  }
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  color,
  helperText,
}) => {
  const theme = useTheme()

  return (
    <Card
      elevation={2}
      sx={{
        height: '100%',
        border: `2px solid ${color || theme.palette.primary.main}`,
        borderRadius: 2,
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={1}>
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            {title}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={1}>
            {icon && (
              <Box sx={{ color: color || theme.palette.primary.main }}>
                {icon}
              </Box>
            )}
            <Typography
              variant="h4"
              fontWeight="bold"
              color={color || 'primary.main'}
            >
              {value}
            </Typography>
          </Stack>
          {helperText && (
            <Typography variant="body2" color={color || 'text.secondary'}>
              {helperText}
            </Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}

const Dashboard: React.FC = () => {
  const theme = useTheme()
  const { data: session, status } = useSession()
  const {
    state: { userData },
  } = UseUser()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      const debugPrefix = '[Dashboard Debug]'
      const startTime = Date.now()

      try {
        setLoading(true)
        setError(null)

        // Get userId from userData or session
        const userId = userData?.id || session?.user?.id

        // If we don't have a userId yet, check if we should wait or show error
        if (!userId) {
          if (status === 'loading') {
            return // Don't set error yet, still waiting for session
          }
          console.warn(
            `${debugPrefix} No user ID found - user session not found`,
            {
              userData: userData ? 'present' : 'null',
              session: session ? 'present' : 'null',
              sessionUser: session?.user ? 'present' : 'null',
            }
          )
          setError('User session not found')
          return
        }

        // Skip if using default/initial userData (id='1' is the placeholder)
        if (userId === '1') {
          setLoading(false)
          return
        }

        // First, ensure login is recorded and get current login streak

        const loginStreakResponse = await fetch('/api/user/recordActivity', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: userId,
            activityType: 'view_dashboard',
          }),
        })

        let currentLoginStreak = 0
        if (loginStreakResponse.ok) {
          const loginData = await loginStreakResponse.json()
          currentLoginStreak = loginData.streakData?.currentStreak || 0
        } else {
          const errorText = await loginStreakResponse
            .text()
            .catch(() => 'Unable to read error body')
          console.error(`${debugPrefix} recordActivity API failed`, {
            status: loginStreakResponse.status,
            statusText: loginStreakResponse.statusText,
            errorBody: errorText,
            userId,
          })
        }

        // Then fetch other dashboard statistics
        const response = await fetch('/api/dashboard/stats', {
          cache: 'no-store',
        })

        if (!response.ok) {
          const errorText = await response
            .text()
            .catch(() => 'Unable to read error body')
          console.error(`${debugPrefix} dashboard/stats API error response`, {
            status: response.status,
            statusText: response.statusText,
            errorBody: errorText,
          })
          throw new Error(
            `Failed to fetch dashboard statistics (HTTP ${response.status}: ${response.statusText})`
          )
        }

        const result = await response.json()

        if (result.success && result.data) {
          // Override the loginStreak with the one from recordActivity API
          const finalData = {
            ...result.data,
            loginStreak: currentLoginStreak,
          }
          setDashboardData(finalData)
        } else {
          console.error(
            `${debugPrefix} Invalid response format from dashboard/stats`,
            {
              success: result.success,
              hasData: !!result.data,
              error: result.error,
              fullResult: result,
            }
          )
          throw new Error(result.error || 'Invalid response format')
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to load dashboard data'
        console.error(`${debugPrefix} Error fetching dashboard data`, {
          error: err,
          errorMessage,
          errorStack: err instanceof Error ? err.stack : undefined,
          elapsedMs: Date.now() - startTime,
        })
        setError(errorMessage)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData?.id, session?.user?.id, status])

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  if (error || !dashboardData) {
    return (
      <Box sx={{ width: '100%', maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Alert severity="error">
          {error || 'Failed to load dashboard data'}
        </Alert>
      </Box>
    )
  }

  const {
    loginStreak,
    longestLoginStreak,
    activityStreak,
    activityStreakAtRisk,
    longestStreak,
    practiceHistory,
    mostCommonAsanas,
    mostCommonSeries,
    mostCommonSequences,
    nextGoal,
  } = dashboardData

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid2 container spacing={4}>
        {/* Profile Navigation Menu */}
        <Grid2 size={{ xs: 12, md: 4 }}>
          <ProfileNavMenu />
        </Grid2>

        {/* Main Dashboard Content */}
        <Grid2 size={{ xs: 12, md: 8 }}>
          <Box sx={{ width: '100%' }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h4"
                fontWeight="bold"
                color="primary.main"
                gutterBottom
              >
                Dashboard
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Your progress at a glance.
              </Typography>
            </Box>

            {/* Stat Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={6}>
                <StatCard
                  title="Current Login Streak"
                  value={`🔥 ${loginStreak} Days`}
                  color={theme.palette.warning.main}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <StatCard
                  title="Current Activity Streak"
                  value={`🔥 ${activityStreak} Days`}
                  color={
                    activityStreakAtRisk
                      ? theme.palette.error.main
                      : theme.palette.warning.main
                  }
                  helperText={
                    activityStreakAtRisk
                      ? 'Save your streak—record activity today.'
                      : undefined
                  }
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <StatCard
                  title="Longest Login Streak"
                  value={`🏆 ${longestLoginStreak} Days`}
                  color={theme.palette.success.main}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <StatCard
                  title="Longest Activity Streak"
                  value={`🏆 ${longestStreak} Days`}
                  color={theme.palette.success.main}
                />
              </Grid>
            </Grid>

            {/* Practice History Chart */}
            <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                12 Month Practice History
              </Typography>
              {practiceHistory && practiceHistory.length > 0 ? (
                <Box sx={{ mt: 3 }}>
                  <PracticeHistoryChart data={practiceHistory} />
                </Box>
              ) : (
                <Box sx={{ mt: 3, textAlign: 'center', py: 5 }}>
                  <Typography variant="body2" color="text.secondary">
                    No practice data available yet
                  </Typography>
                </Box>
              )}
            </Paper>

            {/* Most Common Asanas */}
            <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Most Common Asanas
              </Typography>
              <Stack spacing={2} sx={{ mt: 2 }}>
                {mostCommonAsanas.map((asana, index) => (
                  <Box key={index}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="body1">{asana.name}</Typography>
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        color="warning.main"
                      >
                        {asana.count}
                      </Typography>
                    </Stack>
                    {index < mostCommonAsanas.length - 1 && (
                      <Divider sx={{ mt: 2 }} />
                    )}
                  </Box>
                ))}
              </Stack>
            </Paper>

            {/* Most Common Flows */}
            <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Most Common Flows
              </Typography>
              <Stack spacing={2} sx={{ mt: 2 }}>
                {mostCommonSeries.map((series, index) => (
                  <Box key={index}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="body1">{series.name}</Typography>
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        color="warning.main"
                      >
                        {series.count}
                      </Typography>
                    </Stack>
                    {index < mostCommonSeries.length - 1 && (
                      <Divider sx={{ mt: 2 }} />
                    )}
                  </Box>
                ))}
              </Stack>
            </Paper>

            {/* Most Common Sequences */}
            <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Most Common Sequences
              </Typography>
              <Stack spacing={2} sx={{ mt: 2 }}>
                {mostCommonSequences.map((sequence, index) => (
                  <Box key={index}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="body1">{sequence.name}</Typography>
                      <Typography
                        variant="body1"
                        fontWeight="bold"
                        color="warning.main"
                      >
                        {sequence.count}
                      </Typography>
                    </Stack>
                    {index < mostCommonSequences.length - 1 && (
                      <Divider sx={{ mt: 2 }} />
                    )}
                  </Box>
                ))}
              </Stack>
            </Paper>

            {/* Next Goal */}
            <Paper
              elevation={2}
              sx={{
                p: 3,
                borderRadius: 2,
                border: `2px solid ${
                  activityStreakAtRisk
                    ? theme.palette.error.main
                    : theme.palette.warning.main
                }`,
              }}
            >
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Next Goal: {nextGoal.text}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={nextGoal.progress}
                  sx={{
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: theme.palette.grey[200],
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: theme.palette.warning.main,
                      borderRadius: 6,
                    },
                  }}
                />
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mt: 1 }}
                >
                  <Typography variant="body2" color="text.secondary">
                    {nextGoal.tiersAchieved} goal
                    {nextGoal.tiersAchieved !== 1 ? 's' : ''} achieved{' '}
                    {nextGoal.tierName && (
                      <Typography
                        component="span"
                        variant="body2"
                        color="primary.main"
                        fontWeight="bold"
                      >
                        ({nextGoal.tierName})
                      </Typography>
                    )}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {nextGoal.current} / {nextGoal.target} days
                  </Typography>
                </Stack>
                {activityStreakAtRisk && (
                  <Typography
                    variant="body2"
                    color="error.main"
                    fontWeight={600}
                    sx={{ mt: 1 }}
                  >
                    Streak in jeopardy — record activity today or it resets to
                    zero.
                  </Typography>
                )}
                {nextGoal.ultimateGoalsCompleted > 0 && (
                  <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Typography
                      variant="h6"
                      color="primary.main"
                      fontWeight="bold"
                      sx={{ mb: 1 }}
                    >
                      Ultimate Goal Achieved!
                    </Typography>
                    <Typography
                      variant="h4"
                      sx={{ color: theme.palette.warning.main }}
                    >
                      {'⭐'.repeat(nextGoal.ultimateGoalsCompleted)}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Paper>

            {/* Achievement Badges Section - Coming Soon */}
            <Paper
              elevation={2}
              sx={{
                p: 3,
                mt: 4,
                borderRadius: 2,
                opacity: 0.6,
                position: 'relative',
              }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 2 }}
              >
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  color="text.secondary"
                >
                  Achievements
                </Typography>
                <Chip
                  label="Coming Soon"
                  size="small"
                  sx={{
                    backgroundColor: theme.palette.grey[400],
                    color: 'white',
                    fontWeight: 600,
                  }}
                />
              </Stack>
              <Stack
                direction="row"
                spacing={2}
                justifyContent="center"
                alignItems="center"
                flexWrap="wrap"
                sx={{ gap: 2 }}
              >
                <Box sx={{ textAlign: 'center' }}>
                  <Box
                    sx={{
                      filter: 'grayscale(100%)',
                      opacity: 0.5,
                    }}
                  >
                    <Image
                      src="/icons/profile/login-streak-1.png"
                      width={64}
                      height={64}
                      alt="Login Streak Badge 1 - Coming Soon"
                    />
                  </Box>
                  <Typography
                    variant="caption"
                    display="block"
                    sx={{ mt: 0.5, color: 'text.disabled' }}
                  >
                    Week Warrior
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Box
                    sx={{
                      filter: 'grayscale(100%)',
                      opacity: 0.5,
                    }}
                  >
                    <Image
                      src="/icons/profile/login-streak-2.png"
                      width={64}
                      height={64}
                      alt="Login Streak Badge 2 - Coming Soon"
                    />
                  </Box>
                  <Typography
                    variant="caption"
                    display="block"
                    sx={{ mt: 0.5, color: 'text.disabled' }}
                  >
                    Month Master
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Box
                    sx={{
                      filter: 'grayscale(100%)',
                      opacity: 0.5,
                    }}
                  >
                    <Image
                      src="/icons/profile/login-streak-3.png"
                      width={64}
                      height={64}
                      alt="Login Streak Badge 3 - Coming Soon"
                    />
                  </Box>
                  <Typography
                    variant="caption"
                    display="block"
                    sx={{ mt: 0.5, color: 'text.disabled' }}
                  >
                    Dedicated Yogi
                  </Typography>
                </Box>
              </Stack>
              <Typography
                variant="body2"
                color="text.disabled"
                sx={{ mt: 2, textAlign: 'center', fontStyle: 'italic' }}
              >
                Earn badges by maintaining your yoga practice streaks!
              </Typography>
            </Paper>
          </Box>
        </Grid2>
      </Grid2>
    </Container>
  )
}

export default Dashboard
