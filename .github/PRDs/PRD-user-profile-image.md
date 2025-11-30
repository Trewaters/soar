# PRD: User Profile Image Management

## Overview

This feature enables users to upload, view, and manage their profile image within the Soar yoga application. The profile image will be stored using the same service and restrictions as the current Gallery images, with a dedicated tab in the image gallery for profile images. Users can upload up to three profile images, select one as their active profile image, and delete images (if no images left user profile will revert to a placeholder). Strict file type and size restrictions will apply due to service limitations.

## Problem Statement

Users currently lack the ability to personalize their profile with a custom image. This feature addresses the need for user identity and personalization, enhancing engagement and community feel within the app.

## Target Users

- Registered yoga practitioners using Soar
- Users authenticating via social accounts or credentials

## Scope

### In-Scope

- Uploading a profile image (max 3 images per user)
- Viewing and selecting a profile image in a new "Profile Image" tab in the gallery
- Deleting a profile image. Deleting all images means profile will revert to a placeholder
- Strict file type (JPEG/PNG) and size restrictions (e.g., max 2MB)
- Placeholder logic: use API placeholder for social accounts, developer-uploaded placeholder for credentials

### Out-of-Scope

- Profile image history or versioning
- Image editing/cropping within the app
- Bulk upload or download of images
- Custom placeholder upload by users

## Functional Requirements

### Core Functionality

1. Users can upload up to three profile images (JPEG/PNG, max 2MB each)
2. Users can view their profile images in a dedicated "Profile Image" tab in the gallery
3. Users can select one image as their active profile image
4. Users can delete any profile image; if all images are deleted, the profile image reverts to the appropriate placeholder
5. Placeholder logic: use API-provided placeholder for social logins, developer-uploaded placeholder for credentials

### User Interface Requirements

- New "Profile Image" tab in the image gallery
- Upload button with file type/size validation and error messages
- Display of up to 3 images with selection and delete options
- Responsive layout for mobile and desktop
- Accessibility: ARIA labels, keyboard navigation, alt text for images

### Integration Requirements

- NextAuth.js session management for user authentication
- Prisma/MongoDB for storing image metadata and user profile references
- Use of existing image storage service (with tight restrictions)
- Context provider updates for user profile state
- API endpoints for upload, delete, and set active profile image

## User Stories

### Primary User Stories

**As a** registered user
**I want** to upload and manage my profile image
**So that** I can personalize my account and be recognized in the community

**Acceptance Criteria:**

- [ ] User can upload JPEG/PNG images up to 2MB
- [ ] User can have up to 3 profile images
- [ ] User can select one image as active
- [ ] User can delete images; if all images are deleted, placeholder is shown
- [ ] Placeholder logic matches authentication method
- [ ] UI is accessible and responsive

### Secondary User Stories

- As a user, I want clear error messages if my image is too large or the wrong format
- As a user, I want to easily switch between my profile images

## Technical Requirements

### Frontend Requirements

- React components for profile image management
- MUI components for gallery tab, image display, and controls
- State management for image selection and upload status
- Integration with UserContext and AsanaPostureContext as needed

### Backend Requirements

- API endpoints for image upload, delete, and set active
- Prisma model updates for profile image references (max 3 per user)
- File validation (type/size) on server
- Placeholder logic in API responses
- Authentication checks for all endpoints

### Data Requirements

- User model: add profileImages (array, max 3), activeProfileImage (reference)
- Store image metadata (filename, upload date, etc.)
- Enforce max 3 images per user
- Data validation for uploads

## Success Criteria

### User Experience Metrics

- 95%+ successful upload rate for valid images
- <2s image load time on mobile
- No accessibility violations (axe-core)

### Technical Metrics

- 100% test coverage for upload/delete/select logic
- No server errors for invalid uploads
- Proper fallback to placeholder in all cases

## Dependencies

### Internal Dependencies

- UserContext, AsanaPostureContext
- MUI component library
- NextAuth.js authentication
- Existing image gallery components

### External Dependencies

- Image storage service (same as Gallery)
- Placeholder image from API and developer upload

## Risks and Considerations

### Technical Risks

- Storage limits on free image service
- File validation edge cases
- Race conditions when deleting/setting active image

### User Experience Risks

- Confusion if upload fails due to restrictions
- Accessibility for image management controls
- Mobile usability for image selection

## Implementation Notes

### File Structure Impact

- New/updated files in `app/clientComponents/ProfileImage/`, `app/api/profileImage/`, `app/context/UserContext.tsx`, `prisma/schema.prisma`
- Test files in `__test__/app/clientComponents/ProfileImage/`
- Gallery component updates for new tab

### Testing Strategy

- Unit tests for upload, delete, and select logic
- Integration tests for API endpoints
- Accessibility and mobile responsiveness tests

## Future Considerations

- Support for image cropping/editing
- Profile image history/versioning
- Custom placeholder selection
- Integration with community features (e.g., profile image in comments)
