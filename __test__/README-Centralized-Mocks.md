# Centralized Test Mocks

## Overview

Common service mocks have been moved to `jest.setup.ts` to reduce duplication across test files. These mocks provide default implementations that work for most test cases, while remaining fully overrideable for test-specific scenarios.

## Available Centralized Mocks

### Service Mocks

The following services are globally mocked with default implementations:

1. **`@lib/poseService`** - Asana pose CRUD operations

   - `createAsana()` - Creates test pose
   - `updateAsana()` - Updates test pose
   - `deleteAsana()` - Deletes pose successfully
   - `getAsanaById()` - Returns test pose

2. **`@lib/imageService`** - Pose image management

   - `getUserPoseImages()` - Returns empty image array
   - `uploadPoseImage()` - Returns test image data
   - `deletePoseImage()` - Deletes image successfully

3. **`@lib/asanaActivityClientService`** - Pose activity tracking

   - `checkActivityExists()` - Returns false by default
   - `createActivity()` - Creates test activity
   - `updateActivity()` - Updates activity to completed

4. **`@lib/seriesService`** - Series CRUD operations

   - `createSeries()` - Creates test series
   - `updateSeries()` - Updates test series
   - `deleteSeries()` - Deletes series successfully
   - `getSeriesById()` - Returns test series

5. **`@app/lib/alphaUsers`** - Feature flag control
   - `isAlphaUser()` - Returns false by default
   - `alphaUsers` - Empty array

### Navigation Mocks

These are also globally available:

- **`next-auth/react`** - Authentication

  - `useSession()` - Returns unauthenticated by default
  - `SessionProvider` - Pass-through component
  - `signIn()` / `signOut()` - Jest functions

- **`next/navigation`** - Routing
  - `useRouter()` - Returns mock router with push/replace/prefetch
  - `usePathname()` - Returns '/' by default
  - `useSearchParams()` - Returns empty URLSearchParams

## Using Centralized Mocks

### Basic Usage (No Override Needed)

If the default mock behavior works for your test, you don't need to do anything! Just remove the `jest.mock()` call from your test file:

```typescript
// ❌ BEFORE: Duplicated mock in test file
jest.mock('@lib/poseService')

describe('MyComponent', () => {
  it('should render', () => {
    // Test code...
  })
})

// ✅ AFTER: No mock needed - uses centralized mock
describe('MyComponent', () => {
  it('should render', () => {
    // Test code...
  })
})
```

### Overriding Mock Behavior in Tests

When you need test-specific behavior, override the mock in `beforeEach` or individual tests:

```typescript
describe('CreateAsanaWithImages', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    // Override centralized mock with test-specific behavior
    const poseService = require('@lib/poseService')
    poseService.createAsana.mockResolvedValue({
      id: 'my-specific-pose-id',
      sort_english_name: 'My Custom Pose Name',
      category: 'Advanced',
    })
  })

  it('should create pose with custom data', async () => {
    // Your test will use the overridden mock
  })
})
```

### Overriding for a Single Test

```typescript
it('should handle pose creation failure', async () => {
  // Override just for this test
  const poseService = require('@lib/poseService')
  poseService.createAsana.mockRejectedValue(
    new Error('Database connection failed')
  )

  // Test error handling...
})
```

### Checking Mock Calls

```typescript
it('should call createAsana with correct data', async () => {
  const poseService = require('@lib/poseService')

  // Trigger the action
  await userEvent.click(screen.getByRole('button', { name: /create/i }))

  // Verify the mock was called
  expect(poseService.createAsana).toHaveBeenCalledTimes(1)
  expect(poseService.createAsana).toHaveBeenCalledWith(
    expect.objectContaining({
      sort_english_name: 'Warrior I',
      difficulty: 'Beginner',
    })
  )
})
```

### Resetting Mocks Between Tests

The centralized mocks persist across tests, so always use `jest.clearAllMocks()` in `beforeEach`:

```typescript
describe('MyTestSuite', () => {
  beforeEach(() => {
    jest.clearAllMocks() // ✅ Resets all mock call counts and implementations
  })
})
```

