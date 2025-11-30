# PRD: Edit Toggle URL Sync Pattern

## Overview

Standardize the edit toggle pattern across all edit-enabled views in the Soar yoga application. This pattern provides a consistent user experience for entering and exiting edit mode using URL-synced state (`?edit=true`) and a visual icon toggle (Edit/Close icon swap).

## Problem Statement

Currently, the application has inconsistent implementations for entering edit mode across different features:

1. **Sequences**: Uses the new replace-based URL toggle with icon swap (implemented)
2. **Practice Sequences**: Uses the new replace-based URL toggle with icon swap (implemented)
3. **Asanas, Flows, Profile Library**: Still use `router.push()` navigation without icon swap, creating browser history pollution and inconsistent UX

Users experience confusion when:

- Some edit buttons add history entries (requiring multiple back clicks)
- Edit icons don't visually indicate when edit mode is active
- There's no consistent way to exit edit mode via the same control that entered it

## Target Users

- **Yoga Practitioners**: Users managing their personal asana library, sequences, and practice flows
- **Content Creators**: Users creating and editing yoga content (poses, series, sequences)
- **Mobile Users**: Practitioners accessing the app during yoga practice who need quick, intuitive controls

## Scope

### In-Scope

- Standardize edit toggle pattern across all edit entry points
- Implement URL-synced edit state using `?edit=true` query parameter
- Use `router.replace()` instead of `router.push()` for edit state changes
- Swap edit icon (EditIcon → CloseIcon) when edit mode is active
- Update all affected unit tests to expect `replace` behavior
- Apply pattern to: Asana views, Flow views, Sequence views, Profile Library

### Out-of-Scope

- Creating new edit capabilities for features that don't currently have them
- Implementing undo/redo functionality within edit mode
- Adding confirmation dialogs when exiting edit mode with unsaved changes (future enhancement)
- Keyboard shortcuts for edit toggle (future enhancement)
- Deep linking to specific edit fields within a form

## Functional Requirements

### Core Functionality

1. **URL-Synced Edit State**

   - Edit mode MUST be represented by `?edit=true` query parameter
   - Removing the query parameter MUST exit edit mode
   - Direct URL access with `?edit=true` MUST open the edit view
   - Browser refresh with `?edit=true` MUST preserve edit mode

2. **Toggle Behavior**

   - Single edit control MUST toggle between view and edit modes
   - Clicking edit control when viewing MUST enter edit mode
   - Clicking edit control when editing MUST exit edit mode
   - Toggle MUST use `router.replace()` to avoid history pollution

3. **Visual Feedback**

   - Edit control MUST display `EditIcon` (pencil) in view mode
   - Edit control MUST display `CloseIcon` (X) in edit mode
   - Icon transition MUST be immediate upon state change
   - Control MUST have appropriate aria-label reflecting current action

4. **Cancel/Save Integration**
   - Edit forms MUST expose `onCancel` callback
   - `onCancel` MUST trigger edit toggle to close (remove `?edit=true`)
   - Save action MUST optionally exit edit mode based on user preference
   - Delete action MUST navigate away from the deleted resource

### User Interface Requirements

- Edit toggle icon MUST be positioned consistently (typically in header/title area)
- Icon MUST be touch-friendly (minimum 44x44px touch target)
- Icon MUST have visible focus state for keyboard navigation
- Icon color MUST follow MUI theme (primary color in header context)
- Tooltip SHOULD indicate action ("Edit" or "Close edit")

### Integration Requirements

- **Authentication**: Edit controls MUST only appear for authenticated users with edit permissions
- **Context Providers**: Components MUST access navigation via `useRouter()` or `useNavigationWithLoading()`
- **State Management**: Local component state MUST sync with URL parameter on mount and changes
- **API Endpoints**: No new endpoints required; pattern is client-side only

## User Stories

### Primary User Stories

**US-1: Enter Edit Mode**
**As a** yoga practitioner
**I want** to click an edit icon to modify my yoga content
**So that** I can quickly update poses, sequences, or flows

**Acceptance Criteria:**

