import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

jest.mock('next/navigation', () => ({ useRouter: () => ({ push: jest.fn() }) }))
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({ data: { user: { email: 'me@example.com' } } })),
}))
jest.mock('../../../../lib/poseService', () => ({
  deletePose: jest.fn(),
  updatePose: jest.fn(),
}))

describe('EditPoseDialog Save', () => {
  const basePose: any = {
    id: 'pose-1',
    sort_english_name: 'Tree Pose',
    english_names: [],
    description: 'desc',
    category: '',
    difficulty: '',
    breath_direction_default: '',
    created_by: 'me@example.com',
    poseImages: [
      { id: 'img-1', displayOrder: 1, url: 'http://example.com/1.jpg' },
    ],
  }

  beforeEach(() => {
    jest.clearAllMocks()
    // default fetch to succeed
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
    ) as unknown as typeof global.fetch
  })

  afterEach(() => {
    // @ts-expect-error - cleanup test global
    delete global.fetch
  })

  it('saves changes and calls reorder successfully', async () => {
    const user = userEvent.setup()
    const { updatePose } = require('../../../../lib/poseService')
    updatePose.mockResolvedValue({ id: 'pose-1' })

    const onClose = jest.fn()
    const onSave = jest.fn()

    const Comp =
      require('../../../../app/navigator/asanaPoses/editAsana/EditPoseDialog').default

    render(<Comp open onClose={onClose} pose={basePose} onSave={onSave} />)

    const saveBtn = await screen.findByRole('button', { name: /save changes/i })
    await user.click(saveBtn)

    // updatePose called
    await waitFor(() => expect(updatePose).toHaveBeenCalled())

    // reorder fetch called
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/asana/pose-1/images/reorder',
      expect.objectContaining({ method: 'PUT' })
    )

    // onSave and onClose called
    await waitFor(() => expect(onSave).toHaveBeenCalled())
    expect(onClose).toHaveBeenCalled()
  })

  it('shows error when reorder fails (bad images array)', async () => {
    const user = userEvent.setup()
    const { updatePose } = require('../../../../lib/poseService')
    updatePose.mockResolvedValue({ id: 'pose-1' })

    // mock fetch for reorder to return 400 with error
    global.fetch = jest.fn((url) => {
      if (url && String(url).includes('/images/reorder')) {
        return Promise.resolve({
          ok: false,
          json: () => Promise.resolve({ error: 'Invalid images array' }),
        })
      }
      return Promise.resolve({ ok: true, json: () => Promise.resolve({}) })
    }) as unknown as typeof global.fetch

    const onClose = jest.fn()
    const onSave = jest.fn()

    const Comp =
      require('../../../../app/navigator/asanaPoses/editAsana/EditPoseDialog').default

    render(<Comp open onClose={onClose} pose={basePose} onSave={onSave} />)

    const saveBtn = await screen.findByRole('button', { name: /save changes/i })
    await user.click(saveBtn)

    // updatePose called
    await waitFor(() => expect(updatePose).toHaveBeenCalled())

    // Error message displayed
    const err = await screen.findByText(/invalid images array/i)
    expect(err).toBeInTheDocument()

    // onSave should not have been called (since reorder failed)
    expect(onSave).not.toHaveBeenCalled()
    // onClose should not be called either
    expect(onClose).not.toHaveBeenCalled()
  })
})
