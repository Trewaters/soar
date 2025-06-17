#!/usr/bin/env node

/**
 * Quick Production Data Check Script
 *
 * This script quickly checks if UserLogin records exist in production
 * and compares the data between environments.
 *
 * Usage:
 *   node scripts/check-production-data.js [productionUrl] [userId]
 */

const args = process.argv.slice(2)
const productionUrl = args[0] || 'https://soar-kappa.vercel.app'
const userId = args[1]

if (!userId) {
  console.error('❌ Error: userId is required')
  console.log(
    'Usage: node scripts/check-production-data.js [productionUrl] [userId]'
  )
  console.log(
    'Example: node scripts/check-production-data.js https://soar-kappa.vercel.app your-user-id'
  )
  process.exit(1)
}

console.log('🔍 Quick Production Data Check')
console.log('=' * 40)
console.log('🌐 Production URL:', productionUrl)
console.log('👤 User ID:', userId)
console.log('🕐 Check Time:', new Date().toISOString())
console.log('')

async function checkProductionData() {
  try {
    const apiUrl = `${productionUrl}/api/user/loginStreak?userId=${encodeURIComponent(userId)}`

    console.log('📞 Making API call to:', apiUrl)

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'ProductionDebugScript/1.0',
      },
    })

    console.log('📊 Response Status:', response.status, response.statusText)
    console.log('📋 Response Headers:')
    for (const [key, value] of response.headers.entries()) {
      console.log(`  ${key}: ${value}`)
    }

    const responseText = await response.text()
    console.log('\n📄 Raw Response:')
    console.log(responseText)

    if (response.ok) {
      try {
        const data = JSON.parse(responseText)
        console.log('\n✅ Parsed Response Data:')
        console.log('  Current Streak:', data.currentStreak)
        console.log('  Longest Streak:', data.longestStreak)
        console.log('  Last Login Date:', data.lastLoginDate)
        console.log('  Is Active Today:', data.isActiveToday)

        if (data.debugInfo) {
          console.log('\n🔧 Debug Information:')
          console.log('  Environment:', data.debugInfo.environment)
          console.log('  User Found:', data.debugInfo.userFound)
          console.log('  Login Count:', data.debugInfo.loginCount)
          console.log(
            '  Query Results:',
            data.debugInfo.queryResults?.length || 0,
            'records'
          )
          console.log(
            '  Processing Time:',
            data.debugInfo.processingTimeMs,
            'ms'
          )

          if (
            data.debugInfo.queryResults &&
            data.debugInfo.queryResults.length > 0
          ) {
            console.log('\n📅 Recent Login Records:')
            data.debugInfo.queryResults.slice(0, 5).forEach((login, index) => {
              console.log(`  ${index + 1}. ${login.loginAt} (ID: ${login.id})`)
            })
          }
        }

        if (data.lastLoginDate === null || data.lastLoginDate === '') {
          console.log('\n❌ ISSUE FOUND: lastLoginDate is null/empty!')
          console.log('   This suggests either:')
          console.log('   1. No UserLogin records exist for this user')
          console.log(
            '   2. UserLogin records exist but query is not finding them'
          )
          console.log('   3. Date formatting or timezone issues')
        } else {
          console.log('\n✅ lastLoginDate is populated correctly')
        }
      } catch (parseError) {
        console.error('\n❌ Failed to parse JSON response:', parseError.message)
      }
    } else {
      console.error('\n❌ API call failed with status:', response.status)
      console.error('Response:', responseText)
    }
  } catch (error) {
    console.error('\n❌ Network error:', error.message)
    console.error('Full error:', error)
  }
}

// Also create a function to check locally for comparison
async function checkLocalData() {
  try {
    console.log('\n🏠 Checking local environment for comparison...')
    const localUrl = `http://localhost:3000/api/user/loginStreak?userId=${encodeURIComponent(userId)}`

    const response = await fetch(localUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'ProductionDebugScript/1.0',
      },
    })

    if (response.ok) {
      const data = await response.json()
      console.log('✅ Local Response:')
      console.log('  Current Streak:', data.currentStreak)
      console.log('  Last Login Date:', data.lastLoginDate)
      console.log('  Is Active Today:', data.isActiveToday)

      if (data.debugInfo) {
        console.log('  Login Count:', data.debugInfo.loginCount)
      }
    } else {
      console.log('❌ Local server not running or API failed')
    }
  } catch (error) {
    console.log('ℹ️  Local check skipped (server not running)')
  }
}

async function main() {
  await checkProductionData()
  await checkLocalData()

  console.log('\n📋 Next Steps:')
  console.log('1. If lastLoginDate is null in production but works locally:')
  console.log(
    '   - Check if UserLogin records are being created on production sign-ins'
  )
  console.log('   - Verify database connection string differences')
  console.log('   - Check Vercel logs for any auth errors')
  console.log('\n2. If debugInfo shows 0 login records:')
  console.log('   - The issue is UserLogin records are not being created')
  console.log('   - Check the auth.ts event handler in production')
  console.log('\n3. If records exist but lastLoginDate is still null:')
  console.log('   - The issue is in the query or date processing logic')
  console.log('   - Check for user ID format differences between environments')
}

main().catch(console.error)
