'use client'
import {
  Alert,
  AppBar,
  Autocomplete,
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Checkbox,
  CircularProgress,
  Collapse,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Grid2,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  useTheme,
} from '@mui/material'
import {
  ExpandMore as ExpandMoreIcon,
  Favorite as FavoriteIcon,
  Home as HomeIcon,
  Menu as MenuIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material'
import { AutocompleteInput } from '@app/clientComponents/form'
import SearchIcon from '@mui/icons-material/Search'
import { useState } from 'react'
import { AsanaPose } from 'types/asana'

/**
 * Calculate the relative luminance of a color
 * Based on WCAG 2.0 formula: https://www.w3.org/TR/WCAG20/#relativeluminancedef
 */
function getRelativeLuminance(color: string): number {
  // Handle rgba/rgb colors by extracting hex or converting
  if (color.startsWith('rgba') || color.startsWith('rgb')) {
    // For rgba with transparency, return a middle value to use black text
    return 0.5
  }

  // Convert hex to RGB
  const hex = color.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16) / 255
  const g = parseInt(hex.substr(2, 2), 16) / 255
  const b = parseInt(hex.substr(4, 2), 16) / 255

  // Apply gamma correction
  const rsRGB = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4)
  const gsRGB = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4)
  const bsRGB = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4)

  // Calculate relative luminance
  return 0.2126 * rsRGB + 0.7152 * gsRGB + 0.0722 * bsRGB
}

/**
 * Determine whether to use white or black text based on background color
 * Uses WCAG contrast ratio guidelines
 */
function getContrastTextColor(backgroundColor: string): string {
  const luminance = getRelativeLuminance(backgroundColor)
  // If luminance is greater than 0.5, use black text, otherwise use white
  return luminance > 0.5 ? '#000000' : '#FFFFFF'
}

