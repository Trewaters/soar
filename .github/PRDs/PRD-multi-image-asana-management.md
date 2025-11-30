# PRD: Multi-Image Management for User-Created Asanas

## Overview

This feature **enhances existing image management functionality** in the Soar yoga application by extending the current single-image system to support multiple images (up to 3) specifically for user-created asanas. This builds upon the existing `PostureImageUpload`, `PostureImageGallery`, and related infrastructure while adding carousel navigation, ownership controls, and image limit enforcement.

**Scope Clarification**: This is an enhancement to existing functionality, not a greenfield feature. The current image upload system will be extended to support multi-image workflows specifically for asanas created by users, while maintaining backward compatibility with existing single-image asanas and system-provided poses.

## Problem Statement

Currently, the Soar application has functional image management infrastructure including `PostureImageUpload`, `PostureImageGallery`, and API endpoints for single-image operations. However, the system lacks multi-image capabilities specifically for user-created asanas:

**Existing Functionality**:

- Single image upload per asana works correctly
- Basic image cycling exists in `postureActivityDetail.tsx` (10-second auto-cycling)
- Image association with asanas via `postureId` and `postureName`
- User authentication and basic ownership through `userId`

**Current Limitations**:

- No enforcement of 3-image limit per user-created asana
- Missing carousel-style navigation with user controls
- No clear distinction between system asanas and user-created asanas for image management
- Limited ownership controls (no verification of asana creator vs. image uploader)
- No image reordering capabilities
- Auto-cycling only, no manual navigation controls

**Migration Needs**:

- Existing image associations must be preserved
- Current single-image asanas should continue working without modification
- System-provided asanas should maintain their current image restrictions

## Target Users

### Primary Users

- **Yoga Instructors**: Creating asanas for their teaching curriculum with multiple reference images
- **Advanced Practitioners**: Documenting personal practice variations with different angles and modifications
- **Content Creators**: Building comprehensive yoga libraries with detailed visual documentation

### Secondary Users

- **Yoga Students**: Viewing detailed multi-image asanas created by instructors
- **Community Members**: Browsing enhanced asana content with multiple visual references

## Scope

### In-Scope

- **Enhancement of existing image upload system** to support multiple images (up to 3) per user-created asana
- **Carousel navigation interface** replacing current auto-cycling with user-controlled navigation
- **3-image limit enforcement** at both API and UI levels for user-created asanas
- **Asana ownership verification** to distinguish user-created asanas from system asanas
- **Image deletion functionality** for asana creators only with confirmation dialogs
- **Image reordering capability** allowing creators to set display order (primary, secondary, tertiary)
- **Migration strategy** for existing single-image associations
- **Responsive carousel design** for mobile and desktop yoga practice
- **Integration with existing components** (`PostureImageGallery`, `PostureImageUpload`, `PostureImageManagement`)
- **Accessibility enhancements** for screen readers and keyboard navigation
- **Visual indicators** showing current image position with dot navigation
- **API endpoint extensions** for multi-image operations and limit enforcement

### Out-of-Scope

- **System asana image modifications** (only user-created asanas can have multiple images)
- **Backward-breaking changes** to existing single-image functionality
- **Image editing capabilities** (cropping, filters, adjustments)
- **Bulk image operations** across multiple asanas simultaneously
- **Image sharing or social features** beyond existing functionality
- **Video upload or management**
- **Advanced image organization** (tagging, categories beyond existing structure)
- **AI-powered image recognition** or auto-tagging
- **Image management for system-provided asanas** (maintains current restrictions)

## Functional Requirements

### Core Functionality

1. **Multi-Image Upload with Enforcement**

   - Users can upload up to 3 images per asana **they created** (verified via `created_by` field)
   - **3-image limit enforcement**: UI prevents upload attempts beyond limit, API validates count
   - **Existing functionality preserved**: Single-image uploads continue to work
   - Support for JPEG, PNG, and SVG formats up to 5MB each (unchanged)
   - Images stored using existing Vercel Blob/local storage infrastructure
   - **Image ordering**: Display order field added (`displayOrder: 1, 2, 3`)

2. **Enhanced Carousel Navigation Interface**

   - **Replaces current auto-cycling** with user-controlled navigation
   - **Navigation controls**: Left/right arrow buttons positioned for accessibility
   - **Dot indicators**: Visual dots showing current position (1/3, 2/3, 3/3)
   - **Touch/swipe support**: Mobile gesture navigation for practitioners
   - **Keyboard accessibility**: Arrow key support with proper ARIA labels
   - **Smooth transitions**: CSS animations between image changes (300ms duration)
   - **Auto-play option**: Configurable auto-advance with pause controls

