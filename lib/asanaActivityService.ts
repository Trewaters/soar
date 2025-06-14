import { PrismaClient } from '../prisma/generated/client'
import { logServiceError, logDatabaseError } from './errorLogger'

const prisma = new PrismaClient()

export type AsanaActivityInput = {
  userId: string
  postureId: string
  postureName: string
  duration: number
  datePerformed: Date | string // Accept both Date and string, convert in function
  notes?: string
  sensations?: string
  completionStatus: string // 'complete', 'skipped', 'partial'
}

export async function recordAsanaActivity(input: AsanaActivityInput) {
  try {
    // Ensure datePerformed is a Date object
    const data = {
      ...input,
      datePerformed:
        input.datePerformed instanceof Date
          ? input.datePerformed
          : new Date(input.datePerformed),
    }

    const result = await prisma.asanaActivity.create({
      data,
    })

    return result
  } catch (error) {
    logDatabaseError(error, 'create', 'AsanaActivity', input)
    logServiceError(error, 'asanaActivityService', 'recordAsanaActivity', {
      input,
      operation: 'create_activity',
    })
    throw error
  }
}

export async function deleteAsanaActivity(userId: string, postureId: string) {
  try {
    // Delete the most recent activity for this user and posture
    const result = await prisma.asanaActivity.deleteMany({
      where: {
        userId,
        postureId,
      },
    })

    return result
  } catch (error) {
    logDatabaseError(error, 'deleteMany', 'AsanaActivity', {
      userId,
      postureId,
    })
    logServiceError(error, 'asanaActivityService', 'deleteAsanaActivity', {
      userId,
      postureId,
      operation: 'delete_activity',
    })
    throw error
  }
}

export async function checkExistingActivity(userId: string, postureId: string) {
  try {
    const activity = await prisma.asanaActivity.findFirst({
      where: {
        userId,
        postureId,
      },
      orderBy: {
        datePerformed: 'desc',
      },
    })

    return activity
  } catch (error) {
    logDatabaseError(error, 'findFirst', 'AsanaActivity', {
      userId,
      postureId,
    })
    logServiceError(error, 'asanaActivityService', 'checkExistingActivity', {
      userId,
      postureId,
      operation: 'check_activity',
    })
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
