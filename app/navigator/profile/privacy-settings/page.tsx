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
  Box,
  IconButton,
  Chip,
} from '@mui/material'
import Grid from '@mui/material/Grid2'
import { SessionProvider } from 'next-auth/react'
import ProfileNavMenu from '@app/navigator/profile/ProfileNavMenu'
import { auth } from '../../../../auth'
import theme from '@styles/theme'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Link from 'next/link'
import DownloadDataButton from '@clientComponents/DownloadDataButton'
import DeleteAccountButton from '@clientComponents/DeleteAccountButton'

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
              {/* Header with Back Button */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton
                  component={Link}
                  href="/navigator/profile/settings"
                  sx={{
                    color: 'primary.main',
                    '&:hover': {
                      bgcolor: 'primary.light',
                    },
                  }}
                  aria-label="Back to Account Settings"
                >
                  <ArrowBackIcon />
                </IconButton>
                <Typography
                  variant="h1"
                  component="h1"
                  sx={{
                    color: theme.palette.success.main,
                  }}
                >
                  Privacy
                </Typography>
              </Box>

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
                  Your profile is currently set to Private.
                </Typography>
                <FormControl component="fieldset">
                  <RadioGroup
                    aria-label="profile-visibility"
                    defaultValue="private"
                    name="profile-visibility"
                  >
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
                    <FormControlLabel
                      value="public"
                      disabled
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
                      label={
                        <Box
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <span>Public</span>
                          <Chip
                            label="In Development"
                            size="small"
                            color="warning"
                            sx={{ fontSize: '0.65rem', height: '20px' }}
                          />
                        </Box>
                      }
                    />
                    <FormControlLabel
                      value="friends-only"
                      disabled
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
                      label={
                        <Box
                          sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
                        >
                          <span>Friends Only</span>
                          <Chip
                            label="In Development"
                            size="small"
                            color="warning"
                            sx={{ fontSize: '0.65rem', height: '20px' }}
                          />
                        </Box>
                      }
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
                <Box
                  sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}
                >
                  <Typography
                    variant="h6"
                    sx={{ color: 'text.primary', fontWeight: 600 }}
                  >
                    Activity Visibility
                  </Typography>
                  <Chip
                    label="In Development"
                    size="small"
                    color="warning"
                    sx={{ fontSize: '0.65rem', height: '20px' }}
                  />
                </Box>
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
                      disabled
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
                      disabled
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
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" sx={{ color: 'text.primary' }}>
                      Allow third-party access
                    </Typography>
                    <Chip
                      label="In Development"
                      size="small"
                      color="warning"
                      sx={{ fontSize: '0.65rem', height: '20px' }}
                    />
                  </Box>
                  <Switch
                    defaultChecked
                    disabled
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

              {/* Download my data - GDPR Compliant */}
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
                  Download My Data
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary', mb: 1 }}
                >
                  Get a complete copy of your personal information in JSON
                  format.
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: 'text.secondary', mb: 2, display: 'block' }}
                >
                  Includes: profile information, activity history, created
                  content, preferences, and notification history. Complies with
                  GDPR Article 15 (Right of Access) and Article 20 (Right to
                  Data Portability).
                </Typography>
                <DownloadDataButton />
              </Paper>

              {/* Delete My Account */}
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  border: '2px solid',
                  borderColor: 'error.main',
                  backgroundColor: 'error.light',
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
                  sx={{ color: 'text.secondary', mb: 1 }}
                >
                  Permanently delete your account and all associated data from
                  our system.
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'error.main',
                    fontWeight: 600,
                    mb: 1,
                  }}
                >
                  ⚠️ WARNING: This action cannot be reversed!
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    mb: 2,
                    display: 'block',
                  }}
                >
                  GDPR Right to Erasure (Article 17) - All your data will be
                  permanently removed.
                </Typography>
                <DeleteAccountButton />
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
