import fs from 'fs'
import path from 'path'

describe('delete API route', () => {
  it('route file exists', () => {
    const routePath = path.resolve(
      process.cwd(),
      'app/api/profileImage/delete/route.ts'
    )
    expect(fs.existsSync(routePath)).toBe(true)
  })
})
