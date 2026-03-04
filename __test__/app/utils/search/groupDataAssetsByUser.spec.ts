import { groupDataAssetsByUser } from '@app/utils/search/groupDataAssetsByUser'
import { DataAssetGroup } from '@app/types/search'

interface TestItem {
  id: string
  name: string
  createdBy?: string
}

const isSection = (entry: unknown): entry is DataAssetGroup =>
  typeof entry === 'object' && entry !== null && 'section' in (entry as object)

const make = (overrides: Partial<TestItem>): TestItem => ({
  id: overrides.id ?? Math.random().toString(36).slice(2),
  name: overrides.name ?? 'Unnamed',
  createdBy: overrides.createdBy,
})

const defaultConfig = {
  getCreatedBy: (item: TestItem) => item.createdBy,
  currentUserId: 'user-123',
  currentUserEmail: 'user@test.com',
  alphaUserIds: ['alpha-1', 'alpha-2'],
  myLabel: 'My Items',
  publicLabel: 'Public Items',
}

describe('groupDataAssetsByUser', () => {
  describe('Rendering basic groups', () => {
    it('should return an empty array when no items are provided', () => {
      const result = groupDataAssetsByUser({ ...defaultConfig, items: [] })
      expect(result).toEqual([])
    })

    it('should place items matching currentUserId into My section', () => {
      const item = make({ id: 'a', name: 'My Item', createdBy: 'user-123' })
      const result = groupDataAssetsByUser({ ...defaultConfig, items: [item] })
      expect(result).toEqual([{ section: 'My Items' }, item])
    })

    it('should place items matching currentUserEmail into My section', () => {
      const item = make({
        id: 'a',
        name: 'Email Item',
        createdBy: 'user@test.com',
      })
      const result = groupDataAssetsByUser({ ...defaultConfig, items: [item] })
      expect(result).toEqual([{ section: 'My Items' }, item])
    })

    it('should place alpha user items into Public section', () => {
      const item = make({ id: 'b', name: 'Alpha Item', createdBy: 'alpha-1' })
      const result = groupDataAssetsByUser({ ...defaultConfig, items: [item] })
      expect(result).toEqual([{ section: 'Public Items' }, item])
    })

    it('should omit Others section when othersLabel is not provided', () => {
      const item = make({
        id: 'c',
        name: 'Other Item',
        createdBy: 'unknown-user',
      })
      const result = groupDataAssetsByUser({ ...defaultConfig, items: [item] })
      const sections = result
        .filter(isSection)
        .map((s) => (s as DataAssetGroup).section)
      expect(sections).not.toContain('Others')
      expect(result).toEqual([]) // no My or Public items match
    })

    it('should include Others section when othersLabel is provided', () => {
      const item = make({
        id: 'c',
        name: 'Other Item',
        createdBy: 'unknown-user',
      })
      const result = groupDataAssetsByUser({
        ...defaultConfig,
        items: [item],
        othersLabel: 'Others',
      })
      expect(result).toEqual([{ section: 'Others' }, item])
    })
  })

  describe('Section ordering', () => {
    it('should produce My Items first, then Public Items', () => {
      const mine = make({ id: 'a', createdBy: 'user-123' })
      const pub = make({ id: 'b', createdBy: 'alpha-1' })
      const result = groupDataAssetsByUser({
        ...defaultConfig,
        items: [pub, mine],
      })
      const sections = result
        .filter(isSection)
        .map((s) => (s as DataAssetGroup).section)
      expect(sections).toEqual(['My Items', 'Public Items'])
    })

    it('should produce My, Public, Others in correct order when all present', () => {
      const mine = make({ id: 'a', createdBy: 'user-123' })
      const pub = make({ id: 'b', createdBy: 'alpha-2' })
      const other = make({ id: 'c', createdBy: 'unknown' })
      const result = groupDataAssetsByUser({
        ...defaultConfig,
        items: [other, pub, mine],
        othersLabel: 'Others',
      })
      const sections = result
        .filter(isSection)
        .map((s) => (s as DataAssetGroup).section)
      expect(sections).toEqual(['My Items', 'Public Items', 'Others'])
    })

    it('should omit a section header when that section is empty', () => {
      const pub = make({ id: 'b', createdBy: 'alpha-1' })
      const result = groupDataAssetsByUser({ ...defaultConfig, items: [pub] })
      const sections = result
        .filter(isSection)
        .map((s) => (s as DataAssetGroup).section)
      expect(sections).toEqual(['Public Items'])
      expect(sections).not.toContain('My Items')
    })
  })

  describe('Deduplication', () => {
    it('should deduplicate items by object reference', () => {
      const item = make({ id: 'a', createdBy: 'user-123' })
      const result = groupDataAssetsByUser({
        ...defaultConfig,
        items: [item, item],
      })
      const nonSections = result.filter((r) => !isSection(r))
      expect(nonSections).toHaveLength(1)
    })

    it('should keep distinct object instances even with same id', () => {
      const a = make({ id: 'dup', name: 'First', createdBy: 'user-123' })
      const b = make({ id: 'dup', name: 'Second', createdBy: 'user-123' })
      const result = groupDataAssetsByUser({
        ...defaultConfig,
        items: [a, b],
      })
      const nonSections = result.filter((r) => !isSection(r))
      expect(nonSections).toHaveLength(2)
    })
  })

  describe('Edge cases', () => {
    it('should handle items with no createdBy field', () => {
      const item = make({ id: 'a', name: 'No Creator' })
      item.createdBy = undefined
      const result = groupDataAssetsByUser({
        ...defaultConfig,
        items: [item],
        othersLabel: 'Others',
      })
      // no createdBy → falls into others
      expect(result).toEqual([{ section: 'Others' }, item])
    })

    it('should handle null/undefined currentUserId gracefully', () => {
      const item = make({ id: 'a', createdBy: 'alpha-1' })
      const result = groupDataAssetsByUser({
        ...defaultConfig,
        currentUserId: undefined,
        items: [item],
      })
      expect(result).toEqual([{ section: 'Public Items' }, item])
    })

    it('should handle empty alphaUserIds array', () => {
      const item = make({ id: 'a', createdBy: 'alpha-1' })
      const result = groupDataAssetsByUser({
        ...defaultConfig,
        alphaUserIds: [],
        items: [item],
        othersLabel: 'Others',
      })
      // no alpha match → falls into others
      expect(result).toEqual([{ section: 'Others' }, item])
    })

    it('should use custom label strings for sections', () => {
      const mine = make({ id: 'a', createdBy: 'user-123' })
      const pub = make({ id: 'b', createdBy: 'alpha-1' })
      const result = groupDataAssetsByUser({
        ...defaultConfig,
        myLabel: 'My Flows',
        publicLabel: 'Public Flows',
        items: [mine, pub],
      })
      const sections = result
        .filter(isSection)
        .map((s) => (s as DataAssetGroup).section)
      expect(sections).toEqual(['My Flows', 'Public Flows'])
    })

    it('should handle a large number of items efficiently', () => {
      const items = Array.from({ length: 200 }, (_, i) =>
        make({ id: String(i), createdBy: i % 2 === 0 ? 'user-123' : 'alpha-1' })
      )
      const result = groupDataAssetsByUser({ ...defaultConfig, items })
      const nonSections = result.filter((r) => !isSection(r))
      expect(nonSections).toHaveLength(200)
    })
  })
})
