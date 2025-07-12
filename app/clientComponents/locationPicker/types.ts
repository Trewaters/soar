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
  timezone?: string
  postal_code?: string
}

export interface LocationPickerProps {
  value?: string
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

export interface PlaceDetails {
  place_id: string
  formatted_address: string
  address_components: google.maps.GeocoderAddressComponent[]
  geometry: {
    location: google.maps.LatLng
    viewport?: google.maps.LatLngBounds
  }
}
