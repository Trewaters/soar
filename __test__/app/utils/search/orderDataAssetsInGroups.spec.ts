import { orderDataAssetsInGroups } from '@app/utils/search/orderDataAssetsInGroups'
import { DataAssetGroup, GroupedDataAssets } from '@app/types/search'

interface TestItem {
  id: string
  name: string
}

const section = (label: string): DataAssetGroup => ({ section: label })

const item = (id: string, name: string): TestItem => ({ id, name })

const getLabel = (i: TestItem) => i.name

describe('orderDataAssetsInGroups', () => {
  describe('Alphabetical sorting within sections', () => {
    it('should return an empty array when input is empty', () => {
      const result = orderDataAssetsInGroups<TestItem>([], getLabel)
      expect(result).toEqual([])
    })

    it('should sort items alphabetically within a single section', () => {
      const input: GroupedDataAssets<TestItem> = [
        section('My Items'),
        item('3', 'Zebra'),
        item('1', 'Apple'),
        item('2', 'Mango'),
      ]
      const result = orderDataAssetsInGroups(input, getLabel)
      const names = result
        .filter((r) => !('section' in r))
        .map((r) => (r as TestItem).name)
      expect(names).toEqual(['Apple', 'Mango', 'Zebra'])
    })

    it('should sort items independently in each section', () => {
      const input: GroupedDataAssets<TestItem> = [
        section('My Items'),
        item('a', 'Zebra'),
        item('b', 'Apple'),
        section('Public Items'),
        item('c', 'Orange'),
        item('d', 'Banana'),
      ]
      const result = orderDataAssetsInGroups(input, getLabel)
      const myItems = result.slice(1, 3).map((r) => (r as TestItem).name)
      const pubItems = result.slice(4, 6).map((r) => (r as TestItem).name)
      expect(myItems).toEqual(['Apple', 'Zebra'])
      expect(pubItems).toEqual(['Banana', 'Orange'])
    })

    it('should preserve section header markers in the output', () => {
      const input: GroupedDataAssets<TestItem> = [
        section('My Items'),
        item('a', 'Beta'),
        item('b', 'Alpha'),
        section('Public Items'),
        item('c', 'Delta'),
      ]
      const result = orderDataAssetsInGroups(input, getLabel)
      expect(result[0]).toEqual({ section: 'My Items' })
      expect(result[3]).toEqual({ section: 'Public Items' })
    })

    it('should handle a section with a single item without error', () => {
      const input: GroupedDataAssets<TestItem> = [
        section('My Items'),
        item('a', 'Warrior I'),
      ]
      const result = orderDataAssetsInGroups(input, getLabel)
      expect(result).toEqual([{ section: 'My Items' }, item('a', 'Warrior I')])
    })

    it('should handle multiple sections each with one item', () => {
      const input: GroupedDataAssets<TestItem> = [
        section('Section A'),
        item('a', 'Cobra'),
        section('Section B'),
        item('b', 'Tree'),
      ]
      const result = orderDataAssetsInGroups(input, getLabel)
      expect(result).toEqual([
        { section: 'Section A' },
        item('a', 'Cobra'),
        { section: 'Section B' },
        item('b', 'Tree'),
      ])
    })
  })

  describe('Locale-aware comparison', () => {
    it('should sort case-insensitively (sensitivity: base)', () => {
      const input: GroupedDataAssets<TestItem> = [
        section('My Items'),
        item('a', 'zebra'),
        item('b', 'Apple'),
        item('c', 'mango'),
      ]
      const result = orderDataAssetsInGroups(input, getLabel)
      const names = result.slice(1).map((r) => (r as TestItem).name)
      expect(names).toEqual(['Apple', 'mango', 'zebra'])
    })

    it('should sort Sanskrit/accented names using locale compare', () => {
      const input: GroupedDataAssets<TestItem> = [
        section('Poses'),
        item('a', 'Virabhadrasana'),
        item('b', 'Adho Mukha'),
        item('c', 'Bhujangasana'),
      ]
      const result = orderDataAssetsInGroups(input, getLabel)
      const names = result.slice(1).map((r) => (r as TestItem).name)
      expect(names).toEqual(['Adho Mukha', 'Bhujangasana', 'Virabhadrasana'])
    })
  })

  describe('Edge cases', () => {
    it('should handle items outside any section (no preceding header)', () => {
      const input: GroupedDataAssets<TestItem> = [item('a', 'Orphan')]
      const result = orderDataAssetsInGroups(input, getLabel)
      expect(result).toEqual([item('a', 'Orphan')])
    })

    it('should not mutate the original input array', () => {
      const originalItems = [item('a', 'Zebra'), item('b', 'Apple')]
      const input: GroupedDataAssets<TestItem> = [
        section('Section'),
        ...originalItems,
      ]
      orderDataAssetsInGroups(input, getLabel)
      expect((input[1] as TestItem).name).toBe('Zebra')
      expect((input[2] as TestItem).name).toBe('Apple')
    })

    it('should handle consecutive section headers with no items between them', () => {
      const input: GroupedDataAssets<TestItem> = [
        section('Empty Section'),
        section('Non-Empty Section'),
        item('a', 'Warrior II'),
      ]
      const result = orderDataAssetsInGroups(input, getLabel)
      expect(result[0]).toEqual({ section: 'Empty Section' })
      expect(result[1]).toEqual({ section: 'Non-Empty Section' })
      expect(result[2]).toEqual(item('a', 'Warrior II'))
    })

    it('should handle three sections all correctly sorted', () => {
      const input: GroupedDataAssets<TestItem> = [
        section('Mine'),
        item('a', 'Zebra Pose'),
        item('b', 'Angel Pose'),
        section('Public'),
        item('c', 'Mountain'),
        item('d', 'Bridge'),
        section('Others'),
        item('e', 'Triangle'),
        item('f', 'Chair'),
      ]
      const result = orderDataAssetsInGroups(input, getLabel)
      const mineItems = result.slice(1, 3).map((r) => (r as TestItem).name)
      const pubItems = result.slice(4, 6).map((r) => (r as TestItem).name)
      const otherItems = result.slice(7, 9).map((r) => (r as TestItem).name)
      expect(mineItems).toEqual(['Angel Pose', 'Zebra Pose'])
      expect(pubItems).toEqual(['Bridge', 'Mountain'])
      expect(otherItems).toEqual(['Chair', 'Triangle'])
    })
  })
})
