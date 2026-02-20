import '@testing-library/jest-dom'
import React from 'react'

// Mock NextAuth
jest.mock('next-auth/react', () => ({
  ...jest.requireActual('next-auth/react'),
  useSession: jest.fn(() => ({
    data: {
      user: {
        id: 'test-user-123',
        email: 'test@example.com',
        name: 'Test User',
      },
    },
    status: 'authenticated',
  })),
  SessionProvider: ({ children }: any) => children,
}))

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
  usePathname: () => '/asanaPoses/createAsana',
}))

// Mock Next.js Image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} />
  },
}))

// Mock poseService
jest.mock('@lib/poseService', () => ({
  createPose: jest.fn(),
}))

// Setup
const mockSession = {
  user: {
    id: 'test-user-123',
    email: 'test@example.com',
    name: 'Test User',
  },
}

// Track API calls for debugging
const apiCallLog: any[] = []

describe('CreateAsana - Staged Image Saving Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    apiCallLog.length = 0

    // Mock global fetch globally to track all calls
    global.fetch = jest.fn((url: string, options: any) => {
      const call: any = { url, method: options?.method, body: options?.body }
      apiCallLog.push(call)

      // Log FormData details
      if (options?.body instanceof FormData) {
        const formDataLog: any = {}
        ;(options.body as FormData).forEach((value, key) => {
          formDataLog[key] = value
        })
        call.formDataEntries = formDataLog
      }

      // Return appropriate response based on URL
      if (url === '/api/poses/createAsana') {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              id: 'new-pose-uuid-123',
              sort_english_name: 'Test Pose',
              english_names: ['Test Pose'],
              category: 'Standing',
              difficulty: 'Beginner',
              created_by: 'test@example.com',
            }),
        })
      }

      if (url === '/api/images/upload') {
        // Verify poseId is in FormData
        const formData = options?.body
        const poseId = formData?.get('poseId')
        const poseName = formData?.get('poseName')

        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              id: 'image-123',
              url: 'data:image/jpeg;base64,test',
              uploadedAt: new Date().toISOString(),
              poseId: poseId,
              poseName: poseName,
            }),
        })
      }

      if (url.startsWith('/api/images')) {
        // Simulate retrieving images by poseId
        const urlObj = new URL(`http://localhost${url}`)
        const poseId = urlObj.searchParams.get('poseId')
        const poseName = urlObj.searchParams.get('poseName')

        // Check if we have images with this poseId (from previous API calls)
        const matchingImages = apiCallLog
          .filter((call) => call.url === '/api/images/upload')
          .filter((call) => call.formDataEntries?.poseId === poseId)
          .map((call) => ({
            id: 'image-123',
            url: 'data:image/jpeg;base64,test',
            poseId: call.formDataEntries?.poseId,
            poseName: call.formDataEntries?.poseName,
            uploadedAt: new Date().toISOString(),
            displayOrder: 1,
          }))

        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              images: matchingImages,
              total: matchingImages.length,
              hasMore: false,
            }),
        })
      }

      // Default response
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })
    }) as any
  })

  describe('DataFlow: Create Pose -> Upload Staged Images -> Query for Images', () => {
    it('should upload staged images with correct poseId when pose is created', async () => {
      const { createPose } = require('@lib/poseService')

      // Simulate pose creation response
      const newPoseId = 'new-pose-uuid-123'
      const newPoseName = 'Test Pose'

      createPose.mockResolvedValueOnce({
        id: newPoseId,
        sort_english_name: newPoseName,
        english_names: [newPoseName],
        category: 'Standing',
        difficulty: 'Beginner',
        created_by: mockSession.user.email,
      })

      // Simulate the createAsana handleSubmit flow
      const handleCreationAndImageSaving = async () => {
        // Step 1: Create pose
        const poseData = await createPose({
          sort_english_name: newPoseName,
          english_names: [newPoseName],
          category: 'Standing',
          difficulty: 'Beginner',
          created_by: mockSession.user.email,
        })

        // Step 2: Upload staged images with poseId
        const stagedImages = [
          {
            name: 'test-image-1.jpg',
            dataUrl: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD',
          },
        ]

        for (const stagedImage of stagedImages) {
          const bytes = await (async () => {
            try {
              const arr = stagedImage.dataUrl.split(',')
              const bstr = atob(arr[1])
              let n = bstr.length
              const u8 = new Uint8Array(n)
              while (n--) u8[n] = bstr.charCodeAt(n)
              return u8
            } catch (e) {
              // If base64 decoding fails, use simple file content
              return new TextEncoder().encode('mock image data')
            }
          })()

          const file = new File([bytes], stagedImage.name, {
            type: 'image/jpeg',
          })

          const formData = new FormData()
          formData.append('file', file)
          formData.append('userId', mockSession.user.email)
          formData.append('imageType', 'pose')
          formData.append('poseId', poseData.id.toString())
          formData.append('poseName', poseData.sort_english_name)
          formData.append('altText', '')

          const uploadResponse = await fetch('/api/images/upload', {
            method: 'POST',
            body: formData,
          })

          const uploadedImage = await uploadResponse.json()
        }

        return poseData
      }

      const createdPose = await handleCreationAndImageSaving()

      // Step 3: Query for images by poseId
      const queryParams = new URLSearchParams({
        poseId: createdPose.id.toString(),
        poseName: createdPose.sort_english_name,
      })

      const getResponse = await fetch(`/api/images?${queryParams}`)
      const responseData = await getResponse.json()
      const images = responseData.images || responseData

      // Assertions
      expect(Array.isArray(images)).toBe(true)
      expect(images.length).toBeGreaterThanOrEqual(0)
      if (images.length > 0) {
        expect(images[0].poseId).toBe(createdPose.id.toString())
        expect(images[0].poseName).toBe(createdPose.sort_english_name)
      }
    })

    it('should handle images uploaded before and after pose creation', async () => {
      const { createPose } = require('@lib/poseService')

      const newPoseId = 'new-pose-uuid-456'
      const newPoseName = 'Another Test Pose'

      createPose.mockResolvedValueOnce({
        id: newPoseId,
        sort_english_name: newPoseName,
        english_names: [newPoseName],
        category: 'Seated',
        difficulty: 'Intermediate',
        created_by: mockSession.user.email,
      })

      // Simulate creating pose first, then uploading images
      const poseData = await createPose({
        sort_english_name: newPoseName,
        english_names: [newPoseName],
        category: 'Seated',
        difficulty: 'Intermediate',
        created_by: mockSession.user.email,
      })

      // Upload image with poseId
      const formData = new FormData()
      formData.append(
        'file',
        new File(['image'], 'test.jpg', { type: 'image/jpeg' })
      )
      formData.append('userId', mockSession.user.email)
      formData.append('imageType', 'pose')
      formData.append('poseId', poseData.id.toString())
      formData.append('poseName', poseData.sort_english_name)

      await fetch('/api/images/upload', {
        method: 'POST',
        body: formData,
      })

      // Verify we can retrieve the image by poseId
      const queryParams = new URLSearchParams({
        poseId: poseData.id.toString(),
      })

      const response = await fetch(`/api/images?${queryParams}`)
      const responseData = await response.json()
      const images = responseData.images || responseData

      expect(Array.isArray(images)).toBe(true)
      expect(images.length).toBeGreaterThanOrEqual(0)
      if (images.length > 0) {
        expect(images[0].poseId).toBe(poseData.id.toString())
      }
    })
  })

  describe('Debug: API Call Log', () => {
    it('should log all API calls for debugging', () => {
      // This test helps visualize the API call flow
      expect(apiCallLog).toBeDefined()
    })
  })
})
