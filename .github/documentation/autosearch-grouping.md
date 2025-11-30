# Autosearch Grouping Pattern

This document covers the shared pattern for prioritizing user-created and alpha-user-created items at the top of search/autocomplete lists for poses, series, and sequences.

## Overview

- Partitions a flat list into two sections: Top (user + alpha users) and Others.
- Deduplicates Others by `canonicalAsanaId` (falls back to `id` with a console warning in dev).
- Sorts Others A→Z by display title.
- Wrapped behind `FEATURES.PRIORITIZE_USER_ENTRIES_IN_SEARCH`.

## Key Pieces

- `app/utils/search/partitionAutosearch.ts`: core partition and dedupe utility.
- `app/utils/search/getAsanaTitle.ts`: resolves display title.
- `app/hooks/useAutosearchPartition.ts`: reads session + alpha IDs and memoizes partition.
- `app/clientComponents/search/GroupedAutocompleteSections.tsx`: shared grouped renderer with accessible headers.

## Integration

- Poses: `app/navigator/asanaPostures/posture-search.tsx`
- Series: `app/navigator/flows/practiceSeries/page.tsx`
- Sequences: `app/navigator/flows/practiceSequences/page.tsx`

Ensure items contain:

- `createdBy` (or `created_by`) and `canonicalAsanaId` (fallback to `id` if missing).

## Accessibility

- Headers are non-focusable (`role="presentation"`) and have `aria-label`.
- Keyboard navigation skips headers.
- On pages with MUI Autocomplete poppers, grouped lists hide while the Autocomplete is open/focused to avoid duplicate visible text.

## Feature Flag

- `PRIORITIZE_USER_ENTRIES_IN_SEARCH` in `app/FEATURES.ts` gates all grouped behavior. Disable it to revert to the original flat lists.

## Testing

- Utilities and hook have unit tests under `__test__/app/utils/search/` and `__test__/app/hooks/`.
- Grouped renderer tested under `__test__/app/clientComponents/search/`.
- Surface-level grouped tests:
  - `__test__/app/navigator/asanaPostures/posture-search.grouped.spec.tsx`
  - `__test__/app/navigator/flows/practiceSequences/page.grouped.spec.tsx`

## Adding to New Surfaces

1. Enrich items with `createdBy` and `canonicalAsanaId` fields.
2. Call `useAutosearchPartition(items, getTitle)`.
3. Render `<GroupedAutocompleteSections topItems={top} otherItems={others} .../>` behind the feature flag.
4. If an Autocomplete popper is present, hide grouped sections while the popper/input is open/focused.