3. **Image Deletion with Ownership Controls**

   - **Creator-only access**: Delete functionality visible only to asana creators
   - **Confirmation workflow**: Two-step deletion process with clear warnings
   - **Individual image deletion**: Remove specific images while preserving others
   - **Graceful state management**: Handle display when current image is deleted
   - **Minimum image policy**: Prevent deletion of last image if desired

4. **User-Created Asana Verification**
   - **Ownership validation**: Match `session.user.id` with `AsanaPosture.created_by`
   - **System asana protection**: Prevent image management on system-provided asanas
   - **Clear error messaging**: Informative feedback for unauthorized access attempts
   - **UI conditional rendering**: Show/hide management features based on ownership

### User Interface Requirements

- **Enhanced Carousel Component**: Replace current auto-cycling in `postureActivityDetail.tsx` with interactive carousel
- **Dot Navigation**: Clickable dots below image showing position and allowing direct navigation
- **Navigation Controls**: Left/right arrows with hover states and touch-friendly sizing (min 44px)
- **Upload Interface Enhancement**: Extend existing `PostureImageUpload` to show remaining slots (e.g., "2 of 3 slots remaining")
- **Mobile Optimization**: Touch-friendly navigation with swipe gestures and responsive image sizing
- **Accessibility**: Proper ARIA labels, keyboard navigation, and screen reader announcements
- **Visual Consistency**: Maintain existing MUI theme and Soar design patterns
- **Loading States**: Progressive image loading with skeleton placeholders

### Integration Requirements

- **Authentication Enhancement**: Extend existing NextAuth.js to verify asana creator permissions
- **Database Schema Updates**: Add `displayOrder` field to `PoseImage` model and `isUserCreated` flag to `AsanaPosture`
- **Context Provider Updates**: Enhance `AsanaPostureContext` with multi-image state management
- **API Route Extensions**: Modify existing `/api/images/*` endpoints for multi-image support
- **Storage Optimization**: Leverage existing Vercel Blob storage with count tracking per asana

## User Stories

### Primary User Stories

**As a yoga instructor who created an asana**
**I want to upload multiple images for my pose**
**So that I can show different angles, variations, and details**

**Acceptance Criteria:**

- [ ] I can upload up to 3 images for any asana I created (verified by `created_by` field matching my user ID)
- [ ] The upload interface clearly shows remaining slots (e.g., "Upload 2 more images (1 of 3 used)")
- [ ] Upload attempts beyond 3 images are prevented with clear messaging
- [ ] Each image upload respects the 5MB size limit and supported formats (JPEG, PNG, SVG)
- [ ] Images are immediately visible in the carousel interface after upload with proper ordering

**As a yoga instructor viewing my created asana**
**I want to navigate between multiple images**
**So that I can see all the visual references I've provided**

**Acceptance Criteria:**

- [ ] I can see left/right navigation arrows when 2+ images exist (replaces auto-cycling)
- [ ] Navigation arrows are hidden when only one image exists (backward compatibility)
- [ ] I can click dot indicators to jump directly to any image (1, 2, or 3)
- [ ] I can use keyboard arrow keys to navigate between images with proper focus management
- [ ] I can swipe left/right on mobile devices to navigate images
- [ ] Current image position is clearly indicated with active dot highlighting
- [ ] Navigation transitions are smooth (300ms CSS animations) without jarring jumps
- [ ] Navigation works consistently on both mobile and desktop interfaces

**As a yoga instructor managing my asana content**
**I want to delete individual images I no longer want**
**So that I can maintain high-quality visual content**

**Acceptance Criteria:**

- [ ] I can see a delete button on each image only for asanas I created (`created_by` verification)
- [ ] A two-step confirmation dialog appears before deleting any image ("Are you sure?" → "Yes, delete")
- [ ] After deletion, the carousel gracefully displays remaining images (maintaining order)
- [ ] If I delete the currently displayed image, the carousel shows the next available image
- [ ] I can reorder images by dragging or using up/down controls to change display sequence
- [ ] Other users viewing my asana cannot see or access delete functionality (UI conditionally rendered)

### Secondary User Stories

**As a yoga student viewing an instructor's asana**
**I want to see multiple images if available**
**So that I can better understand the pose from different perspectives**

**Acceptance Criteria:**

