# Engineering Task Breakdown: Multi-Image Management for User-Created Asanas

## Overview

This task list implements the PRD for multi-image management functionality, enhancing the existing Soar image system to support up to 3 images per user-created asana with carousel navigation, ownership controls, and proper migration strategy.

**Implementation Priority**: Database migrations → API enhancements → Frontend components → Testing
**Estimated Timeline**: 3-4 weeks for complete implementation
**Dependencies**: Existing image infrastructure, AsanaPostureContext, NextAuth.js

---

## 1. Database Schema Updates and Migration

### 1.1 Update Prisma Schema Models

- **Task**: Add new fields to `PoseImage` and `AsanaPosture` models in `prisma/schema.prisma`
- **Requirements**:
  - Add `displayOrder` field to `PoseImage` model (Int, default 1, for carousel ordering)
  - Add `isUserCreated` field to `AsanaPosture` model (Boolean, default false)
  - Add `imageCount` field to `AsanaPosture` model (Int, default 0, for performance caching)
  - Add composite index `[postureId, displayOrder]` for efficient carousel queries
  - Add unique constraint `[postureId, displayOrder]` to prevent duplicate ordering
- **Files**: `prisma/schema.prisma`
- **Acceptance Criteria**: Schema validates, generates properly, maintains existing relationships

### 1.2 Create Database Migration Scripts

- **Task**: Create SQL migration scripts for adding new columns and indexes
- **Requirements**:
  - Create `migration-001-add-display-order.sql` for adding displayOrder column
  - Create `migration-002-add-user-created-flag.sql` for adding isUserCreated and imageCount columns
  - Create composite index for performance optimization
  - Ensure migrations are reversible and safe for production
- **Files**: `prisma/migrations/` directory
- **Acceptance Criteria**: Migrations run successfully without data loss

### 1.3 Create Data Migration Script

- **Task**: Create TypeScript script to migrate existing data to new schema
- **Requirements**:
  - Mark all asanas with `created_by` field as `isUserCreated: true`
  - Set `displayOrder` for existing images based on `uploadedAt` timestamp order
  - Calculate and update `imageCount` for all asanas with existing images
  - Handle edge cases and provide detailed logging
- **Files**: `scripts/migrate-multi-image-support.ts`
- **Acceptance Criteria**: All existing data migrated correctly, maintains referential integrity

---

## 2. API Endpoint Enhancements

### 2.1 Enhance Image Upload Endpoint

- **Task**: Extend `POST /api/images/upload` to support 3-image limit enforcement and ordering
- **Requirements**:
  - Add validation for maximum 3 images per user-created asana
  - Verify user ownership of asana (`created_by` field matches session user)
  - Auto-assign `displayOrder` if not provided (next available slot)
  - Return `remainingSlots` count in response
  - Add proper error messages for limit exceeded and unauthorized access
- **Files**: `app/api/images/upload/route.ts`
- **Acceptance Criteria**: Upload blocked after 3 images, ownership verified, proper error handling

### 2.2 Create Image Reordering Endpoint

- **Task**: Create new `PUT /api/images/reorder` endpoint for changing image display order
- **Requirements**:
  - Accept array of imageId and displayOrder pairs
  - Validate user owns the asana containing the images
  - Ensure all displayOrder values are unique and between 1-3
  - Update database with new ordering
  - Return updated image list with new order
- **Files**: `app/api/images/reorder/route.ts`
- **Acceptance Criteria**: Images reorder correctly, validation prevents conflicts

### 2.3 Enhance Image Deletion Endpoint

- **Task**: Update `DELETE /api/images/[id]` to handle multi-image scenarios
- **Requirements**:
  - Verify user owns the asana containing the image
  - Update `displayOrder` of remaining images to fill gaps (1, 2, 3 sequence)
  - Update `imageCount` cache on parent asana
  - Return updated image list for frontend state management
- **Files**: `app/api/images/[id]/route.ts`
- **Acceptance Criteria**: Deletion maintains proper ordering, no gaps in sequence

### 2.4 Enhance Image Query Endpoint

