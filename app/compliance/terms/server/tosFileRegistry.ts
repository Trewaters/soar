import fs from 'fs'
import path from 'path'

const TERMS_CONTENT_DIR = path.join(
  process.cwd(),
  'app',
  'compliance',
  'terms',
  'content'
)

const DEFAULT_FILE = 'default-2024-06-01.md'

const FILE_NAME_RE = /^[a-zA-Z0-9._-]+\.md$/

export type TosFileOption = {
  value: string
  label: string
}

function normalizeFileName(value?: string | null): string | null {
  if (!value || typeof value !== 'string') return null

  const trimmed = value.trim()
  if (!trimmed) return null

  const withoutPrefix = trimmed
    .replace(/^\/+/, '')
    .replace(/^app\/compliance\/terms\/content\//, '')

  if (!FILE_NAME_RE.test(withoutPrefix)) return null

  return withoutPrefix
}

function absolutePathFor(fileName: string): string {
  return path.join(TERMS_CONTENT_DIR, fileName)
}

export function getAvailableTosFiles(): TosFileOption[] {
  if (!fs.existsSync(TERMS_CONTENT_DIR)) return []

  const entries = fs.readdirSync(TERMS_CONTENT_DIR, {
    withFileTypes: true,
  })

  return entries
    .filter((entry) => entry.isFile() && FILE_NAME_RE.test(entry.name))
    .map((entry) => ({
      value: entry.name,
      label: entry.name.replace(/\.md$/i, ''),
    }))
    .sort((a, b) => a.value.localeCompare(b.value))
}

export function isValidTosFile(fileName?: string | null): boolean {
  const normalized = normalizeFileName(fileName)
  if (!normalized) return false
  return fs.existsSync(absolutePathFor(normalized))
}

export function resolveTosFileName(fileName?: string | null): string | null {
  const normalized = normalizeFileName(fileName)
  if (!normalized) return null
  return fs.existsSync(absolutePathFor(normalized)) ? normalized : null
}

export function readTosMarkdown(fileName?: string | null): string | null {
  const resolved = resolveTosFileName(fileName)
  if (resolved) {
    return fs.readFileSync(absolutePathFor(resolved), 'utf8')
  }

  if (fs.existsSync(absolutePathFor(DEFAULT_FILE))) {
    return fs.readFileSync(absolutePathFor(DEFAULT_FILE), 'utf8')
  }

  const files = getAvailableTosFiles()
  if (files.length === 0) return null

  return fs.readFileSync(absolutePathFor(files[0].value), 'utf8')
}
