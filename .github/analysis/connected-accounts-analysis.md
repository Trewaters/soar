# Connected Accounts Feature Analysis

## Overview

The Connected Accounts feature allows users to view and manage their authentication methods (OAuth providers and credentials) linked to their Soar yoga application account. This analysis details how the feature currently works and identifies gaps.

**Current URL:** `http://localhost:3000/navigator/profile/settings/connected-accounts`

---

## Current Architecture

### Database Schema (Prisma)

The `ProviderAccount` model stores all authentication methods:

```prisma
model ProviderAccount {
  id                   String  @id @default(auto()) @map("_id") @db.ObjectId
  userId               String  @db.ObjectId
  type                 String
  provider             String
  providerAccountId    String
  refresh_token        String?
  access_token         String?
  expires_at           Int?
  token_type           String?
  scope                String?
  id_token             String?
  session_state        Json?
  credentials_password String?  // <-- Password hash for credentials provider

  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  user UserData @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}
```

**Key Points:**

- Each provider (google, github, credentials) creates a `ProviderAccount` record
- The `credentials_password` field stores hashed passwords for the credentials provider
- OAuth providers store tokens and session data
- Multiple providers can be linked to one user

---

## Authentication Flow (NextAuth.js v5)

### Configured Providers in `auth.ts`

1. **GitHub OAuth** - Fully configured
2. **Google OAuth** - Fully configured
3. **Credentials** - Email/password authentication with custom authorize logic

### How Providers Are Created

#### OAuth Providers (Google, GitHub)

**New User Sign-up:**

```typescript
// When a new user signs in with OAuth (auth.ts lines 180-228)
await prisma.userData.create({
  data: {
    provider_id: user.id,
    name: user.name,
    email: user.email,
    // ... other user fields
    providerAccounts: {
      create: {
        provider: account.provider, // "google" or "github"
        providerAccountId: account.providerAccountId,
        refresh_token: account.refresh_token,
        access_token: account.access_token,
        type: account.type, // "oauth"
        // ... OAuth tokens
      },
    },
  },
})
```

**Existing User Linking:**

```typescript
// When existing user signs in with new OAuth provider (auth.ts lines 232-268)
await prisma.providerAccount.create({
  data: {
    userId: existingUser.id,
    provider: account.provider,
    providerAccountId: account.providerAccountId,
    type: account.type,
    // ... OAuth tokens
  },
})
```

#### Credentials Provider (Email/Password)

**New Account Creation:**

```typescript
// When user creates new credentials account (auth.ts lines 77-115)
const user = await prisma.userData.create({
  data: {
    email: email,
    name: email.split('@')[0],
    provider_id: `credentials_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    // ... other user fields
  },
})

// Create separate ProviderAccount with password
const hashedPassword = await hashPassword(password)
await prisma.providerAccount.create({
  data: {
    userId: user.id,
    provider: 'credentials',
    providerAccountId: user.id,
    type: 'credentials',
    credentials_password: hashedPassword,
  },
})
```

**⚠️ CRITICAL ISSUE:** The credentials authorize function for **existing user login** (lines 118-125) does NOT verify the password! It only checks if the user exists:

```typescript
// Handle existing user login
if (!user) {
  console.log('User not found for login:', email)
  return null
}

