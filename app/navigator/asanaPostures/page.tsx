'use client'
import { useEffect, useState } from 'react'
import Typography from '@mui/material/Typography'
import PostureSearch from '@app/navigator/asanaPostures/posture-search'
import PostureData from '@interfaces/postureData'

export default function Page() {
  const [posturePropData, setPosturePropData] = useState<PostureData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('../api/poses')
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      setPosturePropData(await response.json())
    } catch (error: Error | any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <>
      <Typography variant="h2" align="center">
        Asana Postures
      </Typography>
      {loading && <p>Loading Yoga Postures...</p>}
      {error && <p>Error: {error}</p>}
      <PostureSearch posturePropData={posturePropData} />
    </>
  )
}
