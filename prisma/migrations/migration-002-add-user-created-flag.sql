-- Migration 002: Add user-created flag and image count to AsanaPosture collection
-- Date: 2025-09-30
-- Description: Adds isUserCreated flag and imageCount cache for efficient multi-image management

-- For MongoDB, this is more of a documentation file since Prisma handles MongoDB migrations differently
-- However, this provides a reference for the changes being made

-- Add isUserCreated field to AsanaPosture collection
-- MongoDB equivalent operations:
-- db.AsanaPosture.updateMany({}, { $set: { isUserCreated: false } })

-- Add imageCount field to AsanaPosture collection for performance caching
-- db.AsanaPosture.updateMany({}, { $set: { imageCount: 0 } })

-- Set isUserCreated to true for asanas that have a created_by field
-- db.AsanaPosture.updateMany({ created_by: { $exists: true, $ne: null } }, { $set: { isUserCreated: true } })

-- Rollback instructions:
-- To rollback this migration:
-- 1. Remove the isUserCreated field: db.AsanaPosture.updateMany({}, { $unset: { isUserCreated: "" } })
-- 2. Remove the imageCount field: db.AsanaPosture.updateMany({}, { $unset: { imageCount: "" } })

-- Notes:
-- - isUserCreated defaults to false for system asanas
-- - imageCount is a performance cache (updated by application logic)
-- - created_by field is used to determine user ownership
-- - Only user-created asanas can have multiple images (up to 3)