## Migration Guide

### Step 1: Remove Redundant Mock Declarations

Remove top-level `jest.mock()` calls for centralized services:

```typescript
// ❌ Remove these lines
jest.mock('@lib/poseService')
jest.mock('@lib/imageService')
jest.mock('@lib/asanaActivityClientService')
jest.mock('@lib/seriesService')
jest.mock('@app/lib/alphaUsers')
```

### Step 2: Keep Test-Specific Overrides

Keep any `beforeEach` or test-specific mock overrides:

```typescript
// ✅ Keep these - they override the centralized mock
beforeEach(() => {
  const poseService = require('@lib/poseService')
  poseService.createAsana.mockResolvedValue({
    id: 'specific-test-id',
  })
})
```

### Step 3: Verify Tests Still Pass

Run your test suite to ensure the centralized mocks work:

```bash
npm test path/to/your/test.spec.tsx
```

## Advanced Patterns

### Conditional Mock Behavior

```typescript
beforeEach(() => {
  const poseService = require('@lib/poseService')

  // Mock different behavior based on input
  poseService.createAsana.mockImplementation((data) => {
    if (data.difficulty === 'Advanced') {
      return Promise.reject(new Error('User not authorized'))
    }
    return Promise.resolve({ id: 'test-id', ...data })
  })
})
```

### Spying on Centralized Mocks

```typescript
it('should track mock calls', () => {
  const poseService = require('@lib/poseService')

  // The centralized mock is already a jest.fn()
  // So you can spy on it directly
  expect(poseService.createAsana).not.toHaveBeenCalled()

  // Trigger action...

  expect(poseService.createAsana).toHaveBeenCalledTimes(1)
})
```

### Accessing Global Mock Functions

For next-auth and next/navigation, use the global references:

```typescript
beforeEach(() => {
  // Override useSession via global reference
  const mockUseSession = (globalThis as any).mockUseSession
  mockUseSession.mockReturnValue({
    data: { user: { email: 'test@example.com' } },
    status: 'authenticated',
  })

  // Override useRouter via global reference
  const mockUseRouter = (globalThis as any).mockUseRouter
  mockUseRouter.mockReturnValue({
    push: jest.fn(),
    replace: jest.fn(),
  })
})
```

## Benefits of Centralized Mocks

1. **Reduced Duplication**: No need to repeat `jest.mock()` calls in every test file
2. **Consistency**: All tests use the same default mock implementations
3. **Maintainability**: Update mock behavior in one place instead of many files
4. **Flexibility**: Still fully overrideable for test-specific scenarios
5. **Cleaner Test Files**: Less boilerplate, more focus on actual test logic

## Troubleshooting

### Issue: Mock not working as expected

**Solution**: Ensure you're using `require()` to get the mocked module:

```typescript
// ✅ Correct
const poseService = require('@lib/poseService')
poseService.createAsana.mockResolvedValue(...)

// ❌ Incorrect - creates a new import, not the mock
import * as poseService from '@lib/poseService'
```

### Issue: Mock changes persist between tests

**Solution**: Always call `jest.clearAllMocks()` in `beforeEach`:

```typescript
beforeEach(() => {
  jest.clearAllMocks() // Clears call history and resets to default implementation
})
```

### Issue: Type errors with require()

**Solution**: Use type assertion or import types separately:

```typescript
import type { PoseService } from '@lib/poseService'

const poseService = require('@lib/poseService') as jest.Mocked<
  typeof PoseService
>
```

## Examples

See these test files for examples of using centralized mocks:

- `__test__/app/asanaPoses/createAsana/CreateAsanaWithImages.spec.tsx`
- `__test__/app/asanaPoses/ViewAsanaPose.spec.tsx`
- `__test__/app/asanaPoses/EditAsanaPose.spec.tsx`

## Contributing

When adding new commonly-used service mocks to `jest.setup.ts`:

1. Add the mock with sensible default implementations
2. Document it in this README
3. Update existing test files to remove redundant mocks
4. Verify all tests still pass
