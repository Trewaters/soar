# PRD: Unified Activity Tracker Component

## Overview

Consolidate three separate activity tracking implementations (Asana, Series, and Sequence) into a single, reusable `ActivityTracker` component. This refactoring will eliminate ~500+ lines of duplicated code while maintaining all existing functionality and improving consistency across the Soar yoga application.

## Problem Statement

Currently, the Soar application has three nearly identical implementations for tracking yoga practice activities:

1. **Inline Asana tracker** in `poseActivityDetail.tsx` (~250 lines)
2. **SeriesActivityTracker** component (~234 lines)
3. **SequenceActivityTracker** component (~220 lines)

Each implementation duplicates the same logic for:

- Difficulty selection chips (Easy, Average, Difficult)
- Activity toggle button and checkbox
- State management for selected difficulty and activity status
- Session validation and error handling
- Loading states during async operations

This duplication leads to:

- Increased maintenance burden (bug fixes must be applied three times)
- Inconsistent styling (SequenceActivityTracker missing proper chip contrast)
- Harder to add new features across all activity types
- Larger bundle size and more code to test

## Target Users

### Primary Users

- **Frontend developers** maintaining and extending activity tracking features
- **QA engineers** testing activity tracking functionality
- **UX designers** ensuring consistent user experience across yoga practice tracking

### Secondary Users

- **Yoga practitioners** who will benefit from consistent UI/UX across all activity tracking
- **Future developers** who need to understand and modify activity tracking

## Scope

### In-Scope

#### Core Functionality

1. **Create unified `ActivityTracker` component** that supports all three entity types (asana, series, sequence)
2. **Maintain all existing features** from the three current implementations
3. **Support configuration via props** for entity-specific behavior
4. **Implement consistent styling** across all instances (including proper chip contrast)
5. **Preserve integration** with `WeeklyActivityTracker` where applicable
6. **Support optional UI elements** (Paper wrapper, title, success message)
7. **Update all three usage locations** to use the new unified component
8. **Create comprehensive unit tests** for the new component

#### Styling Improvements

1. Apply consistent difficulty chip styling with proper white text contrast
2. Ensure all filled chips have bold font weight (700)
3. Maintain color scheme: Easy (green), Average (blue), Difficult (red)
4. Support both standalone and inline usage variants

#### Backwards Compatibility

1. Maintain exact same user experience as current implementations
2. Preserve all API calls and data structures
3. Keep existing prop interfaces for WeeklyActivityTracker integration
4. Ensure no breaking changes to parent components

### Out-of-Scope

1. **Changing activity data models** or database schemas
2. **Modifying API endpoints** or backend service logic
3. **Adding new activity tracking features** beyond consolidation
4. **Redesigning the UI/UX** of activity tracking (maintain current design)
5. **Refactoring service layer functions** (use existing service functions)
6. **Changing authentication flow** or session management
7. **Modifying WeeklyActivityTracker component** (keep as separate component)

## Functional Requirements

### Core Component API

#### Component Props Interface

```typescript
interface ActivityTrackerProps {
  // Entity identification
  entityId: string
  entityName: string
  entityType: 'asana' | 'series' | 'sequence'

  // Service function configuration
  checkActivity: (
    userId: string,
    entityId: string
  ) => Promise<CheckActivityResult>
  createActivity: (data: CreateActivityData) => Promise<void>
  deleteActivity: (userId: string, entityId: string) => Promise<void>

  // UI configuration
  variant?: 'inline' | 'card' // Default: 'card'
  title?: string // Default: based on entityType
  showSuccessMessage?: boolean // Default: true for card, false for inline
  buttonLabel?: string // Default: based on entityType

  // Integration callbacks
  onActivityToggle?: (isTracked: boolean) => void
  onActivityRefresh?: () => void // For WeeklyActivityTracker refresh trigger

  // Additional data for activity creation
  additionalActivityData?: Record<string, any>
}

interface CheckActivityResult {
  exists: boolean
  activity?: {
    difficulty?: string
    completionStatus?: string
    datePerformed?: string
  }
}

interface CreateActivityData {
  userId: string
  difficulty?: string
  completionStatus: string
  datePerformed: Date
  [key: string]: any // Allow additional entity-specific fields
}
```

