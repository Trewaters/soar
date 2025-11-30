Trewaters: Create a PRD for this refactor.

I need to add a new model into the Prisma Schema called `AsanaPose`. It is an update of the `AsanaPosture` model. The `AsanaPosture` model will get deprecated, then later removed.

The app is in production so this might be complicated. Some data has already been entered into the `AsanaPosture` schema. In the `AsanaPose` model some of the fields have been added, removed, and/or renamed. The data might not be compatible because it must be transformed, depending its compatibility, like string into an array or vice versa.

This change is preparation for the soar app to start showing three levels of details to the user. See level options below.

“Full”, Abbreviated Posture 1
“Advance”, Abbreviated Posture 2
“Personal”, Abbreviated Posture 3

It is out of scope to display this new data. The current goal is to migrate, by copy, the current 'AsanaPosture`model data into the new`AsanaPose` model.

Workspace: Sure, here's a proposed directory structure for a project app:
Sorry — I can only provide file tree directory structures. Please ask for a proposed directory structure for this refactor.

Trewaters: Create a PRD for this refactor.

I need to add a new model into the Prisma Schema called `AsanaPose`. It is an update of the `AsanaPosture` model. The `AsanaPosture` model will get deprecated, then later removed.

The app is in production so this might be complicated. Some data has already been entered into the `AsanaPosture` schema. In the `AsanaPose` model some of the fields have been added, removed, and/or renamed. The data might not be compatible because it must be transformed, depending its compatibility, like string into an array or vice versa.

This change is preparation for the soar app to start showing three levels of details to the user. See level options below.

“Full”, Abbreviated Posture 1
“Advance”, Abbreviated Posture 2
“Personal”, Abbreviated Posture 3

It is out of scope to display this new data. The current goal is to migrate, by copy, the current 'AsanaPosture`model data into the new`AsanaPose` model.

Workspace: oring

## Overview

This PRD outlines the migration from the existing `AsanaPosture` model to a new `AsanaPose` model in the Soar yoga application. This refactoring prepares the application for three-tier posture detail levels while ensuring zero data loss and maintaining backward compatibility during the transition period.

## Problem Statement

The current `AsanaPosture` model lacks the structure to support tiered posture information (Full, Advance, Personal levels). Additionally, some field names and data types need refinement to better represent yoga domain concepts. With production data already in the system, a safe migration strategy is required to transform and preserve existing user data while enabling future feature development.

## Target Users

- **Yoga Practitioners**: Existing users with saved asana data in `AsanaPosture`
- **Development Team**: Engineers implementing the migration and future tiered detail features
- **Database Administrators**: Managing data integrity during migration
- **System Administrators**: Monitoring production database operations

## Scope

### In-Scope

- Create new `AsanaPose` Prisma model with updated field structure
- Maintain `AsanaPosture` model as deprecated during transition period
- Develop data migration script to copy and transform `AsanaPosture` data to `AsanaPose`
- Handle field renaming and data type transformations (string ↔ array conversions)
- Preserve all existing user-created asana data
- Maintain relationships with `AsanaActivity` and `PoseImage` models for both models during transition
- Add field annotations indicating tier level (Full/Advance/Personal) for future reference
- Create migration rollback strategy for production safety
- Document deprecated fields with replacement mapping

### Out-of-Scope

- Displaying tiered posture details (Full/Advance/Personal) in the UI
- Removing the `AsanaPosture` model from the schema (future phase)
- Updating frontend components to use `AsanaPose` instead of `AsanaPosture`
- Creating new API endpoints for `AsanaPose` CRUD operations
- Modifying existing yoga practice workflows to leverage tiered details
- User-facing notifications about data migration

## Functional Requirements

### Core Functionality

1. **New AsanaPose Model Creation**

   - Define `AsanaPose` model in Prisma schema with all updated fields
   - Organize fields by tier level using comments (Full/Advance/Personal)
   - Support for multiple Sanskrit names and English name variations
   - Enhanced image handling through existing `PoseImage` relationship
   - Maintain unique constraint on `sort_english_name` for routing consistency

2. **Field Mapping and Transformation Logic**

   - Map `AsanaPosture` fields to corresponding `AsanaPose` fields
   - Transform string fields to arrays where data structure changed (e.g., `variations` → `pose_variations`)
   - Transform array fields to strings where data structure changed
   - Handle JSON serialization for `sanskrit_names` field
   - Preserve boolean flags and metadata fields
   - Default new fields to appropriate empty values (empty arrays, null)

3. **Data Migration Script**

   - Read all existing `AsanaPosture` records from MongoDB
   - Transform each record to `AsanaPose` format using field mapping
   - Validate transformed data before insertion
   - Insert transformed records into `AsanaPose` collection
   - Maintain referential integrity for user-created asanas (`created_by`, `isUserCreated`)
   - Preserve timestamps (`created_on`, `updated_on`)

4. **Relationship Migration**
   - Duplicate `AsanaActivity` relationships to point to both old and new models during transition
   - Maintain `PoseImage` relationships for both models
   - Ensure user-created asanas retain ownership information

### Data Transformation Requirements

#### Field Renaming Map

| AsanaPosture Field         | AsanaPose Field      | Transformation Required                 |
| -------------------------- | -------------------- | --------------------------------------- |
| `english_names`            | `english_names`      | None (same structure)                   |
| `sanskrit_names`           | `sanskrit_names`     | None (same JSON structure)              |
| `sort_english_name`        | `sort_english_name`  | None                                    |
| `description`              | `description`        | None                                    |
| `benefits`                 | `benefits`           | None                                    |
| `category`                 | `category`           | None                                    |
| `difficulty`               | `difficulty`         | None                                    |
| `lore`                     | `lore`               | None                                    |
| `breath_direction_default` | _DEPRECATED_         | Map to new `breath` array               |
| `dristi`                   | `dristi`             | None                                    |
| `variations`               | `pose_variations`    | Rename field                            |
| `modifications`            | `pose_modifications` | Rename field                            |
| `posture_intent`           | `asana_intention`    | Rename field                            |
| `breath_series`            | `breath`             | Rename field                            |
| `duration_asana`           | `duration_asana`     | None                                    |
| `image`                    | _DEPRECATED_         | Use `poseImages` relationship           |
| `acitivity_completed`      | `activity_completed` | Fix typo                                |
| `acitivity_practice`       | `activity_practice`  | Fix typo                                |
| `sideways`                 | _DEPRECATED_         | Functionality moved to `alignment_cues` |
| `preferred_side`           | _DEPRECATED_         | Functionality moved to `alignment_cues` |

#### New Fields in AsanaPose

- `alternative_english_names: String[]` - Additional English name variations
- `alignment_cues: String?` - Posture alignment instructions (Advance tier)
- `joint_action: String?` - Joint movement description (Advance tier)
- `muscle_action: String?` - Muscle engagement description (Advance tier)

### Integration Requirements

- **Prisma Schema Updates**: Add `AsanaPose` model, mark `AsanaPosture` as deprecated
- **Database Migration**: Run Prisma migration to create new collection
- **Data Transfer Script**: Node.js script using Prisma client for data transformation
- **Validation Logic**: Ensure data integrity before and after migration
- **Rollback Strategy**: Backup current `AsanaPosture` data before migration

## User Stories

### Primary User Stories

**As a** Database Administrator  
**I want** to migrate existing asana data to the new schema without data loss  
**So that** users retain all their yoga pose information and history

**Acceptance Criteria:**

- [ ] All `AsanaPosture` records successfully copied to `AsanaPose`
- [ ] Field transformations applied correctly (renames, type conversions)
- [ ] No data loss during migration process
- [ ] User-created asanas maintain ownership and metadata
- [ ] Migration script includes validation and error handling
- [ ] Rollback capability available if migration fails