- [ ] I can navigate through all available images using arrows, dots, or swipe gestures
- [ ] Navigation is intuitive and responsive on my mobile device (touch targets ≥44px)
- [ ] I cannot access image management functions (upload/delete/reorder) for asanas I didn't create
- [ ] I can see system-provided asanas with their existing single images (no multi-image confusion)
- [ ] The interface clearly shows how many images are available with dot indicators

## API Specifications

### Enhanced Image Upload Endpoint

**POST /api/images/upload**

**Request Enhancements**:

```typescript
interface UploadImageRequest {
  file: File
  altText?: string
  userId: string
  postureId: string
  postureName: string
  displayOrder?: number // 1, 2, or 3
  imageType: 'posture' // existing field
}
```

**Validation Logic**:

- Verify `session.user.id` matches `userId`
- Check if `postureId` belongs to user (`AsanaPosture.created_by === userId`)
- Count existing images for posture (`SELECT COUNT(*) FROM PoseImage WHERE postureId = ?`)
- Reject if count >= 3 with error message
- Assign next available `displayOrder` if not provided

**Response**:

```typescript
interface UploadImageResponse {
  id: string
  url: string
  displayOrder: number
  remainingSlots: number // 3 - current count
}
```

### New Image Reordering Endpoint

**PUT /api/images/reorder**

**Request**:

```typescript
interface ReorderImagesRequest {
  postureId: string
  imageOrders: Array<{
    imageId: string
    displayOrder: number // 1, 2, or 3
  }>
}
```

**Validation**:

- Verify user owns the asana
- Validate all `displayOrder` values are unique and between 1-3
- Ensure all `imageId`s belong to the specified `postureId`

### Enhanced Image Deletion Endpoint

**DELETE /api/images/[id]**

**Additional Validation**:

- Verify user owns the asana containing the image
- Update `displayOrder` of remaining images to fill gaps
- Return updated image list with new ordering

### Image Query Endpoint Enhancements

**GET /api/images**

**New Query Parameters**:

- `postureId`: Filter by specific asana
- `orderBy`: Sort by `displayOrder` ASC (default for carousels)
- `includeOwnership`: Return creator verification data

## Data Model Specifications

### Database Schema Changes

**PoseImage Model Updates**:

```prisma
model PoseImage {
  id             String      @id @default(auto()) @map("_id") @db.ObjectId
  userId         String      @db.ObjectId
  postureId      String?     @db.ObjectId
  postureName    String?
  url            String
  altText        String?
  fileName       String?
  fileSize       Int?
  uploadedAt     DateTime    @default(now())
  storageType    StorageType @default(CLOUD)
  localStorageId String?
  isOffline      Boolean     @default(false)
  imageType      String      @default("posture")

  // NEW FIELDS
  displayOrder   Int?        @default(1) // Order for carousel display (1, 2, 3)

  user       UserData      @relation(fields: [userId], references: [id], onDelete: Cascade)
  posture    AsanaPosture? @relation(fields: [postureId], references: [id], onDelete: SetNull)

  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@index([userId])
  @@index([postureId])
  @@index([postureName])
  @@index([storageType])
  @@index([imageType])
  @@index([postureId, displayOrder]) // NEW: Composite index for carousel queries
}
```

**AsanaPosture Model Updates**:

```prisma
model AsanaPosture {
  // ... existing fields

  // NEW FIELDS
  isUserCreated  Boolean     @default(false) // Distinguish from system asanas
  imageCount     Int         @default(0)     // Cached count for performance optimization

  // ... existing relations
  images         PoseImage[] // Updated relation name for clarity
}
```

### Migration Strategy

**Phase 1: Schema Migration**

```sql
-- Add new columns with defaults
ALTER TABLE PoseImage ADD COLUMN displayOrder INT DEFAULT 1;
ALTER TABLE AsanaPosture ADD COLUMN isUserCreated BOOLEAN DEFAULT FALSE;
ALTER TABLE AsanaPosture ADD COLUMN imageCount INT DEFAULT 0;

-- Create new composite index
CREATE INDEX idx_posture_display_order ON PoseImage(postureId, displayOrder);
```

**Phase 2: Data Migration Script**