### Difficulty Selection Requirements

1. **Three difficulty options**: Easy, Average, Difficult
2. **Single selection**: Only one difficulty can be selected at a time
3. **Visual states**:
   - Outlined variant: Unselected state with default color
   - Filled variant: Selected state with entity-appropriate color
4. **Color scheme**:
   - Easy: `success` (green) with white text when filled
   - Average: `info` (blue) with white text when filled
   - Difficult: `error` (red) with white text when filled
5. **Styling requirements**:
   - Font weight 700 (bold) when filled
   - Font weight 400 (normal) when outlined
   - White text color on filled chips for all difficulties
   - Cursor pointer to indicate interactivity
6. **Behavior**: Clicking a selected difficulty should deselect it (toggle behavior)

### Activity Toggle Requirements

1. **Dual control interface**:
   - Primary: Button with dynamic label
   - Secondary: Checkbox that mirrors button state
2. **Button states**:
   - Unchecked: Outlined, primary color, shows "Track [Entity] Practice"
   - Checked: Contained, success color, shows "Tracked in Activity"
   - Loading: Disabled, shows "Saving..."
3. **Checkbox behavior**: Synchronized with button state
4. **Session validation**: Require authenticated user before allowing activity creation
5. **Error handling**: Display user-friendly error messages for failures
6. **Loading state**: Disable all controls during async operations

### Activity Persistence Requirements

1. **Check existing activity** on component mount
2. **Load saved difficulty** if activity exists
3. **Create activity** with selected difficulty and completion status
4. **Delete activity** and reset difficulty selection when unchecked
5. **Update parent components** via callbacks after successful operations
6. **Trigger refresh** of related components (like WeeklyActivityTracker)

### UI Variant Requirements

#### Card Variant (Default)

- Wrapped in MUI Paper component
- Elevation: 2
- Padding: 2 (16px)
- Border: 1px solid divider color
- Includes title at top
- Shows success message when activity tracked
- Centered layout with full styling

#### Inline Variant

- No Paper wrapper
- Minimal padding
- No title display
- No success message
- Compact layout for embedding in existing pages
- All functionality identical to card variant

## User Stories

### Primary User Stories

**As a yoga practitioner**
**I want** to mark my asana practice with a difficulty level
**So that** I can track how challenging each pose feels over time

**Acceptance Criteria:**

- [ ] I can select Easy, Average, or Difficult for any asana
- [ ] My difficulty selection is saved with my activity
- [ ] I can see my selected difficulty highlighted with a filled chip
- [ ] I can change my difficulty selection before saving
- [ ] The difficulty colors are consistent: green (easy), blue (average), red (difficult)
- [ ] All difficulty chips have readable white text when selected

**As a yoga practitioner**
**I want** to track my series practice completion
**So that** I can monitor my progress through different yoga series

**Acceptance Criteria:**

- [ ] I can mark a series as completed with one button click
- [ ] I can select how difficult the series felt to me
- [ ] The system remembers if I've already tracked this series today
- [ ] I can untrack a series if I marked it by mistake
- [ ] I see a success message confirming my series practice was tracked

**As a yoga practitioner**
**I want** to track my sequence practice sessions
**So that** I can see my weekly practice consistency

**Acceptance Criteria:**

- [ ] I can mark a sequence as practiced with difficulty rating
- [ ] The tracking interface looks identical to asana and series tracking
- [ ] My sequence practice appears in the weekly activity tracker
- [ ] I can toggle the tracked state with either button or checkbox
- [ ] Loading states prevent duplicate submissions

### Secondary User Stories

