import { PrismaClient } from '../prisma/generated/client'

const prisma = new PrismaClient()

export type AsanaActivityInput = {
  userId: string
  postureId: string
  postureName: string
  duration: number
  datePerformed: Date
  notes?: string
  sensations?: string
  completionStatus: string // 'complete', 'skipped', 'partial'
}

export async function recordAsanaActivity(input: AsanaActivityInput) {
  try {
    return await prisma.asanaActivity.create({
      data: input,
    })
  } catch (error) {
    console.error('Error in recordAsanaActivity:', error)
    throw error
  }
}

export async function getDailyAsanaSummary(userId: string, date: Date) {
  try {
    // Get all activities for the user on the given date
    const start = new Date(date)
    start.setHours(0, 0, 0, 0)
    const end = new Date(date)
    end.setHours(23, 59, 59, 999)

    return await prisma.asanaActivity.findMany({
      where: {
        userId,
        datePerformed: {
          gte: start,
          lte: end,
        },
      },
      orderBy: { datePerformed: 'asc' },
    })
  } catch (error) {
    console.error('Error in getDailyAsanaSummary:', error)
    throw error
  }
}

export async function getUserAsanaHistory(userId: string) {
  try {
    return await prisma.asanaActivity.findMany({
      where: { userId },
      orderBy: { datePerformed: 'desc' },
    })
  } catch (error) {
    console.error('Error in getUserAsanaHistory:', error)
    throw error
  }
}
