'use client'
import React, { useEffect, useState } from 'react'
import { FullAsanaData } from '@app/context/AsanaPostureContext'
import PostureActivityDetail from './postureActivityDetail'
import { Box, Stack } from '@mui/material'
import NavBottom from '@serverComponents/navBottom'

export default function Page({ params }: { params: { pose: string } }) {
  const [viewPose, setViewPose] = useState<FullAsanaData>({} as FullAsanaData)

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
        {/* removed the older posture card. Call it layout 1. My original attempt. */}
        {/* <PostureCard postureCardProp={viewPose} /> */}
        <PostureActivityDetail postureCardProp={viewPose} />
      </Box>
      <NavBottom subRoute="/navigator/asanaPostures" />
    </>
  )
}
