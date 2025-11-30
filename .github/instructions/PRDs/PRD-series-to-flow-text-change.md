# PRD: Display Text Change - "Series" to "Flow"

## Overview

This PRD defines a cosmetic text change throughout the Soar yoga application to replace the display text "series" with "flow" in all user-facing interfaces. This change reflects updated yoga terminology preferences while maintaining all existing function names, variable names, database schemas, and internal code references unchanged.

## Problem Statement

The current terminology "series" doesn't align with preferred yoga vocabulary. The term "flow" is more commonly used in yoga practice to describe a sequence of connected poses. Users and practitioners more intuitively understand "flow" when describing a collection of asanas that are practiced together.

## Target Users

- All yoga practitioners using the Soar application
- Users who create, view, and practice yoga flows
- Users viewing the navigation menu and landing pages

## Scope

### In-Scope

**Display text changes only in:**

- Navigation menu items (header, landing page)
- Page titles and headings (SplashHeader, SubNavHeader titles)
- Button labels and descriptions
- Form field labels and placeholders
- Search placeholders
- Tab labels
- Activity tracking labels
- Notification messages
- Toast messages and alerts
- Accessibility labels (aria-labels)
- Alt text for images where applicable
- Error messages shown to users
- Weekly activity labels

### Out-of-Scope

**The following must NOT be changed:**

- Function names (e.g., `getAllSeries`, `createSeries`, `deleteSeries`)
- Variable names (e.g., `series`, `seriesData`, `seriesId`)
- Context names (e.g., `AsanaSeriesContext`, `FlowSeriesData`)
- API route paths (e.g., `/api/series`, `/api/seriesActivity`)
- Database schema/Prisma model names (`AsanaSeries`, `SeriesActivity`)
- TypeScript interface/type names
- File names and directory names
- URL paths (e.g., `/navigator/flows/practiceSeries`)
- CSS class names
- Test file names
- Test describe block names (unless they test display text)
- Internal code comments (unless user-facing)
- Console logs
- Internal service names

## Functional Requirements

### Core Functionality

1. **Navigation Menu Text Changes**

   - Change `name: 'Series'` to `name: 'Flows'` in `components/header.tsx`
   - Change `name: 'Series'` to `name: 'Flows'` in `app/clientComponents/landing-page.tsx`

2. **Flows Page (`app/navigator/flows/page.tsx`) Text Changes**

   - "Practice Series" → "Practice Flows"
   - "Series are made up of asana poses." → "Flows are made up of asana poses."
   - "Create Series" → "Create Flow"
   - "Create your own Series of asana poses." → "Create your own Flow of asana poses."

3. **Practice Series Page (`app/navigator/flows/practiceSeries/page.tsx`) Text Changes**

   - Splash header title: "Practice Series" → "Practice Flows"
   - Search placeholder: "Search for a Series" → "Search for a Flow"
   - Loading text: "Loading series..." → "Loading flows..."
   - No options text: "No series found" → "No flows found"
   - Drawer text: "Pick a Series to practice." → "Pick a Flow to practice."
   - Edit button aria-label: "Edit series" → "Edit flow"

4. **Create Series Page (`app/navigator/flows/createSeries/page.tsx`) Text Changes**

   - Splash header title: "Create Series" → "Create Flow"
   - Alt text: "Create Series" → "Create Flow"
   - Search placeholder: "Add a pose to your series" → "Add a pose to your flow"
   - Name field placeholder: "Give your Series a name..." → "Give your Flow a name..."

5. **Edit Series Dialog (`app/navigator/flows/editSeries/`) Text Changes**

   - Dialog title: "Edit Series" → "Edit Flow"
   - "Create Series" → "Create Flow"
   - "Series Name" → "Flow Name"
   - Unauthorized message: "edit this series" → "edit this flow"
   - Form aria-label: "Series Form" → "Flow Form"

6. **Weekly Activity Viewer (`app/clientComponents/WeeklyActivityViewer.tsx`) Text Changes**

   - Entity type label: `'Series'` → `'Flow'`
   - Weekly title: "Weekly Series Activity" → "Weekly Flow Activity"
   - Activity list label: "All Series Practice This Week" → "All Flow Practice This Week"

7. **Profile Library Page (`app/navigator/profile/library/page.tsx`) Text Changes**

   - Tab label: `Series (${series.length})` → `Flows (${series.length})`
   - Error message: "Failed to load your series" → "Failed to load your flows"

8. **Freemium Notification Text Changes**

   - Feature description: "custom series" → "custom flows"

9. **Activity Tracker and Related Components**

   - Any display text showing "series" in activity tracking contexts

10. **Notification Service Display Text**
    - Milestone messages: "First series completed" → "First flow completed"

### User Interface Requirements

- All text changes must maintain consistent capitalization patterns:
  - "Flow" or "Flows" when used as a noun in titles/headings
  - "flow" or "flows" when used in sentences
- Maintain existing layout and spacing (text length changes should be minimal)
- Ensure all accessibility labels are updated

### Integration Requirements

- No changes to API contracts or data structures
- No changes to authentication or session management
- No database migrations required
- Test assertions for display text must be updated

## User Stories

### Primary User Stories

**As a** yoga practitioner
**I want** to see "Flow" terminology instead of "Series"
**So that** the app terminology aligns with common yoga vocabulary

**Acceptance Criteria:**

- [ ] All navigation menu items show "Flows" instead of "Series"
- [ ] All page titles show "Flow" or "Flows" instead of "Series"
- [ ] All button labels and descriptions use "flow" terminology
- [ ] All search placeholders reference "flow"
- [ ] All error messages use "flow" terminology

