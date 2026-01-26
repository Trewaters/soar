'use client'
import { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Stack,
  Chip,
} from '@mui/material'
import Image from 'next/image'

interface ImageTest {
  id: string
  url: string
  fileName: string
  directLoadWorks: boolean
  nextImageWorks: boolean
  httpStatus?: number
  error?: string
  dimensions?: { width: number; height: number }
}

export default function ImageDiagnosticPage() {
  const [loading, setLoading] = useState(false)
  const [serverDiagnostics, setServerDiagnostics] = useState<any>(null)
  const [imageTests, setImageTests] = useState<ImageTest[]>([])
  const [error, setError] = useState<string | null>(null)

  const runServerDiagnostics = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/images/test-access')
      const data = await response.json()
      setServerDiagnostics(data)

      // Get sample images to test client-side
      if (data.tests?.database?.sampleUrls?.length > 0) {
        const tests = data.tests.database.sampleUrls.map((img: any) => ({
          id: img.id,
          url: img.url,
          fileName: img.fileName,
          directLoadWorks: false,
          nextImageWorks: false,
        }))
        setImageTests(tests)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to run diagnostics')
    } finally {
      setLoading(false)
    }
  }

  const testDirectImageLoad = async (index: number) => {
    const test = imageTests[index]
    try {
      const response = await fetch(test.url, { method: 'HEAD' })
      const updated = [...imageTests]
      updated[index] = {
        ...test,
        directLoadWorks: response.ok,
        httpStatus: response.status,
      }
      setImageTests(updated)
    } catch (err) {
      const updated = [...imageTests]
      updated[index] = {
        ...test,
        directLoadWorks: false,
        error: err instanceof Error ? err.message : 'Unknown error',
      }
      setImageTests(updated)
    }
  }

  const testAllImages = async () => {
    for (let i = 0; i < imageTests.length; i++) {
      await testDirectImageLoad(i)
    }
  }

  useEffect(() => {
    runServerDiagnostics()
  }, [])

  return (
    <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h3" gutterBottom>
        🔍 Image Diagnostic Tool
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        This page tests image loading from both server and client side to
        identify production issues.
      </Typography>

      <Stack spacing={3}>
        {/* Server-Side Diagnostics */}
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Server-Side Tests
            </Typography>
            <Button
              variant="contained"
              onClick={runServerDiagnostics}
              disabled={loading}
              sx={{ mb: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Run Server Tests'}
            </Button>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {serverDiagnostics && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Summary
                </Typography>
                <Alert
                  severity={
                    serverDiagnostics.summary?.allTestsPassed
                      ? 'success'
                      : 'error'
                  }
                  sx={{ mb: 2 }}
                >
                  <Typography variant="subtitle2">
                    {serverDiagnostics.summary?.allTestsPassed
                      ? '✅ All tests passed!'
                      : `❌ ${serverDiagnostics.summary?.issuesFound} issues found`}
                  </Typography>
                  <Box component="ul" sx={{ mt: 1, pl: 2 }}>
                    {serverDiagnostics.summary?.issues?.map(
                      (issue: string, i: number) => <li key={i}>{issue}</li>
                    )}
                  </Box>
                </Alert>

                {serverDiagnostics.tests?.imageAccessibility && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Image Accessibility Results
                    </Typography>
                    <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                      <Chip
                        label={`✅ Accessible: ${serverDiagnostics.tests.imageAccessibility.accessible}`}
                        color="success"
                        variant="outlined"
                      />
                      <Chip
                        label={`❌ Failed: ${serverDiagnostics.tests.imageAccessibility.failed}`}
                        color="error"
                        variant="outlined"
                      />
                    </Stack>

                    {serverDiagnostics.tests.imageAccessibility.results?.map(
                      (result: any, i: number) => (
                        <Card
                          key={i}
                          variant="outlined"
                          sx={{ mb: 2, bgcolor: 'grey.50' }}
                        >
                          <CardContent>
                            <Typography variant="subtitle2" gutterBottom>
                              {result.fileName}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                wordBreak: 'break-all',
                                fontSize: '0.75rem',
                                mb: 1,
                              }}
                            >
                              {result.url}
                            </Typography>
                            <Stack direction="row" spacing={1} flexWrap="wrap">
                              <Chip
                                label={
                                  result.accessible
                                    ? '✅ Accessible'
                                    : '❌ Not Accessible'
                                }
                                size="small"
                                color={result.accessible ? 'success' : 'error'}
                              />
                              {result.httpStatus && (
                                <Chip
                                  label={`HTTP ${result.httpStatus}`}
                                  size="small"
                                  color={
                                    result.httpStatus === 200
                                      ? 'success'
                                      : 'error'
                                  }
                                />
                              )}
                              {result.error && (
                                <Chip
                                  label={result.error}
                                  size="small"
                                  color="error"
                                />
                              )}
                            </Stack>
                            {result.headers && (
                              <Typography
                                variant="caption"
                                component="pre"
                                sx={{
                                  mt: 1,
                                  p: 1,
                                  bgcolor: 'grey.100',
                                  borderRadius: 1,
                                  fontSize: '0.7rem',
                                  overflow: 'auto',
                                }}
                              >
                                {JSON.stringify(result.headers, null, 2)}
                              </Typography>
                            )}
                          </CardContent>
                        </Card>
                      )
                    )}
                  </Box>
                )}

                {/* Full Diagnostics Details */}
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Full Diagnostic Details:
                  </Typography>
                  <Typography
                    component="pre"
                    sx={{
                      p: 2,
                      bgcolor: 'grey.100',
                      borderRadius: 1,
                      fontSize: '0.75rem',
                      overflow: 'auto',
                      maxHeight: 400,
                    }}
                  >
                    {JSON.stringify(serverDiagnostics, null, 2)}
                  </Typography>
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Client-Side Image Tests */}
        {imageTests.length > 0 && (
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Client-Side Image Tests
              </Typography>
              <Button
                variant="contained"
                onClick={testAllImages}
                sx={{ mb: 2 }}
              >
                Test Direct Image Loading
              </Button>

              <Stack spacing={2}>
                {imageTests.map((test, index) => (
                  <Card key={test.id} variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle2" gutterBottom>
                        {test.fileName}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ wordBreak: 'break-all', display: 'block', mb: 2 }}
                      >
                        {test.url}
                      </Typography>

                      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                        {test.directLoadWorks !== undefined && (
                          <Chip
                            label={
                              test.directLoadWorks
                                ? '✅ Direct Load OK'
                                : '❌ Direct Load Failed'
                            }
                            size="small"
                            color={test.directLoadWorks ? 'success' : 'error'}
                          />
                        )}
                        {test.httpStatus && (
                          <Chip
                            label={`HTTP ${test.httpStatus}`}
                            size="small"
                          />
                        )}
                      </Stack>

                      {/* Test with Next.js Image component */}
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="caption" gutterBottom>
                          Next.js Image Component Test:
                        </Typography>
                        <Box
                          sx={{
                            position: 'relative',
                            width: 200,
                            height: 200,
                            bgcolor: 'grey.100',
                            border: '1px solid',
                            borderColor: 'grey.300',
                            borderRadius: 1,
                          }}
                        >
                          <Image
                            src={test.url}
                            alt={test.fileName}
                            fill
                            style={{ objectFit: 'contain' }}
                            onLoad={() => {
                              const updated = [...imageTests]
                              updated[index].nextImageWorks = true
                              setImageTests(updated)
                            }}
                            onError={(e) => {
                              const updated = [...imageTests]
                              updated[index].nextImageWorks = false
                              updated[index].error =
                                'Next.js Image failed to load'
                              setImageTests(updated)
                            }}
                          />
                        </Box>
                        {test.nextImageWorks !== undefined && (
                          <Chip
                            label={
                              test.nextImageWorks
                                ? '✅ Next.js Image Works'
                                : '❌ Next.js Image Failed'
                            }
                            size="small"
                            color={test.nextImageWorks ? 'success' : 'error'}
                            sx={{ mt: 1 }}
                          />
                        )}
                      </Box>

                      {/* Test with regular img tag */}
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="caption" gutterBottom>
                          Regular &lt;img&gt; Tag Test:
                        </Typography>
                        <Box
                          sx={{
                            width: 200,
                            height: 200,
                            bgcolor: 'grey.100',
                            border: '1px solid',
                            borderColor: 'grey.300',
                            borderRadius: 1,
                            overflow: 'hidden',
                          }}
                        >
                          <img
                            src={test.url}
                            alt={test.fileName}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'contain',
                            }}
                            onLoad={(e) => {
                              console.log('Regular img loaded:', test.url)
                            }}
                            onError={(e) => {
                              console.error('Regular img failed:', test.url)
                            }}
                          />
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </CardContent>
          </Card>
        )}
      </Stack>
    </Box>
  )
}
