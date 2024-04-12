'use client'
import React from 'react'
import Typography from '@mui/material/Typography'
import PostureSearch from '@app/components/posture-search'
import postureData from '@interfaces/postureData'

async function getData() {
  const res = await fetch('/api/poses')
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  const response = await res.json()
  return response
}

export default function Page() {
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
      <Typography variant="h1" align="center">
        Asana Postures
      </Typography>
      <PostureSearch posturePropData={posturePropData} />
    </>
  )
}
