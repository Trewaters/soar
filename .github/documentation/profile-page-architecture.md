# User Profile Page Architecture

## Overview

This document maps all files involved in rendering the `/navigator/profile` page at `http://localhost:3000/navigator/profile`.

---

## Page Routing & Layout Hierarchy

### 1. Root Layout

**File:** `app/layout.tsx`

- Wraps the entire application
- Provides global metadata, viewport settings
- Integrates all context providers via `<Providers>`
- Handles session authentication via NextAuth

### 2. Navigator Layout

**File:** `app/navigator/layout.tsx`

- Layout wrapper for all `/navigator/*` routes
- Includes:
  - `<Header>` component (top navigation)
  - `<NavBottom>` component (bottom navigation)
  - Main content area with proper spacing
  - Skip link for accessibility

### 3. Profile Page

**File:** `app/navigator/profile/page.tsx`

- Main entry point for `/navigator/profile` route
- Grid layout with two columns:
  - **Left column (xs=12, md=4)**: `<ProfileNavMenu>`
  - **Right column (xs=12, md=8)**: `<ClientWrapper>` (toggles between view/edit modes)

---

## Core Components

### Profile Page Components

#### 1. **ProfileNavMenu**

**File:** `app/navigator/profile/ProfileNavMenu.tsx`

**Purpose:** Navigation sidebar for profile section

**Features:**

- User profile header with avatar and basic info
- Navigation menu items:
  - Profile Overview (`/navigator/profile`)
  - My Library (`/navigator/profile/library`)
  - Account Settings (`/navigator/profile/settings`)
  - Home Page (`/navigator`)
  - Logout action
- Highlights current active route
- Displays user's yoga style as a chip

**Dependencies:**

- `useSession()` from `next-auth/react`
- `UseUser()` context for user data
- `useActiveProfileImage()` hook
- `useNavigationWithLoading()` hook
- MUI components (Paper, List, Avatar, etc.)

**API Calls:**

- `GET /api/user/?email={email}` - Fetches user data if not in context

---

#### 2. **UserDetails**

**File:** `app/navigator/profile/UserDetails.tsx`

**Purpose:** Display-only view of user profile information

**Features:**

- User profile header with yoga practitioner icon
- Large user avatar (uses `<UserAvatar>`)
- Member since date
- Share profile functionality (native share API or clipboard fallback)
- Share preview card with formatted user info
- Display fields:
  - Username
  - First Name / Last Name
  - Pronouns
  - Headline
  - Bio
  - Website URL
  - Location
  - Email (read-only)

**Dependencies:**

- `UseUser()` context
- `useSession()` from `next-auth/react`
- `UserAvatar` component
- MUI components (Paper, Stack, Typography, Card, etc.)

**API Calls:**

- `GET /api/user/?email={email}` - Fetches complete user data on mount

**Special Features:**

- Share functionality using Web Share API
- Generates formatted share preview text
- Loading state for user data fetch

---

#### 3. **EditUserDetails**

**File:** `app/navigator/profile/editUserDetails.tsx`

**Purpose:** Edit mode for user profile with form inputs

**Features:**

- Profile image management (upload, delete, set active)
- Editable form fields:
  - Name (username)
  - First Name / Last Name
  - Pronouns
  - Headline
  - Bio (multiline)
  - Website URL
  - Location (with LocationPicker component)
  - Location visibility toggle
  - Yoga Style (autocomplete)
  - Yoga Experience
  - Company
  - Social URL
  - Quick Share Message
- Activity Streaks widget
- Save/Cancel actions
- Optimistic UI updates
- Mobile-friendly input fields

**Dependencies:**

- `UseUser()` context
- `useSession()` from `next-auth/react`
- `ProfileImageManager` component
- `LocationPicker` component
- `ActivityStreaks` component
- `TextInputField` component
- Mobile theme helpers
- MUI components (TextField, Autocomplete, Button, etc.)

**API Calls:**

- `POST /api/user` - Updates user profile data
- `GET /api/profileImage/get` - Fetches user's profile images
- `POST /api/profileImage` - Uploads new profile image
- `DELETE /api/profileImage/delete` - Deletes profile image
- `POST /api/profileImage/setActive` - Sets active profile image

**Props:**

- `onSaveSuccess?: () => void` - Callback after successful save

---

### Shared Components

#### 4. **UserAvatar**

**File:** `app/clientComponents/UserAvatar.tsx`

**Purpose:** Reusable avatar component with automatic profile image handling

**Features:**

- Size variants (small, medium, large)
- Automatic fallback hierarchy:
  1. Active profile image
  2. OAuth provider image
  3. Placeholder image
- Optional upload functionality
- Placeholder indicator option
- Loading state during upload

**Props:**

```typescript
{
  size?: 'small' | 'medium' | 'large'
  showPlaceholderIndicator?: boolean
  alt?: string
  enableUpload?: boolean
  ...AvatarProps // Standard MUI Avatar props
}
```

---

#### 5. **ProfileImageManager**

**File:** `app/clientComponents/ProfileImage/ProfileImageManager.tsx`

