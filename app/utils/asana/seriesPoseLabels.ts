const DIFFICULTY_TAGS = new Set(['beginner', 'intermediate', 'advanced'])

export function sanitizeSeriesSecondaryLabel(label?: string | null): string {
  if (!label) return ''
  const trimmed = label.trim()
  if (!trimmed) return ''
  return DIFFICULTY_TAGS.has(trimmed.toLowerCase()) ? '' : trimmed
}

export function formatSeriesPoseEntry(
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

export function splitSeriesPoseEntry(entry: string | any): {
  name: string
  secondary: string
} {
  // Handle null/undefined
  if (!entry) {
    return { name: '', secondary: '' }
  }

  // Handle new object format (FlowSeriesPose or similar Asana objects)
  if (typeof entry === 'object' && entry !== null) {
    return {
      name: entry.sort_english_name || entry.name || '',
      secondary: sanitizeSeriesSecondaryLabel(
        entry.secondary || entry.difficulty
      ),
    }
  }

  // Handle legacy string format "name; secondary"
  if (typeof entry === 'string') {
    const [namePart = '', secondaryPart = ''] = entry.split(';')
    return {
      name: namePart.trim(),
      secondary: sanitizeSeriesSecondaryLabel(secondaryPart),
    }
  }

  // Fallback for unexpected types
  return { name: '', secondary: '' }
}
