// Test the second Cloudflare API token from .env.cloudflare
const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || 'YOUR_ACCOUNT_ID_HERE'
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN || 'YOUR_API_TOKEN_HERE'

async function testCloudflareConnection() {
  console.log('Testing Cloudflare API connection with second token...\n')

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
      console.log('✅ Second API Token is valid')
    } else {
      console.log('❌ Second API Token is invalid')
      return
    }
  } catch (error) {
    console.error('❌ Token verification failed:', error)
    return
  }

  console.log('\n2. Testing Cloudflare Images access...')

  // Test 2: Check Cloudflare Images access
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
      console.log('✅ Cloudflare Images access is working with second token')
      console.log(`📊 Total images: ${imagesData.result?.images?.length || 0}`)
    } else {
      console.log('❌ Cloudflare Images access failed with second token')
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
