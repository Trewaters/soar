#!/usr/bin/env node

/**
 * Complete Production UserId Flow Diagnosis
 *
 * This script diagnoses the exact userId flow issue between NextAuth and UserLogin records.
 * It identifies which userId is being used in the session vs which one has the login data.
 */

const { PrismaClient } = require('../prisma/generated/client')

const email = process.argv[2]

if (!email) {
  console.error('❌ Error: email is required')
  console.log('Usage: node scripts/diagnose-userid-flow.js [email]')
  process.exit(1)
}

const prisma = new PrismaClient({ log: ['error'], errorFormat: 'pretty' })

async function diagnoseUserIdFlow() {
  try {
    console.log('🔍 Complete Production UserId Flow Diagnosis')
    console.log('=' * 60)
    console.log('📧 Target Email:', email)
    console.log('🕐 Diagnosis Time:', new Date().toISOString())
    console.log('')

    // Step 1: Find all possible user records
    console.log('STEP 1: Finding all user records...')
    console.log('-' * 40)

    const userData = await prisma.userData.findUnique({
      where: { email: email },
    })

    let nextAuthUser = null
    try {
      nextAuthUser = await prisma.user.findUnique({
        where: { email: email },
      })
    } catch (e) {
      console.log('Note: NextAuth User collection not accessible')
    }

    console.log('User Records Found:')
    console.log(`  UserData: ${userData ? '✅ YES' : '❌ NO'}`)
    if (userData) {
      console.log(`    ID: ${userData.id}`)
      console.log(`    Provider ID: ${userData.provider_id || 'null'}`)
      console.log(`    Created: ${userData.createdAt.toISOString()}`)
    }

    console.log(`  NextAuth User: ${nextAuthUser ? '✅ YES' : '❌ NO'}`)
    if (nextAuthUser) {
      console.log(`    ID: ${nextAuthUser.id}`)
      console.log(
        `    Created: ${nextAuthUser.createdAt?.toISOString() || 'unknown'}`
      )
    }
    console.log('')

    // Step 2: Check which ID has login records
    console.log('STEP 2: Checking UserLogin records...')
    console.log('-' * 40)

    const possibleUserIds = []
    if (userData) possibleUserIds.push(userData.id)
    if (userData?.provider_id) possibleUserIds.push(userData.provider_id)
    if (nextAuthUser && !possibleUserIds.includes(nextAuthUser.id)) {
      possibleUserIds.push(nextAuthUser.id)
    }

    console.log('Checking UserLogin records for each possible userId:')
    const loginResults = {}

    for (const userId of possibleUserIds) {
      const count = await prisma.userLogin.count({ where: { userId } })
      loginResults[userId] = count

      console.log(
        `  ${userId}: ${count} login records ${count > 0 ? '✅' : '❌'}`
      )

      if (count > 0) {
        const latest = await prisma.userLogin.findFirst({
          where: { userId },
          orderBy: { loginAt: 'desc' },
        })
        console.log(`    Latest: ${latest.loginAt.toISOString()}`)
      }
    }
    console.log('')

    // Step 3: Determine the session userId (what's actually being used)
    console.log('STEP 3: Determining session userId behavior...')
    console.log('-' * 40)

    // Based on auth.ts analysis, the session userId comes from:
    // 1. JWT token.id (set in jwt callback)
    // 2. JWT token.id is set from userData.id in jwt callback when not present
    // 3. But if NextAuth creates the user, it might use a different ID

    let sessionUserId = null
    let hasLoginData = false

    if (userData) {
      sessionUserId = userData.id
      hasLoginData = loginResults[userData.id] > 0

      console.log('Expected Session Behavior:')
      console.log(`  Session will use userId: ${sessionUserId}`)
      console.log(`  This userId has login data: ${hasLoginData ? '✅' : '❌'}`)

      if (
        !hasLoginData &&
        userData.provider_id &&
        loginResults[userData.provider_id] > 0
      ) {
        console.log(
          `  But provider_id ${userData.provider_id} HAS login data! ⚠️`
        )
      }
    }
    console.log('')

    // Step 4: Check auth.ts signIn event behavior
    console.log('STEP 4: Analyzing auth.ts signIn event...')
    console.log('-' * 40)

    console.log('Auth.ts Analysis:')
    console.log('  The signIn event in auth.ts creates UserLogin records')
    console.log('  It uses user.id from the signIn event')
    console.log('  user.id comes from the authorize function or OAuth provider')
    console.log('')

    // Check if the issue is in the signIn event userId vs session userId
    const userIdWithLogins = Object.entries(loginResults).find(
      ([_, count]) => count > 0
    )?.[0]

    if (
      userIdWithLogins &&
      sessionUserId &&
      userIdWithLogins !== sessionUserId
    ) {
      console.log('🚨 ROOT CAUSE IDENTIFIED:')
      console.log(`  Login records use userId: ${userIdWithLogins}`)
      console.log(`  Session uses userId: ${sessionUserId}`)
      console.log(
        `  These are DIFFERENT! This explains the empty lastLoginDate.`
      )
      console.log('')

      console.log('🔧 SOLUTION:')
      console.log(
        '  The auth.ts configuration needs to ensure consistent userId'
      )
      console.log('  between session and signIn event.')
      console.log('')

      console.log('  Possible fixes:')
      console.log('  1. Update session callback to use the correct userId')
      console.log('  2. Update signIn event to use session-consistent userId')
      console.log('  3. Migrate UserLogin records to use the session userId')
    } else if (!userIdWithLogins) {
      console.log('🚨 ROOT CAUSE IDENTIFIED:')
      console.log('  NO UserLogin records found for any userId!')
      console.log('  The auth.ts signIn event is not working in production.')
      console.log('')

      console.log('🔧 SOLUTION:')
      console.log('  1. Check if auth.ts events are triggered in production')
      console.log('  2. Verify DATABASE_URL is accessible in auth.ts events')
      console.log('  3. Check Vercel logs for signIn event errors')
    } else {
      console.log('✅ UserIds appear to be consistent.')
      console.log('  The issue might be elsewhere.')
    }

    // Step 5: Test the exact API scenario
    console.log('')
    console.log('STEP 5: Testing API scenario...')
    console.log('-' * 40)

    if (sessionUserId) {
      console.log(`Simulating API call with sessionUserId: ${sessionUserId}`)

      const apiResult = await prisma.userLogin.findMany({
        where: { userId: sessionUserId },
        orderBy: { loginAt: 'desc' },
        select: { id: true, loginAt: true },
      })

      console.log(`API would return: ${apiResult.length} records`)
      if (apiResult.length === 0) {
        console.log('❌ This confirms the API returns empty results!')
        console.log(
          '   lastLoginDate will be null, causing streak calculation to fail.'
        )
      } else {
        console.log('✅ API would work correctly.')
        console.log(`   Latest login: ${apiResult[0].loginAt.toISOString()}`)
      }
    }
  } catch (error) {
    console.error('❌ Diagnosis failed:', error)
    console.error('Error details:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

console.log('Starting complete userId flow diagnosis...')
diagnoseUserIdFlow().catch(console.error)
