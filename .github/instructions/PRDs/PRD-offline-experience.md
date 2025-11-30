# PRD: Offline Practice & Performance Experience

## Overview

Enable a robust offline experience for the Soar yoga application so practitioners can browse poses, review saved sequences, edit series, and run a guided practice without an active network connection. Improve perceived performance by caching critical assets, hydrating state locally, and queuing edits for later sync.

## Problem Statement

Currently the app relies on live network calls for yoga data, images, and user edits. Practitioners may lose connectivity (studio, outdoors, travel) and face blank states, failed edits, or slow timeouts. This reduces trust and practice continuity. The feature ensures uninterrupted yoga usage and faster startup by leveraging local caches and offline-first patterns.

## Target Users

- Authenticated yoga practitioners wanting continuity during poor/absent Wi‑Fi.
- Users practicing outdoors or in studios with limited internet.
- Mobile users on metered or unstable connections.

## Scope

### In-Scope

- Offline detection and UI feedback (banner / indicator).
- Caching core static yoga assets (pose JSON, sequence metadata, thumbnails).
- App shell caching (navigation, theme, baseline providers).
- Local hydration of contexts (AsanaPosture, FlowSeries, UserState) from persisted storage.
- Offline viewing of saved sequences and pose details.
- Offline editing of series/sequences with queued sync.
- Action queue & retry strategy for pending edits.
- Image optimization & caching (WebP/AVIF conversion strategy description).
- Fast-fail network guard utilities (`isOffline()`, timeout wrapper).
- Fallback rendering for first-load offline (minimal informative screen).
- Basic conflict resolution (last-write-wins w/ timestamp + client id).
- Documentation & unit tests for offline utilities and queue logic.

### Out-of-Scope

- Real-time collaborative editing.
- Push notifications or advanced Background Sync API beyond simple retry loop.
- Full offline authentication (session must have been established previously).
- Wearable device integration.
- Advanced merge conflict UI for simultaneous multi-device edits.

## Functional Requirements

### Core Functionality

1. Detect offline status via `navigator.onLine` and `online/offline` events; expose hook/context.
2. Cache static assets (pose JSON, minimal sequences list, core images) via service worker.
3. Provide an app shell that loads instantly offline (providers + navigator + last viewed practice entry point).
4. Hydrate yoga contexts from IndexedDB/localStorage before any network requests.
5. Permit editing series/sequences offline; store edits in local queue for later sync.
6. On reconnect, batch flush queued edits with conflict detection and update remote state.
7. Show clear UI badges/status for queued changes and sync results.
8. Implement image optimization strategy (convert & serve WebP/AVIF where supported; fallback PNG/JPEG).
9. Provide minimal offline landing for first-ever offline visit (logo + instruction + retry button).
10. Implement fast network timeout (abort after configurable threshold, default 3s) with cached fallback.

### User Interface Requirements

- Offline indicator: subtle badge in navigator + optional MUI `Alert` on first detection.
- Queued edits indicator near series/sequences (icon + tooltip: "Sync pending").
- Practice view accessible offline with cached steps, pose images, and metadata.
- Disabled states replaced by informative offline-enabled states (not greyed out where functionality possible).
- Responsive and mobile-first; no layout shifts when offline.
- Accessibility: ARIA labels for status indicators (e.g., `aria-live` region for connectivity changes).

### Integration Requirements

- Authentication: relies on existing session; if no session cached, show limited offline screen.
- Prisma/MongoDB: abstract remote calls through a wrapper that consults offline guard & local cache.
- Context Providers: add hydration layer reading persisted state before network.
- API Endpoints: unchanged signatures; introduce a sync endpoint receiving batch of queued edits.
- Service Worker: custom registration in `app/layout.tsx` or a dedicated client component.

## User Stories

### Primary User Stories

**As a** practitioner traveling without Wi‑Fi
**I want** to open the app and access my saved sequences and poses
**So that** I can continue my practice seamlessly.

Acceptance Criteria:

- [ ] Opening app offline shows cached sequences list within 1 second.
- [ ] Pose detail renders cached image & metadata offline.
- [ ] Offline indicator displays clearly.

**As a** practitioner editing a sequence offline
**I want** my changes saved locally and synced later
**So that** I don’t lose progress.

Acceptance Criteria:

- [ ] Editing sequence offline stores changes in local queue.
- [ ] UI displays queued state.
- [ ] Changes sync automatically on reconnect.

