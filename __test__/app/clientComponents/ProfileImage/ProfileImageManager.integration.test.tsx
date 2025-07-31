import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { UseUser } from '@app/context/UserContext'
import { ProfileImageManager } from '@app/clientComponents/ProfileImage/ProfileImageManager'

jest.mock('@/app/context/UserContext', () => ({
  UseUser: jest.fn(),
}))

describe('ProfileImageManager integration', () => {
  it('updates context on upload, delete, and select', async () => {
    const dispatch = jest.fn()
    const state = {
      userData: {
        profileImages: ['/img1.png'],
        activeProfileImage: '/img1.png',
        image: '/placeholder.png',
      },
    }
    UseUser.mockReturnValue({ state, dispatch })
    render(
      <ProfileImageManager
        images={state.userData.profileImages}
        active={state.userData.activeProfileImage}
        placeholder={state.userData.image}
        onChange={dispatch}
      />
    )
    // Simulate upload
    fireEvent.change(
      screen
        .getByLabelText('Upload profile image')
        .querySelector('input[type="file"]'),
      {
        target: {
          files: [new File(['dummy'], 'test.png', { type: 'image/png' })],
        },
      }
    )
    // Simulate delete
    fireEvent.click(screen.getAllByLabelText('Delete profile image')[0])
    // Simulate select
    fireEvent.click(screen.getAllByAltText('Profile image')[0])
    expect(dispatch).toHaveBeenCalled()
  })
})
