// Shared Prisma client for Next.js App Router server files
// This file re-exports from the main lib/prismaClient for consistency
// Do not call prisma.$disconnect() in API route handlers that import this shared client.
// Scripts/tests that create their own client must disconnect explicitly.

export { prisma, default } from '@lib/prismaClient'