**As a** Developer  
**I want** clear field mapping documentation between old and new models  
**So that** I can correctly update application code to use `AsanaPose`

**Acceptance Criteria:**

- [ ] Field mapping table documented in migration script and PRD
- [ ] Deprecated fields clearly marked with comments in schema
- [ ] New field descriptions include tier level annotations
- [ ] Code comments explain transformation logic

**As a** Yoga Practitioner  
**I want** my saved asanas to continue working after the migration  
**So that** I can access my practice history and custom poses without interruption

**Acceptance Criteria:**

- [ ] Existing asana references in `AsanaActivity` remain valid
- [ ] Custom user-created asanas preserved with all metadata
- [ ] Pose images remain associated with migrated asanas
- [ ] No user-facing disruption during migration

### Secondary User Stories

**As a** System Administrator  
**I want** comprehensive migration logs and validation reports  
**So that** I can verify data integrity and troubleshoot any issues

**Acceptance Criteria:**

- [ ] Migration script logs all operations with timestamps
- [ ] Validation report shows record counts and transformation success rate
- [ ] Error handling captures and reports any failed transformations
- [ ] Summary report compares `AsanaPosture` and `AsanaPose` data counts

## Technical Requirements

### Frontend Requirements

- **No immediate frontend changes required** (out of scope for this phase)
- Existing components continue using `AsanaPosture` during transition
- Future PRD will address frontend migration to `AsanaPose`

### Backend Requirements

#### Prisma Schema Changes

```prisma
/// Represents a yoga Asana in the app - NEW MODEL
model AsanaPose {
  id                        String  @id @default(auto()) @map("_id") @db.ObjectId
  sort_english_name         String @unique // Unique name for routing
  sanskrit_names            Json? // Multiple Sanskrit variations
  english_names             String[] // Primary English names
  alternative_english_names String[] // Additional English variations
  poseImages                PoseImage[] // Relation to PoseImage

  // Full Tier Fields (Abbreviated Posture 1)
  description               String?
  category                  String?
  difficulty                String?
  activity_completed        Boolean?
  activity_practice         Boolean?
  dristi                    String?
  setup_cues                String?
  deepening_cues            String?

  // Advance Tier Fields (Abbreviated Posture 2)
  alignment_cues            String?
  joint_action              String?
  muscle_action             String?
  transition_cues_out       String?
  transition_cues_in        String?
  additional_cues           String?
  benefits                  String?
  customize_asana           String?

  // Personal Tier Fields (Abbreviated Posture 3)
  pose_modifications        String[]
  pose_variations           String[]
  breath                    String[] // Renamed from breath_series
  duration_asana            String?
  lore                      String?
  asana_intention           String? // Renamed from posture_intent

  // Metadata
  label                     String?
  suggested_postures        String[]
  preparatory_postures      String[]
  isUserCreated             Boolean @default(false)
  created_on                DateTime? @default(now())
  updated_on                DateTime? @updatedAt
  created_by                String?
  imageCount                Int @default(0)

  asanaActivities           AsanaActivity[] // Relation to AsanaActivity
}

/// DEPRECATED: Use AsanaPose instead
model AsanaPosture {
  // ... existing fields remain unchanged ...
  // This model will be removed in a future migration
}
```

#### Migration Script Requirements

```typescript
// Migration script structure
async function migrateAsanaPostureToAsanaPose() {
  // 1. Fetch all AsanaPosture records
  // 2. Transform each record to AsanaPose format
  // 3. Validate transformed data
  // 4. Insert into AsanaPose collection
  // 5. Log results and validation report
  // 6. Handle errors with rollback capability
}
```

**Key Migration Logic:**

- Handle field renames programmatically
- Convert single values to arrays where needed
- Preserve all metadata and timestamps
- Validate data integrity before and after transformation
- Generate comprehensive migration report

### Data Requirements

#### Data Models and Structures

**AsanaPose Data Model:**

- Supports tiered detail levels through field organization
- Multiple name variations (Sanskrit and English)
- Enhanced cue system (setup, deepening, alignment, transition)
- Flexible image handling through `PoseImage` relationship
- User ownership tracking for custom asanas

**Data Validation Rules:**

- `sort_english_name` must be unique across all AsanaPose records
- At least one English name required in `english_names` array
- User-created asanas must have `created_by` and `isUserCreated=true`
- Timestamps must be preserved from original records
- Image relationships must maintain referential integrity

#### Migration Requirements

**Pre-Migration:**

- Backup entire `AsanaPosture` collection
- Validate current data integrity
- Estimate migration time based on record count
- Schedule migration during low-traffic period

**During Migration:**

- Lock `AsanaPosture` writes if possible (or accept eventual consistency)
- Process records in batches to manage memory
- Log progress and errors in real-time
- Validate each batch before committing

**Post-Migration:**

- Compare record counts between old and new models
- Validate sample records for data accuracy
- Check relationship integrity with `AsanaActivity` and `PoseImage`
- Generate comprehensive migration report
- Retain `AsanaPosture` data for rollback capability

## Success Criteria

### User Experience Metrics

- **Zero Data Loss**: 100% of `AsanaPosture` records successfully migrated to `AsanaPose`
- **Relationship Integrity**: All asana relationships maintained with activities and images
- **User Access**: No disruption to user access of yoga pose data during or after migration
- **Validation Success**: All transformed records pass data integrity checks

### Technical Metrics

- **Migration Performance**: Migration completes within acceptable time window (< 30 minutes for production database size)
- **Error Rate**: Less than 0.1% error rate in data transformation
- **Schema Generation**: Prisma successfully generates client code for new model
- **Rollback Capability**: Backup strategy enables full rollback within 15 minutes if needed

## Dependencies

### Internal Dependencies

- **Prisma ORM**: Schema migration and client generation
- **MongoDB Database**: Production database access for migration
- **Existing Models**: `AsanaActivity`, `PoseImage`, `UserData` relationships
- **AsanaPosture Data**: Current production data as migration source

### External Dependencies

- **Database Backup System**: Pre-migration backup creation
- **Monitoring Tools**: Real-time migration progress tracking
- **Environment Variables**: Database connection strings for migration script

## Risks and Considerations

### Technical Risks

- **Data Type Mismatches**: String-to-array or array-to-string conversions may lose data if not handled correctly
  - _Mitigation_: Comprehensive validation before and after each transformation
- **Migration Duration**: Large dataset may cause extended migration time
  - _Mitigation_: Batch processing and progress logging; schedule during low-traffic period
- **Relationship Breakage**: Foreign key relationships could break if IDs don't transfer correctly
  - _Mitigation_: Preserve original IDs; validate relationships post-migration
- **Schema Generation Conflicts**: Prisma may have issues with dual similar models
  - _Mitigation_: Clear deprecation comments; test schema generation before production migration

### User Experience Risks

- **Production Downtime**: Migration may require temporary write locks
  - _Mitigation_: Minimize migration window; communicate maintenance if needed
- **Data Inconsistency**: New records created during migration may be missed
  - _Mitigation_: Final sweep for records created during migration window; implement timestamp-based validation

### Database Performance Risks

- **Resource Consumption**: Large batch operations may impact database performance
  - _Mitigation_: Throttle batch sizes; monitor database metrics during migration
- **Index Rebuilding**: New unique indexes may take time to build
  - _Mitigation_: Pre-create indexes before bulk insert; verify index performance post-migration

## Implementation Notes

### File Structure Impact

**Expected New Files:**

