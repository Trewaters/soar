// Shared Prisma client for Next.js App Router server files
// Do not call prisma.$disconnect() in API route handlers that import this shared client.
// Scripts/tests that create their own client must disconnect explicitly.
import { PrismaClient } from '../../prisma/generated/client'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      __appPrismaClient?: PrismaClient
    }
  }
}

const _global = globalThis as unknown as NodeJS.Global & typeof globalThis

export const prisma = _global.__appPrismaClient ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') {
  _global.__appPrismaClient = prisma
}

export default prisma