**As a frontend developer**
**I want** one reusable activity tracker component
**So that** I can maintain activity tracking logic in a single location

**Acceptance Criteria:**

- [ ] Single component file supports all three entity types
- [ ] Props allow configuration of entity-specific behavior
- [ ] Service functions are passed as props for flexibility
- [ ] Component has comprehensive unit tests
- [ ] Component follows established Soar patterns and conventions

**As a frontend developer**
**I want** clear prop interfaces for the unified component
**So that** I can easily integrate it in different contexts

**Acceptance Criteria:**

- [ ] TypeScript interfaces document all props
- [ ] Required vs optional props are clearly defined
- [ ] Default values are documented
- [ ] Examples show both inline and card usage
- [ ] Integration with WeeklyActivityTracker is preserved

## Technical Requirements

### Frontend Requirements

#### Component Structure

- **Location**: `app/clientComponents/ActivityTracker.tsx`
- **Framework**: React with TypeScript
- **UI Library**: Material-UI (MUI) v5+
- **State Management**: React hooks (useState, useEffect)
- **Authentication**: NextAuth.js session management

#### Component Dependencies

```typescript
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import {
  Button,
  Stack,
  Chip,
  Typography,
  FormControlLabel,
  Checkbox,
  Box,
  Paper,
} from '@mui/material'
```

#### State Management

- `checked: boolean` - Activity tracking status
- `loading: boolean` - Async operation in progress
- `error: string | null` - Error message display
- `selectedDifficulty: string | null` - Current difficulty selection
- `easyChipVariant: 'filled' | 'outlined'` - Easy chip visual state
- `averageChipVariant: 'filled' | 'outlined'` - Average chip visual state
- `difficultChipVariant: 'filled' | 'outlined'` - Difficult chip visual state

#### Service Function Integration

Component should accept and use these service functions via props:

- Check activity exists: `checkActivity(userId, entityId)`
- Create activity: `createActivity(activityData)`
- Delete activity: `deleteActivity(userId, entityId)`

### Backend Requirements

**No backend changes required** - use existing service functions:

- `checkActivityExists` / `checkSeriesActivityExists` / `checkSequenceActivityExists`
- `createAsanaActivity` / `createSeriesActivity` / `createSequenceActivity`
- `deleteAsanaActivity` / `deleteSeriesActivity` / `deleteSequenceActivity`

### Data Requirements

#### Activity Data Structure

```typescript
{
  userId: string
  entityId: string  // poseId, seriesId, or sequenceId
  entityName: string
  difficulty?: 'easy' | 'average' | 'difficult'
  completionStatus: 'complete' | 'partial'
  datePerformed: Date
  duration?: number  // For asanas
  // Additional entity-specific fields
}
```

#### Integration Data Flow

1. Component mounts → Check existing activity via service function
2. User selects difficulty → Update local state (no API call)
3. User toggles activity → Create or delete via service function
4. Success → Call parent callbacks for refresh/updates
5. Error → Display error message, revert state

## Success Criteria

### User Experience Metrics

- Zero regression in existing functionality
- Consistent difficulty chip styling across all three entity types
- Same or better performance (component render time)
- Identical user workflows maintained

### Technical Metrics

- Reduce codebase by ~400-500 lines of duplicated code
- Single source of truth for activity tracking logic
- 100% test coverage for unified component
- All three existing usage locations successfully migrated
- No breaking changes to parent components or integrations

### Code Quality Metrics

- TypeScript strict mode compliance
- ESLint passes with no warnings
- Follows established Soar component patterns
- Clear prop documentation and examples
- Reusable and maintainable architecture

## Dependencies

### Internal Dependencies

#### Existing Components to Preserve

- `WeeklyActivityTracker` - Keep as separate component, integrate via callback
- `LoadingSkeleton` - May be used for loading states

#### Service Layer Functions (Unchanged)

