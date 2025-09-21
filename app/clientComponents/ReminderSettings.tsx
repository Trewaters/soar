'use client'

import React, { useState, useEffect, useCallback } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  FormControl,
  FormLabel,
  TextField,
  Select,
  MenuItem,
  FormControlLabel,
  Stack,
  Alert,
  Chip,
  Switch,
  Tooltip,
  Collapse,
  CircularProgress,
} from '@mui/material'
import {
  Notifications as NotificationsIcon,
  NotificationsOff as NotificationsOffIcon,
  Schedule as ScheduleIcon,
  Check as CheckIcon,
  Info as InfoIcon,
} from '@mui/icons-material'
import { useSession } from 'next-auth/react'
import {
  enablePushNotifications,
  disablePushNotifications,
  getExistingSubscription,
  isPushSupported,
  getNotificationPermission,
  sendTestNotification,
} from '@app/utils/subscribe-push'

interface ReminderData {
  timeOfDay: string
  timezone: string
  days: string[]
  message: string
  enabled: boolean
}

const TIMEZONES = [
  'America/Los_Angeles',
  'America/Denver',
  'America/Chicago',
  'America/New_York',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Australia/Sydney',
  'America/Toronto',
  'America/Sao_Paulo',
  'Africa/Cairo',
  'Asia/Mumbai',
]

const DAYS_OF_WEEK = [
  { value: 'Mon', label: 'Monday' },
  { value: 'Tue', label: 'Tuesday' },
  { value: 'Wed', label: 'Wednesday' },
  { value: 'Thu', label: 'Thursday' },
  { value: 'Fri', label: 'Friday' },
  { value: 'Sat', label: 'Saturday' },
  { value: 'Sun', label: 'Sunday' },
]

