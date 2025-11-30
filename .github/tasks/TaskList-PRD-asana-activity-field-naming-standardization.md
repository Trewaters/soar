# Engineering Task Breakdown: Asana Activity Field Naming Standardization

**Source PRD**: `PRD-asana-activity-field-naming-standardization.md`

This task list provides a step-by-step implementation guide for updating the legacy `poseId`/`poseName` field names in the `AsanaActivity` model to the modern `asanaId`/`asanaName` pattern, aligning with `SeriesActivity` and `SequenceActivity` naming conventions.

---

## Phase 1: Preparation and Planning

### 1. Database Backup and Safety Preparation

- Create full MongoDB database backup before any changes
- Document current database state and record counts
- Verify backup restoration procedure works
- Set up isolated development database for migration testing
- Create database backup script for automation

### 2. Migration Script Development

- Create MongoDB migration script at `scripts/migrations/rename-asana-activity-fields.js`
  - Use `$rename` operator to change `poseId` to `asanaId`
  - Use `$rename` operator to change `poseName` to `asanaName`
  - Add document count verification before and after
  - Add progress logging for large datasets
  - Include transaction support if applicable
- Create rollback script at `scripts/migrations/rollback-asana-activity-fields.js`
  - Reverse the field renaming operation
  - Include same verification and logging as migration script
- Test migration script on development database with production-like data
- Test rollback script to ensure it correctly reverses migration
- Document migration execution steps and expected duration

### 3. Code Analysis and Impact Assessment

- Use grep to find all occurrences of `poseId` in the codebase
- Use grep to find all occurrences of `poseName` in the codebase
- Create comprehensive list of files requiring updates
- Identify any external API consumers or integrations
- Review test coverage for activity tracking functionality
- Document all files and line numbers requiring changes

---

## Phase 2: Prisma Schema and Type Updates

### 4. Prisma Schema Modification

- Update `prisma/schema.prisma` in the `AsanaActivity` model:
  - Rename field `poseId` to `asanaId` (line ~197)
  - Rename field `poseName` to `asanaName` (line ~198)
  - Maintain all field constraints and decorators
  - Update relation reference if needed: `@relation(fields: [asanaId], ...)`
  - Verify no breaking changes to other models
- Run `prisma generate` locally to create new client types
- Verify TypeScript compilation with new Prisma types
- Update `prisma/generated/client` directory (auto-generated)

### 5. Service Layer Type Definitions

- Update `lib/asanaActivityService.ts`:
  - Update `CreateActivityData` interface: rename `poseId` to `asanaId`, `poseName` to `asanaName`
  - Update all function parameters using old field names
  - Update all Prisma query objects to use new field names
  - Update function: `createAsanaActivity()` - Prisma create operation
  - Update function: `deleteAsanaActivity()` - change parameter from `poseId` to `asanaId`
  - Update function: `checkExistingActivity()` - change parameter from `poseId` to `asanaId`
  - Update function: `getPoseWeeklyCount()` - change parameter from `poseId` to `asanaId`
  - Update function: `getWeeklyActivitySummary()` - update aggregation field references
  - Update all error messages to reference new field names
- Update `lib/asanaActivityClientService.ts`:
  - Update `AsanaActivityData` interface: rename `poseId` to `asanaId`, `poseName` to `asanaName`
  - Update `CreateActivityInput` interface: rename `poseId` to `asanaId`, `poseName` to `asanaName`
  - Update function: `createAsanaActivity()` - update fetch body
  - Update function: `deleteAsanaActivity()` - change parameter from `poseId` to `asanaId`
  - Update function: `checkActivity()` - change parameter from `poseId` to `asanaId`
  - Update all API endpoint calls to use new field names

---

## Phase 3: API Route Updates

### 6. Asana Activity API Endpoints

- Update `app/api/asanaActivity/route.ts`:
  - POST handler: Update request body validation to expect `asanaId` and `asanaName`
  - POST handler: Update Prisma create operation with new field names
  - POST handler: Update error messages referencing fields
  - GET handler: Update Prisma query filters if using field names
  - DELETE handler: Update to accept `asanaId` parameter instead of `poseId`
  - Update response serialization to return new field names
  - Update validation error messages

### 7. Weekly Activity API Endpoint

- Update `app/api/asanaActivity/weekly/route.ts`:
  - Update query parameter extraction: change `poseId` to `asanaId`
  - Update Prisma where clause to use `asanaId`
  - Update response data to use new field names
  - Update error messages

### 8. Related API Routes

- Update `app/api/poses/[id]/route.ts`:
  - Review any references to activity field names
  - Update if activity data is included in pose responses
- Update `app/api/images/upload/route.ts`:
  - Review usage of `poseId` and `poseName` in image context
  - Determine if changes needed for consistency
- Search for any other API routes referencing these fields

---

## Phase 4: Component and UI Updates

### 9. ActivityTracker Component Simplification

