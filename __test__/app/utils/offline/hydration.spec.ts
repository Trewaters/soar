import hydrateApp from '@app/utils/offline/hydration'
import db from '@app/utils/offline/db'

jest.mock('@app/utils/offline/db')

describe('hydrateApp', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('returns hydrated pieces when db has data', async () => {
    ;(db.getKV as jest.Mock).mockImplementation(async (k: string) => {
      if (k === 'soar:userState') return { uid: 'u1' }
      if (k === 'soar:flowSeries') return { series: [1, 2] }
      return null
    })

    const res = await hydrateApp()
    expect(res.userState).toEqual({ uid: 'u1' })
    expect(res.flowSeries).toEqual({ series: [1, 2] })
  })

  it('falls back gracefully when db throws', async () => {
    ;(db.getKV as jest.Mock).mockImplementation(async () => {
      throw new Error('db fail')
    })
    ;(db.getKV as jest.Mock).mockImplementationOnce(async () => ({
      userState: { uid: 'u2' },
    }))

    const res = await hydrateApp()
    // best-effort; should not throw
    expect(res).toBeDefined()
  })
})