- **Task**: Update `GET /api/images` to support carousel ordering and ownership data
- **Requirements**:
  - Add `orderBy` parameter to sort by `displayOrder ASC` for carousels
  - Add `includeOwnership` parameter to return creator verification data
  - Optimize query performance for multi-image requests
  - Filter by `postureId` with proper ordering
- **Files**: `app/api/images/route.ts` or create new query endpoint
- **Acceptance Criteria**: Returns images in proper carousel order, includes ownership data

---

## 3. Frontend Component Enhancements

### 3.1 Create Image Carousel Component

- **Task**: Build new `ImageCarousel` component for navigating multiple images
- **Requirements**:
  - Support left/right arrow navigation with keyboard accessibility
  - Implement dot indicators showing current position (1/3, 2/3, 3/3)
  - Add smooth CSS transitions (300ms duration) between images
  - Support touch/swipe gestures for mobile navigation
  - Include ARIA labels and proper focus management
  - Handle edge cases (single image, no images)
- **Files**: `app/clientComponents/imageUpload/ImageCarousel.tsx`
- **Acceptance Criteria**: Smooth navigation, fully accessible, mobile-friendly

### 3.2 Create Carousel Dot Navigation Component

- **Task**: Build `CarouselDotNavigation` component for direct image selection
- **Requirements**:
  - Display clickable dots corresponding to available images
  - Highlight current image position with active styling
  - Support keyboard navigation (arrow keys, enter)
  - Maintain MUI design system consistency
  - Handle dynamic dot count (1-3 images)
- **Files**: `app/clientComponents/imageUpload/CarouselDotNavigation.tsx`
- **Acceptance Criteria**: Dots update correctly, accessible navigation, proper styling

### 3.3 Enhance PostureImageUpload Component

- **Task**: Update existing `PostureImageUpload` to show remaining slots and enforce limits
- **Requirements**:
  - Display remaining upload slots (e.g., "2 of 3 slots remaining")
  - Disable upload button when 3-image limit reached
  - Show clear error messages for limit exceeded
  - Verify user ownership before showing upload interface
  - Maintain backward compatibility with existing functionality
- **Files**: `app/clientComponents/imageUpload/PostureImageUpload.tsx`
- **Acceptance Criteria**: Clear slot indication, proper limit enforcement, ownership verification

### 3.4 Enhance PostureImageGallery Component

- **Task**: Replace auto-cycling with interactive carousel in image gallery
- **Requirements**:
  - Integrate `ImageCarousel` and `CarouselDotNavigation` components
  - Remove 10-second auto-cycling in favor of user-controlled navigation
  - Add reordering controls for image creators (drag/drop or up/down buttons)
  - Show delete buttons only to asana creators with confirmation dialogs
  - Maintain responsive design for mobile and desktop
- **Files**: `app/clientComponents/imageUpload/PostureImageGallery.tsx`
- **Acceptance Criteria**: User-controlled navigation, reordering works, creator-only controls

### 3.5 Update PostureActivityDetail Integration

- **Task**: Replace auto-cycling in `postureActivityDetail.tsx` with new carousel
- **Requirements**:
  - Remove existing `currentImageIndex` and auto-cycling logic
  - Integrate new `ImageCarousel` component
  - Maintain display of Category and Sort_English_name
  - Ensure proper ownership checks for management features
  - Preserve existing image display positioning and styling
- **Files**: `app/navigator/asanaPostures/[pose]/postureActivityDetail.tsx`
- **Acceptance Criteria**: Carousel replaces auto-cycling, maintains existing layout

---

## 4. Context and State Management

### 4.1 Enhance AsanaPostureContext

- **Task**: Add multi-image state management to existing `AsanaPostureContext`
- **Requirements**:
  - Add state for current carousel position tracking
  - Add functions for image reordering and count management
  - Include ownership verification helpers
  - Maintain backward compatibility with existing context consumers
  - Add proper TypeScript interfaces for new state properties
- **Files**: `app/context/AsanaPostureContext.tsx`
- **Acceptance Criteria**: Context supports multi-image workflows, maintains compatibility

### 4.2 Create Ownership Verification Utilities