- `prisma/migrations/[timestamp]_create_asana_pose_model/` - Prisma migration files
- `scripts/migrate-asana-posture-to-pose.ts` - Data migration script
- `scripts/utils/asana-data-transformer.ts` - Field transformation logic
- `scripts/utils/migration-validator.ts` - Pre and post-migration validation

**Existing Files to Modify:**

- `prisma/schema.prisma` - Add `AsanaPose` model, deprecate `AsanaPosture`
- `prisma/seed.ts` - Update to seed both models during transition period (if applicable)

### Testing Strategy

#### Unit Testing Requirements

- **Data Transformer Tests**: Validate each field transformation function
  - Test string-to-array conversions
  - Test field renaming logic
  - Test preservation of timestamps and metadata
  - Test handling of null/undefined values
- **Validation Logic Tests**: Verify data integrity checks
  - Test unique constraint validation
  - Test relationship integrity checks
  - Test required field validation

#### Integration Testing Needs

- **Migration Script Tests**: Test full migration on sample dataset
  - Use test database with realistic `AsanaPosture` data
  - Verify record count matching
  - Verify data accuracy in migrated records
  - Test rollback procedure
- **Relationship Tests**: Verify `AsanaActivity` and `PoseImage` relationships work with both models
- **Prisma Client Tests**: Verify generated client code works for `AsanaPose` CRUD operations

#### User Acceptance Testing Criteria

- Migration script successfully runs on staging database
- Validation report shows 100% data transfer accuracy
- Sample queries against `AsanaPose` return expected results
- Existing `AsanaPosture` queries continue to work during transition period
- Database performance metrics remain within acceptable ranges

### Migration Execution Plan

1. **Pre-Migration Phase** (Dev/Staging)

   - Create `AsanaPose` model in schema
   - Generate and test Prisma migration
   - Develop and test data migration script on test database
   - Validate transformation logic with sample data
   - Create rollback procedure documentation

2. **Migration Phase** (Production)

   - Schedule maintenance window (if needed)
   - Create full database backup
   - Run Prisma schema migration to create `AsanaPose` collection
   - Execute data migration script with logging
   - Monitor migration progress in real-time
   - Validate migrated data against source records

3. **Post-Migration Phase**

   - Generate and review migration report
   - Validate sample records manually
   - Check relationship integrity (activities, images)
   - Monitor application logs for errors
   - Verify database performance metrics
   - Document migration completion and results

4. **Deprecation Phase** (Future PRD)
   - Update application code to use `AsanaPose`
   - Deprecate `AsanaPosture` API endpoints
   - Remove `AsanaPosture` model from schema
   - Clean up deprecated data and relationships

## Future Considerations

### Potential Enhancements

- **Tiered Detail UI**: Display Full/Advance/Personal posture details based on user preferences
- **Progressive Disclosure**: Show basic details first, expand to advanced on request
- **User Customization**: Allow users to customize which tier fields they see
- **Import/Export**: Support tiered data in asana import/export functionality
- **Analytics**: Track which tier details users interact with most

### Scalability Considerations

- **Data Growth**: New tier structure increases data volume per asana
  - _Strategy_: Implement field-level lazy loading for tier data
- **Query Optimization**: Tiered fields may require selective field projection
  - _Strategy_: Create indexed views for common query patterns
- **Caching Strategy**: Tier data may benefit from different cache policies
  - _Strategy_: Cache Full tier data more aggressively than Personal tier

### Related Features to Consider

- **Asana Comparison Tool**: Compare poses across tier levels
- **Personalized Learning Paths**: Guide users through Full → Advance → Personal progression
- **Community Contributions**: Allow approved users to contribute to tier data
- **Tier-Based Search**: Filter asanas by tier-specific attributes
- **Accessibility Features**: Provide audio descriptions for each tier level

---

## Appendix: Detailed Field Mapping

### Complete Field Transformation Map

| Source Field (AsanaPosture) | Target Field (AsanaPose)    | Tier Level | Transformation Notes               |
| --------------------------- | --------------------------- | ---------- | ---------------------------------- |
| `id`                        | `id`                        | N/A        | Preserve original MongoDB ObjectId |
| `sort_english_name`         | `sort_english_name`         | Full       | No transformation                  |
| `sanskrit_names`            | `sanskrit_names`            | Full       | No transformation (already JSON)   |
| `english_names`             | `english_names`             | Full       | No transformation                  |
| N/A                         | `alternative_english_names` | Full       | Initialize as empty array          |
| `description`               | `description`               | Full       | No transformation                  |
| `category`                  | `category`                  | Full       | No transformation                  |
| `difficulty`                | `difficulty`                | Full       | No transformation                  |
| `acitivity_completed`       | `activity_completed`        | Full       | Fix typo in field name             |
| `acitivity_practice`        | `activity_practice`         | Full       | Fix typo in field name             |
| `dristi`                    | `dristi`                    | Full       | No transformation                  |
| `setup_cues`                | `setup_cues`                | Full       | No transformation                  |
| `deepening_cues`            | `deepening_cues`            | Full       | No transformation                  |
| N/A                         | `alignment_cues`            | Advance    | Initialize as null                 |
| `joint_action`              | `joint_action`              | Advance    | No transformation                  |
| `muscle_action`             | `muscle_action`             | Advance    | No transformation                  |
| `transition_cues_out`       | `transition_cues_out`       | Advance    | No transformation                  |
| `transition_cues_in`        | `transition_cues_in`        | Advance    | No transformation                  |
| `additional_cues`           | `additional_cues`           | Advance    | No transformation                  |
| `benefits`                  | `benefits`                  | Advance    | No transformation                  |
| `customize_asana`           | `customize_asana`           | Advance    | No transformation                  |
| `modifications`             | `pose_modifications`        | Personal   | Rename field                       |
| `variations`                | `pose_variations`           | Personal   | Rename field                       |
| `breath_series`             | `breath`                    | Personal   | Rename field                       |
| `duration_asana`            | `duration_asana`            | Personal   | No transformation                  |
| `lore`                      | `lore`                      | Personal   | No transformation                  |
| `posture_intent`            | `asana_intention`           | Personal   | Rename field                       |
| `label`                     | `label`                     | Metadata   | No transformation                  |
| `suggested_postures`        | `suggested_postures`        | Metadata   | No transformation                  |
| `preparatory_postures`      | `preparatory_postures`      | Metadata   | No transformation                  |
| `isUserCreated`             | `isUserCreated`             | Metadata   | No transformation                  |
| `created_on`                | `created_on`                | Metadata   | Preserve timestamp                 |
| `updated_on`                | `updated_on`                | Metadata   | Preserve timestamp                 |
| `created_by`                | `created_by`                | Metadata   | No transformation                  |
| `imageCount`                | `imageCount`                | Metadata   | No transformation                  |

### Deprecated Fields (Not Migrated)

| Deprecated Field           | Reason                      | Replacement Strategy             |
| -------------------------- | --------------------------- | -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `image`                    | Single image limitation     | Use `poseImages` relationship    |
| `breath_direction_default` | Replaced by array structure | Migrate to `breath` array        |
| `sideways`                 | Functionality moved         | Include in `alignment_cues` text |
| `preferred_side`           | Functionality moved         | Include in `alignment_cues` text | Sure, here is the file you requested:[undefined](command:github.copilot.openFile?%5B%7B%22value%22%3A%5B%7B%22name%22%3A%22undefined%22%7D%5D%2C%22baseUri%22%3A%7B%22%24mid%22%3A1%2C%22path%22%3A%22%2Fundefined%22%2C%22scheme%22%3A%22vscode-copilot-file%22%2C%22authority%22%3A%220afe0a90-886c-4658-8f8b-c47d5ed3a5fc%22%7D%7D%5D) |