**Purpose:** Comprehensive profile image management interface

**Features:**

- Upload new images
- View all uploaded images
- Delete images
- Set active profile image
- Grid display of images
- Modal interface

**Related Files:**

- `app/clientComponents/ProfileImage/ProfileImageUpload.tsx` - Upload UI
- `app/clientComponents/ProfileImage/ProfileImageDisplay.tsx` - Image grid display

---

#### 6. **LocationPicker**

**File:** `app/clientComponents/locationPicker.tsx`

**Purpose:** Location input with Google Maps integration

**Features:**

- Autocomplete location search
- Map display
- Location visibility toggle

---

#### 7. **ActivityStreaks**

**File:** `app/clientComponents/activityStreaks/ActivityStreaks.tsx`

**Purpose:** Display user's login streak and activity statistics

---

## Context Providers

### UserContext

**File:** `app/context/UserContext.tsx`

**Purpose:** Global state management for user data

**State:**

```typescript
{
  userData: UserData
  userGithubProfile: UserGithubProfile
  userGoogleProfile: UserGoogleProfile
}
```

**Actions:**

- `SET_USER` - Updates userData
- `SET_PROFILE_IMAGES` - Updates profile images
- `CLEAR_USER` - Clears user data
- And more...

**Hook:** `UseUser()` - Access user context

---

## Custom Hooks

### useActiveProfileImage

**File:** `app/hooks/useActiveProfileImage.ts`

**Purpose:** Get user's active profile image with fallback logic

**Returns:**

```typescript
{
  activeImage: string // URL of active image
  isPlaceholder: boolean // Whether showing placeholder
  hasCustomImage: boolean // Whether user has uploaded images
  imageCount: number // Total number of uploaded images
}
```

**Fallback Priority:**

1. Active profile image from uploads
2. First uploaded image
3. OAuth provider image
4. Placeholder image

---

### useNavigationWithLoading

**File:** `app/hooks/useNavigationWithLoading.ts`

**Purpose:** Navigation with loading state management

---

## API Routes

### User Data API

#### GET `/api/user`

**File:** `app/api/user/route.ts`

**Purpose:** Fetch user data by email

**Query Parameters:**

- `email` (required) - User's email address

**Response:**

```typescript
{
  success: boolean
  data: UserData
}
```

---

#### POST `/api/user`

**File:** `app/api/user/route.ts`

**Purpose:** Update user profile data

**Body:** Partial user data object

**Response:**

```typescript
{
  success: boolean
  message: string
  data: UserData
}
```

---

### Profile Image APIs

#### GET `/api/profileImage/get`

**File:** `app/api/profileImage/get/route.ts`

**Purpose:** Get all profile images for current user

**Response:**

```typescript
{
  success: boolean
  images: string[]
  activeImage: string | null
}
```

---

#### POST `/api/profileImage`

**File:** `app/api/profileImage/route.ts`

**Purpose:** Upload new profile image

**Body:** FormData with `file` field

**Response:**

```typescript
{
  success: boolean
  images: string[]
  activeProfileImage: string
}
```

---

#### DELETE `/api/profileImage/delete`

**File:** `app/api/profileImage/delete/route.ts`

**Purpose:** Delete a profile image

**Body:**

```typescript
{
  url: string // Image URL to delete
}
```

---

#### POST `/api/profileImage/setActive`

**File:** `app/api/profileImage/setActive/route.ts`

**Purpose:** Set active profile image

**Body:**

```typescript
{
  url: string // Image URL to set as active
}
```

---

## Data Models

### UserData Type

**File:** `types/models/user.ts`

```typescript
{
  id: string
  provider_id: string
  name: string
  email: string
  emailVerified: Date
  image: string
  pronouns: string
  profile: Record<string, any>
  createdAt: Date
  updatedAt: Date
  firstName: string
  lastName: string
  bio: string
  headline: string
  location: string
  websiteURL: string
  shareQuick: string
  yogaStyle: string
  yogaExperience: string
  company: string
  socialURL: string
  isLocationPublic: string
  role: string
  profileImages: string[]
  activeProfileImage?: string
}
```

---

## Authentication

### NextAuth Session

**File:** `auth.ts`

**Providers:**

- GitHub OAuth
- Google OAuth
- Credentials (email/password)

**Session Strategy:** JWT

**Callbacks:**

- `jwt` - Adds user data to token
- `session` - Adds user data to session

---

## Related Pages

### Profile Sub-pages

#### Library Page

**File:** `app/navigator/profile/library/page.tsx`

- Route: `/navigator/profile/library`
- Shows user's saved yoga content

#### Settings Page

**File:** `app/navigator/profile/settings/page.tsx`

- Route: `/navigator/profile/settings`
- Account settings and preferences
- Links to:
  - Notifications settings
  - Feedback form
  - Privacy policy

#### Feedback Page

**File:** `app/navigator/profile/feedback/page.tsx`

- Route: `/navigator/profile/feedback`
- User feedback form

#### Privacy Policy Page

**File:** `app/navigator/profile/privacy-policy/page.tsx`

- Route: `/navigator/profile/privacy-policy`
- Privacy policy information

