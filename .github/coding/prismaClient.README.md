# Prisma Client Usage in Soar

## Shared Client Pattern

This project uses a **shared Prisma client** to avoid duplicate database connections and ensure runtime stability, especially during development with hot module reloading (HMR).

- **Do NOT call `prisma.$disconnect()` in any API route or server handler that imports this shared client.**
- Only scripts or tests that create their own `PrismaClient` instance should call `$disconnect()` explicitly.

## Import Paths

- **App Router server files:**
  - Import from `app/lib/prismaClient.ts`
- **Other server-side code (e.g., scripts, services):**
  - Import from `lib/prismaClient.ts`

## How It Works

- The shared client is cached on `globalThis` (as `__prismaClient`) in non-production environments to prevent multiple instances during HMR.
- In production, a new client is created per process.

## Example Usage

```ts
import { prisma } from 'lib/prismaClient'

// Use prisma as usual
const users = await prisma.user.findMany()
```

## When to Disconnect

- **Do NOT disconnect** in API routes or handlers using the shared client.
- **DO disconnect** in scripts/tests that create their own `PrismaClient`:

```ts
const prisma = new PrismaClient()
// ... use prisma
await prisma.$disconnect()
```

## Why This Matters

- Prevents "PrismaClient is already connected" or "too many connections" errors during development.
- Ensures a single, stable client instance is used throughout the app lifecycle.

---

For more details, see the PRD and engineering task list in `.github/tasks/TaskList-PRD-prisma-client-and-runtime-stability.md`.
