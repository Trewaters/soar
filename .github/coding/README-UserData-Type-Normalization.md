# UserData Type Normalization - Implementation Summary

## Overview

Successfully normalized the `UserData` type definition across the Soar yoga application codebase by creating a centralized models folder. This ensures a single source of truth for user-related type definitions.

## Changes Made

### 1. Created Centralized Models Directory

**Location:** `types/models/`

Created the following files:

- `types/models/user.ts` - Centralized user type definitions
- `types/models/index.ts` - Re-export barrel file for convenient imports

### 2. Consolidated Type Definitions

**File:** `types/models/user.ts`

Consolidated all user-related types into a single file:

- **`UserData`** (Main type) - Complete user profile and account data

  - Matches Prisma UserData model schema
  - Includes authentication fields (id, email, provider_id)
  - Profile metadata (pronouns, bio, headline, location)
  - Yoga-specific fields (yogaStyle, yogaExperience)
  - Image management (profileImages, activeProfileImage)
  - Timestamps and timezone

- **`UserDataSimple`** - Simplified type for API responses

  - Essential user identification only
  - Used in service layer for lightweight operations

- **`UserGithubProfile`** - GitHub OAuth profile structure
- **`UserGoogleProfile`** - Google OAuth profile structure
- **`UserStreakData`** - Login streak tracking for gamification
- **`UserProfilePageState`** - Complete user profile page state
- **`UserAction`** - User state action types for reducers

### 3. Added Type Guards

Utility functions for runtime type checking:

- `isUserData(obj)` - Validates complete UserData objects
- `isUserDataSimple(obj)` - Validates simplified UserData objects

### 4. Updated Import Statements

#### Updated Files:

1. **`lib/userService.ts`**

   ```typescript
   import type { UserData, UserStreakData } from '../types/models/user'
   ```

   - Removed duplicate `UserData` and `UserStreakData` type definitions
   - Now imports from centralized models

2. **`app/context/UserContext.tsx`**

   ```typescript
   import type {
     UserData,
     UserGithubProfile,
     UserGoogleProfile,
     UserProfilePageState,
     UserAction,
   } from '../../types/models/user'
   ```

   - Removed all duplicate type definitions
   - Imports from centralized models
   - **No re-exports** - all imports must now come directly from `types/models/user`

3. **`types/asana.ts`**
   ```typescript
   import type { UserData } from './models/user'
   ```
   - Changed from importing from `app/context/UserContext`
   - Now imports from centralized models folder

## Benefits

### 1. Single Source of Truth

- One canonical location for all user type definitions
- Eliminates confusion about which definition to use
- Easier to maintain and update user types

### 2. Better Organization

- Clear separation of concerns with dedicated models folder
- Follows Soar application architecture patterns
- Aligns with TypeScript best practices

### 3. Type Safety

- Consistent type definitions across the entire application
- Type guards for runtime validation
- Better IDE autocomplete and type checking

### 4. Maintainability

- Easier to add new user-related types in the future
- Clear location for all user model definitions
- Simplified dependency graph

## Prisma Schema Alignment

The centralized `UserData` type aligns with the Prisma schema:

```prisma
model UserData {
  id               String    @id @default(auto()) @map("_id") @db.ObjectId
  provider_id      String?   @unique
  name             String?
  email            String?   @unique
  emailVerified    DateTime?
  image            String?
  pronouns         String?
  profile          Json?
  // ... (all fields match TypeScript UserData type)
  profileImages    String[]
  activeProfileImage String?
  tz               String    @default("America/Los_Angeles")
}
```

## Testing

All tests pass successfully:

- **Test Suites:** 80 passed, 80 total
- **Tests:** 1105 passed, 1105 total
- **Time:** ~122 seconds

No breaking changes detected in:

- Component tests
- Integration tests
- API tests
- Context tests
- Utility function tests

## Migration Path

All code has been updated to use the centralized type definitions.

### Required Import Pattern

```typescript
import type { UserData } from '@/types/models/user'
// or with relative paths
import type { UserData } from '../types/models/user'
import type { UserData } from '../../types/models/user'
```

### ❌ No Longer Supported

```typescript
// DO NOT import from UserContext
import type { UserData } from '@/app/context/UserContext'
import type { UserData } from 'app/context/UserContext'
```

The `UserContext.tsx` file no longer re-exports types. All type imports must come from `types/models/user`.

## File Structure

```
types/
├── models/
│   ├── index.ts          # Barrel export file
│   └── user.ts           # All user-related types (SINGLE SOURCE OF TRUTH)
├── asana.ts              # Asana types (imports from models/user)
└── images.ts             # Image types

app/
└── context/
    └── UserContext.tsx   # Imports types from models/user (NO RE-EXPORTS)

lib/
└── userService.ts        # Imports from models/user
```

## Next Steps (Optional Future Improvements)

1. **Add more model types** - Create similar model files for other domain entities (Asana, Series, etc.)
2. **Generate types from Prisma** - Consider using Prisma generated types directly
3. **Add Zod schemas** - Add runtime validation schemas alongside type definitions
4. **Create type utilities** - Add more type guards and utility functions as needed

## Documentation

- All types include JSDoc comments explaining their purpose
- Type guards include usage examples
- Clear separation between different user data structures (full, simple, OAuth profiles)

## Conclusion

Successfully normalized the `UserData` type across the Soar yoga application. All duplicate type definitions have been removed, and all code now imports from the centralized `types/models/user.ts` file. The `UserContext.tsx` file no longer re-exports types - it only uses them internally. This provides a clean, maintainable architecture with a true single source of truth for user-related type definitions.
