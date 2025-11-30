# PRD: Autosearch – Prioritize User-Created poses, series, sequence at Top

## Overview

Enhance all autocomplete/search experiences for asanas so that user-created poses, series, sequence (and designated "alpha user" poses) appear in a dedicated top section, followed by all other results sorted alphabetically. Ensure no duplication between sections using canonical asana identity.

## Problem Statement

Practitioners often create custom poses, series, sequence and expect to find them quickly. Current search mixes all results, slowing selection and increasing cognitive load. A dedicated top section for user-created and alpha-curated poses, series, sequence improves discoverability and speed.

## Target Users

- Authenticated practitioners who create or frequently use custom poses, series, sequence
- Alpha users (internal curators/instructors) whose poses, series, sequence should be promoted for quality and consistency
- All users of planner/sequence builder, practice views, and global search

## Scope

### In-Scope

- All autocomplete/search UIs related to asana discovery:
  - Planner and Sequence Builder asana pickers
  - Practice view search inputs
  - Global search/autocomplete for asanas
- Top section titled "User (poses, series, sequence)" containing:
  - poses, series, sequence created by the current user (createdBy === current user id)
  - poses, series, sequence created by "alpha users" (see Data Requirements)
- Lower section titled "Others" containing remaining matches sorted alphabetically
- Deduplication between sections by canonicalAsanaId
- Sectioned rendering and keyboard navigation across sections

### Out-of-Scope

- Changes to pose editing, creation flows, or ownership
- Relevance ranking changes for the "Others" section beyond alphabetical sort
- Full-text search algorithm changes
- Non-asana entities

## Functional Requirements

### Core Functionality

1. Partition search results into two sections:
   - Top: user-created and alpha-user-created poses, series, sequence
   - Bottom: all other matching poses, series, sequence
2. Deduplicate by canonicalAsanaId so any canonical match shown in the top section is not repeated in the bottom section.
3. Alphabetical sort (A→Z) for the "Others" section based on display title (see UI Requirements for field).
4. Section headers: "User (poses, series, sequence)" and "Others". Top section appears only when it has at least one result; bottom always appears when there are matches.
5. Consistent behavior across all autocomplete/search surfaces listed in scope.

### User Interface Requirements

- Autocomplete dropdown renders two groups:
  - Group 1 (if non-empty): header "User (poses, series, sequence)"
  - Group 2: header "Others"
- Group styling should match MUI grouping patterns (divider, subdued header, accessible labeling).
- Sorting:
  - Top section: preserve a reasonable ordering (e.g., user’s recent or default alphabetical). If no existing sort exists, default to alphabetical by display title.
  - Others section: strict A→Z alphabetical by the same display title.
- Display title field: prefer `asana.displayName` or fallback to `asana.englishName`. If neither exists, fallback to `asana.title`.
- Keyboard navigation traverses items across sections seamlessly; headers are not focusable.
- Accessibility: headers have `role="presentation"` and aria-labels on groups (e.g., `aria-label="User {poses, series, sequence}"`, `aria-label="Others"`).

### Integration Requirements

- Authentication/session: Available via NextAuth.js v5 to determine current user id.
- Data flow options:
  - Preferred: API returns a flat list; client partitions/sorts/dedupes per rules.
  - Alternative: API can accept flags (`prioritizeUser=true`) and return grouped results to reduce client work; still dedupe by canonicalAsanaId.
- Context providers: Maintain compatibility with `UserStateProvider`, `AsanaPostureContext`, and `FlowSeriesProvider` where search components consume pose data.
- Feature flag: Optional toggle in `app/FEATURES.ts` (e.g., `PRIORITIZE_USER_{poses, series, sequence}_IN_SEARCH`) for rollout.

## User Stories

### Primary User Stories

As an authenticated practitioner
I want my created poses, series, sequence to appear at the top of search
So that I can select them faster when planning or practicing

Acceptance Criteria:

- [ ] When I type in any asana search, a "User (poses, series, sequence)" section appears first when there are matches that I created or alpha users created.
- [ ] The "Others" section lists remaining matches without duplicates and is sorted A→Z.
- [ ] If no user/alpha matches exist, only the "Others" section is shown.