Create File...

Trewaters: create this PRD as a markdown file per attached instructions

GitHub Copilot: I'll create a comprehensive PRD for the AsanaPosture to AsanaPose migration refactor. Let me analyze the schema and create the document following the established patterns.

`````markdown
# PRD: AsanaPosture to AsanaPose Data Migration

## Overview

This PRD outlines the migration strategy from the deprecated `AsanaPosture` model to the new `AsanaPose` model in the Soar yoga application. The migration introduces a tiered detail system (Full, Advance, Personal) to better serve yoga practitioners at different experience levels while ensuring zero data loss during the production database transition.

## Problem Statement

The current `AsanaPosture` model lacks the organizational structure to support tiered yoga instruction details. Field names need refinement to better represent yoga domain concepts, and some data types require transformation to support enhanced functionality. With production data already in the system, a safe migration strategy is critical to:

- Transform and preserve all existing yoga pose data
- Enable future three-tier detail display (Full, Advance, Personal)
- Improve field naming conventions and data structures
- Maintain backward compatibility during the transition period

## Target Users

- **Yoga Practitioners**: Users with existing asana data and practice history
- **Yoga Instructors**: Content creators with custom poses and sequences
- **Development Team**: Engineers implementing migration and future tiered features
- **Database Administrators**: Managing production data integrity during migration
- **System Administrators**: Monitoring database operations and performance

## Scope

### In-Scope

- Create new `AsanaPose` Prisma model with tiered field organization
- Maintain `AsanaPosture` model as deprecated during transition period
- Develop comprehensive data migration script to copy and transform data
- Handle field renaming, data type transformations (string ↔ array)
- Preserve all existing user-created asana data and metadata
- Maintain relationships with `AsanaActivity` and `PoseImage` models for both schemas
- Add field tier annotations (Full/Advance/Personal) for future reference
- Create migration rollback strategy for production safety
- Document deprecated fields with replacement field mapping
- Validate data integrity before and after migration
- Generate comprehensive migration report

### Out-of-Scope

- Displaying tiered posture details (Full/Advance/Personal) in the UI
- Removing the `AsanaPosture` model from schema (future phase)
- Updating frontend components to consume `AsanaPose` data
- Creating new API endpoints for `AsanaPose` CRUD operations
- Modifying existing yoga practice workflows to use new model
- User-facing notifications about backend data migration
- Performance optimization of tiered data queries
- Implementing tier-based filtering or search functionality

## Functional Requirements

### Core Functionality

1. **AsanaPose Model Creation**

   - Define `AsanaPose` model in Prisma schema with all updated fields
   - Organize fields by tier level using comments (Full/Advance/Personal)
   - Support multiple Sanskrit names via JSON structure
   - Support multiple English name variations via arrays
   - Maintain enhanced image handling through `PoseImage` relationship
   - Preserve unique constraint on `sort_english_name` for routing consistency
   - Include all metadata fields (timestamps, user ownership, image count)

2. **Field Mapping and Transformation Logic**

   - Map `AsanaPosture` fields to corresponding `AsanaPose` fields
   - Transform deprecated field names to new naming conventions
   - Handle data type conversions (string to array, array to string)
   - Preserve JSON structures for `sanskrit_names` field
   - Default new fields to appropriate empty values ([], null)
   - Maintain backward compatibility with legacy fields during transition

3. **Data Migration Script**

   - Read all existing `AsanaPosture` records from MongoDB
   - Transform each record to `AsanaPose` format using field mapping
   - Validate transformed data before database insertion
   - Insert transformed records into `AsanaPose` collection
   - Maintain referential integrity for user-created asanas
   - Preserve all timestamps (`created_on`, `updated_on`)
   - Handle errors gracefully with detailed logging
   - Generate migration success/failure report

4. **Relationship Preservation**
   - Duplicate `AsanaActivity` relationships to point to both models during transition
   - Maintain `PoseImage` relationships for both `AsanaPosture` and `AsanaPose`
   - Ensure user-created asanas retain ownership (`created_by`, `isUserCreated`)
   - Preserve image count metadata for performance optimization

### Data Transformation Requirements

#### Field Renaming Map

| AsanaPosture Field     | AsanaPose Field        | Tier Level | Transformation Notes     |
| ---------------------- | ---------------------- | ---------- | ------------------------ |
| `english_names`        | `english_names`        | Full       | No transformation        |
| `sanskrit_names`       | `sanskrit_names`       | Full       | No transformation (JSON) |
| `sort_english_name`    | `sort_english_name`    | Full       | No transformation        |
| `description`          | `description`          | Full       | No transformation        |
| `category`             | `category`             | Full       | No transformation        |
| `difficulty`           | `difficulty`           | Full       | No transformation        |
| `dristi`               | `dristi`               | Full       | No transformation        |
| `acitivity_completed`  | `activity_completed`   | Full       | Fix typo in field name   |
| `acitivity_practice`   | `activity_practice`    | Full       | Fix typo in field name   |
| `setup_cues`           | `setup_cues`           | Full       | No transformation        |
| `deepening_cues`       | `deepening_cues`       | Full       | No transformation        |
| `benefits`             | `benefits`             | Advance    | No transformation        |
| `joint_action`         | `joint_action`         | Advance    | No transformation        |
| `muscle_action`        | `muscle_action`        | Advance    | No transformation        |
| `transition_cues_out`  | `transition_cues_out`  | Advance    | No transformation        |
| `transition_cues_in`   | `transition_cues_in`   | Advance    | No transformation        |
| `additional_cues`      | `additional_cues`      | Advance    | No transformation        |
| `customize_asana`      | `customize_asana`      | Advance    | No transformation        |
| `variations`           | `pose_variations`      | Personal   | Rename field             |
| `modifications`        | `pose_modifications`   | Personal   | Rename field             |
| `breath_series`        | `breath`               | Personal   | Rename field             |
| `duration_asana`       | `duration_asana`       | Personal   | No transformation        |
| `lore`                 | `lore`                 | Personal   | No transformation        |
| `posture_intent`       | `asana_intention`      | Personal   | Rename field             |
| `label`                | `label`                | Metadata   | No transformation        |
| `suggested_postures`   | `suggested_postures`   | Metadata   | No transformation        |
| `preparatory_postures` | `preparatory_postures` | Metadata   | No transformation        |
| `isUserCreated`        | `isUserCreated`        | Metadata   | No transformation        |
| `created_on`           | `created_on`           | Metadata   | Preserve timestamp       |
| `updated_on`           | `updated_on`           | Metadata   | Preserve timestamp       |
| `created_by`           | `created_by`           | Metadata   | No transformation        |
| `imageCount`           | `imageCount`           | Metadata   | No transformation        |

#### New Fields in AsanaPose (Not in AsanaPosture)

- `alternative_english_names: String[]` - Initialize as empty array
- `alignment_cues: String?` - Initialize as null (Advance tier)

#### Deprecated Fields (Not Migrated to AsanaPose)

- `image: String?` - Replaced by `poseImages` relationship
- `breath_direction_default: String?` - Replaced by `breath` array
- `sort_sanskrit_name: String?` - Replaced by `sanskrit_names` JSON
- `sideways: Boolean?` - Functionality moved to `alignment_cues`
- `preferred_side: String?` - Functionality moved to `alignment_cues`

### Integration Requirements

- **Prisma Schema Updates**: Add `AsanaPose` model, annotate `AsanaPosture` as deprecated
- **Database Migration**: Generate and run Prisma migration to create new collection
- **Data Transfer Script**: Node.js script using Prisma client for transformation
- **Validation Logic**: Pre and post-migration data integrity checks
- **Rollback Strategy**: Database backup and rollback procedure documentation

## User Stories

### Primary User Stories

**As a** Database Administrator  
**I want** to migrate existing asana data to the new schema without data loss  
**So that** practitioners retain all their yoga pose information and practice history

**Acceptance Criteria:**

- [ ] All `AsanaPosture` records successfully copied to `AsanaPose`
- [ ] Field transformations applied correctly (renames, type conversions)
- [ ] No data loss during migration process
- [ ] User-created asanas maintain ownership and metadata
- [ ] Migration script includes comprehensive error handling
- [ ] Rollback capability available if migration fails
- [ ] Migration report generated with success/failure statistics

**As a** Developer  
**I want** clear field mapping documentation between old and new models  
**So that** I can correctly update application code to use `AsanaPose` in future phases

**Acceptance Criteria:**

- [ ] Field mapping table documented in migration script and PRD
- [ ] Deprecated fields clearly marked with comments in schema
- [ ] New field descriptions include tier level annotations (Full/Advance/Personal)
- [ ] Code comments explain transformation logic for each field
- [ ] Migration script serves as reference for future developers

**As a** Yoga Practitioner  
**I want** my saved asanas to continue working after the backend migration  
**So that** I can access my practice history and custom poses without interruption

**Acceptance Criteria:**

- [ ] Existing asana references in `AsanaActivity` remain valid during transition
- [ ] Custom user-created asanas preserved with all metadata
- [ ] Pose images remain associated with migrated asanas
- [ ] No user-facing disruption or downtime during migration
- [ ] Practice history and activity logs remain intact

### Secondary User Stories

**As a** System Administrator  
**I want** comprehensive migration logs and validation reports  
**So that** I can verify data integrity and troubleshoot any issues

**Acceptance Criteria:**

- [ ] Migration script logs all operations with timestamps
- [ ] Validation report shows record counts and transformation success rates
- [ ] Error handling captures and reports any failed transformations
- [ ] Summary report compares `AsanaPosture` and `AsanaPose` data counts
- [ ] Detailed logs available for audit and debugging

**As a** Yoga Instructor  
**I want** my custom yoga poses to be preserved with enhanced metadata  
**So that** I can continue creating personalized content for my students

**Acceptance Criteria:**

- [ ] All custom poses migrated with `created_by` email preserved
- [ ] `isUserCreated` flag maintained for user-generated content
- [ ] Image associations preserved through `PoseImage` relationship
- [ ] Sanskrit names and terminology preserved accurately

## Technical Requirements

### Frontend Requirements

- **No immediate frontend changes required** (out of scope for this phase)
- Existing components continue using `AsanaPosture` during transition
- Future PRD will address frontend migration to `AsanaPose`

### Backend Requirements

#### Prisma Schema Changes

The new `AsanaPose` model includes:

**Full Tier Fields (Abbreviated Posture 1):**

- `sort_english_name` - Unique routing identifier
- `sanskrit_names` - JSON for multiple Sanskrit variations
- `english_names` - Array of primary English names
- `alternative_english_names` - Additional name variations
- `description`, `category`, `difficulty` - Core pose metadata
- `activity_completed`, `activity_practice` - Practice tracking flags
- `dristi`, `setup_cues`, `deepening_cues` - Basic instruction

**Advance Tier Fields (Abbreviated Posture 2):**

- `alignment_cues` - Detailed alignment instructions
- `joint_action` - Joint movement descriptions
- `muscle_action` - Muscle engagement details
- `transition_cues_in`, `transition_cues_out` - Flow transitions
- `additional_cues` - Supplementary instruction
- `benefits` - Pose benefits and effects
- `customize_asana` - Customization options

**Personal Tier Fields (Abbreviated Posture 3):**

- `pose_modifications` - Personal modifications array
- `pose_variations` - Pose variation options array
- `breath` - Breath pattern array
- `duration_asana` - Recommended duration
- `lore` - Cultural and historical context
- `asana_intention` - Personal intention setting

**Metadata Fields:**

- `label`, `suggested_postures`, `preparatory_postures`
- `isUserCreated`, `created_by` - Ownership tracking
- `created_on`, `updated_on` - Timestamps
- `imageCount` - Performance optimization cache

**Relationships:**

- `poseImages: PoseImage[]` - Multiple image support
- `asanaActivities: AsanaActivity[]` - Practice history

#### Migration Script Requirements

```typescript
// Migration script structure
async function migrateAsanaPostureToAsanaPose() {
  try {
    // 1. Backup AsanaPosture collection
    // 2. Fetch all AsanaPosture records
    const asanaPostures = await prisma.asanaPosture.findMany()

    // 3. Transform each record to AsanaPose format
    const transformedPoses = asanaPostures.map((posture) => ({
      // Field mapping with transformations
      id: posture.id,
      sort_english_name: posture.sort_english_name,
      sanskrit_names: posture.sanskrit_names,
      english_names: posture.english_names,
      alternative_english_names: [], // New field - empty array
      description: posture.description,
      category: posture.category,
      difficulty: posture.difficulty,

      // Fix typos
      activity_completed: posture.acitivity_completed,
      activity_practice: posture.acitivity_practice,

      // Advance tier
      alignment_cues: null, // New field
      joint_action: posture.joint_action,
      muscle_action: posture.muscle_action,
      benefits: posture.benefits,

      // Personal tier - renamed fields
      pose_variations: posture.variations,
      pose_modifications: posture.modifications,
      breath: posture.breath_series,
      asana_intention: posture.posture_intent,

      // Metadata
      created_on: posture.created_on,
      updated_on: posture.updated_on,
      created_by: posture.created_by,
      isUserCreated: posture.isUserCreated,
      imageCount: posture.imageCount,

      // ... all other fields
    }))

    // 4. Validate transformed data
    const validationResults = validateTransformedData(transformedPoses)

    // 5. Insert into AsanaPose collection (batch processing)
    const batchSize = 100
    for (let i = 0; i < transformedPoses.length; i += batchSize) {
      const batch = transformedPoses.slice(i, i + batchSize)
      await prisma.asanaPose.createMany({ data: batch })
    }

    // 6. Generate migration report
    const report = generateMigrationReport(
      asanaPostures.length,
      transformedPoses.length,
      validationResults
    )

    // 7. Log results
    console.log('Migration completed successfully:', report)
  } catch (error) {
    console.error('Migration failed:', error)
    // Rollback procedure
    await rollbackMigration()
  }
}
```
`````

