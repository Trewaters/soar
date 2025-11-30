# PRD: Edit Series Component

## Overview

This feature introduces an "Edit Series" component for the Soar yoga application, enabling users to modify yoga series they have created. The component will mirror the functionality and user experience of the existing asana pose edit feature, with additional logic to restrict editing to the series creator. All visible series fields will be editable, except for the "created_by" attribute, which is set to the user's email upon creation and cannot be changed. Users will be able to remove asanas from the series, and change the order of asanas by dragging them to new positions in the list. In edit mode, each asana in the series list will display a red trash can icon to the left of its name, which acts as a button for deleting that specific asana from the series.

## Problem Statement

Users need the ability to update and manage their own yoga series, including modifying details and removing poses, while ensuring that only the creator can make changes. This supports personalized practice management and maintains data integrity.

## Target Users

- Authenticated yoga practitioners who create and manage custom series
- Yoga instructors managing teaching sequences

## Scope

### In-Scope

- Editing all visible fields of a yoga series (name, description, included asanas, difficulty, etc.)
  -- Removing asanas from a series
- Changing the order of asanas in a series by dragging to reorder
- Displaying a red trash can icon next to each asana in edit mode for removal
- Restricting edit access to the series creator (by email)
- Recording the creator's email in the "created_by" field when a series is created
- UI/UX consistent with the asana pose edit feature
- Allow user to completely delete the series from the backend database if they created it.

### Out-of-Scope

- Editing the "created_by" field
- Adding new asanas to a series (handled elsewhere)
- Editing series created by other users
- Bulk editing multiple series at once

## Functional Requirements

### Core Functionality

1. Display all editable series fields in the edit dialog/component
2. Allow users to update series details (name, description, difficulty, etc.)
3. Enable users to remove asanas from the series by clicking a red trash can icon next to each asana in edit mode
4. Allow users to change the order of asanas in the series by dragging asanas to new positions in the list
5. Prevent editing of the "created_by" field
6. Restrict access: Only the user whose email matches "created_by" can edit
7. Record the user's email in "created_by" when a new series is created
8. User can delete the series from the app if they created it.

### User Interface Requirements

- UI layout and interaction patterns should match the asana pose edit dialog
- Responsive design for mobile and desktop
- Clear error messages for unauthorized edit attempts
- Accessible form fields and controls
- Asana list in edit mode supports drag-and-drop reordering
- Each asana in the series list displays a red trash can icon to the left of its name, acting as a delete button
- A delete series button next the save changes button for the series.

### Integration Requirements

- NextAuth.js authentication for user identity
- Prisma/MongoDB data layer for series storage and updates
- Series context provider integration for state management
- API endpoint for updating series

## User Stories

### Primary User Stories

**As an authenticated user**
**I want** to edit all details of a yoga series I created
**So that** I can keep my practice sequences up to date

**Acceptance Criteria:**

- [ ] Only the creator (by email) can access the edit dialog for a series
- [ ] All visible series fields are editable except "created_by"
- [ ] User can remove asanas from the series
- [ ] Changes are saved to the database and reflected in the UI
- [ ] Unauthorized users see a clear error message

### Secondary User Stories

- As a user, I want to see which series I can edit and which I cannot
- As a user, I want confirmation when changes are saved

## Technical Requirements

### Frontend Requirements

- React component for editing series
- MUI components for form fields, dialogs, and buttons
- State management via context provider
- Responsive and accessible design

### Backend Requirements

- API endpoint for updating series (PATCH/PUT)
- Prisma model for series with "created_by" field (email)
- Database logic to restrict updates to creator
- Error handling for unauthorized access

### Data Requirements

- Series model includes: name, description, asanas[], difficulty, created_by (email)
- Validation for required fields
- "created_by" set on creation, immutable thereafter

## Success Criteria

### User Experience Metrics

- Users can successfully edit their own series
- Unauthorized users are prevented from editing
- All changes are reflected immediately in the UI
- Mobile and accessibility compliance

### Technical Metrics

- 100% test coverage for edit logic and permissions
- No unauthorized edits in database
- No errors in UI or API

## Dependencies

### Internal Dependencies

- Series context provider
- NextAuth.js session management
- Existing series creation and display components

### External Dependencies

- MUI component library
- Prisma ORM
- MongoDB database

## Risks and Considerations

### Technical Risks

- Ensuring edit restrictions are enforced at both UI and API levels
- Handling concurrent edits
- Data validation and error handling

### User Experience Risks

- Confusion if edit option is shown for series not created by user
- Accessibility for users with disabilities

## Implementation Notes

### File Structure Impact

- New component: `app/navigator/flows/editSeries/EditSeriesDialog.tsx`
- API update: `app/api/series/[id]/edit.ts`
- Context update: `app/context/SeriesContext.tsx`
- Test files: `__test__/app/navigator/flows/editSeries/EditSeriesDialog.test.tsx`

### Testing Strategy

- Unit tests for edit dialog/component
- Integration tests for API and permission logic
- Accessibility and mobile responsiveness tests

## Future Considerations

- Support for adding new asanas to series in edit dialog
- Bulk editing features
- Audit log for series changes
