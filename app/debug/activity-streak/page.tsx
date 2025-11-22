'use client'
import React, { useEffect, useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Container,
  Divider,
  Chip,
  Stack,
} from '@mui/material'
import { useSession } from 'next-auth/react'

interface DebugData {
  userId: string
  userEmail: string
  serverDate: {
    iso: string
    utc: string
    local: string
    timezone: string
    timezoneOffset: number
    year: number
    month: number
    day: number
    formatted: string
  }
  totalActivities: number
  activityCounts: {
    asana: number
    series: number
    sequence: number
  }
  uniqueDaysWithActivity: Array<{
    dateStr: string
    originalISO: string
    localDate: string
    utcDate: string
    activities: string[]
  }>
  sortedDays: string[]
  lastActivityDate: string
  daysSinceLastActivity: number
  streakBroken: boolean
  calculatedStreak: number
  streakCalculationDetails: Array<{
    expected: string
    actual: string
    match: boolean
  }>
}

const ActivityStreakDebug: React.FC = () => {
  const { data: session } = useSession()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [debugData, setDebugData] = useState<DebugData | null>(null)
  const [clientDate, setClientDate] = useState({
    iso: '',
    timezone: '',
    timezoneOffset: 0,
    formatted: '',
  })

  useEffect(() => {
    // Capture client-side date info
    const now = new Date()
    setClientDate({
      iso: now.toISOString(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      timezoneOffset: now.getTimezoneOffset(),
      formatted: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`,
    })

    const fetchDebugData = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch('/api/debug/activity-streak', {
          cache: 'no-store',
        })

        if (!response.ok) {
          throw new Error('Failed to fetch debug data')
        }

        const result = await response.json()

        if (result.success && result.debug) {
          setDebugData(result.debug)
        } else {
          throw new Error(result.error || 'Invalid response format')
        }
      } catch (err) {
        console.error('Error fetching debug data:', err)
        setError(
          err instanceof Error ? err.message : 'Failed to load debug data'
        )
      } finally {
        setLoading(false)
      }
    }

    if (session?.user) {
      fetchDebugData()
    }
  }, [session])

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

  if (error || !debugData) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error || 'Failed to load debug data'}</Alert>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Activity Streak Debug Information
      </Typography>

      <Stack spacing={3}>
        {/* Timezone Comparison */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom color="primary">
            Timezone Comparison
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Client (Browser)
            </Typography>
            <Typography>
              <strong>Timezone:</strong> {clientDate.timezone}
            </Typography>
            <Typography>
              <strong>Offset:</strong> {clientDate.timezoneOffset} minutes
            </Typography>
            <Typography>
              <strong>Current Date:</strong> {clientDate.formatted}
            </Typography>
            <Typography>
              <strong>ISO:</strong> {clientDate.iso}
            </Typography>
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Server (Production)
            </Typography>
            <Typography>
              <strong>Timezone:</strong> {debugData.serverDate.timezone}
            </Typography>
            <Typography>
              <strong>Offset:</strong> {debugData.serverDate.timezoneOffset}{' '}
              minutes
            </Typography>
            <Typography>
              <strong>Current Date:</strong> {debugData.serverDate.formatted}
            </Typography>
            <Typography>
              <strong>ISO:</strong> {debugData.serverDate.iso}
            </Typography>
            <Typography>
              <strong>Local String:</strong> {debugData.serverDate.local}
            </Typography>
          </Box>
          {clientDate.formatted !== debugData.serverDate.formatted && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              <strong>DATE MISMATCH DETECTED!</strong>
              <br />
              Client date ({clientDate.formatted}) ≠ Server date (
              {debugData.serverDate.formatted})
              <br />
              This is likely causing your streak calculation difference!
            </Alert>
          )}
        </Paper>

        {/* Streak Calculation */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom color="primary">
            Streak Calculation
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 2 }}>
            <Chip
              label={`Calculated Streak: ${debugData.calculatedStreak} days`}
              color="primary"
            />
            <Chip
              label={`Last Activity: ${debugData.lastActivityDate || 'None'}`}
              color={debugData.daysSinceLastActivity <= 1 ? 'success' : 'error'}
            />
            <Chip
              label={`Days Since: ${debugData.daysSinceLastActivity}`}
              color={debugData.streakBroken ? 'error' : 'success'}
            />
            <Chip
              label={
                debugData.streakBroken ? 'Streak Broken ❌' : 'Streak Active ✓'
              }
              color={debugData.streakBroken ? 'error' : 'success'}
            />
          </Box>

          <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
            Streak Calculation Details (Day by Day)
          </Typography>
          {debugData.streakCalculationDetails.map((detail, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                py: 1,
                borderBottom: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Chip
                label={`Day ${index}`}
                size="small"
                color={detail.match ? 'success' : 'default'}
              />
              <Typography>
                Expected: <strong>{detail.expected}</strong>
              </Typography>
              <Typography>
                Actual: <strong>{detail.actual}</strong>
              </Typography>
              <Chip
                label={detail.match ? '✓ Match' : '✗ No Match'}
                color={detail.match ? 'success' : 'error'}
                size="small"
              />
            </Box>
          ))}
        </Paper>

        {/* Activity Summary */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom color="primary">
            Activity Summary
          </Typography>
          <Typography>
            <strong>Total Activities:</strong> {debugData.totalActivities}
          </Typography>
          <Typography>
            <strong>Asanas:</strong> {debugData.activityCounts.asana}
          </Typography>
          <Typography>
            <strong>Series:</strong> {debugData.activityCounts.series}
          </Typography>
          <Typography>
            <strong>Sequences:</strong> {debugData.activityCounts.sequence}
          </Typography>
          <Typography sx={{ mt: 2 }}>
            <strong>Unique Days with Activity:</strong>{' '}
            {debugData.uniqueDaysWithActivity.length}
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Sorted Days (Most Recent First):
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {debugData.sortedDays.slice(0, 20).map((day, index) => (
                <Chip key={index} label={day} size="small" />
              ))}
            </Box>
          </Box>
        </Paper>

        {/* Detailed Activity Dates */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom color="primary">
            Detailed Activity Dates (Recent 20)
          </Typography>
          {debugData.uniqueDaysWithActivity.slice(0, 20).map((day, index) => (
            <Box
              key={index}
              sx={{
                py: 2,
                borderBottom: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Typography variant="subtitle2">
                <strong>{day.dateStr}</strong>
              </Typography>
              <Typography variant="body2">ISO: {day.originalISO}</Typography>
              <Typography variant="body2">UTC: {day.utcDate}</Typography>
              <Box sx={{ mt: 1 }}>
                {day.activities.map((activity, i) => (
                  <Chip
                    key={i}
                    label={activity}
                    size="small"
                    sx={{ mr: 0.5 }}
                  />
                ))}
              </Box>
            </Box>
          ))}
        </Paper>
      </Stack>
    </Container>
  )
}

export default ActivityStreakDebug
