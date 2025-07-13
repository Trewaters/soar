# LocationPicker Component Test Suite

This directory contains comprehensive unit and integration tests for the LocationPicker component and its integration with the UserDetails component.

## Test Files

### 1. `LocationPicker.spec.tsx`

**Comprehensive unit tests for the LocationPicker component**

#### Test Coverage:

- **Rendering Tests**: Component renders with various props and configurations
- **User Input & Autocomplete**: Tests input handling and Google Places API integration
- **Place Selection**: Tests location selection and data parsing
- **Current Location**: Tests geolocation functionality and error handling
- **Accessibility**: Keyboard navigation and ARIA compliance
- **Error Handling**: API failures and network issues
- **Props & Configuration**: Different variants and styling options

#### Key Test Scenarios:

- ✅ Renders with default and custom props
- ✅ Shows/hides current location button based on props
- ✅ Handles disabled and error states
- ✅ Fetches autocomplete predictions from Google Places API
- ✅ Parses location components correctly for US and international locations
- ✅ Handles geolocation success, permission denied, timeout, and unavailable
- ✅ Supports keyboard navigation
- ✅ Gracefully handles API errors
- ✅ Applies custom styles and variants

### 2. `UserDetails.locationPicker.spec.tsx`

**Integration tests for LocationPicker within UserDetails component**

#### Test Coverage:

- **Authentication**: Sign-in flow and authenticated state rendering
- **LocationPicker Integration**: Component integration and data flow
- **Form Submission**: Location updates and API calls
- **User Context**: State management and synchronization
- **Error Handling**: Network errors and form validation
- **Share Functionality**: Web Share API and clipboard fallback
- **Responsive Design**: Mobile viewport handling

#### Key Test Scenarios:

- ✅ Shows sign-in button when not authenticated
- ✅ Renders LocationPicker when authenticated
- ✅ Updates user context when location changes
- ✅ Submits form with updated location data
- ✅ Handles form submission errors gracefully
- ✅ Syncs email from session to user context
- ✅ Supports Web Share API with clipboard fallback
- ✅ Renders activity streaks component

### 3. `LocationPickerDemo.spec.tsx`

**Tests for the demo component showcasing LocationPicker features**

#### Test Coverage:

- **Demo Sections**: All demo configurations render correctly
- **Interactive Elements**: Button functionality and user interactions
- **Documentation**: Testing instructions and help text
- **Accessibility**: Heading structure and semantic markup

#### Key Test Scenarios:

- ✅ Renders demo page with proper title and sections
- ✅ Shows multiple LocationPicker instances
- ✅ Clear all and log values functionality works
- ✅ Displays comprehensive testing instructions
- ✅ Proper accessibility with heading hierarchy

### 4. `types.spec.ts`

**Type safety and interface validation tests**

#### Test Coverage:

- **LocationData Interface**: Valid and minimal objects
- **LocationPickerProps Interface**: All prop combinations
- **PlaceDetails Interface**: Google Maps API compatibility
- **Edge Cases**: Special characters, long names, negative coordinates

#### Key Test Scenarios:

- ✅ Validates LocationData structure with all optional fields
- ✅ Handles international locations without state/province
- ✅ Enforces LocationPickerProps type constraints
- ✅ Tests onChange callback functionality
- ✅ Validates PlaceDetails Google Maps integration
- ✅ Handles edge cases (empty/negative coordinates, special characters)

## Running the Tests

### Run All LocationPicker Tests

```bash
npm test -- __test__/app/clientComponents/locationPicker/
```

### Run Specific Test Files

```bash
# Unit tests only
npm test -- LocationPicker.spec.tsx

# Integration tests only
npm test -- UserDetails.locationPicker.spec.tsx

# Demo tests only
npm test -- LocationPickerDemo.spec.tsx

# Type tests only
npm test -- types.spec.ts
```

### Run with Coverage

```bash
npm test -- --coverage __test__/app/clientComponents/locationPicker/
```

### Watch Mode for Development

```bash
npm test -- --watch __test__/app/clientComponents/locationPicker/
```

## Test Setup and Mocking

### Google Maps API Mocking

The tests mock the Google Maps API to avoid external dependencies:

- `AutocompleteService` for place predictions
- `PlacesService` for place details
- `Geocoder` for reverse geocoding
- Proper status handling for all API responses

### Geolocation API Mocking

Browser geolocation is mocked to test:

- Successful location retrieval
- Permission denied scenarios
- Position unavailable errors
- Timeout handling
- Unsupported browser scenarios

### Next.js Dependencies Mocking

All Next.js specific dependencies are mocked:

- `next-auth/react` for authentication
- `next/navigation` for routing
- `next/image` for image components
- User context providers

## Best Practices Followed

### 1. **Comprehensive Coverage**

- Unit tests for individual component behavior
- Integration tests for component interactions
- Type safety tests for TypeScript interfaces
- Edge case handling and error scenarios

### 2. **Realistic Mocking**

- Google Maps API responses mirror real API behavior
- Error conditions match actual API error states
- Geolocation scenarios reflect browser behavior
- Network errors simulate real-world failures

### 3. **Accessibility Testing**

- Keyboard navigation support
- ARIA label validation
- Screen reader compatibility
- Focus management

### 4. **Performance Considerations**

- Tests use proper cleanup to prevent memory leaks
- Mocks are reset between tests
- Async operations use proper waiting strategies
- Background processes are properly handled

### 5. **Maintainability**

- Clear test descriptions and organization
- Reusable mock utilities
- Consistent naming conventions
- Well-documented test scenarios

## Test Data and Fixtures

### Sample Location Data

```typescript
const sampleLocationData = {
  formatted_address: 'San Diego, CA, USA',
  city: 'San Diego',
  state: 'California',
  country: 'United States',
  coordinates: { lat: 32.7157, lng: -117.1611 },
  place_id: 'test-place-id',
}
```

### International Location Example

```typescript
const internationalLocation = {
  formatted_address: 'Tokyo, Japan',
  city: 'Tokyo',
  country: 'Japan',
  coordinates: { lat: 35.6762, lng: 139.6503 },
}
```

## Debugging Test Failures

### Common Issues and Solutions

1. **Google Maps API Mock Issues**

   - Ensure `window.google` is properly set up
   - Check that API key environment variable is mocked
   - Verify callback functions are called with correct parameters

2. **Async Test Failures**

   - Use `waitFor` for async operations
   - Ensure proper cleanup in `afterEach`
   - Check that promises are properly resolved/rejected

3. **Component Rendering Issues**

   - Verify all required providers are wrapped around components
   - Check that mocks are set up before component render
   - Ensure proper props are passed to components

4. **Type Test Failures**
   - Confirm TypeScript interfaces match expected structure
   - Check that optional fields are properly handled
   - Verify generic types are correctly specified

## Contributing to Tests

When adding new features to LocationPicker:

1. **Add Unit Tests** for new component behavior
2. **Update Integration Tests** if UserDetails integration changes
3. **Add Type Tests** for new interfaces or props
4. **Update Demo Tests** if demo component changes
5. **Document New Test Scenarios** in this README

### Test Naming Convention

- `describe()` blocks use component/feature names
- `it()` blocks use "should" statements describing expected behavior
- Test files use `.spec.tsx` or `.spec.ts` extensions
- Mock functions use `mock` prefix (e.g., `mockGetPlacePredictions`)

### Code Coverage Goals

- **Statements**: >95%
- **Branches**: >90%
- **Functions**: >95%
- **Lines**: >95%

The test suite aims for comprehensive coverage while maintaining readability and maintainability.
