import '@testing-library/jest-dom'

jest.unmock('@lib/imageService')

jest.mock('../../lib/errorLogger', () => ({
  logServiceError: jest.fn(),
}))

jest.mock('../../lib/localImageStorage', () => ({
  localImageStorage: {
    storeImage: jest.fn(),
    syncToCloud: jest.fn(),
    getStorageInfo: jest.fn(),
  },
}))

describe('imageService.uploadPoseImage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('returns uploaded image data when upload succeeds', async () => {
    const uploadedAt = '2026-02-19T23:54:30.018Z'
    const responseBody = {
      id: 'img-1',
      url: 'https://example.com/image.jpg',
      uploadedAt,
    }

    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: jest.fn().mockResolvedValue(responseBody),
      text: jest.fn().mockResolvedValue(''),
    } as any)

    const { uploadPoseImage } = await import('@lib/imageService')

    const file = new File(['hello'], 'test.jpg', { type: 'image/jpeg' })
    const result = await uploadPoseImage({
      file,
      userId: 'tester@example.com',
    })

    expect(result).toEqual(responseBody)
  })

  it('throws server error from JSON response when upload fails', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      status: 400,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: jest.fn().mockResolvedValue({ error: 'Bad image format' }),
      text: jest.fn().mockResolvedValue(''),
    } as any)

    const { uploadPoseImage } = await import('@lib/imageService')

    const file = new File(['hello'], 'bad.jpg', { type: 'image/jpeg' })

    await expect(
      uploadPoseImage({
        file,
        userId: 'tester@example.com',
      })
    ).rejects.toThrow('Bad image format')
  })

  it('throws friendly message for plain-text 413 payload-too-large responses', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      status: 413,
      headers: new Headers({ 'content-type': 'text/plain' }),
      json: jest
        .fn()
        .mockRejectedValue(
          new SyntaxError("Unexpected token 'R', \"Request En\"... is not valid JSON")
        ),
      text: jest.fn().mockResolvedValue('Request Entity Too Large'),
    } as any)

    const { uploadPoseImage } = await import('@lib/imageService')

    const file = new File(['hello'], 'large.jpg', { type: 'image/jpeg' })

    await expect(
      uploadPoseImage({
        file,
        userId: 'tester@example.com',
      })
    ).rejects.toThrow(
      'Image file is too large for this upload endpoint. Please choose a smaller image and try again.'
    )
  })
})
