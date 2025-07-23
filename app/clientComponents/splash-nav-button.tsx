import { Box, Typography } from '@mui/material'
import { ComponentProps } from 'react'

interface SplashNavButtonProps extends ComponentProps<typeof Box> {
  title: string
  description: string
}

/**
 * A navigation button component for splash screen interfaces.
 *
 * Renders a styled clickable box with a title and description text.
 * The button has a fixed size width x height (363x210px) with rounded corners, borders,
 * and hover effects including shadow highlights.
 *
 * @param title - The main title text displayed at the bottom of the button
 * @param description - The descriptive text displayed at the top of the button
 * @param props - Additional props including sx styling overrides and onClick handler
 * @returns A Material-UI Box component styled as a navigation button
 */
export default function SplashNavButton({
  title,
  description,
  ...props
}: SplashNavButtonProps) {
  return (
    <Box
      sx={{
        ...props.sx,
        display: 'flex',
        height: '210px',
        width: '363px',
        borderRadius: '12px',
        border: '1px solid',
        borderColor: 'primary.main',
        alignItems: 'center',
        overflow: 'hidden',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundSize: 'contain',
        backgroundPosition: 'top',
        backgroundRepeat: 'no-repeat',
        mb: 4,
        boxShadow: [
          '0 -2px 4px 0 rgba(0, 0, 0, 0.25)',
          '0 4px 4px 0 rgba(0, 0, 0, 0.25)',
        ].join(', '),
        ':hover': {
          cursor: 'pointer',
          borderColor: 'primary.main',
          boxShadow: '0 2px 2px 2px #F6893D',
        },
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
        }}
      >
        {description}
      </Typography>
      <Typography
        variant="h6"
        color={'primary.main'}
        sx={{
          whiteSpace: 'normal',
          backgroundColor: 'navSplash.dark',
          justifyContent: 'center',
          width: '100%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          textAlign: 'center',
        }}
      >
        {title}
      </Typography>
    </Box>
  )
}
