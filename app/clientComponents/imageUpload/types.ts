export interface PoseImage {
  id: string
  url: string
  altText?: string
  fileName?: string
  fileSize?: number
  uploadedAt: string | Date
  displayOrder: number
  asanaId?: string
}
