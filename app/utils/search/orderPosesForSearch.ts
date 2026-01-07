// Centralized utility for ordering poses in search results
// See TaskList-PRD-autosearch-user-poses-top.md, Task 15

export type OrderPosesForSearchOpts<T> = {
  currentUserId?: string | null
  alphaUserIds: string[]
  getTitle: (_: T) => string
}

/**
 * Orders poses for search: user-created, alpha-created, others (alphabetical).
 * Dedupe is performed by the pose's own `id`.
 * @param poses Array of pose objects
 * @param currentUserId Current user's id
 * @param alphaUserIds Array of alpha user ids
 * @param getTitle Function to get display title
 * @returns Ordered array: user-created, alpha, others
 */
export function orderPosesForSearch<
  T extends { id: string; createdBy?: string },
>(
  poses: T[],
  currentUserId: string | null | undefined,
  alphaUserIds: string[],
  getTitle: (_: T) => string
): T[] {
  // Partition
  const userCreated: T[] = []
  const alphaCreated: T[] = []
  const others: T[] = []
  const seenIds = new Set<string>()

  for (const pose of poses) {
    const key = pose.id
    if (seenIds.has(key)) continue
    seenIds.add(key)
    if (pose.createdBy === currentUserId) {
      userCreated.push(pose)
    } else if (pose.createdBy && alphaUserIds.includes(pose.createdBy)) {
      alphaCreated.push(pose)
    } else {
      others.push(pose)
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
