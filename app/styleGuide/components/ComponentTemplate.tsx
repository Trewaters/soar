'use client'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Paper,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material'

/**
 * ComponentTemplate - Example of how to extract individual components
 * from the style guide for reuse in your application.
 *
 * This demonstrates the pattern used throughout the app with:
 * - Dynamic theme values (no hardcoded colors)
 * - Primary theme styling
 * - Consistent component patterns
 */
export default function ComponentTemplate() {
  const theme = useTheme()

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h2" component="h2" sx={{ mb: 3 }}>
        Component Template Example
      </Typography>

      <Stack spacing={3}>
        {/* App-Specific Button Style */}
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

        {/* App-Specific TextField Style */}
        <TextField
          label="Form Field Style"
          placeholder="Enter text..."
          sx={{
            '& .MuiOutlinedInput-notchedOutline': {
              borderRadius: '12px',
              borderColor: 'primary.main',
              boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.25)',
            },
            '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'primary.light',
            },
          }}
        />

        {/* Example Card with Theme Colors */}
        <Card>
          <CardHeader
            title="Component Card"
            sx={{
              backgroundColor: 'primary.main',
              color: 'primary.contrastText',
            }}
          />
          <CardContent>
            <Typography variant="body1" sx={{ mb: 2 }}>
              This card uses theme colors dynamically:
            </Typography>
            <Stack spacing={1}>
              <Typography variant="body2">
                Primary: {theme.palette.primary.main}
              </Typography>
              <Typography variant="body2">
                Secondary: {theme.palette.secondary.main}
              </Typography>
              <Typography variant="body2">
                Font Family: {theme.typography.fontFamily}
              </Typography>
            </Stack>
          </CardContent>
        </Card>

        <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
          This template shows how components can be extracted from the style
          guide and reused throughout your application while maintaining
          consistency with your design system.
        </Typography>
      </Stack>
    </Paper>
  )
}
