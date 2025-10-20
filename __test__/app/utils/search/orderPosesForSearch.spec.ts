import { orderPosesForSearch } from '@app/utils/search/orderPosesForSearch'

describe('orderPosesForSearch', () => {
  const getTitle = (p: any) => p.displayName || p.englishName || p.title || ''
  const alphaUserIds = ['alpha1', 'alpha2']
  const currentUserId = 'user1'

  const make = (overrides: Partial<any>) => ({
    id: overrides.id || Math.random().toString(36).slice(2),
    createdBy: overrides.createdBy,
    displayName: overrides.displayName,
    englishName: overrides.englishName,
    title: overrides.title,
  })

  it('partitions user-created, alpha-created, and others', () => {
    const poses = [
      make({
        id: 'a',
        createdBy: 'user1',
        displayName: 'User Pose',
      }),
      make({
        id: 'b',
        createdBy: 'alpha1',
        displayName: 'Alpha Pose',
      }),
      make({
        id: 'c',
        createdBy: 'other',
        displayName: 'Other Pose',
      }),
    ]
    const result = orderPosesForSearch(
      poses,
      currentUserId,
      alphaUserIds,
      getTitle
    )
    expect(result.map(getTitle)).toEqual([
      'User Pose',
      'Alpha Pose',
      'Other Pose',
    ])
  })

  it('dedupes by id', () => {
    const poses = [
      make({
        id: 'a',
        createdBy: 'user1',
        displayName: 'Pose X',
      }),
      make({
        id: 'b',
        createdBy: 'alpha1',
        displayName: 'Pose X Alpha',
      }),
      make({ id: 'c', createdBy: 'other', displayName: 'Pose C' }),
      make({ id: 'c', createdBy: 'other', displayName: 'Pose C Duplicate' }),
    ]
    const result = orderPosesForSearch(
      poses,
      currentUserId,
      alphaUserIds,
      getTitle
    )
    // we only dedupe by `id`, so both 'Pose X' and
    // 'Pose X Alpha' remain because they have different ids ('a' and 'b').
    expect(result.map(getTitle)).toEqual(['Pose X', 'Pose X Alpha', 'Pose C'])
  })

  it('sorts each group alphabetically by display title', () => {
    const poses = [
      make({ id: 'a', createdBy: 'user1', displayName: 'Zebra' }),
      make({ id: 'b', createdBy: 'user1', displayName: 'Apple' }),
      make({ id: 'c', createdBy: 'alpha1', displayName: 'Beta' }),
      make({ id: 'd', createdBy: 'alpha1', displayName: 'Alpha' }),
      make({ id: 'e', createdBy: 'other', displayName: 'Delta' }),
      make({ id: 'f', createdBy: 'other', displayName: 'Charlie' }),
    ]
    const result = orderPosesForSearch(
      poses,
      currentUserId,
      alphaUserIds,
      getTitle
    )
    expect(result.map(getTitle)).toEqual([
      'Apple',
      'Zebra', // user-created sorted
      'Alpha',
      'Beta', // alpha-created sorted
      'Charlie',
      'Delta', // others sorted
    ])
  })

  it('handles duplicates and dedupes by id', () => {
    const poses = [
      make({ id: 'a', createdBy: 'user1', displayName: 'Pose A' }),
      make({ id: 'a', createdBy: 'alpha1', displayName: 'Pose A Alpha' }),
      make({ id: 'b', createdBy: 'other', displayName: 'Pose B' }),
    ]
    const result = orderPosesForSearch(
      poses,
      currentUserId,
      alphaUserIds,
      getTitle
    )
    expect(result.map(getTitle)).toEqual(['Pose A', 'Pose B'])
  })

  it('is stable with large arrays', () => {
    const poses = []
    for (let i = 0; i < 1000; i++) {
      poses.push(
        make({
          id: `id${i}`,
          createdBy: i % 2 === 0 ? 'user1' : 'other',
          displayName: `Pose${i}`,
        })
      )
    }
    const result = orderPosesForSearch(
      poses,
      currentUserId,
      alphaUserIds,
      getTitle
    )
    expect(result.length).toBe(1000)
    expect(result[0].displayName).toBe('Pose0')
    expect(result[result.length - 1].displayName).toBe('Pose999')
  })

  it('sorts case-insensitively', () => {
    const poses = [
      make({ id: 'a', createdBy: 'user1', displayName: 'apple' }),
      make({ id: 'b', createdBy: 'user1', displayName: 'Banana' }),
      make({ id: 'c', createdBy: 'user1', displayName: 'cherry' }),
    ]
    const result = orderPosesForSearch(
      poses,
      currentUserId,
      alphaUserIds,
      getTitle
    )
    expect(result.map(getTitle)).toEqual(
      ['apple', 'Banana', 'cherry'].sort((a, b) =>
        a.localeCompare(b, undefined, { sensitivity: 'base' })
      )
    )
  })
})
