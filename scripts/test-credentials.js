#!/usr/bin/env node

/**
 * Test Credentials Account Creation
 *
 * This script tests the credentials-based account creation functionality
 */

const testEmail = 'test-user@example.com'
const testPassword = 'testpassword123'

async function testAccountCreation() {
  try {
    console.log('🧪 Testing Credentials Account Creation')
    console.log('=' * 50)
    console.log(`📧 Test Email: ${testEmail}`)
    console.log(`🔑 Test Password: ${testPassword}`)
    console.log('')

    // Test account creation
    console.log('1️⃣ Testing account creation...')
    const createResponse = await fetch(
      'http://localhost:3001/api/auth/test-credentials',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: testEmail,
          password: testPassword,
          action: 'create',
        }),
      }
    )

    const createResult = await createResponse.json()
    console.log('Create Response:', createResult)

    if (!createResponse.ok) {
      console.error('❌ Account creation failed:', createResult.error)
      return
    }

    console.log('✅ Account created successfully!')
    console.log('')

    // Test password verification
    console.log('2️⃣ Testing password verification...')
    const verifyResponse = await fetch(
      'http://localhost:3001/api/auth/test-credentials',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: testEmail,
          password: testPassword,
          action: 'verify',
        }),
      }
    )

    const verifyResult = await verifyResponse.json()
    console.log('Verify Response:', verifyResult)

    if (verifyResult.passwordValid) {
      console.log('✅ Password verification successful!')
    } else {
      console.log('❌ Password verification failed!')
    }

    console.log('')
    console.log('🎯 Test completed! Account creation should now work.')
  } catch (error) {
    console.error('❌ Test failed:', error.message)
  }
}

console.log('Starting credentials test...')
testAccountCreation().catch(console.error)
