# Profile Library — Pagination & Usage

## Overview

The Profile Library page lets practitioners manage content they created: Asanas (poses), Flows (series), Sequences, and Profile Images. This document explains the pagination UX (infinite vs paged), how to use controls, API query examples, accessibility considerations, and recommended DB/index guidance for production.

**Page URL:** `/profile/library`

## What is Pagination in the Profile Library?

Pagination splits long lists into manageable pages or an incremental infinite stream so the UI is responsive and network usage stays low. The app supports two modes:

- Infinite: Append more items when the user clicks "Load more" or when an IntersectionObserver is used.
- Paged: Explicit page numbers (Previous / Next and page indicator) where each page fetches a fixed slice of items.

No feature flag is required — users choose the mode via the UI toggle on the Library page.

## How to Switch Modes (UI)

- On the Library page header there is a small Pagination control: `Infinite` and `Paged` buttons.
- `Infinite` (default): Items append to the list as the user clicks **Load more**.
- `Paged`: The UI shows `Previous`, `Page N`, and `Next` controls; selecting a page fetches that page slice and replaces the visible list.

## Page Components and Controls

- Pagination toggle: small buttons in the page header labeled **Infinite** and **Paged**.
- Infinite controls:
  - Visible `Load more` button centered under the list.
  - `aria-label="Load more library items"` for screen readers.
- Paged controls:
  - `Previous` and `Next` buttons with a `Page N` label between them.
  - Buttons are keyboard focusable; disabled when not applicable.

## Page Components (detailed)

- **Pagination toggle**: Two small buttons in the page header labelled **Infinite** and **Paged**. Switches the client between append (infinite) and page-slice (paged) modes.
- **List Container**: Semantic container holding the items. Should be announced to screen readers and preserve focus when new data loads.
- **Item Cards / List Items**: Reusable components for `AsanaCard`, `SeriesCard`, and `SequenceCard`. Include accessible headings and descriptive text.
- **Load more button** (infinite mode): Centered, with `aria-label="Load more library items"`.
- **Paged controls** (paged mode): `Previous`, `Page N` readout, and `Next` buttons. Buttons are disabled when at the first page or when no more items exist.
- **Empty state**: Helpful messaging with a primary CTA (`Create Your First Asana`) and secondary guidance.
- **Error banner / inline Alert**: Shown for network errors or permission issues with a retry button.

## Step-by-step: Common Workflows

1. Viewing your library (default):

- Navigate to `/profile/library` and ensure you're signed in.
- Use the header toggle to pick **Infinite** (append) or **Paged** (slice) behaviour.

2. Load more (infinite):

- Scroll the list and click **Load more** to append the next slice. The UI preserves existing items and appends the new ones.

3. Jump pages (paged):

- Select **Paged** mode; use `Next` and `Previous` to move between pages. The visible list will be replaced with that page's items.

4. Refreshing after edits or deletions:

- Use the page-level **Refresh** action (or reload the page) to reset pagination and fetch the latest data.

5. Creating content from empty state:

- Click **Create Your First Asana** (or analogous CTA) to open the creation flow; after saving, use **Refresh** to see the new item.

## Tips for Effective Use

- Prefer **Paged** mode when you need deterministic navigation (jumping to specific pages).
- Use **Infinite** mode for exploration and discovery — it reduces round trips for incremental browsing.
- Keep `limit` reasonably small on mobile (8–12 items) to reduce payload size and avoid long lists.

## Troubleshooting & Developer Notes

- If you see `Invalid cursor` errors: the client should fall back to page 1 or request the initial infinite slice. Call `refresh()` from the hook to recover.
- If ordering appears inconsistent after deletions: call `refresh()` to reset the list. The backend orders by `created_on DESC, id DESC` for determinism.
- Developer: API normalizes DB `created_on` into `createdAt` in responses for UI consistency.

## API Contract (examples)

GET `/api/profile/library` supports query parameters to control pagination and content type:

