/**
 * Types for Image Management in Soar Yoga Application
 * Supports multi-image carousel functionality for user-created asanas
 */

// Database model types from Prisma
export interface PoseImageData {
  id: string
  userId: string
  poseId?: string
  poseName?: string
  url: string
  altText?: string
  fileName?: string
  fileSize?: number
  uploadedAt: Date
  storageType: 'CLOUD' | 'LOCAL' | 'HYBRID'
  localStorageId?: string
  isOffline: boolean
  imageType: string
  displayOrder: number // New field for carousel ordering (1-3)
  createdAt: Date
  updatedAt: Date
}

// Enhanced AsanaPose interface with new multi-image fields
export interface AsanaPoseData {
  id: string
  english_names: string[]
  sanskrit_names?: any
  sort_english_name: string
  description?: string
  benefits?: string
  category?: string
  difficulty?: string
  lore?: string
  breath_direction_default?: string
  dristi?: string
  variations: string[]
  modifications: string[]
  label?: string
  suggested_poses: string[]
  preparatory_poses: string[]
  preferred_side?: string
  sideways?: boolean
  image?: string
  created_on?: Date
  updated_on?: Date
  acitivity_completed?: boolean
  acitivity_practice?: boolean
  pose_intent?: string
  breath_series: string[]
  duration_asana?: string
  transition_cues_out?: string
  transition_cues_in?: string
  setup_cues?: string
  deepening_cues?: string
  customize_asana?: string
  additional_cues?: string
  joint_action?: string
  muscle_action?: string
  created_by?: string
  isUserCreated: boolean // New field to identify user-created asanas
  imageCount: number // New field for performance caching
  poseImages?: PoseImageData[] // Related images for carousel
}

// API Request/Response Types

export interface ImageUploadRequest {
  file: File
  altText?: string
  userId: string
  poseId?: string
  poseName?: string
  imageType?: string
  displayOrder?: number
}

export interface ImageUploadResponse {
  id: string
  url: string
  altText?: string
  fileName?: string
  fileSize?: number
  uploadedAt: Date
  storageType: string
  imageType: string
  displayOrder: number
  remainingSlots: number // How many more images can be uploaded
  totalImages: number // Current total images for this asana
}

export interface ImageReorderRequest {
  images: Array<{
    imageId: string
    displayOrder: number
  }>
}

export interface ImageReorderResponse {
  success: boolean
  images: PoseImageData[]
  message?: string
}

export interface ImageQueryRequest {
  poseId?: string
  poseName?: string
  imageType?: string
  orderBy?: 'uploadedAt' | 'displayOrder'
  includeOwnership?: boolean
  limit?: number
  offset?: number
}

export interface ImageQueryResponse {
  images: PoseImageData[]
  total: number
  hasMore: boolean
  ownership?: {
    canManage: boolean
    isOwner: boolean
    isUserCreated: boolean
  }
}

export interface ImageDeleteResponse {
  success: boolean
  remainingImages: PoseImageData[]
  newImageCount: number
  message?: string
}

// Error Types
export interface ImageManagementError {
  code:
    | 'LIMIT_EXCEEDED'
    | 'UNAUTHORIZED'
    | 'NOT_FOUND'
    | 'INVALID_ORDER'
    | 'SYSTEM_ASANA'
  message: string
  details?: any
}

// Utility Types for Components
export interface CarouselImage {
  id: string
  url: string
  altText?: string
  displayOrder: number
}

export interface ImageManagementPermissions {
  canUpload: boolean
  canDelete: boolean
  canReorder: boolean
  maxImages: number
  currentCount: number
  remainingSlots: number
}

// Constants
export const MAX_IMAGES_PER_ASANA = 3
export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]

// Type Guards
export function isPoseImageData(obj: any): obj is PoseImageData {
  return (
    obj &&
    typeof obj.id === 'string' &&
    typeof obj.userId === 'string' &&
    typeof obj.url === 'string' &&
    typeof obj.displayOrder === 'number'
  )
}

export function isUserCreatedAsana(asana: AsanaPoseData): boolean {
  return asana.isUserCreated === true
}

export function canHaveMultipleImages(asana: AsanaPoseData): boolean {
  return isUserCreatedAsana(asana)
}
