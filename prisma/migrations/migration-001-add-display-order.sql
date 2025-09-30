-- Migration 001: Add displayOrder field to PoseImage collection
-- Date: 2025-09-30
-- Description: Adds displayOrder field to support carousel navigation for multi-image asanas

-- For MongoDB, this is more of a documentation file since Prisma handles MongoDB migrations differently
-- However, this provides a reference for the changes being made

-- Add displayOrder field to PoseImage collection
-- MongoDB equivalent operations:
-- db.PoseImage.updateMany({}, { $set: { displayOrder: 1 } })

-- Add composite index for efficient carousel queries
-- db.PoseImage.createIndex({ postureId: 1, displayOrder: 1 })

-- Rollback instructions:
-- To rollback this migration:
-- 1. Remove the displayOrder field: db.PoseImage.updateMany({}, { $unset: { displayOrder: "" } })
-- 2. Drop the composite index: db.PoseImage.dropIndex({ postureId: 1, displayOrder: 1 })

-- Notes:
-- - displayOrder defaults to 1 for existing images
-- - Valid range: 1-3 (enforced at application level)
-- - Used for carousel navigation ordering
-- - Required for multi-image carousel functionality