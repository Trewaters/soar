// Returns a static list of public content creator IDs used to group search results.
// 'alpha users' is the legacy identifier; 'PUBLIC' is used for newer public content.
export function getAlphaUserIds(): string[] {
  return ['alpha users', 'PUBLIC']
}

export default getAlphaUserIds
