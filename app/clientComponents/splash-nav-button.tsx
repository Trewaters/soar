import { Box, Typography } from '@mui/material'
import { ComponentProps } from 'react'

interface SplashNavButtonProps extends ComponentProps<typeof Box> {
  title: string
  description: string
}

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
        height: '260px',
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
