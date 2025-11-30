# PRD: Glossary CRUD and Default Terms

## Overview

This feature enhances the Glossary component and page to support default yoga terms, user-specific CRUD operations, and scoped visibility. It ensures every user sees a populated glossary, can manage their own terms, and always has access to public "alpha_user" terms, while maintaining privacy and integrity of shared content.

## Problem Statement

Users need a glossary that is never empty, can be personalized, and always includes foundational yoga terms. Users should only see their own terms and public terms, with clear boundaries on what can be edited or deleted.

## Target Users

- Yoga practitioners using Soar for learning and reference
- Users seeking to personalize their glossary
- All authenticated users (guests see only default/alpha_user terms)

## Scope

### In-Scope

- Display a set of default glossary terms (from a JSON file, not hardcoded in the component)
- CRUD (Create, Read, Update, Delete) for user’s own glossary terms
- Display of public "alpha_user" terms (read-only for all except "alpha_user")
- Prevent deletion of default and "alpha_user" terms
- Users only see their own terms, default terms, and "alpha_user" terms

### Out-of-Scope

- Sharing user-created terms with other users
- Editing or deleting default or "alpha_user" terms by non-owners
- Admin management of glossary terms
- Import/export of glossary data

## Functional Requirements

### Core Functionality

1. Load and display default glossary terms from a frontend JSON file
2. Display "alpha_user" terms (read-only for all except "alpha_user")
3. Allow users to add, edit, and delete their own glossary terms
4. Prevent deletion or editing of default and "alpha_user" terms by other users
5. Ensure users only see their own terms, default terms, and "alpha_user" terms

### User Interface Requirements

- Glossary page always displays at least the default terms
- Clear UI distinction between default, "alpha_user", and user-created terms
- Add/Edit/Delete controls only for user’s own terms
- Responsive layout for mobile and desktop
- Accessibility: ARIA labels, keyboard navigation, semantic HTML

### Integration Requirements

- NextAuth.js authentication for user identification
- Context provider for glossary state management
- No backend required for default terms (frontend JSON only)
- API endpoints for CRUD on user terms
- Read-only access for "alpha_user" terms unless logged in as "alpha_user"

## User Stories

### Primary User Stories

**As a** yoga practitioner  
**I want** to see a glossary with default and public terms  
**So that** I always have reference material, even if I haven’t added my own

**Acceptance Criteria:**

- [ ] Default terms are always visible, loaded from a JSON file
- [ ] "alpha_user" terms are visible and read-only for all users except "alpha_user"
- [ ] Users can add, edit, and delete their own terms
- [ ] Users cannot edit or delete default or "alpha_user" terms
- [ ] Users only see their own terms, default terms, and "alpha_user" terms

### Secondary User Stories

- As "alpha_user", I can manage (CRUD) the public glossary terms
- As a user, I cannot see or interact with other users’ terms

## Technical Requirements

### Frontend Requirements

- React component for Glossary with CRUD UI
- Load default terms from a JSON file in the frontend
- MUI components for form fields, lists, and dialogs
- State management via context/provider
- Responsive and accessible design

### Backend Requirements

- API endpoints for user glossary term CRUD (Create, Read, Update, Delete)
- Authentication checks to ensure users only access their own terms
- "alpha_user" CRUD permissions for public terms

### Data Requirements

- JSON file for default terms (e.g., `app/data/glossary-default.json`)
- User glossary terms stored in database (Prisma model)
- "alpha_user" terms flagged in database
- Data validation for term fields (name, definition, etc.)

## Success Criteria

### User Experience Metrics

- Glossary page is never empty for any user
- Users can manage their own terms without errors
- No unauthorized edits/deletes of default or "alpha_user" terms
- Accessibility compliance (WCAG 2.1 AA)

### Technical Metrics

- 100% test coverage for CRUD operations and permissions
- No security breaches in term visibility or editing
- Fast load times for glossary page

## Dependencies

### Internal Dependencies

- NextAuth.js session management
- MUI component library
- Glossary context/provider
- Prisma models for user and glossary terms

### External Dependencies

- None (default terms are frontend-only)

## Risks and Considerations

### Technical Risks

- Ensuring strict permission checks for CRUD operations
- Keeping frontend JSON and UI in sync for default terms

### User Experience Risks

- Confusion between default, "alpha_user", and user terms
- Accidental deletion of user terms (mitigate with confirmation dialogs)

## Implementation Notes

### File Structure Impact

- `app/data/glossary-default.json` (new)
- `app/clientComponents/Glossary.tsx` (update)
- `app/api/glossary/` (CRUD endpoints)
- `app/context/GlossaryContext.tsx` (update or create)
- `prisma/schema.prisma` (update for glossary terms)
- `__test__/app/clientComponents/Glossary.spec.tsx` (new tests)

### Testing Strategy

- Unit tests for all CRUD operations and permission logic
- Integration tests for API endpoints
- Accessibility and responsive UI tests

## Future Considerations

- Allow users to suggest terms for public glossary
- Admin moderation of public terms
- Import/export glossary for personal use