return {
  id: user!.id,
  name: user!.name,
  email: user!.email,
}
// Missing: password verification against credentials_password!
```

---

## Frontend UI Component

### File: `app/navigator/profile/settings/connected-accounts/page.tsx`

**Component Structure:**

1. Fetches connected accounts from API on mount
2. Displays hardcoded provider metadata
3. Shows connection status for each provider
4. Allows disconnecting providers (with safety check)

### Provider Metadata (Hardcoded)

```typescript
const PROVIDER_METADATA = {
  google: {
    name: 'Google',
    icon: '/icons/profile/auth-google.svg',
    available: true,
  },
  github: {
    name: 'GitHub',
    icon: '/icons/profile/auth-github-mark.svg',
    available: true,
  },
  instagram: {
    name: 'Instagram',
    icon: '/icons/profile/auth-instagram.svg',
    available: false, // Coming soon
  },
}
```

**⚠️ MISSING:** No `credentials` provider metadata! This is why email/password authentication doesn't appear in the UI.

### Key UI Features

1. **Add Login Method Button** - Currently shows alert "Coming soon!"
2. **Provider Cards** - Shows each provider with icon, name, status
3. **Disconnect Button** - Deletes provider account (disabled if only one method)
4. **Safety Checks:**
   - Cannot disconnect if only one authentication method remains
   - Confirmation dialog before disconnecting

---

## Backend API Routes

### File: `app/api/user/connected-accounts/route.ts`

#### GET Endpoint

**Purpose:** Fetch all connected provider accounts for current user

**Flow:**

1. Verify NextAuth session exists
2. Find user by email from session
3. Include `providerAccounts` relation
4. Transform and return provider data

**Response:**

```typescript
{
  accounts: [
    {
      provider: "google",
      providerAccountId: "123456789",
      connectedAt: "2025-11-16T12:00:00.000Z"
    }
  ],
  totalCount: 1
}
```

**✅ Works correctly** - Returns all providers including credentials

#### DELETE Endpoint

**Purpose:** Disconnect a provider from user account

**Flow:**

1. Verify session
2. Validate provider parameter (must be "google" or "github")
3. Find provider account
4. Check if it's the only authentication method (prevent deletion)
5. Delete provider account from database

**⚠️ ISSUE:** Validation only allows "google" or "github" - credentials cannot be deleted via this endpoint

```typescript
if (!provider || !['google', 'github'].includes(provider)) {
  return NextResponse.json(
    { error: 'Invalid provider. Must be "google" or "github"' },
    { status: 400 }
  )
}
```

---

## What's Working Today

### ✅ Google OAuth

- Provider configured in NextAuth
- Creates ProviderAccount with `provider: "google"`
- Appears in Connected Accounts API response
- Shows in UI (metadata defined)
- Can be disconnected via DELETE endpoint

### ✅ GitHub OAuth

- Provider configured in NextAuth
- Creates ProviderAccount with `provider: "github"`
- Appears in Connected Accounts API response
- Shows in UI (metadata defined)
- Can be disconnected via DELETE endpoint

### 🔄 Instagram OAuth

- Metadata exists in UI with `available: false`
- Shows as "Coming Soon"
- Not configured in NextAuth providers
- Cannot be connected yet

---

## What's NOT Working / Missing

### ❌ Credentials Provider Display

**Issue:** Email/password authentication method doesn't appear in UI

**Why:**

1. **Missing metadata** - No `credentials` entry in `PROVIDER_METADATA` object
2. **Provider stored** - Credentials ARE saved to database as `provider: "credentials"`
3. **API returns it** - GET endpoint includes credentials in response
4. **UI filters it** - Only iterates over hardcoded `PROVIDER_METADATA` keys

**Database Evidence:**

- When user creates account with email/password, a `ProviderAccount` is created with:
  ```typescript
  {
    provider: 'credentials',
    providerAccountId: user.id,
    type: 'credentials',
    credentials_password: hashedPassword
  }
  ```

### ❌ Credentials Password Verification (SECURITY ISSUE!)

**Critical Bug in `auth.ts` authorize function:**

The existing user login path (lines 118-125) does NOT verify passwords:

```typescript
// Handle existing user login
if (!user) {
  console.log('User not found for login:', email)
  return null
}

return {
  id: user!.id,
  name: user!.name,
  email: user!.email,
}
```

**What's missing:**

1. Fetch the user's `ProviderAccount` where `provider: "credentials"`
2. Extract `credentials_password` (hashed password)
3. Use `comparePassword(password, credentials_password)` to verify
4. Only return user object if password matches

**Current behavior:** Any user can log in with ANY password if they know the email!

### ❌ Cannot Disconnect Credentials

**Issue:** DELETE endpoint validation excludes credentials:

```typescript
if (!provider || !['google', 'github'].includes(provider)) {
  return NextResponse.json(
    { error: 'Invalid provider. Must be "google" or "github"' },
    { status: 400 }
  )
}
```

Should include: `['google', 'github', 'credentials']`

### ❌ "Add Login Method" Not Implemented

The "Add a new login method" button shows alert:

```typescript
const handleAddAccount = () => {
  alert('Adding new login methods is coming soon!')
}
```

**Should provide:**

- Modal/dialog to choose provider to add
- Redirect to OAuth flow for Google/GitHub
- Form to set password for credentials (if not already set)

---

## Expected Behavior vs Current Behavior

### User Expectation

"I should see ALL available login methods the app provides, including the credentials method I created my account with."

### Current Behavior

**Scenario 1: User signs up with email/password**

- ✅ Account created with credentials provider
- ✅ Password hashed and stored
- ❌ Credentials provider NOT shown in Connected Accounts UI
- ❌ User thinks they only have OAuth providers available
- ⚠️ Password not verified on subsequent logins!

**Scenario 2: User signs up with Google, then adds email/password**

- ✅ Google provider shown and working
- ❌ Credentials provider not visible
- User cannot see or manage their password authentication

**Scenario 3: User has Google + Credentials, wants to remove credentials**

- ❌ Cannot disconnect credentials via UI
- ❌ API endpoint rejects credentials as invalid provider

---

## Recommended Fixes

### Priority 1: Security - Fix Password Verification

**File:** `auth.ts` (lines 118-125)

Add password verification logic:

```typescript
// Handle existing user login
if (!user) {
  console.log('User not found for login:', email)
  return null
}

