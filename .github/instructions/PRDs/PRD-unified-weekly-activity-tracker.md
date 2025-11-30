# PRD: Unified Weekly Activity Tracker Component

## Overview

Consolidate three nearly identical Weekly Activity Tracker components (`SeriesWeeklyActivityTracker`, `SequenceWeeklyActivityTracker`, and the existing `WeeklyActivityTracker`) into a single, reusable component that supports all entity types (asana, series, and sequence) through props-based configuration. This refactoring will eliminate code duplication, improve maintainability, and provide a consistent user experience across all yoga practice tracking features.

## Problem Statement

Currently, the Soar yoga application has three separate activity tracker components with 95% code duplication:

- `SeriesWeeklyActivityTracker.tsx` (207 lines)
- `SequenceWeeklyActivityTracker.tsx` (207 lines)
- `WeeklyActivityTracker.tsx` (289 lines)

This duplication creates several problems:

1. **Maintenance burden**: Bug fixes and feature enhancements must be applied to three files
2. **Inconsistent behavior**: Changes in one component may not be replicated in others
3. **Increased bundle size**: Redundant code increases the application's JavaScript bundle
4. **Testing overhead**: Three components require three separate test suites with duplicated test logic

The existing `WeeklyActivityTracker` component already demonstrates a unified approach with `entityType` prop support, but the standalone Series and Sequence trackers continue to exist, creating confusion about which component to use.

## Target Users

- **Yoga Practitioners**: Users tracking their weekly asana, series, and sequence practice activities
- **Frontend Developers**: Engineers maintaining and extending activity tracking features
- **QA Engineers**: Testing team members verifying activity tracker functionality across entity types

## Scope

### In-Scope

1. **Component Consolidation**:

   - Merge all three activity tracker components into a single `WeeklyActivityTracker` component
   - Support all three entity types (asana, series, sequence) through props
   - Maintain all existing functionality from the original three components

2. **Props-Based Configuration**:

   - `entityType` prop to specify tracker type ('asana' | 'series' | 'sequence')
   - `entityId` prop for the entity identifier
   - `entityName` prop for display purposes
   - `variant` prop for display mode ('compact' | 'detailed')
   - `refreshTrigger` prop for forcing data refresh

3. **Display Customization**:

   - Dynamic titles based on entity type
   - Appropriate activity list labels per entity type
   - Context-aware tooltip and help text

4. **Backward Compatibility**:

   - Update all existing imports to use the unified component
   - Verify no breaking changes to component consumers

5. **Testing Updates**:

   - Consolidate test suites into comprehensive unified component tests
   - Test all entity types with the unified component
   - Maintain or improve test coverage

6. **Code Cleanup**:
   - Remove deprecated standalone components (`SeriesWeeklyActivityTracker`, `SequenceWeeklyActivityTracker`)
   - Remove associated test files for deprecated components
   - Update any documentation referencing old components

### Out-of-Scope

1. **New Features**: No new functionality beyond what exists in the three current components
2. **UI Redesign**: Maintain existing visual design and layout
3. **Data Layer Changes**: No modifications to activity data fetching services or API endpoints
4. **Performance Optimization**: Beyond what naturally results from code consolidation
5. **Internationalization**: No translation or localization features (future enhancement)
6. **Historical Data View**: No expanded date range views beyond current week
7. **Export Functionality**: No data export or download features
8. **Comparison Features**: No side-by-side comparison of different entity activities

## Functional Requirements

### Core Functionality

1. **Unified Component Interface**:

   - Single component file: `app/clientComponents/WeeklyActivityTracker.tsx`
   - Accept props for entity type, ID, name, display variant, and refresh trigger
   - Dynamically determine appropriate data fetching service based on entity type

2. **Entity Type Support**:

   - Support 'asana' entity type using `getPoseWeeklyActivity` service
   - Support 'series' entity type using `getSeriesWeeklyActivity` service
   - Support 'sequence' entity type using `getSequenceWeeklyActivity` service
   - Validate entity type prop and provide clear error messages for invalid types

3. **Display Variants**:

   - **Compact variant**: Single-row summary with icon, title, activity count chip, and last performed tooltip
   - **Detailed variant**: Expanded card with header, statistics, streak information, and chronological activity list

4. **Dynamic Content Rendering**:

   - Title text adapts to entity type (e.g., "Weekly Activity" for asana, "Weekly Series Activity" for series)
   - Activity list labels reflect entity type (e.g., "All Series Practice This Week" for series)
   - Consistent styling and layout across all entity types

