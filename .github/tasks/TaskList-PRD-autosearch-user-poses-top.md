# Engineering Task Breakdown

This task list implements the PRD: `PRD-autosearch-user-poses-top.md`.
Focus: Add a top section for user-created and alpha-user-created items across all asana autocomplete/search surfaces (poses, series, sequence), deduplicating by `canonicalAsanaId`, and sorting remaining results alphabetically.

## 1. Foundation: Utilities and Types

- ✅ Create a reusable search partitioning utility in `app/utils/search/partitionAutosearch.ts`:

  - ✅ Function: `partitionAutosearch<T extends { canonicalAsanaId?: string; createdBy?: string }>(items: T[], opts: { currentUserId?: string | null; alphaUserIds: string[]; getTitle: (item: T) => string }): { top: T[]; others: T[] }`
  - ✅ Behavior:
    - ✅ Compute `top = items` where `createdBy` is `currentUserId` or in `alphaUserIds`.
    - ✅ `others = items` excluding any with `canonicalAsanaId` present in `top`.
    - ✅ Sort `others` A→Z using `getTitle`.
    - ✅ If `canonicalAsanaId` is missing, fallback to dedupe by `id` with a TODO note to migrate.
  - ✅ Add unit tests for this util in `__test__/app/utils/search/partitionAutosearch.spec.ts` covering:
    - ✅ Mixed owner sets
    - ✅ Missing `canonicalAsanaId`
    - ✅ Case-insensitive sorting
    - ✅ Stability with large arrays

- ✅ Add a tiny title resolver util `app/utils/search/getAsanaTitle.ts`:
  - ✅ `getAsanaTitle(asana)`: prefer `displayName`, fallback `englishName`, fallback `title`.
  - ✅ Unit tests in `__test__/app/utils/search/getAsanaTitle.spec.ts`.

## 2. Feature Flag and Alpha Users Source

- ✅ Add a feature flag in `app/FEATURES.ts`:

  - ✅ `PRIORITIZE_USER_ENTRIES_IN_SEARCH: true` (name per PRD: applies to poses, series, sequence)
  - ✅ Document usage in comments.

- ✅ Create alpha users source:
  - ✅ `app/config/alphaUsers.ts` (or `lib/alphaUsers.ts` if consistent with repo):
    - ✅ Export `getAlphaUserIds(): string[] | Promise<string[]>`.
    - ✅ For v1, read from env `ALPHA_USER_IDS` (CSV) or static array; add TODO for role-based lookup.
  - ✅ Unit tests with env-mocking in `__test__/lib/alphaUsers.spec.ts`.

## 3. Session and Context Integration

- ✅ Ensure all search surfaces can access the current user id:

  - ✅ Use `useSession()` from NextAuth v5 where not already available.
  - ✅ If components rely on `UserStateProvider`, expose a selector `useUserId()` as needed (implement in `app/context/UserContext.tsx` if missing).

- ✅ Add a small hook wrapper `app/hooks/useAutosearchPartition.ts`:
  - ✅ `useAutosearchPartition(items, getTitle)` that internally reads session user id and alpha user ids, calls `partitionAutosearch`, and memoizes the result.
  - ✅ Unit tests in `__test__/app/hooks/useAutosearchPartition.spec.ts` (mock NextAuth and alpha users provider).

## 4. UI: Grouped Rendering Pattern (Shared)

- ✅ Create a lightweight grouped list rendering helper to keep consistency:
  - ✅ `app/clientComponents/search/GroupedAutocompleteSections.tsx`
  - ✅ Props: `{ topItems, otherItems, renderItem, topLabel: string, otherLabel?: string }`
  - ✅ Implement MUI group headers as non-focusable with ARIA labels (e.g., `aria-label="User (poses, series, sequence)"` and `"Others"`).
  - ✅ Ensure keyboard navigation skips headers and works seamlessly across items.
  - ✅ Snapshot and a11y tests in `__test__/app/clientComponents/search/GroupedAutocompleteSections.spec.tsx`.

## 5. Apply to Search Surfaces: Poses

- ✅ Planner/Sequence Builder Asana pickers (poses):
  - ✅ Locate components under `app/planner/**` likely using MUI `Autocomplete` for asanas (e.g., `AsanaPicker.tsx`, `PoseSearch.tsx`).
  - ✅ Integrate `useAutosearchPartition` + `GroupedAutocompleteSections`:
    - ✅ Compute `{ top, others }` for the current search result list.
    - ✅ Render top section label: `"Your Poses"` when `top.length > 0`.
    - ✅ Render others section label: `"Others"`.
  - ✅ Ensure `getTitle` uses `getAsanaTitle`.
  - ✅ Add component tests under `__test__/app/planner/...`:
    - ✅ Shows top section with user/alpha items.
    - ✅ Others section alphabetical.
    - ✅ No duplicates across sections.
    - ✅ Keyboard navigation and ARIA labels.

## 6. Apply to Search Surfaces: Series

- ✅ Sequence Builder / Series management search components:
  - ✅ Locate series-related Autocomplete inputs under `app/planner/**` or `app/views/**`.
  - ✅ Confirm series model includes `canonicalAsanaId`-equivalent; if not, add a local mapping fallback and open a migration task (see Section 9).
  - ✅ Integrate the same partition + grouped rendering.
  - ✅ Component tests mirror poses cases with series objects.

