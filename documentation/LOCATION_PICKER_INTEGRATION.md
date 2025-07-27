# Location Picker Integration Documentation

## Overview

This document describes the integration of Google Maps API with the "My Location" FormField in the Uvuyoga app. Users can now search for and select their location using Google Places Autocomplete, with support for international locations.

## Features

### ✅ Implemented

- **Google Places Autocomplete**: Real-time location search with suggestions
- **Current Location Detection**: Get user's current location using browser geolocation
- **International Support**: Handles locations without traditional city/state structure
- **Smart Address Formatting**: Displays locations as "City, State, Country" or "City, Country"
- **Visual Feedback**: Shows selected location details with chips for city, state, and country
- **Error Handling**: Graceful handling of API errors and location permissions
- **Loading States**: Visual indicators during location fetching

### 🔄 Planned Enhancements

- **Interactive Map**: Full map integration for visual location selection
- **Location History**: Remember frequently used locations
- **Nearby Yoga Studios**: Show yoga studios near selected location

## Implementation Details

### Components Created

1. **LocationPicker.tsx**: Main component for location selection

   - Google Places Autocomplete integration
   - Current location detection
   - International location support
   - Real-time search suggestions

2. **types.ts**: TypeScript definitions for location data

   - LocationData interface with city, state, country, coordinates
   - PlaceDetails interface for Google Places API responses

3. **index.ts**: Export barrel for easy imports

### Integration Points

- **UserDetails.tsx**: Replaced standard TextField with LocationPicker
- **UserContext.tsx**: Uses existing location field (no changes needed)
- **Prisma Schema**: Uses existing location String field

### Location Data Structure

```typescript
interface LocationData {
  formatted_address: string // "San Diego, CA, USA"
  city?: string // "San Diego"
  state?: string // "California" or "CA"
  country?: string // "United States"
  coordinates?: {
    lat: number
    lng: number
  }
  place_id?: string
}
```

### International Location Handling

The component intelligently handles different location formats:

- **US/Canada**: "City, State, Country" format
- **International**: "City, Country" format (when no state/province)
- **Fallback**: Uses Google's formatted_address when components are unclear

Examples:

- "San Diego, California, United States"
- "Tokyo, Japan"
- "London, England, United Kingdom"
- "Sydney, New South Wales, Australia"

## Setup Instructions

### 1. Google Maps API Configuration

1. **Enable APIs in Google Cloud Console**:

   - Places API
   - Geocoding API
   - Maps JavaScript API (for future map integration)

2. **Set Environment Variable**:
   Add to your `.env.local` file:

   ```
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
   ```

3. **API Key Restrictions** (Recommended):
   - Restrict to your domain(s)
   - Enable only necessary APIs
   - Set usage quotas to prevent unexpected charges

### 2. Dependencies

The following packages are already included in the project:

- `@react-google-maps/api`: ^2.20.7
- `@mui/material`: For UI components
- `@mui/icons-material`: For location icons

### 3. Testing the Integration

1. **Start the development server**:

   ```bash
   npm run dev
   ```

2. **Navigate to Profile Page**:

   - Sign in to your account
   - Go to the profile page
   - Find the "My Location" field

3. **Test Location Features**:
   - Type in location search (try different formats)
   - Click the location icon to use current location
   - Verify location data is saved to user profile

## Usage Examples

### Basic Usage

```tsx
import { LocationPicker } from '@app/clientComponents/locationPicker'
;<LocationPicker
  value={userData?.location ?? ''}
  onChange={handleLocationChange}
  placeholder="Search for your city, state, or country"
  showCurrentLocation={true}
/>
```

### Advanced Usage with Custom Styling

```tsx
<LocationPicker
  value={location}
  onChange={(location, locationData) => {
    setLocation(location)
    setLocationDetails(locationData)
  }}
  placeholder="Where are you located?"
  variant="outlined"
  fullWidth
  showCurrentLocation={true}
  showMapButton={false}
  helperText="This helps us connect you with local yoga practitioners"
  sx={{
    '& .MuiInputBase-root': {
      borderRadius: '12px',
    },
  }}
/>
```

## API Usage & Costs

### Google Places API Pricing (as of 2024)

- **Places Autocomplete**: $2.83 per 1,000 requests
- **Place Details**: $17 per 1,000 requests
- **Geocoding**: $5 per 1,000 requests

### Optimization Strategies

1. **Debounced Requests**: Autocomplete waits for user to stop typing
2. **Result Caching**: Similar requests use cached results
3. **Selective Field Requests**: Only request needed place details
4. **Session Tokens**: Use session tokens for autocomplete + details combinations

## Error Handling

### Common Issues & Solutions

1. **API Key Invalid**:

   - Check environment variable name
   - Verify API key in Google Cloud Console
   - Ensure APIs are enabled

2. **Location Permission Denied**:

   - Graceful fallback to manual search
   - Clear error messages to user
   - Option to try current location again

3. **Network Issues**:
   - Loading states during API calls
   - Retry mechanisms for failed requests
   - Offline detection and messaging

## Future Enhancements

### Phase 2: Interactive Map

- Full Google Maps integration
- Click-to-select location on map
- Visual markers for selected location
- Map-based location validation

### Phase 3: Enhanced Location Features

- **Yoga Studio Integration**: Show nearby studios
- **Location Sharing**: Privacy controls for location visibility
- **Location History**: Remember frequently used locations
- **Distance Calculations**: Find yoga practitioners near you

### Phase 4: Advanced Features

- **Timezone Detection**: Automatic timezone from location
- **Weather Integration**: Show weather for yoga planning
- **Event Proximity**: Find yoga events near your location

## Testing Checklist

- [ ] Location search with autocomplete works
- [ ] Current location detection works
- [ ] International locations display correctly
- [ ] Location data saves to user profile
- [ ] Error handling works for invalid API key
- [ ] Error handling works for location permission denied
- [ ] Mobile responsive design
- [ ] Accessibility features (keyboard navigation, screen readers)
- [ ] Loading states display correctly
- [ ] Location chips display for selected location

## Support & Troubleshooting

### Common Questions

**Q: Why isn't the location picker showing suggestions?**
A: Check that your Google Maps API key is set correctly and that the Places API is enabled.

**Q: Current location isn't working**
A: The browser may have blocked location access. Check browser settings and ensure HTTPS is being used.

**Q: International locations aren't formatting correctly**
A: This is expected behavior. Not all countries use state/province structures. The component handles this automatically.

### Need Help?

- Check browser console for API errors
- Verify Google Cloud Console API usage
- Test with different location formats
- Contact development team for persistent issues
