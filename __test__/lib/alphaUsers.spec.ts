import '@testing-library/jest-dom'
import { getAlphaUserIds } from '@lib/alphaUsers'

describe('getAlphaUserIds', () => {
  const old = process.env.ALPHA_USER_IDS
  afterEach(() => {
    process.env.ALPHA_USER_IDS = old
  })

  it('returns empty array when env not set', () => {
    delete process.env.ALPHA_USER_IDS
    expect(getAlphaUserIds()).toEqual([])
  })

  it('parses CSV list correctly', () => {
    process.env.ALPHA_USER_IDS = 'a1, a2 , ,a3,, '
    expect(getAlphaUserIds()).toEqual(['a1', 'a2', 'a3'])
  })
})