// Verify password for credentials provider
const providerAccount = await prisma.providerAccount.findFirst({
  where: {
    userId: user.id,
    provider: 'credentials',
  },
})

if (!providerAccount || !providerAccount.credentials_password) {
  console.log('No credentials provider found for user:', email)
  return null
}

// Compare provided password with stored hash
const { comparePassword } = await import('@app/utils/password')
const isValidPassword = await comparePassword(
  password,
  providerAccount.credentials_password
)

if (!isValidPassword) {
  console.log('Invalid password for user:', email)
  return null
}

return {
  id: user.id,
  name: user.name,
  email: user.email,
}
```

### Priority 2: UI - Add Credentials to PROVIDER_METADATA

**File:** `app/navigator/profile/settings/connected-accounts/page.tsx`

Add credentials entry:

```typescript
const PROVIDER_METADATA = {
  credentials: {
    name: 'Email & Password',
    icon: '/icons/profile/auth-credentials.svg', // Create this icon
    available: true,
  },
  google: {
    name: 'Google',
    icon: '/icons/profile/auth-google.svg',
    available: true,
  },
  github: {
    name: 'GitHub',
    icon: '/icons/profile/auth-github-mark.svg',
    available: true,
  },
  instagram: {
    name: 'Instagram',
    icon: '/icons/profile/auth-instagram.svg',
    available: false,
  },
}
```

### Priority 3: API - Allow Credentials Disconnect

**File:** `app/api/user/connected-accounts/route.ts`

Update validation in DELETE endpoint:

```typescript
if (!provider || !['google', 'github', 'credentials'].includes(provider)) {
  return NextResponse.json(
    { error: 'Invalid provider. Must be "google", "github", or "credentials"' },
    { status: 400 }
  )
}
```

### Priority 4: Feature - Implement Add Login Method

Add functionality to link new providers to existing account:

- Modal with provider selection
- OAuth redirect handling
- Password setup form for credentials
- Update UI after successful addition

---

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     User Authentication                      │
└─────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┼─────────────┐
                │             │             │
        ┌───────▼──────┐ ┌───▼────┐ ┌─────▼──────┐
        │   Google     │ │ GitHub │ │ Credentials│
        │   OAuth      │ │ OAuth  │ │ (Email/Pwd)│
        └───────┬──────┘ └───┬────┘ └─────┬──────┘
                │             │             │
                └─────────────┼─────────────┘
                              │
                    ┌─────────▼─────────┐
                    │  NextAuth.js v5   │
                    │   signIn callback │
                    └─────────┬─────────┘
                              │
                    ┌─────────▼─────────┐
                    │   Prisma Create   │
                    │  ProviderAccount  │
                    └─────────┬─────────┘
                              │
                    ┌─────────▼─────────┐
                    │  MongoDB Database │
                    │                   │
                    │  ProviderAccount  │
                    │  ├─ google        │
                    │  ├─ github        │
                    │  └─ credentials   │
                    └─────────┬─────────┘
                              │
            ┌─────────────────┼─────────────────┐
            │                 │                 │
    ┌───────▼────────┐ ┌─────▼──────┐ ┌───────▼────────┐
    │  GET /api/user │ │  Frontend  │ │ DELETE /api/   │
    │  /connected-   │ │  Component │ │ user/connected │
    │  accounts      │ │            │ │ -accounts      │
    └───────┬────────┘ └─────┬──────┘ └───────┬────────┘
            │                 │                 │
            │     ┌───────────▼─────────────┐   │
            └────►│  Connected Accounts UI  │◄──┘
                  │                         │
                  │  ✅ Google (shown)      │
                  │  ✅ GitHub (shown)      │
                  │  🔄 Instagram (coming)  │
                  │  ❌ Credentials (HIDDEN)│
                  └─────────────────────────┘
```

---

## Summary

### Current State

- **Google & GitHub OAuth**: Fully functional, visible, manageable
- **Instagram OAuth**: Placeholder for future implementation
- **Credentials Provider**:
  - ✅ Creates accounts successfully
  - ✅ Stores in database correctly
  - ❌ NOT displayed in UI (missing metadata)
  - ❌ Password NOT verified on login (security bug!)
  - ❌ Cannot be disconnected via API

### To Match User Expectations

1. Add credentials metadata to UI component
2. Fix password verification in auth.ts authorize function
3. Update API DELETE validation to include credentials
4. Create credentials icon (email/password icon)
5. Implement "Add Login Method" functionality
6. Consider showing different UI for credentials (password change option)

### Files Requiring Changes

1. `auth.ts` - Fix password verification (CRITICAL)
2. `app/navigator/profile/settings/connected-accounts/page.tsx` - Add credentials metadata
3. `app/api/user/connected-accounts/route.ts` - Allow credentials deletion
4. `public/icons/profile/` - Add credentials icon image
