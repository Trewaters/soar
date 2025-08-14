#!/usr/bin/env ts-node
/**
 * Audit script: checks a JSON array file for missing canonicalAsanaId fields across items.
 * Usage: ts-node scripts/audit-canonical-id.ts path/to/data.json [idKey]
 * - Expects the file to contain an array of objects.
 * - Logs a summary and lists up to the first 50 missing entries.
 */

import fs from 'fs'

function main() {
  const file = process.argv[2]
  if (!file) {
    console.error(
      'Usage: ts-node scripts/audit-canonical-id.ts <path-to-json> [idKey]'
    )
    process.exit(1)
  }
  const idKey = process.argv[3] || 'id'
  const raw = fs.readFileSync(file, 'utf-8')
  const data = JSON.parse(raw)
  if (!Array.isArray(data)) {
    console.error('Provided JSON must be an array')
    process.exit(1)
  }

  let missing = 0
  const examples: Array<string> = []
  for (const item of data) {
    if (
      !item ||
      item.canonicalAsanaId === undefined ||
      item.canonicalAsanaId === null ||
      item.canonicalAsanaId === ''
    ) {
      missing++
      if (examples.length < 50) {
        examples.push(String(item?.[idKey] ?? 'unknown'))
      }
    }
  }

  console.log(
    `Audited ${data.length} records. Missing canonicalAsanaId: ${missing}.`
  )
  if (examples.length) {
    console.log('Examples (up to 50):', examples.join(', '))
  }
}

main()
