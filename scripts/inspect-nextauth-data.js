#!/usr/bin/env node

/**
 * NextAuth Session Database Inspector
 *
 * This script checks NextAuth sessions, accounts, and users in the database
 * to understand the userId flow and identify discrepancies.
 */

const { PrismaClient } = require('../prisma/generated/client')

const email = process.argv[2]

if (!email) {
  console.error('❌ Error: email is required')
  console.log('Usage: node scripts/inspect-nextauth-data.js [email]')
  process.exit(1)
}

const prisma = new PrismaClient({
  log: ['error', 'warn'],
  errorFormat: 'pretty',
})

async function inspectNextAuthData() {
  try {
    console.log('🔍 NextAuth Database Data Inspector')
    console.log('='.repeat(50))
    console.log('📧 Target Email:', email)
    console.log('🕐 Inspection Time:', new Date().toISOString())
    console.log('')

    // Check all collections for this email
    console.log('1️⃣ Checking NextAuth User collection...')
    try {
      const nextAuthUsers = await prisma.user.findMany({
        where: { email: email },
      })

      if (nextAuthUsers.length === 0) {
        console.log('❌ No users found in NextAuth User collection')
      } else {
        console.log('✅ NextAuth Users found:', nextAuthUsers.length)
        nextAuthUsers.forEach((user, index) => {
          console.log(`  User ${index + 1}:`)
          console.log(`    ID: ${user.id}`)
          console.log(`    Email: ${user.email}`)
          console.log(`    Name: ${user.name}`)
          console.log(`    Email Verified: ${user.emailVerified || 'null'}`)
          console.log(`    Image: ${user.image || 'null'}`)
          console.log('')
        })
      }
    } catch (error) {
      console.log('❌ NextAuth User collection not accessible:', error.message)
    }

    console.log('2️⃣ Checking NextAuth Account collection...')
    try {
      // First get users to find accounts
      const nextAuthUsers = await prisma.user.findMany({
        where: { email: email },
      })

      if (nextAuthUsers.length > 0) {
        for (const user of nextAuthUsers) {
          console.log(`📋 Checking accounts for NextAuth user: ${user.id}`)
          const accounts = await prisma.account.findMany({
            where: { userId: user.id },
          })

          if (accounts.length === 0) {
            console.log('   ❌ No accounts found')
          } else {
            console.log(`   ✅ Found ${accounts.length} account(s):`)
            accounts.forEach((account, index) => {
              console.log(`     Account ${index + 1}:`)
              console.log(`       ID: ${account.id}`)
              console.log(`       Provider: ${account.provider}`)
              console.log(
                `       Provider Account ID: ${account.providerAccountId}`
              )
              console.log(`       Type: ${account.type}`)
              console.log(`       User ID: ${account.userId}`)
              console.log('')
            })
          }
        }
      }
    } catch (error) {
      console.log(
        '❌ NextAuth Account collection not accessible:',
        error.message
      )
    }

    console.log('3️⃣ Checking NextAuth Session collection...')
    try {
      // Sessions are typically linked by userId
      const nextAuthUsers = await prisma.user.findMany({
        where: { email: email },
      })

      if (nextAuthUsers.length > 0) {
        for (const user of nextAuthUsers) {
          console.log(`📋 Checking sessions for NextAuth user: ${user.id}`)
          const sessions = await prisma.session.findMany({
            where: { userId: user.id },
          })

          if (sessions.length === 0) {
            console.log('   ❌ No active sessions found')
          } else {
            console.log(`   ✅ Found ${sessions.length} session(s):`)
            sessions.forEach((session, index) => {
              console.log(`     Session ${index + 1}:`)
              console.log(`       ID: ${session.id}`)
              console.log(`       User ID: ${session.userId}`)
              console.log(
                `       Session Token: ${session.sessionToken.substring(0, 20)}...`
              )
              console.log(`       Expires: ${session.expires.toISOString()}`)
              console.log('')
            })
          }
        }
      }
    } catch (error) {
      console.log(
        '❌ NextAuth Session collection not accessible:',
        error.message
      )
    }

    console.log('4️⃣ Comparing with UserData collection...')
    const userData = await prisma.userData.findUnique({
      where: { email: email },
    })

    if (userData) {
      console.log('✅ UserData record found:')
      console.log(`  ID: ${userData.id}`)
      console.log(`  Provider ID: ${userData.provider_id || 'null'}`)
      console.log(`  Email: ${userData.email}`)
      console.log(`  Name: ${userData.name}`)
      console.log('')

      // Check for UserLogin records using UserData ID
      const userLoginCount = await prisma.userLogin.count({
        where: { userId: userData.id },
      })
      console.log(
        `📊 UserLogin records for UserData ID (${userData.id}): ${userLoginCount}`
      )

      // Check for UserLogin records using Provider ID if different
      if (userData.provider_id && userData.provider_id !== userData.id) {
        const providerLoginCount = await prisma.userLogin.count({
          where: { userId: userData.provider_id },
        })
        console.log(
          `📊 UserLogin records for Provider ID (${userData.provider_id}): ${providerLoginCount}`
        )
      }
    } else {
      console.log('❌ No UserData record found')
    }

    console.log('')
    console.log('5️⃣ Summary and Analysis:')
    console.log('='.repeat(50))

    // Get NextAuth user IDs
    const nextAuthUsers = await prisma.user
      .findMany({
        where: { email: email },
      })
      .catch(() => [])

    const nextAuthUserIds = nextAuthUsers.map((u) => u.id)
    const userDataId = userData?.id
    const providerId = userData?.provider_id

    console.log('ID Summary:')
    console.log(
      `  NextAuth User IDs: ${nextAuthUserIds.length > 0 ? nextAuthUserIds.join(', ') : 'None'}`
    )
    console.log(`  UserData ID: ${userDataId || 'None'}`)
    console.log(`  Provider ID: ${providerId || 'None'}`)
    console.log('')

    // Check which ID should be used in session
    if (nextAuthUserIds.length > 0 && userDataId) {
      const matchesUserData = nextAuthUserIds.includes(userDataId)
      const matchesProvider = providerId && nextAuthUserIds.includes(providerId)

      console.log('ID Matching Analysis:')
      console.log(
        `  NextAuth ID matches UserData ID: ${matchesUserData ? '✅' : '❌'}`
      )
      console.log(
        `  NextAuth ID matches Provider ID: ${matchesProvider ? '✅' : '❌'}`
      )

      if (!matchesUserData && !matchesProvider) {
        console.log('\n⚠️  CRITICAL ISSUE IDENTIFIED:')
        console.log('  NextAuth and UserData are using different user IDs!')
        console.log(
          '  This explains why the session userId does not match UserLogin records.'
        )
        console.log('')
        console.log('🔧 Potential Solutions:')
        console.log(
          '  1. Fix the NextAuth session to use the correct UserData ID'
        )
        console.log('  2. Update UserLogin records to use the NextAuth user ID')
        console.log(
          '  3. Ensure consistent user ID generation across providers'
        )
      }
    }
  } catch (error) {
    console.error('❌ NextAuth data inspection failed:', error)
    console.error('Error details:', error.message)
  } finally {
    await prisma.$disconnect()
  }
}

console.log('Starting NextAuth data inspection...')
inspectNextAuthData().catch(console.error)
