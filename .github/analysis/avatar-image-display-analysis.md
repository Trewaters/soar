# Avatar Image Display Analysis - EditSequence Component

## Issue Summary

Test images with valid `image` field values are not displaying in the Avatar component in the EditSequence view, despite the data being correctly populated.

## Debug Data Findings

From console logging during tests:

```javascript
Series data sample: {
  seriesName: 'Warmup',
  image: '/img/1.png',     // ✅ Image URL exists
  imageType: 'string',      // ✅ Correct type
  hasImage: true            // ✅ Truthy value
}
```

**Conclusion**: The data is correct. The issue is not with data population.

## Current Implementation

```tsx
<Avatar src={s.image} alt={s.seriesName}>
  {!s.image && <SelfImprovementIcon />}
</Avatar>
```

## Root Cause

**MUI Avatar Behavior**: When the `src` prop is provided to the Avatar component, MUI will:

1. Attempt to load the image from the `src` URL
2. **NOT render the children** (the icon fallback) even if the image fails to load
3. Show an empty/broken avatar if the image URL is invalid or unreachable

The fallback logic `{!s.image && <SelfImprovementIcon />}` only works when `src` is **not provided at all** (undefined, null, or empty string).

### The Problem

Test image paths like `/img/1.png` are:

- ✅ Valid strings (passes `!s.image` check)
- ❌ Invalid URLs (file doesn't exist in the public directory)
- Result: MUI tries to load `/img/1.png`, fails, shows empty avatar

The icon fallback never displays because:

- `s.image` = `"/img/1.png"` (truthy)
- `!s.image` = `false`
- Icon is not rendered

## Solutions

### Solution 1: Use MUI's `imgProps.onError` (Recommended)

Handle image load failures with MUI's built-in error handling:

```tsx
const [imageError, setImageError] = useState<Record<number, boolean>>({})

// In the map:
<Avatar
  src={!imageError[idx] ? s.image : undefined}
  alt={s.seriesName}
  imgProps={{
    onError: () => {
      setImageError(prev => ({ ...prev, [idx]: true }))
    }
  }}
>
  {(!s.image || imageError[idx]) && <SelfImprovementIcon />}
</Avatar>
```

**Pros:**

- Properly handles image load failures
- Maintains MUI best practices
- Shows icon when image fails to load

**Cons:**

- Requires state management
- Slightly more complex

### Solution 2: Conditional `src` prop

Only provide `src` when image is valid:

```tsx
<Avatar
  src={s.image || undefined} // Convert empty string to undefined
  alt={s.seriesName}
>
  {!s.image && <SelfImprovementIcon />}
</Avatar>
```

**Pros:**

- Simple change
- Works for empty strings

**Cons:**

- Doesn't handle image load failures
- Still shows empty avatar if URL is invalid

### Solution 3: Remove `src` when falsy

Most robust check:

```tsx
<Avatar {...(s.image && { src: s.image })} alt={s.seriesName}>
  {!s.image && <SelfImprovementIcon />}
</Avatar>
```

**Pros:**

- Only adds `src` prop when image exists
- Clean conditional spreading

**Cons:**

- Still doesn't handle load failures

## Recommended Fix

Implement **Solution 1** for production code (handles failures properly):

```tsx
export default function EditSequence({
  sequence,
  onChange,
  children,
}: EditSequenceProps) {
  // ... existing state ...

  // Track image load errors by index
  const [seriesImageErrors, setSeriesImageErrors] = useState<Record<number, boolean>>({})

  // ... rest of component ...

  return (
    {/* ... */}
    {model.sequencesSeries.map((s, idx) => {
      const hasImageError = seriesImageErrors[idx]
      const shouldShowImage = s.image && !hasImageError

      return (
        <ListItem key={`${s.seriesName}-${idx}`}>
          <ListItemAvatar>
            <Avatar
              src={shouldShowImage ? s.image : undefined}
              alt={s.seriesName}
              imgProps={{
                onError: () => {
                  setSeriesImageErrors(prev => ({ ...prev, [idx]: true }))
                }
              }}
            >
              {!shouldShowImage && <SelfImprovementIcon />}
            </Avatar>
          </ListItemAvatar>
          {/* ... */}
        </ListItem>
      )
    })}
    {/* ... */}
  )
}
```

## Testing Considerations

### Test Cases Needed

1. **Valid image URL** - should display image
2. **Invalid image URL** - should show icon fallback
3. **Empty string** - should show icon fallback
4. **Undefined/null** - should show icon fallback
5. **Image load failure** - should catch error and show icon

### Current Test Status

Tests pass with mock data because:

- `'/img/1.png'` is a valid string
- Tests don't verify actual image rendering
- Tests check for component presence, not visual state

### Recommendation for Tests

Add visual regression or image load testing:

```typescript
it('should show fallback icon when image fails to load', async () => {
  // Render with invalid image URL
  const { container } = render(
    <EditSequence sequence={mockSequenceWithInvalidImage} />,
    { wrapper: TestWrapper }
  )

  // Find the avatar img element
  const img = container.querySelector('img')

  // Simulate image load error
  fireEvent.error(img!)

  // Verify icon is shown
  expect(screen.getByTestId('SelfImprovementIcon')).toBeInTheDocument()
})
```

## Next Steps

1. ✅ Remove debug logging
2. ✅ Implement Solution 1 with image error handling
3. ✅ Add test cases for image load failures
4. ✅ Verify in browser with real data
5. ✅ Document behavior in component comments