- Update `app/clientComponents/ActivityTracker.tsx`:
  - Remove conditional logic: delete `if (entityType !== 'asana')` check (lines ~258-262)
  - Restore dynamic field creation for asana entities
  - Update activity data construction to always include:
    ```typescript
    activityData[`${entityType}Id`] = entityId
    activityData[`${entityType}Name`] = entityName
    ```
  - Remove special-case handling for asana
  - Verify consistent behavior across all entity types
  - Update inline comments explaining the unified approach

### 10. Pose Activity Detail Page

- Update `app/navigator/asanaPoses/[pose]/poseActivityDetail.tsx`:
  - Update `additionalActivityData` prop passed to ActivityTracker
  - Change `poseId` to `asanaId` (line ~961)
  - Change `poseName` to `asanaName` (line ~962)
  - Remove these fields since they'll be handled by dynamic pattern
  - Verify ActivityTracker receives correct entityId and entityName props

### 11. ActivityTracker Type Definitions

- Update `app/clientComponents/ActivityTracker.types.ts`:
  - Review type definitions for any references to old field names
  - Update `CreateActivityData` type if defined locally
  - Update `CheckActivityResult` type if it references fields
  - Ensure all exported types use new field names

### 12. Other Component Updates

- Search for components using `poseId` or `poseName` directly
- Update `app/clientComponents/AsanaActivityList.tsx` if it exists
- Update any dashboard or statistics components displaying activity data
- Update any forms or inputs collecting activity data
- Review `app/clientComponents/WeeklyActivityTracker.tsx` for field references

---

## Phase 5: Comprehensive Test Suite Updates

### 13. Service Layer Unit Tests

- Update `__test__/lib/asanaActivityService.spec.ts`:
  - Update all mock data objects with new field names
  - Update test assertions expecting old field names
  - Update function call parameters
  - Verify all test cases pass with new naming
- Update `__test__/lib/asanaActivityService.weeklyTracking.spec.ts`:
  - Update mock activity data with `asanaId` and `asanaName`
  - Update all test expectations
  - Update function parameters in test calls
  - Verify weekly tracking calculations work correctly

### 14. Client Service Tests

- Update `__test__/lib/asanaActivityClientService.spec.ts` (if exists):
  - Update mock fetch responses with new field names
  - Update request body assertions
  - Update all test data
- Create new tests verifying field name consistency across entity types

### 15. ActivityTracker Component Tests

- Update `__test__/app/clientComponents/ActivityTracker.spec.tsx`:
  - Update test for "should create activity with correct data on button click"
  - Add back expectations for `asanaId` and `asanaName` in mock calls
  - Remove test comments about conditional logic
  - Add new test: "should use dynamic field naming for asana entities"
  - Verify all 40 tests pass with updated expectations
  - Update mock data and fixtures

### 16. API Route Integration Tests

- Update `__test__/app/api/asanaActivity/route.spec.ts` (if exists):
  - Update mock request bodies with new field names
  - Update response assertions
  - Update Prisma mock return values
- Update `__test__/app/api/asanaActivity/weekly/route.spec.ts` (if exists):
  - Update query parameter tests
  - Update response data assertions
- Create tests verifying backward compatibility if implemented

### 17. Component Integration Tests

- Update any integration tests for pose detail pages
- Update tests for activity tracking user flows
- Update E2E tests if they exist
- Verify all test suites pass (aim for 100% pass rate)

---

## Phase 6: Documentation and Code Quality

### 18. Code Documentation Updates

- Update inline comments in `ActivityTracker.tsx`:
  - Remove comments explaining asana special case
  - Add comments about unified dynamic field approach
  - Document the naming pattern for all entity types
- Update inline comments in `asanaActivityService.ts`:
  - Update JSDoc comments with new field names
  - Update function parameter documentation
  - Add note about standardization with series/sequence
- Update type definition comments with new field names

### 19. Implementation Documentation

- Create `/.github/coding/README-asana-activity-naming-migration.md`:
  - Document the migration rationale
  - Explain the field renaming decision
  - List all files modified
  - Document the migration script execution
  - Include before/after code examples
  - Document testing approach
  - Include lessons learned section

### 20. Developer Guide Updates

- Update main README.md if it references activity field names
- Update API documentation with new field names
- Update any architecture diagrams or documentation
- Add migration notes to CHANGELOG.md
- Update developer onboarding materials

---

## Phase 7: Migration Execution (Staging)

### 21. Staging Environment Preparation

- Deploy updated code to staging environment
- Create backup of staging database
- Verify staging database is representative of production
- Run full test suite on staging
- Verify application builds without errors

### 22. Staging Database Migration

- Execute migration script on staging database
- Monitor migration progress and duration
- Verify document counts before and after match
- Query for any documents still using old field names
- Verify zero documents with `poseId` or `poseName` remain
- Test application functionality after migration

### 23. Staging Validation and QA

- Manually test activity creation from pose detail page
- Test activity deletion functionality
- Test weekly activity tracking and statistics
- Verify API responses contain new field names
- Test error handling and edge cases
- Perform load testing if applicable
- Document any issues found and fix them

---

## Phase 8: Production Deployment

