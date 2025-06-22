// Test Cloudflare API credentials
const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || 'YOUR_ACCOUNT_ID_HERE'
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN || 'YOUR_API_TOKEN_HERE'

async function testCloudflareConnection() {
  console.log('Testing Cloudflare API connection...\n')

  // Test 1: Verify API Token
  console.log('1. Testing API Token verification...')
  try {
    const tokenResponse = await fetch(
      'https://api.cloudflare.com/client/v4/user/tokens/verify',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    )

    const tokenData = await tokenResponse.json()
    console.log(
      'Token verification response:',
      JSON.stringify(tokenData, null, 2)
    )

    if (tokenData.success) {
      console.log('✅ API Token is valid')
    } else {
      console.log('❌ API Token is invalid')
      return
    }
  } catch (error) {
    console.error('❌ Token verification failed:', error)
    return
  }

  console.log('\n2. Testing Account access...')

  // Test 2: Check Account access
  try {
    const accountResponse = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    )

    const accountData = await accountResponse.json()
    console.log(
      'Account access response:',
      JSON.stringify(accountData, null, 2)
    )

    if (accountData.success) {
      console.log('✅ Account access is working')
    } else {
      console.log('❌ Account access failed')
    }
  } catch (error) {
    console.error('❌ Account verification failed:', error)
    return
  }

  console.log('\n3. Testing Cloudflare Images access...')

  // Test 3: Check Cloudflare Images access
  try {
    const imagesResponse = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/images/v1`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${CLOUDFLARE_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    )

    const imagesData = await imagesResponse.json()
    console.log('Images access response:', JSON.stringify(imagesData, null, 2))

    if (imagesData.success) {
      console.log('✅ Cloudflare Images access is working')
      console.log(`📊 Total images: ${imagesData.result?.images?.length || 0}`)
    } else {
      console.log('❌ Cloudflare Images access failed')
      if (imagesData.errors) {
        imagesData.errors.forEach((error) => {
          console.log(`   Error ${error.code}: ${error.message}`)
        })
      }
    }
  } catch (error) {
    console.error('❌ Images verification failed:', error)
  }
}

testCloudflareConnection()