```typescript
// Migration script: scripts/migrate-multi-image-support.ts
async function migrateExistingData() {
  // 1. Mark user-created asanas
  await prisma.asanaPosture.updateMany({
    where: { created_by: { not: null } },
    data: { isUserCreated: true },
  })

  // 2. Set display order for existing images
  const existingImages = await prisma.poseImage.findMany({
    where: { postureId: { not: null } },
    orderBy: { uploadedAt: 'asc' },
  })

  for (const image of existingImages) {
    const position = await prisma.poseImage.count({
      where: {
        postureId: image.postureId,
        uploadedAt: { lt: image.uploadedAt },
      },
    })

    await prisma.poseImage.update({
      where: { id: image.id },
      data: { displayOrder: position + 1 },
    })
  }

  // 3. Update image counts
  const asanaCounts = await prisma.poseImage.groupBy({
    by: ['postureId'],
    _count: { id: true },
    where: { postureId: { not: null } },
  })

  for (const count of asanaCounts) {
    await prisma.asanaPosture.update({
      where: { id: count.postureId },
      data: { imageCount: count._count.id },
    })
  }
}
```

**Phase 3: Backward Compatibility Verification**

- Ensure existing single-image asanas continue displaying correctly
- Verify auto-cycling behavior is preserved for single images
- Test that system asanas maintain their current restrictions

## Technical Constraints & Enforcement

### 3-Image Limit Enforcement

**Frontend Enforcement**:

```typescript
// In PostureImageUpload component
const canUpload = imageCount < 3 && isUserCreated && isOwner
const remainingSlots = 3 - imageCount

if (!canUpload) {
  showError(
    `Maximum 3 images allowed per user-created asana. ${remainingSlots} slots remaining.`
  )
  return
}
```

**Backend Enforcement**:

```typescript
// In /api/images/upload route
const existingCount = await prisma.poseImage.count({
  where: { postureId: postureId },
})

if (existingCount >= 3) {
  return NextResponse.json(
    { error: 'Maximum 3 images per asana exceeded' },
    { status: 400 }
  )
}
```

**Database Constraints**:

```prisma
// Add application-level constraint
model PoseImage {
  // ... existing fields

  @@unique([postureId, displayOrder], name: "unique_posture_display_order")
}
```

### Ownership Verification Logic

```typescript
// Utility function for ownership checks
async function verifyAsanaOwnership(
  postureId: string,
  userId: string
): Promise<boolean> {
  const asana = await prisma.asanaPosture.findUnique({
    where: { id: postureId },
    select: { created_by: true, isUserCreated: true },
  })

  return asana?.isUserCreated && asana?.created_by === userId
}
```

## Technical Requirements

### Frontend Requirements

- **Enhanced React Components**:
  - Extend `PostureImageGallery` with carousel functionality and dot navigation
  - Update `PostureImageUpload` to show remaining upload slots and enforce 3-image limit
  - Create `ImageCarousel` component for navigation controls and smooth transitions
- **MUI Integration**: Use Material-UI components (Stepper for dots, IconButton for arrows) consistent with Soar design system
- **State Management**: Enhance `AsanaPostureContext` with multi-image state and carousel position tracking
- **Responsive Design**: Mobile-first approach with touch gesture support (react-swipeable or similar)
- **Accessibility**: WCAG 2.1 AA compliance for carousel navigation and image management

### Backend Requirements

- **API Endpoint Extensions**:
  - `POST /api/images/upload`: Add image count validation before upload
  - `GET /api/images`: Add `displayOrder` sorting and ownership filtering
  - `PUT /api/images/reorder`: New endpoint for changing image display order
  - `DELETE /api/images/[id]`: Add creator verification before deletion
- **Database Schema Updates**: Add `displayOrder` field to `PoseImage` and `isUserCreated` flag to `AsanaPosture`
- **Validation Logic**: Enforce 3-image limit and creator ownership at database level
- **Error Handling**: Comprehensive error responses for limit exceeded, unauthorized access, etc.

### Data Requirements

- **PoseImage Model Extensions**:
  ```prisma
  model PoseImage {
    // ... existing fields
    displayOrder   Int?        @default(1) // Order for carousel display (1, 2, 3)
  }
  ```
- **AsanaPosture Model Extensions**:
  ```prisma
  model AsanaPosture {
    // ... existing fields
    isUserCreated  Boolean     @default(false) // Distinguish from system asanas
    imageCount     Int         @default(0)     // Cached count for performance
  }
  ```
- **Query Optimization**: Efficient retrieval with ordering: `orderBy: { displayOrder: 'asc' }`
- **Data Migration**: Script to set `isUserCreated=true` for asanas with `created_by` field
- **Referential Integrity**: Maintain proper relationships between users, asanas, and images

## Success Criteria

### User Experience Metrics

- Users can successfully upload multiple images without confusion
- Navigation between images is intuitive and responsive (< 500ms transitions)
- Image deletion workflow is clear and prevents accidental loss
- Mobile touch navigation works seamlessly across devices

### Technical Metrics

