const DIFFICULTY_TAGS = new Set(['beginner', 'intermediate', 'advanced'])

export function sanitizeSeriesSecondaryLabel(label?: string | null): string {
  if (!label) return ''
  const trimmed = label.trim()
  if (!trimmed) return ''
  return DIFFICULTY_TAGS.has(trimmed.toLowerCase()) ? '' : trimmed
}

export function formatSeriesPostureEntry(
  name: string,
  secondary?: string | null
): string {
  const safeName = (name ?? '').trim()
  const sanitizedSecondary = sanitizeSeriesSecondaryLabel(secondary)

  if (!safeName) {
    return sanitizedSecondary ? sanitizedSecondary : ''
  }

  return sanitizedSecondary ? `${safeName}; ${sanitizedSecondary}` : safeName
}

export function splitSeriesPostureEntry(entry: string): {
  name: string
  secondary: string
} {
  if (!entry) {
    return { name: '', secondary: '' }
  }

  const [namePart = '', secondaryPart = ''] = entry.split(';')
  return {
    name: namePart.trim(),
    secondary: sanitizeSeriesSecondaryLabel(secondaryPart),
  }
}
