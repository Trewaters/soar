# Engineering Task Breakdown

### 1. Profile Image Data Model & Backend API

- Update `prisma/schema.prisma` to add `profileImages` (array, max 3) and `activeProfileImage` fields to the User model
- Generate and apply Prisma migration for new fields
- Update backend logic to enforce max 3 images per user
- Create API endpoints in `app/api/profileImage/` for:
  - Uploading a profile image (with file type/size validation)
  - Deleting a profile image
  - Setting an image as active
  - Returning placeholder if no images exist
- Add server-side validation for JPEG/PNG and max 2MB size
- Integrate placeholder logic: API placeholder for social logins, developer-uploaded for credentials
- Add tests for API endpoints in `__test__/app/api/profileImage/`

### 2. Frontend Profile Image Management UI

- Create `ProfileImage` React components in `app/clientComponents/ProfileImage/` for:
  - Uploading images (with error handling for type/size)
  - Displaying up to 3 images with selection and delete options
  - Selecting an image as active
  - Showing placeholder if no images exist
- Add a new "Profile Image" tab to the image gallery component
- Integrate with UserContext for profile image state
- Ensure responsive layout for mobile and desktop
- Add ARIA labels, keyboard navigation, and alt text for accessibility
- Add unit tests for all new components in `__test__/app/clientComponents/ProfileImage/`

### 3. Integration & Context Updates

- Update `app/context/UserContext.tsx` to support new profile image fields and actions
- Ensure context updates on upload, delete, and set active actions
- Integrate with NextAuth.js session to determine placeholder logic
- Update gallery component to include the new tab and display logic
- Add integration tests for context and gallery updates

### 4. Testing & Validation

- Write unit tests for upload, delete, and select logic (frontend and backend)
- Write integration tests for API endpoints and context updates
- Test accessibility (axe-core, keyboard navigation, alt text)
- Test mobile responsiveness and usability
- Validate error handling for invalid uploads and edge cases

### 5. Documentation & Developer Support

- Document new API endpoints and data model changes
- Update README or relevant docs for profile image management usage
- Add developer notes for placeholder image management (API vs. developer-uploaded)
- Ensure all new code and tests follow Soar patterns and file structure

### 6. Final QA & Success Criteria

- Verify 100% test coverage for upload/delete/select logic
- Confirm <2s image load time on mobile
- Ensure proper fallback to placeholder in all cases
- Validate UI accessibility and responsiveness
- Review for compliance with all PRD requirements
