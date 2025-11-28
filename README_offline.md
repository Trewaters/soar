# Offline Mode: Service Worker Strategy

Decision: Implement a custom Service Worker (no `next-pwa` dependency) for Task 1.

Rationale:

- Avoids potential version and build integration issues with Next.js 15.
- Provides immediate offline support (navigation fallback, static asset caching, basic JSON fallback) with minimal risk.
- Leaves room to adopt `next-pwa` later if we want advanced Workbox runtime strategies and pre-caching of hashed assets.

What was added:

- `public/sw.js`: Custom service worker handling install/activate/fetch with:
  - Navigation network-first + fallback to `/offline`
  - Cache-first for same-origin static assets (scripts/styles/images/fonts)
  - Network-first for JSON/data with cache fallback
  - Cache cleanup on activate
- `app/clientComponents/ServiceWorkerRegister.tsx`: Registers `/sw.js` post-hydration.
- `app/layout.tsx`: Injects the registration component globally.
- `app/offline/page.tsx`: Minimal offline fallback page with a retry button.

How to verify locally:

1. Start the app and warm the cache by navigating a couple of pages.
2. Simulate offline in DevTools → Network → Offline.
3. Refresh: you should see the offline page (`/offline`) for navigations.
4. Return online and refresh: pages should load normally.

Next steps (future tasks from the Offline PRD):

- Expand caching strategies and pre-cache the app shell.
- Add offline status indicator and hooks.
- Introduce IndexedDB hydration and edit queue for sync-on-reconnect.
