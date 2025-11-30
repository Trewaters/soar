# Engineering Task Breakdown: Unified Weekly Activity Tracker

This task list provides a step-by-step implementation guide for consolidating three duplicate Weekly Activity Tracker components (`SeriesWeeklyActivityTracker`, `SequenceWeeklyActivityTracker`, and `WeeklyActivityTracker`) into a single, unified component. The existing `WeeklyActivityTracker.tsx` already implements the unified approach and will be the foundation for this consolidation.

---

## 1. Pre-Implementation Analysis & Component Discovery

- Review the existing `app/clientComponents/WeeklyActivityTracker.tsx` to understand the current unified implementation
- Identify all files in the codebase that import `SeriesWeeklyActivityTracker` using grep or file search:
  ```bash
  grep -r "SeriesWeeklyActivityTracker" --include="*.tsx" --include="*.ts" app/
  ```
- Identify all files in the codebase that import `SequenceWeeklyActivityTracker`:
  ```bash
  grep -r "SequenceWeeklyActivityTracker" --include="*.tsx" --include="*.ts" app/
  ```
- Document all consumer components and their current usage patterns (which props they pass, which variants they use)
- Verify that `WeeklyActivityTracker.tsx` already supports all three entity types ('asana', 'series', 'sequence')
- Create a mapping document showing which old component imports need to be replaced with the unified component

---

## 2. Verify Existing Unified Component Completeness

- Review `app/clientComponents/WeeklyActivityTracker.tsx` to ensure it implements all features from both `SeriesWeeklyActivityTracker` and `SequenceWeeklyActivityTracker`
- Verify the component includes:
  - Support for all three entity types via `entityType` prop ('asana' | 'series' | 'sequence')
  - Dynamic title generation based on entity type using `getCompactTitle()` and `getDetailedTitle()`
  - Dynamic activity list labels using `getActivityListLabel()`
  - Proper service selection in the `useEffect` hook based on entity type
  - Both 'compact' and 'detailed' variants
  - Loading, error, and empty state handling
  - All helper functions: `formatLastPerformed()`, `getStreakColor()`, `getStreakLabel()`, `getDifficultyColor()`
- Compare line-by-line with `SeriesWeeklyActivityTracker.tsx` and `SequenceWeeklyActivityTracker.tsx` to identify any missing features or logic differences
- Document any discrepancies or missing features that need to be added to the unified component

---

## 3. Enhance Unified Component (If Needed)

**Note:** Only perform this step if discrepancies were found in Step 2. The existing `WeeklyActivityTracker.tsx` appears to be feature-complete.

- If missing features are identified, update `app/clientComponents/WeeklyActivityTracker.tsx` to include them
- Ensure the `entityType` prop properly drives all conditional logic and display text
- Verify TypeScript types are correct for the unified `WeeklyActivityData` type alias
- Ensure the component properly handles all three entity types in the `switch` statement within `useEffect`
- Add any missing MUI styling or responsive design features from the standalone components
- Verify accessibility features (ARIA labels, semantic HTML, keyboard navigation) are present
- Ensure mobile-first responsive design is maintained for all entity types

---

## 4. Update Component Imports - Series Activity Tracker Consumers

- For each file identified in Step 1 that imports `SeriesWeeklyActivityTracker`:
  - Replace the import statement:

    ```typescript
    // OLD:
    import SeriesWeeklyActivityTracker from '@app/clientComponents/seriesActivityTracker/SeriesWeeklyActivityTracker'

    // NEW:
    import WeeklyActivityTracker from '@app/clientComponents/WeeklyActivityTracker'
    ```

  - Update the component usage to include the `entityType` prop:

    ```typescript
    // OLD:
    <SeriesWeeklyActivityTracker
      seriesId={seriesId}
      seriesName={seriesName}
      variant="compact"
      refreshTrigger={refreshTrigger}
    />

    // NEW:
    <WeeklyActivityTracker
      entityId={seriesId}
      entityName={seriesName}
      entityType="series"
      variant="compact"
      refreshTrigger={refreshTrigger}
    />
    ```

  - Note: Change `seriesId` prop to `entityId` and `seriesName` to `entityName`
- Test each modified file to ensure it compiles without TypeScript errors
- Verify the component renders correctly in the browser with the new import

---

## 5. Update Component Imports - Sequence Activity Tracker Consumers

- For each file identified in Step 1 that imports `SequenceWeeklyActivityTracker`:
  - Replace the import statement:

    ```typescript
    // OLD:
    import SequenceWeeklyActivityTracker from '@app/clientComponents/sequenceActivityTracker/SequenceWeeklyActivityTracker'

    // NEW:
    import WeeklyActivityTracker from '@app/clientComponents/WeeklyActivityTracker'
    ```

  - Update the component usage to include the `entityType` prop:

    ```typescript
    // OLD:
    <SequenceWeeklyActivityTracker
      sequenceId={sequenceId}
      sequenceName={sequenceName}
      variant="detailed"
      refreshTrigger={refreshTrigger}
    />

    // NEW:
    <WeeklyActivityTracker
      entityId={sequenceId}
      entityName={sequenceName}
      entityType="sequence"
      variant="detailed"
      refreshTrigger={refreshTrigger}
    />
    ```

  - Note: Change `sequenceId` prop to `entityId` and `sequenceName` to `entityName`
