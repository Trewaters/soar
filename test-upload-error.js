// Quick test script to check the API response format
// Run with: node test-upload-error.js

const testFormData = {
  file: 'dummy-file-data',
  altText: 'Test image',
  userId: 'test-user-id',
}

console.log('Testing upload error response format...')

// Simulate what happens when we get a 503 error with canFallbackToLocal
const mockErrorResponse = {
  error:
    'Cloudflare Images permission denied. Please check your API token permissions.',
  canFallbackToLocal: true,
  details:
    'Your API token needs "Account:Cloudflare Images:Edit" permission. Visit https://dash.cloudflare.com/profile/api-tokens to create a new token with the correct permissions.',
  cloudflareError: {
    status: 403,
    errors: [{ code: 5403, message: 'Permission denied' }],
  },
}

console.log('Mock error response:')
console.log(JSON.stringify(mockErrorResponse, null, 2))

console.log('\nTesting fallback condition:')
console.log('data.canFallbackToLocal:', mockErrorResponse.canFallbackToLocal)
console.log(
  'data.canFallbackToLocal === true:',
  mockErrorResponse.canFallbackToLocal === true
)
console.log(
  'Boolean(data.canFallbackToLocal):',
  Boolean(mockErrorResponse.canFallbackToLocal)
)

// Test the condition that should trigger fallback
const shouldShowFallback =
  mockErrorResponse && mockErrorResponse.canFallbackToLocal === true
console.log('Should show fallback dialog:', shouldShowFallback)
