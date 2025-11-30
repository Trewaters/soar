# Engineering Task Breakdown

## 1. Series Edit Component Foundation

- Create `app/navigator/flows/editSeries/EditSeriesDialog.tsx` for the edit series dialog UI.
- Set up props to receive the series data, open/close state, and save/delete callbacks.
- Integrate NextAuth.js session to determine current user and enforce edit permissions.
- Ensure the dialog only opens for users whose email matches the series `created_by` field.

## 2. Series Field Editing Logic

- Render all editable series fields: name, description, difficulty, and asana list.
- Disable editing of the `created_by` field in the UI.
- Add validation for required fields (name, asanas, etc.).
- Implement error messaging for unauthorized access and validation failures.

## 3. Asana List Management

- Display the current asana list in the series, each with its name and difficulty.
- Implement drag-and-drop functionality to allow users to reorder asanas in the list.
  - Use a library like `react-beautiful-dnd` or MUI's drag-and-drop utilities.
- In edit mode, add a red trash can icon button to the left of each asana name.
  - Clicking the icon removes that asana from the series list.
- Ensure the asana list updates in real time as items are reordered or removed.

## 4. Series Deletion Feature

- Add a "Delete Series" button next to the "Save Changes" button in the dialog.
- Ensure only the creator can see and use the delete button.
- Implement confirmation modal before deletion.
- On confirmation, call backend API to delete the series from the database.

## 5. Backend Integration

- Create a service that handles communicating with backend for CRUD operations. similar to `/lib/postureService.ts`
- Create/Update API endpoint at `app/api/series/[id]/route.ts` to handle PATCH/PUT requests for series updates. Similar to `app/api/poses/[id]/route.ts`
- Ensure API checks that the current user's email matches the series `created_by` before allowing updates or deletion.
- Update Prisma model for series if needed to ensure `created_by` is present and immutable after creation.
- Implement backend logic for reordering asanas and removing asanas from the series.
- Add API endpoint for series deletion if not present.

## 6. Context Provider Updates

- Update or create `app/context/SeriesContext.tsx` to support series editing, reordering, and deletion.
- Ensure context state updates reflect changes made in the edit dialog.
- Integrate context with the edit dialog for real-time UI updates.

## 7. UI/UX Consistency & Accessibility

- Match UI layout and interaction patterns to the asana pose edit dialog.
- Ensure responsive design for mobile and desktop.
- Add ARIA labels and keyboard navigation for all form fields and drag-and-drop controls.
- Use MUI components for all form fields, dialogs, buttons, and icons.

## 8. Testing

- Create unit tests in `__test__/app/navigator/flows/editSeries/EditSeriesDialog.test.tsx` for:
  - Rendering and editing all series fields
  - Drag-and-drop reordering of asanas
  - Trash can icon removal of asanas
  - Series deletion logic and confirmation
  - Permission enforcement (only creator can edit/delete)
  - Error messaging and validation
  - Accessibility and mobile responsiveness
- Create integration tests for API endpoints and context provider logic.
- Ensure test file length is under 600 lines (describe/it blocks only).

## 9. Documentation

- Document the edit series feature, including drag-and-drop and trash can icon logic, in the project README or feature documentation.
- Include usage examples and screenshots if possible.
- Note any changes to the Prisma model or API endpoints.

## 10. Post-Implementation Review

- Verify all acceptance criteria from the PRD are met.
- Confirm edit restrictions and UI/UX consistency.
- Validate test coverage and accessibility compliance.
- Review for mobile responsiveness and error handling.