- **Task**: Create utility functions for verifying asana creator permissions
- **Requirements**:
  - `verifyAsanaOwnership(postureId, userId)` function
  - `canManageImages(asana, session)` helper function
  - `isUserCreatedAsana(asana)` helper function
  - Proper error handling and TypeScript types
- **Files**: `app/utils/asanaOwnership.ts`
- **Acceptance Criteria**: Consistent ownership verification across components

### 4.3 Update TypeScript Interfaces

- **Task**: Update type definitions to include new image management fields
- **Requirements**:
  - Update `PoseImageData` interface with `displayOrder` field
  - Update `AsanaPosture` interface with `isUserCreated` and `imageCount` fields
  - Add interfaces for new API request/response types
  - Update existing component prop interfaces
- **Files**: `types/asana.ts`, `types/images.ts`
- **Acceptance Criteria**: All types properly defined, no TypeScript errors

---

## 5. User Interface Enhancements

### 5.1 Implement Image Reordering Interface

- **Task**: Add drag-and-drop or button-based reordering to image management
- **Requirements**:
  - Visual feedback during reordering operation
  - Immediate state updates with optimistic UI updates
  - API call to persist new order on completion
  - Error handling and rollback on API failure
  - Accessible alternative to drag-and-drop (up/down buttons)
- **Files**: Component enhancements across image management components
- **Acceptance Criteria**: Smooth reordering experience, accessible controls

### 5.2 Add Image Management Controls

- **Task**: Implement delete buttons and confirmation dialogs for image creators
- **Requirements**:
  - Two-step confirmation process ("Are you sure?" → "Yes, delete")
  - Delete buttons visible only to asana creators
  - Graceful handling when deleting currently displayed image
  - Update carousel state after successful deletion
  - Clear error messages for failed deletions
- **Files**: Enhanced image gallery and carousel components
- **Acceptance Criteria**: Safe deletion process, creator-only access, proper state updates

### 5.3 Enhance Upload Progress and Feedback

- **Task**: Add progress indicators and better feedback for image uploads
- **Requirements**:
  - Progress bar during image upload process
  - Success/error notifications with clear messaging
  - Loading states during API operations
  - Optimistic UI updates where appropriate
- **Files**: PostureImageUpload component and related upload handlers
- **Acceptance Criteria**: Clear upload feedback, good user experience during operations

---

## 6. Testing Implementation

### 6.1 Create Unit Tests for Carousel Components

- **Task**: Write comprehensive unit tests for new carousel functionality
- **Requirements**:
  - Test `ImageCarousel` navigation (arrows, dots, keyboard, touch)
  - Test `CarouselDotNavigation` selection and state updates
  - Test ownership verification logic and unauthorized access
  - Test image limit enforcement and error scenarios
  - Test reordering functionality and state management
- **Files**: `__test__/app/clientComponents/imageUpload/ImageCarousel.spec.tsx`, etc.
- **Acceptance Criteria**: >90% test coverage, all interaction patterns tested

### 6.2 Create Integration Tests for API Endpoints

- **Task**: Write integration tests for enhanced image management APIs
- **Requirements**:
  - Test 3-image limit enforcement across upload workflow
  - Test ownership verification for all CRUD operations
  - Test image reordering API with various scenarios
  - Test migration scripts with sample data
  - Test error handling and edge cases
- **Files**: `__test__/api/images/` directory
- **Acceptance Criteria**: All API endpoints tested, edge cases covered

### 6.3 Create End-to-End Tests

- **Task**: Write E2E tests for complete user workflows
- **Requirements**:
  - Test: Create asana → Upload 3 images → Navigate → Reorder → Delete
  - Test creator vs. viewer permission scenarios
  - Test mobile touch interactions and responsive behavior
  - Test backward compatibility with existing single-image asanas
  - Test system asana restrictions (no multi-image for system asanas)
- **Files**: `__test__/e2e/multi-image-workflow.spec.ts`
- **Acceptance Criteria**: Complete workflows tested, mobile and desktop coverage

### 6.4 Create Accessibility Tests

- **Task**: Verify carousel accessibility and screen reader support
- **Requirements**:
  - Test screen reader navigation through carousel controls
  - Test keyboard-only interaction with all features
  - Verify ARIA labels and focus management
  - Test color contrast and visual indicators
  - Validate touch target sizes (≥44px for mobile)
