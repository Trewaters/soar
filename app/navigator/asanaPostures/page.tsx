'use client'
import React, { useState } from 'react'
import Typography from '@mui/material/Typography'
import PostureSearch from '@app/navigator/asanaPostures/posture-search'
import PostureData from '@interfaces/postureData'
import { Button } from '@mui/material'
import { useRouter } from 'next/navigation'
import { FEATURES } from '@app/FEATURES'
// import prisma from '@lib/prisma'

// async function main() {
//   const users = await prisma.user.findMany()
// }

// main()
//   .then(async () => {
//     await prisma.$disconnect()
//   })
//   .catch(async (e) => {
//     console.error(e)
//     await prisma.$disconnect()
//     process.exit(1)
//   })

export default function Page() {
  const [posturePropData, setPosturePropData] = React.useState<PostureData[]>(
    []
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const router = useRouter()

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

  React.useEffect(() => {
    fetchData()
  }, [])

  // const sendData = async () => {
  //   setLoading(true)
  //   setError(null)
  //   try {
  //     const response = await fetch('/poses', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ key: 'value' }),
  //     })
  //     if (!response.ok) {
  //       throw new Error('Network response was not ok')
  //     }
  //     const result = await response.json()
  //     setData(result)
  //   } catch (error) {
  //     setError(error.message)
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  function handleClick() {
    // send pose name to api/poses/?english_name=${pose_name}
    // show asana practice view
    router.push('/views/viewAsanaPractice')
  }
  return (
    <>
      <Typography variant="h2" align="center">
        Asana Postures
      </Typography>
      {/* <button onClick={sendData} disabled={loading}>
        Send Data
      </button> */}
      {loading && <p>Loading Yoga Postures...</p>}
      {error && <p>Error: {error}</p>}
      {/* {posturePropData && posturePropData.length > 0 ? (
        <PostureSearch posturePropData={posturePropData} />
      ) : (
        <button onClick={fetchData} disabled={loading}>
          Click to Load Postures
        </button>
      )} */}
      <PostureSearch posturePropData={posturePropData} />
      {FEATURES.SHOW_PRACTICE_VIEW_ASANA && (
        <Button onClick={handleClick}>Practice View</Button>
      )}
    </>
  )
}
