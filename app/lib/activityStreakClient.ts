import {
  calculateActivityStreakSummaryFromDateKeys,
  getUniqueActivityDateKeys,
  type ActivityStreakSummary,
} from './activityStreakCalculator'

export type UserActivityItem = {
  datePerformed: string
}

export type ActivitySourceType = 'asana' | 'series' | 'sequence'

type TypedActivity<
  T extends UserActivityItem,
  K extends ActivitySourceType,
> = T & {
  type: K
}

export type CombinedUserActivity<
  TAsana extends UserActivityItem = UserActivityItem,
  TSeries extends UserActivityItem = UserActivityItem,
  TSequence extends UserActivityItem = UserActivityItem,
> =
  | TypedActivity<TAsana, 'asana'>
  | TypedActivity<TSeries, 'series'>
  | TypedActivity<TSequence, 'sequence'>

function getActivityEndpointUrls(userId: string): string[] {
  const encodedUserId = encodeURIComponent(userId)

  return [
    `/api/asanaActivity?userId=${encodedUserId}`,
    `/api/seriesActivity?userId=${encodedUserId}`,
    `/api/sequenceActivity?userId=${encodedUserId}`,
  ]
}

async function parseActivities(
  response: Response
): Promise<UserActivityItem[]> {
  if (!response.ok) {
    return []
  }

  const payload = await response.json()
  return Array.isArray(payload) ? (payload as UserActivityItem[]) : []
}

export async function fetchCombinedUserActivities<
  TAsana extends UserActivityItem = UserActivityItem,
  TSeries extends UserActivityItem = UserActivityItem,
  TSequence extends UserActivityItem = UserActivityItem,
>(userId: string): Promise<CombinedUserActivity<TAsana, TSeries, TSequence>[]> {
  const responses = await Promise.all(
    getActivityEndpointUrls(userId).map((url) => fetch(url))
  )

  const [asanaItems, seriesItems, sequenceItems] = await Promise.all(
    responses.map(parseActivities)
  )

  const combinedData: CombinedUserActivity<TAsana, TSeries, TSequence>[] = [
    ...(asanaItems.map((activity) => ({
      ...(activity as TAsana),
      type: 'asana' as const,
    })) as TypedActivity<TAsana, 'asana'>[]),
    ...(seriesItems.map((activity) => ({
      ...(activity as TSeries),
      type: 'series' as const,
    })) as TypedActivity<TSeries, 'series'>[]),
    ...(sequenceItems.map((activity) => ({
      ...(activity as TSequence),
      type: 'sequence' as const,
    })) as TypedActivity<TSequence, 'sequence'>[]),
  ]

  combinedData.sort(
    (a, b) =>
      new Date(b.datePerformed).getTime() - new Date(a.datePerformed).getTime()
  )

  return combinedData
}

export async function fetchUserActivityStreakSummary(
  userId: string,
  timezoneOffsetMinutes = new Date().getTimezoneOffset()
): Promise<ActivityStreakSummary> {
  const mergedActivities = await fetchCombinedUserActivities(userId)
  const mergedActivityDates = mergedActivities.map((item) => item.datePerformed)

  const sortedActivityDays = getUniqueActivityDateKeys(
    mergedActivityDates,
    timezoneOffsetMinutes
  )

  return calculateActivityStreakSummaryFromDateKeys(
    sortedActivityDays,
    timezoneOffsetMinutes
  )
}
