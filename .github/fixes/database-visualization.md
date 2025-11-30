# MongoDB Collections - Before & After Fix

## Before Fix: Duplicate User Storage ❌

```
MongoDB Database: v2YogaDBSandbox
│
├── NextAuth Adapter Collections (AUTO-MANAGED)
│   ├── users (1 record)
│   │   └── trewaters@gmail.com ─── Causes conflict!
│   ├── accounts (1 record)
│   ├── sessions (0 records)
│   └── verification_tokens (0 records)
│
└── Prisma Application Collections (MANUAL)
    ├── UserData (7 records) ✅ Main user data
    │   ├── trewaters@hotmail.com (GitHub OAuth)
    │   ├── trewaters@gmail.com (Google OAuth) ─── Duplicate!
    │   ├── natasha.p.contact@gmail.com (Google OAuth)
    │   ├── bpshaman@gmail.com (credentials)
    │   ├── crshell22@gmail.com (credentials)
    │   ├── trewaters.test1@gmail.com (credentials)
    │   └── teppernaomi@gmail.com (credentials)
    │
    ├── ProviderAccount (7 records) ✅ OAuth links
    ├── UserLogin ✅ Login tracking
    ├── AsanaPose ✅ Yoga poses
    ├── AsanaSeries ✅ Yoga series
    ├── AsanaSequence ✅ Yoga sequences
    └── ... (other yoga collections)
```

### The Problem

- **Two collections** tracking `trewaters@gmail.com`
- NextAuth checks `users` first → finds duplicate → throws error
- Our `signIn` callback in `auth.ts` never runs
- `UserData` has all the yoga app data we actually use

---

## After Fix: Single Source of Truth ✅

```
MongoDB Database: v2YogaDBSandbox
│
├── NextAuth Adapter Collections ❌ REMOVED
│   (cleanup script deletes these)
│
└── Prisma Application Collections (ONLY USER SOURCE)
    ├── UserData (7 records) ✅ SINGLE user source
    │   ├── trewaters@hotmail.com (GitHub OAuth)
    │   ├── trewaters@gmail.com (Google OAuth) ← No conflict!
    │   ├── natasha.p.contact@gmail.com (Google OAuth)
    │   ├── bpshaman@gmail.com (credentials)
    │   ├── crshell22@gmail.com (credentials)
    │   ├── trewaters.test1@gmail.com (credentials)
    │   └── teppernaomi@gmail.com (credentials)
    │
    ├── ProviderAccount (7 records) ✅ OAuth links
    │   ├── userId: 673e49ea... → provider: github
    │   ├── userId: 673e5d2d... → provider: google
    │   ├── userId: 67a0f0d0... → provider: google
    │   ├── userId: 685a28ba... → provider: credentials
    │   ├── userId: 6865fe79... → provider: credentials
    │   ├── userId: 6871161a... → provider: credentials
    │   └── userId: 688570b1... → provider: credentials
    │
    ├── UserLogin ✅ Login tracking
    ├── AsanaPose ✅ Yoga poses
    ├── AsanaSeries ✅ Yoga series
    ├── AsanaSequence ✅ Yoga sequences
    └── ... (other yoga collections)
```

### The Solution

- **One collection** (`UserData`) for all users
- No NextAuth adapter interference
- `allowDangerousEmailAccountLinking` lets our callback handle duplicates
- Our `signIn` callback manages all OAuth linking in `ProviderAccount`
- Clean, simple, no conflicts

---

## Authentication Flow Comparison

### Before: Adapter + Prisma (Broken)

```
1. User tries OAuth login
2. NextAuth adapter checks `users` collection
3. Finds duplicate email → throws OAuthAccountNotLinked
4. ❌ Our signIn callback never runs
5. ❌ User can't log in
```

### After: Prisma Only (Working)

```
1. User tries OAuth login
2. allowDangerousEmailAccountLinking = true
3. ✅ Our signIn callback runs
4. ✅ Checks/creates user in UserData
5. ✅ Links OAuth in ProviderAccount
6. ✅ User logs in successfully
```

---

## Data Migration Check

### Users in NextAuth Adapter (TO DELETE)

```javascript
{
  _id: ObjectId('6910b0c21f76663e628bcba1'),
  email: 'trewaters@gmail.com',
  name: "Tre' Grisby",
  image: 'https://lh3.googleusercontent.com/...',
}
```

### Same User in Prisma UserData (KEEP)

```javascript
{
  _id: ObjectId('673e5d2d3d92e4747b15b287'),
  email: 'trewaters@gmail.com',
  name: "Tre' Grisby",
  image: 'https://lh3.googleusercontent.com/...',
  // Plus all yoga-specific fields:
  firstName: 'Tre',
  lastName: 'Grisby iii',
  bio: 'Working hard to bring dreams to life.',
  yogaStyle: 'Vinyasa Flow',
  yogaExperience: '3 years',
  profileImages: [...],
  activeProfileImage: '...',
  // ... etc
}
```

**Safe to delete adapter record** - all data is preserved in `UserData`

---

## Cleanup Verification Commands

### Check before cleanup:

```bash
mongosh "mongodb://localhost:27017/v2YogaDBSandbox?replicaSet=rs0" --eval "
  print('Adapter (to delete):', db.users.countDocuments());
  print('Prisma (to keep):', db.UserData.countDocuments());
"
```

### Check after cleanup:

```bash
mongosh "mongodb://localhost:27017/v2YogaDBSandbox?replicaSet=rs0" --eval "
  print('Adapter (should be 0):', db.getCollectionNames().includes('users') ? 'ERROR: still exists' : 'deleted ✓');
  print('Prisma (should be 7):', db.UserData.countDocuments());
"
```
