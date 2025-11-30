# Analysis: Social Authentication Image Not Displaying

## Problem Summary

The user's social authentication profile image (from GitHub/Google OAuth) is not displaying even though they authenticated via a social provider. The database has been deleted since account creation, so any data that was only stored in MongoDB is now lost.

## Root Cause Analysis

### 1. **Image Data is Stored in MongoDB, Not Retrieved from OAuth Provider at Session Time**

The social provider image (user avatar from GitHub/Google) is stored in the MongoDB `UserData` collection during **initial account creation** in the `signIn` callback:

**File: `auth.ts` (lines 174-183)**

```typescript
await prisma.userData.create({
  data: {
    provider_id: user.id,
    name: user.name,
    email: user.email,
    emailVerified: new Date(),
    image: user.image, // ← Social provider image stored HERE during initial signup
    // ... other fields
  },
})
```

### 2. **The Problem: Database Deletion**

When you deleted the MongoDB database:

- ✅ **NextAuth session still works** - because NextAuth stores session data in a separate MongoDB collection via `MongoDBAdapter`
- ❌ **User profile data lost** - including the `image` field that contained the OAuth provider avatar URL
- ❌ **No re-fetch from provider** - The system doesn't re-fetch the social image from GitHub/Google on subsequent logins

### 3. **How the Image Display System Works**

**File: `app/hooks/useActiveProfileImage.ts`**

The image priority system follows this order:

```typescript
// Priority 1: User's uploaded custom image (active selection)
if (userData.activeProfileImage && profileImages.includes(activeProfileImage)) {
  return userData.activeProfileImage
}

// Priority 2: User's first uploaded image
if (userData.profileImages && userData.profileImages.length > 0) {
  return userData.profileImages[0]
}

// Priority 3: Social provider image from OAuth (GitHub/Google)
if (userData.image) {
  // ← THIS IS NULL because database was deleted
  return userData.image
}

// Priority 4: Placeholder
return '/images/profile-placeholder.png' // ← YOU ARE HERE
```

**The `userData.image` field is empty** because:

1. It was only populated during initial account creation
2. The database was deleted, so this data is gone
3. No mechanism exists to re-populate it from the OAuth provider on subsequent logins

## Technical Flow Analysis

### Account Creation Flow (What Should Happen)

```
1. User clicks "Sign in with GitHub/Google"
   ↓
2. OAuth provider authenticates and returns user data
   ↓
3. NextAuth `signIn` callback fires (auth.ts line 164)
   ↓
4. Check if user exists in MongoDB UserData collection
   ↓
5. If NOT exists → Create new UserData record with:
   - provider_id: user.id
   - name: user.name
   - email: user.email
   - image: user.image  ← Social provider avatar URL stored here
   ↓
6. User record created in MongoDB
```

### Current Session Flow (What's Happening Now)

```
1. User is authenticated (NextAuth session exists)
   ↓
2. Session contains: { user: { id, name, email } }
   ↓
3. ProfileNavMenu component loads
   ↓
4. useActiveProfileImage hook checks UserContext
   ↓
5. UserContext fetches userData via API: /api/user/?email=...
   ↓
6. API returns UserData from MongoDB
   ↓
7. UserData exists but `image` field is NULL or empty string
   (because database was recreated without this field)
   ↓
8. useActiveProfileImage returns placeholder image
```

## Why Social Image is Not Re-Fetched

### NextAuth Session Callback

**File: `auth.ts` (lines 227-244)**

```typescript
async session({ session, token }: { session: any; token: any }) {
  if (session?.user && token.id) {
    session.user.id = token.id as string
  }
  if (session?.user && token.email) {
    session.user.email = token.email as string
  }
  if (session?.user && token.name) {
    session.user.name = token.name as string
  }
  return session
}
```

**Problem:** The session callback only passes through `id`, `email`, and `name`. It does NOT pass the `image` field from the OAuth provider to the session.

### JWT Callback

**File: `auth.ts` (lines 246-328)**

The JWT callback handles token validation and user existence checks, but it does NOT:

- Store the OAuth provider image in the token
- Update the UserData `image` field on subsequent logins
- Re-fetch the social provider image from GitHub/Google APIs

## Database Schema Verification

**File: `prisma/schema.prisma` (lines 12-67)**

```prisma
model UserData {
  id               String    @id @default(auto()) @map("_id") @db.ObjectId
  provider_id      String?   @unique
  name             String?
  email            String?   @unique
  emailVerified    DateTime?
  image            String?   // ← This field exists but is empty
  // ... other fields
  profileImages      String[]  // ← Custom uploaded images (also empty)
  activeProfileImage String?   // ← Active selection (also empty)
}
```

