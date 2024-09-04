'use client'
import PostureData from '@app/interfaces/postureData'
import { Button, IconButton, Typography } from '@mui/material'
import { useEffect, useState } from 'react'

export default function ViewAsanaPractice() {
  /* call api/poses/?english_name=${pose_name} */
  const [viewPose, setViewPose] = useState<PostureData>()
  useEffect(() => {
    const getViewPose = async () => {
      const response = await fetch('/api/poses/?english_name=Archer')
      console.log('viewPose', response)
      const responseData = await response.json()
      setViewPose(responseData)
      // return await response.json()
    }
    getViewPose()
  }, [])
  return (
    <div>
      <Typography variant="h1">VIEW: Asana Pose Practice</Typography>
      <Typography variant="subtitle1">{viewPose?.english_name}</Typography>
      <Typography variant="body1">Next: {viewPose?.next_poses}</Typography>
      <Typography variant="body1">Series Name</Typography>
      <Typography variant="body1">TIMER... time remaining</Typography>
      <Typography variant="body1">TIMER... total time</Typography>
      <Button>NEXT</Button>
      <IconButton>|| PAUSE</IconButton>
    </div>
  )
}
