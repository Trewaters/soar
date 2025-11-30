# Engineering Task Breakdown — Prisma Client Consolidation & Runtime Stability

This task list is derived directly from the PRD `PRD-prisma-client-and-runtime-stability.md` and is written to guide a junior engineer through the implementation in clear, ordered steps. Follow the logical order (foundation first, then applications, then validation).

### 1. Epic: Create shared Prisma client helpers [x]

- [x] Create `app/lib/prismaClient.ts` for App Router server files and `lib/prismaClient.ts` for other server-side code. Each should:
  - [x] Export a single `prisma` instance.
  - [x] Cache the instance on `globalThis` when `process.env.NODE_ENV !== 'production'` to avoid duplicate clients during HMR.
  - [x] Include a brief comment/README at the top explaining: "Do not call `prisma.$disconnect()` in API route handlers that import this shared client. Scripts/tests that create their own client must disconnect explicitly."

Deliverables:

- [x] `app/lib/prismaClient.ts` (new file)
- [x] `lib/prismaClient.ts` (new file)

Acceptance checklist:

- [x] Files exist and export `prisma`.
- [x] Unit/compile checks pass.

### 2. Epic: Repo sweep — replace module-scoped `new PrismaClient()` (server-side) [x]

Note: Only replace `new PrismaClient()` in server routes/services that run in the Next.js/Node server environment. Do NOT replace test/CLI scripts that intentionally create per-process clients unless you update them to disconnect.

Tasks:

- [x] Search repo for `new PrismaClient(` occurrences.
- [x] For each occurrence in `app/` server files (e.g., files under `app/api/**/route.ts`, `app/lib/**`, `lib/**`):
  - [x] Replace the `new PrismaClient()` import/instance with `import { prisma } from 'app/lib/prismaClient'` (for App Router files) or `import { prisma } from 'lib/prismaClient'` depending on file location.
  - [x] Remove any local client variable declarations left behind.
- [x] For occurrences in `__test__/`, `scripts/`, or other CLI tools:
  - [x] Decide whether to (A) keep a local `PrismaClient()` and call `$disconnect()` in the script/test teardown, or (B) mock `prisma` to a test double. Update tests accordingly.

Acceptance checklist:

- [x] No server route in `app/` module-scope declares `new PrismaClient()` (grep to verify).

### 3. Epic: Remove inappropriate `prisma.$disconnect()` calls [x]

Tasks:

- [x] Search for `.$disconnect()` usage.
- [x] For any file that imports the shared `prisma`, remove `await prisma.$disconnect()` from `finally` blocks in API handlers. Add a comment referencing the shared client README.
- [x] For scripts and tests that create a local `PrismaClient()`, ensure they call `$disconnect()` in teardown.

Acceptance checklist:

- [x] No `prisma.$disconnect()` calls remain in handlers that import the shared client.

### 4. Epic: Update tests and CI to reflect new pattern [x]

Tasks:

- [x] Identify tests that create a Prisma client at module scope. For each test file:
  - [x] Option A (preferred for unit tests): Mock the `prisma` import using Jest and provide stubs for the methods used by the code under test.
  - [x] Option B (integration tests): Create and use a test-scoped `PrismaClient()` and call `$disconnect()` in `afterAll`/`teardown`.
- [x] Update `jest.setup.ts` or `__mocks__` where appropriate to provide a `prisma` mock.
- [x] Run `npm run test` and fix failing tests introduced by the refactor.

Acceptance checklist:

- [x] Unit tests pass locally.
- [x] Integration tests that intentionally hit DB continue to manage lifecycle explicitly.

### 5. Epic: Replace deep `JSON.stringify` comparisons in client pages [x]

Tasks:

- [x] Identify client files using `JSON.stringify` or similarly expensive deep comparisons in `useEffect` or dependency arrays. The PRD mentioned:
  - [x] `app/sequences/page.tsx` and other `page.tsx` files identified in the code review.