- API response times under 200ms for image operations
- Zero data consistency issues between asanas and images
- 100% test coverage for new image management functionality
- No performance degradation on asana detail pages

## Dependencies

### Internal Dependencies

- **Existing Image Infrastructure**: PostureImageUpload, PostureImageGallery components
- **AsanaPostureContext**: State management for asana data
- **Authentication System**: NextAuth.js session management
- **Database Models**: PoseImage and AsanaPosture relationships

### External Dependencies

- **Vercel Blob**: For cloud image storage and delivery
- **Material-UI**: For consistent component styling and behavior
- **Next.js**: Image optimization and routing capabilities

## Risks and Considerations

### Technical Risks

- **Storage Costs**: Multiple images per asana may increase storage usage by up to 300%
- **Performance Impact**: Loading 3 high-resolution images could slow page load times
- **Bandwidth Usage**: Mobile users may experience 2-3x increased data consumption
- **Migration Complexity**: Data migration for existing images requires careful ordering and validation
- **Backward Compatibility**: Risk of breaking existing single-image functionality during enhancement

### User Experience Risks

- **Complexity**: Additional carousel navigation might confuse users familiar with simple image display
- **Content Quality**: Users might upload low-quality or redundant images without guidance
- **Mobile Usability**: Carousel controls may be difficult to use on small screens during yoga practice
- **Cognitive Load**: Managing multiple images may overwhelm users creating simple asanas

## Implementation Notes

### File Structure Impact

- **Enhanced Components**:
  - `PostureImageGallery.tsx` - Add carousel navigation and dot indicators
  - `PostureImageUpload.tsx` - Add slot counting and limit enforcement UI
  - `PostureImageManagement.tsx` - Add reordering controls
- **New Components**:
  - `ImageCarousel.tsx` - Standalone carousel component for reusability
  - `CarouselDotNavigation.tsx` - Dot indicator component
- **API Extensions**:
  - `/api/images/upload/route.ts` - Add count validation and ownership checks
  - `/api/images/reorder/route.ts` - New endpoint for image ordering
  - `/api/images/[id]/route.ts` - Enhanced deletion with order management
- **Database Migrations**:
  - `migration-001-add-display-order.sql` - Add displayOrder column
  - `migration-002-add-user-created-flag.sql` - Add isUserCreated column
  - `scripts/migrate-multi-image-support.ts` - Data migration script
- **Context Updates**:
  - `AsanaPostureContext.tsx` - Add multi-image state management
  - `types/asana.ts` - Update interfaces for new fields

### Testing Strategy

- **Unit Tests**:
  - Carousel navigation components (arrow clicks, dot navigation, keyboard support)
  - Image upload limit enforcement and error handling
  - Ownership verification logic and unauthorized access prevention
  - Image reordering functionality and state management
- **Integration Tests**:
  - Complete upload workflow with 3-image limit enforcement
  - Carousel navigation across all devices and input methods
  - API endpoints for multi-image operations with proper validation
  - Database migration scripts and data integrity verification
- **E2E Tests**:
  - User workflows: create asana → upload 3 images → navigate → reorder → delete
  - Ownership scenarios: creator vs. viewer permissions and UI differences
  - Mobile touch interactions and responsive carousel behavior
  - Backward compatibility with existing single-image asanas
- **Accessibility Tests**:
  - Screen reader navigation through carousel controls
  - Keyboard-only interaction with all carousel features
  - ARIA label verification and focus management
  - Color contrast and visual indicator accessibility
- **Performance Tests**:
  - Page load time with 3 high-resolution images
  - Carousel transition smoothness and memory usage
  - API response times under concurrent image operations
  - Database query performance with ordering and filtering

## Future Considerations

- **Image Reordering**: Allow users to change the order of their images
- **Image Captions**: Add descriptive text for each image
- **Batch Operations**: Enable selecting and deleting multiple images at once
- **Image Optimization**: Automatic compression and format optimization
- **Enhanced Analytics**: Track which images are most viewed or useful
- **Advanced Navigation**: Thumbnail previews for quick image selection

## Yoga-Specific Considerations

### Sanskrit Integration

- Ensure proper display of Sanskrit names alongside image navigation
- Consider cultural sensitivity in image content guidelines

### Practice Context

- Images should support different practice styles and modifications
- Consider sequential images showing pose progressions or transitions

### Accessibility for Practitioners

- Ensure image navigation works for practitioners with limited mobility
- Provide clear visual cues for different pose aspects (alignment, breathing, etc.)

### Mobile Yoga Practice

- Optimize for practitioners using devices during practice sessions
- Consider landscape orientation for better image viewing during practice
