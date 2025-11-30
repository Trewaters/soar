# Engineering Task Breakdown

### 1. Service Worker & Caching

- Decide SW approach: `next-pwa` vs custom SW. Document choice in `README_offline.md`.
- If `next-pwa`:
  - Update `next.config.js` to enable `next-pwa` with runtimeCaching for:
    - `/_next/static/*` (cache-first)
    - `/public/**` (images, icons) (stale-while-revalidate)
    - `/app/data/**` or JSON endpoints used for poses (cache-first/stale-if-error)
  - Add registration via a small client component `app/clientComponents/ServiceWorkerRegister.tsx` and include it in `app/layout.tsx`.
- If custom SW:
  - Create `public/sw.js` with install/activate/fetch handlers and a named cache (e.g., `soar-v1`).
  - Precache app shell files and pose JSON; implement cache-first for same-origin static assets.
- Add a small health check page `/offline` to verify SW works when offline.

### 2. Offline Status Hook & Indicator

- Create `app/utils/offline/useOfflineStatus.ts` to expose `{ online, since, lastChange }` using `online/offline` events and initial `navigator.onLine`.
- Add a subtle indicator component `app/clientComponents/OfflineBadge.tsx` using MUI; include in the navigator layout.
- Accessibility: include an `aria-live="polite"` region announcing status changes.
- Tests: `__test__/app/utils/offline/useOfflineStatus.spec.ts` and `__test__/app/clientComponents/OfflineBadge.spec.tsx`.

### 3. Local Persistence (IndexedDB + localStorage) & Context Hydration

- Add `idb` dependency and wrapper `app/utils/offline/db.ts` with object stores: `sequences`, `series`, `queue`, `meta`.
- Implement cache helpers `app/utils/offline/cache.ts` to get/set/remove items and purge by quota.
- Hydration functions `app/utils/offline/hydration.ts` to load last-known state for:
  - `AsanaPostureProvider`, `FlowSeriesProvider`, `UserStateProvider` (read from IndexedDB/localStorage before network).
- Wire hydration into providers in `app/context/*` (ensure provider order preserved per Providers.tsx pattern).
- Tests: `__test__/app/utils/offline/db.spec.ts`, `__test__/app/utils/offline/hydration.spec.ts`.

### 4. Offline Edit Queue & Sync API

- Create queue manager `app/utils/offline/editQueue.ts` with item shape `{ uuid, type, entity, payload, createdAt, lastTriedAt, status }`.
- Enqueue edits from `app/navigator/flows/editSeries/SeriesEditorForm.tsx` when offline or when network times out.
- Add UI affordance (small chip/icon) showing "Sync pending" for edited entities.
- Create new API route `app/api/sync/route.ts` that accepts batch operations; implement basic last-write-wins using `updatedAt` timestamp.
- Add reconnect handler (listen to `online` event) to flush queue with exponential backoff.
- Tests: queue operations, enqueue-from-form, and sync API `__test__/app/api/sync.spec.ts`.

### 5. Networking Guards & Timeouts

- Implement `app/utils/offline/network.ts` with:
  - `isOffline()` guard
  - `fetchWithTimeout(input, init, { timeoutMs: 3000 })`
  - `withOfflineFallback<T>(fetcher, fallback)` utility
- Replace direct `fetch` calls in client-side data loaders to use these helpers (target modules in `app/*` using network at runtime).
- Show cached content on timeout with a small toast/banner instead of spinner.
- Tests: `__test__/app/utils/offline/network.spec.ts`.

### 6. App Shell & First-Load Offline Fallback

- Create minimal offline landing `app/offline/page.tsx` with logo, helpful message, and retry button.
- Ensure app shell (layout + providers + navigator) precached by SW; validate it renders offline within ~1s after warm cache.
- Add `OfflineBoundary` component to wrap key views and render cached content or offline page.
- Tests: `__test__/app/offline/page.spec.tsx` and boundary behavior tests.

### 7. Image Optimization & Caching Strategy

- Convert largest pose images to WebP/AVIF and keep original as fallback; update references to use Next `<Image>` with `formats={["image/avif","image/webp"]}`.
- Ensure width/height attributes and appropriate `priority` only for first-view images.
- Add runtime caching for pose thumbnails in SW config.
- Create a one-off script or docs in `scripts/` to batch-convert images.
- Tests: visual/unit checks for source selection (where feasible) and perf budget validated via Lighthouse.

### 8. UI/UX for Queued Changes & Status

- Add a small badge/tooltip to edited sequences and series indicating pending sync.
- Add a sync status area (e.g., in settings or profile) showing last sync time and number of queued items.
- Replace disabled controls with informative offline-enabled states where possible.
- Accessibility tests for indicators (`aria-label`, keyboard focus).

### 9. Provider & Data Layer Integration

- Review and update data access paths to ensure reads first consult local cache, then background-refresh when online.
- Add feature flag in `app/FEATURES.ts` (e.g., `OFFLINE_MODE`) to allow staged rollout.
- Ensure no provider introduces a blocking await on network during initial render.
- Tests for provider startup behavior with and without network.

### 10. Error Handling & Purge Strategy

- Implement cache purge policy in `cache.ts` (LRU or size-based) and expose a user-triggered "Clear offline data" action.
- Ensure guarded error boundaries for cache read/write failures.
- Tests: purge operations and error boundary rendering.

### 11. Testing & QA

- Unit tests for:
  - `useOfflineStatus`, `network.ts`, `editQueue.ts`, `hydration.ts`, `cache.ts`.
- Integration tests:
  - Edit offline → queued → reconnect → flushed → UI reflects synced state.
  - App shell startup offline with cached sequences list in <1s (mock timers where needed).
- Mocks per Soar patterns: NextAuth, yoga contexts, Prisma client.
- Lighthouse PWA audit to verify offline availability and service worker registration.

### 12. Documentation

- Create `docs/offline.md` describing architecture, data lifecycle, and troubleshooting.
- Update `README.md` with an "Offline Mode" section and quick start.
- Document image optimization workflow and scripts.

---

## Implementation Order (Recommended)

1. Service worker + registration + minimal caching
2. `useOfflineStatus` + OfflineBadge and basic UX
3. IndexedDB wrapper + hydration into providers
4. Edit queue manager + enqueue from `SeriesEditorForm.tsx`
5. Sync API route + reconnect flush
6. Network guards + timeouts + fallbacks
7. App shell + first-load offline fallback
8. Image optimization + SW image caching
9. UX polish for queued/sync states + accessibility
10. Purge strategy + settings toggle/clear action
11. Tests + Lighthouse PWA audit
12. Documentation

## File/Path Hints

- `app/clientComponents/ServiceWorkerRegister.tsx`
- `app/clientComponents/OfflineBadge.tsx`
- `app/offline/page.tsx`
- `app/utils/offline/useOfflineStatus.ts`
- `app/utils/offline/db.ts`, `cache.ts`, `hydration.ts`, `network.ts`, `editQueue.ts`
- `app/api/sync/route.ts`
- `app/navigator/flows/editSeries/SeriesEditorForm.tsx` (enqueue + UI badge)
- `next.config.js` (next-pwa configuration)
- `public/sw.js` (if custom SW)
- `docs/offline.md`
- `scripts/` (optional image conversion helpers)
