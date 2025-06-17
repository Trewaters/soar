#!/usr/bin/env node

/**
 * Production Session and UserId Debugging Script
 */

const { PrismaClient } = require('../prisma/generated/client')

const email = process.argv[2]

if (!email) {
  console.error('❌ Error: email is required')
  console.log('Usage: node scripts/debug-session-userid.js [email]')
  process.exit(1)
}

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
  errorFormat: 'pretty',
})

async function debugSessionUserId() {
  try {
    console.log('🔍 Production Session and UserId Debug')
    console.log('='.repeat(50))
    console.log('📧 User Email:', email)
    console.log(
      '🗄️  Database URL:',
      process.env.DATABASE_URL ? '✅ Set' : '❌ Not set'
    )
    console.log('🕐 Debug Time:', new Date().toISOString())
    console.log('')

    // 1. Check UserData collection
    console.log('1️⃣ Checking UserData collection...')
    const userData = await prisma.userData.findUnique({
      where: { email: email },
      select: {
        id: true,
        email: true,
        name: true,
        provider_id: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!userData) {
      console.log('❌ No user found in UserData collection!')
      console.log('   This means the user does not exist in the database.')
      return
    }

    console.log('✅ User found in UserData:')
    console.log('  Internal ID:', userData.id)
    console.log('  Provider ID:', userData.provider_id || 'null')
    console.log('  Email:', userData.email)
    console.log('  Name:', userData.name)
    console.log('  Created:', userData.createdAt.toISOString())
    console.log('  Updated:', userData.updatedAt.toISOString())
    console.log('')

    // 2. Check NextAuth accounts collection
    console.log('2️⃣ Checking NextAuth accounts...')
    try {
      const accounts = await prisma.account.findMany({
        where: {
          OR: [
            { userId: userData.id },
            { providerAccountId: userData.provider_id },
          ],
        },
        select: {
          id: true,
          userId: true,
          provider: true,
          providerAccountId: true,
          type: true,
          createdAt: true,
        },
      })

      if (accounts.length === 0) {
        console.log('❌ No NextAuth accounts found!')
        console.log('   This could explain session/userId issues.')
      } else {
        console.log('✅ NextAuth accounts found:')
        accounts.forEach((account, index) => {
          console.log(`  Account ${index + 1}:`)
          console.log(`    ID: ${account.id}`)
          console.log(`    User ID: ${account.userId}`)
          console.log(`    Provider: ${account.provider}`)
          console.log(`    Provider Account ID: ${account.providerAccountId}`)
          console.log(`    Type: ${account.type}`)
          console.log(`    Created: ${account.createdAt.toISOString()}`)
          console.log('')
        })
      }
    } catch (error) {
      console.log('⚠️  Could not check NextAuth accounts:')
      console.log('   Error:', error.message)
    }
    console.log('')

    // 3. Check UserLogin records for each potential userId
    const userIdsToCheck = [userData.id]

    if (userData.provider_id && userData.provider_id !== userData.id) {
      userIdsToCheck.push(userData.provider_id)
    }

    console.log('3️⃣ Checking UserLogin records for potential userIds...')

    const loginCounts = {}
    for (const userId of userIdsToCheck) {
      console.log(`📋 Checking UserLogin records for userId: ${userId}`)

      const loginCount = await prisma.userLogin.count({
        where: { userId: userId },
      })

      loginCounts[userId] = loginCount
      console.log(`   Total records: ${loginCount}`)

      if (loginCount > 0) {
        const recentLogins = await prisma.userLogin.findMany({
          where: { userId: userId },
          orderBy: { loginAt: 'desc' },
          take: 3,
          select: {
            id: true,
            loginAt: true,
            provider: true,
            createdAt: true,
          },
        })

        console.log('   Recent logins:')
        recentLogins.forEach((login, index) => {
          const loginDate = login.loginAt.toISOString()
          const provider = login.provider
          console.log(`     ${index + 1}. ${loginDate} (${provider})`)
        })

        console.log(`   ✅ This userId (${userId}) has login records!`)
      } else {
        console.log(`   ❌ No login records for userId: ${userId}`)
      }
      console.log('')
    }

    // 4. Summary and recommendations
    console.log('4️⃣ Summary and Recommendations:')
    console.log('='.repeat(50))

    console.log('User Data Summary:')
    console.log(`  ✅ UserData exists: ${!!userData}`)
    console.log(`  📋 UserData ID: ${userData.id}`)
    console.log(`  🔗 Provider ID: ${userData.provider_id || 'null'}`)

    console.log('\nLogin Records Summary:')
    Object.entries(loginCounts).forEach(([userId, count]) => {
      console.log(
        `  ${count > 0 ? '✅' : '❌'} ${userId}: ${count} login records`
      )
    })

    // Find the correct userId
    const correctUserIdEntry = Object.entries(loginCounts).find(
      ([_, count]) => count > 0
    )
    const correctUserId = correctUserIdEntry ? correctUserIdEntry[0] : null

    if (correctUserId) {
      console.log(`\n🎯 CORRECT USER ID: ${correctUserId}`)
      console.log('This is the userId that should be used in the session!')

      if (correctUserId !== userData.id) {
        console.log('\n⚠️  ISSUE IDENTIFIED:')
        console.log(`Session is likely using: ${userData.id}`)
        console.log(`But should be using: ${correctUserId}`)
        console.log('\nThis explains why lastLoginDate is empty in production!')
      } else {
        console.log('\n✅ UserData ID matches the ID with login records.')
        console.log('The issue might be elsewhere in the authentication flow.')
      }
    } else {
      console.log('\n❌ NO LOGIN RECORDS FOUND for any userId!')
      console.log(
        'This suggests the auth.ts signIn event is not working in production.'
      )
    }

    // 5. Test the exact API call that's failing
    console.log('\n5️⃣ Testing the actual API query logic...')
    console.log('Simulating the API call with the UserData ID...')

    try {
      const apiTestResult = await prisma.userLogin.findMany({
        where: { userId: userData.id },
        orderBy: { loginAt: 'desc' },
        select: {
          id: true,
          loginAt: true,
          createdAt: true,
        },
      })

      console.log(`API Query Result: ${apiTestResult.length} records found`)
      if (apiTestResult.length > 0) {
        console.log('Latest login:', apiTestResult[0].loginAt.toISOString())
      } else {
        console.log('❌ This confirms the API will return empty results!')
      }
    } catch (error) {
      console.log('❌ API query test failed:', error.message)
    }
  } catch (error) {
    console.error('❌ Debug session failed:', error)
    console.error('Error details:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

console.log('Starting session userId debug...')
debugSessionUserId().catch(console.error)
