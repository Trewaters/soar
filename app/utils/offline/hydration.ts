import db from './db'
import cache from './cache'

// Keys we expect to persist/hydrate for the app.
export type HydratedState = {
  userState?: any
  flowSeries?: any
  asanaPose?: any
  meta?: any
}

export async function hydrateApp(): Promise<HydratedState> {
  // Non-blocking best-effort hydration: try to read persisted pieces and
  // return them. The caller (providers) can decide how to apply them.
  const out: HydratedState = {}
  try {
    const [userState, flowSeries, asanaPose, meta] = await Promise.all([
      db.getKV('soar:userState'),
      db.getKV('soar:flowSeries'),
      db.getKV('soar:asanaPose'),
      db.getKV('soar:meta'),
    ])
    if (userState) out.userState = userState
    if (flowSeries) out.flowSeries = flowSeries
    if (asanaPose) out.asanaPose = asanaPose
    if (meta) out.meta = meta
  } catch (err) {
    // hydrated read failed; try cache fallback for some keys
    console.warn('[hydrateApp] primary hydration failed', err)
    try {
      const fallback = await cache.getCache('lastKnownState')
      console.debug('[hydrateApp] fallback cache read', {
        fallback: !!fallback,
      })
      if (fallback) {
        out.userState = out.userState ?? fallback.userState
        out.flowSeries = out.flowSeries ?? fallback.flowSeries
      }
    } catch (e) {
      // swallow - hydration is best-effort
      console.warn('[hydrateApp] fallback failed', e)
    }
  }
  return out
}

export default hydrateApp