- [x] Replace deep comparisons with one of these strategies (choose the least invasive):
  - [x] Compare stable IDs (e.g., `sequence.id`) or `array.length` + last-updated timestamp.
  - [x] Add a small server-side fingerprint (e.g., `updatedAt` or `version` property) that changes when the structure changes.
  - [x] Use a lightweight hash/fingerprint function if structural checks are unavoidable.
- [x] Add comments explaining the reason and why this replacement is safe.

Acceptance checklist:

- [x] Effects no longer use `JSON.stringify` in dependency checks in the touched `page.tsx` files.

### 6. Epic: Memoize global event handlers and ensure cleanup [x]

Tasks:

- [x] Audit components that add `window`/`document` event listeners. Common patterns to search: `window.addEventListener`, `document.addEventListener`, `useEffect` adding listeners.
- [x] For each handler:
  - [x] Wrap the handler in `useCallback` with correct dependencies or store a stable ref to the latest callback.
  - [x] Ensure `useEffect` cleanup removes the exact same handler reference.
  - [x] Add tests or IPA logging to confirm handlers are not leaking across mounts (smoke test).

Acceptance checklist:

- [x] No leaking listeners after repeated mount/unmount in a small smoke test.

### 7. Epic: Provider hygiene and minor frontend cleanups [x]

Tasks:

- [x] Remove unnecessary `ReactDOM` import from `app/providers/Providers.tsx` and any other providers where DOM-only imports are present.
- [x] Verify the provider composition order remains intact (`SessionProvider`, `ThemeProvider`, `UserStateProvider`, `FlowSeriesProvider`, `AsanaPostureProvider`, etc.).

Acceptance checklist:

- [x] `app/providers/Providers.tsx` compiles and provider order is unchanged.

### 8.5. Epic: Add contributor docs [x]

- [x] Create a short README in lib/prismaClient.ts documenting the caching pattern, import paths, and the rule 'do not call $disconnect() in handlers using the shared client'.

### 9. Epic: Validation, smoke tests, and PR [x]

Tasks (validation order):

- [x] Run `npm run lint` and fix any lint errors introduced.
- [x] Run the full test suite: `npm run test` and fix failures iteratively.
- [x] Start dev server: `npm run dev` and exercise the following endpoints in a browser or via curl/Postman:
  - `/api/user/recordActivity`
  - `/api/user/loginStreak`
  - `/api/dashboard/stats`
  - A few `sequences` and `series` endpoints used by the dashboard page.
- [x] Confirm repeated HMR cycles do not spawn duplicate Prisma clients and no closed-client errors appear in logs.
- [x] Prepare a PR describing changes, include the link to `PRD-prisma-client-and-runtime-stability.md` and this TaskList file. In PR description:
  - Explain the approach and note files intentionally left with local `PrismaClient()` (scripts/tests) and why.
  - Provide instructions for reviewers on how to test (run tests, run dev server, smoke endpoints)

Acceptance checklist:

- [x] Lint passes.
- [x] All tests pass.
- [x] Dev server smoke tests pass without closed-client runtime errors.
- [x] PR created with testing instructions.

## Testing notes (quick commands)

Run tests (full):

```bash
npm run test
```

Run lint:

```bash
npm run lint
```

Start dev server for smoke tests:

```bash
npm run dev
```

## Hints & Implementation nuance for the engineer

- When replacing `new PrismaClient()` imports, prefer the App Router helper `app/lib/prismaClient.ts` from `app/` server files to avoid relative path confusion. For non-app files (lib folder, scripts) prefer `lib/prismaClient.ts`.
- Keep the shared client simple and clearly documented; the single-sentence rule is: "If a file imports the shared `prisma`, do not call `$disconnect()` — this client is process-global." Put that in the header comment.
- For tests, mocking `prisma` is usually faster than spinning up a real test DB. If an integration test must hit DB, scope the client lifecycle to the test and disconnect in `afterAll`.

---

When you're ready I can: (a) open a feature branch and begin implementing the first epic (create the shared helpers and update a small number of routes), (b) run a repo scan to show remaining `new PrismaClient()` occurrences and create a patch plan, or (c) run the full test suite now and report failures.
