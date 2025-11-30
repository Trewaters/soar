# PRD: Asana Activity Field Naming Standardization

## Overview

Standardize the field naming convention in the `AsanaActivity` Prisma model from legacy `poseId`/`poseName` to the modern dynamic pattern `asanaId`/`asanaName`, aligning with the naming conventions used by `SeriesActivity` (`seriesId`/`seriesName`) and `SequenceActivity` (`sequenceId`/`sequenceName`). This refactoring will eliminate the special-case handling currently required for asana entities in the unified `ActivityTracker` component.

## Problem Statement

The Soar yoga application currently uses inconsistent field naming conventions across its activity tracking models:

- **AsanaActivity**: Uses legacy field names `poseId` and `poseName`
- **SeriesActivity**: Uses modern pattern `seriesId` and `seriesName`
- **SequenceActivity**: Uses modern pattern `sequenceId` and `sequenceName`

This inconsistency creates several issues:

1. **Special-case logic required**: The unified `ActivityTracker` component must conditionally skip dynamic field creation for asana entities
2. **Developer confusion**: New developers must understand why asana uses different naming than series/sequence
3. **Maintenance burden**: Code paths diverge unnecessarily for asana vs. other activity types
4. **API inconsistency**: Different field names across similar entities create friction in API design
5. **Future scalability**: Adding new activity types would require choosing between legacy or modern naming

The inconsistency stems from the historical evolution of the codebase where asana tracking was implemented first with "pose" terminology, while later implementations (series and sequence) adopted the more generic dynamic naming pattern.

## Target Users

### Primary Users

- **Engineering team**: Developers maintaining and extending the activity tracking system
- **Future developers**: New team members onboarding to the codebase
- **API consumers**: Any future integrations or external services using the activity APIs

### Secondary Users

- **End users (indirect impact)**: Yoga practitioners using the app will experience no functional changes but will benefit from improved system reliability and maintainability

## Scope

### In-Scope

#### Database Schema Changes

- Rename `poseId` to `asanaId` in `AsanaActivity` Prisma model
- Rename `poseName` to `asanaName` in `AsanaActivity` Prisma model
- Create and execute MongoDB migration to update existing documents
- Update Prisma client generation with new field names

#### Service Layer Updates

- Update `asanaActivityService.ts` to use new field names
- Update `asanaActivityClientService.ts` interfaces and types
- Update all TypeScript interfaces referencing `poseId`/`poseName`
- Update function parameters and return types

#### API Route Updates

- Update `/api/asanaActivity` route to accept and return new field names
- Update `/api/asanaActivity/weekly` route
- Update any other API endpoints referencing these fields
- Maintain backward compatibility during transition period (optional)

#### Component Updates

- Update `ActivityTracker.tsx` to remove conditional logic for asana entities
- Restore dynamic field creation for all entity types including asana
- Update `poseActivityDetail.tsx` to use new field names in `additionalActivityData`
- Update any other components directly using these fields

#### Test Suite Updates

- Update all unit tests for asana activity services
- Update all integration tests for asana activity APIs
- Update ActivityTracker component tests
- Update mock data and fixtures to use new field names
- Ensure 100% test pass rate after migration

#### Documentation Updates

- Update inline code comments explaining field naming
- Update API documentation (if exists)
- Create migration guide for the engineering team
- Document the rationale for the standardization

### Out-of-Scope

#### Not Changing

- `sort_english_name` field remains unchanged (used for routing)
- Series and sequence activity models remain unchanged
- User-facing functionality remains identical
- No UI changes required
- No new features added
- Database indexes and performance characteristics

#### Future Considerations (Not This PRD)

- Broader renaming from "pose" to "asana" throughout the codebase
- API versioning strategy for breaking changes
- Automated migration tooling for similar refactorings
- Renaming `AsanaPose` model to `Asana` for full consistency

## Functional Requirements

### Core Functionality

1. **Prisma Schema Migration**

   - Update `schema.prisma` to rename fields in `AsanaActivity` model
   - Maintain all existing field constraints and relationships
   - Preserve database indexes and performance characteristics
   - Generate new Prisma client with updated types

2. **Database Data Migration**

   - Create MongoDB migration script to rename fields in existing documents
   - Ensure zero data loss during migration
   - Verify all documents are successfully migrated
   - Create rollback script for emergency reversion
   - Test migration on development database before production

3. **Service Layer Standardization**

   - Update all function signatures to use `asanaId` and `asanaName`
   - Update TypeScript interfaces and types
   - Maintain consistent error handling
   - Preserve all existing functionality
   - No behavior changes, only naming changes

4. **API Layer Updates**

   - Update request validation to expect new field names
   - Update response serialization to return new field names
   - Consider temporary backward compatibility (accept both old and new names)
   - Update API error messages to reference new field names

