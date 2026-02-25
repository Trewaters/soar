'use client'

import React, { useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  Stack,
  Button,
  Alert,
  Divider,
  Chip,
} from '@mui/material'
import { LocationPicker, LocationData } from './index'

/**
 * Demo component showing different ways to use the LocationPicker
 * This can be used for testing and as a reference for developers
 */
export default function LocationPickerDemo() {
  const [basicLocation, setBasicLocation] = useState('')
  const [advancedLocation, setAdvancedLocation] = useState('')
  const [advancedLocationData, setAdvancedLocationData] =
    useState<LocationData | null>(null)
  const [errorLocation, setErrorLocation] = useState('')

  const handleBasicLocationChange = (location: string) => {
    setBasicLocation(location)
  }

  const handleAdvancedLocationChange = (
    location: string,
    locationData?: LocationData
  ) => {
    setAdvancedLocation(location)
    setAdvancedLocationData(locationData || null)
  }

  const handleErrorLocationChange = (location: string) => {
    setErrorLocation(location)
  }

  const clearAll = () => {
    setBasicLocation('')
    setAdvancedLocation('')
    setAdvancedLocationData(null)
    setErrorLocation('')
  }

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Location Picker Component Demo
      </Typography>

      <Typography variant="body1" sx={{ mb: 3 }}>
        This demo shows different configurations of the LocationPicker component
        integrated with Google Maps API for location selection and geocoding.
      </Typography>

      <Stack spacing={4}>
        {/* Basic Usage */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Basic Usage
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Simple location picker with autocomplete and current location
          </Typography>

          <LocationPicker
            value={basicLocation}
            onChange={handleBasicLocationChange}
            placeholder="Search for any location..."
            label="Location"
            showCurrentLocation={true}
            helperText="Try searching for a city, address, or landmark"
          />

          {basicLocation && (
            <Alert severity="info" sx={{ mt: 2 }}>
              Selected: {basicLocation}
            </Alert>
          )}
        </Paper>

        {/* Advanced Usage with Location Data */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Advanced Usage with Location Data
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Captures detailed location information including coordinates
          </Typography>

          <LocationPicker
            value={advancedLocation}
            onChange={handleAdvancedLocationChange}
            placeholder="Enter your home city..."
            label="Home Location"
            showCurrentLocation={true}
            showMapButton={true}
            variant="outlined"
            helperText="We'll show you nearby yoga studios and events"
          />

          {advancedLocationData && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Location Details:
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
                {advancedLocationData.city && (
                  <Chip
                    label={`City: ${advancedLocationData.city}`}
                    size="small"
                  />
                )}
                {advancedLocationData.state && (
                  <Chip
                    label={`State: ${advancedLocationData.state}`}
                    size="small"
                  />
                )}
                {advancedLocationData.country && (
                  <Chip
                    label={`Country: ${advancedLocationData.country}`}
                    size="small"
                  />
                )}
              </Stack>
              {advancedLocationData.coordinates && (
                <Typography variant="body2" color="text.secondary">
                  Coordinates: {advancedLocationData.coordinates.lat.toFixed(4)}
                  , {advancedLocationData.coordinates.lng.toFixed(4)}
                </Typography>
              )}
            </Box>
          )}
        </Paper>

        {/* Error State Demo */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Error Handling Demo
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Shows how the component handles errors (simulated for demo)
          </Typography>

          <LocationPicker
            value={errorLocation}
            onChange={handleErrorLocationChange}
            placeholder="This field has an error state"
            label="Location with Error"
            error={true}
            helperText="This is an example error message"
            showCurrentLocation={false}
          />
        </Paper>

        {/* Disabled State Demo */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Disabled State
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Shows the component in a disabled state
          </Typography>

          <LocationPicker
            value="San Diego, CA, USA"
            placeholder="This field is disabled"
            label="Disabled Location"
            disabled={true}
            helperText="Location cannot be changed"
            showCurrentLocation={false}
          />
        </Paper>

        <Divider />

        {/* Actions */}
        <Stack direction="row" spacing={2} justifyContent="center">
          <Button variant="outlined" onClick={clearAll}>
            Clear All Fields
          </Button>
          <Button variant="contained" onClick={() => {}}>
            Log All Values
          </Button>
        </Stack>

        {/* Usage Instructions */}
        <Paper sx={{ p: 3, bgcolor: 'grey.50' }}>
          <Typography variant="h6" gutterBottom>
            Testing Instructions
          </Typography>
          <Stack spacing={1}>
            <Typography variant="body2">
              • Try searching for different types of locations (cities,
              addresses, landmarks)
            </Typography>
            <Typography variant="body2">
              • Test with international locations to see formatting differences
            </Typography>
            <Typography variant="body2">
              • Click the location icon to use your current location (requires
              permission)
            </Typography>
            <Typography variant="body2">
              • Notice how city/state/country chips appear for detailed results
            </Typography>
            <Typography variant="body2">
              • Check browser console for any API errors
            </Typography>
          </Stack>
        </Paper>
      </Stack>
    </Box>
  )
}
