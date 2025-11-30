# Edit Series - Testing Implementation

## Overview

Unit tests were added for the Edit Series dialog focusing on rendering, editing, reordering via buttons, deletion confirmation, permission enforcement, validation, and basic accessibility.

## Files Created

- `__test__/app/navigator/flows/editSeries/EditSeriesDialog.test.tsx` – Component tests with React Testing Library and jest-axe.

## Test Coverage

- Rendering fields for owners; unauthorized view for non-owners.
- Validation: required name and at least one asana.
- Editing: name change saved via onSave callback.
- Asana list: remove item via trash icon; reorder via up/down buttons.
- Deletion: confirmation dialog flow calls onDelete with id.
- Accessibility: jest-axe smoke test for the dialog.

## Mocks & Wrappers

- Mocked `next-auth/react` useSession, Next.js navigation, and Soar contexts.
- MUI ThemeProvider + CssBaseline wrapper ensures Material components render.

## Notes

- Drag-and-drop tests deferred pending DnD library integration; covered by up/down controls for now.
- File kept concise and under length constraints.
