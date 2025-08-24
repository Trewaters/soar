import { Box, Stack, Typography } from '@mui/material'
import StarIcon from '@mui/icons-material/Star'
import { ComponentProps } from 'react'

interface SplashNavButtonProps extends ComponentProps<typeof Box> {
  title: string
  description: string
  image?: string
  premium?: boolean
}

/**
 * A navigation button component for splash screen interfaces.
 *
 * Renders a styled clickable box with a title and description text.
 * The button has a fixed size width x height (363x210px) with rounded corners, borders,
 * and hover effects including shadow highlights. Optionally displays a background image
 * with the description text overlaid on top. Premium features show a star icon.
 *
 * @param title - The main title text displayed at the bottom of the button
 * @param description - The descriptive text displayed at the top of the button, overlaying the image
 * @param image - Optional URL for background image that displays behind the description text
 * @param premium - Whether this is a premium feature that should display a star icon
 * @param props - Additional props including sx styling overrides and onClick handler
 * @returns A Material-UI Box component styled as a navigation button
 */
export default function SplashNavButton({
  title,
  description,
  image,
  premium = false,
  ...props
}: SplashNavButtonProps) {
  return (
    <Stack
      sx={{
        borderRadius: '12px',
        border: '1px solid',
        borderColor: 'grey.300',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        position: 'relative',
        ':hover': {
          cursor: 'pointer',
          transform: 'translateY(-2px)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
        },
        transition: 'all 0.2s ease-in-out',
      }}
      onClick={props.onClick}
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
          alignItems: 'flex-start',
          overflow: 'hidden',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          backgroundImage: image ? `url(${image})` : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          position: 'relative',
          // Apply grayscale filter if it's a black and white image
          filter: image && premium ? 'grayscale(100%)' : 'none',
        }}
      >
        {/* Star icon for premium features */}
        {premium && (
          <Box
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              backgroundColor: '#FF6B35',
              borderRadius: '50%',
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
            }}
          >
            <StarIcon
              sx={{
                color: 'white',
                fontSize: 20,
              }}
            />
          </Box>
        )}

        <Typography
          variant="body1"
          component={'h2'}
          sx={{
            color: '#2C5A8A',
            alignSelf: 'flex-start',
            mt: 2,
            mx: 2,
            fontWeight: 'bold',
            fontSize: '16px',
            lineHeight: 1.3,
            maxWidth: '70%',
          }}
        >
          {description}
        </Typography>
      </Box>
      <Typography
        variant="h4"
        sx={{
          whiteSpace: 'normal',
          backgroundColor: 'navSplash.dark',
          color: 'primary.main',
          justifyContent: 'center',
          width: '100%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          textAlign: 'center',
          py: 1.5,
          borderBottomLeftRadius: '12px',
          borderBottomRightRadius: '12px',
          fontWeight: 'bold',
          fontSize: '28px',
        }}
      >
        {title}
      </Typography>
    </Stack>
  )
}