5. **Component Simplification**

   - Remove conditional logic: `if (entityType !== 'asana')` from ActivityTracker
   - Restore dynamic field creation for asana entities
   - Update prop types and interfaces
   - Simplify code complexity and reduce special cases

6. **Comprehensive Testing**
   - All existing tests must pass with new field names
   - No reduction in test coverage
   - Add specific tests for field name consistency across entity types
   - Verify integration tests with actual database operations

### User Interface Requirements

**No UI changes required** - This is purely a backend/internal refactoring with zero user-facing impact. Users will continue to use the app exactly as before.

### Integration Requirements

#### Prisma Integration

- Update Prisma schema file
- Run `prisma generate` to create new client types
- Run `prisma db push` or custom migration for MongoDB
- Verify TypeScript compilation with new types

#### MongoDB Integration

- Create custom migration script for field renaming
- Test migration on staging/development environment
- Execute migration with proper backup procedures
- Verify document integrity after migration

#### ActivityTracker Context Integration

- Update context providers to use new field names
- Ensure seamless integration with existing yoga contexts
- Maintain proper type safety throughout the context chain

#### API Endpoint Integration

- Ensure all API routes use consistent field names
- Update request/response type definitions
- Maintain proper error handling and validation

## User Stories

### Engineering Team Stories

**Story 1: Consistent Field Naming**
**As a** backend developer
**I want** all activity models to use consistent field naming patterns
**So that** I can write simpler, more maintainable code without special cases

**Acceptance Criteria:**

- [ ] `AsanaActivity` model uses `asanaId` and `asanaName` fields
- [ ] Field naming pattern matches `SeriesActivity` and `SequenceActivity`
- [ ] No conditional logic needed in ActivityTracker for field names
- [ ] All TypeScript types reflect the new naming convention

**Story 2: Simplified ActivityTracker Component**
**As a** frontend developer
**I want** the ActivityTracker to handle all entity types uniformly
**So that** I don't need to understand why asana is a special case

**Acceptance Criteria:**

- [ ] ActivityTracker uses dynamic field creation for all entity types
- [ ] No `if (entityType !== 'asana')` conditional logic remains
- [ ] Code is more readable and maintainable
- [ ] Component behavior is identical for all three entity types

**Story 3: Safe Database Migration**
**As a** DevOps engineer
**I want** a tested, reversible migration script
**So that** I can safely update production data without risk

**Acceptance Criteria:**

- [ ] Migration script successfully renames fields in all documents
- [ ] Zero data loss or corruption
- [ ] Rollback script available for emergency reversion
- [ ] Migration tested on development/staging environment
- [ ] Clear documentation of migration steps and risks

**Story 4: Type-Safe Refactoring**
**As a** TypeScript developer
**I want** all type definitions to reflect the new field names
**So that** the compiler catches any missed updates automatically

**Acceptance Criteria:**

- [ ] All TypeScript interfaces updated with new field names
- [ ] No TypeScript compilation errors
- [ ] IDE autocomplete shows correct field names
- [ ] Type safety maintained throughout the refactoring

**Story 5: Comprehensive Test Coverage**
**As a** QA engineer
**I want** all tests to pass with the new field names
**So that** I can verify the refactoring hasn't introduced bugs

**Acceptance Criteria:**

- [ ] 100% of existing tests pass with new field names
- [ ] Test coverage percentage maintained or improved
- [ ] All mock data uses new field names
- [ ] Integration tests verify database operations work correctly

## Technical Requirements

### Frontend Requirements

**Components:**

- `ActivityTracker.tsx`: Remove conditional logic for asana entities
- `poseActivityDetail.tsx`: Update `additionalActivityData` to use `asanaId`/`asanaName`
- Other components: Update any direct references to old field names

**Type Definitions:**

- Update all TypeScript interfaces in `ActivityTracker.types.ts`
- Update client service interfaces
- Maintain strict type safety throughout

**State Management:**

- No changes to context providers required (they use entity-agnostic patterns)
- Verify context integration works with new field names

### Backend Requirements

**Prisma Schema:**

```prisma
model AsanaActivity {
  id               String   @id @default(auto()) @map("_id") @db.ObjectId
  userId           String   @db.ObjectId
  asanaId          String   @db.ObjectId // RENAMED from poseId
  asanaName        String                // RENAMED from poseName
  sort_english_name String
  duration         Int
  datePerformed    DateTime
  notes            String?
  sensations       String?
  completionStatus String
  difficulty       String?
  user AsanaData   @relation(fields: [userId], references: [id], onDelete: Cascade)
  pose AsanaPose   @relation(fields: [asanaId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

**Service Layer:**

- `lib/asanaActivityService.ts`: Update all references
- `lib/asanaActivityClientService.ts`: Update interfaces and function calls
- Maintain identical functionality with new naming

**API Routes:**

- `app/api/asanaActivity/route.ts`: Update request/response handling
- `app/api/asanaActivity/weekly/route.ts`: Update field names
- Consider backward compatibility layer (optional)

### Data Requirements

**MongoDB Migration Script:**

```javascript
// Migration script to rename fields
db.AsanaActivity.updateMany(
  {},
  {
    $rename: {
      poseId: 'asanaId',
      poseName: 'asanaName',
    },
  }
)

