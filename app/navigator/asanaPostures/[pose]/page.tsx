'use client'
import React, { useEffect, useState } from 'react'
import { FullAsanaData } from '@app/context/AsanaPostureContext'
import PostureActivityDetail from './postureActivityDetail'
import { Box } from '@mui/material'
import NavBottom from '@serverComponents/navBottom'
import { QuickTimer } from '@app/clientComponents/quickTimer'

export default function Page({ params }: { params: { pose: string } }) {
  const [viewPose, setViewPose] = useState<FullAsanaData>({} as FullAsanaData)

  const handleTimerStart = () => {
    console.log('Timer started!')
  }

  const handleTimerEnd = () => {
    console.log('Timer completed!')
  }

  const handleTimerUpdate = (_remainingSeconds: number) => {
    // You can use this to update other parts of your UI
    // console.log('Timer update:', remainingSeconds)
  }

  useEffect(() => {
    const getViewPose = async () => {
      const response = await fetch(
        `/api/poses/?sort_english_name=${params.pose}`,
        { cache: 'no-store' }
      )
      const responseData = await response.json()
      setViewPose(responseData)
      // return await response.json()
    }
    getViewPose()
  }, [params.pose])
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
      <NavBottom subRoute="/navigator/asanaPostures" />
    </>
  )
}