**As a** mobile user on spotty network
**I want** fast loading and fallback data
**So that** I avoid long spinners and timeouts.

Acceptance Criteria:

- [ ] App shell renders consistently under 1 second after first visit.
- [ ] Network calls time out gracefully and fallback to cached data.
- [ ] No blank screens; user always sees meaningful content or explanation.

### Secondary User Stories

- First-time offline user sees guidance to connect for authentication.
- Practitioner sees timestamp of last successful sync.

## Technical Requirements

### Frontend Requirements

- Add service worker registration logic and minimal caching strategy.
- Implement offline status hook (`useOfflineStatus`).
- IndexedDB layer for rich objects (sequences, series); localStorage for lightweight keys.
- Modify context providers to attempt hydration before fetch.
- Add queue manager (in-memory + persistent) for offline edits and event-based flush.
- Add image format preference detection & fallback loading.

### Backend Requirements

- Create batch sync API route: accepts array of edit operations (create/update/delete) with metadata.
- Implement conflict resolution (server trusts latest timestamp if no version mismatch).
- Return consolidated results and updated timestamps.

### Data Requirements

- Local schema for cached sequences: `{ id, title, poses[], updatedAt }`.
- Queue item: `{ uuid, type, entity, payload, createdAt, lastTriedAt, status }`.
- Versioning: include `updatedAt` for conflict detection.
- Migrations: none required initially (uses existing models); may add server-side version field later.

## Success Criteria

### User Experience Metrics

- App shell TTI offline < 1s after initial cache warm.
- 95% of pose detail views load offline without error once cached.
- Sequence edit success after reconnect > 99% (low failure retry).
- Clear offline status comprehension (survey or heuristic: badge clicks < 5% confusion rate).

### Technical Metrics

- Cache hit ratio for pose JSON > 90% after second session.
- Sync queue flush success rate > 98% on first retry.
- Bundle size reduction for initial online load (goal: -15% images payload via WebP).
- Test coverage ≥ 85% for offline utilities and queue logic.

## Dependencies

### Internal Dependencies

- Existing context providers (SessionProvider, UserStateProvider, FlowSeriesProvider, AsanaPostureProvider).
- `FEATURES.ts` for potential flagging (`OFFLINE_MODE` optional).
- Existing sequence editing components (`SeriesEditorForm.tsx`).

### External Dependencies

- Service worker build integration (e.g., `next-pwa` or custom SW script).
- IndexedDB (via lightweight wrapper such as `idb` library).

## Risks and Considerations

### Technical Risks

- Initial complexity of service worker caching & invalidation.
- Potential stale data conflicts if user edits on multiple devices offline.
- Increased storage usage (need quota management & purge strategy).

### User Experience Risks

- Confusion if offline edits silently fail upon reconnect.
- Overly intrusive offline banners distracting practice flow.

## Implementation Notes

### File Structure Impact

- `app/offline/` (optional) for offline landing & helper components.
- `app/utils/offline/` for hooks (`useOfflineStatus.ts`), queue manager (`editQueue.ts`), cache utilities.
- `public/sw.js` or `app/sw.ts` depending on SW approach.
- New API route: `app/api/sync/route.ts`.
- Tests in `__test__/app/utils/offline/` and `__test__/app/api/sync.spec.ts`.

### Testing Strategy

- Unit tests: queue operations, offline hook, conflict resolution logic.
- Integration tests: editing sequence offline -> queued -> flush on mock reconnect.
- Service worker simulation: mock fetch events & cache matching.
- Accessibility tests: offline indicators and ARIA live regions.

## Future Considerations

- Advanced background sync and push notifications for reminders.
- Diff-based merge conflict UI.
- Offline-first onboarding with guest practice mode.
- Pose video caching & streaming optimizations.

## Quality Checklist

- [ ] Offline detection hook implemented & tested.
- [ ] Service worker caches core assets & JSON.
- [ ] Context hydration reads local stores before network.
- [ ] Queue manager persists edits and flushes on reconnect.
- [ ] Batch sync API route implemented with conflict resolution.
- [ ] Optimized images converted & referenced.
- [ ] Minimal offline landing for first-time offline visit.
- [ ] All new code covered by ≥85% tests.
- [ ] Accessibility (ARIA live region + indicators) verified.
- [ ] Documentation of offline data lifecycle & purge strategy.
