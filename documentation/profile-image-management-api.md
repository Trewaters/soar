# Profile Image Management - API & Data Model Documentation

## Overview

This document describes the new API endpoints and data model changes for profile image management in the Soar yoga application. It covers backend REST endpoints, Prisma schema updates, placeholder logic, and integration notes for developers.

---

## Data Model Changes

### Prisma: `UserData` Model

- **profileImages**: `String[]` (max 3)
  - Stores up to 3 profile image URLs per user.
- **activeProfileImage**: `String?`
  - The currently active profile image URL.
- **image**: `String?` (existing)
  - Fallback/placeholder image if no profile images are set.

#### Example

```prisma
model UserData {
  id                 String   @id @default(auto())
  ...existing fields...
  profileImages      String[] // max 3
  activeProfileImage String?
  image              String?
}
```

---

## API Endpoints

### 1. `POST /api/profileImage` (Upload)

- **Description**: Upload a new profile image (max 3 per user).
- **Body**: `multipart/form-data` with `file` (image/png, image/jpeg, max 2MB)
- **Response**: `{ success: true, images: [String], active: String }`
- **Validation**:
  - Rejects if more than 3 images
  - Validates file type/size
  - Updates `profileImages` and sets as `activeProfileImage`

### 2. `DELETE /api/profileImage` (Delete)

- **Description**: Delete a profile image by URL.
- **Body**: `{ url: String }`
- **Response**: `{ success: true, images: [String], active: String }`
- **Logic**:
  - Removes image from `profileImages`
  - If deleted image was active, sets `activeProfileImage` to first remaining or placeholder

### 3. `POST /api/profileImage/setActive` (Set Active)

- **Description**: Set a specific profile image as active.
- **Body**: `{ url: String }`
- **Response**: `{ success: true, active: String }`
- **Logic**:
  - Sets `activeProfileImage` to provided URL (must exist in `profileImages`)

### 4. `GET /api/profileImage` (Get All)

- **Description**: Get all profile images and active image for current user.
- **Response**: `{ images: [String], active: String, placeholder: String }`

### 5. `GET /api/profileImage/placeholder` (Get Placeholder)

- **Description**: Get the placeholder image for the user (from `image` field or default).
- **Response**: `{ placeholder: String }`

---

## Placeholder Logic

- If `profileImages` is empty, UI and API return the `image` field as placeholder.
- If `activeProfileImage` is not set, default to first in `profileImages` or placeholder.
- Placeholder is always available for fallback display.

---

## Developer Notes

- All endpoints require authentication (NextAuth.js session).
- File uploads are validated server-side for type and size.
- Context (`UserContext`) is updated after any change to images.
- UI disables upload if 3 images are present.
- Deleting the active image auto-selects a new active or placeholder.
- All endpoints return updated image lists and active state for immediate UI update.

---

## Example Usage

- **Upload**: `POST /api/profileImage` with image file
- **Delete**: `DELETE /api/profileImage` with `{ url }`
- **Set Active**: `POST /api/profileImage/setActive` with `{ url }`
- **Get All**: `GET /api/profileImage`
- **Get Placeholder**: `GET /api/profileImage/placeholder`

---

## Integration Checklist

- [x] Schema updated and pushed to MongoDB
- [x] All endpoints implemented and tested
- [x] UserContext extended for profile image state
- [x] UI components integrated and tested
- [x] Accessibility and mobile responsiveness validated

---

## See Also

- `app/context/UserContext.tsx` (state/actions)
- `app/clientComponents/ProfileImage/` (UI components)
- `app/api/profileImage/` (API endpoints)
- `prisma/schema.prisma` (data model)