export default function ReminderSettings() {
  const { data: session } = useSession()
  const [reminderData, setReminderData] = useState<ReminderData>({
    timeOfDay: '08:00',
    timezone: 'America/Los_Angeles',
    days: ['Mon', 'Wed', 'Fri'],
    message: 'Time for your yoga practice! 🧘‍♀️',
    enabled: false,
  })

  const [pushSubscribed, setPushSubscribed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [notification, setNotification] = useState<{
    type: 'success' | 'error' | 'info' | 'warning'
    message: string
  } | null>(null)
  const [browserSupport, setBrowserSupport] = useState(true)
  const [permissionStatus, setPermissionStatus] =
    useState<NotificationPermission>('default')

  // Check browser support and existing subscription on load
  useEffect(() => {
    const checkSupport = () => {
      const supported = isPushSupported()
      setBrowserSupport(supported)

      if (supported) {
        setPermissionStatus(getNotificationPermission())
      }
    }

    const checkExistingSubscription = async () => {
      try {
        const subscription = await getExistingSubscription()
        setPushSubscribed(!!subscription)
      } catch (error) {
        console.error('Error checking existing subscription:', error)
      }
    }

    checkSupport()
    checkExistingSubscription()
  }, [])

  // Auto-detect user's timezone
  useEffect(() => {
    try {
      const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
      if (TIMEZONES.includes(userTimezone)) {
        setReminderData((prev) => ({ ...prev, timezone: userTimezone }))
      }
    } catch (error) {
      console.error('Error detecting timezone:', error)
    }
  }, [])

  // Fetch existing reminder settings when user session is available
  useEffect(() => {
    const fetchReminderSettings = async () => {
      if (!session?.user) return

      try {
        const response = await fetch('/api/reminders')
        if (response.ok) {
          const data = await response.json()
          setReminderData(data)
        } else {
          console.error('Failed to fetch reminder settings')
        }
      } catch (error) {
        console.error('Error fetching reminder settings:', error)
      }
    }

    fetchReminderSettings()
  }, [session?.user])

  const showNotification = useCallback(
    (type: 'success' | 'error' | 'info' | 'warning', message: string) => {
      setNotification({ type, message })
      setTimeout(() => setNotification(null), 5000)
    },
    []
  )

  const handleInputChange = useCallback(
    (field: keyof ReminderData, value: any) => {
      setReminderData((prev) => ({ ...prev, [field]: value }))
    },
    []
  )

  const handleDayToggle = useCallback((day: string) => {
    setReminderData((prev) => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter((d) => d !== day)
        : [...prev.days, day],
    }))
  }, [])

  const handleEnablePushNotifications = async () => {
    if (!session?.user) {
      showNotification('error', 'Please log in to enable notifications')
      return
    }

    setLoading(true)
    try {
      const result = await enablePushNotifications()

      if (result.success) {
        setPushSubscribed(true)
        setPermissionStatus('granted')
        showNotification('success', 'Push notifications enabled successfully!')
      } else {
        showNotification(
          'error',
          result.error || 'Failed to enable push notifications'
        )
      }
    } catch (error) {
      showNotification('error', 'Error enabling push notifications')
    } finally {
      setLoading(false)
    }
  }

  const handleDisablePushNotifications = async () => {
    setLoading(true)
    try {
      const result = await disablePushNotifications()

      if (result.success) {
        setPushSubscribed(false)
        showNotification('info', 'Push notifications disabled')
      } else {
        showNotification(
          'error',
          result.error || 'Failed to disable push notifications'
        )
      }
    } catch (error) {
      showNotification('error', 'Error disabling push notifications')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSettings = async () => {
    if (!session?.user) {
      showNotification('error', 'Please log in to save settings')
      return
    }

    if (reminderData.days.length === 0) {
      showNotification(
        'warning',
        'Please select at least one day for reminders'
      )
      return
    }

    setSaving(true)
    try {
      const response = await fetch('/api/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reminderData),
      })

      if (response.ok) {
        showNotification('success', 'Reminder settings saved successfully!')
      } else {
        const errorData = await response.json()
        showNotification(
          'error',
          errorData.message || 'Failed to save settings'
        )
      }
    } catch (error) {
      showNotification('error', 'Error saving reminder settings')
    } finally {
      setSaving(false)
    }
  }

  const handleTestNotification = async () => {
    if (!pushSubscribed || permissionStatus !== 'granted') {
      showNotification('warning', 'Please enable push notifications first')
      return
    }

    try {
      await sendTestNotification()
      showNotification('success', 'Test notification sent! Check for it above.')
    } catch (error) {
      showNotification('error', 'Failed to send test notification')
    }
  }

  if (!session?.user) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Yoga Practice Reminders
          </Typography>
          <Alert severity="info">
            Please log in to configure your yoga practice reminders.
          </Alert>
        </CardContent>
      </Card>
    )
  }

  if (!browserSupport) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Yoga Practice Reminders
          </Typography>
          <Alert severity="warning">
            Your browser doesn&apos;t support push notifications. You can still
            receive email reminders.
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Stack spacing={3}>
      {/* Notification Status */}
      <Card>
        <CardContent>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <ScheduleIcon />
            Yoga Practice Reminders
          </Typography>

          {notification && (
            <Alert severity={notification.type} sx={{ mb: 2 }}>
              {notification.message}
            </Alert>
          )}

          {/* Push Notification Setup */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Push Notifications
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
              {pushSubscribed ? (
                <>
                  <Chip
                    icon={<CheckIcon />}
                    label="Push notifications enabled"
                    color="success"
                    variant="outlined"
                  />
                  <Button
                    variant="outlined"
                    onClick={handleDisablePushNotifications}
                    disabled={loading}
                    startIcon={<NotificationsOffIcon />}
                    size="small"
                  >
                    Disable
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleTestNotification}
                    size="small"
                  >
                    Test
                  </Button>
                </>
              ) : (
                <>
                  <Chip
                    icon={<InfoIcon />}
                    label="Push notifications disabled"
                    color="default"
                    variant="outlined"
                  />
                  <Button
                    variant="contained"
                    onClick={handleEnablePushNotifications}
                    disabled={loading}
                    startIcon={
                      loading ? (
                        <CircularProgress size={16} />
                      ) : (
                        <NotificationsIcon />
                      )
                    }
                    size="small"
                  >
                    Enable Push Notifications
                  </Button>
                </>
              )}
            </Stack>

            {permissionStatus === 'denied' && (
              <Alert severity="error" sx={{ mt: 1 }}>
                Browser notifications are blocked. Please enable them in your
                browser settings.
              </Alert>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Reminder Configuration */}
      <Card>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>
            Reminder Schedule
          </Typography>

          <Stack spacing={3}>
            {/* Enable/Disable Reminders */}
            <FormControlLabel
              control={
                <Switch
                  checked={reminderData.enabled}
                  onChange={(e) =>
                    handleInputChange('enabled', e.target.checked)
                  }
                />
              }
              label="Enable practice reminders"
            />

            <Collapse in={reminderData.enabled}>
              <Stack spacing={3}>
                {/* Time of Day */}
                <FormControl>
                  <FormLabel>Time of Day</FormLabel>
                  <TextField
                    type="time"
                    value={reminderData.timeOfDay}
                    onChange={(e) =>
                      handleInputChange('timeOfDay', e.target.value)
                    }
                    fullWidth
                    size="small"
                    sx={{ mt: 1 }}
                  />
                </FormControl>

                {/* Timezone */}
                <FormControl>
                  <FormLabel>Timezone</FormLabel>
                  <Select
                    value={reminderData.timezone}
                    onChange={(e) =>
                      handleInputChange('timezone', e.target.value)
                    }
                    size="small"
                    fullWidth
                    sx={{ mt: 1 }}
                  >
                    {TIMEZONES.map((tz) => (
                      <MenuItem key={tz} value={tz}>
                        {tz.replace(/_/g, ' ')}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* Days of the Week */}
                <FormControl>
                  <FormLabel>Days of the Week</FormLabel>
                  <Box sx={{ mt: 1 }}>
                    <Stack
                      direction="row"
                      spacing={1}
                      flexWrap="wrap"
                      useFlexGap
                    >
                      {DAYS_OF_WEEK.map(({ value, label }) => (
                        <Tooltip key={value} title={label}>
                          <Chip
                            label={value}
                            onClick={() => handleDayToggle(value)}
                            color={
                              reminderData.days.includes(value)
                                ? 'primary'
                                : 'default'
                            }
                            variant={
                              reminderData.days.includes(value)
                                ? 'filled'
                                : 'outlined'
                            }
                            size="small"
                            sx={{ cursor: 'pointer' }}
                          />
                        </Tooltip>
                      ))}
                    </Stack>
                  </Box>
                </FormControl>

                {/* Custom Message */}
                <FormControl>
                  <FormLabel>Reminder Message</FormLabel>
                  <TextField
                    value={reminderData.message}
                    onChange={(e) =>
                      handleInputChange('message', e.target.value)
                    }
                    placeholder="Time for your yoga practice! 🧘‍♀️"
                    multiline
                    rows={2}
                    fullWidth
                    size="small"
                    sx={{ mt: 1 }}
                    inputProps={{ maxLength: 100 }}
                    helperText={`${reminderData.message.length}/100 characters`}
                  />
                </FormControl>

                {/* Save Button */}
                <Button
                  variant="contained"
                  onClick={handleSaveSettings}
                  disabled={saving || reminderData.days.length === 0}
                  startIcon={
                    saving ? <CircularProgress size={16} /> : <CheckIcon />
                  }
                  size="large"
                >
                  Save Reminder Settings
                </Button>
              </Stack>
            </Collapse>
          </Stack>
        </CardContent>
      </Card>

      {/* Information Card */}
      <Card>
        <CardContent>
          <Typography variant="subtitle2" gutterBottom>
            How it works
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • Notifications will be sent at your specified time in your local
            timezone
            <br />
            • If push notifications fail, we&apos;ll send an email reminder
            instead
            <br />
            • You can disable notifications anytime from this page
            <br />• Your notification preferences are saved automatically
          </Typography>
        </CardContent>
      </Card>
    </Stack>
  )
}
