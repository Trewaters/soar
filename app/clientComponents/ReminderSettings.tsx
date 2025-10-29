'use client'

import React, { useState, useEffect, useCallback } from 'react'
import {
  Box,
  Card,
  CardContent,
  CardHeader,
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
  Email as EmailIcon,
  EmailOutlined as EmailOffIcon,
} from '@mui/icons-material'
import { useSession } from 'next-auth/react'
import {
  disablePushNotifications,
  isPushSupported,
  getNotificationPermission,
  getExistingSubscription,
  sendTestNotification,
} from '../utils/subscribe-push'
import {
  enablePushNotificationsEnhanced,
  debugPushNotifications,
} from '../utils/subscribe-push-enhanced'

interface ReminderData {
  timeOfDay: string
  timezone: string
  days: string[]
  message: string
  enabled: boolean
  emailNotificationsEnabled?: boolean // Add email notifications preference
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
    emailNotificationsEnabled: true, // Default to enabled
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
      // Use enhanced push notification function with better error handling
      const result = await enablePushNotificationsEnhanced()

      if (result.success) {
        setPushSubscribed(true)
        setPermissionStatus('granted')
        showNotification('success', 'Push notifications enabled successfully!')
      } else {
        // Enhanced error reporting with diagnostics
        console.error(
          'Push notification failed:',
          result.error,
          result.diagnostics
        )

        let errorMessage = result.error || 'Failed to enable push notifications'

        // Check for production AbortError scenario with email fallback
        const isProduction =
          window.location.hostname === 'www.happyyoga.app' ||
          window.location.hostname === 'happyyoga.app'

        if (
          isProduction &&
          result.diagnostics?.productionFallback &&
          result.error?.includes('browser service limitations')
        ) {
          // For production AbortError with fallback, show info instead of error
          showNotification(
            'info',
            'Push notifications temporarily unavailable - email reminders active'
          )
        } else {
          // Handle all other error cases
          if (
            result.error?.includes('AbortError') ||
            result.error?.includes('Registration failed')
          ) {
            errorMessage = isProduction
              ? 'Push service temporarily unavailable. Your reminders will be sent via email instead.'
              : 'Push service registration failed. Please try clearing your browser cache and cookies for this site, then try again.'
          } else if (result.error?.includes('NotSupportedError')) {
            errorMessage =
              'Push notifications are not supported in this browser. Please try using Chrome, Firefox, or Safari.'
          } else if (result.error?.includes('NotAllowedError')) {
            errorMessage =
              'Push notifications are blocked. Please enable notifications in your browser settings.'
          } else if (result.error?.includes('VAPID')) {
            errorMessage = 'Configuration error. Please contact support.'
          }

          showNotification('error', errorMessage)
        }
      }
    } catch (error) {
      console.error('Unexpected error enabling push notifications:', error)
      showNotification(
        'error',
        'Unexpected error enabling push notifications. Please try again.'
      )
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

  const handleTestEmailNotification = async () => {
    if (!session?.user?.email) {
      showNotification('warning', 'No email address found in your account')
      return
    }

    if (!reminderData.emailNotificationsEnabled) {
      showNotification('warning', 'Email notifications are disabled')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/test/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const result = await response.json()
        showNotification(
          'success',
          `Test email sent to ${session.user.email}! Check your inbox.`
        )
      } else {
        const error = await response.json()
        showNotification('error', error.error || 'Failed to send test email')
      }
    } catch (error) {
      console.error('Test email error:', error)
      showNotification('error', 'Failed to send test email')
    } finally {
      setLoading(false)
    }
  }

  const handleDebugPushNotifications = async () => {
    setLoading(true)
    try {
      const debugInfo = await debugPushNotifications()

      // Show comprehensive debug info to user
      const debugMessage = [
        '🔍 Push Notification Debug Results:',
        '',
        '📊 System Status:',
        ...debugInfo.recommendations.slice(0, 5), // Show first 5 recommendations
        '',
        debugInfo.canAttemptFix
          ? '✅ System ready - you can try enabling push notifications'
          : '❌ Issues detected - check browser console for details',
        '',
        'Full debug report logged to browser console.',
      ].join('\n')

      showNotification(
        debugInfo.canAttemptFix ? 'success' : 'warning',
        debugMessage
      )

      // Also show critical issues immediately
      const criticalIssues = debugInfo.recommendations.filter((r) =>
        r.startsWith('❌')
      )
      if (criticalIssues.length > 0) {
        showNotification(
          'error',
          `Critical Issues Found:\n${criticalIssues.join('\n')}`
        )
      }
    } catch (error) {
      console.error('Debug check failed:', error)
      showNotification('error', 'Debug check failed - see console for details')
    } finally {
      setLoading(false)
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

          {/* Notification Methods Status */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Notification Methods
            </Typography>

            {/* Push Notifications Status */}
            <Box
              sx={{
                mb: 2,
                p: 2,
                bgcolor: 'background.paper',
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                alignItems={{ xs: 'stretch', sm: 'center' }}
                justifyContent="space-between"
              >
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    sx={{ flexWrap: 'wrap' }}
                  >
                    {pushSubscribed ? (
                      <Chip
                        icon={<NotificationsIcon />}
                        label="Push notifications enabled"
                        color="success"
                        variant="filled"
                      />
                    ) : (
                      <Chip
                        icon={<NotificationsOffIcon />}
                        label="Push notifications disabled"
                        color="default"
                        variant="outlined"
                      />
                    )}
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ minWidth: 0 }}
                    >
                      Instant browser notifications
                    </Typography>
                  </Stack>
                </Box>

                <Box sx={{ flexShrink: 0 }}>
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{
                      justifyContent: { xs: 'flex-end', sm: 'flex-start' },
                    }}
                  >
                    {pushSubscribed ? (
                      <>
                        <Button
                          variant="outlined"
                          onClick={handleTestNotification}
                          size="small"
                          disabled={loading}
                        >
                          Test
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={handleDisablePushNotifications}
                          disabled={loading}
                          startIcon={<NotificationsOffIcon />}
                          size="small"
                        >
                          Disable
                        </Button>
                      </>
                    ) : (
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
                        sx={{ minWidth: 'fit-content' }}
                      >
                        Enable
                      </Button>
                    )}
                  </Stack>
                </Box>
              </Stack>
            </Box>

            {/* Email Notifications Status */}
            <Box
              sx={{
                mb: 2,
                p: 2,
                bgcolor: 'background.paper',
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                alignItems={{ xs: 'stretch', sm: 'center' }}
                justifyContent="space-between"
              >
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    sx={{ flexWrap: 'wrap' }}
                  >
                    {session?.user?.email &&
                    reminderData.emailNotificationsEnabled ? (
                      <Chip
                        icon={<EmailIcon />}
                        label="Email notifications enabled"
                        color="info"
                        variant="filled"
                      />
                    ) : (
                      <Chip
                        icon={<EmailOffIcon />}
                        label={
                          session?.user?.email
                            ? 'Email notifications disabled'
                            : 'No email available'
                        }
                        color="default"
                        variant="outlined"
                      />
                    )}
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ minWidth: 0 }}
                    >
                      {session?.user?.email
                        ? `Sent to ${session.user.email}`
                        : 'Backup method when push fails'}
                    </Typography>
                  </Stack>
                </Box>

                <Box sx={{ flexShrink: 0 }}>
                  {session?.user?.email && (
                    <Stack direction="row" spacing={1} alignItems="center">
                      {reminderData.emailNotificationsEnabled && (
                        <Button
                          variant="outlined"
                          onClick={handleTestEmailNotification}
                          size="small"
                          disabled={loading}
                        >
                          Test Email
                        </Button>
                      )}
                      <FormControlLabel
                        control={
                          <Switch
                            checked={
                              reminderData.emailNotificationsEnabled ?? true
                            }
                            onChange={(e) =>
                              handleInputChange(
                                'emailNotificationsEnabled',
                                e.target.checked
                              )
                            }
                            size="small"
                          />
                        }
                        label=""
                        sx={{ m: 0 }}
                      />
                    </Stack>
                  )}
                </Box>
              </Stack>
            </Box>

            {/* Notification Status Alerts */}
            {permissionStatus === 'denied' && (
              <Alert severity="error" sx={{ mt: 1 }}>
                Browser notifications are blocked. Please enable them in your
                browser settings.
              </Alert>
            )}

            {!session?.user?.email && (
              <Alert severity="warning" sx={{ mt: 1 }}>
                No email address found in your account. Email reminders will not
                be available as backup.
              </Alert>
            )}

            {!pushSubscribed && !session?.user?.email && (
              <Alert severity="error" sx={{ mt: 1 }}>
                No notification methods available. Please add an email to your
                account or enable push notifications.
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

      {/* Debug Section - Only show in development */}
      {process.env.NODE_ENV === 'development' && (
        <Card
          elevation={1}
          sx={{
            bgcolor: 'grey.50',
            borderLeft: 4,
            borderLeftColor: 'warning.main',
          }}
        >
          <CardHeader
            title="🔧 Push Notification Debug Tools"
            titleTypographyProps={{ variant: 'h6', color: 'warning.main' }}
            subheader="Development tools to diagnose push notification issues"
          />
          <CardContent>
            <Stack spacing={2}>
              <Typography variant="body2" color="text.secondary">
                Use these tools to diagnose and fix push notification problems:
              </Typography>

              <Stack direction="row" spacing={2} flexWrap="wrap">
                <Button
                  variant="outlined"
                  size="small"
                  onClick={handleDebugPushNotifications}
                  disabled={loading}
                  startIcon={<CheckIcon />}
                >
                  Debug Push System
                </Button>

                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    import('../utils/push-debug').then(({ quickPushTest }) => {
                      quickPushTest()
                    })
                  }}
                  startIcon={<CheckIcon />}
                >
                  Quick Test
                </Button>

                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    // Environment diagnostic logging (intentional)
                    console.clear()
                    console.log('🧘‍♀️ ENVIRONMENT INFO:')
                    console.log(
                      '- VAPID Key:',
                      !!process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
                    )
                  }}
                >
                  Environment Info
                </Button>
              </Stack>

              <Typography variant="caption" color="text.secondary">
                💡 Open browser Developer Tools (F12) → Console to see
                diagnostic output
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      )}
    </Stack>
  )
}