5. **Activity Data Display**:
   - Show total weekly activity count
   - Display last performed date with relative time formatting
   - Show streak status with color-coded chips
   - List all activity sessions with date, time, completion status, and difficulty

### User Interface Requirements

1. **Compact Variant Layout**:

   - Horizontal layout with icon and title on left
   - Activity count and calendar icon on right
   - MUI Paper component with elevation 2
   - Tooltips for activity count and last performed date

2. **Detailed Variant Layout**:

   - Full-width card with responsive max-width (600px on desktop)
   - Header section with icon and title
   - Main stats section with large count display and streak information
   - Divider-separated sections for visual hierarchy
   - Scrollable activity list for sessions exceeding viewport

3. **Loading States**:

   - Display `LoadingSkeleton` component during data fetch
   - Skeleton height matches variant (60px for compact, 120px for detailed)
   - Smooth transition from loading to loaded state

4. **Error States**:

   - Error box with red background for failed data fetches
   - Display user-friendly error message
   - Maintain component structure to prevent layout shifts

5. **Empty States**:

   - Return `null` (no render) when no activity data exists
   - Return `null` when activity count is zero
   - Prevents visual clutter for entities without recent practice

6. **Accessibility**:
   - Semantic HTML structure with proper heading hierarchy
   - ARIA labels for interactive elements
   - Tooltip accessibility for additional context
   - Keyboard navigation support for all interactive elements

### Integration Requirements

1. **Authentication Integration**:

   - Use NextAuth `useSession` hook for user identification
   - Fetch activity data only for authenticated users
   - Handle session loading and unauthenticated states gracefully

2. **Context Provider Integration**:

   - No direct context provider dependencies (standalone component)
   - Props-driven design for maximum reusability
   - Compatible with Soar's context provider hierarchy

3. **Service Layer Integration**:

   - Call `asanaActivityClientService.getPoseWeeklyActivity` for asana entities
   - Call `seriesActivityClientService.getSeriesWeeklyActivity` for series entities
   - Call `sequenceActivityClientService.getSequenceWeeklyActivity` for sequence entities
   - Handle service errors with user-friendly messages

4. **Component Consumers**:
   - Update all imports in components currently using `SeriesWeeklyActivityTracker`
   - Update all imports in components currently using `SequenceWeeklyActivityTracker`
   - Verify existing `WeeklyActivityTracker` usages continue to work
   - Search codebase for all three component references

### Data Requirements

1. **Props Interface**:

   ```typescript
   interface WeeklyActivityTrackerProps {
     entityId: string
     entityName: string
     entityType: 'asana' | 'series' | 'sequence'
     variant?: 'compact' | 'detailed'
     refreshTrigger?: number
   }
   ```

2. **Activity Data Structure**:

   - Unified type supporting all three entity types
   - Activity records include: id, datePerformed, completionStatus, difficulty
   - Weekly summary includes: count, activities array

3. **Data Validation**:
   - Validate entity type is one of allowed values
   - Validate entityId is non-empty string
   - Handle malformed or missing data gracefully

## User Stories

### Primary User Stories

**As a** yoga practitioner using the Soar app
**I want** to see my weekly activity for any yoga practice (asana, series, or sequence)
**So that** I can track my consistency and progress across all practice types

**Acceptance Criteria:**

- [ ] Component displays weekly activity count for asana entities
- [ ] Component displays weekly activity count for series entities
- [ ] Component displays weekly activity count for sequence entities
- [ ] All entity types show identical visual styling and layout
- [ ] Activity data updates when refreshTrigger prop changes

**As a** yoga practitioner
**I want** to see detailed information about my practice sessions in the detailed variant
**So that** I can review when and how I completed each session

**Acceptance Criteria:**

- [ ] Detailed variant shows all sessions in chronological order
- [ ] Each session displays date, time, completion status, and difficulty
- [ ] Sessions are color-coded based on completion status and difficulty
- [ ] List is scrollable when sessions exceed viewport height

**As a** developer maintaining the Soar codebase
**I want** a single, unified activity tracker component
**So that** I can fix bugs and add features in one place instead of three

**Acceptance Criteria:**

- [ ] Only one `WeeklyActivityTracker` component exists in the codebase
- [ ] All three entity types are supported through the same component
- [ ] Component has comprehensive unit tests covering all entity types
- [ ] Old standalone components are removed from the codebase

### Secondary User Stories

**As a** yoga practitioner
**I want** to see appropriate titles and labels for each entity type
**So that** I understand what type of practice activity is being displayed

