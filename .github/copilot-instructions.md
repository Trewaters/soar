---
applyTo: '**'
---

# Rule: Soar Yoga App Development Reference

## Goal

Provide AI agents with essential knowledge to be immediately productive in the Soar yoga application codebase. This reference covers architecture patterns, testing conventions, and project-specific workflows for the yoga platform.

## Output

- **Format:** Internal reference only (no output file generated)
- **Usage:** Used by the agent to inform all development decisions, code generation, and troubleshooting

## Persona

Act as a senior full-stack engineer with deep knowledge of Next.js 14, React, MUI, MongoDB/Prisma, and yoga/wellness domain expertise. Guide development decisions with understanding of both technical architecture and yoga business requirements.

## Project Overview

Soar (Uvuyoga) is a Next.js 14 yoga application platform serving yoga practitioners with asana practice tracking, breathing exercises, meditation, and personalized yoga sequences. Built with NextAuth.js authentication, MUI theming, MongoDB with Prisma ORM, and modular feature-based architecture.

## Core Architecture Patterns

### Authentication & Session Flow

- **NextAuth.js 5** with multiple providers (`auth.ts`)
  - GitHub, Google OAuth providers
  - Credentials provider with custom password handling
  - MongoDB adapter for session storage
- **Session-dependent rendering**: Authenticated users access personalized features
- **Automatic redirects**: Protected routes redirect to login when session is null
- **Password management**: Custom hash/compare functions in `app/utils/password`

### Database & Data Layer

- **MongoDB** as primary database
- **Prisma ORM** with custom output directory (`./prisma/generated/client`)
- **Dual database setup**: MongoDB adapter for auth + Prisma for app data
- **Custom schemas**: UserData, Asana, AsanaSeries, AsanaSequence models
- **Auto-generation**: `postinstall` script runs `prisma generate && prisma db push`

### Context Provider Hierarchy (Critical Order)

```typescript
// Order matters - from providers/Providers.tsx
<SessionProvider>              // 1. NextAuth session
  <ThemeProvider>              // 2. MUI theme
    <CssBaseline>              // 3. MUI baseline
      <UserStateProvider>      // 4. User app state
        <FlowSeriesProvider>   // 5. Yoga series context
          <AsanaPostureProvider> // 6. Asana/posture context
```

### Component Organization Strategy

- **Feature modules**: `app/[feature]/` - Domain-specific features (breathwork, meditation, mantra, planner)
- **Client components**: `app/clientComponents/` - Interactive UI components
- **Context providers**: `app/context/` - State management contexts
- **Views**: `app/views/` - Page-level components
- **Utils**: `app/utils/` - Pure functions and helpers
- **API routes**: `app/api/` - Backend API endpoints

### Navigation & Routing System

- **Navigator**: Custom navigation system in `app/navigator/`
- **Protected routes**: Authentication-aware routing
- **Dynamic paths**: Feature-based routing structure
- **Mobile-first**: Responsive navigation patterns

## HTTP & Data Layer Patterns

### API Communication Standards

- **API routes**: Next.js API routes in `app/api/`
- **Prisma client**: Direct database access through Prisma
- **MongoDB connection**: Custom client in `lib/mongoDb`
- **Authentication**: NextAuth.js session management
- **Error handling**: Custom error responses and validation

### Data Models & Schemas

```typescript
// Core yoga data models
- UserData: User profiles with yoga preferences
- Asana: Individual yoga poses/postures
- AsanaSeries: Collections of related asanas
- AsanaSequence: Ordered practice sequences
- Practice sessions and tracking data
```

## Feature Flag System

### Development Features

```typescript
// FEATURES.ts - Development feature toggles
export const FEATURES = {
  SHOW_CREATE_SERIES: true,
  SHOW_CREATE_SEQUENCE: true,
  SHOW_PRACTICE_SEQUENCE: true,
  SHOW_PRACTICE_VIEW_ASANA: true,
}
```

## Testing Conventions & Requirements

### Essential Mock Structure

```typescript
// Always mock these core dependencies
jest.mock('next/navigation')
jest.mock('next-auth/react')
jest.mock('@/app/context/UserContext')
jest.mock('@/app/context/AsanaSeriesContext')
jest.mock('@/app/context/AsanaPostureContext')

// Mock Prisma client
jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    // Mock database operations
  })),
}))
```

### Test Utilities & Best Practices

- **MUI components**: Always wrap in `ThemeProvider`
- **Element selection**: Use `data-testid` attributes for reliable targeting
- **Context testing**: Mock all yoga-specific contexts
- **Database mocking**: Mock Prisma operations
- **Mock cleanup**: Reset all mocks in `beforeEach`/`afterEach`
- **Accessibility**: Axe-core integration for a11y testing

