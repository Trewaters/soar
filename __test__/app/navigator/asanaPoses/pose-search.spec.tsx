import '@testing-library/jest-dom'
import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    pathname: '/navigator/asanaPoses/practiceAsanas',
  }),
}))

import PoseSearch from '../../../../app/navigator/asanaPoses/pose-search'

describe('pose-search', () => {
  beforeEach(() => jest.clearAllMocks())

  it('renders search input and accepts typing', async () => {
    const user = userEvent.setup()
    render(<PoseSearch />)

    const input = screen.getByRole('textbox')
    await user.type(input, 'Warrior')

    expect(input).toHaveValue('Warrior')
  })
})
