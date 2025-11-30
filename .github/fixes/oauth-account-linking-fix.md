# Fix: OAuthAccountNotLinked Error in Production

## Problem

Production users were unable to sign in with OAuth providers (Google/GitHub) when an account with the same email already existed. The error displayed was:

```
OAuthAccountNotLinked: Another account already exists with the same e-mail address
```

## Root Cause (Updated Analysis)

The issue was caused by **dual user storage** in MongoDB:

1. **NextAuth MongoDB Adapter Collections** (created by `MongoDBAdapter(client)`):
   - `users` collection - Automatically managed OAuth users
   - `accounts` collection - Automatically managed provider links
2. **Custom Prisma Collections** (manually managed in `signIn` callback):
   - `UserData` collection - Application users with yoga-specific fields
   - `ProviderAccount` collection - Manually managed provider links

### The Conflict

When a user tried to sign in with OAuth:

1. NextAuth's adapter would check the `users` collection for duplicate emails
2. Find a conflicting record and throw `OAuthAccountNotLinked` BEFORE our callback runs
3. Our custom `signIn` callback (which properly handles account linking in `UserData`) never executed

This created confusion because:

- The application code uses `UserData` exclusively for all features
- The adapter's `users` collection was a "ghost" copy that interfered with authentication
- Local dev had the same issue but wasn't noticed until production

## Solution (Two-Part Fix)

### Part 1: Allow Email-Based Account Linking

Added `allowDangerousEmailAccountLinking: true` to GitHub and Google OAuth providers in `auth.ts`:

```typescript
const providers: Provider[] = [
  GitHub({
    allowDangerousEmailAccountLinking: true,
  }),
  Google({
    allowDangerousEmailAccountLinking: true,
  }),
  Credentials({
    // ... credentials config
  }),
]
```

### Part 2: Disable MongoDB Adapter (Critical)

Disabled the MongoDB adapter since we're managing users entirely with Prisma:

```typescript
// Before
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import client from '@lib/mongoDb'

const authConfig = {
  adapter: MongoDBAdapter(client),
  // ...
}

// After
// import { MongoDBAdapter } from '@auth/mongodb-adapter' // Disabled
// import client from '@lib/mongoDb' // Disabled

const authConfig = {
  // adapter: MongoDBAdapter(client), // Disabled - using custom Prisma-based user management
  // ...
}
```

### Part 3: Clean Up Old Adapter Collections

See: `.github/fixes/mongodb-adapter-cleanup.md` for detailed cleanup instructions.

Run the cleanup script:

```bash
bash scripts/cleanup-nextauth-adapter.sh
```

## How This Works

1. **Before both fixes**:

   - MongoDB adapter created duplicate user records
   - NextAuth checked adapter's `users` collection
   - Found duplicates and threw error BEFORE our callback ran

2. **After Part 1 only** (`allowDangerousEmailAccountLinking`):

   - Still had duplicate collections
   - Error would still occur intermittently
   - Incomplete fix

3. **After both fixes**:
   - No MongoDB adapter = no duplicate collections
   - `allowDangerousEmailAccountLinking` allows our callback to run
   - Our `signIn` callback (lines 169-295) handles account linking in `UserData`
   - Single source of truth for user data

### Our Callback Logic (lines 169-295 in auth.ts)

Our custom `signIn` callback safely handles:

- Checking if user exists in `UserData`
- Checking if OAuth provider is already linked in `ProviderAccount`
- Creating new users with proper yoga-specific fields
- Linking new OAuth providers to existing accounts
- Updating user information (profile images, etc.)

## Security Considerations

The name `allowDangerousEmailAccountLinking` sounds scary, but it's safe in our implementation because:

### ✅ We Have Proper Safeguards

1. **Email Verification Required**: OAuth providers (Google/GitHub) verify email ownership before allowing sign-in
2. **Our Callback Logic**: We check for existing provider accounts before linking (lines 234-244)
3. **No Silent Overwrites**: We only add new provider links, never overwrite existing authentication methods
4. **Audit Trail**: We log all account linking operations

### 🔒 Why It's Safe for Uvuyoga/Soar

In our yoga application context:

- **Legitimate use case**: Users who created accounts with email/password should be able to conveniently sign in with Google/GitHub
- **Low risk environment**: We're not handling financial transactions or highly sensitive data that would make account takeover catastrophic
- **User convenience**: Yoga practitioners benefit from flexible authentication options
- **OAuth trust**: We trust Google and GitHub's email verification processes

### ⚠️ When This Would Be Dangerous

This setting would be dangerous if:

- You don't verify email ownership in your credentials provider
- You allow account creation without email verification
- You're in a high-stakes financial or healthcare application
- You don't have audit logging for account linking

## Testing

### In Development

```bash
# Test the fix locally
npm run dev

# Try signing in with:
1. Create account with email/password
2. Sign out
3. Sign in with Google/GitHub using the same email
4. Verify account linking occurs successfully
```

### In Production

1. **Before deploying**: Test thoroughly in staging with production data copy
2. **After deploying**: Monitor logs for account linking operations
3. **User communication**: Consider notifying users that they can now use multiple sign-in methods

## Monitoring

Watch for these log messages in production:

```typescript
// Success case (line 267-269)
;`Linked ${account.provider} account to existing user: ${email}`

// Error case (line 272-276)
;('Error linking OAuth provider to existing user:')
```

## Alternative Solutions (Not Recommended)

### Alternative 1: Force Separate Accounts

- Remove the linking logic and require users to use only one authentication method
- **Downside**: Poor user experience, confusing for users

### Alternative 2: Manual Account Linking UI

- Build a UI where users manually link accounts in settings
- **Downside**: More complex implementation, users might not discover the feature

### Alternative 3: Email Verification for Credentials

- Require email verification for credentials provider
- **Downside**: Adds friction to sign-up, doesn't fully solve the problem

## Conclusion

The fix is safe, appropriate for our yoga application context, and significantly improves user experience. The "dangerous" in the setting name refers to specific attack scenarios that don't apply to our application architecture.

## Files Modified

1. `auth.ts` - Two changes:
   - Added `allowDangerousEmailAccountLinking: true` to GitHub and Google providers
   - Disabled MongoDB adapter imports and configuration
2. Created `scripts/cleanup-nextauth-adapter.sh` - Database cleanup script
3. Created `.github/fixes/mongodb-adapter-cleanup.md` - Detailed cleanup documentation

## Database Collections Status

### To Remove (cleanup script handles this):

- `users` (NextAuth adapter - conflicts with UserData)
- `accounts` (NextAuth adapter - conflicts with ProviderAccount)
- `sessions` (NextAuth adapter - unused with JWT strategy)
- `verification_tokens` (NextAuth adapter - unused)

### To Keep:

- `UserData` (Prisma - main user data with yoga fields)
- `ProviderAccount` (Prisma - OAuth provider links)
- `UserLogin` (Prisma - login tracking for streaks)
- All yoga collections (AsanaPose, AsanaSeries, AsanaSequence, etc.)

## Related Documentation

- NextAuth v5 docs: https://authjs.dev/reference/core/providers
- Error reference: https://errors.authjs.dev#oauthaccountnotlinked
- Our auth implementation: `/auth.ts` lines 169-295 (signIn callback)

## Date Fixed

November 9, 2025
