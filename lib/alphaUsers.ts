/**
 * Provide alpha user IDs for prioritization in search results.
 * v1: Reads from env var ALPHA_USER_IDS as CSV (e.g., "id1,id2,id3").
 * TODO: Replace with role-based lookup from UserData when roles are implemented.
 */
export function getAlphaUserIds(): string[] {
  const csv = process.env.ALPHA_USER_IDS
  if (!csv) return []
  return csv
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
}

export default getAlphaUserIds
