# Asana Activity Services - Monday-Sunday Calendar Week Update

## Summary

The asana activity services (`lib/asanaActivityService.ts`) have been verified to use Monday-Sunday calendar week calculations, matching the implementation used for series and sequence activity trackers.

## Implementation Details

### Functions Updated (Already Implemented)

1. **`getPoseWeeklyCount(userId, poseId)`**

   - Calculates activities for a specific pose within the current Monday-Sunday week
   - Uses `dayOfWeek === 0 ? 6 : dayOfWeek - 1` to calculate days from Monday
   - Returns count, activities array, and date range

2. **`getAllPosesWeeklyCount(userId)`**
   - Aggregates weekly activity counts for all poses
   - Groups activities by poseId with statistics
   - Returns total activities, pose stats, and date range

### Date Calculation Logic

```typescript
const now = new Date()
const dayOfWeek = now.getDay() // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1 // Convert to days from Monday

const startDate = new Date(now)
startDate.setDate(now.getDate() - daysFromMonday)
startDate.setHours(0, 0, 0, 0)

const endDate = new Date(startDate)
endDate.setDate(startDate.getDate() + 6)
endDate.setHours(23, 59, 59, 999)
```

This calculation ensures:

- **Monday** is always the start of the week (day 0 of the range)
- **Sunday** is always the end of the week (day 6 of the range)
- The range spans exactly 7 days from Monday 00:00:00 to Sunday 23:59:59

## Unit Tests Created

Created comprehensive unit tests at `__test__/lib/asanaActivityService.weeklyTracking.spec.ts` with the following coverage:

### Test Suites

1. **getPoseWeeklyCount - Monday-Sunday Calendar Week**

   - ✅ Happy path: Calculates Monday-Sunday week range from Wednesday
   - ✅ Handles Sunday as end of week correctly
   - ✅ Handles Monday as start of week correctly
   - ✅ Returns zero count when no activities exist

2. **getAllPosesWeeklyCount - Monday-Sunday Calendar Week**

   - ✅ Aggregates weekly counts for multiple poses
   - ✅ Only includes activities within Monday-Sunday range
   - ✅ Returns empty stats when no activities exist
   - ✅ Tracks most recent activity date for each pose

3. **Edge Cases - Week Boundary Transitions**
   - ✅ Handles Saturday correctly (day before week end)
   - ✅ Handles week spanning across month boundary

### Test Results

```
Test Suites: 1 passed, 1 total
Tests:       10 passed, 10 total
Snapshots:   0 total
Time:        0.606 s
```

## Key Test Scenarios

### Happy Path Example

- **Given**: Current date is Wednesday, Nov 13, 2024
- **Expected**: Week range is Monday, Nov 11 00:00:00 to Sunday, Nov 17 23:59:59
- **Verified**:
  - Start date is Monday (day 1)
  - End date is Sunday (day 0)
  - Activities within range are counted correctly

### Edge Cases Tested

1. **Sunday as Current Day**:
   - Correctly uses Monday 6 days prior as start of week
2. **Monday as Current Day**:
   - Correctly uses today as start of week
3. **Month Boundary**:
   - Week spanning Oct 28 - Nov 3 calculates correctly
   - Start date is in October, end date is in November

## Consistency Across Services

All three activity tracking services now use identical Monday-Sunday calendar week logic:

- ✅ `asanaActivityService.ts` - Pose/Asana activities
- ✅ `seriesActivityService.ts` - Series activities
- ✅ `sequenceActivityService.ts` - Sequence activities

This ensures consistent weekly activity tracking across all yoga practice entity types in the Soar application.

## Files Modified

- **Tests Created**: `__test__/lib/asanaActivityService.weeklyTracking.spec.ts`
- **Implementation**: `lib/asanaActivityService.ts` (already implemented, verified)

## Testing Strategy

The tests use `jest.useFakeTimers()` and `jest.setSystemTime()` to:

- Control the "current date" for deterministic testing
- Test specific days of the week (Monday, Wednesday, Saturday, Sunday)
- Verify week boundary transitions
- Test month boundary crossings

All tests pass successfully, verifying the Monday-Sunday calendar week implementation.
