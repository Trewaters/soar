import {
  Container,
  Typography,
  Paper,
  Stack,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Switch,
  Button,
  Box,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import { SessionProvider } from 'next-auth/react'
import ProfileNavMenu from '@app/navigator/profile/ProfileNavMenu'
import { auth } from '../../../../auth'
import theme from '@styles/theme'

export const metadata = {
  title: 'Privacy Settings | Uvuyoga',
  description: 'Manage your privacy settings and data preferences.',
}

export default async function PrivacySettingsPage() {
  const session = await auth()

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <SessionProvider session={session}>
        <Grid container spacing={4}>
          {/* Profile Navigation Menu */}
          <Grid size={{ xs: 12, md: 4 }}>
            <ProfileNavMenu />
          </Grid>

          {/* Privacy Settings Content */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Stack spacing={3}>
              <Typography
                variant="h1"
                component="h1"
                sx={{ color: theme.palette.success.main }}
                gutterBottom
              >
                Privacy
              </Typography>

              {/* Profile Visibility */}
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
                  sx={{ color: 'text.primary', fontWeight: 600, mb: 1 }}
                >
                  Profile Visibility
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary', mb: 2 }}
                >
                  Choose who can see your profile.
                </Typography>
                <FormControl component="fieldset">
                  <RadioGroup
                    aria-label="profile-visibility"
                    defaultValue="public"
                    name="profile-visibility"
                  >
                    <FormControlLabel
                      value="public"
                      control={
                        <Radio
                          sx={{
                            color: 'text.secondary',
                            '&.Mui-checked': {
                              color: 'primary.main',
                            },
                          }}
                        />
                      }
                      label="Public"
                    />
                    <FormControlLabel
                      value="friends-only"
                      control={
                        <Radio
                          sx={{
                            color: 'text.secondary',
                            '&.Mui-checked': {
                              color: 'primary.main',
                            },
                          }}
                        />
                      }
                      label="Friends Only"
                    />
                    <FormControlLabel
                      value="private"
                      control={
                        <Radio
                          sx={{
                            color: 'text.secondary',
                            '&.Mui-checked': {
                              color: 'primary.main',
                            },
                          }}
                        />
                      }
                      label="Private"
                    />
                  </RadioGroup>
                </FormControl>
              </Paper>

              {/* Activity Visibility */}
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
                  sx={{ color: 'text.primary', fontWeight: 600, mb: 1 }}
                >
                  Activity Visibility
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary', mb: 2 }}
                >
                  Control which parts of your activity are visible to others.
                </Typography>
                <Stack spacing={2}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="body2" sx={{ color: 'text.primary' }}>
                      Show my activity feed
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
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="body2" sx={{ color: 'text.primary' }}>
                      Show my created items
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
                </Stack>
              </Paper>

              {/* Data Sharing */}
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
                  sx={{ color: 'text.primary', fontWeight: 600, mb: 1 }}
                >
                  Data Sharing
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary', mb: 2 }}
                >
                  Manage whether your data can be shared with trusted third
                  party partners.
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant="body2" sx={{ color: 'text.primary' }}>
                    Allow third-party access
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
              </Paper>

              {/* Download my data */}
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
                  sx={{ color: 'text.primary', fontWeight: 600, mb: 1 }}
                >
                  Download my data
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary', mb: 2 }}
                >
                  Request a copy of your personal information.
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: 'text.secondary', mb: 2, display: 'block' }}
                >
                  We&apos;ll email you a download link within 24 hours.
                </Typography>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: 'primary.main',
                    color: 'white',
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 3,
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                  }}
                  startIcon={
                    <Box
                      component="span"
                      sx={{
                        fontSize: '1.2rem',
                      }}
                    >
                      ⬇
                    </Box>
                  }
                >
                  Download
                </Button>
              </Paper>

              {/* Delete My Account */}
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
                  sx={{ color: 'text.primary', fontWeight: 600, mb: 1 }}
                >
                  Delete My Account
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary', mb: 2 }}
                >
                  Manage whether your data can be shared with trusted third
                  party partners.
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'error.main',
                    fontWeight: 600,
                    mb: 2,
                  }}
                >
                  This action cannot be reversed.
                </Typography>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: 'error.main',
                    color: 'white',
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 3,
                    '&:hover': {
                      backgroundColor: 'error.dark',
                    },
                  }}
                >
                  I understand
                </Button>
              </Paper>

              {/* Footer Message */}
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  textAlign: 'center',
                  mt: 3,
                  display: 'block',
                }}
              >
                Uvuyoga respects your privacy. You&apos;re always in control of
                your data.
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </SessionProvider>
    </Container>
  )
}
