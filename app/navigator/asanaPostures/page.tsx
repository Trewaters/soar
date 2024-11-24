'use client'
import { useEffect, useState } from 'react'
import PostureSearch from '@app/navigator/asanaPostures/posture-search'
import { Box, Button, CircularProgress, Typography } from '@mui/material'
import { FullAsanaData } from '@context/AsanaPostureContext'
import SplashHeader from '@app/clientComponents/splash-header'
import { useRouter } from 'next/navigation'

export default function Page() {
  const [posturePropData, setPosturePropData] = useState<FullAsanaData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const router = useRouter()

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('../api/poses', { cache: 'no-store' })
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      // setPosturePropData(await response.json())
      setPosturePropData(
        (await response.json()).sort((a: FullAsanaData, b: FullAsanaData) => {
          if (a.sort_english_name < b.sort_english_name) return -1
          if (a.sort_english_name > b.sort_english_name) return 1
          return 0
        })
      )
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
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <SplashHeader
        src={
          '/icons/designImages/beautiful-woman-practices-yoga-asana-raja-bhujanga.png'
        }
        alt={'Asanas'}
        title="Asanas"
      />
      <Box height={'32px'} />
      <PostureSearch posturePropData={posturePropData} />
      {loading && <CircularProgress sx={{ backgroundColor: 'transparent' }} />}
      {error && <Typography>Error: {error}</Typography>}
      <Button
        variant="contained"
        color="primary"
        sx={{ width: '30%', mb: 3 }}
        onClick={() => router.push('/navigator/asanaPostures/createAsana')}
      >
        Add Asana
      </Button>
    </Box>
  )
}
