import {
  DataAssetGroup,
  GroupedDataAssets,
  GroupedSearchConfig,
} from '@app/types/search'

/**
 * Groups an array of data assets into labelled sections based on who created them.
 *
 * Sections produced (in order, only when non-empty):
 *  1. **My [Asset]** – items whose `createdBy` matches the current user's ID or email
 *  2. **Public [Asset]** – items whose `createdBy` matches one of the alpha user IDs
 *  3. **Others** (optional) – all remaining items (only when `othersLabel` is provided)
 *
 * Duplicate items (by identity) are deduplicated using a `Set` based on object reference.
 *
 * @template T - The data asset type (e.g., FlowSeriesData, SequenceData, AsanaPose)
 * @param config - Configuration object – see {@link GroupedSearchConfig}
 * @returns An array of items interleaved with {@link DataAssetGroup} section markers.
 *
 * @example
 * ```ts
 * const grouped = groupDataAssetsByUser({
 *   items: allFlows,
 *   getCreatedBy: (f) => f.createdBy,
 *   currentUserId: session.user.id,
 *   currentUserEmail: session.user.email,
 *   alphaUserIds: getAlphaUserIds(),
 *   myLabel: 'My Flows',
 *   publicLabel: 'Public Flows',
 * })
 * ```
 */
export function groupDataAssetsByUser<T>(
  config: GroupedSearchConfig<T>
): GroupedDataAssets<T> {
  const {
    items,
    getCreatedBy,
    currentUserId,
    currentUserEmail,
    alphaUserIds = [],
    myLabel,
    publicLabel,
    othersLabel,
  } = config

  // Collect user identifiers for "My [Asset]" grouping
  const userIdentifiers = [currentUserId, currentUserEmail].filter(
    (id): id is string => !!id
  )

  const mine: T[] = []
  const alpha: T[] = []
  const others: T[] = []
  const seenItems = new Set<T>()

  for (const item of items) {
    // Deduplicate by reference
    if (seenItems.has(item)) continue
    seenItems.add(item)

    const createdBy = getCreatedBy(item)

    if (createdBy && userIdentifiers.includes(createdBy)) {
      mine.push(item)
    } else if (createdBy && alphaUserIds.includes(createdBy)) {
      alpha.push(item)
    } else {
      others.push(item)
    }
  }

  const result: GroupedDataAssets<T> = []

  if (mine.length > 0) {
    result.push({ section: myLabel } as DataAssetGroup)
    mine.forEach((item) => result.push(item))
  }

  if (alpha.length > 0) {
    result.push({ section: publicLabel } as DataAssetGroup)
    alpha.forEach((item) => result.push(item))
  }

  if (othersLabel && others.length > 0) {
    result.push({ section: othersLabel } as DataAssetGroup)
    others.forEach((item) => result.push(item))
  }

  return result
}
