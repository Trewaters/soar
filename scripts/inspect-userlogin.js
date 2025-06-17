#!/usr/bin/env node

/**
 * Direct Database UserLogin Inspection Script
 *
 * This script directly queries the database to check UserLogin records
 * for troubleshooting production login streak issues.
 *
 * Usage:
 *   # Set your production DATABASE_URL environment variable first
 *   DATABASE_URL="your-production-mongodb-url" node scripts/inspect-userlogin.js [userId]
 */

// Import Prisma client
const { PrismaClient } = require('../prisma/generated/client')

const userId = process.argv[2]

if (!userId) {
  console.error('❌ Error: userId is required')
  console.log(
    'Usage: DATABASE_URL="your-mongodb-url" node scripts/inspect-userlogin.js [userId]'
  )
  console.log(
    'Example: DATABASE_URL="mongodb+srv://..." node scripts/inspect-userlogin.js clh4u3p2u0001l708qgxj9y8z'
  )
  process.exit(1)
}

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
  errorFormat: 'pretty',
})

async function inspectUserLogins() {
  try {
    console.log('🔍 Direct Database UserLogin Inspection')
    console.log('=' * 50)
    console.log('👤 User ID:', userId)
    console.log(
      '🗄️  Database URL:',
      process.env.DATABASE_URL ? '✅ Set' : '❌ Not set'
    )
    console.log('🕐 Inspection Time:', new Date().toISOString())
    console.log('')

    // Check if user exists in UserData collection
    console.log('👤 Checking if user exists in UserData...')
    const userData = await prisma.userData.findUnique({
      where: { id: userId },
    })

    if (userData) {
      console.log('✅ User found in UserData:')
      console.log('  ID:', userData.id)
      console.log('  Email:', userData.email)
      console.log('  Name:', userData.name)
      console.log('  Created:', userData.createdAt)
      console.log('  Updated:', userData.updatedAt)
    } else {
      console.log('❌ User NOT found in UserData collection!')
      console.log('   This could be the root cause of the issue.')
      return
    }

    console.log('')

    // Check UserLogin records for this user
    console.log('📋 Checking UserLogin records...')
    const totalLogins = await prisma.userLogin.count({
      where: { userId: userId },
    })

    console.log('📊 Total UserLogin records for user:', totalLogins)

    if (totalLogins === 0) {
      console.log('❌ NO UserLogin records found!')
      console.log('   This explains why lastLoginDate is null.')
      console.log('   The issue is that login events are not being recorded.')
      console.log('')
      console.log('🔧 Troubleshooting steps:')
      console.log(
        '   1. Check if the auth.ts event handler is working in production'
      )
      console.log(
        '   2. Verify that sign-in events trigger the UserLogin creation'
      )
      console.log('   3. Check Vercel logs for any auth event errors')
      return
    }

    // Get recent login records
    console.log('\n📅 Recent UserLogin records (last 10):')
    const recentLogins = await prisma.userLogin.findMany({
      where: { userId: userId },
      orderBy: { loginAt: 'desc' },
      take: 10,
    })

    recentLogins.forEach((login, index) => {
      console.log(`  ${index + 1}. ID: ${login.id}`)
      console.log(`     Date: ${login.loginAt.toISOString()}`)
      console.log(`     User ID: ${login.userId}`)
      console.log(`     Created: ${login.createdAt.toISOString()}`)
      console.log('')
    })

    // Analyze the data
    if (recentLogins.length > 0) {
      const latestLogin = recentLogins[0]
      const today = new Date()
      const latestDate = new Date(latestLogin.loginAt)

      console.log('📊 Analysis:')
      console.log('  Latest login date:', latestDate.toISOString())
      console.log('  Today:', today.toISOString())

      const daysDiff = Math.floor(
        (today.getTime() - latestDate.getTime()) / (1000 * 60 * 60 * 24)
      )
      console.log('  Days since last login:', daysDiff)

      if (daysDiff === 0) {
        console.log('  ✅ User logged in today')
      } else if (daysDiff === 1) {
        console.log('  📅 User logged in yesterday')
      } else {
        console.log('  📅 User last logged in', daysDiff, 'days ago')
      }
    }

    // Check for duplicate or malformed records
    console.log('\n🔍 Data Quality Check:')
    const distinctDates = await prisma.userLogin.groupBy({
      by: ['loginAt'],
      where: { userId: userId },
      _count: { loginAt: true },
      having: { loginAt: { _count: { gt: 1 } } },
    })

    if (distinctDates.length > 0) {
      console.log('⚠️  Found duplicate login dates:')
      distinctDates.forEach((group) => {
        console.log(
          `  Date: ${group.loginAt.toISOString()} (${group._count.loginAt} records)`
        )
      })
    } else {
      console.log('✅ No duplicate login dates found')
    }

    // Check the specific query that the API uses
    console.log('\n🧪 Testing API Query Logic:')
    const apiQuery = await prisma.userLogin.findMany({
      where: { userId: userId },
      orderBy: { loginAt: 'desc' },
      select: {
        id: true,
        loginAt: true,
        createdAt: true,
      },
    })

    console.log('API Query Results:', apiQuery.length, 'records')
    if (apiQuery.length > 0) {
      console.log('First record:', {
        id: apiQuery[0].id,
        loginAt: apiQuery[0].loginAt.toISOString(),
        createdAt: apiQuery[0].createdAt.toISOString(),
      })
    }
  } catch (error) {
    console.error('❌ Database inspection failed:', error)
    console.error('Error details:', error.message)
    console.error('Stack trace:', error.stack)
  } finally {
    await prisma.$disconnect()
  }
}

console.log('Starting database inspection...')
inspectUserLogins().catch(console.error)
