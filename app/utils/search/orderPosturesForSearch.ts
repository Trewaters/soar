// Centralized utility for ordering postures in search results
// See TaskList-PRD-autosearch-user-poses-top.md, Task 15

export type OrderPosturesForSearchOpts<T> = {
  currentUserId?: string | null
  alphaUserIds: string[]
  getTitle: (item: T) => string
}

/**
 * Orders postures for search: user-created, alpha-created, others (alphabetical), deduped by canonicalAsanaId (fallback to id).
 * @param postures Array of posture objects
 * @param currentUserId Current user's id
 * @param alphaUserIds Array of alpha user ids
 * @param getTitle Function to get display title
 * @returns Ordered array: user-created, alpha, others
 */
export function orderPosturesForSearch<
  T extends { canonicalAsanaId?: string; id: string; createdBy?: string },
>(
  postures: T[],
  currentUserId: string | null | undefined,
  alphaUserIds: string[],
  getTitle: (item: T) => string
): T[] {
  // Partition
  const userCreated: T[] = []
  const alphaCreated: T[] = []
  const others: T[] = []
  const seenIds = new Set<string>()

  for (const posture of postures) {
    const key = posture.canonicalAsanaId || posture.id
    if (seenIds.has(key)) continue
    seenIds.add(key)
    if (posture.createdBy === currentUserId) {
      userCreated.push(posture)
    } else if (posture.createdBy && alphaUserIds.includes(posture.createdBy)) {
      alphaCreated.push(posture)
    } else {
      others.push(posture)
    }
  }

  // Sort each group alphabetically by display title
  const sortByTitle = (a: T, b: T) =>
    getTitle(a).localeCompare(getTitle(b), undefined, { sensitivity: 'base' })
  userCreated.sort(sortByTitle)
  alphaCreated.sort(sortByTitle)
  others.sort(sortByTitle)

  // Return ordered array
  return [...userCreated, ...alphaCreated, ...others]
  // End of file
}