**Key Migration Logic:**

- Batch processing for large datasets (100 records per batch)
- Field renaming automation (`variations` → `pose_variations`)
- Type conversion handling where needed
- Timestamp preservation
- Error handling with rollback capability
- Comprehensive logging and reporting

### Data Requirements

#### Data Models and Structures

**AsanaPose Data Validation Rules:**

- `sort_english_name` must be unique across all AsanaPose records
- At least one English name required in `english_names` array
- User-created asanas must have `created_by` and `isUserCreated=true`
- Timestamps must be preserved from original `AsanaPosture` records
- Image relationships must maintain referential integrity with `PoseImage`
- Sanskrit names should be valid JSON structure

#### Migration Requirements

**Pre-Migration:**

- Full backup of `AsanaPosture` collection via MongoDB export
- Validate current data integrity (check for orphaned records, invalid relationships)
- Estimate migration time based on production record count
- Schedule migration during low-traffic period (late night/early morning)
- Notify team of migration window

**During Migration:**

- Process records in batches to manage memory (100 records/batch)
- Log progress and errors in real-time to file
- Validate each batch before committing to database
- Monitor database performance metrics
- Accept eventual consistency for new records created during migration

**Post-Migration:**

- Compare record counts: `AsanaPosture` vs `AsanaPose`
- Validate random sample of records for data accuracy (10% sample)
- Check relationship integrity with `AsanaActivity` and `PoseImage`
- Generate comprehensive migration report with statistics
- Retain `AsanaPosture` data for 30 days for rollback capability
- Update schema comments to mark `AsanaPosture` as deprecated

