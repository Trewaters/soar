/**
 * Type definitions for the unified ActivityTracker component
 *
 * This component consolidates activity tracking for asanas, series, and sequences
 * into a single reusable component with configurable behavior via props.
 */

/**
 * Supported entity types for activity tracking
 */
export type EntityType = 'asana' | 'series' | 'sequence'

/**
 * UI variant for the component
 * - 'card': Full styled card with Paper wrapper, title, and success message
 * - 'inline': Minimal inline variant without wrapper
 */
export type ComponentVariant = 'inline' | 'card'

/**
 * Result from checking if an activity exists
 */
export interface CheckActivityResult {
  exists: boolean
  activity?: {
    difficulty?: string
    completionStatus?: string
    datePerformed?: string
    [key: string]: any
  }
}

/**
 * Data required to create a new activity
 */
export interface CreateActivityData {
  userId: string
  difficulty?: string
  completionStatus: string
  datePerformed: Date
  [key: string]: any // Allow additional entity-specific fields
}

/**
 * Props for the ActivityTracker component
 */
export interface ActivityTrackerProps {
  // Entity identification
  entityId: string
  entityName: string
  entityType: EntityType

  // Service function configuration
  checkActivity: (
    userId: string,
    entityId: string
  ) => Promise<CheckActivityResult>
  createActivity: (data: any) => Promise<any>
  deleteActivity: (userId: string, entityId: string) => Promise<void>

  // UI configuration
  variant?: ComponentVariant // Default: 'card'
  title?: string // Default: based on entityType
  showSuccessMessage?: boolean // Default: true for card, false for inline
  buttonLabel?: string // Default: based on entityType

  // Integration callbacks
  onActivityToggle?: (isTracked: boolean) => void
  onActivityRefresh?: () => void // For WeeklyActivityTracker refresh trigger

  // Additional data for activity creation
  additionalActivityData?: Record<string, any>
}
