import { DataAssetGroup, GroupedDataAssets } from '@app/types/search'

/**
 * Sorts items within each group of a {@link GroupedDataAssets} array alphabetically,
 * using locale-aware comparison. Group header markers are preserved in place.
 *
 * @template T - The data asset type
 * @param grouped - A grouped array (output from {@link groupDataAssetsByUser})
 * @param displayField - Function that returns the string to sort by for each item.
 *   Should handle Sanskrit terms and special characters gracefully.
 * @returns A new array with items sorted alphabetically within each section.
 *
 * @example
 * ```ts
 * const sorted = orderDataAssetsInGroups(grouped, (f) => f.seriesName)
 * ```
 */
export function orderDataAssetsInGroups<T>(
  grouped: GroupedDataAssets<T>,
  displayField: (item: T) => string
): GroupedDataAssets<T> {
  const result: GroupedDataAssets<T> = []

  // Walk through grouped array; collect each section's items and sort them
  let i = 0
  while (i < grouped.length) {
    const entry = grouped[i]

    if (isSection(entry)) {
      // Collect all items until the next section header
      const sectionHeader = entry as DataAssetGroup
      const sectionItems: T[] = []
      i++

      while (i < grouped.length && !isSection(grouped[i])) {
        sectionItems.push(grouped[i] as T)
        i++
      }

      // Sort items alphabetically within this section
      sectionItems.sort((a, b) =>
        displayField(a).localeCompare(displayField(b), undefined, {
          sensitivity: 'base',
        })
      )

      result.push(sectionHeader)
      sectionItems.forEach((item) => result.push(item))
    } else {
      // Top-level item with no section (shouldn't normally happen, but handle gracefully)
      result.push(entry)
      i++
    }
  }

  return result
}

/** Type guard to distinguish section header markers from actual items. */
function isSection(entry: unknown): entry is DataAssetGroup {
  return (
    typeof entry === 'object' &&
    entry !== null &&
    'section' in entry &&
    Object.keys(entry).length === 1
  )
}
