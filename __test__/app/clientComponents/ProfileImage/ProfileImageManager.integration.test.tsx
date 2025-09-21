import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { UseUser } from '@app/context/UserContext'
import { ProfileImageManager } from '@app/clientComponents/ProfileImage/ProfileImageManager'

const mockUseUser = UseUser as jest.MockedFunction<typeof UseUser>

jest.mock('@/app/context/UserContext', () => ({
  UseUser: jest.fn(),
}))

describe('ProfileImageManager integration', () => {
  it('updates context on upload, delete, and select', async () => {
    const mockDispatch = jest.fn()
    const mockOnUpload = jest.fn().mockResolvedValue(undefined)
    const mockOnDelete = jest.fn().mockResolvedValue(undefined)
    const mockOnSelect = jest.fn().mockResolvedValue(undefined)

    const state = {
      userData: {
        profileImages: ['/img1.png'],
        activeProfileImage: '/img1.png',
        image: '/placeholder.png',
      } as any,
      userGithubProfile: {} as any,
      userGoogleProfile: {} as any,
    }
    mockUseUser.mockReturnValue({ state, dispatch: mockDispatch })

    render(
      <ProfileImageManager
        images={state.userData.profileImages}
        active={state.userData.activeProfileImage}
        placeholder={state.userData.image}
        onChange={mockDispatch}
        onUpload={mockOnUpload}
        onDelete={mockOnDelete}
        onSelect={mockOnSelect}
        loading={false}
      />
    )

    // Simulate upload
    const fileInput = screen.getByLabelText('Upload Image')
    fireEvent.change(fileInput, {
      target: {
        files: [new File(['dummy'], 'test.png', { type: 'image/png' })],
      },
    })

    // Verify upload handler was called
    expect(mockOnUpload).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'test.png',
        type: 'image/png',
      })
    )

    // Simulate delete
    fireEvent.click(screen.getAllByLabelText('Delete profile image')[0])

    // Verify delete handler was called
    expect(mockOnDelete).toHaveBeenCalledWith('/img1.png')

    // Simulate select
    fireEvent.click(screen.getAllByAltText('Profile image')[0])

    // Verify select handler was called
    expect(mockOnSelect).toHaveBeenCalledWith('/img1.png')
  })
})
