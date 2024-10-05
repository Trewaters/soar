'use client'
import { useEffect, useState } from 'react'
import PostureSearch from '@app/navigator/asanaPostures/posture-search'
import NavBottom from '@serverComponents/navBottom'
import { Card, CardContent, Box, CircularProgress } from '@mui/material'
import Image from 'next/image'
import { PostureData, useAsanaPosture } from '@context/AsanaPostureContext'
import PostureCard from './posture-card'
import SplashHeader from '@app/clientComponents/splash-header'

export default function Page() {
  const { state } = useAsanaPosture()
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
    <Box display={'flex'} flexDirection={'column'}>
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
        {error && <p>Error: {error}</p>}
      </Box>
      {/* <Box sx={{ height: '100px', mt: '16px' }}>
        {state.postures.id !== 0 && (
          <PostureCard postureCardProp={state.postures} />
        )}
      </Box> */}

      {/* <Box sx={{ height: '100px', mt: '16px' }}>
        <Box textAlign={'center'}>
          <Image
            alt="Asana Posture Search"
            height={355 * 1.5}
            width={430 * 1.5}
            src={
              '/icons/designImages/beautiful-woman-practices-yoga-asana-raja-bhujanga.png'
            }
          ></Image>
          <Box
            sx={{
              position: 'relative',
              // top: '50%',
              // top: '600px',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1,
            }}
          >
            <PostureSearch posturePropData={posturePropData} />
          </Box>
        </Box>
      </Box> */}
    </Box>
  )
}
