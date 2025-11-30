# Engineering Task Breakdown: Unified Activity Tracker Component

## Overview

This task list guides the implementation of a unified `ActivityTracker` component that consolidates three separate activity tracking implementations (Asana, Series, and Sequence) into a single reusable component. The goal is to eliminate ~500+ lines of duplicated code while maintaining all existing functionality.

---

## 1. Project Setup and Type Definitions

### 1.1 Create TypeScript Type Definitions

- Create file `app/clientComponents/ActivityTracker.types.ts`
- Define `ActivityTrackerProps` interface with all required and optional props:
  - Entity identification props: `entityId`, `entityName`, `entityType`
  - Service function props: `checkActivity`, `createActivity`, `deleteActivity`
  - UI configuration props: `variant`, `title`, `showSuccessMessage`, `buttonLabel`
  - Callback props: `onActivityToggle`, `onActivityRefresh`
  - Additional data prop: `additionalActivityData`
- Define `CheckActivityResult` interface with `exists` boolean and optional `activity` object
- Define `CreateActivityData` interface with required fields and index signature for additional fields
- Define `EntityType` type as union: `'asana' | 'series' | 'sequence'`
- Define `ComponentVariant` type as union: `'inline' | 'card'`
- Export all types for use in component and tests

### 1.2 Document Service Function Signatures

- Review existing service functions in `app/lib/asanaActivityClientService.ts`
- Review existing service functions in `app/lib/seriesActivityClientService.ts`
- Review existing service functions in `app/lib/sequenceActivityClientService.ts`
- Document the common pattern across all three service implementations
- Ensure type definitions align with actual service function signatures

---

## 2. Core Component Implementation

### 2.1 Create ActivityTracker Component File

- Create file `app/clientComponents/ActivityTracker.tsx`
- Add proper file header and imports:
  - React hooks: `useState`, `useEffect`
  - NextAuth: `useSession` from `next-auth/react`
  - MUI components: `Button`, `Stack`, `Chip`, `Typography`, `FormControlLabel`, `Checkbox`, `Box`, `Paper`
- Import type definitions from `ActivityTracker.types.ts`

### 2.2 Implement Component Function Signature

- Define `ActivityTracker` functional component with TypeScript props
- Destructure all props with appropriate default values:
  - `variant` defaults to `'card'`
  - `showSuccessMessage` defaults based on variant (true for card, false for inline)
  - `title` and `buttonLabel` defaults based on `entityType`
- Add proper JSDoc comments documenting the component purpose and props

### 2.3 Implement State Management

- Initialize `checked` state as `boolean` (default: false)
- Initialize `loading` state as `boolean` (default: false)
- Initialize `error` state as `string | null` (default: null)
- Initialize `selectedDifficulty` state as `string | null` (default: null)
- Initialize `easyChipVariant` state as `'filled' | 'outlined'` (default: 'outlined')
- Initialize `averageChipVariant` state as `'filled' | 'outlined'` (default: 'outlined')
- Initialize `difficultChipVariant` state as `'filled' | 'outlined'` (default: 'outlined')
- Get session data using `useSession()` hook

### 2.4 Implement Default Value Helper Functions

- Create `getDefaultTitle` function that returns appropriate title based on `entityType`:
  - 'asana': 'Track Your Practice'
  - 'series': 'Track Your Practice'
  - 'sequence': 'Track Your Sequence Practice'
- Create `getDefaultButtonLabel` function that returns appropriate label based on `entityType`:
  - 'asana': 'Mark for Activity Tracker'
  - 'series': 'Track Series Practice'
  - 'sequence': 'Track Sequence Practice'
- Create `getTrackedLabel` function that returns 'Tracked in Activity' for all types
- Create `getSavingLabel` function that returns 'Saving...' for all types

---

## 3. Difficulty Selection Logic

### 3.1 Implement Difficulty Click Handlers

