# PRD: Edit Sequence Component

## Overview

This feature introduces an "Edit Sequence" component for the Soar yoga application, enabling users to modify yoga sequences they have created. The component will mirror the functionality and user experience of the existing “asana pose” and “flow series” edit features, with additional logic to restrict editing to the sequence creator. Users can edit sequence fields (name, series in sequence, description, image), remove or reorder flow series, and must confirm deletions to prevent accidents.

## Problem Statement

Users need the ability to update and personalize their yoga sequences after creation, but must be protected from accidental deletions and unauthorized edits to sequences they do not own.

## Target Users

- Authenticated yoga practitioners who create and manage their own sequences
- Yoga instructors managing custom practice flows

## Scope

### In-Scope

- Editing only sequences created by the logged-in user
- Editable fields: name, description, image, series in sequence (as a whole)
- Drag-and-drop reordering of flow series within a sequence
- Remove flow series from a sequence with confirmation dialog
- Display red trash can icon for deletion in edit mode
- Restrict editing for sequences not created by the logged-in user

### Out-of-Scope

- Editing sequences created by other users
- Undo/redo functionality beyond delete confirmation
- Bulk editing or batch operations
- Sequence sharing or publishing features

## Functional Requirements

### Core Functionality

1. Only allow editing for sequences where `created_by` matches the logged-in user's email
2. Editable fields: name, description, image, series in sequence
3. Display each flow series in the sequence list with a red trash can icon (delete button)
4. Remove flow series from sequence with confirmation dialog
5. Allow drag-and-drop reordering of flow series in the sequence
6. Prevent editing of the `created_by` attribute

### User Interface Requirements

- UI must match existing edit patterns for asana pose and flow series
- Red trash can icon to the left of each flow series name in edit mode
- Confirmation dialog before deleting a flow series
- Responsive layout for mobile and desktop
- Accessibility: ARIA labels for buttons, keyboard navigation for drag-and-drop

### Integration Requirements

- NextAuth.js authentication for user session and email
- Prisma/MongoDB data layer for sequence and flow series updates
- Context provider integration for sequence state management
- API endpoints for updating sequence data

## User Stories

### Primary User Stories

**As a** logged-in yoga practitioner
**I want** to edit my own yoga sequences
**So that** I can personalize and update my practice flows

**Acceptance Criteria:**

- [ ] Only sequences created by the logged-in user are editable
- [ ] Editable fields: name, description, image, series in sequence
- [ ] Red trash can icon appears for each flow series in edit mode
- [ ] Confirmation dialog appears before deleting a flow series
- [ ] Drag-and-drop reordering of flow series is supported
- [ ] `created_by` field is not editable

### Secondary User Stories

**As a** user
**I want** to be prevented from editing sequences I do not own
**So that** my and others' data remains secure

## Technical Requirements

### Frontend Requirements

- React component for Edit Sequence, following MUI and Soar patterns
- Drag-and-drop support (e.g., `react-beautiful-dnd` or MUI equivalent)
- Confirmation dialog for deletions
- Integration with NextAuth.js session
- Context provider for sequence state

### Backend Requirements

- API endpoint for updating sequence data
- Prisma model updates for sequence and flow series
- Authorization checks for `created_by` field

### Data Requirements

- Sequence model: name, description, image, series (array of flow series), created_by (email)
- Only allow updates if session user matches `created_by`
- Data validation for all fields

## Success Criteria

### User Experience Metrics

- 100% of edit actions restricted to sequence owner
- No accidental deletions (confirmation required)
- Responsive and accessible UI

### Technical Metrics

- All API calls properly authorized
- Unit and integration test coverage for edit logic
- No regressions in existing edit features

## Dependencies

### Internal Dependencies

- Existing edit components for asana pose and flow series
- NextAuth.js session provider
- Sequence and flow series context providers

### External Dependencies

- MUI component library
- Drag-and-drop library (if not using MUI)

## Risks and Considerations

### Technical Risks

- Ensuring robust authorization checks
- Handling drag-and-drop accessibility
- Data consistency when reordering/removing flow series

### User Experience Risks

- Accidental deletions without confirmation
- Confusion if edit is restricted (must show clear messaging)

## Implementation Notes

### File Structure Impact

- New component: `app/clientComponents/EditSequence.tsx`
- Context updates: `app/context/SequenceContext.tsx`
- API updates: `app/api/sequence/[id].ts`
- Test files: `__test__/app/clientComponents/EditSequence.spec.tsx`

### Testing Strategy

- Unit tests for edit logic, drag-and-drop, and delete confirmation
- Integration tests for API and context updates
- Accessibility tests for edit UI

## Future Considerations

- Undo/redo for all edit actions
- Bulk editing of flow series
- Sequence sharing and collaboration features