- `app/lib/asanaActivityClientService.ts`
  - `checkActivityExists`
  - `createAsanaActivity`
  - `deleteAsanaActivity`
- `app/lib/seriesActivityClientService.ts`
  - `checkSeriesActivityExists`
  - `createSeriesActivity`
  - `deleteSeriesActivity`
- `app/lib/sequenceActivityClientService.ts`
  - `checkSequenceActivityExists`
  - `createSequenceActivity`
  - `deleteSequenceActivity`

#### Context Providers Required

- `SessionProvider` from NextAuth.js - For user authentication
- `ThemeProvider` from MUI - For consistent styling

#### Components to Update (Migration)

1. `app/navigator/asanaPoses/[pose]/poseActivityDetail.tsx`
   - Replace inline activity tracking code with `<ActivityTracker variant="inline" />`
   - Pass asana-specific service functions
   - Maintain WeeklyActivityTracker integration
2. `app/navigator/flows/practiceSeries` (usage location to verify)
   - Replace `<SeriesActivityTracker />` with `<ActivityTracker variant="card" />`
   - Pass series-specific service functions
3. Sequence practice pages (usage location to verify)
   - Replace `<SequenceActivityTracker />` with `<ActivityTracker variant="card" />`
   - Pass sequence-specific service functions

### External Dependencies

**No new external dependencies required**

- MUI v5+ (already in use)
- NextAuth.js v5 (already in use)
- React 18+ (already in use)
- TypeScript (already in use)

## Risks and Considerations

### Technical Risks

**Risk**: Breaking existing functionality during migration

- **Mitigation**: Implement comprehensive unit tests before migration
- **Mitigation**: Test all three entity types thoroughly
- **Mitigation**: Use feature flags if needed for gradual rollout

**Risk**: Type safety issues with generic service functions

- **Mitigation**: Use TypeScript generics and strict typing
- **Mitigation**: Create clear type definitions for all service function signatures
- **Mitigation**: Validate types at compile time

**Risk**: Props API becomes too complex

- **Mitigation**: Provide sensible defaults for most props
- **Mitigation**: Document clear usage examples
- **Mitigation**: Consider creating helper functions for common configurations

### User Experience Risks

**Risk**: Regression in activity tracking behavior

- **Mitigation**: Manual testing of all three entity types
- **Mitigation**: Verify existing activity data loads correctly
- **Mitigation**: Test error scenarios and edge cases

**Risk**: Styling inconsistencies across entity types

- **Mitigation**: Use theme constants for all colors
- **Mitigation**: Test in both light and dark modes (if applicable)
- **Mitigation**: Verify mobile responsiveness

**Risk**: Performance degradation with unified component

- **Mitigation**: Profile component render performance
- **Mitigation**: Use React.memo if needed
- **Mitigation**: Ensure no unnecessary re-renders

### Maintenance Risks

**Risk**: Complex prop interface makes component hard to use

- **Mitigation**: Provide comprehensive JSDoc comments
- **Mitigation**: Create usage examples in Storybook or documentation
- **Mitigation**: Consider creating wrapper components for common use cases

## Implementation Notes

### File Structure Impact

#### New Files to Create

```
app/clientComponents/ActivityTracker.tsx       # Unified component
app/clientComponents/ActivityTracker.types.ts  # TypeScript interfaces
__test__/app/clientComponents/ActivityTracker.spec.tsx  # Unit tests
```

#### Files to Modify

```
app/navigator/asanaPoses/[pose]/poseActivityDetail.tsx  # Replace inline code
[Usage locations for SeriesActivityTracker]             # Replace with new component
[Usage locations for SequenceActivityTracker]          # Replace with new component
```

#### Files to Deprecate (After Migration)

```
app/clientComponents/seriesActivityTracker/SeriesActivityTracker.tsx
app/clientComponents/sequenceActivityTracker/SequenceActivityTracker.tsx
```

### Testing Strategy

#### Unit Tests Required

