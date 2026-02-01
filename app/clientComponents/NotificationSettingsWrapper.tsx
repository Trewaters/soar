'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Stack, Alert, CircularProgress } from '@mui/material'
import NotificationPreferences from '@app/clientComponents/NotificationPreferences'
import ReminderSettings from '@app/clientComponents/ReminderSettings'

interface NotificationPreferencesData {
  inApp: boolean
  email: boolean
  inAppSubPreferences: {
    dailyPractice: boolean
    newFeatures: boolean
    progressMilestones: boolean
    loginStreak: boolean
    activityStreak: boolean
  }
  emailSubPreferences: {
    dailyPractice: boolean
    newFeatures: boolean
    progressMilestones: boolean
    loginStreak: boolean
    activityStreak: boolean
  }
}

export default function NotificationSettingsWrapper() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reminderData, setReminderData] = useState<any>(null)
  const [preferences, setPreferences] = useState<NotificationPreferencesData>({
    inApp: true,
    email: true,
    inAppSubPreferences: {
      dailyPractice: true,
      newFeatures: true,
      progressMilestones: true,
      loginStreak: true,
      activityStreak: true,
    },
    emailSubPreferences: {
      dailyPractice: true,
      newFeatures: true,
      progressMilestones: true,
      loginStreak: true,
      activityStreak: true,
    },
  })

  // Load preferences from API on mount
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const response = await fetch('/api/reminders')
        if (!response.ok) {
          throw new Error('Failed to load notification preferences')
        }
        const data = await response.json()

        // Store the full reminder data to preserve when saving preferences
        setReminderData(data)

        // If notificationPreferences exists in the response, use it
        if (data.notificationPreferences) {
          const prefs = data.notificationPreferences

          // Handle migration from old format (single subPreferences) to new format (separate in-app and email)
          if (
            prefs.subPreferences &&
            (!prefs.inAppSubPreferences || !prefs.emailSubPreferences)
          ) {
            // Old format detected - migrate to new format
            setPreferences({
              inApp: prefs.inApp ?? true,
              email: prefs.email ?? true,
              inAppSubPreferences: { ...prefs.subPreferences },
              emailSubPreferences: { ...prefs.subPreferences },
            })
          } else {
            // New format - use as is
            setPreferences(prefs)
          }
        }
        setError(null)
      } catch (err) {
        console.error('Error loading notification preferences:', err)
        setError('Failed to load preferences. Using defaults.')
      } finally {
        setLoading(false)
      }
    }

    loadPreferences()
  }, [])

  // Save preferences to API whenever they change
  const savePreferences = useCallback(
    async (newPreferences: NotificationPreferencesData) => {
      try {
        const payload = {
          // Preserve existing reminder settings
          timeOfDay: reminderData?.timeOfDay || '08:00',
          days: reminderData?.days || ['Mon', 'Wed', 'Fri'],
          message: reminderData?.message || 'Time for your yoga practice! 🧘‍♀️',
          enabled: reminderData?.enabled ?? true,
          tz: reminderData?.timezone,
          // Update notification preferences
          notificationPreferences: newPreferences,
        }

        const response = await fetch('/api/reminders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        if (!response.ok) {
          const errorText = await response.text()
          console.error('❌ Server error:', response.status, errorText)
          throw new Error('Failed to save notification preferences')
        }

        setError(null)
      } catch (err) {
        console.error('❌ Error saving notification preferences:', err)
        setError('Failed to save preferences. Please try again.')
        throw err // Re-throw so handlePreferencesChange can catch it
      }
    },
    [reminderData]
  )

  const handlePreferencesChange = useCallback(
    (newPreferences: NotificationPreferencesData) => {
      // Update local state immediately for responsive UI
      setPreferences(newPreferences)

      // Save to server in background
      savePreferences(newPreferences).catch((err) => {
        console.error('❌ Failed to save preferences:', err)
        // Optionally: revert to previous state on error
      })
    },
    [savePreferences]
  )

  if (loading) {
    return (
      <Stack spacing={3} alignItems="center" py={4}>
        <CircularProgress />
      </Stack>
    )
  }

  return (
    <Stack spacing={3}>
      {error && (
        <Alert severity="warning" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Notification Preferences Controls */}
      <NotificationPreferences
        preferences={preferences}
        onPreferencesChange={handlePreferencesChange}
      />

      {/* Reminder Settings - controlled by above preferences */}
      <ReminderSettings
        inAppNotificationsEnabled={preferences.inApp}
        emailNotificationsEnabled={preferences.email}
      />
    </Stack>
  )
}
