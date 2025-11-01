// Shared Prisma client for non-app server-side code (e.g., scripts, services)
// Do not call prisma.$disconnect() in API route handlers that import this shared client.
// Scripts/tests that create their own client must disconnect explicitly.
import { PrismaClient } from '../prisma/generated/client'

declare global {
  // Extend NodeJS global for TypeScript
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      __prismaClient?: PrismaClient
    }
  }
}

const _global = globalThis as unknown as NodeJS.Global & typeof globalThis

export const prisma = _global.__prismaClient ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  _global.__prismaClient = prisma
}

export default prisma