### 24. Production Deployment Planning

- Schedule maintenance window during off-peak hours
- Notify team of deployment timeline
- Prepare rollback plan and procedures
- Review deployment checklist
- Assign roles and responsibilities
- Set up monitoring and alerting

### 25. Production Database Backup

- Create full MongoDB backup of production database
- Verify backup integrity and accessibility
- Test backup restoration on separate instance
- Document backup location and timestamp
- Ensure backup is retained for adequate period

### 26. Production Database Migration

- Execute migration script during maintenance window
- Monitor migration progress in real-time
- Log all migration operations
- Verify migration completion successfully
- Query for any remaining old field names
- Verify document counts match expectations
- Record migration duration and statistics

### 27. Production Code Deployment

- Deploy new application code to production
- Verify deployment completes successfully
- Run smoke tests on critical paths
- Verify application starts without errors
- Check application logs for errors
- Test activity tracking functionality

### 28. Post-Deployment Monitoring

- Monitor error logs for 24-48 hours
- Track API response times and performance
- Monitor database query performance
- Verify user activity tracking is working
- Check for any error spikes or anomalies
- Gather user feedback if applicable
- Document any issues and resolutions

---

## Phase 9: Post-Migration Cleanup

### 29. Code Quality Verification

- Run full test suite on production codebase
- Verify 100% test pass rate
- Run linting and code quality checks
- Verify TypeScript compilation with no errors
- Check test coverage metrics
- Review and merge any pending fixes

### 30. Performance Validation

- Compare database query performance before and after
- Verify no regression in API response times
- Check application load times
- Monitor server resource usage
- Validate caching behavior
- Document performance metrics

### 31. Documentation Finalization

- Update CHANGELOG.md with migration details
- Document final migration statistics (duration, records updated)
- Add migration completion notes to implementation doc
- Update any external documentation
- Create knowledge base article for reference
- Share migration summary with team

### 32. Lessons Learned and Future Planning

- Document what went well during migration
- Note any challenges or issues encountered
- Identify process improvements for future migrations
- Update migration playbook with learnings
- Consider automation opportunities
- Plan for any follow-up work or improvements

---

## Success Criteria Checklist

### Technical Completion

- [ ] All Prisma schema fields renamed to `asanaId` and `asanaName`
- [ ] All service layer functions updated with new field names
- [ ] All API routes accept and return new field names
- [ ] ActivityTracker component uses dynamic field naming for asana
- [ ] All TypeScript types and interfaces updated
- [ ] Zero TypeScript compilation errors
- [ ] All ESLint rules passing

### Database Migration

- [ ] Migration script successfully renames all fields
- [ ] Zero data loss or corruption
- [ ] All documents have new field names
- [ ] No documents retain old field names
- [ ] Document count matches before and after
- [ ] Rollback script tested and working

### Testing

- [ ] 100% of unit tests passing
- [ ] 100% of integration tests passing
- [ ] 40/40 ActivityTracker tests passing
- [ ] All service layer tests passing
- [ ] All API route tests passing
- [ ] Manual QA testing completed

### Code Quality

- [ ] Conditional logic removed from ActivityTracker
- [ ] Consistent naming across all activity types
- [ ] Code complexity reduced
- [ ] Documentation updated
- [ ] No special-case handling for asana

### User Experience

- [ ] Zero user-facing functional changes
- [ ] No downtime during migration
- [ ] Activity tracking works correctly
- [ ] Weekly statistics display correctly
- [ ] No error messages visible to users

### Performance

- [ ] No performance regression in queries
- [ ] API response times maintained or improved
- [ ] Database performance stable
- [ ] No increase in error rates

---

## Estimated Timeline

**Phase 1-2: Preparation & Schema Updates** - 1-2 days
**Phase 3-4: API & Component Updates** - 2-3 days
**Phase 5: Test Suite Updates** - 2-3 days
**Phase 6: Documentation** - 1 day
**Phase 7: Staging Migration** - 1 day
**Phase 8: Production Deployment** - 1 day (plus monitoring)
**Phase 9: Post-Migration** - 1-2 days

**Total Estimated Duration**: 9-13 working days

---

## Risk Mitigation Summary

1. **Database Backup**: Full backup before any changes
2. **Rollback Script**: Tested and ready for emergency use
3. **Staged Deployment**: Test on development → staging → production
4. **Type Safety**: TypeScript catches most code issues at compile time
5. **Comprehensive Testing**: All tests must pass before deployment
6. **Monitoring**: 24-48 hour enhanced monitoring post-deployment
7. **Off-Peak Deployment**: Minimize user impact during migration

---

## Notes for Implementation

- Use TypeScript's type system to your advantage - compilation errors will catch most missed updates
- Test the rollback script thoroughly - you may need it in an emergency
- Consider implementing a temporary backward compatibility layer in API routes if external consumers exist
- Monitor database performance during and after migration
- Keep the team informed throughout the process
- Document everything for future reference

This standardization will significantly improve code maintainability and eliminate special-case handling for asana entities in the activity tracking system.