1. **Rendering Tests**

   - Component mounts without errors in card variant
   - Component mounts without errors in inline variant
   - All difficulty chips render correctly
   - Button and checkbox render correctly

2. **Props Tests**

   - Required props are validated
   - Optional props use correct defaults
   - Custom titles and labels display correctly
   - Variant prop changes layout appropriately

3. **Difficulty Selection Tests**

   - Clicking Easy selects and deselects properly
   - Clicking Average selects and deselects properly
   - Clicking Difficult selects and deselects properly
   - Only one difficulty can be selected at a time
   - Chip styling updates correctly on selection

4. **Activity Toggle Tests**

   - Button click creates activity with correct data
   - Checkbox change creates activity with correct data
   - Unchecking deletes activity
   - Service functions called with correct parameters
   - Loading state prevents duplicate submissions

5. **Session Integration Tests**

   - Component requires authenticated session
   - Error displayed when session is missing
   - User ID passed correctly to service functions

6. **Error Handling Tests**

   - Service errors display user-friendly messages
   - Failed operations revert component state
   - Error state clears on successful retry

7. **Integration Tests**
   - Callbacks invoked after successful operations
   - WeeklyActivityTracker refresh triggered correctly
   - Existing activity loaded on mount
   - Saved difficulty restored correctly

#### Test Coverage Goals

- Line coverage: 100%
- Branch coverage: 100%
- Function coverage: 100%
- Statement coverage: 100%

### Migration Strategy

#### Phase 1: Create Unified Component

1. Create `ActivityTracker.tsx` with all features
2. Create comprehensive unit tests
3. Verify all tests pass
4. Document prop interface and usage examples

#### Phase 2: Migrate Asana Implementation

1. Update `poseActivityDetail.tsx` to use new component
2. Pass asana-specific service functions
3. Test inline variant thoroughly
4. Verify WeeklyActivityTracker integration

#### Phase 3: Migrate Series Implementation

1. Find and update all SeriesActivityTracker usage
2. Replace with ActivityTracker card variant
3. Test series-specific functionality
4. Verify success messages and callbacks

#### Phase 4: Migrate Sequence Implementation

1. Find and update all SequenceActivityTracker usage
2. Replace with ActivityTracker card variant
3. Test sequence-specific functionality
4. Verify consistent behavior with other entities

#### Phase 5: Cleanup

1. Remove deprecated SeriesActivityTracker component
2. Remove deprecated SequenceActivityTracker component
3. Update any documentation or references
4. Run full regression test suite

### Code Quality Guidelines

#### Component Organization

```typescript
// 1. Imports
// 2. Type definitions and interfaces
// 3. Component function declaration
// 4. Props destructuring with defaults
// 5. Hooks (useSession, useState, useEffect)
// 6. Helper functions
// 7. Event handlers
// 8. Effect for loading existing activity
// 9. Early returns (session check, etc.)
// 10. JSX return statement
```

#### Naming Conventions

- Component: `ActivityTracker` (PascalCase)
- Props interface: `ActivityTrackerProps`
- Type file: `ActivityTracker.types.ts`
- Test file: `ActivityTracker.spec.tsx`
- State variables: camelCase (e.g., `selectedDifficulty`)
- Handler functions: `handle*` prefix (e.g., `handleDifficultySelect`)

#### Styling Approach

- Use MUI `sx` prop for component-specific styles
- Reference theme colors via theme constants
- Maintain mobile-first responsive design
- Ensure accessibility with proper ARIA labels

## Future Considerations

### Potential Enhancements (Post-Implementation)

1. **Activity history view**: Show past activities with difficulties
2. **Streak tracking**: Display consecutive days of practice
3. **Analytics integration**: Track which difficulties are most common
4. **Social features**: Share completed activities with friends
5. **Gamification**: Badges or rewards for activity streaks
6. **Custom difficulty levels**: Allow users to define their own scales
7. **Notes field**: Add optional notes to tracked activities
8. **Duration tracking**: Expand duration tracking beyond asanas

