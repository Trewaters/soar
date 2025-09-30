// Quick Test Function for Asana API
// Run this in the browser console while logged in to test the API directly

async function testAsanaAPI() {
  console.log('🧪 Testing Asana API...')

  try {
    const timestamp = new Date().getTime()
    const response = await fetch(`/api/poses?_t=${timestamp}`, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const asanas = await response.json()

    console.log('✅ API Test Results:')
    console.log(`📊 Total asanas returned: ${asanas.length}`)
    console.log('📝 First 5 asanas:')
    asanas.slice(0, 5).forEach((asana, index) => {
      console.log(
        `  ${index + 1}. ${asana.english_names?.[0] || asana.sort_english_name} (ID: ${asana.id})`
      )
      console.log(`     Created by: ${asana.created_by}`)
      console.log(`     Created on: ${asana.created_on}`)
    })

    // Look for the most recent asana
    const mostRecent = asanas[0]
    if (mostRecent) {
      console.log('🕐 Most recent asana:')
      console.log(
        `   Name: ${mostRecent.english_names?.[0] || mostRecent.sort_english_name}`
      )
      console.log(`   ID: ${mostRecent.id}`)
      console.log(`   Created by: ${mostRecent.created_by}`)
      console.log(`   Created on: ${mostRecent.created_on}`)
    }

    return asanas
  } catch (error) {
    console.error('❌ API Test Failed:', error)
    throw error
  }
}

// Run the test
testAsanaAPI()
