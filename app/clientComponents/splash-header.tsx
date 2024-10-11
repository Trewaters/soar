import { Box, Paper, Typography } from '@mui/material'
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
        // boxShadow: '0 2px 2px 2px gray',
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
          boxShadow: '0 2px 2px 2px gray',
        }}
      ></Image>
      <Typography
        variant="splashTitle"
        sx={{
          position: 'relative',
          bottom: '220px',
          display: 'flex',
          alignSelf: 'center',
          color: 'primary.main',
          backgroundColor: 'navSplash.light',
          width: 'fit-content',
          padding: '8px',
          borderRadius: '8px',
        }}
      >
        {title}
      </Typography>
    </Box>
  )
}