## Success Criteria

### User Experience Metrics

- **Zero Data Loss**: 100% of `AsanaPosture` records successfully migrated to `AsanaPose`
- **Relationship Integrity**: All asana relationships maintained with activities and images
- **User Access**: No disruption to user access of yoga pose data during or after migration
- **Validation Success**: All transformed records pass data integrity checks
- **Performance**: No degradation in query performance for yoga pose lookups

### Technical Metrics

- **Migration Performance**: Migration completes within 30 minutes for production database
- **Error Rate**: Less than 0.1% error rate in data transformation
- **Schema Generation**: Prisma successfully generates client code for new `AsanaPose` model
- **Rollback Capability**: Backup strategy enables full rollback within 15 minutes if needed
- **Test Coverage**: Migration script has 90%+ unit test coverage

## Dependencies

### Internal Dependencies

- **Prisma ORM**: Schema migration and client generation (v5.x)
- **MongoDB Database**: Production database access for migration
- **Existing Models**: `AsanaActivity`, `PoseImage` relationships must remain intact
- **AsanaPosture Data**: Current production data as migration source
- **Soar Context Providers**: No immediate changes, future integration needed

### External Dependencies

- **Database Backup System**: MongoDB backup/restore capability
- **Monitoring Tools**: Real-time migration progress tracking (DataDog, CloudWatch, etc.)
- **Environment Variables**: `DATABASE_URL` for Prisma MongoDB connection
- **Node.js Runtime**: v18+ for migration script execution

## Risks and Considerations

### Technical Risks

- **Data Type Mismatches**: String-to-array conversions may lose formatting
  - _Mitigation_: Comprehensive validation; manual review of failed transformations
- **Migration Duration**: Large dataset (10,000+ poses) may extend migration window
  - _Mitigation_: Batch processing; schedule during lowest traffic period
- **Relationship Breakage**: Foreign key relationships could break if IDs don't transfer
  - _Mitigation_: Preserve original MongoDB ObjectIds; validate relationships post-migration
- **Schema Conflicts**: Prisma may have issues with dual similar models in schema
  - _Mitigation_: Clear deprecation comments; test schema generation on staging first
- **Memory Consumption**: Loading all records at once may cause memory issues
  - _Mitigation_: Batch processing with cursor-based pagination

### User Experience Risks

- **Production Downtime**: Migration may require temporary database locks
  - _Mitigation_: Minimize migration window to < 30 minutes; communicate maintenance if needed
- **Data Inconsistency**: New poses created during migration may be missed
  - _Mitigation_: Final sweep for records created during migration window with timestamp checks
- **Image Orphaning**: PoseImage relationships could be lost during migration
  - _Mitigation_: Verify image count matches before and after migration

### Database Performance Risks

- **Resource Consumption**: Large batch inserts may impact database performance
  - _Mitigation_: Throttle batch sizes; monitor CPU/memory during migration
- **Index Rebuilding**: New unique indexes on `sort_english_name` may take time
  - _Mitigation_: Pre-create indexes before bulk insert; verify index performance
- **Query Performance**: Dual model queries during transition may slow down app
  - _Mitigation_: Optimize indexes; consider read replicas for migration queries

### Rollback Considerations

- **Data Restoration**: May need to restore from backup if migration fails critically
  - _Mitigation_: Test restore procedure before migration; document rollback steps
- **Relationship Cleanup**: May need to clean up partial `AsanaPose` records on rollback
  - _Mitigation_: Transaction-based inserts where possible; cleanup script ready

## Implementation Notes

### File Structure Impact

**Expected New Files:**

- `prisma/migrations/[timestamp]_create_asana_pose_model/` - Prisma migration files
  - `migration.sql` - MongoDB migration commands
- `scripts/migration/migrate-asana-posture-to-pose.ts` - Main migration script
- `scripts/migration/utils/asana-data-transformer.ts` - Field transformation logic
- `scripts/migration/utils/migration-validator.ts` - Pre/post migration validation
- `scripts/migration/utils/rollback-handler.ts` - Rollback procedure
- `.github/migrations/migration-report-[date].md` - Migration results documentation

**Existing Files to Modify:**

- `prisma/schema.prisma` - Add `AsanaPose` model, deprecate `AsanaPosture` with comments
- `package.json` - Add migration script command: `"migrate:asana": "ts-node scripts/migration/migrate-asana-posture-to-pose.ts"`
- `.env.example` - Document any new environment variables needed for migration

**Files to Monitor (No Changes):**

- `app/context/AsanaPostureContext.tsx` - Will need update in future phase
- `app/api/asana/**` - API routes continue using `AsanaPosture` during transition
- `app/clientComponents/asana/**` - UI components unaffected in this phase

### Testing Strategy

#### Unit Testing Requirements

- **Data Transformer Tests**: Validate each field transformation function
  - Test string-to-array conversions (e.g., `breath_series` → `breath[]`)
  - Test field renaming logic (e.g., `variations` → `pose_variations`)
  - Test preservation of timestamps and metadata
  - Test handling of null/undefined values
  - Test typo corrections (`acitivity_*` → `activity_*`)
- **Validation Logic Tests**: Verify data integrity checks
  - Test unique constraint validation on `sort_english_name`
  - Test relationship integrity checks with `AsanaActivity` and `PoseImage`
  - Test required field validation
  - Test JSON structure validation for `sanskrit_names`

#### Integration Testing Needs

- **Migration Script Tests**: Test full migration on sample dataset
  - Use test database with realistic `AsanaPosture` seed data (100+ records)
  - Verify record count matching before and after migration
  - Verify data accuracy in randomly sampled migrated records
  - Test rollback procedure with partial migration
  - Test batch processing with various batch sizes
- **Relationship Tests**: Verify models work correctly together
  - Test `AsanaActivity` references work with both `AsanaPosture` and `AsanaPose`
  - Test `PoseImage` relationships maintain integrity
  - Verify user ownership tracking remains intact
- **Prisma Client Tests**: Verify generated client code
  - Test CRUD operations on `AsanaPose` model
  - Test unique constraints and indexes
  - Test relationship queries and eager loading

#### User Acceptance Testing Criteria

- Migration script successfully runs on staging database with production data copy
- Validation report shows 100% data transfer accuracy with detailed statistics
- Sample queries against `AsanaPose` return expected yoga pose data
- Existing `AsanaPosture` queries continue to work during transition period
- Database performance metrics (query time, CPU, memory) remain within acceptable ranges
- Random sample manual verification (50 poses) confirms data accuracy

### Migration Execution Plan

#### 1. Pre-Migration Phase (Dev/Staging - 1 week before production)

- [ ] Create `AsanaPose` model in schema with tier annotations
- [ ] Generate and test Prisma migration on development database
- [ ] Develop data migration script with comprehensive error handling
- [ ] Create unit tests for transformation logic (90%+ coverage)
- [ ] Validate transformation logic with 100+ sample records
- [ ] Create rollback procedure documentation and script
- [ ] Test migration on staging with production data snapshot
- [ ] Perform dry run and generate sample migration report
- [ ] Review migration plan with team
- [ ] Schedule production migration window