### Scalability Considerations

1. **New entity types**: Design allows adding meditation, pranayama, etc.
2. **Custom service functions**: Props pattern supports new backend implementations
3. **Theme variations**: Component respects theme for white-label options
4. **Internationalization**: Component structure supports i18n for labels
5. **Offline support**: Consider local storage for offline activity creation

### Related Features to Consider

1. **Activity calendar view**: Visual representation of tracked activities
2. **Practice reminders**: Notifications to encourage regular practice
3. **Goal setting**: Set weekly or monthly activity goals
4. **Progress reports**: Generate activity summary reports
5. **Export functionality**: Export activity data for personal records

## Appendix

### Current Implementation Comparison

| Feature              | Asana (Inline) | Series (Card) | Sequence (Card) | Unified Component |
| -------------------- | -------------- | ------------- | --------------- | ----------------- |
| Lines of Code        | ~250           | ~234          | ~220            | ~200 (estimated)  |
| Difficulty Selection | ✅             | ✅            | ✅              | ✅                |
| Button + Checkbox    | ✅             | ✅            | ✅              | ✅                |
| Paper Wrapper        | ❌             | ✅            | ✅              | Configurable      |
| Title Display        | ❌             | ✅            | ✅              | Configurable      |
| Success Message      | ❌             | ✅            | ✅              | Configurable      |
| Proper Chip Contrast | ✅             | ✅            | ❌              | ✅                |
| Callback Support     | ✅             | ✅            | ✅              | ✅                |
| Type Safety          | ✅             | ✅            | ✅              | ✅                |

### Example Usage

#### Asana (Inline Variant)

```typescript
<ActivityTracker
  entityId={pose.id.toString()}
  entityName={pose.sort_english_name}
  entityType="asana"
  variant="inline"
  checkActivity={checkActivityExists}
  createActivity={createAsanaActivity}
  deleteActivity={deleteAsanaActivity}
  onActivityRefresh={() => setActivityRefreshTrigger(prev => prev + 1)}
  additionalActivityData={{
    sort_english_name: pose.sort_english_name,
    duration: 0,
  }}
/>
```

#### Series (Card Variant)

```typescript
<ActivityTracker
  entityId={series.id}
  entityName={series.name}
  entityType="series"
  variant="card"
  checkActivity={checkSeriesActivityExists}
  createActivity={createSeriesActivity}
  deleteActivity={deleteSeriesActivity}
  title="Track Your Practice"
  buttonLabel="Track Series Practice"
  showSuccessMessage={true}
  onActivityToggle={(isTracked) => console.log('Series tracked:', isTracked)}
/>
```

#### Sequence (Card Variant)

```typescript
<ActivityTracker
  entityId={sequence.id}
  entityName={sequence.name}
  entityType="sequence"
  variant="card"
  checkActivity={checkSequenceActivityExists}
  createActivity={createSequenceActivity}
  deleteActivity={deleteSequenceActivity}
  title="Track Your Sequence Practice"
  buttonLabel="Track Sequence Practice"
  showSuccessMessage={true}
/>
```

### Success Metrics Dashboard

Track these metrics post-implementation:

1. **Code Metrics**

   - Total lines of code reduced
   - Number of components consolidated
   - Test coverage percentage

2. **Performance Metrics**

   - Component render time (before vs after)
   - Bundle size impact
   - Page load time for affected pages

3. **Quality Metrics**

   - ESLint warnings/errors
   - TypeScript strict mode compliance
   - Accessibility score (Lighthouse)

4. **User Impact Metrics**
   - Activity tracking success rate
   - Error rate for activity operations
   - User reported issues (regressions)

---

**Document Version**: 1.0
**Created**: November 15, 2025
**Status**: Draft - Ready for Task Generation
**Priority**: High - Code Quality Improvement
