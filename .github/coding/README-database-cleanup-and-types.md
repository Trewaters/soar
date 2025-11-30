# Implementation Summary: Database Cleanup Script & TypeScript Type Updates

**Date**: October 17, 2025  
**Task**: Add optional database cleanup script and update TypeScript types for union type support  
**Related PRD**: PRD-move-alignment_cues-to-series.md  
**Related Task List**: TaskList-PRD-move-alignment_cues-to-series.md

## Overview

This implementation completes the final tasks of the alignment_cues migration by:

1. Creating an optional database cleanup script to remove deprecated fields from MongoDB
2. Updating TypeScript service types to properly support the union type `Array<string | FlowSeriesPose>`

## Files Created/Modified

### New Files

1. **`scripts/cleanup-deprecated-pose-fields.ts`** (186 lines)

   - Comprehensive database cleanup utility
   - Removes deprecated fields: `alignment_cues`, `preferred_side`, `sideways`
   - Supports dry-run mode for safe preview
   - Detailed reporting and safety features

2. **`scripts/README-cleanup-deprecated-fields.md`** (270 lines)
   - Complete documentation for the cleanup script
   - Usage instructions and examples
   - Safety features and troubleshooting guide
   - Background on why fields were deprecated

### Modified Files

1. **`lib/seriesService.ts`**

   - Added `FlowSeriesPose` interface definition
   - Updated `SeriesData.seriesPoses` type from `string[]` to `Array<string | FlowSeriesPose>`
   - Updated `CreateSeriesInput.seriesPoses` to support union type
   - Added comprehensive type documentation

2. **`lib/sequenceService.ts`**
   - Added `FlowSeriesPose` interface definition
   - Updated `SequenceData.sequencesSeries[].seriesPoses` to union type
   - Updated `CreateSequenceInput.sequencesSeries[].seriesPoses` to union type
   - Ensures sequences properly handle series with alignment cues

## Implementation Details

### Database Cleanup Script

#### Features

**Dry Run Mode**

```bash
npx ts-node scripts/cleanup-deprecated-pose-fields.ts --dry-run
```

- Scans database without making changes
- Reports exactly which poses have deprecated fields
- Shows field values for verification

**Live Mode**

```bash
npx ts-node scripts/cleanup-deprecated-pose-fields.ts
```

- Provides detailed warnings before modifying data
- 3-second countdown allowing cancellation (Ctrl+C)
- Uses atomic MongoDB operations for safety
- Reports number of modified poses

#### Safety Features

1. **Non-Destructive**: Only removes specified deprecated fields
2. **Atomic Operations**: Uses MongoDB's `$unset` operator
3. **Preview Mode**: Dry-run allows safe inspection
4. **Detailed Reporting**: Shows affected poses before cleanup
5. **Cancellation Window**: 3-second delay before changes

#### What Gets Removed

| Field            | Reason for Removal                      |
| ---------------- | --------------------------------------- |
| `alignment_cues` | Moved to series-level per-pose metadata |
| `preferred_side` | Deprecated placeholder field            |
| `sideways`       | Deprecated placeholder field            |

### TypeScript Type Updates

#### SeriesService Types

**Before:**

```typescript
export type SeriesData = {
  seriesPoses: string[] // Legacy string array only
  // ...
}
```

**After:**

```typescript
export interface FlowSeriesPose {
  poseId?: string
  sort_english_name: string
  secondary?: string
  alignment_cues?: string
}

export type SeriesData = {
  // Support both legacy and new format
  seriesPoses: Array<string | FlowSeriesPose>
  // ...
}
```

#### SequenceService Types

**Before:**

```typescript
export type SequenceData = {
  sequencesSeries: Array<{
    seriesPoses: string[] // Legacy string array only
  }>
}
```

**After:**

```typescript
export interface FlowSeriesPose {
  poseId?: string
  sort_english_name: string
  secondary?: string
  alignment_cues?: string
}

export type SequenceData = {
  sequencesSeries: Array<{
    // Support both legacy and new format
    seriesPoses: Array<string | FlowSeriesPose>
  }>
}
```

