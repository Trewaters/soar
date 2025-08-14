export type GenericAsana = {
  displayName?: string | null
  englishName?: string | null
  title?: string | null
}

/**
 * Resolve a human-friendly title for an Asana-like object.
 * Prefers displayName, then englishName, then title. Returns empty string if none.
 */
export function getAsanaTitle(asana: GenericAsana | null | undefined): string {
  if (!asana) return ''
  const value = asana.displayName ?? asana.englishName ?? asana.title ?? ''
  return String(value ?? '').trim()
}

export default getAsanaTitle
