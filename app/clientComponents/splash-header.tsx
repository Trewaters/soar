import { Box, Stack, Typography } from '@mui/material'
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
    <Stack>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
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
          }}
        ></Image>
      </Box>
      <Stack
        direction={'row'}
        gap={1}
        alignItems={'center'}
        justifyContent={'center'}
      >
        <Image
          src={'/icons/designImages/leaf-orange.png'}
          height={'24'}
          width={'24'}
          alt={props.alt}
        ></Image>
        <Typography
          variant="splashTitle"
          textTransform={'uppercase'}
          sx={{
            color: 'primary.main',
            backgroundColor: 'navSplash.light',
            px: 2,
            py: 1,
            borderRadius: '8px',
            overflow: 'hidden',
          }}
        >
          {title}
        </Typography>
      </Stack>
    </Stack>
  )
}
