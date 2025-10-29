'use client'

import { useState, useEffect } from 'react'
import { Box, Stack, Typography, Card, CardMedia } from '@mui/material'
import Image from 'next/image'
import { FlowSeriesData } from '@context/AsanaSeriesContext'
import SeriesActivityTracker from '@app/clientComponents/seriesActivityTracker/SeriesActivityTracker'
import SeriesWeeklyActivityTracker from '@app/clientComponents/seriesActivityTracker/SeriesWeeklyActivityTracker'
import PoseShareButton from '@app/clientComponents/poseShareButton'
import { getPoseIdByName } from '@lib/poseService'
import { splitSeriesPoseEntry } from '@app/utils/asana/seriesPoseLabels'
import SeriesPoseList from '@app/clientComponents/SeriesPoseList'

interface SeriesDetailViewProps {
  series: FlowSeriesData
}

export default function SeriesDetailView({ series }: SeriesDetailViewProps) {
  const [flow, setFlow] = useState<FlowSeriesData>(series)
  const [images, setImages] = useState<string[]>([])
  const [poseIds, setPoseIds] = useState<{
    [poseName: string]: string | null
  }>({})

  // Update flow when series prop changes
  useEffect(() => {
    setFlow(series)
  }, [series])

  // Resolve asana IDs for navigation
  useEffect(() => {
    let mounted = true
    async function resolvePoseIds() {
      if (!flow?.seriesPoses?.length) {
        if (mounted) setPoseIds({})
        return
      }

      // Extract all pose names first
      const poseNames: string[] = []
      for (const pose of flow.seriesPoses) {
        let poseName = ''
        if (typeof pose === 'string') {
          const { name } = splitSeriesPoseEntry(pose)
          poseName = name
        } else if (pose && typeof pose === 'object') {
          poseName = (pose as any).sort_english_name || ''
        }
        if (poseName) poseNames.push(poseName)
      }

      // Fetch all pose IDs in parallel for faster resolution
      const idPromises = poseNames.map(async (poseName) => {
        try {
          const id = await getPoseIdByName(poseName)
          return { poseName, id }
        } catch (error) {
          console.warn(`Failed to resolve ID for pose: ${poseName}`, error)
          return { poseName, id: null }
        }
      })

      // Update state incrementally as each ID resolves
      idPromises.forEach((promise) => {
        promise.then(({ poseName, id }) => {
          if (mounted) {
            setPoseIds((prev) => ({ ...prev, [poseName]: id }))
          }
        })
      })

      // Also wait for all to complete to ensure we have the full set
      try {
        const results = await Promise.all(idPromises)
        if (mounted) {
          const idsMap = results.reduce(
            (acc, { poseName, id }) => {
              acc[poseName] = id
              return acc
            },
            {} as { [poseName: string]: string | null }
          )
          setPoseIds(idsMap)
        }
      } catch (error) {
        console.error('Error resolving pose IDs:', error)
      }
    }

    resolvePoseIds()
    return () => {
      mounted = false
    }
  }, [flow?.seriesPoses])

  // Fetch images array for the selected series
  useEffect(() => {
    let mounted = true
    const abortController = new AbortController()

    async function fetchImages() {
      if (!flow?.id) {
        if (mounted) setImages([])
        return
      }
      try {
        const res = await fetch(`/api/series/${flow.id}/images`, {
          signal: abortController.signal,
        })
        if (!res.ok) {
          // Silently handle 404 - series may not have images or may not exist
          if (mounted) setImages([])
          return
        }
        const data = await res.json()
        if (mounted) setImages(Array.isArray(data.images) ? data.images : [])
      } catch (e: any) {
        // Ignore aborted requests
        if (e.name === 'AbortError') {
          return
        }
        // Silently handle other errors
        if (mounted) setImages([])
      }
    }
    fetchImages()
    return () => {
      mounted = false
      abortController.abort()
    }
  }, [flow?.id])

  const imageUrl = images && images.length > 0 ? images[0] : flow?.image || ''

  const handleActivityToggle = () => {
    // Activity tracking handled by backend
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
              width: '100%',
              paddingTop: '56.25%', // 16:9 aspect ratio
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
              priority
            />
          </CardMedia>
        </Card>
      )}

      {/* Series Poses */}
      <Box className="journal" sx={{ width: '100%', mb: 3 }}>
        <SeriesPoseList
          seriesPoses={flow.seriesPoses || []}
          poseIds={poseIds}
          linkColor="primary.contrastText"
          dataTestIdPrefix="series-detail-pose"
        />
      </Box>

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
        <PoseShareButton />
      </Box>
    </Box>
  )
}
