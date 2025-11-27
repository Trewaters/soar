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
} from '@mui/material'
import Grid2 from '@mui/material/Grid2'
import PracticeHistoryChart from '@clientComponents/PracticeHistoryChart'
import ProfileNavMenu from '@app/navigator/profile/ProfileNavMenu'
import { useSession } from 'next-auth/react'
import { UseUser } from '@context/UserContext'

interface StatCardProps {
  title: string
  value: string
  icon?: React.ReactNode
  color?: string
}

interface DashboardData {
  loginStreak: number
  activityStreak: number
  practiceHistory: Array<{ month: string; days: number }>
  mostCommonAsanas: Array<{ name: string; count: number }>
  mostCommonSeries: Array<{ name: string; count: number }>
  mostCommonSequences: Array<{ name: string; count: number }>
  nextGoal: {
    text: string
    current: number
    target: number
    progress: number
  }
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
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
        </Stack>
      </CardContent>
    </Card>
  )
}

const Dashboard: React.FC = () => {
  const theme = useTheme()
  const { data: session } = useSession()
  const {
    state: { userData },
  } = UseUser()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Get userId from userData or session
        const userId = userData?.id || session?.user?.id

        if (!userId) {
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
          console.error('Dashboard - recordActivity API failed:', {
            status: loginStreakResponse.status,
            statusText: loginStreakResponse.statusText,
          })
        }

        // Then fetch other dashboard statistics
        const response = await fetch('/api/dashboard/stats', {
          cache: 'no-store',
        })

        if (!response.ok) {
          throw new Error('Failed to fetch dashboard statistics')
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
          throw new Error('Invalid response format')
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err)
        setError(
          err instanceof Error ? err.message : 'Failed to load dashboard data'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
    activityStreak,
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
              <Grid item xs={12} sm={6} md={4}>
                <StatCard
                  title="Login Streak"
                  value={`🔥 ${loginStreak} Days`}
                  color={theme.palette.warning.main}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <StatCard
                  title="Activity Streak"
                  value={`🔥 ${activityStreak} Days`}
                  color={theme.palette.warning.main}
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
                border: `2px solid ${theme.palette.warning.main}`,
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
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1, textAlign: 'right' }}
                >
                  {nextGoal.current} / {nextGoal.target} days
                </Typography>
              </Box>
            </Paper>
          </Box>
        </Grid2>
      </Grid2>
    </Container>
  )
}

export default Dashboard
