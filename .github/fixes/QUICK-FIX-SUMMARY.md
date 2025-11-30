# Production Login Fix - Quick Summary

## Problem

`OAuthAccountNotLinked: Another account already exists with the same e-mail address`

## Root Cause

**Dual user storage** - NextAuth's MongoDB adapter AND Prisma were both managing users, creating conflicting duplicate records.

## Solution (3 Steps)

### 1. Code Changes (auth.ts) ✅ COMPLETED

```typescript
// Allow email-based account linking
GitHub({
  allowDangerousEmailAccountLinking: true,
}),
Google({
  allowDangerousEmailAccountLinking: true,
}),

// Disable MongoDB adapter (we use Prisma instead)
// adapter: MongoDBAdapter(client), // Disabled
```

### 2. Clean Up Database Collections ⚠️ TODO

Run the cleanup script:

```bash
cd "c:\Users\trewa\Documents\Github\NextJS tutorials\soar"
bash scripts/cleanup-nextauth-adapter.sh
```

This removes NextAuth adapter collections:

- `users` (conflicts with `UserData`)
- `accounts` (conflicts with `ProviderAccount`)
- `sessions` (unused with JWT)
- `verification_tokens` (unused)

### 3. Deploy & Test 📋 TODO

#### Test Locally First

```bash
npm run dev

# Test these scenarios:
# 1. Sign in with Google (existing account)
# 2. Sign in with GitHub (if configured)
# 3. Sign in with credentials (email/password)
# 4. Link new OAuth to existing account
```

#### Deploy to Production

1. Backup production database first!
2. Deploy code changes
3. Run cleanup script on production
4. Test login with affected accounts

## What's Safe About This Fix?

✅ **Single source of truth**: Only `UserData` manages users (eliminates conflicts)
✅ **No data loss**: Cleanup script creates backups before deleting
✅ **Proper linking**: Our custom callback handles OAuth account linking safely
✅ **OAuth verification**: Google/GitHub verify email ownership before allowing sign-in
✅ **Audit trail**: All account linking operations are logged

## Quick Reference

- **Detailed fix docs**: `.github/fixes/oauth-account-linking-fix.md`
- **Cleanup details**: `.github/fixes/mongodb-adapter-cleanup.md`
- **Cleanup script**: `scripts/cleanup-nextauth-adapter.sh`
- **Code changes**: `auth.ts` (lines 1-160)

## Need to Rollback?

See "Rollback Plan" in `.github/fixes/mongodb-adapter-cleanup.md`

## Date

November 9, 2025
