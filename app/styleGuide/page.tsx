import { Stack, Typography } from '@mui/material'

export default function StyleGuide() {
  return (
    <Stack spacing={2} sx={{ p: 4 }}>
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

      <Typography variant="body1">
        breakpoints: values: xs: 0, sm: 600, md: 960, lg: 1280, xl: 1920,
      </Typography>
      <Typography variant="body1">
        spacing: [0, 4, 8, 16, 32, 40, 48, 64],
      </Typography>
      <Typography variant="h3">palette</Typography>
      <Typography variant="body1">primary</Typography>
      <Typography variant="body1">main: '#F6893D'</Typography>
      <Typography variant="body1">light: '#FFBA6F'</Typography>
      <Typography variant="body1">dark: '#C3581A'</Typography>
      <Typography variant="body1">contrastText: '#000000'</Typography>
      <Typography variant="body1">secondary</Typography>
      <Typography variant="body1">main: '#F6B93D'</Typography>
      <Typography variant="body1">light: '#FFD970'</Typography>
      <Typography variant="body1">dark: '#C38B1A'</Typography>
      <Typography variant="body1">contrastText: '#000000'</Typography>
      <Typography variant="body1">error</Typography>
      <Typography variant="body1">main: '#D32F2F'</Typography>
      <Typography variant="body1">light: '#E57373'</Typography>
      <Typography variant="body1">dark: '#9A0007'</Typography>
      <Typography variant="body1">contrastText: '#000000'</Typography>
      <Typography variant="body1">warning</Typography>
      <Typography variant="body1">main: '#FFA726'</Typography>
      <Typography variant="body1">light: '#FFD95B'</Typography>
      <Typography variant="body1">dark: '#C77800'</Typography>
      <Typography variant="body1">contrastText: '#000000'</Typography>
      <Typography variant="body1">info</Typography>
      <Typography variant="body1">main: '#1976D2'</Typography>
      <Typography variant="body1">light: '#63A4FF'</Typography>
      <Typography variant="body1">dark: '#004BA0'</Typography>
      <Typography variant="body1">contrastText: '#FFFFFF'</Typography>
      <Typography variant="body1">success</Typography>
      <Typography variant="body1">main: '#2E7D32'</Typography>

      <Typography variant="body1">light: '#60AD5E'</Typography>
      <Typography variant="body1">dark: '#005005'</Typography>
      <Typography variant="body1">contrastText: '#FFFFFF'</Typography>
      <Typography variant="body1">
        fontFamily: ['Lato', 'sans-serif'],
      </Typography>
    </Stack>
  )
}
