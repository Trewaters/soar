'use client'

import React from 'react'
import {
  Typography,
  Paper,
  Stack,
  Switch,
  Box,
  Divider,
  FormControlLabel,
} from '@mui/material'

export interface NotificationPreferencesData {
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

export interface NotificationPreferencesProps {
  preferences: NotificationPreferencesData
  // eslint-disable-next-line no-unused-vars
  onPreferencesChange: (preferences: NotificationPreferencesData) => void
}

export default function NotificationPreferences({
  preferences,
  onPreferencesChange,
}: NotificationPreferencesProps) {
  const handleInAppToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.checked

    onPreferencesChange({
      ...preferences,
      inApp: newValue,
    })
  }

  const handleEmailToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.checked

    onPreferencesChange({
      ...preferences,
      email: newValue,
    })
  }

  const handleInAppSubPrefChange = (
    key: keyof NotificationPreferencesData['inAppSubPreferences'],
    value: boolean
  ) => {
    onPreferencesChange({
      ...preferences,
      inAppSubPreferences: {
        ...preferences.inAppSubPreferences,
        [key]: value,
      },
    })
  }

  const handleEmailSubPrefChange = (
    key: keyof NotificationPreferencesData['emailSubPreferences'],
    value: boolean
  ) => {
    onPreferencesChange({
      ...preferences,
      emailSubPreferences: {
        ...preferences.emailSubPreferences,
        [key]: value,
      },
    })
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'primary.main',
      }}
    >
      <Typography
        variant="h6"
        sx={{ color: 'text.primary', fontWeight: 600, mb: 3 }}
      >
        Preferences
      </Typography>

      <Stack spacing={2}>
        {/* In-App Notifications Section */}
        <Box>
          <FormControlLabel
            control={
              <Switch
                checked={preferences.inApp}
                onChange={handleInAppToggle}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: 'primary.main',
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: 'primary.main',
                  },
                }}
              />
            }
            label={
              <Box>
                <Typography
                  variant="body1"
                  sx={{ color: 'text.primary', fontWeight: 500 }}
                >
                  In-App Notifications
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Instant browser notifications
                </Typography>
              </Box>
            }
            sx={{ alignItems: 'flex-start', mb: 2 }}
          />
        </Box>

        {/* In-App sub-options */}
        <Box sx={{ pl: 3 }}>
          <Stack spacing={1.5}>
            <FormControlLabel
              control={
                <Switch
                  checked={preferences.inAppSubPreferences.dailyPractice}
                  onChange={(e) =>
                    handleInAppSubPrefChange('dailyPractice', e.target.checked)
                  }
                  disabled={!preferences.inApp}
                  size="small"
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: 'primary.main',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: 'primary.main',
                    },
                  }}
                />
              }
              label={
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Daily Practice Reminders
                </Typography>
              }
            />
            <FormControlLabel
              control={
                <Switch
                  checked={preferences.inAppSubPreferences.newFeatures}
                  onChange={(e) =>
                    handleInAppSubPrefChange('newFeatures', e.target.checked)
                  }
                  disabled={!preferences.inApp}
                  size="small"
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: 'primary.main',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: 'primary.main',
                    },
                  }}
                />
              }
              label={
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  New Feature Announcements
                </Typography>
              }
            />
            <FormControlLabel
              control={
                <Switch
                  checked={preferences.inAppSubPreferences.progressMilestones}
                  onChange={(e) =>
                    handleInAppSubPrefChange(
                      'progressMilestones',
                      e.target.checked
                    )
                  }
                  disabled={!preferences.inApp}
                  size="small"
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: 'primary.main',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: 'primary.main',
                    },
                  }}
                />
              }
              label={
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Progress Milestones
                </Typography>
              }
            />
            <FormControlLabel
              control={
                <Switch
                  checked={preferences.inAppSubPreferences.loginStreak}
                  onChange={(e) =>
                    handleInAppSubPrefChange('loginStreak', e.target.checked)
                  }
                  disabled={!preferences.inApp}
                  size="small"
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: 'primary.main',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: 'primary.main',
                    },
                  }}
                />
              }
              label={
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Login streak reminders
                </Typography>
              }
            />
            <FormControlLabel
              control={
                <Switch
                  checked={preferences.inAppSubPreferences.activityStreak}
                  onChange={(e) =>
                    handleInAppSubPrefChange('activityStreak', e.target.checked)
                  }
                  disabled={!preferences.inApp}
                  size="small"
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: 'primary.main',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: 'primary.main',
                    },
                  }}
                />
              }
              label={
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Activity streak reminders
                </Typography>
              }
            />
          </Stack>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Email Notifications Section */}
        <Box>
          <FormControlLabel
            control={
              <Switch
                checked={preferences.email}
                onChange={handleEmailToggle}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: 'primary.main',
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: 'primary.main',
                  },
                }}
              />
            }
            label={
              <Box>
                <Typography
                  variant="body1"
                  sx={{ color: 'text.primary', fontWeight: 500 }}
                >
                  Email Notifications
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Backup when push notifications fail
                </Typography>
              </Box>
            }
            sx={{ alignItems: 'flex-start', mb: 2 }}
          />
        </Box>

        {/* Email sub-options - Same structure as in-app */}
        <Box sx={{ pl: 3 }}>
          <Stack spacing={1.5}>
            <FormControlLabel
              control={
                <Switch
                  checked={preferences.emailSubPreferences.dailyPractice}
                  onChange={(e) =>
                    handleEmailSubPrefChange('dailyPractice', e.target.checked)
                  }
                  disabled={!preferences.email}
                  size="small"
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: 'primary.main',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: 'primary.main',
                    },
                  }}
                />
              }
              label={
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Daily Practice Reminders
                </Typography>
              }
            />
            <FormControlLabel
              control={
                <Switch
                  checked={preferences.emailSubPreferences.newFeatures}
                  onChange={(e) =>
                    handleEmailSubPrefChange('newFeatures', e.target.checked)
                  }
                  disabled={!preferences.email}
                  size="small"
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: 'primary.main',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: 'primary.main',
                    },
                  }}
                />
              }
              label={
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  New Feature Announcements
                </Typography>
              }
            />
            <FormControlLabel
              control={
                <Switch
                  checked={preferences.emailSubPreferences.progressMilestones}
                  onChange={(e) =>
                    handleEmailSubPrefChange(
                      'progressMilestones',
                      e.target.checked
                    )
                  }
                  disabled={!preferences.email}
                  size="small"
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: 'primary.main',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: 'primary.main',
                    },
                  }}
                />
              }
              label={
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Progress Milestones
                </Typography>
              }
            />
            <FormControlLabel
              control={
                <Switch
                  checked={preferences.emailSubPreferences.loginStreak}
                  onChange={(e) =>
                    handleEmailSubPrefChange('loginStreak', e.target.checked)
                  }
                  disabled={!preferences.email}
                  size="small"
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: 'primary.main',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: 'primary.main',
                    },
                  }}
                />
              }
              label={
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Login streak reminders
                </Typography>
              }
            />
            <FormControlLabel
              control={
                <Switch
                  checked={preferences.emailSubPreferences.activityStreak}
                  onChange={(e) =>
                    handleEmailSubPrefChange('activityStreak', e.target.checked)
                  }
                  disabled={!preferences.email}
                  size="small"
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: 'primary.main',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: 'primary.main',
                    },
                  }}
                />
              }
              label={
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Activity streak reminders
                </Typography>
              }
            />
          </Stack>
        </Box>
      </Stack>
    </Paper>
  )
}
