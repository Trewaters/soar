import fs from 'fs'
import path from 'path'

describe('setActive API route', () => {
  it('route file exists', () => {
    // Resolve from project root to avoid fragile relative paths
    const routePath = path.resolve(
      process.cwd(),
      'app/api/profileImage/setActive/route.ts'
    )
    expect(fs.existsSync(routePath)).toBe(true)
  })
})
