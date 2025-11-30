# AsanaActivity Field Rename Implementation - Progress Report

## Overview

Implementation of PRD task list to rename `poseId`/`poseName` to `asanaId`/`asanaName` in the AsanaActivity system, aligning naming conventions across all activity types (Asana, Series, Sequence).

## Completed Work

### Phase 1: Database Migration Scripts ✅

**Files Created:**

- `scripts/migrations/rename-asana-activity-fields.js` (204 lines)

  - MongoDB migration with comprehensive validation
  - Pre-migration document count verification
  - Atomic `$rename` operations for both fields
  - Post-migration validation and sample inspection
  - Detailed logging and error handling

- `scripts/migrations/rollback-asana-activity-fields.js` (193 lines)
  - Emergency rollback capability
  - Mirrors forward migration structure
  - Same validation and verification steps

### Phase 2: Prisma Schema Updates ✅

**File Modified:** `prisma/schema.prisma`

**Changes:**

```prisma
model AsanaActivity {
  asanaId   String @db.ObjectId  // Was: poseId
  asanaName String               // Was: poseName
  pose      AsanaPose @relation(fields: [asanaId], references: [id])  // Updated relation
}
```

**Status:** ⚠️ **Prisma client NOT regenerated** - User cancelled `npx prisma generate`

### Phase 3: Service Layer Updates ✅

#### Server-Side Service (`lib/asanaActivityService.ts`)

**Interface Updates:**

- `AsanaActivityInput`: Changed `poseId`/`poseName` → `asanaId`/`asanaName`

**Function Updates:**

1. `recordAsanaActivity()`: Removed legacy field mapping logic
2. `deleteAsanaActivity(userId, asanaId)`: Parameter renamed from `poseId`
3. `checkExistingActivity(userId, asanaId)`: Parameter renamed from `poseId`
4. `getPoseWeeklyCount()` → `getAsanaWeeklyCount()`: Function renamed
5. `getAllPosesWeeklyCount()`: Updated to use `asanaStats` instead of `poseStats`

**Database Query Updates:**

- All Prisma queries now use `asanaId` and `asanaName`
- Aggregation grouping uses `_id: "$asanaId"` instead of `_id: "$poseId"`
- All error messages updated to reference "asana" instead of "pose"

#### Client-Side Service (`lib/asanaActivityClientService.ts`)

**Interface Updates:**

- `AsanaActivityData`: Changed `poseId`/`poseName` → `asanaId`/`asanaName`
- `CreateActivityInput`: Changed `poseId`/`poseName` → `asanaId`/`asanaName`

**Function Updates:**

1. `deleteAsanaActivity(userId, asanaId)`: Parameter and fetch body updated
2. `checkActivityExists(userId, asanaId)`: Query string parameter updated
3. `getPoseWeeklyActivity()` → `getAsanaWeeklyActivity()`: Function renamed
4. `getAllPosesWeeklyActivity()` → `getAllAsanasWeeklyActivity()`: Function renamed

### Phase 4: API Route Updates ✅

#### Main API Route (`app/api/asanaActivity/route.ts`)

**POST Handler:**

- Validation expects `asanaId` and `asanaName` instead of `poseId` and `poseName`
- Error message: "Missing required fields: userId, asanaId, and asanaName"
- Fallback logic uses `asanaName` instead of `poseName`
- All error messages updated to reference "asana ID" instead of "pose ID"

**DELETE Handler:**

- Expects `asanaId` in request body instead of `poseId`
- Function call uses `asanaId` parameter
- Error message updated

**GET Handler:**

- Query parameter changed from `poseId` to `asanaId`
- Comments updated to reference "asana" instead of "pose"

#### Weekly Activity Route (`app/api/asanaActivity/weekly/route.ts`)

**Changes:**

- Import: `getPoseWeeklyCount` → `getAsanaWeeklyCount`
- Query parameter: `poseId` → `asanaId`
- Function call: `getAsanaWeeklyCount(userId, asanaId)`
- Comments updated

### Phase 5: Component Updates ✅

#### ActivityTracker Component (`app/clientComponents/ActivityTracker.tsx`)

**Key Change:** Removed conditional logic for asana entities

**Before:**

```typescript
// Only add dynamic fields for series and sequence (not asana)
if (entityType !== 'asana') {
  activityData[`${entityType}Id`] = entityId
  activityData[`${entityType}Name`] = entityName
}
```

**After:**

```typescript
// Add dynamic entity fields for all types (unified approach)
activityData[`${entityType}Id`] = entityId
activityData[`${entityType}Name`] = entityName
```

**Result:** Asana now uses the same dynamic field naming pattern as series and sequence

#### Pose Activity Detail Page (`app/navigator/asanaPoses/[pose]/poseActivityDetail.tsx`)

**Changes:**

- Removed `poseId` and `poseName` from `additionalActivityData` prop
- These fields now handled automatically by dynamic naming in ActivityTracker
- Only keeps `sort_english_name` and `duration` in additional data

**Before:**

```typescript
additionalActivityData={{
  poseId: pose.id.toString(),
  poseName: pose.sort_english_name,
  sort_english_name: pose.sort_english_name,
  duration: 0,
}}
```

**After:**

```typescript
additionalActivityData={{
  sort_english_name: pose.sort_english_name,
  duration: 0,
}}
```

### Phase 6: Type Definition Updates ✅

#### AsanaActivity Type (`types/asana.ts`)

**Changes:**

