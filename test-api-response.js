// Test script to manually call the upload API and check response format
import { NextRequest } from 'next/server'
import { POST } from '../app/api/images/upload/route'

async function testUploadAPI() {
  console.log('🧪 Testing Upload API Response Format...\n')

  // Create a mock form data
  const formData = new FormData()
  const testFile = new File(['test content'], 'test.jpg', { type: 'image/jpeg' })
  formData.append('file', testFile)
  formData.append('altText', 'Test image')
  formData.append('userId', 'test-user-id')

  // Create a mock request
  const mockRequest = {
    formData: () => Promise.resolve(formData),
    headers: new Headers()
  } as NextRequest

  try {
    const response = await POST(mockRequest)
    const responseBody = await response.json()
    
    console.log('✅ Response Status:', response.status)
    console.log('✅ Response Body:')
    console.log(JSON.stringify(responseBody, null, 2))
    
    console.log('\n🔍 Checking fallback properties:')
    console.log('- canFallbackToLocal:', responseBody.canFallbackToLocal)
    console.log('- error:', responseBody.error)
    console.log('- details:', responseBody.details)
    
    if (responseBody.canFallbackToLocal) {
      console.log('\n✅ API correctly returns fallback flag!')
    } else {
      console.log('\n❌ API does NOT return fallback flag')
    }
    
  } catch (error) {
    console.error('❌ Error testing API:', error)
  }
}

testUploadAPI()
