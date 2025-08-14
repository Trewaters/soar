import '@testing-library/jest-dom'
import { getAsanaTitle } from '@app/utils/search/getAsanaTitle'

describe('getAsanaTitle', () => {
  it('prefers displayName over englishName over title', () => {
    expect(
      getAsanaTitle({
        displayName: 'Virabhadrasana I',
        englishName: 'Warrior I',
        title: 'Warrior One',
      })
    ).toBe('Virabhadrasana I')

    expect(
      getAsanaTitle({ englishName: 'Warrior I', title: 'Warrior One' })
    ).toBe('Warrior I')
    expect(getAsanaTitle({ title: 'Warrior One' })).toBe('Warrior One')
  })

  it('returns empty string when no fields present', () => {
    expect(getAsanaTitle(undefined)).toBe('')
    expect(getAsanaTitle(null as any)).toBe('')
    expect(getAsanaTitle({} as any)).toBe('')
  })

  it('trims and preserves special characters', () => {
    expect(getAsanaTitle({ displayName: '  Supta Baddha Koṇāsana  ' })).toBe(
      'Supta Baddha Koṇāsana'
    )
  })
})
