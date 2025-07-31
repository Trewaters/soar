# Profile Image Management - Developer Notes & Usage

## Overview

This document provides developer-focused notes and usage instructions for the profile image management system in the Soar yoga application. It covers integration with UserContext, UI usage, placeholder logic, and best practices for extending or maintaining this feature.

---

## Integration with UserContext

- The `UserContext` (`app/context/UserContext.tsx`) now includes:
  - `profileImages: string[]` (max 3)
  - `activeProfileImage: string | null`
  - `image: string | null` (placeholder)
- Actions:
  - Upload, delete, and set active profile image all dispatch context updates.
  - UI components use `onChange` to trigger context updates after API calls.
- Reducer and actions are extended to handle all profile image state changes.

---

## UI Usage

- Main UI: `ProfileImageManager` (`app/clientComponents/ProfileImage/ProfileImageManager.tsx`)
  - Props:
    - `images`: Array of profile image URLs
    - `active`: Active image URL
    - `placeholder`: Placeholder image URL
    - `onChange`: Callback for state update
- Usage:
  - Upload: Triggers file input, validates, and calls API
  - Delete: Removes image, updates context, and selects new active if needed
  - Select: Sets an image as active, updates context
  - Disabled: Upload is disabled if 3 images present
- Accessibility:
  - All controls have ARIA labels and keyboard support
  - Alt text is provided for all images

---

## Placeholder Logic

- If `profileImages` is empty, the UI and API use the `image` field as a placeholder.
- If `activeProfileImage` is not set, the first image in `profileImages` is used, or the placeholder if none exist.
- Placeholder is always available for fallback display and is returned by the `/api/profileImage/placeholder` endpoint.

---

## Best Practices

- Always check for authentication before calling profile image APIs.
- Use the context-provided state and dispatch for all UI updates.
- Validate file type and size on both client and server.
- Keep UI responsive and accessible (test with keyboard and screen reader).
- Use the provided API endpoints for all CRUD operations (do not mutate state directly).
- When deleting the active image, ensure a new active is selected or fallback to placeholder.

---

## Extending or Maintaining

- To support more than 3 images, update the schema, API validation, and UI logic accordingly.
- To change placeholder logic, update both backend (`/api/profileImage/placeholder`) and context fallback.
- For additional image processing (e.g., cropping), add logic to the upload handler and UI.
- For analytics or audit, hook into the context dispatch or API responses.

---

## References

- `documentation/profile-image-management-api.md` (API/data model)
- `app/context/UserContext.tsx` (context logic)
- `app/clientComponents/ProfileImage/` (UI components)
- `__test__/app/clientComponents/ProfileImage/` (unit/integration/a11y tests)

---

## Quick Example

```tsx
import { UseUser } from '@/app/context/UserContext'
import { ProfileImageManager } from '@/app/clientComponents/ProfileImage/ProfileImageManager'

const { state, dispatch } = UseUser()

<ProfileImageManager
  images={state.userData.profileImages}
  active={state.userData.activeProfileImage}
  placeholder={state.userData.image}
  onChange={dispatch}
/>
```

---

## QA Checklist

- [x] All endpoints and UI tested (unit, integration, a11y)
- [x] Context updates on all image actions
- [x] Placeholder logic validated
- [x] Mobile and accessibility tested
- [x] Documentation updated
