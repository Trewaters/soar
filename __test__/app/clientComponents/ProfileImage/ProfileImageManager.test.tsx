import React from 'react'
import { render, screen } from '@testing-library/react'
import { ProfileImageManager } from '@app/clientComponents/ProfileImage/ProfileImageManager'

describe('ProfileImageManager', () => {
  it('renders upload and display components', () => {
    render(
      <ProfileImageManager
        images={['/img1.png']}
        active={'/img1.png'}
        placeholder={'/placeholder.png'}
        onChange={jest.fn()}
      />
    )
    expect(screen.getByText('Profile Images')).toBeInTheDocument()
    expect(
      screen.getByText('JPEG/PNG, max 2MB, up to 3 images')
    ).toBeInTheDocument()
  })
})