- `type` (optional): `asanas|series|sequences|all` (default `asanas`)
- `limit` (optional): number of items per request (default 20, server-enforced max 100)
- `mode` (optional): `infinite|paged` (default `infinite`)
- `cursor` (optional): base64(JSON({ createdAt, id })) — used for infinite cursor pagination
- `page` (optional): 1-based page number — used for paged mode

Examples:

- Infinite, first page (server chooses first slice):
  `/api/profile/library?type=asanas&limit=12&mode=infinite`
- Infinite, next cursor:
  `/api/profile/library?type=asanas&limit=12&mode=infinite&cursor=<base64-cursor>`
- Paged, page 3:
  `/api/profile/library?type=series&limit=12&mode=paged&page=3`

Response (JSON):

- `items`: array of records
- `nextCursor`: string | null — cursor to request next infinite page
- `hasMore`: boolean — whether more items exist

Note: `items` are normalized in the API to include a `createdAt` property for UI consistency (the DB field may be `created_on`).

## Error Handling & UX

- Invalid `cursor`: UI should show a subtle toast and fall back to page 1 (paged mode) or the initial infinite slice. The client hook already handles failures by logging and leaving it to the UI to show a message.
- Network errors: show an inline `Alert` with a retry action.
- Empty state: explain how to create content and provide a primary CTA (e.g., **Create Your First Asana**).

## Accessibility

- All controls are reachable by keyboard and provide clear `aria-label` attributes.
- Page updates should not steal focus; when a user loads more, focus remains on the list container.
- For paged navigation, announce page changes to screen readers via polite live regions if implemented.

## Mobile Considerations

- Load targets and buttons are touch-friendly (sufficient size and spacing).
- `Infinite` mode helps mobile users avoid extra taps but may increase total data transferred; `Paged` mode is better when users want direct page jumps.

## DB & Index Guidance

For production scale, add indexes that support user-scoped, time-ordered queries. Recommended index patterns (Prisma / Mongo / SQL):

- Composite index on `(created_on DESC, id DESC)` for each model that needs ordering.
- If queries are user-scoped (only returning a single user's content), add an index on `(created_by, created_on)` or `(userId, created_on)` depending on schema naming.

Example (Prisma schema hint):

- model AsanaPose {
  // ... fields ...
  created_on DateTime @db.DateTime
  created_by String?
  @@index([created_by, created_on])
  }

Adding these indexes improves the performance of `ORDER BY created_on DESC` and cursor/offset queries.

## Telemetry & Monitoring (ops)

Instrument these events to monitor pagination usage and performance:

- `library.page_loaded` — values: `{ type, mode, page?, limit, duration_ms }`
- `library.load_more` — values: `{ type, cursor_present, limit, duration_ms }`

## Developer Notes

- The API encodes cursors as base64(JSON({ createdAt, id })) — the server decodes the token and uses the `created_on` DB field for comparisons.
- The client hook `useProfileLibrary` exposes both `infinite` and `paged` behaviors:
  - Infinite: `items` arrays append, call `loadMore()` to fetch next slice.
  - Paged: `items` are replaced; hook exposes `page` and `setPage(page)` helpers.
- Tests should cover: invalid cursor fallback, paged page N fetch, infinite append, and deterministic ordering by `created_on` then `id`.

## Common Questions

Q: Why both `paged` and `infinite` modes?
A: Different users prefer different patterns. Infinite is smoother for discovery; paged is better for jump-to-page workflows and predictable network usage.

Q: Will pagination change my library content order?
A: No — ordering is deterministic by descending creation time then ID so repeated requests maintain stable ordering.

Q: How should I handle deletions while paging?
A: On detecting fewer items than expected or failed fetch due to missing items, prompt the user to refresh the page (there is a **Refresh** action). The client also supports a `refresh()` call to reset pagination.

---

If you'd like, I can also add a short help card inside the app UI linking to this doc, or add screenshots demonstrating the toggle and controls. Would you like that?
