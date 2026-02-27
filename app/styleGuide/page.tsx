'use client'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
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
  Snackbar,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  useTheme,
} from '@mui/material'
import { Theme } from '@mui/material/styles'
import {
  ExpandMore as ExpandMoreIcon,
  Favorite as FavoriteIcon,
  Home as HomeIcon,
  Menu as MenuIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material'
import { AutocompleteInput } from '@app/clientComponents/form'
import HelpButton from '@app/clientComponents/HelpButton'
import HelpDrawer from '@app/clientComponents/HelpDrawer'
import SearchIcon from '@mui/icons-material/Search'
import EditIcon from '@mui/icons-material/Edit'
import SaveIcon from '@mui/icons-material/Save'
import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'
import { useState } from 'react'
import { AsanaPose } from 'types/asana'
import { HELP_PATHS } from '@app/utils/helpLoader'

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
function getContrastTextColor(backgroundColor: string, theme: Theme): string {
  const luminance = getRelativeLuminance(backgroundColor)
  // If luminance is greater than 0.5, use black text, otherwise use white
  return luminance > 0.5
    ? theme.palette.text.primary
    : theme.palette.text.inverse ?? '#ffffff'
}

export default function StyleGuide() {
  const theme = useTheme()
  const [tabValue, setTabValue] = useState(0)

  const [expanded, setExpanded] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const [accordionExpanded, setAccordionExpanded] = useState<string | false>(
    false
  )
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false)
  const [showErrorSnackbar, setShowErrorSnackbar] = useState(false)
  const [showWarningSnackbar, setShowWarningSnackbar] = useState(false)
  const [showInfoSnackbar, setShowInfoSnackbar] = useState(false)

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
        // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
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

          <Typography variant="h2" textAlign={'center'} sx={{ mb: 6 }}>
            Typography MUI Variants
          </Typography>

          <Grid2 container spacing={2}>
            <Grid2
              size={{ sm: 12, md: 6 }}
              sx={{ minWidth: 0, overflow: 'hidden' }}
            >
              <Typography
                variant="h1"
                sx={{
                  backgroundColor: 'background.helper',
                  wordBreak: 'break-word',
                }}
              >
                H1 ({theme.typography.h1.fontSize})
              </Typography>
            </Grid2>
            <Grid2
              size={{ sm: 12, md: 6 }}
              sx={{ minWidth: 0, overflow: 'hidden' }}
            >
              <Typography
                variant="h1"
                component={'text'}
                sx={{ fontStyle: 'italic', wordBreak: 'break-word' }}
              >
                Main Page level Heading
              </Typography>
            </Grid2>
            <Grid2 size={{ sm: 12 }} sx={{ minWidth: 0, overflow: 'hidden' }}>
              <Typography
                variant="body1"
                sx={{ fontStyle: 'italic', wordBreak: 'break-word' }}
              >
                Header for top level of pages.
              </Typography>
            </Grid2>

            <Grid2
              size={{ sm: 12, md: 6 }}
              sx={{ minWidth: 0, overflow: 'hidden' }}
            >
              <Typography
                variant="h2"
                component={'text'}
                sx={{
                  backgroundColor: 'background.helper',
                  wordBreak: 'break-word',
                }}
              >
                H2 ({theme.typography.h2.fontSize})
              </Typography>
            </Grid2>
            <Grid2
              size={{ sm: 12, md: 6 }}
              sx={{ minWidth: 0, overflow: 'hidden' }}
            >
              <Typography
                variant="h2"
                component={'text'}
                sx={{ fontStyle: 'italic', wordBreak: 'break-word' }}
              >
                Section Heading
              </Typography>
            </Grid2>
            <Grid2 size={{ sm: 12 }} sx={{ minWidth: 0, overflow: 'hidden' }}>
              <Typography
                variant="body1"
                sx={{ fontStyle: 'italic', wordBreak: 'break-word' }}
              >
                For Header subtitles
              </Typography>
            </Grid2>

            <Grid2
              size={{ sm: 12, md: 6 }}
              sx={{ minWidth: 0, overflow: 'hidden' }}
            >
              <Typography
                variant="h3"
                component={'text'}
                sx={{
                  backgroundColor: 'background.helper',
                  wordBreak: 'break-word',
                }}
              >
                H3 ({theme.typography.h3.fontSize})
              </Typography>
            </Grid2>
            <Grid2
              size={{ sm: 12, md: 6 }}
              sx={{ minWidth: 0, overflow: 'hidden' }}
            >
              <Typography
                variant="h3"
                component={'text'}
                sx={{ fontStyle: 'italic', wordBreak: 'break-word' }}
              >
                Subsection Heading
              </Typography>
            </Grid2>
            <Grid2 size={{ sm: 12 }} sx={{ minWidth: 0, overflow: 'hidden' }}>
              <Typography
                variant="body1"
                sx={{ fontStyle: 'italic', wordBreak: 'break-word' }}
              >
                Used for subsection titles within a section
              </Typography>
            </Grid2>

            <Grid2
              size={{ sm: 12, md: 6 }}
              sx={{ minWidth: 0, overflow: 'hidden' }}
            >
              <Typography
                variant="h4"
                component={'text'}
                sx={{
                  backgroundColor: 'background.helper',
                  wordBreak: 'break-word',
                }}
              >
                H4 ({theme.typography.h4.fontSize})
              </Typography>
            </Grid2>
            <Grid2
              size={{ sm: 12, md: 6 }}
              sx={{ minWidth: 0, overflow: 'hidden' }}
            >
              <Typography
                variant="h4"
                component={'text'}
                sx={{ fontStyle: 'italic', wordBreak: 'break-word' }}
              >
                Heading Level 4
              </Typography>
            </Grid2>
            <Grid2 size={{ sm: 12 }} sx={{ minWidth: 0, overflow: 'hidden' }}>
              <Typography
                variant="body1"
                sx={{ fontStyle: 'italic', wordBreak: 'break-word' }}
              >
                For component headings and card titles
              </Typography>
            </Grid2>

            <Grid2
              size={{ sm: 12, md: 6 }}
              sx={{ minWidth: 0, overflow: 'hidden' }}
            >
              <Typography
                variant="h5"
                component={'text'}
                sx={{
                  backgroundColor: 'background.helper',
                  wordBreak: 'break-word',
                }}
              >
                H5 ({theme.typography.h5.fontSize})
              </Typography>
            </Grid2>
            <Grid2
              size={{ sm: 12, md: 6 }}
              sx={{ minWidth: 0, overflow: 'hidden' }}
            >
              <Typography
                variant="h5"
                component={'text'}
                sx={{ fontStyle: 'italic', wordBreak: 'break-word' }}
              >
                Heading Level 5
              </Typography>
            </Grid2>
            <Grid2 size={{ sm: 12 }} sx={{ minWidth: 0, overflow: 'hidden' }}>
              <Typography
                variant="body1"
                sx={{ fontStyle: 'italic', wordBreak: 'break-word' }}
              >
                For smaller component headings
              </Typography>
            </Grid2>

            <Grid2
              size={{ sm: 12, md: 6 }}
              sx={{ minWidth: 0, overflow: 'hidden' }}
            >
              <Typography
                variant="h6"
                component={'text'}
                sx={{
                  backgroundColor: 'background.helper',
                  wordBreak: 'break-word',
                }}
              >
                H6 ({theme.typography.h6.fontSize})
              </Typography>
            </Grid2>
            <Grid2
              size={{ sm: 12, md: 6 }}
              sx={{ minWidth: 0, overflow: 'hidden' }}
            >
              <Typography
                variant="h6"
                component={'text'}
                sx={{ fontStyle: 'italic', wordBreak: 'break-word' }}
              >
                Heading Level 6
              </Typography>
            </Grid2>
            <Grid2 size={{ sm: 12 }} sx={{ minWidth: 0, overflow: 'hidden' }}>
              <Typography
                variant="body1"
                sx={{ fontStyle: 'italic', wordBreak: 'break-word' }}
              >
                For minor headings and list group titles
              </Typography>
            </Grid2>

            <Grid2
              size={{ sm: 12, md: 6 }}
              sx={{ minWidth: 0, overflow: 'hidden' }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  backgroundColor: 'background.helper',
                  wordBreak: 'break-word',
                }}
              >
                Subtitle1 ({theme.typography.subtitle1.fontSize})
              </Typography>
            </Grid2>
            <Grid2
              size={{ sm: 12, md: 6 }}
              sx={{ minWidth: 0, overflow: 'hidden' }}
            >
              <Typography
                variant="subtitle1"
                sx={{ fontStyle: 'italic', wordBreak: 'break-word' }}
              >
                UI Component titles
              </Typography>
            </Grid2>
            <Grid2 size={{ sm: 12 }} sx={{ minWidth: 0, overflow: 'hidden' }}>
              <Typography
                variant="body1"
                sx={{ fontStyle: 'italic', wordBreak: 'break-word' }}
              >
                Used for titles of cards and UI components
              </Typography>
            </Grid2>

            <Grid2
              size={{ sm: 12, md: 6 }}
              sx={{ minWidth: 0, overflow: 'hidden' }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  backgroundColor: 'background.helper',
                  wordBreak: 'break-word',
                }}
              >
                Subtitle2 ({theme.typography.subtitle2.fontSize})
              </Typography>
            </Grid2>
            <Grid2
              size={{ sm: 12, md: 6 }}
              sx={{ minWidth: 0, overflow: 'hidden' }}
            >
              <Typography
                variant="subtitle2"
                sx={{ fontStyle: 'italic', wordBreak: 'break-word' }}
              >
                Used for table headings
              </Typography>
            </Grid2>
            <Grid2 size={{ sm: 12 }} sx={{ minWidth: 0, overflow: 'hidden' }}>
              <Typography
                variant="body1"
                sx={{ fontStyle: 'italic', wordBreak: 'break-word' }}
              >
                Used for table headings and less prominent subtitles
              </Typography>
            </Grid2>

            <Grid2
              size={{ sm: 12, md: 6 }}
              sx={{ minWidth: 0, overflow: 'hidden' }}
            >
              <Typography
                variant="subtitle3"
                sx={{
                  backgroundColor: 'background.helper',
                  wordBreak: 'break-word',
                }}
              >
                Subtitle3 ({theme.typography.subtitle3?.fontSize || 'N/A'})
              </Typography>
            </Grid2>
            <Grid2
              size={{ sm: 12, md: 6 }}
              sx={{ minWidth: 0, overflow: 'hidden' }}
            >
              <Typography
                variant="subtitle3"
                sx={{ fontStyle: 'italic', wordBreak: 'break-word' }}
              >
                Custom Subtitle Variant
              </Typography>
            </Grid2>
            <Grid2 size={{ sm: 12 }} sx={{ minWidth: 0, overflow: 'hidden' }}>
              <Typography
                variant="body1"
                sx={{ fontStyle: 'italic', wordBreak: 'break-word' }}
              >
                Custom variant for larger subtitles
              </Typography>
            </Grid2>

            <Grid2
              size={{ sm: 12, md: 6 }}
              sx={{ minWidth: 0, overflow: 'hidden' }}
            >
              <Typography
                variant="body1"
                sx={{
                  backgroundColor: 'background.helper',
                  wordBreak: 'break-word',
                }}
              >
                Body1 ({theme.typography.body1.fontSize})
              </Typography>
            </Grid2>
            <Grid2
              size={{ sm: 12, md: 6 }}
              sx={{ minWidth: 0, overflow: 'hidden' }}
            >
              <Typography
                variant="body1"
                sx={{ fontStyle: 'italic', wordBreak: 'break-word' }}
              >
                Default paragraph text
              </Typography>
            </Grid2>
            <Grid2 size={{ sm: 12 }} sx={{ minWidth: 0, overflow: 'hidden' }}>
              <Typography
                variant="body1"
                sx={{ fontStyle: 'italic', wordBreak: 'break-word' }}
              >
                Standard body text for most content
              </Typography>
            </Grid2>

            <Grid2
              size={{ sm: 12, md: 6 }}
              sx={{ minWidth: 0, overflow: 'hidden' }}
            >
              <Typography
                variant="body2"
                sx={{
                  backgroundColor: 'background.helper',
                  wordBreak: 'break-word',
                }}
              >
                Body2 ({theme.typography.body2.fontSize})
              </Typography>
            </Grid2>
            <Grid2
              size={{ sm: 12, md: 6 }}
              sx={{ minWidth: 0, overflow: 'hidden' }}
            >
              <Typography
                variant="body2"
                sx={{ fontStyle: 'italic', wordBreak: 'break-word' }}
              >
                Smaller paragraph text
              </Typography>
            </Grid2>
            <Grid2 size={{ sm: 12 }} sx={{ minWidth: 0, overflow: 'hidden' }}>
              <Typography
                variant="body1"
                sx={{ fontStyle: 'italic', wordBreak: 'break-word' }}
              >
                Used for secondary body text and descriptions
              </Typography>
            </Grid2>

            <Grid2
              size={{ sm: 12, md: 6 }}
              sx={{ minWidth: 0, overflow: 'hidden' }}
            >
              <Typography
                variant="caption"
                sx={{
                  backgroundColor: 'background.helper',
                  wordBreak: 'break-word',
                }}
              >
                Caption ({theme.typography.caption.fontSize})
              </Typography>
            </Grid2>
            <Grid2
              size={{ sm: 12, md: 6 }}
              sx={{ minWidth: 0, overflow: 'hidden' }}
            >
              <Typography
                variant="caption"
                sx={{ fontStyle: 'italic', wordBreak: 'break-word' }}
              >
                Caption text
              </Typography>
            </Grid2>
            <Grid2 size={{ sm: 12 }} sx={{ minWidth: 0, overflow: 'hidden' }}>
              <Typography
                variant="body1"
                sx={{ fontStyle: 'italic', wordBreak: 'break-word' }}
              >
                For image captions and supplementary text
              </Typography>
            </Grid2>

            <Grid2
              size={{ sm: 12, md: 6 }}
              sx={{ minWidth: 0, overflow: 'hidden' }}
            >
              <Typography
                variant="overline"
                sx={{
                  backgroundColor: 'background.helper',
                  wordBreak: 'break-word',
                }}
              >
                Overline ({theme.typography.overline.fontSize})
              </Typography>
            </Grid2>
            <Grid2
              size={{ sm: 12, md: 6 }}
              sx={{ minWidth: 0, overflow: 'hidden' }}
            >
              <Typography
                variant="overline"
                sx={{ fontStyle: 'italic', wordBreak: 'break-word' }}
              >
                Overline text
              </Typography>
            </Grid2>
            <Grid2 size={{ sm: 12 }} sx={{ minWidth: 0, overflow: 'hidden' }}>
              <Typography
                variant="body1"
                sx={{ fontStyle: 'italic', wordBreak: 'break-word' }}
              >
                For labels and eyebrows above headings
              </Typography>
            </Grid2>

            <Grid2
              size={{ sm: 12, md: 6 }}
              sx={{ minWidth: 0, overflow: 'hidden' }}
            >
              <Typography
                variant="label"
                sx={{
                  backgroundColor: 'background.helper',
                  wordBreak: 'break-word',
                }}
              >
                Label ({theme.typography.label.fontSize})
              </Typography>
            </Grid2>
            <Grid2
              size={{ sm: 12, md: 6 }}
              sx={{ minWidth: 0, overflow: 'hidden' }}
            >
              <Typography
                variant="label"
                sx={{ fontStyle: 'italic', wordBreak: 'break-word' }}
              >
                Custom label variant
              </Typography>
            </Grid2>
            <Grid2 size={{ sm: 12 }} sx={{ minWidth: 0, overflow: 'hidden' }}>
              <Typography
                variant="body1"
                sx={{ fontStyle: 'italic', wordBreak: 'break-word' }}
              >
                Custom variant for prominent labels
              </Typography>
            </Grid2>

            <Grid2 size={{ sm: 12 }} sx={{ minWidth: 0, overflow: 'hidden' }}>
              <Typography
                variant="splashTitle"
                sx={{
                  backgroundColor: 'background.helper',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  wordBreak: 'break-word',
                }}
              >
                SplashTitle ({theme.typography.splashTitle.fontSize})
              </Typography>
            </Grid2>
            <Grid2 size={{ sm: 12 }} sx={{ minWidth: 0, overflow: 'hidden' }}>
              <Typography
                variant="splashTitle"
                sx={{
                  fontStyle: 'italic',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  wordBreak: 'break-word',
                }}
              >
                Custom splash variant
              </Typography>
            </Grid2>
            <Grid2 size={{ sm: 12 }} sx={{ minWidth: 0, overflow: 'hidden' }}>
              <Typography
                variant="body1"
                sx={{ fontStyle: 'italic', wordBreak: 'break-word' }}
              >
                Large uppercase titles for splash screens and hero sections
              </Typography>
            </Grid2>
          </Grid2>
        </Paper>

        {/* Theme Values Section */}
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h2" textAlign={'center'} sx={{ mb: 3 }}>
            Theme Configuration
          </Typography>

          <Grid2 container justifyContent={'center'} spacing={10}>
            <Grid2
              size={{ xs: 12, md: 6 }}
              display="flex"
              justifyContent="center"
            >
              <Box>
                <Typography variant="subtitle2" gutterBottom textAlign="center">
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
                <Typography variant="subtitle2" gutterBottom textAlign="center">
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
              <Typography variant="subtitle2" gutterBottom textAlign="center">
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
          <Typography variant="h2" sx={{ mb: 3 }}>
            Color Palette
          </Typography>

          <Grid2 container spacing={3}>
            {Object.entries(colors).map(([colorName, colorValues]) => (
              <Grid2 size={{ xs: 12, sm: 6, md: 4 }} key={colorName}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{ textTransform: 'capitalize', mb: 2 }}
                  >
                    {colorName}
                  </Typography>
                  <Stack spacing={1}>
                    {Object.entries(colorValues).map(([variant, value]) => {
                      const textColor = getContrastTextColor(value, theme)
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
                          <Typography variant="body1" sx={{ color: textColor }}>
                            {variant}
                          </Typography>
                          <Typography
                            variant="body1"
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
          <Typography variant="h2" sx={{ mb: 3 }}>
            MUI Components (Primary Theme Style)
          </Typography>

          {/* Buttons */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" gutterBottom>
              Buttons
            </Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
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
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Standard Action Buttons
              </Typography>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1.5}
                sx={{
                  width: { xs: '100%', sm: 'auto' },
                  alignItems: 'stretch',
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<EditIcon fontSize="small" />}
                  sx={{ textTransform: 'none', borderRadius: '10px' }}
                >
                  Edit
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<SaveIcon fontSize="small" />}
                  sx={{ textTransform: 'none', borderRadius: '10px' }}
                >
                  Save Changes
                </Button>
                <Button
                  variant="contained"
                  color="warning"
                  startIcon={<CloseIcon fontSize="small" />}
                  sx={{
                    textTransform: 'none',
                    borderRadius: '10px',
                    color: 'warning.contrastText',
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<DeleteIcon fontSize="small" />}
                  sx={{
                    textTransform: 'none',
                    borderRadius: '10px',
                    color: 'error.contrastText',
                  }}
                >
                  Delete
                </Button>
              </Stack>
            </Box>
          </Box>

          {/* Form Controls */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" gutterBottom>
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
            <Typography variant="subtitle1" gutterBottom>
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
            <Typography variant="subtitle1" gutterBottom>
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

          {/* Accordions */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" gutterBottom>
              Accordions
            </Typography>
            <Stack spacing={2}>
              <Accordion
                expanded={accordionExpanded === 'accordion1'}
                onChange={(event, isExpanded) =>
                  setAccordionExpanded(isExpanded ? 'accordion1' : false)
                }
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="accordion1-content"
                  id="accordion1-header"
                >
                  <Typography variant="subtitle1">Accordion Item 1</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2">
                    This is the content for the first accordion item. It expands
                    and collapses when clicked.
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion
                expanded={accordionExpanded === 'accordion2'}
                onChange={(event, isExpanded) =>
                  setAccordionExpanded(isExpanded ? 'accordion2' : false)
                }
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="accordion2-content"
                  id="accordion2-header"
                >
                  <Typography variant="subtitle1">Accordion Item 2</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2">
                    This is the content for the second accordion item. Multiple
                    items can be in a set, but typically only one expands at a
                    time.
                  </Typography>
                </AccordionDetails>
              </Accordion>

              <Accordion
                defaultExpanded
                sx={{
                  backgroundColor: 'navSplash.dark',
                  '&:before': {
                    display: 'none',
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="accordion3-content"
                  id="accordion3-header"
                >
                  <Typography variant="subtitle1">
                    Accordion Item 3 (App Theme)
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2">
                    This accordion uses the app theme with navSplash.dark
                    background and has the default border removed (similar to
                    poseActivityDetail).
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </Stack>
          </Box>

          {/* Feedback */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" gutterBottom>
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

            <Typography variant="subtitle2" sx={{ mt: 4, mb: 2 }}>
              Snackbars
            </Typography>
            <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
              <Button
                variant="contained"
                color="success"
                onClick={() => setShowSuccessSnackbar(true)}
              >
                Show Success Snackbar
              </Button>
              <Button
                variant="contained"
                color="info"
                onClick={() => setShowInfoSnackbar(true)}
              >
                Show Info Snackbar
              </Button>
              <Button
                variant="contained"
                color="warning"
                onClick={() => setShowWarningSnackbar(true)}
              >
                Show Warning Snackbar
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => setShowErrorSnackbar(true)}
              >
                Show Error Snackbar
              </Button>
            </Stack>
          </Box>

          {/* Layout Components */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" gutterBottom>
              Layout
            </Typography>
            <Stack spacing={2}>
              <Typography variant="h6">Stack</Typography>
              <Stack
                spacing={2}
                direction="row"
                sx={{ p: 2, border: '1px dashed', borderColor: 'grey.300' }}
              >
                <Box sx={{ p: 2, bgcolor: 'primary.light', color: 'white' }}>
                  Item 1
                </Box>
                <Box sx={{ p: 2, bgcolor: 'primary.light', color: 'white' }}>
                  Item 2
                </Box>
                <Box sx={{ p: 2, bgcolor: 'primary.light', color: 'white' }}>
                  Item 3
                </Box>
              </Stack>

              <Typography variant="h6">Box</Typography>
              <Box
                sx={{
                  p: 2,
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  textAlign: 'center',
                }}
              >
                Container Box with custom styling
              </Box>

              <Typography variant="h6">Divider</Typography>
              <Divider />

              <Typography variant="h6">Avatar</Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Avatar sx={{ bgcolor: theme.palette.primary.main }}>A</Avatar>
              </Box>
            </Stack>
          </Box>

          {/* Custom Button Styles from App */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" gutterBottom>
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

          {/* Help Drawer System */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" gutterBottom>
              Help Drawer System
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Reusable help pattern with HelpButton + HelpDrawer for contextual
              guidance.
            </Typography>

            <Stack spacing={3}>
              {/* Help Button Example */}
              <Box>
                <Typography variant="h6" gutterBottom>
                  Help Button
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ mb: 1, color: 'text.secondary' }}
                >
                  Green question mark icon that triggers help content
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                  <HelpButton onClick={() => setHelpOpen(true)} />
                  <Typography variant="caption">
                    Click to open help drawer
                  </Typography>
                </Stack>
              </Box>

              {/* Help Button with Navigation Pattern */}
              <Box>
                <Typography variant="h6" gutterBottom>
                  Navigation Header Pattern
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ mb: 1, color: 'text.secondary' }}
                >
                  Standard layout with back button + help button
                </Typography>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{
                    p: 2,
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Typography variant="h6">Page Title</Typography>
                  <HelpButton onClick={() => setHelpOpen(true)} />
                </Stack>
              </Box>

              {/* Features List */}
              <Box>
                <Typography variant="h6" gutterBottom>
                  Features
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <SearchIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Auto-detects content type"
                      secondary="Markdown file path or plain text"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <SearchIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Markdown rendering"
                      secondary="Supports headings, lists, bold, italic"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <SearchIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Bottom drawer design"
                      secondary="Mobile-friendly, scrollable content"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <SearchIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText
                      primary="Accessible"
                      secondary="Keyboard navigation and focus management"
                    />
                  </ListItem>
                </List>
              </Box>
            </Stack>
          </Box>
        </Paper>
      </Stack>

      {/* Snackbar Examples */}
      <Snackbar
        open={showSuccessSnackbar}
        autoHideDuration={6000}
        onClose={() => setShowSuccessSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setShowSuccessSnackbar(false)}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Success! This is a success snackbar message.
        </Alert>
      </Snackbar>

      <Snackbar
        open={showInfoSnackbar}
        autoHideDuration={6000}
        onClose={() => setShowInfoSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setShowInfoSnackbar(false)}
          severity="info"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Info! This is an informational snackbar message.
        </Alert>
      </Snackbar>

      <Snackbar
        open={showWarningSnackbar}
        autoHideDuration={6000}
        onClose={() => setShowWarningSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setShowWarningSnackbar(false)}
          severity="warning"
          variant="filled"
          sx={{ width: '100%', fontWeight: 'bold' }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => setShowWarningSnackbar(false)}
            >
              UNDO
            </Button>
          }
        >
          Warning! Action will be undone in 5 seconds...
        </Alert>
      </Snackbar>

      <Snackbar
        open={showErrorSnackbar}
        autoHideDuration={6000}
        onClose={() => setShowErrorSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setShowErrorSnackbar(false)}
          severity="error"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Error! Something went wrong with this snackbar message.
        </Alert>
      </Snackbar>

      {/* Help Drawer Instance */}
      <HelpDrawer
        open={helpOpen}
        onClose={() => setHelpOpen(false)}
        content={HELP_PATHS.styleGuide.typography}
      />
    </Container>
  )
}
