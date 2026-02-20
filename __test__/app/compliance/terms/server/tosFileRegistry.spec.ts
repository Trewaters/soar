import fs from 'fs'

import {
  getAvailableTosFiles,
  isValidTosFile,
  resolveTosFileName,
  readTosMarkdown,
} from '@app/compliance/terms/server/tosFileRegistry'

describe('tosFileRegistry', () => {
  beforeEach(() => {
    jest.restoreAllMocks()
  })

  it('returns sorted markdown options only', () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(true)
    jest.spyOn(fs, 'readdirSync').mockReturnValue([
      { name: 'z-file.md', isFile: () => true },
      { name: 'notes.txt', isFile: () => true },
      { name: 'a-file.md', isFile: () => true },
      { name: 'nested', isFile: () => false },
    ] as any)

    const files = getAvailableTosFiles()

    expect(files).toEqual([
      { value: 'a-file.md', label: 'a-file' },
      { value: 'z-file.md', label: 'z-file' },
    ])
  })

  it('validates and resolves allowed file names', () => {
    jest.spyOn(fs, 'existsSync').mockReturnValue(true)

    expect(isValidTosFile('policy-v1.md')).toBe(true)
    expect(
      resolveTosFileName('app/compliance/terms/content/policy-v1.md')
    ).toBe('policy-v1.md')
    expect(isValidTosFile('../secret.md')).toBe(false)
    expect(resolveTosFileName('not-a-markdown.txt')).toBeNull()
  })

  it('reads requested markdown and falls back to default file', () => {
    jest.spyOn(fs, 'existsSync').mockImplementation((inputPath: any) => {
      if (String(inputPath).includes('custom.md')) return true
      if (String(inputPath).includes('missing.md')) return false
      if (String(inputPath).includes('default-2024-06-01.md')) return true
      return false
    })

    jest.spyOn(fs, 'readFileSync').mockImplementation((inputPath: any) => {
      if (String(inputPath).includes('custom.md')) return '# requested markdown'
      if (String(inputPath).includes('default-2024-06-01.md')) {
        return '# default markdown'
      }
      return '# unexpected'
    })

    const requested = readTosMarkdown('custom.md')
    const fallback = readTosMarkdown('missing.md')

    expect(requested).toBe('# requested markdown')
    expect(fallback).toBe('# default markdown')
  })
})
