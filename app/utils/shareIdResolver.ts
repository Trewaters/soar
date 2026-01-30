import { getAllSeries } from '@lib/seriesService'
import { getAllSequences } from '@lib/sequenceService'

/**
 * Try to resolve a canonical series id from series data. If `data.id` exists,
 * return the original object. Otherwise attempt to find a matching series by
 * name and return an object with the resolved `id` property if found.
 */
export async function resolveSeriesCanonical(seriesData: any) {
  try {
    if (!seriesData) return seriesData
    if (seriesData.id) return seriesData

    const all = await getAllSeries()
    if (!all || !Array.isArray(all)) return seriesData

    const found = all.find((s: any) => {
      if (!s?.seriesName || !seriesData?.seriesName) return false
      return (
        s.seriesName === seriesData.seriesName ||
        s.seriesName.trim().toLowerCase() ===
          String(seriesData.seriesName).trim().toLowerCase()
      )
    })

    if (found && found.id) {
      return { ...seriesData, id: found.id }
    }
  } catch (e) {
    // ignore resolver errors and return original data
  }
  return seriesData
}

/**
 * Try to resolve a canonical sequence id from sequence data. If `data.id` exists,
 * return the original object. Otherwise attempt to find a matching sequence by
 * `nameSequence` and return an object with the resolved `id` property if found.
 */
export async function resolveSequenceCanonical(sequenceData: any) {
  try {
    if (!sequenceData) return sequenceData
    if (sequenceData.id) return sequenceData

    const all = await getAllSequences()
    if (!all || !Array.isArray(all)) return sequenceData

    const found = all.find((s: any) => {
      if (!s?.nameSequence || !sequenceData?.nameSequence) return false
      return (
        s.nameSequence === sequenceData.nameSequence ||
        s.nameSequence.trim().toLowerCase() ===
          String(sequenceData.nameSequence).trim().toLowerCase()
      )
    })

    if (found && found.id) {
      return { ...sequenceData, id: found.id }
    }
  } catch (e) {
    // ignore resolver errors and return original data
  }
  return sequenceData
}