- **Files**: `__test__/accessibility/carousel-accessibility.spec.ts`
- **Acceptance Criteria**: WCAG 2.1 AA compliance, full keyboard/screen reader support

---

## 7. Performance and Optimization

### 7.1 Optimize Image Loading for Carousels

- **Task**: Implement lazy loading and optimization for multiple images
- **Requirements**:
  - Lazy load non-visible carousel images
  - Implement skeleton loading states
  - Optimize image sizes for different screen sizes
  - Add proper caching strategies
  - Monitor and optimize Core Web Vitals impact
- **Files**: Image components and Next.js Image optimizations
- **Acceptance Criteria**: Fast initial page load, smooth carousel performance

### 7.2 Optimize Database Queries

- **Task**: Ensure efficient querying for multi-image scenarios
- **Requirements**:
  - Optimize composite index usage for carousel queries
  - Implement efficient counting queries for limit enforcement
  - Add query optimization for image reordering operations
  - Monitor query performance with multiple images
- **Files**: Database query optimizations across API routes
- **Acceptance Criteria**: Query times <200ms, efficient index usage

---

## 8. Documentation and Migration

### 8.1 Create Migration Documentation

- **Task**: Document migration process and rollback procedures
- **Requirements**:
  - Step-by-step migration guide for production deployment
  - Rollback procedures in case of issues
  - Data backup and recovery instructions
  - Performance impact assessment
- **Files**: `docs/multi-image-migration.md`
- **Acceptance Criteria**: Clear migration guide, safe deployment process

### 8.2 Update Developer Documentation

- **Task**: Update component documentation and API documentation
- **Requirements**:
  - Document new carousel components and their props
  - Update API endpoint documentation with new parameters
  - Add usage examples for multi-image workflows
  - Document ownership verification patterns
- **Files**: Component JSDoc comments, README updates
- **Acceptance Criteria**: Complete documentation, clear usage examples

### 8.3 Create User-Facing Documentation

- **Task**: Create help documentation for end users
- **Requirements**:
  - Guide for uploading multiple images to user-created asanas
  - Instructions for carousel navigation and image management
  - FAQ for common questions about image limits and ownership
- **Files**: `docs/user-guides/multi-image-management.md`
- **Acceptance Criteria**: Clear user instructions, addresses common questions

---

## Implementation Order and Dependencies

### Phase 1: Foundation (Week 1)

1. Database schema updates (1.1)
2. Migration scripts (1.2, 1.3)
3. TypeScript interfaces (4.3)
4. Ownership utilities (4.2)

### Phase 2: Backend (Week 2)

1. API endpoint enhancements (2.1, 2.2, 2.3, 2.4)
2. Context enhancements (4.1)
3. Integration tests (6.2)

### Phase 3: Frontend (Week 3)

1. Carousel components (3.1, 3.2)
2. Component enhancements (3.3, 3.4, 3.5)
3. UI enhancements (5.1, 5.2, 5.3)
4. Unit tests (6.1)

### Phase 4: Testing and Optimization (Week 4)

1. E2E tests (6.3)
2. Accessibility tests (6.4)
3. Performance optimization (7.1, 7.2)
4. Documentation (8.1, 8.2, 8.3)

## Success Criteria

- ✅ Users can upload up to 3 images per user-created asana
- ✅ Carousel navigation works smoothly on mobile and desktop
- ✅ Only asana creators can manage images (upload/delete/reorder)
- ✅ Existing single-image functionality remains unchanged
- ✅ System asanas maintain current image restrictions
- ✅ All accessibility requirements met (WCAG 2.1 AA)
- ✅ API response times remain under 200ms
- ✅ Zero data loss during migration
- ✅ 100% test coverage for new functionality

## Risk Mitigation

- **Backward Compatibility**: Maintain existing functionality throughout implementation
- **Performance**: Monitor Core Web Vitals and database performance during development
- **Data Safety**: Implement comprehensive backup and rollback procedures
- **User Experience**: Conduct user testing for carousel navigation and mobile experience
- **Security**: Thorough testing of ownership verification and authorization checks
