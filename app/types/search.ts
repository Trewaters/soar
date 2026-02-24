/**
 * Type definitions for grouped data asset search functionality.
 * Used by GroupedDataAssetSearch component and supporting utilities.
 */

/**
 * Represents a section header marker in a grouped autocomplete list.
 */
export interface DataAssetGroup {
  /** The display label for this section header */
  section: string
}

/**
 * A union type representing either an item of type T or a section group header.
 * Used as the option type for the MUI Autocomplete in grouped searches.
 */
export type GroupedDataAssets<T> = Array<T | DataAssetGroup>

/**
 * Configuration passed to the groupDataAssetsByUser utility.
 * @template T - The data asset type (e.g., FlowSeriesData, SequenceData, AsanaPose)
 */
export interface GroupedSearchConfig<T> {
  /** Array of all data items to group */
  items: T[]
  /** Function to extract the "createdBy" identifier from an item */
  // eslint-disable-next-line no-unused-vars
  getCreatedBy: (item: T) => string | undefined
  /** Current user's ID (from session) */
  currentUserId?: string
  /** Current user's email (from session) */
  currentUserEmail?: string
  /** Array of alpha user IDs that qualify items for the "Public" group */
  alphaUserIds?: string[]
  /** Label for the user-created items section (e.g., "My Flows") */
  myLabel: string
  /** Label for the alpha-user-created items section (e.g., "Public Flows") */
  publicLabel: string
  /** Optional label for the "others" section. Only included if provided. */
  othersLabel?: string
}
