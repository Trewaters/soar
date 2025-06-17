#!/usr/bin/env node

/**
 * Production Session and UserId Debugging Script
 *
 * This script helps debug the userId discrepancy between local and production
 * by checking session data, user records, and UserLogin records.
 *
 * Usage:
 *   DATABASE_URL="your-production-mongodb-url" node scripts/debug-session-userid.js [email]
 */

const { PrismaClient } = require('../prisma/generated/client')

const email = process.argv[2]

if (!email) {
  console.error('❌ Error: email is required')
  console.log(
    'Usage: DATABASE_URL="your-mongodb-url" node scripts/debug-session-userid.js [email]'
  )
  console.log(
    'Example: DATABASE_URL="mongodb+srv://..." node scripts/debug-session-userid.js user@example.com'
  )
  process.exit(1)
}

const prisma = new PrismaClient({
  log: ['query', 'error', 'warn'],
  errorFormat: 'pretty',
})

async function debugSessionUserId() {
  try {
    console.log('🔍 Production Session and UserId Debug')
    console.log('=' * 50)
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
      console.log("   This means the user doesn't exist in the database.")
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
      console.log(
        '⚠️  Could not check NextAuth accounts (collection may not exist):'
      )
      console.log('   Error:', error.message)
    }
    console.log('')

    // 3. Check NextAuth users collection
    console.log('3️⃣ Checking NextAuth users collection...')
    try {
      const nextAuthUsers = await prisma.user.findMany({
        where: { email: email },
        select: {
          id: true,
          email: true,
          name: true,
          image: true,
          emailVerified: true,
        },
      })

      if (nextAuthUsers.length === 0) {
        console.log('❌ No NextAuth users found!')
        console.log(
          '   This could indicate the user was created directly in UserData,'
        )
        console.log('   not through NextAuth flow.')
      } else {
        console.log('✅ NextAuth users found:')
        nextAuthUsers.forEach((user, index) => {
          console.log(`  NextAuth User ${index + 1}:`)
          console.log(`    ID: ${user.id}`)
          console.log(`    Email: ${user.email}`)
          console.log(`    Name: ${user.name}`)
          console.log(`    Image: ${user.image || 'null'}`)
          console.log(
            `    Email Verified: ${user.emailVerified ? user.emailVerified.toISOString() : 'null'}`
          )
          console.log('')
        })
      }
    } catch (error) {
      console.log(
        '⚠️  Could not check NextAuth users (collection may not exist):'
      )
      console.log('   Error:', error.message)
    }
    console.log('')

    // 4. Check UserLogin records for each potential userId
    const userIdsToCheck = [userData.id]

    // Add provider_id if it exists and is different
    if (userData.provider_id && userData.provider_id !== userData.id) {
      userIdsToCheck.push(userData.provider_id)
    }

    console.log('4️⃣ Checking UserLogin records for potential userIds...')

    for (const userId of userIdsToCheck) {
      console.log(`📋 Checking UserLogin records for userId: ${userId}`)

      const loginCount = await prisma.userLogin.count({
        where: { userId: userId },
      })

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
          console.log(
            `     ${index + 1}. ${login.loginAt.toISOString()} (${login.provider})`
          )
        })

        // This is the userId that should be used in production!
        if (loginCount > 0) {
          console.log(`   ✅ This userId (${userId}) has login records!`)
        }
      } else {
        console.log(`   ❌ No login records for userId: ${userId}`)
      }
      console.log('')
    }

    // 5. Check ProviderAccount records (our custom table)
    console.log('5️⃣ Checking ProviderAccount records...')
    try {
      const providerAccounts = await prisma.providerAccount.findMany({
        where: { userId: userData.id },
        select: {
          id: true,
          userId: true,
          provider: true,
          providerAccountId: true,
          type: true,
          createdAt: true,
        },
      })

      if (providerAccounts.length === 0) {
        console.log('❌ No ProviderAccount records found!')
      } else {
        console.log('✅ ProviderAccount records found:')
        providerAccounts.forEach((account, index) => {
          console.log(`  Account ${index + 1}:`)
          console.log(`    ID: ${account.id}`)
          console.log(`    User ID: ${account.userId}`)
          console.log(`    Provider: ${account.provider}`)
          console.log(`    Provider Account ID: ${account.providerAccountId}`)
          console.log(`    Type: ${account.type}`)
          console.log(`    Created: ${account.createdAt.toISOString()}`)
        })
      }
    } catch (error) {
      console.log('⚠️  Could not check ProviderAccount records:')
      console.log('   Error:', error.message)
    }
    console.log('')

    // 6. Summary and recommendations
    console.log('6️⃣ Summary and Recommendations:')
    console.log('=' * 50)

    const hasUserData = !!userData
    const userDataId = userData?.id
    const providerId = userData?.provider_id

    console.log('User Data Summary:')
    console.log(`  ✅ UserData exists: ${hasUserData}`)
    console.log(`  📋 UserData ID: ${userDataId}`)
    console.log(`  🔗 Provider ID: ${providerId || 'null'}`)

    // Check which userId has login records
    const loginCounts = {}
    for (const userId of userIdsToCheck) {
      const count = await prisma.userLogin.count({ where: { userId } })
      loginCounts[userId] = count
    }

    console.log('\nLogin Records Summary:')
    Object.entries(loginCounts).forEach(([userId, count]) => {
      console.log(
        `  ${count > 0 ? '✅' : '❌'} ${userId}: ${count} login records`
      )
    })

    // Find the correct userId
    const correctUserId = Object.entries(loginCounts).find(
      ([_, count]) => count > 0
    )?.[0]

    if (correctUserId) {
      console.log(`\n🎯 CORRECT USER ID: ${correctUserId}`)
      console.log('This is the userId that should be used in the session!')

      if (correctUserId !== userDataId) {
        console.log('\n⚠️  ISSUE IDENTIFIED:')
        console.log(`Session is likely using: ${userDataId}`)
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
  } catch (error) {
    console.error('❌ Debug session failed:', error)
    console.error('Error details:', error.message)
    console.error('Stack trace:', error.stack)
  } finally {
    await prisma.$disconnect()
  }
}

console.log('Starting session userId debug...')
debugSessionUserId().catch(console.error)