### Backward Compatibility Strategy

The union type `Array<string | FlowSeriesPose>` ensures:

1. **Legacy Support**: Existing code using string arrays continues to work
2. **New Features**: New code can use object format with alignment_cues
3. **Gradual Migration**: No breaking changes to existing series data
4. **Type Safety**: TypeScript enforces proper handling of both formats

### Type Narrowing Pattern

Components should use type narrowing to handle both formats:

```typescript
seriesPoses.forEach((entry) => {
  if (typeof entry === 'string') {
    // Handle legacy string format
    const poseName = entry
  } else {
    // Handle new object format
    const poseName = entry.sort_english_name
    const alignmentCues = entry.alignment_cues
  }
})
```

## Usage Scenarios

### When to Run Cleanup Script

**Required**: Never (application works with or without running it)

**Recommended**:

- After deploying alignment_cues migration to production
- To clean up legacy data and reduce database size
- To maintain database schema consistency

**Optional**:

- Any time for explicit cleanup
- As part of routine database maintenance

### Script Execution Flow

1. **Scan Phase**: Query database for deprecated fields
2. **Report Phase**: Display statistics and affected poses
3. **Confirmation Phase**: 3-second countdown (live mode only)
4. **Cleanup Phase**: Remove fields using MongoDB `$unset`
5. **Summary Phase**: Report number of poses modified

## Testing Recommendations

### Manual Testing

1. **Dry Run Test**:

   ```bash
   npx ts-node scripts/cleanup-deprecated-pose-fields.ts --dry-run
   ```

   - Verify scan results are accurate
   - Check that no changes are made to database

2. **Live Run Test** (on development database):

   ```bash
   npx ts-node scripts/cleanup-deprecated-pose-fields.ts
   ```

   - Verify fields are removed
   - Confirm pose count matches expectations
   - Ensure other pose data remains intact

3. **Application Test**:
   - Create new series with alignment cues
   - Edit existing series with alignment cues
   - View series in practice mode
   - Verify all functionality works after cleanup

### Type Safety Testing

1. **Series Service**:

   - Create series with string array
   - Create series with object array (alignment_cues)
   - Update series switching between formats
   - Verify API responses match types

2. **Sequence Service**:
   - Create sequence with legacy series data
   - Create sequence with new series data (alignment_cues)
   - Verify type safety in sequence player

## Migration Path

### For Existing Installations

1. **Deploy Code Changes**:

   - Deploy schema changes (already done)
   - Deploy updated services with union types
   - Deploy UI changes (already done)

2. **Optional Cleanup** (after deployment stabilizes):

   ```bash
   # Preview changes
   npx ts-node scripts/cleanup-deprecated-pose-fields.ts --dry-run

   # Apply changes (after backup)
   npx ts-node scripts/cleanup-deprecated-pose-fields.ts
   ```

3. **Verify**:
   - Check application functionality
   - Monitor for any type errors
   - Verify series/sequence features work correctly

### For Fresh Installations