```typescript
export interface AsanaActivity {
  asanaId: string // Was: poseId
  asanaName: string // Was: poseName
  // ...other fields unchanged
}
```

## Summary of Changes

### Files Created: 2

1. `scripts/migrations/rename-asana-activity-fields.js`
2. `scripts/migrations/rollback-asana-activity-fields.js`

### Files Modified: 7

1. `prisma/schema.prisma` - AsanaActivity model fields
2. `lib/asanaActivityService.ts` - Server service layer
3. `lib/asanaActivityClientService.ts` - Client service layer
4. `app/api/asanaActivity/route.ts` - Main API route
5. `app/api/asanaActivity/weekly/route.ts` - Weekly activity route
6. `app/clientComponents/ActivityTracker.tsx` - Component simplification
7. `app/navigator/asanaPoses/[pose]/poseActivityDetail.tsx` - Removed legacy props
8. `types/asana.ts` - Type definitions

### Total Lines Modified: ~600+ lines across all files

## Remaining Work

### Phase 7: Test Suite Updates ⚠️ **HIGH PRIORITY**

**Test Files Requiring Updates:**

1. **`__test__/lib/asanaActivityService.weeklyTracking.spec.ts`** (~450 lines)

   - 34+ occurrences of `poseId` and `poseName`
   - Function name changes: `getPoseWeeklyCount` → `getAsanaWeeklyCount`
   - Mock data structures: `poseStats` → `asanaStats`
   - Test descriptions and assertions

2. **`__test__/api/asanaActivity.spec.ts`** (~318 lines)

   - Mock activity data objects with `poseId`/`poseName`
   - Query parameter tests
   - Validation logic tests
   - API response assertions

3. **`__test__/app/context/AsanaPoseContext.spec.tsx`**

   - Mock asana activity data
   - Context integration tests

4. **`__test__/app/navigator/asanaPoses/ViewAsanaPose.spec.tsx`**
   - Additional activity data props
   - ActivityTracker integration tests

**Note:** Image-related tests with `poseId`/`poseName` are NOT part of this refactor - those are legitimate fields for linking images to poses.

### Phase 8: Critical Prerequisites

1. **Run `npx prisma generate`** ⚠️ **BLOCKING**

   - Must regenerate Prisma client for TypeScript types
   - All code will have TypeScript errors until this is done
   - Previously cancelled by user

2. **Run Migration Scripts**
   - Execute `rename-asana-activity-fields.js` in development environment
   - Verify MongoDB field renaming
   - Keep rollback script ready for emergencies

### Phase 9: Verification & Testing

1. **Run Full Test Suite**

   - After all test updates complete
   - Target: 100% pass rate
   - Fix any remaining issues

2. **Manual Testing**
   - Test asana activity creation
   - Test activity deletion
   - Test weekly activity queries
   - Test ActivityTracker component
   - Verify poseActivityDetail page

## Architecture Impact

### ✅ Positive Changes

1. **Unified Naming Convention**: All activity types now use consistent field naming
2. **Simplified Component Logic**: ActivityTracker no longer needs special cases
3. **Better Code Maintainability**: Reduced conditional logic
4. **Type Safety**: Updated TypeScript interfaces ensure compile-time checks

### ⚠️ Risks & Considerations

1. **Database Migration Required**: Production databases need field renaming
2. **Breaking Change**: Old API clients sending `poseId`/`poseName` will fail
3. **Test Coverage**: Extensive test updates required (~152 test occurrences)
4. **Prisma Client**: Must regenerate or TypeScript compilation fails

## Next Steps

### Immediate Actions Required

1. ✅ Complete component updates (DONE)
2. 🔄 Update test files with new field names (IN PROGRESS)
3. ⏳ Run `npx prisma generate` to regenerate client
4. ⏳ Run test suite and fix failures
5. ⏳ Execute MongoDB migration script
6. ⏳ Manual testing and verification

### Recommended Order

1. **Update all test files** - Can be done while Prisma client is outdated
2. **Regenerate Prisma client** - Fixes TypeScript errors
3. **Run test suite** - Verify all tests pass
4. **Run MongoDB migration** - Update database fields
5. **Full manual testing** - Verify end-to-end functionality
6. **Documentation** - Create final implementation report

## Test Update Strategy

To efficiently update the ~152 test occurrences, we should:

1. **Start with service layer tests** - Foundation for other tests

   - `asanaActivityService.weeklyTracking.spec.ts`
   - Update function names, mock data, assertions

2. **Update API route tests**

   - `asanaActivity.spec.ts`
   - Update query parameters and response structures

3. **Update component tests**

   - Context and component integration tests
   - ActivityTracker test updates

4. **Verify image-related tests unchanged**
   - Confirm `poseId` in image types is still valid (it is)

## Lessons Learned

1. **Comprehensive Search Critical**: Used `grep_search` to find all occurrences
2. **Migration Scripts Essential**: Rollback capability is safety net
3. **Unified Approach Simpler**: Removing special cases reduces complexity
4. **Test Coverage Valuable**: Extensive tests ensure refactoring success
5. **Prisma Client Regeneration**: Should be done immediately after schema changes

## Status Summary

- ✅ **Backend Infrastructure**: 100% Complete
- ✅ **API Layer**: 100% Complete
- ✅ **Frontend Components**: 100% Complete
- ⚠️ **Test Suites**: 0% Complete (not started)
- ❌ **Prisma Client**: Not regenerated (blocking)
- ❌ **Migration Execution**: Not run (awaiting tests)

**Overall Progress: ~70% Complete** (pending test updates and verification)
