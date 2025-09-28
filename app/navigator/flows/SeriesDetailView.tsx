'use client'

import { useState, useEffect } from 'react'
import { Box, Stack, Typography, Card, CardMedia, Link } from '@mui/material'
import Image from 'next/image'
import { FlowSeriesData } from '@context/AsanaSeriesContext'
import SeriesActivityTracker from '@app/clientComponents/seriesActivityTracker/SeriesActivityTracker'
import SeriesWeeklyActivityTracker from '@app/clientComponents/seriesActivityTracker/SeriesWeeklyActivityTracker'
import PostureShareButton from '@app/clientComponents/postureShareButton'
import { getPostureIdByName } from '@lib/postureService'
import { splitSeriesPostureEntry } from '@app/utils/asana/seriesPostureLabels'

interface SeriesDetailViewProps {
  series: FlowSeriesData
}

export default function SeriesDetailView({ series }: SeriesDetailViewProps) {
  const [flow, setFlow] = useState<FlowSeriesData>(series)
  const [images, setImages] = useState<string[]>([])
  const [postureIds, setPostureIds] = useState<{
    [poseName: string]: string | null
  }>({})

  // Update flow when series prop changes
  useEffect(() => {
    setFlow(series)
  }, [series])

  // Resolve asana IDs for navigation
  useEffect(() => {
    let mounted = true
    async function resolvePostureIds() {
      if (!flow?.seriesPostures?.length) {
        if (mounted) setPostureIds({})
        return
      }

      const idsMap: { [poseName: string]: string | null } = {}

      for (const pose of flow.seriesPostures) {
        const { name: poseName } = splitSeriesPostureEntry(pose)
        try {
          const id = await getPostureIdByName(poseName)
          idsMap[poseName] = id
        } catch (error) {
          console.warn(`Failed to resolve ID for pose: ${poseName}`, error)
          idsMap[poseName] = null
        }
      }

      if (mounted) setPostureIds(idsMap)
    }

    resolvePostureIds()
    return () => {
      mounted = false
    }
  }, [flow?.seriesPostures])

  // Fetch images array for the selected series
  useEffect(() => {
    let mounted = true
    async function fetchImages() {
      if (!flow?.id) {
        if (mounted) setImages([])
        return
      }
      try {
        const res = await fetch(`/api/series/${flow.id}/images`)
        if (!res.ok) {
          if (mounted) setImages([])
          return
        }
        const data = await res.json()
        if (mounted) setImages(Array.isArray(data.images) ? data.images : [])
      } catch (e) {
        console.error('Failed to fetch series images', e)
        if (mounted) setImages([])
      }
    }
    fetchImages()
    return () => {
      mounted = false
    }
  }, [flow?.id])

  const imageUrl = images && images.length > 0 ? images[0] : flow?.image || ''

  const handleActivityToggle = (isTracked: boolean) => {
    console.log('Series activity tracked:', isTracked)
  }

  if (!flow) {
    return <Box sx={{ p: 2, textAlign: 'center' }}>Series not found</Box>
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        maxWidth: '600px',
        mx: 'auto',
        p: 2,
      }}
    >
      {/* Series Title */}
      <Typography
        variant="h4"
        component="h1"
        textAlign="center"
        sx={{
          mb: 2,
          fontWeight: 'bold',
          backgroundColor: 'primary.main',
          color: 'primary.contrastText',
          px: 3,
          py: 1,
          borderRadius: 2,
          width: '100%',
        }}
      >
        {flow.seriesName}
      </Typography>

      {/* Series Image */}
      {imageUrl && (
        <Card
          sx={{
            width: '100%',
            maxWidth: '400px',
            mb: 3,
            boxShadow: 3,
          }}
        >
          <CardMedia
            component="div"
            sx={{
              height: 200,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <Image
              src={imageUrl}
              alt={flow.seriesName}
              fill
              sizes="(max-width: 600px) 100vw, 400px"
              style={{ objectFit: 'cover' }}
            />
          </CardMedia>
        </Card>
      )}

      {/* Series Postures */}
      <Stack spacing={1} sx={{ width: '100%', mb: 3 }}>
        {flow.seriesPostures?.map((pose, index) => {
          const { name: poseName, secondary } = splitSeriesPostureEntry(pose)
          const postureId = postureIds[poseName]

          // Use ID if available, fallback to name (encoded) for backwards compatibility
          const href = postureId
            ? `/navigator/asanaPostures/${postureId}`
            : `/navigator/asanaPostures/${encodeURIComponent(poseName)}`

          return (
            <Box key={`${pose}-${index}`} className="lines">
              <Box
                className="journalLine"
                sx={{ p: 2, borderBottom: '1px solid #eee' }}
              >
                <Typography textAlign="left" variant="body1">
                  <Link underline="hover" color="primary.main" href={href}>
                    {poseName}
                  </Link>
                </Typography>
                {secondary && (
                  <Typography
                    textAlign="left"
                    variant="body2"
                    color="text.secondary"
                  >
                    {secondary}
                  </Typography>
                )}
              </Box>
            </Box>
          )
        })}
      </Stack>

      {/* Description Section */}
      {flow.description && (
        <Box
          className="journal"
          sx={{
            width: '100%',
            p: 3,
            mb: 3,
            backgroundColor: 'navSplash.dark',
            borderRadius: 2,
          }}
        >
          <Stack flexDirection="row" alignItems="center" sx={{ mb: 2 }}>
            <Typography
              variant="h5"
              sx={{ mr: 2, color: 'primary.contrastText' }}
            >
              Description
            </Typography>
            <Image
              src="/icons/flows/leaf-3.svg"
              alt="leaf icon"
              height={21}
              width={21}
            />
          </Stack>
          <Typography
            color="primary.contrastText"
            variant="body1"
            sx={{ whiteSpace: 'pre-line' }}
          >
            {flow.description}
          </Typography>
        </Box>
      )}

      {/* Activity Trackers */}
      {flow.id && (
        <Box sx={{ width: '100%', mb: 3 }}>
          <SeriesActivityTracker
            seriesId={flow.id.toString()}
            seriesName={flow.seriesName}
            onActivityToggle={handleActivityToggle}
          />
        </Box>
      )}

      {flow.id && (
        <Box sx={{ width: '100%', mb: 3 }}>
          <SeriesWeeklyActivityTracker
            seriesId={flow.id.toString()}
            seriesName={flow.seriesName}
          />
        </Box>
      )}

      {/* Share Button */}
      <Box sx={{ mt: 2 }}>
        <PostureShareButton />
      </Box>
    </Box>
  )
}
