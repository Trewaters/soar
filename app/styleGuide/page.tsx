import { Box, Button, Stack, Typography } from '@mui/material'

export default function StyleGuide() {
  // Define color palette
  type ColorPalette = {
    [key: string]: {
      main: string
      light: string
      dark: string
      contrastText: string
    }
  }

  const colors: ColorPalette = {
    primary: {
      main: '#F6893D',
      light: '#FFBA6F',
      dark: '#C3581A',
      contrastText: '#000000',
    },
    secondary: {
      main: '#F6B93D',
      light: '#FFD970',
      dark: '#C38B1A',
      contrastText: '#000000',
    },
    error: {
      main: '#D32F2F',
      light: '#E57373',
      dark: '#9A0007',
      contrastText: '#F6893D',
    },
    warning: {
      main: '#FFA726',
      light: '#FFD95B',
      dark: '#C77800',
      contrastText: '#000000',
    },
    info: {
      main: '#1976D2',
      light: '#63A4FF',
      dark: '#004BA0',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#2E7D32',
      light: '#60AD5E',
      dark: '#005005',
      contrastText: '#FFFFFF',
    },
  }
  return (
    <Stack spacing={2} sx={{ p: 4 }}>
      <Box
        display={'flex'}
        flexDirection={'column'}
        sx={{ border: '2px solid black', px: 4, py: 2 }}
      >
        <Typography variant="h1">h1. Heading</Typography>
        <Typography variant="h2">h2. Heading</Typography>
        <Typography variant="h3">h3. Heading</Typography>
        <Typography variant="h4">h4. Heading</Typography>
        <Typography variant="h5">h5. Heading</Typography>
        <Typography variant="h6">h6. Heading</Typography>
        <Typography variant="subtitle1">
          subtitle1. Lorem ipsum dolor sit amet, consectetur adipisicing elit.
          Quos blanditiis tenetur
        </Typography>
        <Typography variant="subtitle2">
          subtitle2. Lorem ipsum dolor sit amet, consectetur adipisicing elit.
          Quos blanditiis tenetur
        </Typography>
        <Typography variant="body1">
          body1. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos
          blanditiis tenetur
        </Typography>
        <Typography variant="body2">
          body2. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos
          blanditiis tenetur
        </Typography>
        {/* <Typography variant="button">button text</Typography> */}
        <Typography variant="caption">caption text</Typography>
        <Typography variant="overline">overline text</Typography>
        <Typography variant="label">label text</Typography>
      </Box>
      <Typography variant="body1">
        breakpoints: ( xs: 0, sm: 600, md: 960, lg: 1280, xl: 1920 )
      </Typography>
      <Typography variant="body1">
        spacing: [0, 4, 8, 16, 32, 40, 48, 64]
      </Typography>
      <Typography variant="body1">fontFamily: [Lato, sans-serif]</Typography>

      <Typography alignSelf={'center'} variant="h2">
        Palette
      </Typography>
      <Stack
        gap={3}
        spacing={3}
        direction={'row'}
        flexWrap={'wrap'}
        justifyContent={'center'}
      >
        <Box sx={{ px: 2, border: '2px solid black' }}>
          <Typography
            variant="h3"
            sx={{ mb: 3, borderBottom: 'solid 1px gray' }}
          >
            primary
          </Typography>
          <Typography variant="body1" sx={{ color: '#F6893D' }}>
            main: #F6893D
          </Typography>
          <Typography variant="body1" sx={{ color: '#FFBA6F' }}>
            light: #FFBA6F
          </Typography>
          <Typography variant="body1" sx={{ color: '#C3581A' }}>
            dark: #C3581A
          </Typography>
          <Typography variant="body1" sx={{ color: '#000000' }}>
            contrastText: #000000
          </Typography>
        </Box>
        <Box sx={{ px: 2, border: '2px solid black' }}>
          <Typography
            variant="h3"
            sx={{ mb: 3, borderBottom: 'solid 1px gray' }}
          >
            secondary
          </Typography>
          <Typography variant="body1" sx={{ color: '#F6B93D' }}>
            main: F6B93D
          </Typography>
          <Typography variant="body1" sx={{ color: '#FFD970' }}>
            light: FFD970
          </Typography>
          <Typography variant="body1" sx={{ color: '#C38B1A' }}>
            dark: C38B1A
          </Typography>
          <Typography variant="body1" sx={{ color: '#000000' }}>
            contrastText: 000000
          </Typography>
        </Box>
        <Box sx={{ px: 2, border: '2px solid black' }}>
          <Typography
            variant="h3"
            sx={{ mb: 3, borderBottom: 'solid 1px gray' }}
          >
            error
          </Typography>
          <Typography variant="body1" sx={{ color: '#D32F2F' }}>
            main: D32F2F
          </Typography>
          <Typography variant="body1" sx={{ color: '#E57373' }}>
            light: E57373
          </Typography>
          <Typography variant="body1" sx={{ color: '#9A0007' }}>
            dark: 9A0007
          </Typography>
          <Typography variant="body1" sx={{ color: '#F6893D' }}>
            contrastText: F6893D
          </Typography>
        </Box>
        <Box sx={{ px: 2, border: '2px solid black' }}>
          <Typography
            variant="h3"
            sx={{ mb: 3, borderBottom: 'solid 1px gray' }}
          >
            warning
          </Typography>
          <Typography variant="body1" sx={{ color: '#FFA726' }}>
            main: FFA726
          </Typography>
          <Typography variant="body1" sx={{ color: '#FFD95B' }}>
            light: FFD95B
          </Typography>
          <Typography variant="body1" sx={{ color: '#C77800' }}>
            dark: C77800
          </Typography>
          <Typography variant="body1" sx={{ color: '#000000' }}>
            contrastText: 000000
          </Typography>
        </Box>
        <Box sx={{ px: 2, border: '2px solid black' }}>
          <Typography
            variant="h3"
            sx={{ mb: 3, borderBottom: 'solid 1px gray' }}
          >
            info
          </Typography>
          <Typography variant="body1" sx={{ color: '#1976D2' }}>
            main: 1976D2
          </Typography>
          <Typography variant="body1" sx={{ color: '#63A4FF' }}>
            light: 63A4FF
          </Typography>
          <Typography variant="body1" sx={{ color: '#004BA0' }}>
            dark: 004BA0
          </Typography>
          <Typography variant="body1" sx={{ color: '#FFFFFF' }}>
            contrastText: FFFFFF
          </Typography>
        </Box>
        <Box sx={{ px: 2, border: '2px solid black' }}>
          <Typography
            variant="h3"
            sx={{ mb: 3, borderBottom: 'solid 1px gray' }}
          >
            success
          </Typography>
          <Typography variant="body1" sx={{ color: '#2E7D32' }}>
            main: 2E7D32
          </Typography>
          <Typography variant="body1" sx={{ color: '#60AD5E' }}>
            light: 60AD5E
          </Typography>
          <Typography variant="body1" sx={{ color: '#005005' }}>
            dark: 005005
          </Typography>
          <Typography variant="body1" sx={{ color: '#FFFFFF' }}>
            contrastText: FFFFFF
          </Typography>
        </Box>
      </Stack>

      <Stack
        gap={3}
        spacing={3}
        direction={'row'}
        flexWrap={'wrap'}
        justifyContent={'center'}
        paddingTop={5}
      >
        {Object.keys(colors).map((colorKey) => (
          <Box key={colorKey} sx={{ px: 2, pb: 2, border: '2px solid black' }}>
            <Typography
              variant="h3"
              sx={{ mb: 3, borderBottom: 'solid 1px gray' }}
            >
              {colorKey}
            </Typography>
            <Stack spacing={1}>
              {Object.entries(colors[colorKey]).map(([variant, color]) => (
                <Button
                  key={variant}
                  variant="contained"
                  sx={{
                    backgroundColor: color as string,
                    color:
                      colorKey === 'info' || colorKey === 'success'
                        ? '#FFFFFF'
                        : '#000000',
                    '&:hover': {
                      backgroundColor: color as string,
                    },
                  }}
                >
                  {variant}: {color}
                </Button>
              ))}
            </Stack>
          </Box>
        ))}
      </Stack>
    </Stack>
  )
}
