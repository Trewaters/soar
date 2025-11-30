# Engineering Task Breakdown

Derived from PRD: `PRD-new-asanaPose-model.md`

This task list is written to follow the `.github/instructions/Rules-PRD_to_Tasks.instructions.md` format and is intended to guide a junior engineer through migrating from `AsanaPosture` to `AsanaPose`.

### 1. Prisma Schema Updates

1.1 ✅ Update `AsanaPose` model in `prisma/schema.prisma`

- Add `@id @default(auto()) @map("_id") @db.ObjectId` for `id`.
- Add `sort_english_name String @unique`.
- Ensure relationships: `poseImages PoseImage[]`, `asanaActivities AsanaActivity[]`.
- Add new fields: `alternative_english_names String[]`, `alignment_cues String?`, `joint_action String?`, `muscle_action String?`, `imageCount Int @default(0)`.
- Include comments for deprecated fields and mapping notes.

Deliverable: Modified `prisma/schema.prisma` and migration files created by Prisma.

1.2 ✅ Mark `AsanaPosture` as deprecated

- Add comment `// DEPRECATED: Use AsanaPose instead of AsanaPosture` above the model.
- Preserve existing fields and relationships during the transition.

Deliverable: `prisma/schema.prisma` updated with deprecation comment.

1.3 ✅ Generate and review migration

- Run `npx prisma migrate dev --name create_asana_pose_model` to create migration files.
- Run `npx prisma generate` to refresh the client.
- Confirm no runtime schema conflicts in dev.

Deliverable: Migration folder under `prisma/migrations/`.

### 2. Migration Utilities

2.1 ✅ Transformer utility

- File: `scripts/migration/utils/asana-data-transformer.ts`
- Export `transformAsanaPosture(posture: any): AsanaPoseCreatePayload`.
- Responsibilities:
  - Rename fields per PRD mapping (e.g., `variations` → `pose_variations`).
  - Fix typos (`acitivity_*` → `activity_*`).
  - Convert types (string ↔ array) where needed.
  - Initialize new fields (`alternative_english_names = []`, `alignment_cues = null`).
  - Preserve `id`, `created_on`, `updated_on`, `created_by`, `isUserCreated`, `imageCount`.

Deliverable: `asana-data-transformer.ts` with comprehensive mapping functions.

2.2 ✅ Validator utility

- File: `scripts/migration/utils/migration-validator.ts`
- Exports: `validatePreMigration(records)`, `validateBatch(transformed)`, `validatePostMigrationStats(originalCount, migratedCount)`.
- Checks:
  - Non-empty `sort_english_name` and uniqueness.
  - `english_names` present as array.
  - Referential integrity with `AsanaActivity` and `PoseImage`.
  - Sample-based spot-check function `validateSampleRecords()`.

Deliverable: `migration-validator.ts` with functions and CLI-friendly entry points.

2.3 ✅ Rollback helper

- File: `scripts/migration/utils/rollback-handler.ts`
- Exports: `rollbackMigration(runId?: string)`, `restoreFromBackup(backupPath: string)`.
- Behavior: Delete `AsanaPose` records created by a run or restore from backup.

Deliverable: `rollback-handler.ts` implementing safe rollback.

### 3. ✅ Migration Runner Script

- File: `scripts/migration/migrate-asana-posture-to-pose.ts`
- Responsibilities:
  - Validate `DATABASE_URL` and DB connectivity.
  - Create a full MongoDB backup prior to writes.
  - Fetch `AsanaPosture` records in batches (default 100).
  - Transform each record with `transformAsanaPosture`.
  - Validate each transformed batch with `migration-validator`.
  - Insert batches using `prisma.asanaPose.create` (preserve `_id`) or `createMany` if safe.
  - Duplicate `AsanaActivity` relationships if required for transition.
  - CLI flags: `--dry-run`, `--batch-size`, `--resume`, `--run-id`.
  - Logging: write `.github/migrations/migration-report-[timestamp].md` with statistics.
  - Error handling: on fatal error call `rollbackMigration()`.

Deliverable: Runnable migration script and report output.

### 4. ✅ Tests

4.1 Transformer unit tests

- File: `__test__/scripts/migration/utils/asana-data-transformer.spec.ts`
- Cases:

  - Field renames
  - Typo corrections
  - Type conversions (string→array)
  - Null/undefined handling
  - Timestamp and metadata preservation

    4.2 Validator unit tests

- File: `__test__/scripts/migration/utils/migration-validator.spec.ts`
- Cases: pre/post checks, uniqueness enforcement, batch validation.

  4.3 Integration test for runner

- File: `__test__/scripts/migration/migrate-asana-posture-to-pose.spec.ts`
- Setup: Test Mongo DB or in-memory DB seeding `AsanaPosture` records (100+ realistic)
- Assertions: Record counts match, sample record accuracy, report exists.

Deliverable: Jest tests under `__test__/` and CI pass locally.

### 5. ✅ Staging & Dry Runs

- Create a staging backup and run `npx prisma migrate deploy`.
- Run `npm run migrate:asana -- --dry-run` and inspect report.
- Run full migration on staging and validate 10% sample.

Deliverable: Staging report and sign-off.

### 6. Production Execution

6.1 Pre-steps

- Schedule migration window; notify stakeholders.
- Create MongoDB backup with `mongodump --uri="${DATABASE_URL}" --archive=backup-...gzi`.

  6.2 Execution

- Deploy Prisma migration: `npx prisma migrate deploy`.
- Run migration: `npm run migrate:asana -- --batch-size=100`.

  6.3 Post-Validation

- Run `migration-validator` checks and compare counts.
- Generate `.github/migrations/migration-report-[date].md`.

Deliverable: Migration report and confirmation of success.

### 7. Follow-up Tasks (Future Phase)

- Update `app/context/AsanaPostureContext.tsx` to use `AsanaPose`.
- Update `app/api/asana` endpoints and `lib/postureService.ts` to CRUD `AsanaPose`.
- Remove `AsanaPosture` from schema after 30 days and run migration to drop the collection.

Deliverable: Follow-up PRs listed in `.github/migrations/`.

### 8. Scripts to add to `package.json`

- `"migrate:asana": "ts-node --transpile-only scripts/migration/migrate-asana-posture-to-pose.ts"`
- `"validate:migration": "ts-node --transpile-only scripts/migration/utils/migration-validator.ts"`
- `"rollback:migration": "ts-node --transpile-only scripts/migration/utils/rollback-handler.ts"`

---

## Acceptance Criteria

- All `AsanaPosture` records copied to `AsanaPose` with correct transformations.
- No data loss: timestamps, ownership, image counts preserved.
- Migration script supports dry-run and rollback.
- Migration logs exist and include counts and errors.
- Tests exist for transformer, validator, and runner.

---

## Notes for the engineer

- Prefer `prisma.asanaPose.create` if you need to preserve original `_id` values.
- Keep batch sizes small (100) to avoid memory pressure.
- Use sample validation (10%) for manual QA checks.

---

_TaskList created from `PRD-new-asanaPose-model.md`._
