import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'

// Mock poseService.getPose
const mockPose = {
  id: '6918f02c6acd4db7be385ad7',
  sort_english_name: 'Warrior I',
  english_names: ['Warrior I'],
  description: 'Test pose description',
}

jest.mock('../../../../lib/poseService', () => ({
  getPose: jest.fn(() => Promise.resolve(mockPose)),
}))

// Mock Next.js search params hook
jest.mock('next/navigation', () => ({
  useSearchParams: () => ({
    get: (k: string) => (k === 'id' ? mockPose.id : null),
  }),
}))

import PracticePage from '../../../../app/navigator/asanaPoses/practiceAsanas/page'

describe('practiceAsanas page (query param)', () => {
  beforeEach(() => jest.clearAllMocks())

  it('renders the inline pose detail when ?id is present', async () => {
    render(<PracticePage />)

    await waitFor(() =>
      expect(screen.getByText(/Warrior I/i)).toBeInTheDocument()
    )
    expect(screen.getByText(/Test pose description/i)).toBeInTheDocument()
  })
})
