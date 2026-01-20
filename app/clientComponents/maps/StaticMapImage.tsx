'use client'
import React from 'react'
import { Box } from '@mui/material'
import Image from 'next/image'

interface StaticMapImageProps {
  location: string
  width?: number
  height?: number
  zoom?: number
}

/**
 * Displays a static Google Maps image showing a location pin
 * Uses Google Maps Static API - no JavaScript, just an image
 */
export default function StaticMapImage({
  location,
  width = 600,
  height = 300,
  zoom = 13,
}: StaticMapImageProps) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    return null
  }

  // Encode the location for URL
  const encodedLocation = encodeURIComponent(location)

  // Build Google Maps Static API URL
  const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${encodedLocation}&zoom=${zoom}&size=${width}x${height}&markers=color:red%7C${encodedLocation}&key=${apiKey}`

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: height,
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Image
        src={mapUrl}
        alt={`Map showing ${location}`}
        fill
        style={{ objectFit: 'cover' }}
        unoptimized // Required for external API images
      />
    </Box>
  )
}