**Acceptance Criteria:**

- [ ] Asana tracker shows "Weekly Activity" title in compact mode
- [ ] Series tracker shows "Weekly Series Activity" title in compact mode
- [ ] Sequence tracker shows "Weekly Activity" title in compact mode
- [ ] Detailed variant titles include entity type appropriately
- [ ] Activity list labels reflect entity type (e.g., "All Series Practice This Week")

**As a** developer
**I want** clear error messages when invalid props are provided
**So that** I can quickly identify and fix integration issues

**Acceptance Criteria:**

- [ ] Console error logged for invalid entity type values
- [ ] Error state displayed when data fetching fails
- [ ] Error messages are specific and actionable
- [ ] Component doesn't crash with invalid props

## Technical Requirements

### Frontend Requirements

1. **Component Architecture**:

   - Single TypeScript React functional component
   - Client-side component using 'use client' directive
   - Hooks-based state management (useState, useEffect)
   - Props interface with TypeScript type safety

2. **MUI Component Usage**:

   - Paper component for card containers
   - Stack component for flexible layouts
   - Typography component for text elements
   - Chip component for status and streak displays
   - Tooltip component for contextual information
   - Divider component for visual separation
   - Box component for custom layouts

3. **State Management**:

   - Local component state for weekly activity data
   - Loading state for data fetch progress
   - Error state for failure scenarios
   - No global state dependencies

4. **Styling Approach**:
   - MUI sx prop for responsive styles
   - Consistent styling across all entity types
   - Mobile-first responsive design
   - Elevation and border styling for depth

### Backend Requirements

**No backend changes required** - existing services support all needed functionality:

- `asanaActivityClientService.getPoseWeeklyActivity`
- `seriesActivityClientService.getSeriesWeeklyActivity`
- `sequenceActivityClientService.getSequenceWeeklyActivity`

### Data Requirements

1. **TypeScript Types**:

   - Unified `WeeklyActivityData` type alias
   - Supports `AsanaWeeklyActivityData`, `WeeklySeriesActivityData`, `WeeklySequenceActivityData`
   - Strong typing for props interface
   - Type guards for entity type validation

2. **Data Flow**:
   - User authentication via NextAuth session
   - Service selection based on entity type prop
   - Data fetching on component mount and refresh trigger changes
   - State updates trigger re-renders

## Success Criteria

### User Experience Metrics

1. **Consistency**: All entity types display with identical styling and behavior
2. **Usability**: Component is intuitive and requires no explanation for practitioners
3. **Performance**: No noticeable performance degradation from consolidation
4. **Accessibility**: Meets WCAG 2.1 AA standards for accessibility

### Technical Metrics

1. **Code Reduction**: Eliminate ~400 lines of duplicated code
2. **Test Coverage**: Maintain or exceed current test coverage levels (>80%)
3. **Bundle Size**: Reduce JavaScript bundle size by removing duplicate components
4. **Maintainability**: Single source of truth for all activity tracker logic

## Dependencies

### Internal Dependencies

1. **Existing Components**:

   - `LoadingSkeleton` component for loading states
   - MUI theme from `app/styles/theme.ts`

2. **Client Services**:

   - `lib/asanaActivityClientService` - getPoseWeeklyActivity function
   - `lib/seriesActivityClientService` - getSeriesWeeklyActivity function
   - `lib/sequenceActivityClientService` - getSequenceWeeklyActivity function

3. **Authentication**:

   - NextAuth `useSession` hook for user identification
   - NextAuth session typing from `next-auth.d.ts`

4. **Type Definitions**:
   - `WeeklyActivityData` from asanaActivityClientService
   - `WeeklySeriesActivityData` from seriesActivityClientService
   - `WeeklySequenceActivityData` from sequenceActivityClientService

### External Dependencies

1. **Third-Party Libraries**:

   - `next-auth/react` for authentication
   - `@mui/material` for UI components
   - `@mui/icons-material` for icons
   - React for component framework

2. **No New Dependencies**: All required libraries already exist in project

## Risks and Considerations

### Technical Risks

1. **Breaking Changes**: Existing component consumers may break if not updated

   - **Mitigation**: Comprehensive search and replace for all component imports
   - **Mitigation**: Test all component consumers before deployment

2. **Type Compatibility**: Different weekly activity data types may have subtle differences

   - **Mitigation**: Use type union for `WeeklyActivityData`
   - **Mitigation**: Verify all data structures are compatible

