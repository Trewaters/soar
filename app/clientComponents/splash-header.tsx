import { Box, Typography } from '@mui/material'
import Image from 'next/image'
import React from 'react'

interface SplashHeaderProps extends React.ComponentProps<typeof Image> {
  title: string
}

/**
 * SplashHeader component renders a header with an image and a title.
 *
 * @component
 * @param {SplashHeaderProps} props - The properties for the SplashHeader component.
 * @param {string} props.title - The title text to be displayed.
 * @param {string} props.src - The source URL of the image.
 * @param {string} props.alt - The alt text for the image.
 *
 * @returns {JSX.Element} The rendered SplashHeader component.
 */
export default function SplashHeader({ title, ...props }: SplashHeaderProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.25)',
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
        }}
      ></Image>
      <Typography
        variant="splashTitle"
        textAlign={'center'}
        sx={{
          position: 'absolute',
          top: '30%', // Center vertically
          color: 'primary.main',
          backgroundColor: 'navSplash.light',
          width: 'fit-content',
          padding: '8px',
          borderRadius: '8px',
          overflow: 'hidden',
        }}
      >
        {title}
      </Typography>
    </Box>
  )
}