As a practitioner using the sequence builder
I want alpha-curated poses, series, sequence to be near my poses, series, sequence
So that I can easily find recommended quality poses, series, sequence

Acceptance Criteria:

- [ ] Alpha user poses, series, sequence appear in the "User (poses, series, sequence)" section alongside my own created poses, series, sequence.
- [ ] Duplicates are removed from the "Others" section via canonicalAsanaId.

### Secondary User Stories

As a keyboard-only user
I want groups to be announced properly and skip headers
So that I can efficiently navigate the results

Acceptance Criteria:

- [ ] Group headers are non-focusable; screen readers announce group labels.
- [ ] Arrow keys move across list items without focusing headers.

## Technical Requirements

### Frontend Requirements

- Update all autocomplete components that surface asana results to:
  - Access current user id from session or UserContext
  - Partition results into two arrays by `createdBy ∈ {currentUserId ∪ alphaUserIds}`
  - Deduplicate using `canonicalAsanaId` (Set-based filtering)
  - Sort the "Others" section alphabetically by display title
  - Render two ARIA-labeled groups using MUI patterns
- Ensure deterministic rendering, memoize partitioning given (query, results, userId, alphaIds)

### Backend Requirements

- If API-side support is preferred/available:
  - Optional query params: `prioritizeUser=true`, `includeAlpha=true`
  - Resolve `alphaUserIds` from configuration/DB
  - Return results sufficient to partition on client if grouping not performed server-side

### Data Requirements

- Asana model fields assumed:
  - `id` (asanaId)
  - `canonicalAsanaId` (string or ObjectId) – used for deduplication
  - `createdBy` (user id)
  - `displayName` | `englishName` | `title` (for sorting/display)
- Alpha users: resolvable list via one of:
  - User role `role === 'alpha'`
  - Config list in app settings or environment (e.g., `ALPHA_USER_IDS`)
  - Dedicated collection/table (preferred long-term)

## Success Criteria

### User Experience Metrics

- 20–40% reduction in time-to-select for users with ≥5 created poses, series, sequence
- > 95% of search interactions show correctly grouped results (via telemetry validation)
- No reported duplicates in a sample of 200 searches

### Technical Metrics

- Unit tests cover partitioning, dedup, and sorting rules
- a11y checks pass for grouped lists in all updated components
- No regressions in search latency (>200ms added processing on client is unacceptable)

## Dependencies

### Internal Dependencies

- Session via NextAuth.js v5
- `UserStateProvider`, `AsanaPostureContext`, `FlowSeriesProvider`
- `FEATURES.ts` for feature flag

### External Dependencies

- None required beyond existing MUI and NextAuth

## Risks and Considerations

### Technical Risks

- Missing `canonicalAsanaId` on legacy data – requires fallback or migration
- Alpha user resolution ambiguity – define single source of truth
- Large result sets – ensure efficient Set-based dedupe and memoization

### User Experience Risks

- Users may expect their poses, series, sequence to always be first even if query strongly matches others – clarify behavior in help tips if needed
- Confusion over "User (poses, series, sequence)" label including alpha poses, series, sequence – consider tooltip: "Includes your {poses, series, sequence} and recommended alpha poses, series, sequence"

## Implementation Notes

### File Structure Impact

- Frontend: update all asana autocomplete/search components under:
  - `app/planner/**` (sequence builder pickers)
  - `app/views/**` (practice view search)
  - `app/clientComponents/**` (shared search/autocomplete)
  - `app/navigator/**` (global search, if present)
- Feature flag addition in `app/FEATURES.ts`
- Optional: alpha user configuration in `app/config/alphaUsers.ts` or env-based loader in `lib/alphaUsers.ts`

### Testing Strategy

- Unit tests for partitioning util: input arrays → grouped/deduped/sorted output
- Component tests for each updated autocomplete surface:
  - Rendering of group headers based on data
  - Keyboard navigation and a11y labels
  - Deduplication by canonicalAsanaId
- Mock NextAuth session and contexts; mock alpha user list

## Future Considerations

- Personal ranking within the top section (recent/frequent)
- Server-driven grouping for performance on very large datasets
- Per-user pinning of favorite poses, series, sequence
- Analytics on section usage to refine ordering
