# PostureShareButton Migration Guide

## Overview

This guide documents the migration from the legacy prop-based API to the new discriminated union pattern for the `PostureShareButton` component. The new API provides better type safety, extensibility, and clearer intent.

## Breaking Changes Summary

### Legacy API (Deprecated)

```tsx
// Old way - using separate optional props
<PostureShareButton postureData={asanaData} />
<PostureShareButton seriesData={seriesData} />
```

### New API (Recommended)

```tsx
// New way - using discriminated union content prop
<PostureShareButton
  content={{
    contentType: 'asana',
    data: asanaData,
  }}
/>

<PostureShareButton
  content={{
    contentType: 'series',
    data: seriesData,
  }}
/>

<PostureShareButton
  content={{
    contentType: 'sequence',
    data: sequenceData,
  }}
/>
```

## Migration Steps

### 1. Update Asana Sharing Usage

**Before:**

```tsx
<PostureShareButton postureData={posture} />
```

**After:**

```tsx
<PostureShareButton
  content={{
    contentType: 'asana',
    data: posture,
  }}
/>
```

### 2. Update Series Sharing Usage

**Before:**

```tsx
<PostureShareButton seriesData={flow} />
```

**After:**

```tsx
<PostureShareButton
  content={{
    contentType: 'series',
    data: flow,
  }}
/>
```

### 3. New Sequence Sharing Usage

```tsx
<PostureShareButton
  content={{
    contentType: 'sequence',
    data: sequenceData,
  }}
/>
```

## Updated Files

The following files have been migrated to use the new API:

1. **`app/navigator/flows/practiceSeries/page.tsx`**

   - Updated series sharing from `seriesData={flow}` to new content pattern
   - Line 247-252

2. **`app/navigator/asanaPostures/[pose]/postureActivityDetail.tsx`**
   - Updated asana sharing from `postureData={posture}` to new content pattern
   - Line 871-877

## Backward Compatibility

The component maintains backward compatibility during the migration period. Both APIs are supported:

- **Legacy props**: `postureData`, `seriesData` (deprecated but functional)
- **New props**: `content` with discriminated union (recommended)

However, you cannot mix legacy and new props in the same component usage.

## Type Safety Benefits

### Compile-Time Validation

The new discriminated union pattern provides compile-time validation:

```tsx
// TypeScript will catch this error
<PostureShareButton
  content={{
    contentType: 'asana',
    data: seriesData, // ❌ Error: seriesData is not assignable to FullAsanaData
  }}
/>

// This is correct
<PostureShareButton
  content={{
    contentType: 'series',
    data: seriesData, // ✅ Correct: seriesData matches FlowSeriesData
  }}
/>
```

### Extensibility

Adding new content types is straightforward:

```typescript
// In types/sharing.ts
export type ShareableContent =
  | { contentType: 'asana'; data: FullAsanaData }
  | { contentType: 'series'; data: FlowSeriesData }
  | { contentType: 'sequence'; data: SequenceData }
  | { contentType: 'workshop'; data: WorkshopData } // Easy to add new types
```

## Common Props

All other props remain the same across both APIs:

```tsx
<PostureShareButton
  content={contentData}
  showDetails={true} // Optional: show detailed share info
  enableContextIntegration={true} // Optional: enable context provider integration
/>
```

## Testing Updates

Test files should also migrate to the new pattern for consistency:

```tsx
// Before
<PostureShareButton postureData={mockAsanaData} />

// After
<PostureShareButton
  content={{
    contentType: 'asana',
    data: mockAsanaData,
  }}
/>
```

## Error Handling

The new API provides better error messages and validation:

- **Type mismatches**: Clear TypeScript errors at compile time
- **Missing data**: Runtime validation with specific error messages
- **Invalid content types**: Compile-time protection against typos

## Performance Considerations

The new API maintains the same performance characteristics:

- No additional re-renders
- Same memoization strategies
- Backward compatibility has minimal overhead

## Support Timeline

- **Current**: Both APIs supported
- **Future releases**: Legacy API will be deprecated
- **Migration deadline**: TBD (to be determined based on adoption)

## Getting Help

If you encounter issues during migration:

1. Check TypeScript errors for guidance
2. Refer to component JSDoc documentation
3. Review test examples in `__test__/app/clientComponents/postureShareButton.spec.tsx`
4. Ensure proper import of types from `types/sharing.ts`

## Verification

After migration, verify your changes by:

1. Running TypeScript compilation: `npm run type-check`
2. Running tests: `npm run test`
3. Testing sharing functionality in development environment
4. Ensuring accessibility features still work correctly
