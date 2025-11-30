# Engineering Task Breakdown

### 1. Schema: Move alignment_cues to series-level

- Create a safe, minimal Prisma schema change: remove `alignment_cues` from `AsanaPose` and add a JSON-based `seriesPoses` contract to `AsanaSeries` (or extend existing `seriesPoses`).
  - Files: `prisma/schema.prisma`
  - Tasks:
    - Update `AsanaSeries` model to ensure `seriesPoses` is `String[]` or `Json[]` and document the per-element shape: { poseId, sort_english_name, alignment_cues? }.
    - Remove `alignment_cues` from `AsanaPose` model.
    - Run `prisma generate` and (if appropriate) `prisma db push` to update generated client.
  - Acceptance:
    - `prisma generate` runs without errors.
    - New client types reflect the JSON shape or seriesPoses field.

### 2. Backend: API & data contract updates

- Update API handlers that create/update `AsanaSeries` to accept per-pose `alignment_cues`.
  - Files: `app/api` routes related to series (search for `AsanaSeries` usages), server-side services that call Prisma client.
  - Tasks:
    - Find all read/write usages of `AsanaSeries`/`AsanaPose` and update types to include per-pose cues.
    - Validate input on the server: ensure `alignment_cues` is string and length-limited.
    - Update any validation schemas (zod/yup) used for series input.
  - Acceptance:
    - API can create/update `AsanaSeries` records with per-pose `alignment_cues`.

### 3. Frontend: Series Create/Edit UI

- Add alignment cue input to series create/edit form when adding a pose.
  - Files: `app/*series*` (likely `app/asanaSeries`, `app/planner`, or `app/views/series` depending on project structure). Also update clientComponents if re-usable.
  - Tasks:
    - Update form data shape to include per-pose cue field.
    - Add MUI TextField next to each selected pose in the series editor. Keep it optional and character-limited (1000 chars).
    - On save, send the per-pose cue data in the payload to the API.
    - Update UI tests and snapshot tests.
  - Acceptance:
    - Users can type an alignment cue when adding a pose and saved series contains the text.

### 4. Frontend: Series Preview / Player

- Display per-pose `alignment_cues` in the series preview and practice player UI.
  - Tasks:
    - Update series preview components to render the cue if present.
    - Add a toggle in player controls to show/hide alignment cues.
  - Acceptance:
    - Cue displays correctly and toggles on/off.

### 5. Frontend: Asana Pose pages cleanup

- Remove alignment cue editing and display from per-pose pages.
  - Files: `app/asana/*` or wherever poses are edited/viewed.
  - Tasks:
    - Remove input fields or display areas for `alignment_cues`.
    - Run code search/replace to remove references to `alignment_cues` on pose pages.
  - Acceptance:
    - No UI for editing `alignment_cues` on AsanaPose pages remains.

### 6. Tests & Fixtures

- Update unit and integration tests and fixtures.
  - Files: `__test__/**`, fixtures under `app/data` or `__test__/fixtures`.
  - Tasks:
    - Update any test fixtures referencing `AsanaPose.alignment_cues` to remove or move them into series fixtures.
    - Add tests for series create/update API including per-pose cue.
    - Add tests for series editor UI and player cue rendering.
  - Acceptance:
    - Tests pass locally with `npm run test:minimal`.

### 7. Data & Migration Notes

- Document that existing `AsanaPose.alignment_cues` data will be dropped.
  - Tasks:
    - Update `README_MongoDB.md` / `CHANGELOG.md` with a breaking-change note.
    - Optionally add a script `scripts/remove-old-alignment-cues.js` that can be run against the DB to remove the field (if desired).
  - Acceptance:
    - Documentation added; migration script present if requested.

### 8. Developer Workflow & QA

- Steps for developers to test the change locally.
  - Tasks:
    - Pull branch, run `npm install`, update env `DATABASE_URL` to local dev DB.
    - Run `npx prisma generate` and `npx prisma db push` (if using push) or follow migration steps.
    - Run `npm run dev` and validate series create/edit flows.
    - Run `npm run test:minimal`.
  - Acceptance:
    - Local dev server runs and tests pass.

### 9. Communication & Release

- Add release note and notify frontend/backfill teams about the breaking change.
  - Tasks:
    - Add entry to `CHANGELOG.md` documenting the dropped field and new per-series cues.
    - Create a PR description that highlights non-migration of existing data.
  - Acceptance:
    - CHANGELOG updated and PR includes clear migration notes.

## Order & Estimated Effort (junior engineer guidance)

1. Schema update — small (0.5–1 day)
2. Backend API updates — medium (0.5–1 day)
3. Series editor UI changes — medium (1–2 days)
4. Series preview/player updates — small (0.5–1 day)
5. Pose page cleanup — small (0.25–0.5 day)
6. Tests & fixtures — medium (1 day)
7. Docs, changelog, PR — small (0.25 day)

## Notes & Hints

- Prefer JSON-based `seriesPoses` to avoid creating a new join model unless you need to query series-poses separately.
- Keep the provider order and context wrappers in tests (SessionProvider → ThemeProvider → UserStateProvider → Asana contexts).
- Use `data-testid` attributes on new inputs for stable tests.
