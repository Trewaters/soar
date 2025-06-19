'use client'

import { useEffect, useState } from 'react'
import PostureSearch from '@app/navigator/asanaPostures/posture-search'
import { Box, CircularProgress, Typography } from '@mui/material'
import { getAllPostures, type FullAsanaData } from '@lib/postureService'
import SplashHeader from '@app/clientComponents/splash-header'
import { useRouter } from 'next/navigation'
import NavBottom from '@serverComponents/navBottom'
import SplashNavButton from '@app/clientComponents/splash-nav-button'

export default function Page() {
  const [posturePropData, setPosturePropData] = useState<FullAsanaData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const router = useRouter()

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await getAllPostures()
      setPosturePropData(
        data.sort((a: FullAsanaData, b: FullAsanaData) => {
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

  const handleCreateAsanaClick = () => {
    router.push('/navigator/asanaPostures/createAsana')
  }

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: '100vh', // Ensure full viewport height
          paddingBottom: { xs: '80px', sm: '80px' }, // Extra padding for mobile to ensure content is above nav
        }}
      >
        <SplashHeader
          src={'/images/asana-postures-splash-header.png'}
          alt={'Asanas'}
          title="Asanas"
        />
        <Box height={'32px'} />

        {loading ? (
          <CircularProgress sx={{ backgroundColor: 'transparent' }} />
        ) : (
          <PostureSearch posturePropData={posturePropData} />
        )}
        {error && <Typography color="error">Error: {error}</Typography>}
        <SplashNavButton
          title="Create Asana Posture"
          description="Customize your practice by creating new Asana postures."
          sx={{
            backgroundImage:
              "url('/images/asana/create-asana-splash-header.svg')",
          }}
          onClick={handleCreateAsanaClick}
        />
      </Box>
      <NavBottom subRoute="/navigator/asanaPostures" />
    </>
  )
}
