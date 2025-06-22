#!/usr/bin/env node

/**
 * Script to test Cloudflare API token and account configuration
 * Usage: node scripts/test-cloudflare-token.js
 */

const https = require('https')

// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' })

const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN

async function testCloudflareConfig() {
  console.log('🔧 Testing Cloudflare Configuration...\n')

  // Check if environment variables are set
  console.log('1️⃣ Environment Variables:')
  console.log(
    `   Account ID: ${CLOUDFLARE_ACCOUNT_ID ? CLOUDFLARE_ACCOUNT_ID.substring(0, 8) + '...' : '❌ NOT SET'}`
  )
  console.log(
    `   API Token: ${CLOUDFLARE_API_TOKEN ? CLOUDFLARE_API_TOKEN.substring(0, 8) + '...' : '❌ NOT SET'}`
  )
  console.log('')

  if (!CLOUDFLARE_ACCOUNT_ID || !CLOUDFLARE_API_TOKEN) {
    console.log('❌ Missing Cloudflare credentials!')
    console.log('   Please update your .env.local file with valid values.')
    process.exit(1)
  }

  // Test 1: Verify API token
  console.log('2️⃣ Testing API Token Validity...')
  try {
    const tokenResponse = await makeRequest(
      'https://api.cloudflare.com/client/v4/user/tokens/verify',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    )

    if (tokenResponse.success) {
      console.log('   ✅ API Token is valid!')
      console.log(`   Token Status: ${tokenResponse.result.status}`)
    } else {
      console.log('   ❌ API Token is invalid!')
      console.log('   Errors:', tokenResponse.errors)
      return false
    }
  } catch (error) {
    console.log('   ❌ Failed to verify token:', error.message)
    return false
  }

  // Test 2: Test Cloudflare Images access
  console.log('\n3️⃣ Testing Cloudflare Images Access...')
  try {
    const imagesUrl = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/images/v1`
    const imagesResponse = await makeRequest(imagesUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    })

    if (imagesResponse.success) {
      console.log('   ✅ Cloudflare Images access is working!')
      console.log(
        `   Current images count: ${imagesResponse.result?.images?.length || 0}`
      )
    } else {
      console.log('   ❌ Cloudflare Images access failed!')
      console.log('   Errors:', imagesResponse.errors)

      if (imagesResponse.errors?.some((err) => err.code === 5403)) {
        console.log(
          '\n   💡 Solution: Your API token needs "Account:Cloudflare Images:Edit" permission'
        )
        console.log(
          '      Go to https://dash.cloudflare.com/profile/api-tokens and create a new token'
        )
      }
      return false
    }
  } catch (error) {
    console.log('   ❌ Failed to access Cloudflare Images:', error.message)
    return false
  }

  console.log(
    '\n🎉 All tests passed! Your Cloudflare configuration is working correctly.'
  )
  return true
}

function makeRequest(url, options) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = ''
      res.on('data', (chunk) => (data += chunk))
      res.on('end', () => {
        try {
          resolve(JSON.parse(data))
        } catch (error) {
          reject(new Error(`Failed to parse response: ${data}`))
        }
      })
    })

    req.on('error', reject)
    req.end()
  })
}

// Run the test
testCloudflareConfig().catch((error) => {
  console.error('❌ Test failed:', error.message)
  process.exit(1)
})
