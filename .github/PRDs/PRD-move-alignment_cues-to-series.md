# PRD: Move `alignment_cues` from AsanaPose to AsanaSeries (per-series pose cues)

## Overview

Move the `alignment_cues` field that currently exists on the `AsanaPose` Prisma model to be stored per-pose within an `AsanaSeries`. This allows a user who creates a new series and selects a posture to optionally add an alignment cue specific to that series-pose relationship. The cue is therefore contextual to how the pose is used in a series rather than a global property of the pose.

## Problem Statement

Currently `alignment_cues` are stored on `AsanaPose`. This is a global field and does not support the use-case where the same pose may require different alignment cues depending on the series or sequence it belongs to. We need per-series alignment cues attached to the selected pose inside an `AsanaSeries`.

## Target Users

- Instructors and advanced users creating customized series
- Regular users who want to add context-specific notes/cues to a pose inside a saved series

## Scope

### In-Scope

- Update Prisma schema to remove `alignment_cues` from `AsanaPose` and add a per-series pose structure in `AsanaSeries` that supports storing an `alignment_cues` string (or nullable) for each pose in the series.
- Update server-side API and any Prisma client usages to reflect the model change.
- Update UI for series creation/editing to allow entering an alignment cue when adding a pose to the series.
- Update series rendering (preview/player) to surface the alignment cue where relevant.
- Update tests, fixtures, and seed data to reflect the new schema.
- Document the breaking change and note that existing `AsanaPose.alignment_cues` data will be discarded (no migration).

### Out-of-Scope

- Automatic migration of existing `AsanaPose.alignment_cues` into series-level data. Existing pose alignment cues can be dropped.
- Changes to other cue fields (e.g., `deepening_cues`, `setup_cues`) unless needed during implementation.

## Functional Requirements

### Core Functionality

1. Prisma schema change: remove `alignment_cues` from `AsanaPose` and add a per-pose entry inside `AsanaSeries` to hold `alignment_cues` for that series-pose.
2. When a user adds a pose to a series in the Create/Edit Series UI, show an optional `Alignment cue` text input next to the pose selector.
3. Persist the alignment cue as part of the series' pose data. The data shape should support multiple poses, each with optional `alignment_cues`.
4. When rendering a series (preview or practice view), display the alignment cue for the current pose if present.
5. Server/API endpoints that create/update `AsanaSeries` must accept and validate the new per-pose `alignment_cues` field.

### UI Requirements

- Series Create/Edit form: for each selected pose, display an optional single-line or multi-line input for alignment cues (MUI TextField). Limit characters to a sensible amount (e.g., 1000 chars).
- Series List / Preview: wherever a pose is displayed in the context of a series, show a small “Alignment cue” area when present. Support toggling visibility in the practice player (e.g., show/hide cues).
- Asana Pose pages: Remove the `alignment_cues` editor/display from individual `AsanaPose` pages.

### Integration Requirements

- Authentication: only authenticated users can create/edit series (follow existing NextAuth patterns).
- Database: update Prisma schema and run `prisma generate` (and `db push` if using push flow) to update the generated client.
- Context providers: Ensure `AsanaSeries` contexts and any caching layers are updated to the new data shape.

## User Stories

### Primary User Story

As an instructor
I want to add an alignment cue when placing a pose inside a custom series
So that the cue applies only in that series context and not globally to the pose

Acceptance Criteria:

- [ ] When adding a pose to a series I can optionally enter an alignment cue.
- [ ] The cue is saved as part of the `AsanaSeries` record and displayed in the series preview/player.
- [ ] Asana pose pages no longer show or require alignment cues.

### Secondary User Stories

- As a user viewing a saved series, I can toggle alignment cues visibility in the practice player.
- As a developer, I can update and validate `AsanaSeries` objects through API endpoints including per-pose cues.

## Technical Requirements

### Frontend

- Update the series create/edit React component(s) in `app/asanaSeries` or the workspace's series UI to include an input for `alignment_cues` next to each selected pose.
- Remove alignment cue inputs from `app/[asana]` (pose edit pages) if present.
- Update TypeScript types/interfaces used by the series pages and any client models.

### Backend / Prisma

- Modify `prisma/schema.prisma`:
  - Remove `alignment_cues` from `AsanaPose`.
  - Update the `AsanaSeries` model to store pose entries with optional `alignment_cues`. Options:
    - Add a new JSON field `seriesPoses` (or rename `seriesPoses` if already present) where each element is { poseId: string, sort_english_name: string, alignment_cues?: string }.
    - Or create a separate `SeriesPose` model referencing `AsanaSeries` and `AsanaPose` with an `alignment_cues` String? field. (Recommendation: use a JSON array inside `AsanaSeries` to minimize schema migration complexity.)
- Run `prisma generate` and apply DB push/migrations as appropriate for the development environment.

### Data Shape Contract (recommended)

When `AsanaSeries.seriesPoses` is JSON-based, use the following per-element contract:

{
"poseId": "<ObjectId string>",
"sort_english_name": "Downward Facing Dog",
"alignment_cues": "Optional text" // nullable or omitted when not present
}

If using a `SeriesPose` join model, its fields should include `id`, `seriesId`, `poseId`, `sort_english_name`, and `alignment_cues` (String?).

## Data Migration & Backfill

- No migration of existing `AsanaPose.alignment_cues` -> `AsanaSeries` will be performed. Existing values may be dropped.
- Document this data loss clearly in release notes and the PR description so maintainers know the change is intentional.
- Optionally provide a script or instructions for teams who want to manually migrate specific alignment cues into series records before upgrade; this is outside core scope.

## Testing

- Unit tests for the series create/edit UI component ensuring alignment cue input is available and correctly sends data to the API.
- API tests for create/update `AsanaSeries` handling the new per-pose `alignment_cues` property.
- Integration test for rendering a series and ensuring alignment cues display in the practice player.

## Implementation Notes

- Prefer minimal, backward-compatible changes to other fields.
- Using a JSON array inside `AsanaSeries` is the least disruptive approach since this project uses Mongo/Prisma with JSON support.
- Update seed/fixture files in `__test__` and `app/data` that include `AsanaPose.alignment_cues`.

## Files Likely To Be Modified

- `prisma/schema.prisma` (remove `alignment_cues` from `AsanaPose`, update `AsanaSeries`)
- `app/asanaSeries/*` (create/edit UI, API handlers)
- `app/asana/*` (pose edit/display pages — remove alignment cue UI)
- `app/context/AsanaSeriesContext` and `AsanaPostureContext` if they reference the field
- `__test__/**` fixtures and tests referencing `alignment_cues`
- `README_MongoDB.md`, `CHANGELOG.md` — document the change

## Success Criteria

- Prisma schema updated and client regenerated without errors.
- Series UI accepts and persists per-pose alignment cues.
- Asana pose pages no longer surface global alignment cues.
- Tests updated and passing locally using `npm run test:minimal` or `npm run test`.

## Risks & Mitigations

- Risk: Old data is lost. Mitigation: Document decision, optionally provide export/migration guidance.
- Risk: Multiple parts of the code reference `AsanaPose.alignment_cues`. Mitigation: Use code search to find usages and update them.

## Future Considerations

- If other cue fields vary by series, consider moving them to the same per-series data structure.
- Consider creating a `SeriesPose` join table model if series-level metadata grows in complexity and requires queries separate from the series document.

---

Generated by Soar PRD generator
