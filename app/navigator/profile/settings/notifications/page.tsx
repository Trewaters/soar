import {
  Container,
  Typography,
  Paper,
  Stack,
  Switch,
  Box,
  Divider,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import { SessionProvider } from 'next-auth/react'
import ProfileNavMenu from '@app/navigator/profile/ProfileNavMenu'
import { auth } from '../../../../../auth'
import theme from '@styles/theme'

export default async function NotificationSettingsPage() {
  const session = await auth()

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <SessionProvider session={session}>
        <Grid container spacing={4}>
          {/* Profile Navigation Menu */}
          <Grid size={{ xs: 12, md: 4 }}>
            <ProfileNavMenu />
          </Grid>

          {/* Notification Settings Content */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Stack spacing={3}>
              <Typography
                variant="h1"
                component="h1"
                sx={{ color: theme.palette.success.main }}
                gutterBottom
              >
                Notifications
              </Typography>

              {/* Preferences Card */}
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

                {/* Email Notifications Section */}
                <Stack spacing={2}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{ color: 'text.primary', fontWeight: 500 }}
                    >
                      Email Notifications
                    </Typography>
                    <Switch
                      defaultChecked
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: 'primary.main',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track':
                          {
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
                        <Typography
                          variant="body2"
                          sx={{ color: 'text.secondary' }}
                        >
                          Daily Practice Reminders
                        </Typography>
                        <Switch
                          defaultChecked
                          size="small"
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                              color: 'primary.main',
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track':
                              {
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
                        <Typography
                          variant="body2"
                          sx={{ color: 'text.secondary' }}
                        >
                          New Feature Announcements
                        </Typography>
                        <Switch
                          defaultChecked
                          size="small"
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                              color: 'primary.main',
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track':
                              {
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
                        <Typography
                          variant="body2"
                          sx={{ color: 'text.secondary' }}
                        >
                          Progress Milestones
                        </Typography>
                        <Switch
                          defaultChecked
                          size="small"
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                              color: 'primary.main',
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track':
                              {
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
                        <Typography
                          variant="body2"
                          sx={{ color: 'text.secondary' }}
                        >
                          Login streak reminders
                        </Typography>
                        <Switch
                          defaultChecked
                          size="small"
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                              color: 'primary.main',
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track':
                              {
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
                        <Typography
                          variant="body2"
                          sx={{ color: 'text.secondary' }}
                        >
                          Activity streak reminders
                        </Typography>
                        <Switch
                          defaultChecked
                          size="small"
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                              color: 'primary.main',
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track':
                              {
                                backgroundColor: 'primary.main',
                              },
                          }}
                        />
                      </Box>
                    </Stack>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* In-App Notifications Section */}
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{ color: 'text.primary', fontWeight: 500 }}
                    >
                      In-App Notifications
                    </Typography>
                    <Switch
                      defaultChecked
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: 'primary.main',
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track':
                          {
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
                        <Typography
                          variant="body2"
                          sx={{ color: 'text.secondary' }}
                        >
                          Daily Practice Reminders
                        </Typography>
                        <Switch
                          defaultChecked
                          size="small"
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                              color: 'primary.main',
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track':
                              {
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
                        <Typography
                          variant="body2"
                          sx={{ color: 'text.secondary' }}
                        >
                          New Feature Announcements
                        </Typography>
                        <Switch
                          defaultChecked
                          size="small"
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                              color: 'primary.main',
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track':
                              {
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
                        <Typography
                          variant="body2"
                          sx={{ color: 'text.secondary' }}
                        >
                          Progress Milestones
                        </Typography>
                        <Switch
                          defaultChecked
                          size="small"
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                              color: 'primary.main',
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track':
                              {
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
                        <Typography
                          variant="body2"
                          sx={{ color: 'text.secondary' }}
                        >
                          Login streak reminders
                        </Typography>
                        <Switch
                          defaultChecked
                          size="small"
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                              color: 'primary.main',
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track':
                              {
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
                        <Typography
                          variant="body2"
                          sx={{ color: 'text.secondary' }}
                        >
                          Activity streak reminders
                        </Typography>
                        <Switch
                          defaultChecked
                          size="small"
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                              color: 'primary.main',
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track':
                              {
                                backgroundColor: 'primary.main',
                              },
                          }}
                        />
                      </Box>
                    </Stack>
                  </Box>
                </Stack>
              </Paper>
            </Stack>
          </Grid>
        </Grid>
      </SessionProvider>
    </Container>
  )
}
