'use client'

import React, { useState, useEffect, useRef } from 'react'
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Chip,
  Stack,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
} from '@mui/material'
import {
  LocationOn as LocationOnIcon,
  MyLocation as MyLocationIcon,
  Close as CloseIcon,
  Public as PublicIcon,
} from '@mui/icons-material'
import { useJsApiLoader } from '@react-google-maps/api'

// Google Maps libraries to load
const libraries: ('places' | 'geometry')[] = ['places']

export interface LocationData {
  formatted_address: string
  city?: string
  state?: string
  country?: string
  coordinates?: {
    lat: number
    lng: number
  }
  place_id?: string
}

export interface LocationPickerProps {
  value?: string
  // eslint-disable-next-line no-unused-vars
  onChange?: (location: string, locationData?: LocationData) => void
  placeholder?: string
  variant?: 'outlined' | 'filled' | 'standard'
  fullWidth?: boolean
  disabled?: boolean
  error?: boolean
  helperText?: string
  label?: string
  sx?: object
  showCurrentLocation?: boolean
  showMapButton?: boolean
}

export default function LocationPicker({
  value = '',
  onChange,
  placeholder = 'Enter your location',
  variant = 'outlined',
  fullWidth = true,
  disabled = false,
  error = false,
  helperText,
  label = 'Location',
  sx,
  showCurrentLocation = true,
  showMapButton = false,
}: LocationPickerProps) {
  const [inputValue, setInputValue] = useState(value)
  const [predictions, setPredictions] = useState<
    google.maps.places.AutocompletePrediction[]
  >([])
  const [showPredictions, setShowPredictions] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(
    null
  )
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [showMapDialog, setShowMapDialog] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const autocompleteService =
    useRef<google.maps.places.AutocompleteService | null>(null)
  const placesService = useRef<google.maps.places.PlacesService | null>(null)
  const geocoder = useRef<google.maps.Geocoder | null>(null)

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries,
  })

  // Initialize Google Maps services when loaded
  useEffect(() => {
    if (isLoaded && window.google) {
      autocompleteService.current =
        new window.google.maps.places.AutocompleteService()
      geocoder.current = new window.google.maps.Geocoder()

      // Create a dummy div for PlacesService
      const dummyDiv = document.createElement('div')
      placesService.current = new window.google.maps.places.PlacesService(
        dummyDiv
      )
    }
  }, [isLoaded])

  // Update input value when prop changes
  useEffect(() => {
    setInputValue(value)
  }, [value])

  // Handle input change and get predictions
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value
    setInputValue(newValue)
    setLocationError(null)

    if (newValue.length > 2 && autocompleteService.current) {
      const request = {
        input: newValue,
        types: ['(cities)'], // Focus on cities, but also includes localities
      }

      autocompleteService.current.getPlacePredictions(
        request,
        (predictions, status) => {
          if (
            status === window.google.maps.places.PlacesServiceStatus.OK &&
            predictions
          ) {
            setPredictions(predictions)
            setShowPredictions(true)
          } else {
            setPredictions([])
            setShowPredictions(false)
          }
        }
      )
    } else {
      setPredictions([])
      setShowPredictions(false)
    }
  }

  // Parse location components from Google Places result
  const parseLocationComponents = (
    place: google.maps.places.PlaceResult
  ): LocationData => {
    const components = place.address_components || []

    let city = ''
    let state = ''
    let country = ''

    components.forEach((component) => {
      const types = component.types

      if (types.includes('locality')) {
        city = component.long_name
      } else if (types.includes('administrative_area_level_1')) {
        state = component.long_name
      } else if (types.includes('country')) {
        country = component.long_name
      }
      // For international locations that might not have states
      else if (types.includes('administrative_area_level_2') && !city) {
        city = component.long_name
      }
    })

    // Format the display address based on what we have
    let displayAddress = ''
    if (city && state && country) {
      displayAddress = `${city}, ${state}, ${country}`
    } else if (city && country) {
      displayAddress = `${city}, ${country}`
    } else if (state && country) {
      displayAddress = `${state}, ${country}`
    } else {
      displayAddress = place.formatted_address || ''
    }

    return {
      formatted_address: displayAddress,
      city,
      state,
      country,
      coordinates: place.geometry?.location
        ? {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          }
        : undefined,
      place_id: place.place_id,
    }
  }

  // Handle prediction selection
  const handlePredictionSelect = (
    prediction: google.maps.places.AutocompletePrediction
  ) => {
    if (!placesService.current) return

    const request = {
      placeId: prediction.place_id,
      fields: [
        'formatted_address',
        'address_components',
        'geometry',
        'place_id',
      ],
    }

    placesService.current.getDetails(request, (place, status) => {
      if (
        status === window.google.maps.places.PlacesServiceStatus.OK &&
        place
      ) {
        const locationData = parseLocationComponents(place)
        setSelectedLocation(locationData)
        setInputValue(locationData.formatted_address)
        setShowPredictions(false)

        if (onChange) {
          onChange(locationData.formatted_address, locationData)
        }
      }
    })
  }

  // Get current location
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser.')
      return
    }

    setIsLoadingLocation(true)
    setLocationError(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (geocoder.current) {
          const latLng = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }

          geocoder.current.geocode({ location: latLng }, (results, status) => {
            setIsLoadingLocation(false)

            if (status === 'OK' && results && results[0]) {
              const locationData = parseLocationComponents(results[0])
              setSelectedLocation(locationData)
              setInputValue(locationData.formatted_address)

              if (onChange) {
                onChange(locationData.formatted_address, locationData)
              }
            } else {
              setLocationError('Unable to get your location address.')
            }
          })
        }
      },
      (error) => {
        setIsLoadingLocation(false)
        let errorMessage = 'Unable to get your location.'

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location not available'
            break
          case error.TIMEOUT:
            errorMessage = 'Location request timed out'
            break
        }

        setLocationError(errorMessage)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    )
  }

  if (loadError) {
    return (
      <Alert severity="error">
        Error loading Google Maps. Please check your API key and network
        connection.
      </Alert>
    )
  }

  if (!isLoaded) {
    return (
      <Box display="flex" alignItems="center" gap={1}>
        <CircularProgress size={20} />
        <Typography>Loading location services...</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ position: 'relative', ...sx }}>
      <TextField
        ref={inputRef}
        label={label}
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        variant={variant}
        fullWidth={fullWidth}
        disabled={disabled}
        error={error || !!locationError}
        helperText={locationError || helperText}
        InputProps={{
          endAdornment: (
            <Stack direction="row" spacing={1}>
              {showCurrentLocation && (
                <IconButton
                  onClick={handleGetCurrentLocation}
                  disabled={isLoadingLocation || !isLoaded}
                  size="small"
                  title="Use current location"
                  aria-label="Get current location"
                  color="primary"
                >
                  {isLoadingLocation ? (
                    <CircularProgress size={16} />
                  ) : (
                    <MyLocationIcon />
                  )}
                </IconButton>
              )}
              {showMapButton && (
                <IconButton
                  onClick={() => setShowMapDialog(true)}
                  size="small"
                  title="Open map"
                  color="primary"
                >
                  <PublicIcon />
                </IconButton>
              )}
            </Stack>
          ),
        }}
        onFocus={() => {
          if (predictions.length > 0) {
            setShowPredictions(true)
          }
        }}
        onBlur={() => {
          setShowPredictions(false)
        }}
      />

      {/* Location Predictions */}
      {showPredictions && predictions.length > 0 && (
        <Paper
          elevation={3}
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 1000,
            maxHeight: 300,
            overflow: 'auto',
            mt: 1,
          }}
        >
          <List dense>
            {predictions.map((prediction) => (
              <ListItem key={prediction.place_id} disablePadding>
                <ListItemButton
                  onMouseDown={(e) => {
                    // Prevent blur event from firing
                    e.preventDefault()
                    handlePredictionSelect(prediction)
                  }}
                  sx={{ py: 1 }}
                >
                  <LocationOnIcon sx={{ mr: 2, color: 'text.secondary' }} />
                  <ListItemText
                    primary={
                      prediction.structured_formatting?.main_text ||
                      prediction.description
                    }
                    secondary={
                      prediction.structured_formatting?.secondary_text || ''
                    }
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {/* Selected Location Info */}
      {selectedLocation && (
        <Box sx={{ mt: 1 }}>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {selectedLocation.city && (
              <Chip
                label={`City: ${selectedLocation.city}`}
                size="small"
                variant="outlined"
              />
            )}
            {selectedLocation.state && (
              <Chip
                label={`State: ${selectedLocation.state}`}
                size="small"
                variant="outlined"
              />
            )}
            {selectedLocation.country && (
              <Chip
                label={`Country: ${selectedLocation.country}`}
                size="small"
                variant="outlined"
              />
            )}
          </Stack>
        </Box>
      )}

      {/* Map Dialog (optional) */}
      <Dialog
        open={showMapDialog}
        onClose={() => setShowMapDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Select Location on Map
          <IconButton
            onClick={() => setShowMapDialog(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Map integration coming soon! For now, please use the search field
            above.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowMapDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
