'use client'
import { useEffect, useState } from 'react'
import PostureSearch from '@app/navigator/asanaPostures/posture-search'
import PostureData from '@interfaces/postureData'
import NavBottom from '@serverComponents/navBottom'
import { Card, CardMedia, CardContent, Box } from '@mui/material'

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
    <Box display={'flex'} flexDirection={'column'}>
      <Card
        sx={{
          width: ['90vw', '100%'],
          alignSelf: 'center',
          mb: '16px',
        }}
      >
        <CardMedia
          component="img"
          height={'auto'}
          // width={'auto'}
          image="/icons/designImages/beautiful-woman-practices-yoga-asana-raja-bhujanga.png"
          alt="Asana Posture Search"
          // sx={{
          //   objectFit: 'cover',
          //   backgroundSize: '50%',
          //   backgroundPosition: 'center',
          // }}
        />
        {loading && <p>Loading Yoga Postures...</p>}
        {error && <p>Error: {error}</p>}
        <CardContent>
          <PostureSearch posturePropData={posturePropData} />
        </CardContent>
      </Card>
      <NavBottom />

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