3. **Service Integration**: Different service signatures might cause runtime errors
   - **Mitigation**: Add error boundaries around service calls
   - **Mitigation**: Comprehensive testing for all entity types

### User Experience Risks

1. **Visual Regression**: Consolidation might introduce subtle UI differences

   - **Mitigation**: Visual regression testing comparing old vs new components
   - **Mitigation**: Manual QA review of all entity types in both variants

2. **Performance Impact**: Dynamic entity type switching might affect performance
   - **Mitigation**: Profile component rendering performance
   - **Mitigation**: Ensure service calls are memoized appropriately

## Implementation Notes

### File Structure Impact

**Files to Modify**:

- `app/clientComponents/WeeklyActivityTracker.tsx` - Already exists and partially implements unified approach, enhance to be the single source

**Files to Create**:

- `__test__/app/clientComponents/WeeklyActivityTracker.spec.tsx` - Comprehensive test suite (may already exist, needs updates)

**Files to Remove**:

- `app/clientComponents/seriesActivityTracker/SeriesWeeklyActivityTracker.tsx`
- `app/clientComponents/sequenceActivityTracker/SequenceWeeklyActivityTracker.tsx`
- `__test__/app/clientComponents/seriesActivityTracker/SeriesWeeklyActivityTracker.spec.tsx` (if exists)
- `__test__/app/clientComponents/sequenceActivityTracker/SequenceWeeklyActivityTracker.spec.tsx` (if exists)

**Files to Search and Update** (replace imports):

- All files importing `SeriesWeeklyActivityTracker`
- All files importing `SequenceWeeklyActivityTracker`
- Any documentation files referencing these components

### Testing Strategy

1. **Unit Tests**:

   - Test all three entity types (asana, series, sequence)
   - Test both variants (compact, detailed)
   - Test loading, error, and empty states
   - Test data formatting functions (formatLastPerformed, getStreakColor, etc.)
   - Test refresh trigger functionality
   - Mock NextAuth session and all service calls

2. **Integration Tests**:

   - Test component renders correctly with real-ish data
   - Test service calls with different entity types
   - Test error handling for network failures

3. **Accessibility Tests**:

   - Run axe-core accessibility checks
   - Verify keyboard navigation
   - Test screen reader compatibility

4. **Visual Regression Tests**:
   - Compare screenshots of old vs new components
   - Verify no unintended visual changes

### Migration Path

1. **Phase 1**: Enhance existing `WeeklyActivityTracker` to be feature-complete
2. **Phase 2**: Create comprehensive test suite for unified component
3. **Phase 3**: Search and replace all imports across codebase
4. **Phase 4**: Remove old standalone components
5. **Phase 5**: Clean up unused test files
6. **Phase 6**: Update documentation and README files

## Future Considerations

1. **Monthly/Yearly Views**: Extend component to support different time ranges
2. **Comparative Analysis**: Show week-over-week or period-over-period comparisons
3. **Goal Setting**: Integrate weekly goals and progress indicators
4. **Sharing Features**: Allow users to share their weekly activity summaries
5. **Customization**: User preferences for display format and metrics
6. **Data Export**: CSV or JSON export of activity history
7. **Internationalization**: Support multiple languages and date formats
8. **Offline Support**: Cache activity data for offline viewing
9. **Push Notifications**: Weekly summary notifications
10. **Gamification**: Badges and achievements for weekly consistency

## Appendix: Current Component Analysis

### Code Duplication Breakdown

**Identical Functionality (100% duplication)**:

- Loading skeleton display logic
- Error state handling and display
- Empty state handling (return null)
- Compact variant layout and rendering
- Detailed variant layout and rendering
- Date formatting functions (formatLastPerformed)
- Streak calculation functions (getStreakColor, getStreakLabel)
- Difficulty color mapping (getDifficultyColor)
- Activity list rendering logic
- MUI styling and responsive design

**Differences (Only 5-10% of code)**:

- Service function imports (3 different services)
- Service function calls in useEffect (one line per component)
- Title text generation (2-3 helper functions)
- Activity list labels (one string per entity type)

### Component Size Comparison

- `SeriesWeeklyActivityTracker.tsx`: 207 lines
- `SequenceWeeklyActivityTracker.tsx`: 207 lines
- `WeeklyActivityTracker.tsx`: 289 lines (already unified, includes all entity type logic)

**Total lines of code**: 703 lines
**Expected unified component**: ~300 lines
**Code reduction**: ~400 lines (57% reduction in duplicated code)
