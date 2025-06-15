#!/usr/bin/env node

/**
 * Login Streak API Test Script
 *
 * This script helps test the loginStreak API endpoint in both development and production.
 *
 * Usage:
 *   node scripts/test-login-streak.js [environment] [userId]
 *
 * Examples:
 *   node scripts/test-login-streak.js dev user123
 *   node scripts/test-login-streak.js prod user123
 *   node scripts/test-login-streak.js https://yourapp.vercel.app user123
 */

const args = process.argv.slice(2)
const environment = args[0] || 'dev'
const userId = args[1]

if (!userId) {
  console.error('❌ Error: userId is required')
  console.log('Usage: node scripts/test-login-streak.js [environment] [userId]')
  console.log('Examples:')
  console.log('  node scripts/test-login-streak.js dev user123')
  console.log('  node scripts/test-login-streak.js prod user123')
  console.log(
    '  node scripts/test-login-streak.js https://yourapp.vercel.app user123'
  )
  process.exit(1)
}

// Determine the base URL
let baseUrl
if (environment === 'dev' || environment === 'development') {
  baseUrl = 'http://localhost:3000'
} else if (environment === 'prod' || environment === 'production') {
  baseUrl = 'https://yourapp.vercel.app' // Replace with your actual Vercel URL
} else if (environment.startsWith('http')) {
  baseUrl = environment
} else {
  console.error(
    '❌ Error: Invalid environment. Use "dev", "prod", or a full URL'
  )
  process.exit(1)
}

const apiUrl = `${baseUrl}/api/user/loginStreak?userId=${encodeURIComponent(userId)}`

console.log('🧪 Testing Login Streak API')
console.log('📍 Environment:', environment)
console.log('🔗 URL:', apiUrl)
console.log('👤 User ID:', userId)
console.log('⏳ Making request...\n')

async function testLoginStreakApi() {
  try {
    const response = await fetch(apiUrl)
    const data = await response.json()

    console.log('📊 Response Status:', response.status)
    console.log('📋 Response Headers:')
    for (const [key, value] of response.headers.entries()) {
      console.log(`  ${key}: ${value}`)
    }
    console.log('\n📄 Response Body:')
    console.log(JSON.stringify(data, null, 2))

    if (response.ok) {
      console.log('\n✅ API call successful!')
      if (data.currentStreak !== undefined) {
        console.log(`🔥 Current Streak: ${data.currentStreak} days`)
        console.log(`🏆 Longest Streak: ${data.longestStreak} days`)
        console.log(`📅 Last Login: ${data.lastLoginDate}`)
        console.log(`📍 Active Today: ${data.isActiveToday}`)
      }
    } else {
      console.log('\n❌ API call failed')
      if (data.error) {
        console.log('🚨 Error:', data.error)
        if (data.details) {
          console.log('ℹ️  Details:', data.details)
        }
      }
    }
  } catch (error) {
    console.error('\n💥 Request failed:', error.message)

    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Troubleshooting:')
      console.log('  - Is the development server running? (npm run dev)')
      console.log('  - Is the correct URL being used?')
    } else if (error.code === 'ENOTFOUND') {
      console.log('\n💡 Troubleshooting:')
      console.log('  - Check the production URL is correct')
      console.log('  - Verify the app is deployed and accessible')
    }
  }
}

// Add fetch polyfill for Node.js < 18
if (typeof fetch === 'undefined') {
  const { default: fetch } = require('node-fetch')
  global.fetch = fetch
}

testLoginStreakApi()
