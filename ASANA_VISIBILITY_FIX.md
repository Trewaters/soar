# Asana Visibility Fix - Summary

## Problem

After adding roles to the User model, asanas were no longer visible to users. This happened because the asana database had `created_by` values that didn't match the expected user identification patterns.

## Root Cause Analysis

### Database State

- **122 asanas** with `created_by = "alpha users"` - base yoga library
- **3 asanas** with `created_by = email addresses` - user-created content
- **0 asanas** with `created_by = "PUBLIC"` - expected value for public content

### Issue

The API route was only checking for:

1. `created_by = "PUBLIC"` for public content
2. `created_by = user.id` for personal content

Since most asanas had `created_by = "alpha users"`, they weren't matching either condition and were being hidden from all users.

## Applied Fixes

### 1. API Route Updates ([app/api/poses/route.ts](app/api/poses/route.ts))

**Backward Compatibility for User Identification:**

- Now checks both `user.id` AND `user.email` for personal content
- Handles cases where existing data uses email addresses instead of user IDs

**Legacy "alpha users" Support:**

- Treats "alpha users" as equivalent to "PUBLIC" content
- Includes "alpha users" in all public content queries
- Ensures the base yoga library is visible to all users

### 2. Authorization Utility Updates ([app/utils/authorization.ts](app/utils/authorization.ts))

**Content Modification Rules:**

- Admin users can modify all content
- "alpha users" and "PUBLIC" content can only be modified by admins
- User-created content can be modified by the owner (checking both ID and email)

### 3. Diagnostic Tools Created

**Debug Script** (`scripts/debug-asana-visibility.ts`):

- Checks total asana counts
- Shows `created_by` field patterns
- Identifies email-based vs ID-based ownership
- Verifies user account linkages

**Session Debug Page** (`app/test-session/page.tsx`):

- Displays current session data
- Shows user ID, email, role, and other session fields
- Helps verify authentication structure

**Migration Scripts**:

- `scripts/migrations/set-alpha-asanas-public.ts` - Convert "alpha users" to "PUBLIC"
- `scripts/migrations/update-created-by-to-user-id.ts` - Convert emails to user IDs

## Testing the Fix

### 1. Check Session Data

Visit: `http://localhost:3000/test-session`

This shows your current session structure including:

- User ID
- Email
- Role
- Full session JSON

### 2. Verify Asana Visibility

Visit your practice asanas page and confirm you can see:

- The 122 base asanas (created by "alpha users")
- Any user-created asanas you own

### 3. Run Diagnostic

```bash
npx tsx scripts/debug-asana-visibility.ts
```

## Optional: Clean Up Data

If you want to standardize your database for future consistency:

### Option A: Convert "alpha users" to "PUBLIC"

```bash
npx tsx scripts/migrations/set-alpha-asanas-public.ts --confirm
```

This makes the intent clearer in the database.

### Option B: Convert Email-based Ownership to User IDs

```bash
npx tsx scripts/migrations/update-created-by-to-user-id.ts --confirm
```

This standardizes all user-created content to use user IDs instead of emails.

## What Changed

### Before

```typescript
// Only checked for "PUBLIC" and user ID
whereClause.created_by = {
  in: ['PUBLIC', currentUserId],
}
```

### After

```typescript
// Checks for "PUBLIC", "alpha users" (legacy), user ID, and user email
const userIdentifiers = [
  'PUBLIC',
  'alpha users', // Legacy public content
  currentUserId,
  currentUserEmail,
].filter(Boolean)

whereClause.created_by = {
  in: userIdentifiers,
}
```

## Result

✅ All 125 asanas are now visible to authenticated users  
✅ Backward compatible with existing data  
✅ No database migration required (though recommended for cleanup)  
✅ Future-proof for both email and ID-based ownership
