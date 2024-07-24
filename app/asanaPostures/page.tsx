'use client'
import React, { useState } from 'react'
import Typography from '@mui/material/Typography'
import PostureSearch from '@postures/posture-search'
import postureData from '@interfaces/postureData'
// import prisma from '@lib/prisma'

// async function main() {
//   const users = await prisma.user.findMany()
//   console.log(users)
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
  const [posturePropData, setPosturePropData] = React.useState<postureData[]>(
    []
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('api/poses')
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

  // React.useEffect(() => {
  //   fetchData()
  // }, [])

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
      {posturePropData && posturePropData.length > 0 ? (
        <pre>
          <PostureSearch posturePropData={posturePropData} />
        </pre>
      ) : (
        <button onClick={fetchData} disabled={loading}>
          Click to Load Postures
        </button>
      )}
    </>
  )
}
