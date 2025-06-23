/**
 * Storage Configuration and Demo Component
 * Shows how to easily switch between storage providers
 */

'use client'

import React, { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Chip,
  Stack,
  Switch,
  FormControlLabel,
  Grid,
  Paper,
  Divider,
} from '@mui/material'
import {
  CloudUpload as CloudUploadIcon,
  Settings as SettingsIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
} from '@mui/icons-material'

// Mock types for demo (in real app, import from storage manager)
type StorageProviderName = 'vercel-blob' | 'cloudflare-images'

interface ConfigurationStatus {
  activeProvider: string
  config: {
    primaryProvider: StorageProviderName
    fallbackProvider?: StorageProviderName
    autoSwitchOnFailure: boolean
  }
  providers: Record<
    string,
    {
      configured: boolean
      isReady: boolean
      missingConfig: string[]
      provider: string
    }
  >
}

export default function StorageConfigurationDemo() {
  const [configStatus, setConfigStatus] = useState<ConfigurationStatus | null>(
    null
  )
  const [loading, setLoading] = useState(true)
  const [primaryProvider, setPrimaryProvider] =
    useState<StorageProviderName>('vercel-blob')
  const [fallbackProvider, setFallbackProvider] =
    useState<StorageProviderName>('cloudflare-images')
  const [autoSwitch, setAutoSwitch] = useState(true)

  // Fetch current configuration status
  useEffect(() => {
    fetchConfigStatus()
  }, [])

  const fetchConfigStatus = async () => {
    try {
      setLoading(true)
      // In real app, this would call your storage manager API
      const mockStatus: ConfigurationStatus = {
        activeProvider: 'vercel-blob',
        config: {
          primaryProvider: 'vercel-blob',
          fallbackProvider: 'cloudflare-images',
          autoSwitchOnFailure: true,
        },
        providers: {
          'vercel-blob': {
            configured: !!process.env.NEXT_PUBLIC_BLOB_TOKEN, // Mock check
            isReady: true,
            missingConfig: [],
            provider: 'vercel-blob',
          },
          'cloudflare-images': {
            configured: false,
            isReady: false,
            missingConfig: ['CLOUDFLARE_ACCOUNT_ID', 'CLOUDFLARE_API_TOKEN'],
            provider: 'cloudflare-images',
          },
        },
      }

      setConfigStatus(mockStatus)
      setPrimaryProvider(mockStatus.config.primaryProvider)
      setFallbackProvider(
        mockStatus.config.fallbackProvider || 'cloudflare-images'
      )
      setAutoSwitch(mockStatus.config.autoSwitchOnFailure)
    } catch (error) {
      console.error('Failed to fetch config status:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateConfiguration = async () => {
    try {
      // In real app, this would call your storage manager API
      console.log('Updating configuration:', {
        primaryProvider,
        fallbackProvider,
        autoSwitchOnFailure: autoSwitch,
      })

      // Mock update
      alert('Configuration updated successfully!')
      await fetchConfigStatus()
    } catch (error) {
      console.error('Failed to update configuration:', error)
    }
  }

  const getProviderStatusIcon = (provider: any) => {
    if (provider.isReady) {
      return <CheckCircleIcon color="success" />
    } else if (provider.configured) {
      return <InfoIcon color="info" />
    } else {
      return <ErrorIcon color="error" />
    }
  }

  const getProviderStatusText = (provider: any) => {
    if (provider.isReady) {
      return 'Ready'
    } else if (provider.configured) {
      return 'Configured but not ready'
    } else {
      return 'Not configured'
    }
  }

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading storage configuration...</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
      >
        <SettingsIcon />
        Storage Provider Configuration
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        This demo shows how easy it is to switch between different cloud storage
        providers. Your ImageUploadWithFallback components will automatically
        use the configured provider.
      </Alert>

      <Grid container spacing={3}>
        {/* Current Status */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Current Status
              </Typography>

              {configStatus && (
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Active Provider
                    </Typography>
                    <Chip
                      label={configStatus.activeProvider}
                      color="primary"
                      icon={<CloudUploadIcon />}
                    />
                  </Box>

                  <Divider />

                  <Typography variant="subtitle2" color="text.secondary">
                    Provider Status
                  </Typography>

                  {Object.entries(configStatus.providers).map(
                    ([name, provider]) => (
                      <Box
                        key={name}
                        sx={{ display: 'flex', alignItems: 'center', gap: 2 }}
                      >
                        {getProviderStatusIcon(provider)}
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" fontWeight="medium">
                            {name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {getProviderStatusText(provider)}
                          </Typography>
                          {provider.missingConfig.length > 0 && (
                            <Typography
                              variant="caption"
                              color="error"
                              display="block"
                            >
                              Missing: {provider.missingConfig.join(', ')}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    )
                  )}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Configuration */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Configuration
              </Typography>

              <Stack spacing={3}>
                <FormControl fullWidth>
                  <InputLabel>Primary Provider</InputLabel>
                  <Select
                    value={primaryProvider}
                    onChange={(e) =>
                      setPrimaryProvider(e.target.value as StorageProviderName)
                    }
                    label="Primary Provider"
                  >
                    <MenuItem value="vercel-blob">Vercel Blob</MenuItem>
                    <MenuItem value="cloudflare-images">
                      Cloudflare Images
                    </MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Fallback Provider</InputLabel>
                  <Select
                    value={fallbackProvider}
                    onChange={(e) =>
                      setFallbackProvider(e.target.value as StorageProviderName)
                    }
                    label="Fallback Provider"
                  >
                    <MenuItem value="vercel-blob">Vercel Blob</MenuItem>
                    <MenuItem value="cloudflare-images">
                      Cloudflare Images
                    </MenuItem>
                  </Select>
                </FormControl>

                <FormControlLabel
                  control={
                    <Switch
                      checked={autoSwitch}
                      onChange={(e) => setAutoSwitch(e.target.checked)}
                    />
                  }
                  label="Auto-switch on failure"
                />

                <Button
                  variant="contained"
                  onClick={handleUpdateConfiguration}
                  startIcon={<SettingsIcon />}
                  fullWidth
                >
                  Update Configuration
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Environment Setup Guide */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Environment Setup Guide
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Vercel Blob Setup
                </Typography>
                <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1, mb: 2 }}>
                  <Typography
                    variant="body2"
                    component="pre"
                    sx={{ fontFamily: 'monospace' }}
                  >
                    {`# Add to .env.local
BLOB_READ_WRITE_TOKEN=vercel_blob_token_here`}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Get your token from the{' '}
                  <a
                    href="https://vercel.com/dashboard"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Vercel Dashboard
                  </a>
                </Typography>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Cloudflare Images Setup
                </Typography>
                <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1, mb: 2 }}>
                  <Typography
                    variant="body2"
                    component="pre"
                    sx={{ fontFamily: 'monospace' }}
                  >
                    {`# Add to .env.local
CLOUDFLARE_ACCOUNT_ID=your_account_id
CLOUDFLARE_API_TOKEN=your_api_token`}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  Get your credentials from the{' '}
                  <a
                    href="https://dash.cloudflare.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Cloudflare Dashboard
                  </a>
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Code Examples */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              How to Use in Your Components
            </Typography>

            <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1, mb: 2 }}>
              <Typography
                variant="body2"
                component="pre"
                sx={{ fontFamily: 'monospace' }}
              >
                {`// Your existing ImageUploadWithFallback component
// automatically uses the configured storage provider!

<ImageUploadWithFallback
  title="My Yoga Pose"
  variant="full"
  onImageUploaded={(image) => {
    console.log('Uploaded to:', image.storageType)
    // Will be 'CLOUD' regardless of which provider is used
  }}
/>

// To manually switch providers in code:
import { storageManager } from '@/lib/storage/manager'

// Switch to Vercel Blob
storageManager.switchProvider('vercel-blob')

// Switch to Cloudflare Images  
storageManager.switchProvider('cloudflare-images')

// Check current provider
console.log(storageManager.getActiveProvider().name)`}
              </Typography>
            </Box>

            <Alert severity="success">
              <strong>Zero code changes needed!</strong> Your existing
              ImageUploadWithFallback components will automatically work with
              any configured provider.
            </Alert>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}
