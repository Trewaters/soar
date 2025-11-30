# MongoDB Cleanup: Remove NextAuth Adapter Collections

## Issue

The production login error was caused by **dual user storage** - both NextAuth's MongoDB Adapter collections AND custom Prisma `UserData` collections were being used simultaneously, creating conflicts when checking for duplicate emails.

## Root Cause Details

### Duplicate User Storage

1. **NextAuth MongoDB Adapter** (auto-created by `MongoDBAdapter(client)`)

   - `users` collection - OAuth user data
   - `accounts` collection - OAuth provider links
   - `sessions` collection - User sessions
   - `verification_tokens` collection - Email verification

2. **Custom Prisma Models** (manually managed in signIn callback)
   - `UserData` collection - Application user data with yoga-specific fields
   - `ProviderAccount` collection - Custom provider account management
   - `UserLogin` collection - Login tracking for streaks

### The Conflict

When a user tried to sign in with OAuth:

1. NextAuth would check the adapter's `users` collection for duplicate emails
2. Find a record and throw `OAuthAccountNotLinked` error
3. Never reach our custom `signIn` callback that properly handles account linking in `UserData`

## Solution Implemented

### Step 1: Disable MongoDB Adapter in auth.ts

**File**: `auth.ts`

**Changed**:

```typescript
// Before
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import client from '@lib/mongoDb'

const authConfig = {
  providers,
  adapter: MongoDBAdapter(client),
  // ...
}

// After
// import { MongoDBAdapter } from '@auth/mongodb-adapter' // Disabled
// import client from '@lib/mongoDb' // Disabled

const authConfig = {
  providers,
  // adapter: MongoDBAdapter(client), // Disabled - using custom Prisma-based user management
  // ...
}
```

**Reason**: We're fully managing users with Prisma, so the adapter creates unnecessary duplicate records.

### Step 2: Keep allowDangerousEmailAccountLinking

The `allowDangerousEmailAccountLinking: true` setting is **still needed** because:

- It allows NextAuth to call our `signIn` callback for duplicate emails
- Our callback properly handles linking OAuth to existing Prisma `UserData` accounts
- Without it, NextAuth would still throw errors even without the adapter

### Step 3: Clean Up Old Adapter Collections

Run this cleanup script to remove old NextAuth adapter data:

```bash
mongosh "mongodb://localhost:27017/v2YogaDBSandbox?replicaSet=rs0"
```

Then in the MongoDB shell:

```javascript
// Check what needs to be cleaned
print('=== Current adapter collections ===')
print('users:', db.users.countDocuments())
print('accounts:', db.accounts.countDocuments())
print('sessions:', db.sessions.countDocuments())
print('verification_tokens:', db.verification_tokens.countDocuments())

// View the data before deleting
print('\n=== Users to be deleted ===')
db.users.find({}).forEach(printjson)

print('\n=== Accounts to be deleted ===')
db.accounts.find({}).forEach(printjson)

// BACKUP RECOMMENDATION: Export before deleting
// mongoexport --db=v2YogaDBSandbox --collection=users --out=backup_users.json
// mongoexport --db=v2YogaDBSandbox --collection=accounts --out=backup_accounts.json

// Delete the adapter collections (CAREFUL!)
db.users.drop()
db.accounts.drop()
db.sessions.drop()
db.verification_tokens.drop()

print('\n=== Cleanup complete ===')
print('users:', db.users.countDocuments())
print('accounts:', db.accounts.countDocuments())
```

## Current Database State

From local dev (identical to production):

### NextAuth Adapter Collections (TO BE REMOVED)

- `users`: 1 record (trewaters@gmail.com)
- `accounts`: 1 record (Google OAuth for above user)
- `sessions`: 0 records
- `verification_tokens`: 0 records

### Custom Prisma Collections (KEEP THESE)

- `UserData`: 7 users with full yoga app data
- `ProviderAccount`: 7 provider accounts linked to UserData
- All other yoga collections (AsanaPose, AsanaSeries, etc.)

## Testing After Cleanup

### 1. Test Local Development

```bash
# Start your dev server
npm run dev

# Try these login scenarios:
# 1. Sign in with Google (existing account)
# 2. Sign in with GitHub (if linked)
# 3. Sign in with credentials (email/password)
# 4. Link new OAuth provider to existing account
```

### 2. Verify Database State

```bash
mongosh "mongodb://localhost:27017/v2YogaDBSandbox?replicaSet=rs0" --eval "
  print('=== Adapter collections (should not exist) ===');
  print('users:', db.users.countDocuments());
  print('accounts:', db.accounts.countDocuments());
  print('\n=== Prisma collections (should exist) ===');
  print('UserData:', db.UserData.countDocuments());
  print('ProviderAccount:', db.ProviderAccount.countDocuments());
"
```

### 3. Deploy to Production

After testing locally:

1. **Backup production database first!**

   ```bash
   # Connect to production MongoDB
   mongosh "YOUR_PRODUCTION_CONNECTION_STRING"

   # In mongosh:
   db.users.find({}).forEach(function(doc) {
     printjson(doc);
   })
   ```

2. **Deploy code changes** (auth.ts modifications)

3. **Run cleanup script on production** (same script as above)

4. **Test production login** with affected user account

## Why This Fix Works

1. **Single Source of Truth**: Only `UserData` + `ProviderAccount` manage users
2. **No Adapter Conflicts**: NextAuth doesn't create duplicate records
3. **Proper Account Linking**: Our `signIn` callback handles all OAuth linking
4. **Session Management**: JWT strategy works without adapter
5. **Custom Yoga Fields**: All yoga-specific user data stays in `UserData`

## Rollback Plan

If issues occur:

1. **Re-enable the adapter**:

   ```typescript
   import { MongoDBAdapter } from '@auth/mongodb-adapter'
   import client from '@lib/mongoDb'

   const authConfig = {
     adapter: MongoDBAdapter(client),
     // ...
   }
   ```

2. **Restore backed-up collections**:

   ```bash
   mongoimport --db=v2YogaDBSandbox --collection=users --file=backup_users.json
   mongoimport --db=v2YogaDBSandbox --collection=accounts --file=backup_accounts.json
   ```

3. **Keep both approaches** (not recommended long-term):
   - Sync data between `users` and `UserData`
   - Add logic to check both collections
   - More complex, error-prone

## Benefits of This Approach

✅ **Eliminates duplicate email conflicts**
✅ **Simplifies authentication logic**
✅ **Maintains all yoga-specific user data**
✅ **Reduces database storage**
✅ **Improves query performance**
✅ **Easier to maintain and debug**

## Files Modified

1. `auth.ts`
   - Commented out `MongoDBAdapter` import
   - Commented out `client` import from `@lib/mongoDb`
   - Disabled `adapter: MongoDBAdapter(client)` in config
   - Kept `allowDangerousEmailAccountLinking: true` for OAuth providers

## Collections to Remove (Production & Dev)

- `users` (NextAuth adapter)
- `accounts` (NextAuth adapter)
- `sessions` (NextAuth adapter)
- `verification_tokens` (NextAuth adapter)

## Collections to Keep

- `UserData` (Prisma - main user data)
- `ProviderAccount` (Prisma - OAuth links)
- `UserLogin` (Prisma - login tracking)
- All yoga collections (AsanaPose, AsanaSeries, etc.)

## Date Fixed

November 9, 2025
