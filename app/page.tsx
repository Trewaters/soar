import React from 'react'
import LandingPage from './component/LandingPage'
import MenuPlanner from './component/MenuPlanner'
import PostureSearch from '@components/PosturesSearch'
import postureData from './interfaces/postureData'
import TopNav from '@/pages/components/top-nav'
import { Stack, Typography } from '@mui/material'

async function getData() {
  const res = await fetch('https://www.pocketyoga.com/poses.json')
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  const postureProps = await res.json()

  // Recommendation: handle errors
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error('Failed to fetch data')
  }

  // return res.json()
  return postureProps
}

export default async function Home() {
  const posturePropData: postureData[] = await getData()

  return (
    <>
      <Stack direction="row" justifyContent="space-between">
        <TopNav />
        <Stack>
          <Typography variant="h3">Soar</Typography>
        </Stack>
      </Stack>
      <p>The 8 Limbs of Yoga </p>
      <h2>Landing Page</h2>
      <LandingPage />
      <h2>Menu Planner</h2>
      <MenuPlanner />
      <h2>Posture Search</h2>
      <PostureSearch posturePropData={posturePropData} />
    </>
  )
}