- Test each modified file to ensure it compiles without TypeScript errors
- Verify the component renders correctly in the browser with the new import

---

## 6. Verify All Existing WeeklyActivityTracker Usages

- Search for any existing uses of `WeeklyActivityTracker` (the unified component) to ensure they continue to work:
  ```bash
  grep -r "WeeklyActivityTracker" --include="*.tsx" --include="*.ts" app/
  ```
- Verify these existing usages already use the correct prop names (`entityId`, `entityName`, `entityType`)
- If any existing usages need updates for consistency, apply them now
- Ensure no breaking changes were introduced to components already using the unified tracker

---

## 7. Remove Deprecated Component Files

- Delete the standalone Series tracker component file:
  - Remove `app/clientComponents/seriesActivityTracker/SeriesWeeklyActivityTracker.tsx`
- Delete the standalone Sequence tracker component file:
  - Remove `app/clientComponents/sequenceActivityTracker/SequenceWeeklyActivityTracker.tsx`
- Check if the parent directories are now empty:
  - If `app/clientComponents/seriesActivityTracker/` is empty, remove the directory
  - If `app/clientComponents/sequenceActivityTracker/` is empty, remove the directory
- Verify no other files exist in these directories before deletion

---

## 8. Remove Deprecated Test Files

- Check for and remove test files for the standalone components:
  - Search for `__test__/app/clientComponents/seriesActivityTracker/SeriesWeeklyActivityTracker.spec.tsx`
  - Search for `__test__/app/clientComponents/sequenceActivityTracker/SequenceWeeklyActivityTracker.spec.tsx`
  - If these files exist, delete them
- Check if the test directories are now empty:
  - If `__test__/app/clientComponents/seriesActivityTracker/` is empty, remove it
  - If `__test__/app/clientComponents/sequenceActivityTracker/` is empty, remove it
- Ensure the unified test file `__test__/app/clientComponents/WeeklyActivityTracker.spec.tsx` exists and will be enhanced in Step 10

---

## 9. Update or Create Comprehensive Unit Tests

- Locate or create the test file: `__test__/app/clientComponents/WeeklyActivityTracker.spec.tsx`
- Follow the Soar testing patterns from `Rule-create-unit-tests.instructions.md`
- Set up essential mocks for the unified component:
  ```typescript
  jest.mock('next/navigation')
  jest.mock('next-auth/react')
  jest.mock('@lib/asanaActivityClientService')
  jest.mock('@lib/seriesActivityClientService')
  jest.mock('@lib/sequenceActivityClientService')
  jest.mock('@app/clientComponents/LoadingSkeleton')
  ```
- Create a test wrapper with proper MUI ThemeProvider and SessionProvider
- Implement test suites for all three entity types:
  - **Asana Entity Type Tests:**
    - Test component renders with `entityType="asana"`
    - Test compact variant displays "Weekly Activity" title
    - Test detailed variant displays "Weekly Activity Tracker" title
    - Test activity list label shows "All Activity This Week"
    - Test `getPoseWeeklyActivity` service is called with correct parameters
  - **Series Entity Type Tests:**
    - Test component renders with `entityType="series"`
    - Test compact variant displays "Weekly Series Activity" title
    - Test detailed variant displays "Weekly Series Activity Tracker" title
    - Test activity list label shows "All Series Practice This Week"
    - Test `getSeriesWeeklyActivity` service is called with correct parameters
  - **Sequence Entity Type Tests:**
    - Test component renders with `entityType="sequence"`
    - Test compact variant displays "Weekly Activity" title
    - Test detailed variant displays "Weekly Activity Tracker" title
    - Test activity list label shows "All Activity This Week"
    - Test `getSequenceWeeklyActivity` service is called with correct parameters
- Test common functionality across all entity types:
  - Test loading state displays `LoadingSkeleton` component
  - Test error state displays error message
  - Test empty state returns `null` (no render)
  - Test compact variant layout and structure
  - Test detailed variant layout with all sections
  - Test `formatLastPerformed()` function with different dates
  - Test `getStreakColor()` function with different counts
  - Test `getStreakLabel()` function with different counts
  - Test `getDifficultyColor()` function with different statuses
  - Test refresh trigger causes data refetch
  - Test activity list renders correctly with multiple sessions
- Test props validation:
  - Test component handles missing `session.user.id`
  - Test component handles missing `entityId`
  - Test component handles invalid `entityType` (should throw error or display error)
