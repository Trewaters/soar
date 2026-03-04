import fs from 'fs'
import path from 'path'

describe('profile library route', () => {
  it('route file exists', () => {
    const routePath = path.resolve(
      process.cwd(),
      'app/api/profile/library/route.ts'
    )
    expect(fs.existsSync(routePath)).toBe(true)
  })
})
