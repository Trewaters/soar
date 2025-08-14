import { orderPosturesForSearch } from '@app/utils/search/orderPosturesForSearch'

describe('orderPosturesForSearch', () => {
  const getTitle = (p: any) => p.displayName || p.englishName || p.title || ''
  const alphaUserIds = ['alpha1', 'alpha2']
  const currentUserId = 'user1'

  const make = (overrides: Partial<any>) => ({
    id: overrides.id || Math.random().toString(36).slice(2),
    canonicalAsanaId: overrides.canonicalAsanaId,
    createdBy: overrides.createdBy,
    displayName: overrides.displayName,
    englishName: overrides.englishName,
    title: overrides.title,
  })

  it('partitions user-created, alpha-created, and others', () => {
    const postures = [
      make({
        id: 'a',
        canonicalAsanaId: 'x',
        createdBy: 'user1',
        displayName: 'User Pose',
      }),
      make({
        id: 'b',
        canonicalAsanaId: 'y',
        createdBy: 'alpha1',
        displayName: 'Alpha Pose',
      }),
      make({
        id: 'c',
        canonicalAsanaId: 'z',
        createdBy: 'other',
        displayName: 'Other Pose',
      }),
    ]
    const result = orderPosturesForSearch(
      postures,
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

  it('dedupes by canonicalAsanaId, fallback to id', () => {
    const postures = [
      make({
        id: 'a',
        canonicalAsanaId: 'x',
        createdBy: 'user1',
        displayName: 'Pose X',
      }),
      make({
        id: 'b',
        canonicalAsanaId: 'x',
        createdBy: 'alpha1',
        displayName: 'Pose X Alpha',
      }),
      make({ id: 'c', createdBy: 'other', displayName: 'Pose C' }),
      make({ id: 'c', createdBy: 'other', displayName: 'Pose C Duplicate' }),
    ]
    const result = orderPosturesForSearch(
      postures,
      currentUserId,
      alphaUserIds,
      getTitle
    )
    expect(result.map(getTitle)).toEqual(['Pose X', 'Pose C'])
  })

  it('sorts each group alphabetically by display title', () => {
    const postures = [
      make({ id: 'a', createdBy: 'user1', displayName: 'Zebra' }),
      make({ id: 'b', createdBy: 'user1', displayName: 'Apple' }),
      make({ id: 'c', createdBy: 'alpha1', displayName: 'Beta' }),
      make({ id: 'd', createdBy: 'alpha1', displayName: 'Alpha' }),
      make({ id: 'e', createdBy: 'other', displayName: 'Delta' }),
      make({ id: 'f', createdBy: 'other', displayName: 'Charlie' }),
    ]
    const result = orderPosturesForSearch(
      postures,
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

  it('handles missing canonicalAsanaId and dedupes by id', () => {
    const postures = [
      make({ id: 'a', createdBy: 'user1', displayName: 'Pose A' }),
      make({ id: 'a', createdBy: 'alpha1', displayName: 'Pose A Alpha' }),
      make({ id: 'b', createdBy: 'other', displayName: 'Pose B' }),
    ]
    const result = orderPosturesForSearch(
      postures,
      currentUserId,
      alphaUserIds,
      getTitle
    )
    expect(result.map(getTitle)).toEqual(['Pose A', 'Pose B'])
  })

  it('is stable with large arrays', () => {
    const postures = []
    for (let i = 0; i < 1000; i++) {
      postures.push(
        make({
          id: `id${i}`,
          createdBy: i % 2 === 0 ? 'user1' : 'other',
          displayName: `Pose${i}`,
        })
      )
    }
    const result = orderPosturesForSearch(
      postures,
      currentUserId,
      alphaUserIds,
      getTitle
    )
    expect(result.length).toBe(1000)
    expect(result[0].displayName).toBe('Pose0')
    expect(result[result.length - 1].displayName).toBe('Pose999')
  })

  it('sorts case-insensitively', () => {
    const postures = [
      make({ id: 'a', createdBy: 'user1', displayName: 'apple' }),
      make({ id: 'b', createdBy: 'user1', displayName: 'Banana' }),
      make({ id: 'c', createdBy: 'user1', displayName: 'cherry' }),
    ]
    const result = orderPosturesForSearch(
      postures,
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