The schema supports the `image` field, but it's not being populated.

## Solutions

### Option 1: Re-Populate Image on Every Login (Recommended)

Modify the `signIn` callback to update the `image` field for existing users:

**File: `auth.ts`**

```typescript
async signIn({ user, account, profile }: { user: any; account: any; profile?: any }) {
  const email = user.email
  const existingUser = await prisma.userData.findUnique({
    where: { email: email ?? undefined },
  })

  if (!existingUser && account) {
    // Create new user (existing code)
    await prisma.userData.create({ /* ... */ })
  } else if (existingUser && user.image) {
    // ✅ NEW: Update existing user's image field with latest OAuth provider image
    await prisma.userData.update({
      where: { email: email ?? undefined },
      data: {
        image: user.image,  // Re-populate social provider image
        updatedAt: new Date(),
      },
    })
  }

  return true
}
```

### Option 2: Pass Image Through Session

Add the OAuth image to the session so it's available client-side:

**File: `auth.ts`**

```typescript
async session({ session, token }: { session: any; token: any }) {
  if (session?.user && token.id) {
    session.user.id = token.id as string
  }
  if (session?.user && token.email) {
    session.user.email = token.email as string
  }
  if (session?.user && token.name) {
    session.user.name = token.name as string
  }

  // ✅ NEW: Add image to session
  if (session?.user && token.picture) {
    session.user.image = token.picture as string
  }

  return session
}

async jwt({ token, account }: { token: any; account?: any }) {
  // ✅ NEW: Store image in JWT token
  if (account?.provider === 'github' || account?.provider === 'google') {
    const user = await prisma.userData.findUnique({
      where: { email: token.email as string },
    })
    if (user?.image) {
      token.picture = user.image
    }
  }

  return token
}
```

### Option 3: Migrate Existing Users

Run a one-time script to fetch GitHub/Google images for existing users:

```typescript
// scripts/migrate-social-images.ts
import { PrismaClient } from '../prisma/generated/client'

const prisma = new PrismaClient()

async function migrateImages() {
  const users = await prisma.userData.findMany({
    where: {
      image: null, // or { equals: '' }
      provider_id: { not: null },
    },
    include: {
      providerAccounts: true,
    },
  })

  for (const user of users) {
    const githubAccount = user.providerAccounts.find(
      (a) => a.provider === 'github'
    )
    const googleAccount = user.providerAccounts.find(
      (a) => a.provider === 'google'
    )

    if (githubAccount) {
      // Fetch from GitHub API using providerAccountId
      const response = await fetch(
        `https://api.github.com/user/${githubAccount.providerAccountId}`
      )
      const data = await response.json()

      await prisma.userData.update({
        where: { id: user.id },
        data: { image: data.avatar_url },
      })
    } else if (googleAccount) {
      // Google images are harder to fetch after the fact
      // Would need to use Google People API with stored access_token
    }
  }
}

migrateImages()
```

## Immediate Fix for Your Test User

Since your database was deleted, the easiest immediate fix is:

1. **Sign out completely**
2. **Delete your account** (if possible via the app)
3. **Sign in again with GitHub/Google**

This will trigger the `signIn` callback again and re-create your UserData record with the `image` field populated.

**OR**

Manually update your user record in MongoDB:

```javascript
// In MongoDB shell or Compass
db.UserData.updateOne(
  { email: 'your-test-email@example.com' },
  {
    $set: {
      image: 'https://avatars.githubusercontent.com/u/YOUR_GITHUB_ID',
      updatedAt: new Date(),
    },
  }
)
```

## Recommended Solution

**Implement Option 1** - Update the `signIn` callback to refresh the `image` field on every login. This ensures:

- ✅ OAuth provider images are always current
- ✅ Works even if database is deleted and recreated
- ✅ Handles profile picture changes on GitHub/Google
- ✅ No manual migration needed
- ✅ Minimal code changes

## Summary

**Why you don't see your social image:**

1. ✅ Social provider image (`user.image`) is stored in MongoDB during initial account creation
2. ❌ Your MongoDB database was deleted, losing the `image` field value
3. ❌ On subsequent logins, NextAuth doesn't re-populate the `image` field in UserData
4. ❌ The `useActiveProfileImage` hook falls back to placeholder because `userData.image` is empty

**Fix:** Update the `signIn` callback in `auth.ts` to refresh the `image` field for existing users on every login, or manually re-populate your test user's image field in MongoDB.
