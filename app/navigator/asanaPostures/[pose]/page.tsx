'use client'
import React, { useEffect, useState } from 'react'
import { PostureData } from '@app/context/AsanaPostureContext'
import PostureActivityDetail from './postureActivityDetail'

export default function Page({ params }: { params: { pose: string } }) {
  const [viewPose, setViewPose] = useState<PostureData>({} as PostureData)

  useEffect(() => {
    const getViewPose = async () => {
      const response = await fetch(`/api/poses/?english_name=${params.pose}`)
      const responseData = await response.json()
      setViewPose(responseData)
      // return await response.json()
    }
    getViewPose()
  }, [params.pose])
  return (
    <>
      {/* <PostureCard postureCardProp={viewPose} /> */}
      <PostureActivityDetail postureCardProp={viewPose} />
    </>
  )
}