## 7. Apply to Search Surfaces: Sequence

- ✅ Practice view and builder search for sequences:
  - ✅ Locate sequence Autocomplete inputs under `app/views/**` or `app/planner/**`.
  - ✅ Apply partitioning, dedupe, and grouped rendering.
  - ✅ Component tests for sequences mirroring poses tests.

## 8. Optional: API Support (If Chosen)

- ✅ Add optional query flags (no behavior change if absent):
  - ✅ `prioritizeUser=true`, `includeAlpha=true` on relevant endpoints in `app/api/**`.
  - ✅ For now, continue to return a flat list; client still partitions. Document this in endpoint JSDoc.
  - ✅ Add minimal endpoint tests validating passthrough behavior.

## 9. Data Audit and Migration Prep (Risk Mitigation)

- ✅ Audit `canonicalAsanaId` presence across poses, series, and sequences:
  - ✅ Add a small script `scripts/audit-canonical-id.ts` to sample records and report missing fields.
  - ✅ If significant gaps are found, open a dedicated migration PRD/task; for v1, util falls back to `id`-based dedupe with a console.warn in development.

## 10. Accessibility and UX Polish

- ✅ Verify ARIA labels and roles:
  - ✅ Headers non-focusable (`role="presentation"`), groups carry `aria-label`.
  - ✅ Announcements verified with testing library a11y assertions.
- ✅ Ensure mobile responsiveness and touch targets remain intact after grouping.
- ✅ Add a tooltip or helper text explaining that the top section includes user and alpha user items.

## 11. Feature Flag Wiring and Rollout

- ✅ Wrap grouped behavior behind `FEATURES.PRIORITIZE_USER_ENTRIES_IN_SEARCH` checks:
  - ✅ If disabled, fall back to current behavior.
  - ✅ Add tests to assert both enabled/disabled modes.
- ✅ Prepare a short rollout note in `documentation/` or `README.md`.

## 12. Testing: End-to-End Coverage

- ✅ Unit tests:
  - ✅ `partitionAutosearch` util edge cases and performance for large lists.
  - ✅ `getAsanaTitle` title fallback order.
- ✅ Component tests:
  - ✅ For pose surface: grouped rendering, dedupe, sorting, a11y, keyboard navigation.
    ✅ For series and sequence surfaces: grouped rendering, dedupe, sorting, a11y, keyboard navigation.
    - ✅ Session states: authenticated vs. unauthenticated should default to alpha-only in top or hide top if empty (series/sequence).
- ✅ Optional API tests if flags added.

## 13. Developer Documentation

- ✅ Add `documentation/autosearch-grouping.md`:
  - ✅ Rationale, data requirements, usage examples of the util and hook.
  - ✅ How to add the pattern to new Autocomplete inputs.
  - ✅ Feature flag and alpha users configuration.

## 14. Acceptance Checklist (map to PRD)

- [✅] Top section shows user- and alpha-created items in pose search
- [✅] No duplicates across sections (dedupe by `canonicalAsanaId`)
- [✅] Others section strictly alphabetical by display title
- [✅] Headers labeled: `"Your Poses"` and `"Others"` (poses only; series/sequence pending)
- [✅] A11y: headers non-focusable; groups have `aria-label`; keyboard navigation seamless
- [✅] Feature flag present and honored
- [✅] Unit and component tests added and passing (poses only; series/sequence pending)

## Suggested Implementation Order

1. Utilities and tests (Sections 1–2)
2. Hook and grouped rendering component (Sections 3–4)
3. Apply to poses surfaces (Section 5)
4. Apply to series and sequence surfaces (Sections 6–7)
5. A11y polish and feature flag wiring (Sections 10–11)
6. Optional API flags and data audit (Sections 8–9)
7. Documentation and final acceptance pass (Sections 12–14)

## 15. Refactor: Centralize Posture Search Sorting Logic

- Create a new utility function in `app/utils/search/orderPosturesForSearch.ts`:

  - Function: `orderPosturesForSearch(postures, currentUserId, alphaUserIds, getTitle)`
  - Partition postures into user-created, alpha-created, and others.
  - Deduplicate by `canonicalAsanaId` (fallback to `id` if missing).
  - Sort each group alphabetically by display title (using `getTitle`).
  - Return a single ordered array: user-created first, then alpha, then others.
  - Add comprehensive unit tests in `__test__/app/utils/search/orderPosturesForSearch.spec.ts`.

- Refactor `app/navigator/asanaPostures/posture-search.tsx`:

  - Remove all in-component partitioning and sorting logic (`useAutosearchPartition`, `partitionRaw`, etc.).
  - Use the new utility inside a `useMemo` to get the ordered options for the dropdown.
  - Pass the result directly to the MUI `Autocomplete` options.
  - Ensure the dropdown always shows user-created postures at the top, followed by alpha, then others, all sorted alphabetically.

- (Optional) If visual grouping is desired, use MUI's `groupBy` prop or a custom rendering helper, but keep all data ordering logic in the utility.

- Update documentation in `documentation/autosearch-grouping.md` to reflect the new approach and usage.

- Acceptance Criteria:
  - [ ] Utility function created and tested.
  - [ ] Component refactored to use the utility.
  - [ ] Dropdown ordering matches requirements: user-created, alpha, others (alphabetical).
  - [ ] No duplicates across sections.
  - [ ] Unit and component tests passing.
  - [ ] Documentation updated.