- Create `handleEasyChipClick` function:
  - Toggle `easyChipVariant` between 'filled' and 'outlined'
  - If filled, set `selectedDifficulty` to 'easy'
  - If filled, reset other chip variants to 'outlined'
  - If outlined (deselecting), set `selectedDifficulty` to null
- Create `handleAverageChipClick` function:
  - Toggle `averageChipVariant` between 'filled' and 'outlined'
  - If filled, set `selectedDifficulty` to 'average'
  - If filled, reset other chip variants to 'outlined'
  - If outlined (deselecting), set `selectedDifficulty` to null
- Create `handleDifficultChipClick` function:
  - Toggle `difficultChipVariant` between 'filled' and 'outlined'
  - If filled, set `selectedDifficulty` to 'difficult'
  - If filled, reset other chip variants to 'outlined'
  - If outlined (deselecting), set `selectedDifficulty` to null

### 3.2 Create Difficulty Selection Helper

- Create `handleDifficultySelect` function (for card variant):
  - Accept difficulty parameter: 'easy' | 'average' | 'difficult'
  - Set `selectedDifficulty` to the passed value
  - Update chip variants to show only the selected difficulty as 'filled'
  - Reset other chip variants to 'outlined'

---

## 4. Activity Toggle and Persistence Logic

### 4.1 Implement Check Existing Activity Effect

