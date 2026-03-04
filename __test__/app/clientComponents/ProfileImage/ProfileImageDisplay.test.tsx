import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { ProfileImageDisplay } from '@app/clientComponents/ProfileImage/ProfileImageDisplay'

describe('ProfileImageDisplay', () => {
  const images = ['/test/image1.png', '/test/image2.png', '/test/image3.png']
  const placeholder = '/placeholder.png'
  const onSelect = jest.fn()
  const onDelete = jest.fn()

  it('renders placeholder if no images', () => {
    render(
      <ProfileImageDisplay
        images={[]}
        active={null}
        onSelect={onSelect}
        onDelete={onDelete}
        placeholder={placeholder}
      />
    )
    expect(screen.getByAltText('Profile placeholder')).toBeInTheDocument()
  })

  it('renders all images and highlights active', () => {
    render(
      <ProfileImageDisplay
        images={images}
        active={images[1]}
        onSelect={onSelect}
        onDelete={onDelete}
        placeholder={placeholder}
      />
    )
    expect(screen.getAllByAltText('Profile image')).toHaveLength(3)
    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('calls onSelect when image is clicked', () => {
    render(
      <ProfileImageDisplay
        images={images}
        active={images[0]}
        onSelect={onSelect}
        onDelete={onDelete}
        placeholder={placeholder}
      />
    )
    fireEvent.click(screen.getAllByAltText('Profile image')[1])
    expect(onSelect).toHaveBeenCalledWith(images[1])
  })

  it('calls onDelete when delete button is clicked', () => {
    render(
      <ProfileImageDisplay
        images={images}
        active={images[0]}
        onSelect={onSelect}
        onDelete={onDelete}
        placeholder={placeholder}
      />
    )
    fireEvent.click(screen.getAllByLabelText('Delete profile image')[0])
    expect(onDelete).toHaveBeenCalledWith(images[0])
  })
})