## Development Workflows

### Essential Scripts

```bash
npm run dev                    # Development server (port 3000)
npm run concurrent            # Run MongoDB + Next.js concurrently
npm run test:coverage         # Jest with coverage report
npm run lint-fix              # Auto-fix ESLint issues
npm run mongo                 # Start MongoDB server
```

**Note:** Do not run `npm run pretty-fix` manually. VS Code handles code formatting automatically on save.

### Environment Requirements

- **MongoDB**: Local MongoDB server or connection string
- **NextAuth**: GitHub and Google OAuth credentials
- **Database**: `DATABASE_URL` for Prisma MongoDB connection
- **Auth secrets**: `NEXTAUTH_SECRET` and `NEXTAUTH_URL`

### Import & Naming Conventions

- **Path aliases**: Use `@` for app directory imports (`@context/`, `@styles/`, etc.)
- **Components**: PascalCase files (`AsanaCard.tsx`)
- **Tests**: Mirror structure in `__test__/` directory
- **Constants**: SCREAMING_SNAKE_CASE exports

## Key Integration Points

### MUI Theming System

- **Custom theme**: `app/styles/theme.ts`
- **Global styles**: `app/styles/globals.css`
- **Component styling**: Emotion-based styling
- **Responsive design**: Mobile-first approach

### Yoga Domain Features

- **Asana management**: Create, edit, and organize yoga poses
- **Series creation**: Group related asanas into series
- **Sequence building**: Create ordered practice sequences
- **Practice tracking**: Monitor yoga session progress
- **Breathing exercises**: Pranayama features in `app/breathwork/`
- **Meditation**: Guided meditation features in `app/meditation/`
- **Mantras**: Mantra practice in `app/mantra/`

### Accessibility Features

- **Axe-core integration**: Automatic a11y testing in development
- **ARIA compliance**: Proper semantic markup
- **Keyboard navigation**: Full keyboard accessibility
- **Screen reader support**: Semantic HTML and ARIA labels

## Development Patterns to Follow

1. **Context consumers**: Always provide fallback implementations for yoga contexts
2. **Database operations**: Use Prisma client with proper error handling
3. **Authentication**: Check session state before accessing user features
4. **Feature flags**: Use FEATURES object for development toggles
5. **Component props**: Use TypeScript interfaces for prop validation
6. **Yoga terminology**: Use proper Sanskrit terms and translations
7. **Mobile responsiveness**: Design mobile-first for yoga practitioners

## Yoga-Specific Domain Knowledge

### Core Concepts

- **Asana**: Individual yoga poses/postures
- **Vinyasa**: Flow sequences connecting poses
- **Pranayama**: Breathing techniques and exercises
- **Dhyana**: Meditation practices
- **Mantra**: Sacred sounds and chanting
- **Sequence**: Ordered series of asanas for practice
- **Series**: Thematic groupings of related asanas

### User Experience Patterns

- **Practice planning**: Users create and save custom sequences
- **Progress tracking**: Monitor improvement over time
- **Personalization**: Adapt to user's skill level and preferences
- **Guided practice**: Step-by-step instruction through sequences
- **Community features**: Sharing and discovering practices

## Common Gotchas & Solutions

- **Provider order**: Yoga contexts depend on user session and theme
- **MongoDB connection**: Ensure proper connection handling and cleanup
- **Prisma generation**: Run `prisma generate` after schema changes
- **Authentication state**: Always check session before accessing user data
- **Mobile layout**: Test navigation and forms on mobile devices
- **Feature flags**: Toggle features during development without breaking builds
- **Sanskrit terminology**: Maintain consistent spelling and pronunciation guides
- **Accessibility**: Ensure yoga instruction is accessible to all users

## File Structure Patterns

### Key Directories

```
soar/
├── app/
│   ├── api/                 # Next.js API routes
│   ├── breathwork/          # Pranayama features
│   ├── clientComponents/    # Interactive components
│   ├── context/            # React contexts for state
│   ├── meditation/         # Meditation features
│   ├── mantra/            # Mantra practice
│   ├── navigator/         # Navigation system
│   ├── planner/           # Practice planning
│   ├── providers/         # Context providers
│   ├── utils/             # Utility functions
│   └── views/             # Page-level components
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── generated/         # Generated Prisma client
├── components/            # Shared UI components
├── lib/                   # External service integrations
├── public/               # Static assets
├── styles/               # Global styles and theme
└── types/                # TypeScript type definitions
```

This architecture supports a scalable yoga application with proper separation of concerns, robust authentication, and yoga-domain-specific features.
