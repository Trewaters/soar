# Testing Implementation for Autosearch Grouping (Task 12)

## Overview

Added surface-level tests to verify grouped rendering, dedupe, and accessibility across poses and sequences.

## Files Added

- `__test__/app/navigator/asanaPostures/posture-search.grouped.spec.tsx`: tests grouped sections for PostureSearch with user/alpha items and deduped others.
- `__test__/app/navigator/flows/practiceSequences/page.grouped.spec.tsx`: tests grouped sections on practice Sequences page, including feature-flag off behavior.
- `documentation/autosearch-grouping.md`: developer docs for the pattern.
- `scripts/audit-canonical-id.ts`: optional audit script for checking missing `canonicalAsanaId` in a JSON dataset.

## Yoga Domain Context

- Prioritizes sequences/poses created by the current practitioner or trusted alpha instructors.
- Keeps experience consistent in practice planning and sequence browsing.

## Accessibility & Mobile

- Group headers use `role="presentation"` and `aria-label`.
- Grouped lists hide during Autocomplete interactions to avoid duplicate readings.

## How to Run

- Run tests with the existing Jest scripts.

## Acceptance Mapping

- Grouped sections render with correct labels (Done)
- Dedupe by `canonicalAsanaId` (Done)
- Alphabetical Others (verified indirectly via util tests)
- Feature flag honored (Done)
