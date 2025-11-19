'use client'

import React, { useState } from 'react'
import { Typography, Paper, Stack, Switch, Box, Divider } from '@mui/material'

interface NotificationPreferencesProps {
  // eslint-disable-next-line no-unused-vars
  onInAppChange: (value: boolean) => void
  // eslint-disable-next-line no-unused-vars
  onEmailChange: (value: boolean) => void
  inAppEnabled: boolean
  emailEnabled: boolean
}

export default function NotificationPreferences({
  onInAppChange,
  onEmailChange,
  inAppEnabled,
  emailEnabled,
}: NotificationPreferencesProps) {
  // Sub-preferences for email notifications
  const [emailPrefs, setEmailPrefs] = useState({
    dailyPractice: true,
    newFeatures: true,
    progress: true,
    loginStreak: true,
    activityStreak: true,
  })

  // Sub-preferences for in-app notifications
  const [inAppPrefs, setInAppPrefs] = useState({
    dailyPractice: true,
    newFeatures: true,
    progress: true,
    loginStreak: true,
    activityStreak: true,
  })

  const handleInAppToggle = () => {
    const newValue = !inAppEnabled
    onInAppChange(newValue)
  }

  const handleEmailToggle = () => {
    const newValue = !emailEnabled
    onEmailChange(newValue)
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
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
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
          <Switch
            checked={inAppEnabled}
            onClick={handleInAppToggle}
            inputProps={{ 'aria-label': 'In-App Notifications toggle' }}
            sx={{
              '& .MuiSwitch-switchBase.Mui-checked': {
                color: 'primary.main',
              },
              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                backgroundColor: 'primary.main',
              },
            }}
          />
        </Box>

        {/* In-App sub-options */}
        <Box sx={{ pl: 3 }}>
          <Stack spacing={1.5}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Daily Practice Reminders
              </Typography>
              <Switch
                checked={inAppPrefs.dailyPractice}
                onChange={(e) =>
                  setInAppPrefs((prev) => ({
                    ...prev,
                    dailyPractice: e.target.checked,
                  }))
                }
                disabled={!inAppEnabled}
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
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                New Feature Announcements
              </Typography>
              <Switch
                checked={inAppPrefs.newFeatures}
                onChange={(e) =>
                  setInAppPrefs((prev) => ({
                    ...prev,
                    newFeatures: e.target.checked,
                  }))
                }
                disabled={!inAppEnabled}
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
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Progress Milestones
              </Typography>
              <Switch
                checked={inAppPrefs.progress}
                onChange={(e) =>
                  setInAppPrefs((prev) => ({
                    ...prev,
                    progress: e.target.checked,
                  }))
                }
                disabled={!inAppEnabled}
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
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Login streak reminders
              </Typography>
              <Switch
                checked={inAppPrefs.loginStreak}
                onChange={(e) =>
                  setInAppPrefs((prev) => ({
                    ...prev,
                    loginStreak: e.target.checked,
                  }))
                }
                disabled={!inAppEnabled}
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
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Activity streak reminders
              </Typography>
              <Switch
                checked={inAppPrefs.activityStreak}
                onChange={(e) =>
                  setInAppPrefs((prev) => ({
                    ...prev,
                    activityStreak: e.target.checked,
                  }))
                }
                disabled={!inAppEnabled}
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
            </Box>
          </Stack>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Email Notifications Section */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
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
          <Switch
            checked={emailEnabled}
            onClick={handleEmailToggle}
            inputProps={{ 'aria-label': 'Email Notifications toggle' }}
            sx={{
              '& .MuiSwitch-switchBase.Mui-checked': {
                color: 'primary.main',
              },
              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                backgroundColor: 'primary.main',
              },
            }}
          />
        </Box>

        {/* Email sub-options */}
        <Box sx={{ pl: 3 }}>
          <Stack spacing={1.5}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Daily Practice Reminders
              </Typography>
              <Switch
                checked={emailPrefs.dailyPractice}
                onChange={(e) =>
                  setEmailPrefs((prev) => ({
                    ...prev,
                    dailyPractice: e.target.checked,
                  }))
                }
                disabled={!emailEnabled}
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
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                New Feature Announcements
              </Typography>
              <Switch
                checked={emailPrefs.newFeatures}
                onChange={(e) =>
                  setEmailPrefs((prev) => ({
                    ...prev,
                    newFeatures: e.target.checked,
                  }))
                }
                disabled={!emailEnabled}
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
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Progress Milestones
              </Typography>
              <Switch
                checked={emailPrefs.progress}
                onChange={(e) =>
                  setEmailPrefs((prev) => ({
                    ...prev,
                    progress: e.target.checked,
                  }))
                }
                disabled={!emailEnabled}
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
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Login streak reminders
              </Typography>
              <Switch
                checked={emailPrefs.loginStreak}
                onChange={(e) =>
                  setEmailPrefs((prev) => ({
                    ...prev,
                    loginStreak: e.target.checked,
                  }))
                }
                disabled={!emailEnabled}
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
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Activity streak reminders
              </Typography>
              <Switch
                checked={emailPrefs.activityStreak}
                onChange={(e) =>
                  setEmailPrefs((prev) => ({
                    ...prev,
                    activityStreak: e.target.checked,
                  }))
                }
                disabled={!emailEnabled}
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
            </Box>
          </Stack>
        </Box>
      </Stack>
    </Paper>
  )
}
