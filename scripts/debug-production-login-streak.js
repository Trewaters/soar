#!/usr/bin/env node

/**
 * Production Login Streak Debug Script
 *
 * This script helps debug login streak issues in production by providing
 * detailed diagnostics and testing multiple scenarios.
 *
 * Usage:
 *   node scripts/debug-production-login-streak.js [productionUrl] [userId]
 *
 * Examples:
 *   node scripts/debug-production-login-streak.js https://yourapp.vercel.app user123
 *   node scripts/debug-production-login-streak.js https://soar-kappa.vercel.app clh4u3p2u0001l708qgxj9y8z
 */

const args = process.argv.slice(2)
const productionUrl = args[0]
const userId = args[1]

if (!productionUrl || !userId) {
  console.error('❌ Error: Both productionUrl and userId are required')
  console.log(
    'Usage: node scripts/debug-production-login-streak.js [productionUrl] [userId]'
  )
  console.log('Examples:')
  console.log(
    '  node scripts/debug-production-login-streak.js https://yourapp.vercel.app user123'
  )
  console.log(
    '  node scripts/debug-production-login-streak.js https://soar-kappa.vercel.app clh4u3p2u0001l708qgxj9y8z'
  )
  process.exit(1)
}

const apiUrl = `${productionUrl}/api/user/loginStreak?userId=${encodeURIComponent(userId)}`

console.log('🔍 Production Login Streak Debug Tool')
console.log('=' * 50)
console.log('🌐 Production URL:', productionUrl)
console.log('👤 User ID:', userId)
console.log('🔗 API URL:', apiUrl)
console.log('🕐 Test Time:', new Date().toISOString())
console.log('')

async function runDiagnostics() {
  console.log('🧪 Running production diagnostics...\n')

  // Test 1: Basic API connectivity
  console.log('📋 Test 1: Basic API Connectivity')
  console.log('-'.repeat(40))
  try {
    const startTime = Date.now()
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Production-Debug-Script/1.0',
      },
    })
    const responseTime = Date.now() - startTime

    console.log(`✅ Response received in ${responseTime}ms`)
    console.log(`📊 Status: ${response.status} ${response.statusText}`)
    console.log('📋 Response Headers:')

    const importantHeaders = [
      'x-request-id',
      'x-environment',
      'x-timestamp',
      'content-type',
      'cache-control',
      'x-vercel-cache',
      'x-vercel-id',
    ]

    importantHeaders.forEach((header) => {
      const value = response.headers.get(header)
      if (value) {
        console.log(`  ${header}: ${value}`)
      }
    })

    const data = await response.json()
    console.log('\n📄 Response Body:')
    console.log(JSON.stringify(data, null, 2))

    if (response.ok) {
      console.log('\n✅ Test 1 PASSED: API is accessible and responding')

      if (data.currentStreak !== undefined) {
        console.log('\n📊 Streak Data Summary:')
        console.log(`  🔥 Current Streak: ${data.currentStreak} days`)
        console.log(`  🏆 Longest Streak: ${data.longestStreak} days`)
        console.log(`  📅 Last Login: ${data.lastLoginDate || 'Never'}`)
        console.log(`  ✨ Active Today: ${data.isActiveToday ? 'Yes' : 'No'}`)

        if (data.debugInfo) {
          console.log('\n🛠️ Debug Information:')
          console.log(JSON.stringify(data.debugInfo, null, 2))
        }
      }
    } else {
      console.log('\n❌ Test 1 FAILED: API returned error')

      if (data.error) {
        console.log(`🚨 Error: ${data.error}`)
      }

      if (data.debugInfo) {
        console.log('\n🛠️ Debug Information:')
        console.log(JSON.stringify(data.debugInfo, null, 2))
      }
    }
  } catch (error) {
    console.log('\n💥 Test 1 FAILED: Network or connection error')
    console.log(`🚨 Error: ${error.message}`)

    if (error.code === 'ENOTFOUND') {
      console.log('\n💡 Troubleshooting suggestions:')
      console.log('  - Check if the production URL is correct')
      console.log('  - Verify the app is deployed and accessible')
      console.log('  - Test the base URL in your browser first')
    }
  }

  console.log('\n' + '='.repeat(60))

  // Test 2: Multiple rapid requests (load testing)
  console.log('\n📋 Test 2: Load Testing (5 concurrent requests)')
  console.log('-'.repeat(40))

  try {
    const requests = Array(5)
      .fill()
      .map((_, index) => {
        return fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': `Production-Debug-Script-${index}/1.0`,
          },
        })
      })

    const startTime = Date.now()
    const responses = await Promise.all(requests)
    const totalTime = Date.now() - startTime

    console.log(`✅ All 5 requests completed in ${totalTime}ms`)

    const results = await Promise.all(
      responses.map(async (response, index) => {
        const data = await response.json()
        return {
          index,
          status: response.status,
          requestId: response.headers.get('x-request-id'),
          success: response.ok,
          hasData: data.currentStreak !== undefined,
        }
      })
    )

    console.log('\n📊 Load Test Results:')
    results.forEach((result) => {
      const status = result.success ? '✅' : '❌'
      console.log(
        `  Request ${result.index + 1}: ${status} Status ${result.status} - Request ID: ${result.requestId}`
      )
    })

    const successCount = results.filter((r) => r.success).length
    console.log(
      `\n📈 Success Rate: ${successCount}/5 (${((successCount / 5) * 100).toFixed(1)}%)`
    )

    if (successCount === 5) {
      console.log('✅ Test 2 PASSED: API handles concurrent requests well')
    } else {
      console.log('⚠️  Test 2 WARNING: Some requests failed under load')
    }
  } catch (error) {
    console.log('\n💥 Test 2 FAILED: Load testing error')
    console.log(`🚨 Error: ${error.message}`)
  }

  console.log('\n' + '='.repeat(60))

  // Test 3: Invalid user ID test
  console.log('\n📋 Test 3: Invalid User ID Handling')
  console.log('-'.repeat(40))

  const invalidUserId = 'invalid-user-id-test'
  const invalidApiUrl = `${productionUrl}/api/user/loginStreak?userId=${encodeURIComponent(invalidUserId)}`

  try {
    const response = await fetch(invalidApiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Production-Debug-Script-Invalid/1.0',
      },
    })

    const data = await response.json()

    console.log(`📊 Status: ${response.status} ${response.statusText}`)
    console.log('📄 Response:', JSON.stringify(data, null, 2))

    if (response.status === 404 && data.error === 'User not found') {
      console.log('✅ Test 3 PASSED: Invalid user ID handled correctly')
    } else {
      console.log('⚠️  Test 3 WARNING: Unexpected response for invalid user ID')
    }
  } catch (error) {
    console.log('\n💥 Test 3 FAILED: Error testing invalid user ID')
    console.log(`🚨 Error: ${error.message}`)
  }

  console.log('\n' + '='.repeat(60))
  console.log('\n🏁 Production diagnostics completed!')
  console.log('\n💡 Next steps:')
  console.log('  1. Review the above test results')
  console.log('  2. Check Vercel function logs for detailed error messages')
  console.log('  3. Verify environment variables in Vercel dashboard')
  console.log('  4. Test with different user IDs if available')
  console.log('  5. Compare with localhost behavior using test-login-streak.js')
}

// Add fetch polyfill for Node.js < 18
if (typeof fetch === 'undefined') {
  const { default: fetch } = require('node-fetch')
  global.fetch = fetch
}

runDiagnostics().catch((error) => {
  console.error('\n💥 Fatal error running diagnostics:', error)
  process.exit(1)
})