// Verification query
db.AsanaActivity.find({
  $or: [{ poseId: { $exists: true } }, { poseName: { $exists: true } }],
}).count() // Should return 0 after successful migration
```

**Rollback Script:**

```javascript
// Rollback script if needed
db.AsanaActivity.updateMany(
  {},
  {
    $rename: {
      asanaId: 'poseId',
      asanaName: 'poseName',
    },
  }
)
```

**Data Validation:**

- Verify all documents have `asanaId` field after migration
- Verify all documents have `asanaName` field after migration
- Verify no documents retain old field names
- Verify document count matches before and after migration
- Verify referential integrity with `AsanaPose` collection

## Success Criteria

### User Experience Metrics

- **Zero user impact**: No functional changes visible to end users
- **Zero downtime**: Migration executed without service interruption
- **Zero data loss**: All activity data preserved exactly

### Technical Metrics

**Code Quality:**

- [ ] Reduced code complexity in ActivityTracker (remove conditional)
- [ ] Improved code maintainability (consistent naming)
- [ ] Zero TypeScript compilation errors
- [ ] All ESLint rules pass

**Testing:**

- [ ] 100% of unit tests passing (40/40 for ActivityTracker)
- [ ] 100% of integration tests passing
- [ ] Test coverage maintained or improved
- [ ] Zero failing tests

**Database:**

- [ ] Migration completes in under 5 minutes
- [ ] Zero documents with old field names remain
- [ ] 100% of documents successfully migrated
- [ ] Rollback script tested and validated

**Performance:**

- [ ] No performance regression in activity queries
- [ ] No impact on page load times
- [ ] No increase in API response times

## Dependencies

### Internal Dependencies

**Existing Code:**

- ActivityTracker unified component (recently completed)
- Asana activity service layer
- Prisma client and MongoDB adapter
- NextAuth.js session management
- MUI component library

**Shared Utilities:**

- Prisma client initialization
- MongoDB connection handling
- Error logging and monitoring

### External Dependencies

**Database:**

- MongoDB instance access for migration
- Backup system for safety
- Sufficient database permissions for field renaming

**Tools:**

- Prisma CLI for schema management
- MongoDB shell or Compass for migration execution
- Git for version control and rollback capability

### Blocking Dependencies

**Must Complete First:**

- Full backup of production database
- Testing environment with production-like data
- Migration script reviewed and approved
- Rollback procedure documented and tested

## Risks and Considerations

### Technical Risks

**Risk 1: Data Migration Failure**

- **Severity:** High
- **Likelihood:** Low
- **Impact:** Data loss or corruption in activity records
- **Mitigation:**
  - Test migration on development/staging with production-like data
  - Create full database backup before migration
  - Have rollback script ready and tested
  - Execute during low-traffic period
  - Monitor migration progress in real-time

**Risk 2: Missed References in Code**

- **Severity:** Medium
- **Likelihood:** Medium
- **Impact:** Runtime errors when old field names are accessed
- **Mitigation:**
  - Use TypeScript's type system to catch references at compile time
  - Comprehensive grep search for all occurrences
  - Run full test suite before deployment
  - Code review focused on field name changes
  - Deploy to staging environment first

**Risk 3: Third-party Integration Breakage**

- **Severity:** Low
- **Likelihood:** Low
- **Impact:** External integrations expecting old field names fail
- **Mitigation:**
  - Audit for any external API consumers
  - Implement temporary backward compatibility layer if needed
  - Coordinate with any integration partners
  - Version API if breaking changes are significant

**Risk 4: Test Suite Incomplete Coverage**

- **Severity:** Medium
- **Likelihood:** Low
- **Impact:** Hidden bugs not caught by tests
- **Mitigation:**
  - Review test coverage before starting
  - Add tests for any uncovered code paths
  - Manual QA testing of activity tracking flows
  - Staged rollout to catch issues early

### User Experience Risks

**Risk 1: Downtime During Migration**

- **Severity:** Low
- **Likelihood:** Low
- **Impact:** Users unable to track activities briefly
- **Mitigation:**
  - Execute during off-peak hours
  - Use MongoDB's atomic operations for fast updates
  - Minimize migration window to under 5 minutes
  - Have status page ready if needed

**Risk 2: Lost Activity Data**

- **Severity:** High
- **Likelihood:** Very Low
- **Impact:** Users lose historical practice data
- **Mitigation:**
  - Multiple database backups before migration
  - Test migration extensively on non-production data
  - Verify document counts before and after
  - Have data recovery plan ready

## Implementation Notes

### File Structure Impact

**Files to Create:**

- `scripts/migrations/rename-asana-activity-fields.js`: MongoDB migration script
- `scripts/migrations/rollback-asana-activity-fields.js`: Rollback script
- `.github/coding/README-asana-activity-naming-migration.md`: Implementation documentation

**Files to Modify:**

- `prisma/schema.prisma`: Update AsanaActivity model
- `lib/asanaActivityService.ts`: Update service functions
- `lib/asanaActivityClientService.ts`: Update interfaces
- `app/api/asanaActivity/route.ts`: Update API handlers
- `app/api/asanaActivity/weekly/route.ts`: Update weekly tracking
- `app/clientComponents/ActivityTracker.tsx`: Remove conditional logic
- `app/navigator/asanaPoses/[pose]/poseActivityDetail.tsx`: Update props
- All test files referencing `poseId`/`poseName`

**Files to Review (No Changes Expected):**

- Context providers (use entity-agnostic patterns)
- MUI theme configuration
- Authentication logic

### Testing Strategy

**Unit Testing:**

- Test each updated service function independently
- Mock Prisma client with new field names
- Verify function behavior unchanged except naming
- Test error handling with new field names

**Integration Testing:**

- Test full activity creation flow with new fields
- Test activity retrieval and display
- Test activity deletion
- Test weekly tracking calculations
- Verify database queries work correctly

**End-to-End Testing:**

- Manual testing of complete user flows
- Create activity from pose detail page
- View activity in tracker
- Delete activity
- Check weekly statistics

**Migration Testing:**

- Test migration script on development database
- Verify all documents updated correctly
- Test rollback script
- Verify data integrity after migration
- Performance test with large datasets

### Deployment Strategy

**Phase 1: Preparation**

1. Complete all code changes
2. Run full test suite locally
3. Code review and approval
4. Merge to development branch
5. Deploy to development environment
6. Verify functionality in development

**Phase 2: Staging**

1. Create staging database backup
2. Run migration on staging
3. Deploy code to staging
4. Full QA testing on staging
5. Performance verification
6. Address any issues found

**Phase 3: Production**

1. Schedule migration during off-peak hours
2. Notify team of maintenance window
3. Create production database backup
4. Execute migration script
5. Verify migration success
6. Deploy new code to production
7. Monitor for errors
8. Verify functionality in production

**Phase 4: Post-Deployment**

1. Monitor error logs for 24-48 hours
2. Verify user activity tracking working
3. Check API response times
4. Confirm database performance stable
5. Document lessons learned

## Future Considerations

### Potential Enhancements

- **Full "Pose" to "Asana" Terminology Migration**: Rename `AsanaPose` model to `Asana` and update all references throughout the codebase
- **API Versioning**: Implement formal API versioning to handle breaking changes gracefully
- **Automated Migration Tooling**: Create reusable scripts for field renaming in MongoDB
- **Schema Validation**: Add MongoDB schema validation to enforce field naming patterns
- **Database Change Management**: Implement formal database version control

### Related Features to Consider

- **Activity Analytics Enhancement**: Leverage consistent naming for cross-entity analytics
- **Unified Activity Dashboard**: Display all activity types in a single view
- **Activity Import/Export**: Standardized field names simplify data portability
- **GraphQL API**: Consistent naming makes GraphQL schema cleaner

### Scalability Considerations

- **New Activity Types**: Future activity types should follow the `${entityType}Id`/`${entityType}Name` pattern
- **Multi-tenant Support**: Consistent naming simplifies multi-tenant implementations
- **Caching Strategy**: Standardized fields make cache key generation consistent
- **Search Indexing**: Uniform field names improve search implementation

### Long-term Maintenance

- **Documentation**: Maintain record of this refactoring for future reference
- **Code Comments**: Document the decision to standardize naming
- **Onboarding Material**: Update developer onboarding to explain naming conventions
- **Style Guide**: Add field naming conventions to engineering style guide

---

## Summary

This PRD outlines a systematic approach to standardizing field naming in the Soar yoga application's activity tracking system. By renaming `poseId`/`poseName` to `asanaId`/`asanaName` in the `AsanaActivity` model, we eliminate special-case handling, improve code maintainability, and create a consistent API surface across all activity types.

The refactoring requires careful coordination across database migration, service layer updates, API modifications, and comprehensive testing. However, the benefits of simplified code, reduced technical debt, and improved developer experience justify the effort.

With proper testing, staging deployment, and monitoring, this change can be executed with zero user impact while significantly improving the internal quality of the codebase.
