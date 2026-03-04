import type { SeriesPoseEntry } from '@app/clientComponents/SeriesPoseList'
import { splitSeriesPoseEntry } from '@app/utils/asana/seriesPoseLabels'

export type SeriesPoseLike =
  | string
  | {
      poseId?: string
      id?: string
      sort_english_name?: string
      secondary?: string
      sanskrit_names?: string[] | string
      alignment_cues?: string
      breathSeries?: string
    }

export function normalizeSeriesPoses(
  seriesPoses: Array<SeriesPoseLike | null | undefined> | null | undefined
): SeriesPoseEntry[] {
  if (!Array.isArray(seriesPoses)) {
    return []
  }

  return seriesPoses.reduce<SeriesPoseEntry[]>((acc, entry) => {
    if (!entry) {
      return acc
    }

    if (typeof entry === 'string') {
      const { name, secondary } = splitSeriesPoseEntry(entry)
      const normalizedName = String(name || '').trim()
      if (!normalizedName) {
        return acc
      }

      acc.push({
        sort_english_name: normalizedName,
        secondary: secondary || undefined,
      })
      return acc
    }

    const normalizedName = String(entry.sort_english_name || '').trim()
    if (!normalizedName) {
      return acc
    }

    const normalizedSanskritNames = Array.isArray(entry.sanskrit_names)
      ? entry.sanskrit_names
          .map((value) => String(value || '').trim())
          .filter((value) => value.length > 0)
      : typeof entry.sanskrit_names === 'string' && entry.sanskrit_names.trim()
        ? [entry.sanskrit_names.trim()]
        : undefined

    acc.push({
      sort_english_name: normalizedName,
      secondary:
        typeof entry.secondary === 'string' && entry.secondary.trim()
          ? entry.secondary.trim()
          : undefined,
      sanskrit_names:
        normalizedSanskritNames && normalizedSanskritNames.length > 0
          ? normalizedSanskritNames
          : undefined,
      alignment_cues:
        typeof entry.alignment_cues === 'string'
          ? entry.alignment_cues
          : undefined,
      breathSeries:
        typeof entry.breathSeries === 'string' ? entry.breathSeries : undefined,
      poseId:
        typeof entry.poseId === 'string'
          ? entry.poseId
          : typeof entry.id === 'string'
            ? entry.id
            : undefined,
    })

    return acc
  }, [])
}
