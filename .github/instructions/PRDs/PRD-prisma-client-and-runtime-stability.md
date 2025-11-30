# PRD: Prisma Client Consolidation and Runtime Stability Fixes

## Overview

This PRD describes a set of developer-facing reliability and performance improvements across the Soar codebase. The goal is to reduce DB connection churn and connection leaks caused by many module-scoped `new PrismaClient()` instances, and to harden client-side components against infinite re-renders, event-listener leaks, stale closures, and expensive deep comparisons.

This is primarily an engineering quality/operational improvement that reduces runtime errors, improves developer experience during HMR, and improves production stability.

## Problem Statement

- Multiple server files instantiate `new PrismaClient()` at module scope. This creates multiple DB connections during development HMR and serverless cold starts and risks hitting DB connection limits.
- Some routes call `prisma.$disconnect()` in finally blocks while others do not; mixing per-request disconnects and module-scoped clients can disconnect a shared client and cause hard-to-trace failures.
- Client components use expensive `JSON.stringify` deep comparisons to detect changes which can cause CPU jank and accidental effect loops.
- Global event listeners on `window`/`document` are added with non-memoized handlers, risking listener leaks and stale closures.
- Some provider components import DOM-only APIs unnecessarily (e.g., `ReactDOM` in `Providers.tsx`), increasing bundle size and risking SSR mismatch.
- Debugging/logging and error objects are sometimes passed directly to responses or logs in ways that can include non-serializable structures.

## Target Users

- Developers and maintainers of the Soar app (primary).
- Production reliability engineers and QA teams validating runtime behavior.
- End users benefit indirectly via fewer runtime errors and more stable UX.

## Scope

### In-Scope

- Add a single shared/cached Prisma client helper for server-side code (cache on globalThis in dev). Replace module-scoped `new PrismaClient()` uses in server routes and libraries with the shared helper.
- Remove per-request `prisma.$disconnect()` calls from handlers that use the shared client; ensure scripts or CLI tasks that create their own client still disconnect appropriately.
- Replace expensive deep equality checks that rely on `JSON.stringify` with lightweight ID/version checks or small derived fingerprints where possible.
- Memoize global event handlers (useCallback) and ensure correct cleanup removes exact references.
- Remove unnecessary `ReactDOM` import from `Providers.tsx` and trim top-level DOM imports in provider components.
- Audit logging and API responses to ensure only serializable objects are returned to the client and logged safely (use plain DTOs when needed).
- Add contributing docs / README for the shared Prisma client pattern.

### Out-of-Scope

- Major refactors of domain logic or UI redesigns.
- Changing data models or Prisma schema; this is a runtime wiring and stability cleanup only.

## Functional Requirements

1. Consolidate Prisma client usage

   - Provide `app/lib/prismaClient.ts` (for App Router server files) and `lib/prismaClient.ts` (for other server-side code) which export a cached `prisma` instance.
   - The helper must cache the client on `globalThis` in non-production to prevent duplicate clients during HMR.
   - All server routes, services, and libs must import the shared `prisma` instead of creating their own at module scope.
   - Scripts and one-off CLIs may continue to create a local `PrismaClient()` and must call `$disconnect()` when done.

2. Remove per-request disconnects for shared client

   - Remove `await prisma.$disconnect()` from API route `finally` blocks for files importing shared `prisma`.
   - Ensure no route will prematurely close the shared client used by the running server process.

3. Replace deep comparisons

   - Replace `JSON.stringify(obj)` comparisons in effects with stable checks (IDs, counts, version stamps) or a small hash/fingerprint updated server-side if required.
   - Add comments where strict structural equality is required and document why the chosen check is sufficient.

4. Stabilize event handlers

   - `useCallback` memoization for handlers added to `window`/`document` and use refs for mutable state referenced inside handlers.
   - Ensure cleanup in each `useEffect` removes the exact handler reference.

5. Provider code hygiene

   - Remove unnecessary `ReactDOM` import from `app/providers/Providers.tsx`.
   - Keep provider composition minimal and avoid DOM-only imports in App Router providers.

6. Logging and serialization
   - When sending errors/diagnostics to clients or logs, use plain error DTOs containing only serializable fields (message, code, stack (optionally), short db diagnostics) rather than raw Error or DB objects.

## User Stories

### Primary User Story

**As a** developer,
**I want** a single shared Prisma client and stable client-side effects,
**So that** I avoid DB connection limits, HMR-induced duplicate clients, infinite re-renders, and event-listener leaks.

Acceptance Criteria:

- [ ] `app/lib/prismaClient.ts` and `lib/prismaClient.ts` exist and export a cached `prisma` client.
- [ ] No server route instantiates `new PrismaClient()` at module scope (except scripts/tests explicitly documented).
- [ ] No API route that imports shared `prisma` calls `prisma.$disconnect()` in handler finally blocks.
- [ ] Effects using deep comparisons replaced with ID/version checks in the listed pages (`page.tsx` files referenced in the code review).
- [ ] Event handlers added to `window`/`document` are memoized and cleaned up correctly.
- [ ] `Providers.tsx` no longer imports `ReactDOM`.

### Secondary User Stories

- As a QA engineer, I want test coverage and regression tests that ensure the dashboard and streak APIs keep returning correct values after refactor.
- As a developer, I want a short README documenting the Prisma caching pattern so future contributions follow it.

## Technical Requirements

### Frontend Requirements

- Update React components that currently rely on deep stringify compares:
  - `app/sequences/page.tsx` and related `page.tsx` files identified in the code review.
  - Replace comparisons with ID/length/version checks.
- Wrap global handlers in `useCallback` and use refs for any mutable values accessed by handlers.
- Replace `alert()` in production code paths with an error UI pattern (toast/snackbar) and ensure state updates inside error handling are idempotent.

