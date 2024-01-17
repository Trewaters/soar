import React from 'react'
import Typography from '@mui/material/Typography'
import PostureSearch from '@components/posture-search'
import postureData from '@/app/interfaces/postureData'
import { AppHeader } from '@/app/app-header'

async function getData() {
  const res = await fetch('/api/poses')
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  const response = await res.json()
  return response
}

export default function AsanaPostures() {
  const [posturePropData, setPosturePropData] = React.useState<postureData[]>(
    []
  )
  React.useEffect(() => {
    getData().then((data) => {
      setPosturePropData(data)
    })
  }, [])

  return (
    <>
      <AppHeader />
      <div>Asana Postures</div>
      <Typography variant="h2">Posture Search</Typography>
      <PostureSearch posturePropData={posturePropData} />
    </>
  )
}