#### 2. Migration Phase (Production - Scheduled Window)

- [ ] Announce maintenance window to users (if needed)
- [ ] Create full MongoDB backup of production database
- [ ] Verify backup integrity and restoration capability
- [ ] Run Prisma schema migration to create `AsanaPose` collection
- [ ] Execute data migration script with real-time logging
- [ ] Monitor migration progress via dashboard/logs
- [ ] Validate migrated data against source records (automated checks)
- [ ] Generate comprehensive migration report
- [ ] Verify sample records manually (10% random sample)

#### 3. Post-Migration Phase (Immediate)

- [ ] Compare record counts: `AsanaPosture` (original) vs `AsanaPose` (migrated)
- [ ] Run validation queries to check data integrity
- [ ] Verify relationship integrity with `AsanaActivity` and `PoseImage`
- [ ] Check database performance metrics (query latency, throughput)
- [ ] Review migration logs for any errors or warnings
- [ ] Document migration completion with timestamp and statistics
- [ ] Update schema comments to mark `AsanaPosture` as `DEPRECATED`
- [ ] Monitor application logs for 24 hours post-migration
- [ ] Keep `AsanaPosture` data for 30-day rollback window

#### 4. Deprecation Phase (Future PRD - 30+ days after migration)

- [ ] Update application code to use `AsanaPose` instead of `AsanaPosture`
- [ ] Update API endpoints to serve `AsanaPose` data
- [ ] Update frontend components to consume new data structure
- [ ] Migrate context providers to use `AsanaPose`
- [ ] Update tests to use `AsanaPose` mocks
- [ ] Remove `AsanaPosture` model from schema
- [ ] Clean up deprecated data and relationships
- [ ] Update documentation to reflect new model usage

## Future Considerations

### Potential Enhancements

- **Tiered Detail UI Display**: Show Full/Advance/Personal details based on user skill level
  - Beginner users see Full tier only
  - Intermediate users see Full + Advance tiers
  - Advanced users see all three tiers
- **Progressive Disclosure Interface**: Expand/collapse tier sections on demand
  - Collapsible sections for each tier level
  - User preference for default expanded tiers
  - Smooth transitions between detail levels
- **User Customization**: Allow practitioners to customize tier visibility
  - Toggle individual tier sections on/off
  - Save tier preferences per user
  - Instructor override for class settings
- **Import/Export with Tiers**: Support tiered data in asana import/export
  - CSV/JSON export with tier column indicators
  - Import validation for tier-specific fields
  - Migration tools for external yoga databases
- **Analytics on Tier Usage**: Track which tier details users interact with most
  - Heat maps of tier engagement
  - User journey through tier levels
  - Insights for content improvement

### Scalability Considerations

- **Data Growth**: New tier structure increases data volume per asana (3x fields)
  - _Strategy_: Implement field-level lazy loading for tier data
  - _Strategy_: Use MongoDB projections to fetch only needed tiers
  - _Strategy_: Consider tier data sharding for large databases
- **Query Optimization**: Tiered fields may require selective field projection
  - _Strategy_: Create indexed views for common tier query patterns
  - _Strategy_: Implement caching layers for frequently accessed tiers
  - _Strategy_: Use GraphQL for flexible tier-based queries
- **Caching Strategy**: Different cache policies for different tiers
  - _Strategy_: Cache Full tier data aggressively (long TTL)
  - _Strategy_: Cache Personal tier minimally (user-specific, short TTL)
  - _Strategy_: Implement tier-aware cache invalidation

### Related Features to Consider

- **Asana Comparison Tool**: Compare poses across tier levels side-by-side
- **Personalized Learning Paths**: Guide users through Full → Advance → Personal progression
- **Community Tier Contributions**: Allow approved instructors to contribute Advance tier content
- **Tier-Based Search**: Filter asanas by tier-specific attributes (e.g., joint actions, alignment cues)
- **Accessibility Features**: Provide audio descriptions for each tier level
- **Multi-Language Tiers**: Translate tier content into multiple languages
- **AI-Generated Tiers**: Use AI to generate Advance tier content from Full tier data

---

## Appendix A: Complete Field Transformation Map

| Source Field (AsanaPosture) | Target Field (AsanaPose)    | Tier Level   | Data Type         | Transformation | Migration Notes                |
| --------------------------- | --------------------------- | ------------ | ----------------- | -------------- | ------------------------------ |
| `id`                        | `id`                        | N/A          | String (ObjectId) | Preserve       | Keep original MongoDB ObjectId |
| `sort_english_name`         | `sort_english_name`         | Full         | String            | None           | Unique constraint enforced     |
| `sanskrit_names`            | `sanskrit_names`            | Full         | Json              | None           | Already JSON structure         |
| `english_names`             | `english_names`             | Full         | String[]          | None           | Array of names                 |
| N/A                         | `alternative_english_names` | Full         | String[]          | Initialize     | Set to empty array []          |
| `description`               | `description`               | Full         | String?           | None           | Nullable field                 |
| `category`                  | `category`                  | Full         | String?           | None           | Nullable field                 |
| `difficulty`                | `difficulty`                | Full         | String?           | None           | Nullable field                 |
| `acitivity_completed`       | `activity_completed`        | Full         | Boolean?          | Fix typo       | Rename, preserve value         |
| `acitivity_practice`        | `activity_practice`         | Full         | Boolean?          | Fix typo       | Rename, preserve value         |
| `dristi`                    | `dristi`                    | Full         | String?           | None           | Nullable field                 |
| `setup_cues`                | `setup_cues`                | Full         | String?           | None           | Nullable field                 |
| `deepening_cues`            | `deepening_cues`            | Full         | String?           | None           | Nullable field                 |
| N/A                         | `alignment_cues`            | Advance      | String?           | Initialize     | Set to null                    |
| `joint_action`              | `joint_action`              | Advance      | String?           | None           | Nullable field                 |
| `muscle_action`             | `muscle_action`             | Advance      | String?           | None           | Nullable field                 |
| `transition_cues_out`       | `transition_cues_out`       | Advance      | String?           | None           | Nullable field                 |
| `transition_cues_in`        | `transition_cues_in`        | Advance      | String?           | None           | Nullable field                 |
| `additional_cues`           | `additional_cues`           | Advance      | String?           | None           | Nullable field                 |
| `benefits`                  | `benefits`                  | Advance      | String?           | None           | Nullable field                 |
| `customize_asana`           | `customize_asana`           | Advance      | String?           | None           | Nullable field                 |
| `modifications`             | `pose_modifications`        | Personal     | String[]          | Rename         | Field name change only         |
| `variations`                | `pose_variations`           | Personal     | String[]          | Rename         | Field name change only         |
| `breath_series`             | `breath`                    | Personal     | String[]          | Rename         | Field name change only         |
| `duration_asana`            | `duration_asana`            | Personal     | String?           | None           | Nullable field                 |
| `lore`                      | `lore`                      | Personal     | String?           | None           | Nullable field                 |
| `posture_intent`            | `asana_intention`           | Personal     | String?           | Rename         | Field name change only         |
| `label`                     | `label`                     | Metadata     | String?           | None           | Nullable field                 |
| `suggested_postures`        | `suggested_postures`        | Metadata     | String[]          | None           | Array field                    |
| `preparatory_postures`      | `preparatory_postures`      | Metadata     | String[]          | None           | Array field                    |
| `isUserCreated`             | `isUserCreated`             | Metadata     | Boolean           | None           | Default false                  |
| `created_on`                | `created_on`                | Metadata     | DateTime?         | Preserve       | Keep original timestamp        |
| `updated_on`                | `updated_on`                | Metadata     | DateTime?         | Preserve       | Keep original timestamp        |
| `created_by`                | `created_by`                | Metadata     | String?           | None           | User email address             |
| `imageCount`                | `imageCount`                | Metadata     | Int               | None           | Default 0                      |
| `asanaActivities`           | `asanaActivities`           | Relationship | AsanaActivity[]   | Preserve       | Maintain relation              |
| `poseImages`                | `poseImages`                | Relationship | PoseImage[]       | Preserve       | Maintain relation              |

