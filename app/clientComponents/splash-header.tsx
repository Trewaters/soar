import { Box, Paper, Typography } from '@mui/material'
import Image from 'next/image'
import { ComponentProps } from 'react'

interface SplashHeaderProps extends ComponentProps<typeof Image> {
  title: string
}

export default function SplashHeader({ title, ...props }: SplashHeaderProps) {
  return (
    <Box
      sx={{
        display: 'contents',
        pt: '16px',
        // mr: '200px',
      }}
    >
      <Image
        src={props.src}
        alt={props.alt}
        height={'355'}
        width={'430'}
        style={{
          display: 'flex',
          alignSelf: 'center',
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
          backgroundColor: 'rgba(128, 128, 128, 0.5)', // Gray with 80% opacity
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
