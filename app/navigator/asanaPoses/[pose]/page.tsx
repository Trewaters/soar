'use client'
import React, { useEffect, useState, use } from 'react'
import PoseActivityDetail from './poseActivityDetail'
import { getPose } from '../../../../lib/poseService'
import { Box, CircularProgress, Typography } from '@mui/material'
import { QuickTimer } from '@app/clientComponents/quickTimer'
import { AsanaPose } from 'types/asana'

export default function Page({
  params,
}: {
  params: Promise<{ pose: string }>
}) {
  const { pose } = use(params)
  const [viewPose, setViewPose] = useState<AsanaPose | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const handleTimerStart = () => {
    console.log('Timer started!')
  }

  const handleTimerEnd = () => {
    console.log('Timer completed!')
  }

  const handleTimerUpdate = (remainingSeconds: number) => {
    // You can use this to update other parts of your UI
    console.log('Timer update:', remainingSeconds)
  }

  useEffect(() => {
    const getViewPose = async () => {
      try {
        setLoading(true)
        setError(null)
        // Decode the URL parameter to handle spaces and special characters
        const decodedPose = decodeURIComponent(pose)
        const responseData = await getPose(decodedPose)
        setViewPose(responseData)
      } catch (error) {
        console.error('Error fetching pose:', error)
        setError(error instanceof Error ? error.message : 'Failed to load pose')
      } finally {
        setLoading(false)
      }
    }
    getViewPose()
  }, [pose])
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Typography variant="h6" color="error">
          Error loading pose
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {error}
        </Typography>
      </Box>
    )
  }

  if (!viewPose) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
        }}
      >
        <Typography variant="h6" color="text.secondary">
          No pose data found
        </Typography>
      </Box>
    )
  }

  return (
    <>
      <Box
        sx={{
          pb: '60px',
        }}
      >
        <PoseActivityDetail poseCardProp={viewPose} />
        <Box sx={{ height: '60px' }} />

        {/* Quick Timer Section */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            px: 2, // Add some padding for mobile devices
          }}
        >
          <QuickTimer
            buttonText="+5 Minutes"
            timerMinutes={5}
            variant="default"
            onTimerStart={handleTimerStart}
            onTimerEnd={handleTimerEnd}
            onTimerUpdate={handleTimerUpdate}
            maxWidth="400px"
          />
        </Box>
      </Box>
    </>
  )
}