- Test accessibility features:
  - Test proper ARIA labels on interactive elements
  - Test tooltip accessibility
  - Test keyboard navigation
- Ensure test file stays under 600 lines (excluding imports, mocks, setup)
- Run tests to verify all pass: `npm test -- WeeklyActivityTracker.spec.tsx`

---

## 10. Integration Testing

- Manually test the unified component with real data for all three entity types:
  - Test with an asana entity in the browser
  - Test with a series entity in the browser
  - Test with a sequence entity in the browser
- Verify both compact and detailed variants render correctly for all entity types
- Test responsive design on mobile viewport sizes
- Test loading states by throttling network in browser DevTools
- Test error states by temporarily breaking the API endpoint
- Test empty states by using entities with no activity data
- Verify the component properly refreshes when `refreshTrigger` prop changes
- Check browser console for any errors or warnings
- Verify no visual regressions compared to the old standalone components

---

## 11. Run Full Test Suite & Verify Coverage

- Run the complete test suite to ensure no regressions:
  ```bash
  npm run test
  ```
- Run tests with coverage report:
  ```bash
  npm run test:coverage
  ```
- Verify test coverage for `WeeklyActivityTracker.tsx` meets or exceeds 80%
- Check that coverage for the removed components is no longer reported
- Fix any failing tests introduced by the consolidation
- Ensure no TypeScript compilation errors exist

---

## 12. Update Documentation

- Update any README files that reference the old component names:
  - Search for mentions of `SeriesWeeklyActivityTracker` in markdown files
  - Search for mentions of `SequenceWeeklyActivityTracker` in markdown files
  - Replace with `WeeklyActivityTracker` and note the `entityType` prop
- Update component documentation to reflect the unified approach:
  - Document the `entityType` prop and its accepted values
  - Provide usage examples for all three entity types
  - Note the prop name changes (`seriesId` → `entityId`, etc.)
- If a components catalog or Storybook exists, update it to show the unified component
- Update the CHANGELOG.md to document this refactoring:
  - Note the consolidation of three components into one
  - List the breaking changes (prop name changes)
  - Document the code reduction (~400 lines eliminated)

---

## 13. Code Review & Cleanup

- Perform a self-review of all changes:
  - Verify all imports have been updated correctly
  - Ensure no references to the old components remain
  - Check that TypeScript types are correct throughout
  - Verify consistent code formatting and style
- Run ESLint to catch any code quality issues:
  ```bash
  npm run lint
  ```
- Fix any linting errors or warnings
- Run Prettier to ensure consistent formatting (if not auto-formatted on save):
  ```bash
  npm run pretty-fix
  ```
- Remove any unused imports introduced during refactoring
- Ensure all console.log statements are removed or use proper logging
- Verify no commented-out code remains from the consolidation process

---

## 14. Final Verification & Deployment Preparation

- Run the application in development mode:
  ```bash
  npm run dev
  ```
- Navigate to all pages that use the activity tracker:
  - Visit pages showing asana activity tracking
  - Visit pages showing series activity tracking
  - Visit pages showing sequence activity tracking
- Verify visual consistency across all entity types
- Test user interactions (tooltips, clicking through activities, etc.)
- Verify no console errors or warnings appear
- Test on multiple browsers (Chrome, Firefox, Safari) if possible
- Run the build process to ensure production build succeeds:
  ```bash
  npm run build
  ```
- Verify the bundle size has decreased due to code consolidation
- Create a Git commit with a clear commit message:

  ```
  refactor: Consolidate three Weekly Activity Tracker components into one

  - Removed SeriesWeeklyActivityTracker and SequenceWeeklyActivityTracker
  - Updated all imports to use unified WeeklyActivityTracker
  - Enhanced WeeklyActivityTracker to support all entity types via props
  - Updated tests to cover all three entity types
  - Eliminated ~400 lines of duplicated code
  ```

- Push changes to a feature branch for code review (if applicable)

---

## Summary

This task breakdown consolidates three nearly identical Weekly Activity Tracker components into a single, reusable component. The existing `WeeklyActivityTracker.tsx` already implements the unified approach, so the primary work involves:

1. **Updating imports** in all consumer components to use the unified component
2. **Updating props** from entity-specific names (`seriesId`, `sequenceId`) to generic names (`entityId`, `entityName`) and adding the `entityType` prop
3. **Removing deprecated files** for the standalone components and their tests
4. **Enhancing tests** to comprehensively cover all three entity types
5. **Verifying** no regressions or breaking changes

**Expected Outcomes:**

- Single source of truth for activity tracking UI
- ~400 lines of duplicated code eliminated (57% reduction)
- Consistent behavior across all entity types
- Reduced bundle size and testing overhead
- Improved maintainability for future enhancements

**Estimated Effort:** 4-6 hours for a junior engineer, 2-3 hours for a senior engineer