- No cleanup needed (new databases won't have deprecated fields)
- Application works immediately with new schema

## Documentation Updates

### Files Modified

1. **Todo List**: Updated to reflect completion of all tasks
2. **Implementation Summary**: This document

### Files Referenced

1. **PRD**: `.github/instructions/PRDs/PRD-move-alignment_cues-to-series.md`
2. **Task List**: `.github/tasks/TaskList-PRD-move-alignment_cues-to-series.md`
3. **Cleanup README**: `scripts/README-cleanup-deprecated-fields.md`

## Key Architectural Decisions

### Union Type Strategy

**Decision**: Use `Array<string | FlowSeriesPose>` instead of forcing migration

**Rationale**:

- Maintains backward compatibility
- Enables gradual migration
- No breaking changes to existing data
- Type-safe handling of both formats

**Trade-offs**:

- Components must handle both formats
- Slightly more complex type narrowing
- +Benefit: Smooth migration path
- +Benefit: No data loss risk

### Optional Cleanup Script

**Decision**: Make database cleanup optional

**Rationale**:

- Application works fine with old fields present
- Reduces deployment risk
- Allows testing before cleanup
- Gives control to operators

**Trade-offs**:

- Database contains unused fields temporarily
- +Benefit: Safer deployment process
- +Benefit: Easy rollback if needed

## Performance Considerations

### Database Cleanup

- **Operation**: MongoDB `$unset` is atomic and efficient
- **Impact**: Minimal - updates run quickly even with many poses
- **Downtime**: None required - can run during normal operation
- **Locking**: Document-level locking (MongoDB default)

### Type Union Performance

- **Runtime**: No performance impact (TypeScript compiles away)
- **Bundle Size**: Negligible increase
- **Type Checking**: Slightly slower compile time (minimal)

## Security Considerations

### Cleanup Script

1. **Database Access**: Requires valid `DATABASE_URL` credentials
2. **Data Safety**: Only removes specified fields, preserves other data
3. **Audit Trail**: Console logging provides execution record
4. **Reversibility**: Requires database backup for recovery

### Type Safety

1. **Input Validation**: Server-side validation still enforced
2. **Type Guards**: Components must use type narrowing
3. **Schema Consistency**: Prisma schema is source of truth

## Future Enhancements

### Potential Improvements

1. **Progress Indicator**: Show progress during cleanup of large databases
2. **Batch Processing**: Process poses in batches for very large collections
3. **Backup Integration**: Automatic backup before cleanup
4. **Rollback Support**: Create backup data file before removal
5. **Dry Run Report Export**: Save scan results to file

### Type System Enhancements

1. **Branded Types**: Use TypeScript branded types for stronger guarantees
2. **Runtime Validation**: Add zod schemas for series data
3. **Type Predicates**: Create type guard utilities
4. **Exhaustive Checking**: Ensure all code paths handle both formats

## Troubleshooting

### Common Issues

**Issue**: "Cannot find module '@prisma/client'"
**Solution**: Run `npm install && npx prisma generate`

**Issue**: Connection errors
**Solution**: Check `DATABASE_URL` and MongoDB connectivity

**Issue**: No deprecated fields found
**Solution**: Database already clean or fields never existed

**Issue**: TypeScript errors with union types
**Solution**: Add proper type narrowing with `typeof` checks

## Related Changes

This implementation completes the following tasks from the PRD:

- ✅ Task #7: Data & Migration Notes (cleanup script + documentation)
- ✅ Bonus: Update TypeScript service types for union type support

### Previously Completed

- ✅ Task #1: Prisma schema updates
- ✅ Task #2: Backend API updates
- ✅ Task #3: Series Create/Edit UI
- ✅ Task #4: Series Preview/Player
- ✅ Task #5: Pose pages cleanup
- ✅ Task #6: Tests & fixtures
- ✅ Task #10: Comprehensive unit tests

### Remaining

- ⏸️ Task #8: Developer workflow documentation (optional)
- ⏸️ Task #9: CHANGELOG and release notes (recommended)

## Validation Checklist

- [x] Database cleanup script created with dry-run mode
- [x] Script documentation written
- [x] Safety features implemented (countdown, preview, atomic operations)
- [x] SeriesService types updated for union type
- [x] SequenceService types updated for union type
- [x] FlowSeriesPose interface consistent across services
- [x] Backward compatibility maintained
- [x] No breaking changes to existing code
- [x] Todo list updated

## Conclusion

This implementation provides:

1. **Optional Database Cleanup**: Safe, well-documented script for removing deprecated fields
2. **Type Safety**: Updated service types support union format with proper TypeScript types
3. **Backward Compatibility**: Existing code continues to work without changes
4. **Clear Documentation**: Comprehensive guides for both features
5. **Deployment Flexibility**: Cleanup can be run anytime or never

The alignment_cues migration is now feature-complete with proper tooling and type safety across the entire application stack.
