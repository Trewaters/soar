import { Box, Stack, Typography } from '@mui/material'
import { ComponentProps } from 'react'

interface SplashNavButtonProps extends ComponentProps<typeof Box> {
  title: string
  description: string
  image?: string
}

/**
 * A navigation button component for splash screen interfaces.
 *
 * Renders a styled clickable box with a title and description text.
 * The button has a fixed size width x height (363x210px) with rounded corners, borders,
 * and hover effects including shadow highlights. Optionally displays a background image
 * with the description text overlaid on top.
 *
 * @param title - The main title text displayed at the bottom of the button
 * @param description - The descriptive text displayed at the top of the button, overlaying the image
 * @param image - Optional URL for background image that displays behind the description text
 * @param props - Additional props including sx styling overrides and onClick handler
 * @returns A Material-UI Box component styled as a navigation button
 */
export default function SplashNavButton({
  title,
  description,
  image,
  ...props
}: SplashNavButtonProps) {
  return (
    <Stack
      sx={{
        borderRadius: '12px',
        border: '1px solid',
        borderColor: 'primary.main',
      }}
    >
      <Box
        sx={{
          ...props.sx,
          display: 'flex',
          height: '210px',
          width: '363px',
          borderTopLeftRadius: '12px',
          borderTopRightRadius: '12px',
          border: 'none',
          alignItems: 'center',
          overflow: 'hidden',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundImage: image ? `url(${image})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          mb: 4,
        }}
        onClick={props.onClick}
      >
        <Typography
          variant="body1"
          component={'h2'}
          sx={{
            color: 'navSplash.main',
            alignSelf: 'start',
            mt: 2,
            mx: 4,
            fontWeight: 'bold',
            // textShadow: image ? '1px 1px 2px rgba(0, 0, 0, 0.7)' : 'none',
            // backgroundColor: image ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
            // borderRadius: image ? '4px' : '0px',
            // px: image ? 1 : 0,
            // py: image ? 0.5 : 0,
          }}
        >
          {description}
        </Typography>
      </Box>
      <Typography
        variant="h4"
        color={'primary.main'}
        sx={{
          whiteSpace: 'normal',
          backgroundColor: 'navSplash.dark',
          justifyContent: 'center',
          width: '100%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          textAlign: 'center',
          py: 1.5,
          borderBottomLeftRadius: '12px',
          borderBottomRightRadius: '12px',
        }}
      >
        {title}
      </Typography>
    </Stack>
  )
}
