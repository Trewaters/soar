import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { ProfileImageUpload } from '@app/clientComponents/ProfileImage/ProfileImageUpload'

describe('ProfileImageUpload', () => {
  it('renders upload button and caption', () => {
    render(<ProfileImageUpload onUpload={jest.fn()} />)
    expect(screen.getByLabelText('Upload profile image')).toBeInTheDocument()
    expect(screen.getByText(/JPEG\/PNG, max 2MB/)).toBeInTheDocument()
  })

  it('shows error for invalid file type', async () => {
    render(<ProfileImageUpload onUpload={jest.fn()} />)
    // Target the hidden file input directly by its aria-label
    const input = screen.getByLabelText('Upload Image')
    const file = new File(['dummy'], 'test.gif', { type: 'image/gif' })
    fireEvent.change(input, { target: { files: [file] } })
    expect(
      await screen.findByText(/Only JPEG and PNG images are allowed/)
    ).toBeInTheDocument()
  })

  it('shows error for file size > 2MB', async () => {
    render(<ProfileImageUpload onUpload={jest.fn()} />)
    // Target the hidden file input directly by its aria-label
    const input = screen.getByLabelText('Upload Image')
    const file = new File(['a'.repeat(2 * 1024 * 1024 + 1)], 'big.png', {
      type: 'image/png',
    })
    Object.defineProperty(file, 'size', { value: 2 * 1024 * 1024 + 1 })
    fireEvent.change(input, { target: { files: [file] } })
    expect(
      await screen.findByText(/File size must be under 2MB/)
    ).toBeInTheDocument()
  })
})
