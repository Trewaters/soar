'use client'

import React, { useState } from 'react'
import { Stack } from '@mui/material'
import NotificationPreferences from '@app/clientComponents/NotificationPreferences'
import ReminderSettings from '@app/clientComponents/ReminderSettings'

export default function NotificationSettingsWrapper() {
  const [inAppEnabled, setInAppEnabled] = useState(true)
  const [emailEnabled, setEmailEnabled] = useState(true)

  const handleInAppChange = (value: boolean) => {
    setInAppEnabled(value)
  }

  const handleEmailChange = (value: boolean) => {
    setEmailEnabled(value)
  }

  return (
    <Stack spacing={3}>
      {/* Notification Preferences Controls */}
      <NotificationPreferences
        onInAppChange={handleInAppChange}
        onEmailChange={handleEmailChange}
        inAppEnabled={inAppEnabled}
        emailEnabled={emailEnabled}
      />

      {/* Reminder Settings - controlled by above preferences */}
      <ReminderSettings
        inAppNotificationsEnabled={inAppEnabled}
        emailNotificationsEnabled={emailEnabled}
      />
    </Stack>
  )
}