## Appendix B: Deprecated Fields (Not Migrated)

| Deprecated Field           | Original Type | Reason for Deprecation        | Replacement Strategy                               | Migration Action                             |
| -------------------------- | ------------- | ----------------------------- | -------------------------------------------------- | -------------------------------------------- |
| `image`                    | String?       | Single image limitation       | Use `poseImages` relationship for multiple images  | Do not migrate; rely on `PoseImage` relation |
| `breath_direction_default` | String?       | Replaced by array structure   | Migrate value to first element of `breath[]` array | Transform to array if value exists           |
| `sort_sanskrit_name`       | String?       | Redundant with JSON structure | Use `sanskrit_names` JSON field instead            | Do not migrate; data in `sanskrit_names`     |
| `sideways`                 | Boolean?      | Functionality moved to text   | Include information in `alignment_cues` text field | Do not migrate; instructor can add to cues   |
| `preferred_side`           | String?       | Functionality moved to text   | Include information in `alignment_cues` text field | Do not migrate; instructor can add to cues   |

**Notes on Deprecated Fields:**

- These fields are marked as `@deprecated` in the `AsanaPose` schema for backward compatibility
- No data is migrated from these fields to `AsanaPose`
- Application code should be updated to use replacement fields
- `AsanaPosture` retains these fields during transition period for rollback capability

## Appendix C: Migration Script Pseudocode

```typescript
// High-level migration flow
async function migrateAsanaPostureToAsanaPose() {
  // Step 1: Pre-Migration Checks
  await validateDatabaseConnection()
  await createBackup()
  const totalRecords = await countAsanaPostures()

  // Step 2: Fetch and Transform
  const batchSize = 100
  const batches = Math.ceil(totalRecords / batchSize)

  for (let i = 0; i < batches; i++) {
    const postures = await fetchBatch(i * batchSize, batchSize)
    const transformedPoses = postures.map(transformAsanaPosture)

    // Step 3: Validate Batch
    const validationErrors = validateBatch(transformedPoses)
    if (validationErrors.length > 0) {
      logErrors(validationErrors)
      continue // Skip invalid records, log for manual review
    }

    // Step 4: Insert Batch
    await insertBatch(transformedPoses)
    logProgress(i + 1, batches)
  }

  // Step 5: Post-Migration Validation
  await validateRecordCounts()
  await validateRelationships()
  await validateSampleRecords()

  // Step 6: Generate Report
  const report = await generateMigrationReport()
  await saveReport(report)
}

function transformAsanaPosture(posture: AsanaPosture): AsanaPose {
  return {
    id: posture.id,
    sort_english_name: posture.sort_english_name,
    sanskrit_names: posture.sanskrit_names,
    english_names: posture.english_names,
    alternative_english_names: [], // New field
    description: posture.description,
    category: posture.category,
    difficulty: posture.difficulty,

    // Fix typos
    activity_completed: posture.acitivity_completed,
    activity_practice: posture.acitivity_practice,

    // Advance tier
    alignment_cues: null, // New field
    joint_action: posture.joint_action,
    muscle_action: posture.muscle_action,
    transition_cues_out: posture.transition_cues_out,
    transition_cues_in: posture.transition_cues_in,
    additional_cues: posture.additional_cues,
    benefits: posture.benefits,
    customize_asana: posture.customize_asana,

    // Personal tier - renamed fields
    pose_variations: posture.variations,
    pose_modifications: posture.modifications,
    breath: posture.breath_series,
    duration_asana: posture.duration_asana,
    lore: posture.lore,
    asana_intention: posture.posture_intent,

    // Metadata
    label: posture.label,
    suggested_postures: posture.suggested_postures,
    preparatory_postures: posture.preparatory_postures,
    isUserCreated: posture.isUserCreated,
    created_on: posture.created_on,
    updated_on: posture.updated_on,
    created_by: posture.created_by,
    imageCount: posture.imageCount,
  }
}
```

## Appendix D: Rollback Procedure

In case of migration failure or critical issues, follow this rollback procedure:

### Immediate Rollback (Within 1 hour of migration)

1. **Stop Application** (if needed):

   ```bash
   # Stop Next.js application
   pm2 stop soar-app
   ```

2. **Revert Prisma Schema**:

   ```bash
   # Checkout previous schema version
   git checkout HEAD~1 -- prisma/schema.prisma

   # Regenerate Prisma client
   npx prisma generate
   ```

3. **Drop AsanaPose Collection**:

   ```bash
   # Connect to MongoDB
   mongosh "mongodb://localhost:27017/soar"

   # Drop the new collection
   db.AsanaPose.drop()
   ```

4. **Verify AsanaPosture Integrity**:

   ```bash
   # Run validation script
   npm run validate:asana-posture
   ```

5. **Restart Application**:
   ```bash
   pm2 start soar-app
   ```

### Delayed Rollback (1-30 days after migration)

1. **Restore from Backup**:

   ```bash
   # Restore MongoDB collection from backup
   mongorestore --collection=AsanaPosture --db=soar /path/to/backup
   ```

2. **Clean Up Partial Migration**:

   ```typescript
   // Delete all AsanaPose records
   await prisma.asanaPose.deleteMany({})
   ```

3. **Revert Schema and Code Changes**:

   ```bash
   git revert [migration-commit-hash]
   npx prisma generate
   npm run build
   ```

4. **Notify Users** (if needed):
   - Communicate rollback to affected users
   - Explain any temporary data inconsistencies

### Rollback Validation Checklist

- [ ] AsanaPosture collection contains all original records
- [ ] Record count matches pre-migration count
- [ ] User-created asanas are intact with correct ownership
- [ ] AsanaActivity relationships are valid
- [ ] PoseImage relationships are intact
- [ ] Application queries return expected results
- [ ] No error logs related to missing AsanaPose references

---

**Document Version**: 1.0  
**Created**: 2025-01-04  
**Last Updated**: 2025-01-04  
**Author**: Soar Product Team  
**Status**: Draft - Awaiting Technical Review  
**Next Steps**:

1. Technical team review and validation
2. Staging environment migration test
3. Production migration scheduling
4. User communication plan (if needed)

```

I've created a comprehensive PRD for the AsanaPosture to AsanaPose migration following the Soar yoga application patterns. The document includes:

**Key Highlights:**
- Detailed field mapping with tier level annotations (Full/Advance/Personal)
- Complete transformation logic for renamed and deprecated fields
- Comprehensive migration execution plan with rollback procedures
- Testing strategy aligned with Soar's unit testing patterns
- Risk analysis specific to production yoga data migration
- Future considerations for tiered UI display

**Critical Sections:**
- **Field Transformation Map**: Complete mapping of all fields with transformation notes
- **Migration Script**: Pseudocode showing batch processing and error handling
- **Rollback Procedure**: Step-by-step rollback instructions for different scenarios
- **Appendices**: Detailed reference tables for field mapping and deprecated fields

The PRD is optimized for task generation and follows the established Soar documentation patterns. Should I save this as `.github/instructions/PRDs/PRD-asana-posture-to-pose-migration.md`?
```
