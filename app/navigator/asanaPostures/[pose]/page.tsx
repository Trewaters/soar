'use client'
import React, { useEffect, useState, use } from 'react'
import { getPostureByName } from '@lib/postureService'
import PostureActivityDetail from './postureActivityDetail'
import { Box } from '@mui/material'
import { QuickTimer } from '@app/clientComponents/quickTimer'
import { FullAsanaData } from '@app/context/AsanaPostureContext'

export default function Page({
  params,
}: {
  params: Promise<{ pose: string }>
}) {
  const { pose } = use(params)
  const [viewPose, setViewPose] = useState<FullAsanaData>({} as FullAsanaData)

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
        // Decode the URL parameter to handle spaces and special characters
        const decodedPose = decodeURIComponent(pose)
        const responseData = await getPostureByName(decodedPose)
        setViewPose(responseData)
      } catch (error) {
        console.error('Error fetching posture:', error)
      }
    }
    getViewPose()
  }, [pose])
  return (
    <>
      <Box
        sx={{
          pb: '60px',
        }}
      >
        <PostureActivityDetail postureCardProp={viewPose} />
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