### Backend Requirements

- Create `app/lib/prismaClient.ts` and `lib/prismaClient.ts` which export `prisma` and cache on `globalThis` in non-production.
- Replace module-scoped `new PrismaClient()` in server routes, libs, and services with `import { prisma } from '.../lib/prismaClient'`.
- Remove `prisma.$disconnect()` from any handler using the shared client. Keep `$disconnect()` only in scripts or processes that create their own client.
- Ensure any route that previously had a custom per-file factory like `getPrismaClient()` is updated to import shared helper; if the factory had special logging options, migrate those options to a single place or keep them in scripts only.

## Data Requirements

- No schema changes are required.
- Tests that create/destroy test data must continue to create their own test-scoped `PrismaClient()` and disconnect explicitly.

## Success Criteria

### User/UX Metrics

- Dashboard and streak API responses remain correct (validated by existing tests and manual smoke tests). No regression in dashboard counts or streak calculations.

### Technical Metrics

- All server routes use shared Prisma client (verified by repo scan). PR introduces no new module-scoped `new PrismaClient()` calls in `app/` server code.
- Full test suite passes after refactor.
- No runtime errors in logs referencing closed Prisma clients when running the dev server.

## Dependencies

### Internal Dependencies

- Existing Prisma client generation (prisma generated client at `prisma/generated/client`).
- Dashboard service functions in `app/lib/dashboardService.ts` and related services.

### External Dependencies

- None new; this uses existing Prisma and Next.js runtime.

## Risks and Considerations

### Technical Risks

- If some tests or scripts still assume per-file `PrismaClient` instances, they must be updated to either import the shared helper or explicitly create their own clients and disconnect.
- If any route intentionally relies on `$disconnect()` side-effects, removing it could change behavior; such cases should be audited and documented.

### User Experience Risks

- Replacing `alert()` may require new UI patterns (toast/snackbar) and minor design work; use a small, localized error component if a global pattern isn't available.

## Implementation Notes

### Files likely to change (non-exhaustive)

- `app/lib/prismaClient.ts` (new)
- `lib/prismaClient.ts` (new)
- `app/lib/dashboardService.ts` (import shared prisma)
- Many API routes under `app/api/*/route.ts` (replace `new PrismaClient()` and remove `$disconnect()`): examples from the code review:
  - `app/api/dashboard/stats/route.ts`
  - `app/api/user/recordActivity/route.ts`
  - `app/api/user/loginStreak/route.ts`
  - `app/api/poses/*`, `app/api/series/*`, `app/api/images/*`, `app/api/sequences/*`, `app/api/reminders/route.ts`, etc.
- Client pages with deep comparisons and global handlers:
  - `app/sequences/page.tsx` and variants referenced in the review
  - Other `page.tsx` files flagged in the analysis
- `app/providers/Providers.tsx` (remove `ReactDOM` import)

### Minimal code contract (server)

- Inputs: server request (query/body), session when required
- Outputs: JSON response (POJO) with status codes
- Error modes: DB connectivity errors, validation errors

### Edge cases to test

- Missing or malformed userId/email query params
- DB unavailable (simulate DATABASE_URL missing)
- Components that previously used stringify compare still receive identical structural changes
- Long-running HMR sessions in dev do not spawn duplicate Prisma clients

## Testing Strategy

1. Unit & Route tests

   - Update existing Jest tests that create `new PrismaClient()` to continue creating their own client and disconnect; or, mock `prisma` import to a test double.
   - Run `__test__/app/api/dashboard/stats/route.spec.ts` and other API unit tests to ensure behavior unchanged.

2. Integration / Smoke

   - Start dev server and exercise key endpoints: `/api/user/recordActivity`, `/api/user/loginStreak`, `/api/dashboard/stats`, sequences and series endpoints.
   - Validate no DB disconnect errors appear in logs after repeated requests and HMR cycles.

3. Frontend tests
   - Add (or update) small RTL tests to ensure effects do not re-run unnecessarily (spy on fetch calls and ensure they are called the expected number of times).

## Implementation Plan & Tasks (high level)

1. Create `app/lib/prismaClient.ts` and `lib/prismaClient.ts` implementing global caching in dev.
2. Repo scan: find all `new PrismaClient()` occurrences and classify which should be replaced vs kept (scripts/tests).
3. Replace instantiations in server routes/libraries with `import { prisma }` and remove `$disconnect()` from routes using it.
4. Update affected tests/scripts: either import shared `prisma` (if appropriate) or keep local `PrismaClient()` and ensure proper disconnect.
5. Replace deep JSON comparisons in key client pages with ID/version checks; memoize handlers and fix stale closures.
6. Run full test suite and lint; iterate on failures.
7. Add PR description and short README to `lib/prismaClient.ts` documenting usage.

## Future Considerations

- Consider using a lightweight fingerprint/hash returned by some collection queries to detect structural changes server-side instead of client-side deep compares.
- Add a dev-only health endpoint that returns the number of active Prisma clients (or a diagnostic flag) to help during debugging.

## Success checklist

- [ ] Shared Prisma client added and imported by server routes
- [ ] No remaining unintentional `new PrismaClient()` in `app/` server code
- [ ] No `prisma.$disconnect()` left in handlers using shared client
- [ ] Deep-compare usages replaced or documented where unavoidable
- [ ] Global event handlers memoized and cleaned up properly
- [ ] Tests passing and dev server stable under HMR

---

Generated from code review and analysis provided by the engineering assistant. If you want, I can (a) open a branch and implement the remaining repo-wide replacements, (b) run the full test suite and fix regressions, or (c) create the documentation file in `lib/` next — tell me which next step to take.
