import { PrismaClient } from '@prisma/client'

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
