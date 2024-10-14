import { Box, Typography } from '@mui/material'
import Image from 'next/image'
import React from 'react'

interface SplashHeaderProps extends React.ComponentProps<typeof Image> {
  title: string
}

export default function SplashHeader({ title, ...props }: SplashHeaderProps) {
  return (
    <Box
      sx={{
        display: 'contents',
        position: 'relative',
      }}
    >
      <Image
        src={props.src}
        alt={props.alt}
        height={'355'}
        width={'384'}
        style={{
          display: 'flex',
          alignSelf: 'center',
          boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.25)',
        }}
      ></Image>
      <Typography
        variant="splashTitle"
        sx={{
          position: 'absolute',
          // bottom: '220px',
          // left: '50%', // Center horizontally
          // transform: 'translateX(-50%)', // Center horizontally
          display: 'flex',
          alignSelf: 'center',
          color: 'primary.main',
          backgroundColor: 'navSplash.light',
          width: 'fit-content',
          // width: '-webkit-fill-available',
          padding: '8px',
          borderRadius: '8px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'normal',
        }}
      >
        {title}
      </Typography>
    </Box>
  )
}
