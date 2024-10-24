'use client'
import { useEffect, useState } from 'react'
import PostureSearch from '@app/navigator/asanaPostures/posture-search'
import { Box, CircularProgress, Typography } from '@mui/material'
import { PostureData } from '@context/AsanaPostureContext'
import SplashHeader from '@app/clientComponents/splash-header'

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
    <Box display={'flex'} flexDirection={'column'} sx={{ mt: 4 }}>
      <SplashHeader
        src={
          '/icons/designImages/beautiful-woman-practices-yoga-asana-raja-bhujanga.png'
        }
        alt={'Asana Posture Search'}
        title="Asanas"
      />
      <Box
        sx={{
          alignSelf: 'center',
          width: 'auto',
          position: 'relative',
          bottom: '141px',
        }}
      >
        <PostureSearch posturePropData={posturePropData} />
        {loading && (
          <CircularProgress sx={{ backgroundColor: 'transparent' }} />
        )}
        {error && <Typography>Error: {error}</Typography>}
      </Box>
    </Box>
  )
}
