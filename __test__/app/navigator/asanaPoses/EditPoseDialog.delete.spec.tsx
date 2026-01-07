import '@testing-library/jest-dom'
import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

jest.mock('next/navigation', () => ({ useRouter: () => ({ push: jest.fn() }) }))
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({ data: { user: { email: 'me@example.com' } } })),
}))
jest.mock('../../../../lib/poseService', () => ({
  deletePose: jest.fn(),
  updatePose: jest.fn(),
}))

describe('EditPoseDialog Delete', () => {
  const basePose: any = {
    id: 'pose-1',
    sort_english_name: 'Tree Pose',
    english_names: [],
    description: '',
    category: '',
    difficulty: '',
    breath_direction_default: '',
    created_by: 'me@example.com',
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('shows Delete button for creator and calls deletePose on confirm', async () => {
    const user = userEvent.setup()
    const { deletePose } = require('../../../../lib/poseService')
    deletePose.mockResolvedValue({ success: true })

    const onClose = jest.fn()
    const onSave = jest.fn()

    // Confirm dialog needs to be stubbed in JSDOM
    const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true)

    const Comp =
      require('../../../../app/navigator/asanaPoses/editAsana/EditPoseDialog').default

    render(<Comp open onClose={onClose} pose={basePose} onSave={onSave} />)

    const del = await screen.findByRole('button', { name: /delete/i })
    expect(del).toBeInTheDocument()

    await user.click(del)
    expect(deletePose).toHaveBeenCalledWith('pose-1')
    expect(onClose).toHaveBeenCalled()

    confirmSpy.mockRestore()
  })

  it('hides Delete button when user is not creator', async () => {
    const { useSession } = require('next-auth/react') as {
      useSession: jest.Mock
    }
    useSession.mockReturnValue({
      data: { user: { email: 'other@example.com' } },
    })

    const Comp =
      require('../../../../app/navigator/asanaPoses/editAsana/EditPoseDialog').default

    render(<Comp open onClose={jest.fn()} pose={basePose} onSave={jest.fn()} />)
    expect(screen.queryByRole('button', { name: /delete/i })).toBeNull()
  })
})