**As a** user creating custom yoga content
**I want** the create and edit interfaces to use "Flow" terminology
**So that** I understand I'm creating yoga flows

**Acceptance Criteria:**

- [ ] Create page title shows "Create Flow"
- [ ] Edit dialog title shows "Edit Flow"
- [ ] Form field labels use "flow" terminology
- [ ] Placeholder text references "flow"

**As a** user tracking my yoga practice
**I want** activity tracking to show "Flow" terminology
**So that** my practice history uses consistent terminology

**Acceptance Criteria:**

- [ ] Weekly activity shows "Flow Activity" labels
- [ ] Activity lists reference "flows" not "series"
- [ ] Milestone notifications use "flow" terminology

## Technical Requirements

### Frontend Requirements

- Text changes in React components via string literal updates
- No changes to component props, state, or logic
- No changes to TypeScript interfaces or types
- Update test assertions that verify display text

### Backend Requirements

- No backend changes required
- API response structures remain unchanged
- Database queries remain unchanged

### Data Requirements

- No data migrations required
- No schema changes required
- No data validation rule changes

## Success Criteria

### User Experience Metrics

- 100% of user-facing "series" text replaced with "flow"
- No broken UI layouts due to text length changes
- All accessibility labels updated consistently

### Technical Metrics

- All existing unit tests pass (after display text assertion updates)
- No changes to code coverage percentage
- No changes to API response formats
- No changes to database operations

## Dependencies

### Internal Dependencies

- `components/header.tsx` - Navigation menu
- `app/clientComponents/landing-page.tsx` - Landing page navigation
- `app/navigator/flows/page.tsx` - Flows main page
- `app/navigator/flows/practiceSeries/page.tsx` - Practice flows page
- `app/navigator/flows/createSeries/page.tsx` - Create flow page
- `app/navigator/flows/editSeries/EditSeriesDialog.tsx` - Edit flow dialog
- `app/navigator/flows/editSeries/SeriesEditorForm.tsx` - Flow editor form
- `app/clientComponents/WeeklyActivityViewer.tsx` - Activity tracking
- `app/navigator/profile/library/page.tsx` - User library
- `app/clientComponents/freemiumNotification/FreemiumNotification.tsx` - Freemium messages
- `app/lib/notificationService.ts` - Notification display text

### External Dependencies

- None - purely cosmetic text changes

## Risks and Considerations

### Technical Risks

- **Test fragility**: Test assertions that match display text will need updates
- **Missed occurrences**: Thorough search required to find all "series" display text
- **Alt text and accessibility**: Must ensure all accessibility-related text is updated

### User Experience Risks

- **Terminology confusion**: Users familiar with "series" may need adjustment period
- **Incomplete changes**: Inconsistent terminology if any occurrences are missed

## Implementation Notes

### File Structure Impact

**Files to modify (display text only):**

- `components/header.tsx`
- `app/clientComponents/landing-page.tsx`
- `app/navigator/flows/page.tsx`
- `app/navigator/flows/practiceSeries/page.tsx`
- `app/navigator/flows/createSeries/page.tsx`
- `app/navigator/flows/editSeries/EditSeriesDialog.tsx`
- `app/navigator/flows/editSeries/SeriesEditorForm.tsx`
- `app/clientComponents/WeeklyActivityViewer.tsx`
- `app/navigator/profile/library/page.tsx`
- `app/clientComponents/freemiumNotification/FreemiumNotification.tsx`
- `app/lib/notificationService.ts`

**Test files requiring assertion updates:**

- `__test__/components/header.spec.tsx`
- `__test__/app/navigator/flows/practiceSeries/page.spec.tsx`
- `__test__/app/clientComponents/tab-header.spec.tsx`
- `__test__/app/clientComponents/WeeklyActivityViewer.spec.tsx`
- `__test__/app/clientComponents/freemiumNotification/FreemiumNotification.spec.tsx`
- Any other tests asserting "Series" display text

### Testing Strategy

- **Unit testing**: Update all test assertions that check for "Series" text
- **Manual testing**: Verify all screens display "Flow" terminology
- **Accessibility testing**: Verify screen readers announce "flow" correctly

## Text Change Reference

| Location                | Current Text               | New Text                 |
| ----------------------- | -------------------------- | ------------------------ |
| Header nav              | Series                     | Flows                    |
| Landing page nav        | Series                     | Flows                    |
| Flows page button       | Practice Series            | Practice Flows           |
| Flows page button       | Create Series              | Create Flow              |
| Flows page description  | Series are made up of...   | Flows are made up of...  |
| Practice page splash    | Practice Series            | Practice Flows           |
| Practice page search    | Search for a Series        | Search for a Flow        |
| Practice page loading   | Loading series...          | Loading flows...         |
| Practice page drawer    | Pick a Series to practice. | Pick a Flow to practice. |
| Create page splash      | Create Series              | Create Flow              |
| Create page placeholder | Add a pose to your series  | Add a pose to your flow  |
| Create page name field  | Give your Series a name... | Give your Flow a name... |
| Edit dialog title       | Edit Series                | Edit Flow                |
| Edit form label         | Series Name                | Flow Name                |
| Library tab             | Series (n)                 | Flows (n)                |
| Activity label          | Series                     | Flow                     |
| Weekly activity         | Weekly Series Activity     | Weekly Flow Activity     |
| Freemium message        | custom series              | custom flows             |
| Milestone notification  | First ... series completed | First ... flow completed |

## Future Considerations

- Consider creating a centralized strings/constants file for display text
- Consider internationalization (i18n) support for future terminology changes
- URL paths (`practiceSeries`) could be updated in a future breaking change release
- File/directory names could be updated in a future refactoring effort