- Create `useEffect` hook that runs on component mount
- Add dependencies: `session?.user?.id`, `entityId`, `checkActivity`
- Inside effect:
  - Return early if no session or entityId
  - Call `checkActivity` service function with userId and entityId
  - If activity exists, set `checked` to true
  - If activity has difficulty, set `selectedDifficulty` and update chip variants
  - Handle errors gracefully (log to console, don't show to user)

### 4.2 Implement Activity Toggle Logic

- Create `updateActivityState` async function:
  - Accept `isChecked` boolean parameter
  - Update `checked` state immediately for optimistic UI
  - Validate session exists, show error if not
  - Set `loading` to true at start
  - Clear any previous errors
- If checking (creating activity):
  - Build activity data object with userId, entityId, entityName, difficulty, completionStatus, datePerformed
  - Merge with `additionalActivityData` prop if provided
  - Call `createActivity` service function
  - Call `onActivityToggle` callback with true if provided
  - Call `onActivityRefresh` callback if provided
- If unchecking (deleting activity):
  - Call `deleteActivity` service function with userId and entityId
  - Reset `selectedDifficulty` to null
  - Reset all chip variants to 'outlined'
  - Call `onActivityToggle` callback with false if provided
  - Call `onActivityRefresh` callback if provided
- Handle errors:
  - Set error message in state
  - Revert `checked` state on failure
- Always set `loading` to false in finally block

### 4.3 Implement Button and Checkbox Handlers

- Create `handleButtonToggle` function:
  - Call `updateActivityState` with negated `checked` value
- Create `handleCheckboxChange` function:
  - Accept React change event
  - Extract checked value from event
  - Call `updateActivityState` with checked value

---

## 5. UI Component Rendering

### 5.1 Implement Early Returns

- Add early return if no session user ID:
  - Return null (component doesn't render for unauthenticated users)
  - This matches behavior of existing implementations

### 5.2 Implement Difficulty Chips Section

- Create difficulty chips JSX:
  - Container: `Box` component with typography label "How was this practice for you?"
  - Stack component with horizontal layout and center justification
  - Easy chip:
    - Label: "Easy"
    - Variant: `easyChipVariant`
    - Color: `'success'`
    - onClick: `handleEasyChipClick` (inline) or `handleDifficultySelect('easy')` (card)
    - Size: "small"
    - Styling: cursor pointer, conditional font weight (700 if filled), white text if filled
  - Average chip:
    - Label: "Average"
    - Variant: `averageChipVariant`
    - Color: `'info'`
    - onClick: `handleAverageChipClick` (inline) or `handleDifficultySelect('average')` (card)
    - Size: "small"
    - Styling: cursor pointer, conditional font weight (700 if filled), white text if filled
  - Difficult chip:
    - Label: "Difficult"
    - Variant: `difficultChipVariant`
    - Color: `'error'`
    - onClick: `handleDifficultChipClick` (inline) or `handleDifficultySelect('difficult')` (card)
    - Size: "small"
    - Styling: cursor pointer, conditional font weight (700 if filled), white text if filled

### 5.3 Implement Activity Toggle Controls

- Create button and checkbox JSX:
  - Stack container with horizontal layout
  - Button component:
    - Variant: `checked ? 'contained' : 'outlined'`
    - Color: `checked ? 'success' : 'primary'`
    - onClick: `handleButtonToggle`
    - Disabled: `loading`
    - Label: Dynamic based on state (loading, checked, unchecked)
    - Styling: minWidth 200px, textTransform none
  - FormControlLabel with Checkbox:
    - Checked: `checked`
    - onChange: `handleCheckboxChange`
    - Disabled: `loading`
    - Label: empty string

### 5.4 Implement Error Display

- Create conditional error message JSX:
  - Only render if `error` state is not null
  - Typography component with error color
  - Display the error message text
  - Provide accessible styling

### 5.5 Implement Success Message

- Create conditional success message JSX:
  - Only render if `showSuccessMessage` is true AND `checked` is true
  - Typography component with success color
  - Text: "Great job! This [entity type] practice has been added to your activity tracker."
  - Center-aligned text

### 5.6 Implement Inline Variant Layout

- Create inline variant JSX structure:
  - No Paper wrapper
  - Stack container with vertical spacing
  - Typography label for difficulty selection (if needed)
  - Difficulty chips section
  - Activity toggle controls (button + checkbox)
  - Error display (conditional)
  - No title, no success message

### 5.7 Implement Card Variant Layout

- Create card variant JSX structure:
  - Paper component wrapper:
    - Elevation: 2
    - Padding: 2
    - Border radius: 2
    - Border: 1px solid divider color
    - Background: paper color
  - Stack container with vertical spacing (2)
  - Title: Typography h6, centered, bold (if title prop provided)
  - Difficulty chips section
  - Activity toggle controls (button + checkbox)
  - Error display (conditional)
  - Success message (conditional)

### 5.8 Implement Conditional Rendering Based on Variant

- Use ternary or conditional logic to render either inline or card layout
- Ensure all functionality is identical between variants
- Only UI structure and styling should differ

---

## 6. Component Export and Documentation

### 6.1 Add Component Export

- Export `ActivityTracker` as default export from component file
- Add named export for type definitions if needed

### 6.2 Add JSDoc Documentation

- Document the component purpose at the top of the file
- Document each prop in the interface with JSDoc comments
- Add usage examples in JSDoc:
  - Example for asana inline variant
  - Example for series card variant
  - Example for sequence card variant
- Document default values for optional props

---

## 7. Migration: Asana Implementation (Inline Variant)

### 7.1 Update poseActivityDetail Component

- Open file `app/navigator/asanaPoses/[pose]/poseActivityDetail.tsx`
- Import `ActivityTracker` component
- Import asana service functions:
  - `checkActivityExists` from `@lib/asanaActivityClientService`
  - `createAsanaActivity` from `@lib/asanaActivityClientService`
  - `deleteAsanaActivity` from `@lib/asanaActivityClientService`

### 7.2 Remove Inline Activity Tracking Code

- Remove state declarations (lines ~100-115):
  - Remove `easyChipVariant`, `averageChipVariant`, `difficultChipVariant` states
  - Remove `selectedDifficulty` state
  - Remove `checked`, `loading`, `error` states (if not used elsewhere)
- Remove difficulty chip click handlers (lines ~246-295):
  - Remove `handleEasyChipClick`, `handleAverageChipClick`, `handleDifficultChipClick`
- Remove activity toggle logic (lines ~296-370):
  - Remove `handleCheckboxChange`, `handleButtonToggle`, `updateActivityState`
- Remove check existing activity useEffect (lines ~200-245)

### 7.3 Replace with ActivityTracker Component

- Find the JSX section that renders difficulty chips and activity toggle controls
- Replace entire section with `ActivityTracker` component:
  - entityId: `pose.id.toString()`
  - entityName: `pose.sort_english_name`
  - entityType: `'asana'`
  - variant: `'inline'`
  - checkActivity: `checkActivityExists`
  - createActivity: `createAsanaActivity`
  - deleteActivity: `deleteAsanaActivity`
  - onActivityRefresh: `() => setActivityRefreshTrigger(prev => prev + 1)`
  - additionalActivityData: `{ sort_english_name: pose.sort_english_name, duration: 0 }`

### 7.4 Verify WeeklyActivityTracker Integration

- Ensure `activityRefreshTrigger` state is still present
- Verify `WeeklyActivityTracker` component receives `refreshTrigger` prop
- Test that activity tracking refreshes the weekly tracker

### 7.5 Test Asana Activity Tracking

- Manually test the inline variant in the pose detail page
- Verify difficulty selection works
- Verify activity creation and deletion
- Verify existing activities load correctly
- Check that all UI states (loading, error, success) work properly

---

## 8. Migration: Series Implementation (Card Variant)

### 8.1 Find SeriesActivityTracker Usage Locations

- Search codebase for imports of `SeriesActivityTracker`
- Likely location: `app/navigator/flows/practiceSeries` (verify exact path)
- Document all usage locations before making changes

### 8.2 Update Series Practice Pages

- For each usage location:
  - Import `ActivityTracker` component
  - Import series service functions:
    - `checkSeriesActivityExists` from `@lib/seriesActivityClientService`
    - `createSeriesActivity` from `@lib/seriesActivityClientService`
    - `deleteSeriesActivity` from `@lib/seriesActivityClientService`
  - Replace `<SeriesActivityTracker />` with `<ActivityTracker />`
  - Pass props:
    - entityId: series ID
    - entityName: series name
    - entityType: `'series'`
    - variant: `'card'`
    - checkActivity: `checkSeriesActivityExists`
    - createActivity: `createSeriesActivity`
    - deleteActivity: `deleteSeriesActivity`
    - title: `'Track Your Practice'`
    - buttonLabel: `'Track Series Practice'`
    - showSuccessMessage: `true`
    - onActivityToggle: existing callback (if any)

### 8.3 Test Series Activity Tracking

- Manually test the card variant in series practice pages
- Verify Paper wrapper, title, and success message display
- Verify difficulty selection and activity tracking
- Verify callback integration works correctly
- Test on mobile viewport for responsive behavior

---

## 9. Migration: Sequence Implementation (Card Variant)

### 9.1 Find SequenceActivityTracker Usage Locations

- Search codebase for imports of `SequenceActivityTracker`
- Likely location: sequence practice pages (verify exact paths)
- Document all usage locations before making changes

### 9.2 Update Sequence Practice Pages

- For each usage location:
  - Import `ActivityTracker` component
  - Import sequence service functions:
    - `checkSequenceActivityExists` from `@lib/sequenceActivityClientService`
    - `createSequenceActivity` from `@lib/sequenceActivityClientService`
    - `deleteSequenceActivity` from `@lib/sequenceActivityClientService`
  - Replace `<SequenceActivityTracker />` with `<ActivityTracker />`
  - Pass props:
    - entityId: sequence ID
    - entityName: sequence name
    - entityType: `'sequence'`
    - variant: `'card'`
    - checkActivity: `checkSequenceActivityExists`
    - createActivity: `createSequenceActivity`
    - deleteActivity: `deleteSequenceActivity`
    - title: `'Track Your Sequence Practice'`
    - buttonLabel: `'Track Sequence Practice'`
    - showSuccessMessage: `true`
    - onActivityToggle: existing callback (if any)

### 9.3 Test Sequence Activity Tracking

- Manually test the card variant in sequence practice pages
- Verify all UI elements render correctly
- Verify difficulty chip styling has proper white text contrast (fixed issue)
- Verify activity tracking works identically to series
- Test integration with WeeklyActivityTracker if applicable

---

## 10. Comprehensive Unit Testing

### 10.1 Create Test File Structure

- Create file `__test__/app/clientComponents/ActivityTracker.spec.tsx`
- Import testing utilities:
  - `@testing-library/react`: `render`, `screen`, `waitFor`
  - `@testing-library/user-event`: `userEvent`
  - `@testing-library/jest-dom`: assertions
- Import component and types
- Set up standard Soar test mocks:
  - Mock `next-auth/react` with `useSession`
  - Mock `next/navigation` if needed
  - Create mock session data
  - Create mock service functions

### 10.2 Create Test Setup and Helpers

- Create `mockSession` object with valid user data
- Create mock service functions:
  - `mockCheckActivity`: Returns { exists: false } by default
  - `mockCreateActivity`: Jest mock function
  - `mockDeleteActivity`: Jest mock function
- Create default props object for component testing
- Create test wrapper component with necessary providers (SessionProvider, ThemeProvider)

### 10.3 Implement Rendering Tests

- Test: "renders inline variant without errors"
  - Render component with variant="inline"
  - Verify difficulty chips are present
  - Verify button is present
  - Verify checkbox is present
  - Verify no Paper wrapper
- Test: "renders card variant without errors"
  - Render component with variant="card"
  - Verify Paper wrapper is present
  - Verify title displays
  - Verify all controls are present
- Test: "renders with custom title"
  - Pass custom title prop
  - Verify custom title displays instead of default
- Test: "renders with custom button label"
  - Pass custom buttonLabel prop
  - Verify custom label displays

### 10.4 Implement Props Tests

- Test: "uses default variant (card) when not specified"
  - Render without variant prop
  - Verify card layout renders
- Test: "uses default title based on entityType"
  - Render with entityType="asana" and no title prop
  - Verify default asana title displays
  - Repeat for series and sequence
- Test: "uses default buttonLabel based on entityType"
  - Render with entityType="asana" and no buttonLabel prop
  - Verify default asana label displays
  - Repeat for series and sequence
- Test: "showSuccessMessage defaults correctly"
  - Verify false for inline variant
  - Verify true for card variant

### 10.5 Implement Difficulty Selection Tests

- Test: "Easy chip toggles selection on click"
  - Click Easy chip
  - Verify chip changes to filled variant
  - Verify other chips remain outlined
  - Click Easy chip again
  - Verify chip changes back to outlined
- Test: "Average chip toggles selection on click"
  - Click Average chip
  - Verify chip changes to filled variant
  - Verify other chips remain outlined
- Test: "Difficult chip toggles selection on click"
  - Click Difficult chip
  - Verify chip changes to filled variant
  - Verify other chips remain outlined
- Test: "only one difficulty can be selected at a time"
  - Click Easy chip (becomes filled)
  - Click Average chip
  - Verify Average is filled, Easy is outlined
  - Click Difficult chip
  - Verify Difficult is filled, others are outlined
- Test: "difficulty chips have correct colors"
  - Verify Easy uses success color (green)
  - Verify Average uses info color (blue)
  - Verify Difficult uses error color (red)
- Test: "filled chips have white text and bold font"
  - Click Easy chip
  - Verify chip has white text color
  - Verify chip has font weight 700

### 10.6 Implement Activity Toggle Tests

- Test: "button click creates activity with correct data"
  - Click a difficulty chip
  - Click the track button
  - Wait for async operation
  - Verify mockCreateActivity was called with correct parameters
  - Verify button changes to success state ("Tracked in Activity")
- Test: "checkbox change creates activity"
  - Click a difficulty chip
  - Click the checkbox
  - Verify mockCreateActivity was called
  - Verify button state updates
- Test: "button click deletes activity when unchecking"
  - Set up component with existing activity (checked state)
  - Click button to uncheck
  - Verify mockDeleteActivity was called with correct parameters
  - Verify difficulty selection is reset
- Test: "loading state disables controls"
  - Mock createActivity to delay
  - Click track button
  - Verify button is disabled
  - Verify checkbox is disabled
  - Verify button shows "Saving..."
- Test: "activity includes selected difficulty"
  - Click Difficult chip
  - Click track button
  - Verify createActivity was called with difficulty: 'difficult'
- Test: "activity includes additional data from props"
  - Pass additionalActivityData prop
  - Create activity
  - Verify createActivity was called with merged data

### 10.7 Implement Session Integration Tests

- Test: "component returns null without session"
  - Mock useSession to return null session
  - Render component
  - Verify component doesn't render (returns null)
- Test: "error displays when session is missing during toggle"
  - Mock useSession to return null after mount
  - Try to create activity
  - Verify error message displays
  - Verify activity was not created
- Test: "uses correct userId from session"
  - Mock session with specific userId
  - Create activity
  - Verify checkActivity and createActivity called with correct userId

### 10.8 Implement Error Handling Tests

- Test: "displays error message when createActivity fails"
  - Mock createActivity to throw error
  - Create activity
  - Verify error message displays to user
  - Verify checked state is reverted
- Test: "displays error message when deleteActivity fails"
  - Set up existing activity
  - Mock deleteActivity to throw error
  - Delete activity
  - Verify error message displays
  - Verify checked state is reverted
- Test: "error clears on successful retry"
  - Trigger an error
  - Verify error displays
  - Mock successful operation
  - Retry operation
  - Verify error message clears

### 10.9 Implement Integration Tests

- Test: "onActivityToggle callback invoked on create"
  - Pass mock onActivityToggle callback
  - Create activity
  - Verify callback was called with true
- Test: "onActivityToggle callback invoked on delete"
  - Set up existing activity
  - Pass mock onActivityToggle callback
  - Delete activity
  - Verify callback was called with false
- Test: "onActivityRefresh callback invoked after create"
  - Pass mock onActivityRefresh callback
  - Create activity
  - Verify callback was called
- Test: "onActivityRefresh callback invoked after delete"
  - Set up existing activity
  - Pass mock onActivityRefresh callback
  - Delete activity
  - Verify callback was called
- Test: "loads existing activity on mount"
  - Mock checkActivity to return existing activity with difficulty
  - Render component
  - Wait for effect to complete
  - Verify component shows checked state
  - Verify correct difficulty chip is filled
- Test: "restores saved difficulty from existing activity"
  - Mock checkActivity to return activity with difficulty: 'average'
  - Render component
  - Verify Average chip is filled
  - Verify other chips are outlined

### 10.10 Implement Success Message Tests

- Test: "success message displays when showSuccessMessage is true and checked"
  - Render card variant (showSuccessMessage defaults to true)
  - Create activity
  - Verify success message is visible
- Test: "success message hidden when showSuccessMessage is false"
  - Pass showSuccessMessage={false}
  - Create activity
  - Verify success message is not present
- Test: "success message hidden when not checked"
  - Render card variant
  - Verify success message is not present initially

### 10.11 Implement Accessibility Tests

- Test: "button has accessible label"
  - Verify button can be found by role and name
- Test: "checkbox has accessible label"
  - Verify checkbox can be found by role
- Test: "difficulty chips are keyboard accessible"
  - Tab to each chip
  - Verify chips can be activated with Enter/Space

### 10.12 Verify Test Coverage

- Run test coverage report: `npm run test:coverage -- ActivityTracker`
- Verify 100% line coverage
- Verify 100% branch coverage
- Verify 100% function coverage
- Verify 100% statement coverage
- Address any uncovered lines or branches

---

## 11. Cleanup and Documentation

### 11.1 Remove Deprecated Components

- Delete file `app/clientComponents/seriesActivityTracker/SeriesActivityTracker.tsx`
- Delete file `app/clientComponents/sequenceActivityTracker/SequenceActivityTracker.tsx`
- Remove the directories if they become empty
- Search codebase for any remaining imports of deprecated components
- Remove any stale imports or references

### 11.2 Update Component Documentation

- Add comprehensive JSDoc comments to `ActivityTracker.tsx`
- Document all props with descriptions and examples
- Add usage examples for all three entity types
- Document the difference between inline and card variants

### 11.3 Verify ESLint and TypeScript

- Run `npm run lint-fix` to check for linting errors
- Verify no TypeScript errors in new component
- Ensure strict mode compliance
- Fix any remaining warnings or errors

### 11.4 Update CHANGELOG

- Add entry to `CHANGELOG.md` describing the consolidation
- List the deprecated components
- Note the benefits (reduced code, improved consistency)
- Document any breaking changes (should be none)

---

## 12. Final Validation and Testing

### 12.1 Run Full Test Suite

- Execute `npm run test` to run all tests
- Verify all ActivityTracker tests pass
- Verify no regression in other component tests
- Fix any failing tests

### 12.2 Manual Testing Checklist

- Test asana activity tracking on pose detail page:
  - Create activity with each difficulty level
  - Verify WeeklyActivityTracker updates
  - Delete activity and verify reset
  - Test error scenarios
- Test series activity tracking:
  - Verify card variant UI displays correctly
  - Test difficulty selection and activity tracking
  - Verify success message displays
  - Test on mobile viewport
- Test sequence activity tracking:
  - Verify chip styling has proper contrast
  - Test all functionality identical to series
  - Verify integration with other components

### 12.3 Performance Validation

- Profile component render performance
- Verify no unnecessary re-renders
- Check bundle size impact (should be smaller)
- Verify page load times haven't regressed

### 12.4 Accessibility Audit

- Run Lighthouse accessibility audit on pages with ActivityTracker
- Verify keyboard navigation works for all controls
- Test with screen reader (if available)
- Ensure ARIA labels are appropriate

### 12.5 Code Review Preparation

- Review all changes for code quality
- Verify consistent naming conventions
- Check for code duplication or refactoring opportunities
- Ensure comments and documentation are clear
- Prepare summary of changes for code review

---

## 13. Success Metrics Collection

### 13.1 Measure Code Reduction

- Count total lines removed from deprecated components
- Count lines in new unified component
- Calculate net reduction in codebase
- Document savings in implementation notes

### 13.2 Validate Functionality Preservation

- Create checklist of all features from original implementations
- Verify each feature works in unified component
- Document any differences or improvements
- Confirm zero regressions

### 13.3 Performance Comparison

- Measure component render time before and after
- Compare bundle size before and after
- Measure page load times for affected pages
- Document performance impact (should be neutral or positive)

---

## Notes for Implementation

### Key Technical Decisions

- Service functions passed as props for maximum flexibility
- Variant prop controls UI structure (inline vs card)
- Default values based on entityType for convenience
- All callbacks are optional for different integration scenarios
- Early return for unauthenticated users matches existing behavior

### Common Pitfalls to Avoid

- Don't forget to reset difficulty when deleting activity
- Ensure error state reverts optimistic UI updates on failure
- Remember to call both callbacks (onActivityToggle and onActivityRefresh) when provided
- Test all three entity types, not just one
- Verify mobile responsiveness for both variants

### Testing Best Practices

- Mock all external dependencies (session, service functions)
- Test both success and failure paths
- Verify callbacks are invoked with correct parameters
- Test accessibility and keyboard navigation
- Ensure tests are deterministic and don't depend on timing

### Migration Strategy

- Migrate one entity type at a time (asana, then series, then sequence)
- Test thoroughly after each migration before proceeding
- Keep deprecated components until all migrations are verified
- Document any issues or edge cases discovered during migration

---

**Total Estimated Tasks:** 60+ individual tasks across 13 major sections
**Estimated Effort:** 3-5 days for full implementation and testing
**Priority:** High - Code Quality and Maintainability Improvement