export default function StyleGuide() {
  const theme = useTheme()
  const [tabValue, setTabValue] = useState(0)

  const [expanded, setExpanded] = useState(false)

  // Generate dynamic color palette from theme
  const colorKeys = [
    'primary',
    'secondary',
    'error',
    'warning',
    'info',
    'success',
    'navSplash',
    'text',
    'background',
  ] as const
  const colors = colorKeys.reduce(
    (acc, colorKey) => {
      const paletteValue = theme.palette[colorKey as keyof typeof theme.palette]
      // Get all color properties dynamically
      const colorEntries = Object.entries(paletteValue).filter(
        ([_, value]) => typeof value === 'string'
      )
      acc[colorKey] = Object.fromEntries(colorEntries)
      return acc
    },
    {} as Record<string, Record<string, string>>
  )

  // Sample data for components
  const autocompleteOptions: AsanaPose[] = [
    { id: '1', sort_english_name: 'Option 1' } as AsanaPose,
    { id: '2', sort_english_name: 'Option 2' } as AsanaPose,
    { id: '3', sort_english_name: 'Option 3' } as AsanaPose,
    { id: '4', sort_english_name: 'Option 4' } as AsanaPose,
  ]
  const listItems = ['Home', 'Profile', 'Settings', 'About']

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={6}>
        {/* Typography Section */}
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography
            variant="h1"
            component="h1"
            color="text.secondary"
            sx={{ textAlign: 'center', mb: 4 }}
          >
            Design System Style Guide
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Typography
            variant="h2"
            component="h2"
            textAlign={'center'}
            sx={{ mb: 6 }}
          >
            Typography MUI Variants
          </Typography>

          <Stack spacing={4}>
            <Stack direction={'column'} spacing={1}>
              <Stack direction={'row'} justifyContent={'space-between'}>
                <Typography variant="h1">
                  H1 ({theme.typography.h1.fontSize})
                </Typography>
                <Typography variant="h1" sx={{ fontStyle: 'italic' }}>
                  Main Page level Heading
                </Typography>
              </Stack>
              <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                Header for top level of pages.
              </Typography>
            </Stack>

            <Stack direction={'column'} spacing={1}>
              <Stack direction={'row'} justifyContent={'space-between'}>
                <Typography variant="h2">
                  H2 ({theme.typography.h2.fontSize})
                </Typography>
                <Typography variant="h2" sx={{ fontStyle: 'italic' }}>
                  Section Heading
                </Typography>
              </Stack>
              <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                For Header subtitles
              </Typography>
            </Stack>

            <Stack direction={'column'} spacing={1}>
              <Stack direction={'row'} justifyContent={'space-between'}>
                <Typography variant="h3">
                  H3 ({theme.typography.h3.fontSize})
                </Typography>
                <Typography variant="h3" sx={{ fontStyle: 'italic' }}>
                  Subsection Heading
                </Typography>
              </Stack>
              <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                Used for subsection titles within a section
              </Typography>
            </Stack>

            <Stack direction={'column'} spacing={1}>
              <Stack direction={'row'} justifyContent={'space-between'}>
                <Typography variant="h4">
                  H4 ({theme.typography.h4.fontSize})
                </Typography>
                <Typography variant="h4" sx={{ fontStyle: 'italic' }}>
                  Heading Level 4
                </Typography>
              </Stack>
              <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                For component headings and card titles
              </Typography>
            </Stack>

            <Stack direction={'column'} spacing={1}>
              <Stack direction={'row'} justifyContent={'space-between'}>
                <Typography variant="h5">
                  H5 ({theme.typography.h5.fontSize})
                </Typography>
                <Typography variant="h5" sx={{ fontStyle: 'italic' }}>
                  Heading Level 5
                </Typography>
              </Stack>
              <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                For smaller component headings
              </Typography>
            </Stack>

            <Stack direction={'column'} spacing={1}>
              <Stack direction={'row'} justifyContent={'space-between'}>
                <Typography variant="h6">
                  H6 ({theme.typography.h6.fontSize})
                </Typography>
                <Typography variant="h6" sx={{ fontStyle: 'italic' }}>
                  Heading Level 6
                </Typography>
              </Stack>
              <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                For minor headings and list group titles
              </Typography>
            </Stack>

            <Stack direction={'column'} spacing={1}>
              <Stack direction={'row'} justifyContent={'space-between'}>
                <Typography variant="subtitle1">
                  Subtitle1 ({theme.typography.subtitle1.fontSize})
                </Typography>
                <Typography variant="subtitle1" sx={{ fontStyle: 'italic' }}>
                  Subtitle Variant
                </Typography>
              </Stack>
              <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                Used for prominent subheadings
              </Typography>
            </Stack>

            <Stack direction={'column'} spacing={1}>
              <Stack direction={'row'} justifyContent={'space-between'}>
                <Typography variant="subtitle2">
                  Subtitle2 ({theme.typography.subtitle2.fontSize})
                </Typography>
                <Typography variant="subtitle2" sx={{ fontStyle: 'italic' }}>
                  Subtitle Variant
                </Typography>
              </Stack>
              <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                Used for secondary subheadings
              </Typography>
            </Stack>

            <Stack direction={'column'} spacing={1}>
              <Stack direction={'row'} justifyContent={'space-between'}>
                <Typography variant="subtitle3">
                  Subtitle3 ({theme.typography.subtitle3?.fontSize || 'N/A'})
                </Typography>
                <Typography variant="subtitle3" sx={{ fontStyle: 'italic' }}>
                  Custom Subtitle Variant
                </Typography>
              </Stack>
              <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                Custom variant for larger subtitles
              </Typography>
            </Stack>

            <Stack direction={'column'} spacing={1}>
              <Stack direction={'row'} justifyContent={'space-between'}>
                <Typography variant="body1">
                  Body1 ({theme.typography.body1.fontSize})
                </Typography>
                <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                  Default paragraph text
                </Typography>
              </Stack>
              <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                Standard body text for most content
              </Typography>
            </Stack>

            <Stack direction={'column'} spacing={1}>
              <Stack direction={'row'} justifyContent={'space-between'}>
                <Typography variant="body2">
                  Body2 ({theme.typography.body2.fontSize})
                </Typography>
                <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                  Smaller paragraph text
                </Typography>
              </Stack>
              <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                Used for secondary body text and descriptions
              </Typography>
            </Stack>

            <Stack direction={'column'} spacing={1}>
              <Stack direction={'row'} justifyContent={'space-between'}>
                <Typography variant="caption">
                  Caption ({theme.typography.caption.fontSize})
                </Typography>
                <Typography variant="caption" sx={{ fontStyle: 'italic' }}>
                  Caption text
                </Typography>
              </Stack>
              <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                For image captions and supplementary text
              </Typography>
            </Stack>

            <Stack direction={'column'} spacing={1}>
              <Stack direction={'row'} justifyContent={'space-between'}>
                <Typography variant="overline">
                  Overline ({theme.typography.overline.fontSize})
                </Typography>
                <Typography variant="overline" sx={{ fontStyle: 'italic' }}>
                  Overline text
                </Typography>
              </Stack>
              <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                For labels and eyebrows above headings
              </Typography>
            </Stack>

            <Stack direction={'column'} spacing={1}>
              <Stack direction={'row'} justifyContent={'space-between'}>
                <Typography variant="label">
                  Label ({theme.typography.label.fontSize})
                </Typography>
                <Typography variant="label" sx={{ fontStyle: 'italic' }}>
                  Custom label variant
                </Typography>
              </Stack>
              <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                Custom variant for prominent labels
              </Typography>
            </Stack>

            <Stack direction={'column'} spacing={1}>
              <Stack
                direction={'row'}
                justifyContent={'space-between'}
                sx={{ overflow: 'hidden' }}
              >
                <Typography
                  variant="splashTitle"
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '50%',
                  }}
                >
                  SplashTitle ({theme.typography.splashTitle.fontSize})
                </Typography>
                <Typography
                  variant="splashTitle"
                  sx={{
                    fontStyle: 'italic',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '50%',
                  }}
                >
                  Custom splash variant
                </Typography>
              </Stack>
              <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                Large uppercase titles for splash screens and hero sections
              </Typography>
            </Stack>
          </Stack>
        </Paper>

        {/* Theme Values Section */}
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography
            variant="h2"
            component="h2"
            textAlign={'center'}
            sx={{ mb: 3 }}
          >
            Theme Configuration
          </Typography>

          <Grid2 container justifyContent={'center'} spacing={10}>
            <Grid2
              size={{ xs: 12, md: 6 }}
              display="flex"
              justifyContent="center"
            >
              <Box>
                <Typography variant="h6" gutterBottom textAlign="center">
                  Breakpoints
                </Typography>
                <Stack spacing={1}>
                  {Object.entries(theme.breakpoints.values).map(
                    ([key, value]) => (
                      <Stack
                        spacing={1}
                        direction={'row'}
                        key={key}
                        justifyContent={'space-between'}
                      >
                        <Typography key={key} variant="body2">
                          {key}:
                        </Typography>
                        <Typography key={key} variant="body2">
                          {value}px
                        </Typography>
                      </Stack>
                    )
                  )}
                </Stack>
              </Box>
            </Grid2>

            <Grid2
              size={{ xs: 12, md: 6 }}
              display="flex"
              justifyContent="center"
            >
              <Box>
                <Typography variant="h6" gutterBottom textAlign="center">
                  Spacing Scale
                </Typography>
                <Stack spacing={1}>
                  {theme
                    .spacing()
                    .split(' ')
                    .map((value, index) => (
                      <Typography key={index} variant="body2">
                        {index}: {value}
                      </Typography>
                    ))}
                </Stack>
              </Box>
            </Grid2>

            <Grid2 size={{ xs: 12, md: 12 }}>
              <Typography variant="h6" gutterBottom textAlign="center">
                Font Family
              </Typography>
              <Typography variant="body2" textAlign="center">
                {theme.typography.fontFamily}
              </Typography>
            </Grid2>
          </Grid2>
        </Paper>

        {/* Color Palette Section */}
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h2" component="h2" sx={{ mb: 3 }}>
            Color Palette
          </Typography>

          <Grid2 container spacing={3}>
            {Object.entries(colors).map(([colorName, colorValues]) => (
              <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={colorName}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography
                    variant="h6"
                    sx={{ textTransform: 'capitalize', mb: 2 }}
                  >
                    {colorName}
                  </Typography>
                  <Stack spacing={1}>
                    {Object.entries(colorValues).map(([variant, value]) => {
                      const textColor = getContrastTextColor(value)
                      return (
                        <Box
                          key={variant}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            p: 1,
                            backgroundColor: value,
                            borderRadius: 1,
                            border: '1px solid',
                            borderColor: theme.palette.divider,
                          }}
                        >
                          <Typography variant="body2" sx={{ color: textColor }}>
                            {variant}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: textColor,
                              fontFamily: 'monospace',
                            }}
                          >
                            {value}
                          </Typography>
                        </Box>
                      )
                    })}
                  </Stack>
                </Paper>
              </Grid2>
            ))}
          </Grid2>
        </Paper>

        {/* MUI Components Section */}
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h2" component="h2" sx={{ mb: 3 }}>
            MUI Components (Primary Theme Style)
          </Typography>

          {/* Buttons */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom>
              Buttons
            </Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
              <Button variant="contained" color="primary">
                Contained Primary
              </Button>
              <Button variant="outlined" color="primary">
                Outlined Primary
              </Button>
              <Button variant="text" color="primary">
                Text Primary
              </Button>
              <Button variant="contained" disabled>
                Disabled
              </Button>
              <IconButton color="primary" aria-label="icon button">
                <FavoriteIcon />
              </IconButton>
            </Stack>
            <Box sx={{ mt: 2 }}>
              <ButtonGroup variant="contained" color="primary">
                <Button>One</Button>
                <Button>Two</Button>
                <Button>Three</Button>
              </ButtonGroup>
            </Box>
          </Box>

          {/* Form Controls */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom>
              Form Controls
            </Typography>
            <Stack spacing={3} sx={{ maxWidth: 400 }}>
              <TextField
                label="Text Field"
                variant="outlined"
                color="primary"
                helperText="Helper text"
              />
              <Autocomplete
                disablePortal
                options={autocompleteOptions}
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderRadius: '12px',
                    borderColor: 'primary.main',
                    boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.25)',
                  },
                  '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline':
                    {
                      borderColor: 'primary.light', // Ensure border color does not change on hover
                    },
                  '& .MuiAutocomplete-endAdornment': {
                    display: 'none',
                  },
                }}
                renderInput={(params) => (
                  <AutocompleteInput
                    params={params}
                    placeholder="Search for a Yoga Pose"
                    sx={{ '& .MuiInputBase-input': { color: 'primary.main' } }}
                  />
                )}
                filterOptions={(options, state) =>
                  options.filter((option) =>
                    option.sort_english_name
                      .toLowerCase()
                      .includes(state.inputValue.toLowerCase())
                  )
                }
                id="search-poses"
                getOptionLabel={(option: AsanaPose) => option.sort_english_name}
                renderOption={(props, option) => (
                  <li {...props} key={option.id}>
                    {option.sort_english_name}
                  </li>
                )}
                // defaultValue={defaultPose}
                autoSelect={true}
                onChange={() => {}}
              />
              <FormControl>
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox defaultChecked color="primary" />}
                    label="Checkbox Primary"
                  />
                  <FormControlLabel
                    control={<Checkbox color="primary" />}
                    label="Checkbox Unchecked"
                  />
                </FormGroup>
                <FormHelperText>Helper text for form group</FormHelperText>
              </FormControl>
            </Stack>
          </Box>

          {/* Cards */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom>
              Cards
            </Typography>
            <Grid2 container spacing={2}>
              <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                <Card>
                  <CardHeader
                    title="Card Title"
                    subheader="Card Subtitle"
                    action={
                      <IconButton aria-label="settings">
                        <SettingsIcon />
                      </IconButton>
                    }
                  />
                  <CardMedia
                    component="div"
                    sx={{
                      height: 100,
                      backgroundColor: theme.palette.grey[300],
                    }}
                  />
                  <CardContent>
                    <Typography variant="body2">
                      This is card content with some example text.
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="primary">
                      Action 1
                    </Button>
                    <Button size="small" color="primary">
                      Action 2
                    </Button>
                  </CardActions>
                </Card>
              </Grid2>
              <Grid2 size={{ xs: 12, sm: 6, md: 4 }}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Expandable Card
                    </Typography>
                    <Typography variant="body2">
                      Click expand to see more content.
                    </Typography>
                    <IconButton
                      onClick={() => setExpanded(!expanded)}
                      aria-expanded={expanded}
                      aria-label="show more"
                    >
                      <ExpandMoreIcon />
                    </IconButton>
                    <Collapse in={expanded} timeout="auto" unmountOnExit>
                      <Typography paragraph>
                        This is the expanded content that appears when the
                        expand button is clicked.
                      </Typography>
                    </Collapse>
                  </CardContent>
                </Card>
              </Grid2>
            </Grid2>
          </Box>

          {/* Navigation */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom>
              Navigation
            </Typography>

            {/* Tabs */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Tabs
              </Typography>
              <Tabs
                value={tabValue}
                onChange={(_, newValue) => setTabValue(newValue)}
                aria-label="example tabs"
              >
                <Tab label="Tab One" />
                <Tab label="Tab Two" />
                <Tab label="Tab Three" />
              </Tabs>
            </Box>

            {/* AppBar */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                App Bar
              </Typography>
              <AppBar position="static" color="primary">
                <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
                  <IconButton color="inherit" aria-label="menu">
                    <MenuIcon />
                  </IconButton>
                  <Typography variant="h6" sx={{ flexGrow: 1, ml: 2 }}>
                    App Title
                  </Typography>
                  <IconButton color="inherit" aria-label="profile">
                    <PersonIcon />
                  </IconButton>
                </Box>
              </AppBar>
            </Box>

            {/* Lists */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Lists
              </Typography>
              <Paper variant="outlined" sx={{ maxWidth: 300 }}>
                <List>
                  {listItems.map((item, index) => (
                    <ListItem key={item} disablePadding>
                      <ListItemButton>
                        <ListItemIcon>
                          {index === 0 && <HomeIcon />}
                          {index === 1 && <PersonIcon />}
                          {index === 2 && <SettingsIcon />}
                          {index === 3 && <SearchIcon />}
                        </ListItemIcon>
                        <ListItemText primary={item} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Box>
          </Box>

          {/* Feedback */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom>
              Feedback
            </Typography>
            <Stack spacing={2}>
              <Alert severity="success">This is a success alert!</Alert>
              <Alert severity="info">This is an info alert!</Alert>
              <Alert severity="warning">This is a warning alert!</Alert>
              <Alert severity="error">This is an error alert!</Alert>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <CircularProgress color="primary" />
                <Typography>Loading...</Typography>
              </Box>
            </Stack>
          </Box>

          {/* Layout Components */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom>
              Layout
            </Typography>
            <Stack spacing={2}>
              <Typography variant="h6">Dividers</Typography>
              <Divider />
              <Divider variant="middle" />
              <Divider variant="fullWidth" />

              <Typography variant="h6">Avatar</Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Avatar sx={{ bgcolor: theme.palette.primary.main }}>A</Avatar>
                <Avatar sx={{ bgcolor: theme.palette.secondary.main }}>
                  B
                </Avatar>
                <Avatar sx={{ bgcolor: theme.palette.success.main }}>C</Avatar>
              </Box>
            </Stack>
          </Box>

          {/* Custom Button Styles from App */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" gutterBottom>
              App-Specific Button Styles
            </Typography>
            <Stack spacing={2} sx={{ maxWidth: 300 }}>
              <Button
                variant="outlined"
                sx={{
                  borderRadius: '14px',
                  boxShadow: '0px 4px 4px -1px rgba(0, 0, 0, 0.25)',
                  textTransform: 'uppercase',
                  padding: '12px 16px',
                  '&:hover': {
                    backgroundColor: 'transparent',
                    transform: 'translateY(-1px)',
                    boxShadow: '0px 6px 8px -1px rgba(0, 0, 0, 0.25)',
                  },
                  '&:focus': {
                    outline: '2px solid',
                    outlineColor: 'primary.main',
                    outlineOffset: '2px',
                  },
                }}
              >
                Navigation Button Style
              </Button>

              <TextField
                label="Form Field Style"
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderRadius: '12px',
                    borderColor: 'primary.main',
                    boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.25)',
                  },
                  '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline':
                    {
                      borderColor: 'primary.light',
                    },
                }}
              />
            </Stack>
          </Box>
        </Paper>
      </Stack>
    </Container>
  )
}