---

## Navigation Components

### Header

**File:** `components/header.tsx`

- Top navigation bar
- Hamburger menu
- User session display

### NavBottom

**File:** `components/navBottom.tsx`

- Bottom navigation for mobile
- Route highlighting
- Profile section detection

---

## Styling & Theme

### Theme Configuration

**File:** `app/styles/theme.ts`

- MUI theme customization
- Color palette
- Typography
- Responsive breakpoints

### Global Styles

**File:** `styles/globals.css`

- CSS reset
- Global styles
- Utility classes

---

## Testing Files

All test files are located in `__test__/app/navigator/profile/`:

- `UserDetails.spec.tsx` - UserDetails component tests
- `UserDetails.locationPicker.spec.tsx` - Location picker integration tests
- `ProfileNavMenu.spec.tsx` - ProfileNavMenu component tests
- `library/page.spec.tsx` - Library page tests

---

## Key Features Summary

### View Mode (UserDetails)

✅ Display user information
✅ Share profile functionality
✅ Member since date
✅ Large avatar display
✅ Responsive layout

### Edit Mode (EditUserDetails)

✅ Edit all profile fields
✅ Upload/manage profile images
✅ Location picker with map
✅ Yoga style autocomplete
✅ Activity streaks widget
✅ Optimistic UI updates
✅ Mobile-friendly inputs
✅ Save/Cancel actions

### Profile Navigation

✅ Profile overview
✅ Library access
✅ Settings access
✅ Home navigation
✅ Logout functionality
✅ Active route highlighting

---

## Data Flow

```
User visits /navigator/profile
    ↓
app/layout.tsx (Auth + Providers)
    ↓
app/navigator/layout.tsx (Header + NavBottom)
    ↓
app/navigator/profile/page.tsx
    ↓
┌─────────────────────┬─────────────────────┐
│  ProfileNavMenu     │  ClientWrapper      │
│  (Left Sidebar)     │  (Main Content)     │
│                     │                     │
│  - User Header      │  [View Mode]        │
│  - Navigation Items │  UserDetails        │
│  - Logout           │      or             │
│                     │  [Edit Mode]        │
│                     │  EditUserDetails    │
└─────────────────────┴─────────────────────┘
    ↓                         ↓
UserContext            API Calls:
(Global State)         - GET /api/user
                       - POST /api/user
                       - Profile Image APIs
```

---

## Quick Reference: File Locations

### Core Profile Files

```
app/navigator/profile/
├── page.tsx                    # Main profile page
├── UserDetails.tsx             # View mode
├── editUserDetails.tsx         # Edit mode
└── ProfileNavMenu.tsx          # Navigation sidebar
```

### Supporting Components

```
app/clientComponents/
├── UserAvatar.tsx              # Avatar component
├── locationPicker.tsx          # Location picker
├── activityStreaks/
│   └── ActivityStreaks.tsx     # Activity widget
├── inputComponents/
│   └── TextInputField.tsx      # Input component
└── ProfileImage/
    ├── ProfileImageManager.tsx # Image management
    ├── ProfileImageUpload.tsx  # Upload UI
    └── ProfileImageDisplay.tsx # Image grid
```

### API Routes

```
app/api/
├── user/
│   └── route.ts                # User CRUD
└── profileImage/
    ├── route.ts                # Upload image
    ├── get/route.ts            # Get images
    ├── delete/route.ts         # Delete image
    └── setActive/route.ts      # Set active image
```

### Context & Hooks

```
app/
├── context/
│   └── UserContext.tsx         # User state management
└── hooks/
    ├── useActiveProfileImage.ts # Profile image hook
    └── useNavigationWithLoading.ts # Navigation hook
```

---

## Development Notes

### To Update Profile Page:

1. **Layout changes**: Edit `app/navigator/profile/page.tsx`
2. **View mode changes**: Edit `app/navigator/profile/UserDetails.tsx`
3. **Edit mode changes**: Edit `app/navigator/profile/editUserDetails.tsx`
4. **Navigation changes**: Edit `app/navigator/profile/ProfileNavMenu.tsx`
5. **Add new fields**:
   - Update `types/models/user.ts` (UserData type)
   - Update `UserDetails.tsx` (display)
   - Update `editUserDetails.tsx` (form)
   - Update `app/api/user/route.ts` (API)
   - Update database schema if needed

### Adding New Profile Sub-pages:

1. Create folder: `app/navigator/profile/[new-page]/`
2. Add `page.tsx` in new folder
3. Add menu item in `ProfileNavMenu.tsx`
4. Create tests in `__test__/app/navigator/profile/[new-page]/`

---

## Dependencies Summary

**External Libraries:**

- `next` - Framework
- `next-auth` - Authentication
- `@mui/material` - UI components
- `react` - Core library
- `@prisma/client` - Database ORM

**Internal Dependencies:**

- UserContext - Global user state
- Theme configuration - Styling
- API routes - Data fetching/updating
- Custom hooks - Shared logic

---

This architecture provides a complete, maintainable user profile system with authentication, image management, and comprehensive user data editing capabilities.