- [ ] Edit icon (pencil) is visible on content I can edit
- [ ] Clicking the edit icon opens the edit form/view
- [ ] URL updates to include `?edit=true`
- [ ] Edit icon changes to close icon (X)
- [ ] Browser back button returns to previous page (not view mode of same content)

**US-2: Exit Edit Mode via Toggle**
**As a** yoga practitioner
**I want** to click the close icon to exit edit mode
**So that** I can return to viewing my content without navigating away

**Acceptance Criteria:**

- [ ] Close icon (X) is visible when in edit mode
- [ ] Clicking the close icon closes the edit form/view
- [ ] URL updates to remove `?edit=true`
- [ ] Close icon changes back to edit icon (pencil)
- [ ] Any unsaved changes are discarded (current behavior)

**US-3: Direct Link to Edit Mode**
**As a** yoga practitioner
**I want** to bookmark or share a direct link to edit a specific item
**So that** I can quickly access edit mode for frequently modified content

**Acceptance Criteria:**

- [ ] Navigating to `/navigator/asanaPoses/{id}?edit=true` opens edit mode
- [ ] Navigating to `/navigator/sequences/{id}?edit=true` opens edit mode
- [ ] Navigating to `/navigator/flows/{id}?edit=true` opens edit mode
- [ ] Page refresh preserves edit mode state

**US-4: Cancel from Edit Form**
**As a** yoga practitioner
**I want** to click Cancel in an edit form to discard changes
**So that** I can safely abandon edits without affecting my content

**Acceptance Criteria:**

- [ ] Cancel button in edit form triggers exit from edit mode
- [ ] URL is updated to remove `?edit=true`
- [ ] Edit icon returns to pencil state
- [ ] Original content is displayed unchanged

### Secondary User Stories

**US-5: Mobile Edit Experience**
**As a** mobile yoga practitioner
**I want** touch-friendly edit controls
**So that** I can manage content during or between yoga sessions

**Acceptance Criteria:**

- [ ] Edit/close icons have adequate touch target size (44x44px minimum)
- [ ] Icons are positioned to avoid accidental touches
- [ ] Visual feedback is clear on touch devices

## Technical Requirements

### Frontend Requirements

1. **React Component Pattern**

   ```typescript
   // Standard toggle handler pattern
   const handleToggleEdit = (open?: boolean) => {
     const next = typeof open === 'boolean' ? open : !isEditing
     setIsEditing(next)
     try {
       if (next && itemId) {
         router.replace(`/navigator/{feature}/${itemId}?edit=true`)
       } else if (itemId) {
         router.replace(`/navigator/{feature}/${itemId}`)
       }
     } catch (e) {
       // best-effort URL sync; ignore navigation errors
     }
   }
   ```

2. **Edit State Detection**

   ```typescript
   // Client-side edit state detection
   const isCurrentlyEditing =
     typeof window !== 'undefined' &&
     window.location.search.includes('edit=true') &&
     window.location.pathname.includes(`/navigator/{feature}/${itemId}`)
   ```

3. **Icon Toggle Rendering**

   ```tsx
   <IconButton
     onClick={() => handleToggleEdit()}
     aria-label={isEditing ? `Close edit ${itemName}` : `Edit ${itemName}`}
   >
     {isEditing ? <CloseIcon /> : <EditIcon />}
   </IconButton>
   ```

4. **MUI Components Required**
   - `IconButton` from `@mui/material`
   - `EditIcon` from `@mui/icons-material/Edit`
   - `CloseIcon` from `@mui/icons-material/Close`

### Backend Requirements

- No backend changes required
- Pattern is entirely client-side URL state management

### Data Requirements

- No database changes required
- No new data models needed
- Existing edit permissions apply unchanged

## Success Criteria

### User Experience Metrics

- **Consistency**: 100% of edit entry points use the same toggle pattern
- **Browser History**: Zero duplicate history entries from edit toggles
- **Visual Clarity**: Users can identify edit mode status at a glance via icon state

### Technical Metrics

- **Test Coverage**: All toggle implementations have unit tests verifying:
  - `router.replace()` is called (not `router.push()`)
  - Icon swaps correctly based on edit state
  - `onCancel` callback triggers edit close
- **Performance**: No additional network requests for toggle operation
- **Accessibility**: All edit controls pass axe-core accessibility checks

