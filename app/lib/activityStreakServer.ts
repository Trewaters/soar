import { prisma } from './prismaClient'

export type ActivitySourceType = 'asana' | 'series' | 'sequence'

export interface ServerActivityRecord {
  datePerformed: Date
  createdAt?: Date
}

export interface TypedServerActivityRecord extends ServerActivityRecord {
  type: ActivitySourceType
}

export interface FetchServerActivityOptions {
  fromDate?: Date
  includeCreatedAt?: boolean
  orderDesc?: boolean
  take?: number
}

export interface ActivitySourceRecords {
  asanaActivities: ServerActivityRecord[]
  seriesActivities: ServerActivityRecord[]
  sequenceActivities: ServerActivityRecord[]
}

export async function fetchUserActivitySourceRecords(
  userId: string,
  options: FetchServerActivityOptions = {}
): Promise<ActivitySourceRecords> {
  const where: any = { userId }

  if (options.fromDate) {
    where.datePerformed = { gte: options.fromDate }
  }

  const queryArgs: any = { where }

  if (options.orderDesc) {
    queryArgs.orderBy = { datePerformed: 'desc' }
  }

  if (typeof options.take === 'number') {
    queryArgs.take = options.take
  }

  const select = options.includeCreatedAt
    ? { datePerformed: true, createdAt: true }
    : { datePerformed: true }

  const [asanaActivities, seriesActivities, sequenceActivities] =
    await Promise.all([
      prisma.asanaActivity.findMany({ ...queryArgs, select }),
      prisma.seriesActivity.findMany({ ...queryArgs, select }),
      prisma.sequenceActivity.findMany({ ...queryArgs, select }),
    ])

  return {
    asanaActivities: asanaActivities as ServerActivityRecord[],
    seriesActivities: seriesActivities as ServerActivityRecord[],
    sequenceActivities: sequenceActivities as ServerActivityRecord[],
  }
}

export function mergeTypedServerActivityRecords(
  sources: ActivitySourceRecords,
  options?: { sortDesc?: boolean }
): TypedServerActivityRecord[] {
  const merged: TypedServerActivityRecord[] = [
    ...sources.asanaActivities.map((activity) => ({
      ...activity,
      type: 'asana' as const,
    })),
    ...sources.seriesActivities.map((activity) => ({
      ...activity,
      type: 'series' as const,
    })),
    ...sources.sequenceActivities.map((activity) => ({
      ...activity,
      type: 'sequence' as const,
    })),
  ]

  if (options?.sortDesc) {
    merged.sort(
      (a, b) =>
        new Date(b.datePerformed).getTime() -
        new Date(a.datePerformed).getTime()
    )
  }

  return merged
}

export function extractActivityDatesFromSources(
  sources: ActivitySourceRecords
): Date[] {
  return [
    ...sources.asanaActivities.map((activity) => activity.datePerformed),
    ...sources.seriesActivities.map((activity) => activity.datePerformed),
    ...sources.sequenceActivities.map((activity) => activity.datePerformed),
  ]
}
