'use client'
import { Box, Button, Stack, Typography, useTheme } from '@mui/material'
import { StyleGuideText } from './constants/Strings'

export default function StyleGuide() {
  const theme = useTheme()

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
      main: theme.palette.primary.main,
      light: theme.palette.primary.light,
      dark: theme.palette.primary.dark,
      contrastText: theme.palette.primary.contrastText,
    },
    secondary: {
      main: theme.palette.secondary.main,
      light: theme.palette.secondary.light,
      dark: theme.palette.secondary.dark,
      contrastText: theme.palette.secondary.contrastText,
    },
    error: {
      main: theme.palette.error.main,
      light: theme.palette.error.light,
      dark: theme.palette.error.dark,
      contrastText: theme.palette.error.contrastText,
    },
    warning: {
      main: theme.palette.warning.main,
      light: theme.palette.warning.light,
      dark: theme.palette.warning.dark,
      contrastText: theme.palette.warning.contrastText,
    },
    info: {
      main: theme.palette.info.main,
      light: theme.palette.info.light,
      dark: theme.palette.info.dark,
      contrastText: theme.palette.info.contrastText,
    },
    success: {
      main: theme.palette.success.main,
      light: theme.palette.success.light,
      dark: theme.palette.success.dark,
      contrastText: theme.palette.success.contrastText,
    },
  }

  /* const colors: ColorPalette = {
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
  } */

  return (
    <Stack spacing={2} sx={{ p: 4 }}>
      <Box
        display={'flex'}
        flexDirection={'column'}
        sx={{ border: '2px solid black', px: 4, py: 2 }}
      >
        <Stack spacing={2}>
          <Typography
            variant="h1"
            component={'h1'}
            sx={{ alignSelf: 'center', borderBottom: '1px solid black' }}
          >
            Typography
          </Typography>
          <Typography
            variant="h3"
            component={'p'}
            sx={{ alignSelf: 'center', pt: '16px' }}
          >
            Headings
          </Typography>
        </Stack>
        <Stack spacing={2} textAlign={'center'} sx={{ py: '32px' }}>
          <Typography variant="h1" component={'p'}>
            H1 - Heading
          </Typography>
          <Typography variant="h2" component={'p'}>
            H2 - Heading
          </Typography>
          <Typography variant="h3" component={'p'}>
            H3 - Heading
          </Typography>
          <Typography variant="h4" component={'p'}>
            H4 - Heading
          </Typography>
          <Typography variant="h5" component={'p'}>
            H5 - Heading
          </Typography>
          <Typography variant="h6" component={'p'}>
            H6 - Heading
          </Typography>
          <Typography variant="subtitle1" component={'p'}>
            subtitle1
          </Typography>
          <Typography variant="subtitle2" component={'p'}>
            subtitle2
          </Typography>
        </Stack>
        <Stack spacing={2} textAlign={'center'} sx={{ py: '32px' }}>
          <Typography
            variant="h3"
            component={'p'}
            sx={{ alignSelf: 'center', pb: '16px' }}
          >
            Body Text
          </Typography>
          <Typography variant="body1" component={'p'}>
            body1
          </Typography>
          <Typography variant="body1" component={'p'}>
            Default paragraph text used for most of the app.
          </Typography>
          <Typography variant="body2">body2</Typography>
          <Typography variant="body2">
            Slightly smaller paragraph text used for less important information.
          </Typography>
          <Typography variant="caption">Caption Text</Typography>
          <Typography variant="overline">Overline Text</Typography>
          <Typography variant="label">Label Text</Typography>
        </Stack>
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
            {StyleGuideText.PRIMARY}
          </Typography>
          <Typography variant="body1" color={theme.palette.primary.main}>
            main: {theme.palette.primary.main.toString()}
          </Typography>
          <Typography variant="body1" color={theme.palette.primary.light}>
            light: {theme.palette.primary.light.toString()}
          </Typography>
          <Typography variant="body1" color={theme.palette.primary.dark}>
            dark: {theme.palette.primary.dark.toString()}
          </Typography>
          <Typography
            variant="body1"
            color={theme.palette.primary.contrastText}
          >
            contrastText: {theme.palette.primary.contrastText.toString()}
          </Typography>
        </Box>
        <Box sx={{ px: 2, border: '2px solid black' }}>
          <Typography
            variant="h3"
            sx={{ mb: 3, borderBottom: 'solid 1px gray' }}
          >
            {StyleGuideText.SECONDARY}
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
            {StyleGuideText.ERROR}
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
            {StyleGuideText.WARNING}
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
            {StyleGuideText.INFO}
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
            {StyleGuideText.SUCCESS}
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