## Dependencies

### Internal Dependencies

- `useRouter()` from `next/navigation` or `useNavigationWithLoading()` custom hook
- MUI IconButton and icon components
- Existing edit form components (`EditSequence`, `EditAsana`, etc.)
- Authentication context for permission checks

### External Dependencies

- Next.js App Router (already in use)
- MUI Material (already in use)
- No new external dependencies required

## Risks and Considerations

### Technical Risks

1. **Client-Side Detection**: Using `window.location` requires client-side checks; must ensure SSR compatibility
   - Mitigation: Wrap in `typeof window !== 'undefined'` checks
2. **Race Conditions**: Rapid toggle clicks could cause state desync

   - Mitigation: Debounce toggle handler or disable during transition

3. **Test Updates**: Existing tests expect `router.push()`; must update to expect `router.replace()`
   - Mitigation: Systematic test updates with each component change

### User Experience Risks

1. **Unsaved Changes**: Current pattern discards unsaved changes on toggle close

   - Mitigation: Document behavior; future enhancement for confirmation dialog

2. **Learning Curve**: Users familiar with separate edit pages may need adjustment
   - Mitigation: Consistent pattern reduces long-term confusion

### Mobile Responsiveness Issues

1. **Touch Target Size**: Icons must be large enough for touch
   - Mitigation: Minimum 44x44px touch target per WCAG guidelines

## Implementation Notes

### File Structure Impact

Files to be modified (high priority):

| File                                                   | Change Type | Description                                     |
| ------------------------------------------------------ | ----------- | ----------------------------------------------- |
| `app/navigator/profile/library/page.tsx`               | Modify      | Convert 4+ edit buttons to toggle pattern       |
| `__test__/app/navigator/profile/library/page.spec.tsx` | Modify      | Update test assertions from `push` to `replace` |

Files already converted (reference implementations):

| File                                             | Status      | Notes                    |
| ------------------------------------------------ | ----------- | ------------------------ |
| `app/clientComponents/SequenceViewWithEdit.tsx`  | ✅ Complete | Reference implementation |
| `app/navigator/flows/practiceSequences/page.tsx` | ✅ Complete | Reference implementation |

### Testing Strategy

1. **Unit Testing Requirements**

   - Mock `router.replace` and verify it's called with correct URL
   - Mock `window.location.search` to test icon state detection
   - Test toggle behavior in both directions (open/close)
   - Test `onCancel` callback integration

2. **Integration Testing Needs**

   - Verify URL changes persist on component remount
   - Test direct navigation to `?edit=true` URLs
   - Verify edit mode survives page refresh

3. **User Acceptance Testing Criteria**
   - Edit toggle works consistently across all features
   - Browser back button behaves as expected
   - Mobile touch interactions work correctly

### Code Review Checklist

For each implementation:

- [ ] Uses `router.replace()` not `router.push()`
- [ ] Includes try/catch for navigation errors
- [ ] Renders correct icon based on edit state
- [ ] Has appropriate aria-label for accessibility
- [ ] Unit tests updated to expect `replace` behavior
- [ ] Client-side window checks are SSR-safe

## Future Considerations

1. **Unsaved Changes Warning**: Add confirmation dialog when exiting edit mode with unsaved changes
2. **Keyboard Shortcuts**: Add `Escape` key to exit edit mode, `E` key to enter
3. **Edit History**: Track edit sessions for analytics
4. **Collaborative Editing**: Lock indicators when another user is editing
5. **Autosave**: Periodic autosave during edit sessions
6. **Undo/Redo**: Edit history within a session

## Appendix

### Reference Implementation

See `app/clientComponents/SequenceViewWithEdit.tsx` for the canonical implementation of this pattern:

```typescript
// Key implementation details:
// 1. handleToggleEdit function with URL sync
// 2. CloseIcon import and conditional rendering
// 3. onCancel prop passed to edit form
// 4. aria-label reflecting current action
```

### Related PRDs

- None currently; this is a foundational UX pattern

### Revision History

| Version | Date       | Author       | Changes              |
| ------- | ---------- | ------------ | -------------------- |
| 1.0     | 2025-11-27 | AI Assistant | Initial PRD creation |
